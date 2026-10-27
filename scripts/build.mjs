// build.mjs —— 核心打包、章节分包、内容哈希入口与静态部署目录。
import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const dev = process.argv.includes('--dev');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const result = await build({
  absWorkingDir: root,
  entryPoints: { main: 'src/main.js', style: 'style.css' },
  outdir: 'dist',
  entryNames: 'assets/[name]-[hash]',
  chunkNames: 'assets/chunks/[name]-[hash]',
  bundle: true,
  splitting: true,
  format: 'esm',
  target: 'es2020',
  minify: true,
  charset: 'utf8',
  metafile: true,
});

function builtFile(entryPoint) {
  const found = Object.entries(result.metafile.outputs).find(([, meta]) => meta.entryPoint === entryPoint);
  if (!found) throw new Error(`构建产物缺少入口:${entryPoint}`);
  return path.relative('dist', found[0]).split(path.sep).join('/');
}

const mainFile = builtFile('src/main.js');
const styleFile = builtFile('style.css');
let html = await readFile(path.join(root, 'index.html'), 'utf8');
const replacements = [
  ['href="./style.css"', `href="./${styleFile}"`],
  ['data-app-entry="./src/main.js"', `data-app-entry="./${mainFile}"`],
];
for (const [before, after] of replacements) {
  if (!html.includes(before)) throw new Error(`index.html 缺少构建替换锚点:${before}`);
  html = html.replace(before, after);
}
await writeFile(path.join(dist, 'index.html'), html);
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'manifest.webmanifest'), path.join(dist, 'manifest.webmanifest'));

const chunkFiles = Object.keys(result.metafile.outputs)
  .filter(file => file.includes('/chunks/') && file.endsWith('.js'))
  .map(file => path.relative('dist', file).split(path.sep).join('/'));
const buildAssets = [mainFile, styleFile, ...chunkFiles].map(file => `/${file}`);
const fingerprintedFiles = [
  mainFile, styleFile, ...chunkFiles, 'manifest.webmanifest', 'assets/offline-portrait.svg',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png', 'assets/icons/apple-touch-icon.png',
];
const workerSource = await readFile(path.join(root, 'sw.js'), 'utf8');
const cacheAnchor = "const BUILD_CACHE = '__BUILD_CACHE__';";
const assetAnchor = 'const BUILD_ASSETS = [];';
if (!workerSource.includes(cacheAnchor) || !workerSource.includes(assetAnchor)) {
  throw new Error('sw.js 缺少构建替换锚点');
}
const fingerprint = createHash('sha256').update(html).update(workerSource);
for (const file of fingerprintedFiles) fingerprint.update(await readFile(path.join(dist, file)));
const cacheName = `sanguo-shell-${fingerprint.digest('hex').slice(0, 16)}`;
const worker = workerSource
  .replace(cacheAnchor, `const BUILD_CACHE = '${cacheName}';`)
  .replace(assetAnchor, `const BUILD_ASSETS = ${JSON.stringify(buildAssets)};`);
await writeFile(path.join(dist, 'sw.js'), worker);

// 本地 E2E 的独立席位夹具仍直接引用源码;生产镜像不包含这些开发文件。
if (dev) {
  await cp(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });
  await cp(path.join(root, 'style.css'), path.join(dist, 'style.css'));
  await mkdir(path.join(dist, 'tests'), { recursive: true });
  await cp(path.join(root, 'tests', 'fixtures'), path.join(dist, 'tests', 'fixtures'), { recursive: true });
  if (existsSync(path.join(root, 'runtime.json'))) {
    await cp(path.join(root, 'runtime.json'), path.join(dist, 'runtime.json'));
  }
}

const sizes = [];
for (const file of [mainFile, styleFile]) {
  const content = await readFile(path.join(dist, file));
  sizes.push(`${file} ${(content.length / 1024).toFixed(1)} KiB / gzip ${(gzipSync(content).length / 1024).toFixed(1)} KiB`);
}
console.log(`构建完成:${chunkFiles.length} 个按需 chunk${dev ? ' · 开发夹具已复制' : ''}`);
for (const line of sizes) console.log(`  ${line}`);
