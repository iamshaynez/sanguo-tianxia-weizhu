// generate-pwa-assets.mjs —— 生成安装用方形图标;素材为项目自身的朱印与山河视觉。
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'assets', 'icons');
await mkdir(output, { recursive: true });
const icons = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180 },
];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const icon of icons) {
    const { size, maskable } = icon;
    const sealWidth = size * (maskable ? .27 : .31);
    const sealHeight = size * (maskable ? .33 : .38);
    const html = `<!doctype html><meta charset="utf-8"><style>
      * { box-sizing: border-box; } html, body { margin: 0; width: ${size}px; height: ${size}px; overflow: hidden; }
      #icon { position: relative; width: ${size}px; height: ${size}px; overflow: hidden; background: radial-gradient(circle at 72% 20%, #39422d, #111810 68%); }
      svg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .frame { position: absolute; inset: ${size * (maskable ? .065 : .042)}px; border: ${Math.max(1, size / 512)}px solid #b89a5b; opacity: .78; }
      .seal { position: absolute; left: 50%; top: 44%; display: flex; align-items: center; justify-content: center; width: ${sealWidth}px; height: ${sealHeight}px; color: #efd6a5; background: #92382e; border: ${Math.max(2, size / 170)}px solid #c16c50; outline: ${Math.max(1, size / 512)}px solid #68271f; outline-offset: -${size * .018}px; box-shadow: ${size * .018}px ${size * .025}px ${size * .07}px #0008; font: ${size * (maskable ? .24 : .28)}px "Kaiti SC", "STKaiti", "KaiTi", serif; transform: translate(-50%, -50%) rotate(-3deg); }
      .title { position: absolute; left: 0; right: 0; bottom: ${size * (maskable ? .16 : .105)}px; color: #d6bd82; text-align: center; font: ${size * (maskable ? .052 : .06)}px "Kaiti SC", "STKaiti", "KaiTi", serif; letter-spacing: ${size * .009}px; }
    </style>
    <div id="icon">
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="177" cy="55" r="42" fill="#d2bd83" opacity=".16"/>
        <path d="M0 175L44 119L79 156L119 96L161 153L198 113L240 157V240H0Z" fill="#293328" opacity=".64"/>
        <path d="M0 202L58 151L101 185L151 139L199 184L240 151V240H0Z" fill="#111a12" opacity=".92"/>
        <path d="M0 209Q77 182 137 207T240 199" fill="none" stroke="#b4b08a" stroke-width="5" opacity=".1"/>
      </svg>
      <div class="frame"></div><div class="seal">汉</div><div class="title">天下为注</div>
    </div>`;
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(output, icon.file), type: 'png' });
  }
} finally {
  await browser.close();
}
console.log(`PWA 图标已生成:${icons.map(icon => `${icon.file}(${icon.size}x${icon.size})`).join('、')}`);
