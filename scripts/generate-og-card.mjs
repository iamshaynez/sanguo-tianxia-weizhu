// generate-og-card.mjs —— 用本地武将素材生成 1200×630 分享图;生产构建无需浏览器。
import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'assets', 'og-card-v1.jpg');
const portraits = [
  { file: 'No_037.jpg', name: '刘备', faction: '蜀', className: 'portrait-left' },
  { file: 'No_061.jpg', name: '曹操', faction: '魏', className: 'portrait-center' },
  { file: 'No_065.jpg', name: '孙权', faction: '吴', className: 'portrait-right' },
];
for (const portrait of portraits) {
  const data = await readFile(path.join(root, 'assets', 'portraits', 'san9', portrait.file));
  portrait.src = `data:image/jpeg;base64,${data.toString('base64')}`;
}

const cards = portraits.map(portrait => `
  <figure class="general-card ${portrait.className}">
    <div class="portrait-frame"><img src="${portrait.src}" alt=""></div>
    <figcaption><span>${portrait.faction}</span><b>${portrait.name}</b></figcaption>
  </figure>`).join('');

const html = `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body { font-family: "Songti SC", "STSong", "Noto Serif CJK SC", serif; }
  #card { position: relative; width: 1200px; height: 630px; overflow: hidden; color: #eee3c7; background: radial-gradient(circle at 82% 18%, #34402c88, transparent 35%), linear-gradient(118deg, #182019 0%, #0e140f 55%, #11150f 100%); }
  .landscape, .grain { position: absolute; inset: 0; width: 100%; height: 100%; }
  .grain { opacity: .17; mix-blend-mode: soft-light; }
  .frame { position: absolute; inset: 25px; border: 1px solid #a58b4d55; }
  .frame::before, .frame::after { content: ""; position: absolute; width: 52px; height: 52px; border-color: #c3a663; border-style: solid; opacity: .8; }
  .frame::before { left: -1px; top: -1px; border-width: 2px 0 0 2px; }
  .frame::after { right: -1px; bottom: -1px; border-width: 0 2px 2px 0; }
  .eyebrow { position: absolute; left: 66px; top: 58px; display: flex; align-items: center; gap: 15px; color: #b7a57a; font-size: 15px; letter-spacing: 6px; }
  .eyebrow::before { content: ""; width: 30px; height: 2px; background: #9f382e; }
  .brand { position: absolute; left: 65px; top: 131px; display: flex; align-items: center; gap: 25px; }
  .seal { display: flex; align-items: center; justify-content: center; width: 82px; height: 108px; color: #f0d5a0; background: #92382e; border: 2px solid #bd6850; outline: 1px solid #68271f; outline-offset: -7px; box-shadow: 8px 12px 26px #0006; font: 52px "Kaiti SC", "STKaiti", "KaiTi", serif; transform: rotate(-2deg); }
  h1 { margin: 0; color: #eadbb7; text-shadow: 0 5px 20px #0008; font: 400 63px/1.15 "Kaiti SC", "STKaiti", "KaiTi", serif; letter-spacing: 4px; white-space: nowrap; }
  .english { margin-top: 13px; color: #9f987b; font: 13px Georgia, serif; letter-spacing: 5px; }
  .promise { position: absolute; left: 68px; top: 305px; color: #f0dfb8; font: 38px "Kaiti SC", "STKaiti", "KaiTi", serif; letter-spacing: 5px; }
  .description { position: absolute; left: 69px; top: 372px; color: #b4ad93; font-size: 20px; letter-spacing: 2px; }
  .motto { position: absolute; left: 69px; top: 421px; display: flex; align-items: center; gap: 16px; color: #c8a868; font-size: 17px; letter-spacing: 3px; }
  .motto i { width: 4px; height: 4px; background: #9f382e; transform: rotate(45deg); }
  .portraits { position: absolute; inset: 0; }
  .general-card { position: absolute; margin: 0; padding: 8px 8px 0; overflow: hidden; background: linear-gradient(145deg, #2a2d20, #171c15); border: 1px solid #a88b52; box-shadow: 0 22px 38px #0009, inset 0 0 0 4px #151911; }
  .portrait-left { z-index: 2; left: 735px; top: 241px; width: 158px; transform: rotate(-9deg); }
  .portrait-center { z-index: 4; left: 850px; top: 143px; width: 184px; padding: 9px 9px 0; border-color: #d0af67; box-shadow: 0 28px 50px #000b, 0 0 35px #b8954822, inset 0 0 0 4px #151911; }
  .portrait-right { z-index: 3; left: 991px; top: 241px; width: 158px; transform: rotate(9deg); }
  .portrait-frame { position: relative; overflow: hidden; aspect-ratio: 1; background: radial-gradient(circle at 50% 40%, #625b3d, #252a20 76%); border: 1px solid #6c5c3c; }
  .portrait-frame::after { content: ""; position: absolute; inset: 0; box-shadow: inset 0 -28px 32px #10140f88; }
  .portrait-frame img { width: 100%; height: 100%; object-fit: contain; filter: saturate(.8) sepia(.1) contrast(1.05); }
  .general-card figcaption { display: flex; align-items: center; justify-content: center; gap: 11px; height: 55px; color: #e1c98f; font-family: "Kaiti SC", "STKaiti", "KaiTi", serif; }
  .general-card figcaption span { display: flex; align-items: center; justify-content: center; width: 24px; height: 28px; color: #e6c99a; background: #82352b; font-size: 15px; }
  .general-card figcaption b { font-size: 25px; font-weight: 400; letter-spacing: 3px; }
  .portrait-center figcaption { height: 61px; }
  .portrait-center figcaption b { font-size: 29px; }
  .kingdoms { position: absolute; right: 77px; bottom: 93px; color: #a99b77; font-size: 14px; letter-spacing: 4px; }
  .footer { position: absolute; left: 66px; right: 66px; bottom: 53px; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 17px; border-top: 1px solid #786a464d; }
  .domain { color: #d2c39f; font: 17px Georgia, serif; letter-spacing: 1px; }
  .offline { margin-top: 7px; color: #777d68; font-size: 12px; letter-spacing: 3px; }
  .edition { color: #827b63; font-size: 12px; letter-spacing: 4px; writing-mode: horizontal-tb; }
</style>
<div id="card">
  <svg class="landscape" viewBox="0 0 1200 630" preserveAspectRatio="none" aria-hidden="true">
    <circle cx="938" cy="126" r="100" fill="#d2bd83" opacity=".19"/>
    <circle cx="938" cy="126" r="82" fill="#d2bd83" opacity=".08"/>
    <path d="M0 440L115 345L205 419L330 282L460 432L590 329L710 437L835 322L975 430L1090 334L1200 419V630H0Z" fill="#273026" opacity=".56"/>
    <path d="M0 506L155 395L268 478L410 372L560 500L700 401L835 492L980 390L1100 469L1200 409V630H0Z" fill="#151d15" opacity=".9"/>
    <path d="M0 534Q290 471 530 542T1200 520" fill="none" stroke="#b4b08a" stroke-width="11" opacity=".08"/>
    <path d="M714 271V437M714 282H776L756 313L776 344H714" fill="#78352b" stroke="#746648" stroke-width="3" opacity=".6"/>
    <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="19"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .34 0"/></filter>
    <rect class="grain" width="1200" height="630" filter="url(#paperNoise)"/>
  </svg>
  <div class="frame"></div>
  <div class="eyebrow">残卷 · 英雄记</div>
  <div class="brand">
    <div class="seal">汉</div>
    <div><h1>三国：天下为注</h1><div class="english">HEROES AT THE TABLE</div></div>
  </div>
  <div class="promise">牌可验，史可改。</div>
  <div class="description">三国古风德州扑克战役</div>
  <div class="motto"><span>以牌为刃</span><i></i><span>重写意难平</span></div>
  <div class="portraits">${cards}</div>
  <div class="kingdoms">魏 · 蜀 · 吴　同席一局</div>
  <div class="footer">
    <div><div class="domain">san.xiaowenz.com</div><div class="offline">纯前端 · 加载后即可离线对局</div></div>
    <div class="edition">一卷写尽英雄局</div>
  </div>
</div>
</html>`;

await mkdir(path.dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: output, type: 'jpeg', quality: 93 });
} finally {
  await browser.close();
}
console.log(`分享图已生成:${output} (1200×630 JPEG)`);
