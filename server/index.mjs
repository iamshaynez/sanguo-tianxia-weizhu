// index.mjs —— 服务入口:静态托管 dist(与单人模式同一份构建产物)+ 同源 /ws 网关。
// 单人模式不依赖本进程:dist 仍是纯静态,任何静态服务器都能跑。
import http from 'node:http';
import { createReadStream, existsSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RoomStore } from './rooms.js';
import { attachGateway } from './gateway.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(root, process.env.DIST_DIR || '../dist');
const DATA_FILE = process.env.ONLINE_DATA ? path.resolve(root, process.env.ONLINE_DATA) : null;
const PORT = Number(process.env.PORT || 8619);
const HOST = process.env.HOST || '0.0.0.0';
const ORIGINS = (process.env.ORIGIN || '').split(',').map(v => v.trim()).filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2',
};

// 启动即登记版本信息(nginx 方案的 entrypoint 职责并入此处)
try {
  if (!existsSync(path.join(DIST, 'runtime.json')) || process.env.APP_VERSION) {
    writeFileSync(path.join(DIST, 'runtime.json'), JSON.stringify({
      version: process.env.APP_VERSION || 'dev',
      commit: process.env.APP_COMMIT || 'unknown',
      startedAt: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    }));
  }
} catch { /* dist 只读时跳过,页面有兜底显示 */ }

function serveFile(res, file, cache) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'content-type': MIME[ext] || 'application/octet-stream',
    'cache-control': cache,
    'x-content-type-options': 'nosniff',
  });
  createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('ok');
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  let file = path.join(DIST, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    // 深链回退:未知无后缀路径回 index.html;资源缺失直接 404
    if (!path.extname(pathname)) file = path.join(DIST, 'index.html');
    else { res.writeHead(404, { 'content-type': 'text/plain' }).end('not found'); return; }
  }
  const base = path.basename(file);
  const immutable = pathname.startsWith('/assets/') || pathname.startsWith('/icons/');
  const noStore = base === 'index.html' || base === 'sw.js' || base === 'runtime.json' || base === 'manifest.webmanifest' || pathname === '/';
  serveFile(res, file, noStore ? 'no-store' : immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
});

const store = new RoomStore({ dataFile: DATA_FILE });
await store.boot();
const gateway = attachGateway(server, store, {
  allowedOrigins: ORIGINS,
  logger: console,
});
// 房间状态变更经 touch 到 store,store 同时负责快照与广播
store.broadcaster = room => gateway.broadcast(room);

server.listen(PORT, HOST, () => {
  console.log(`服务已启动 http://localhost:${PORT}/ · dist=${DIST} · 快照=${DATA_FILE || '关闭(仅内存)'}`);
});

async function shutdown() {
  console.log('正在收桌…');
  gateway.close();
  await store.close();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
