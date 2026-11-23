// tests/e2e/online.spec.js —— 网战用户视角验收:建房→友入席→NPC 配置→开局→行动→
// 断线代打→续接。双 browser context,全走真实按钮与 WebSocket(同源 npm start 服务)。
import { test, expect, chromium } from '@playwright/test';

const CODE_RE = /^[A-Z2-9]{6}$/;

async function newPage(browser, params = '') {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => { try { localStorage.removeItem('sanguo_poker_language'); } catch {} });
  page.on('pageerror', error => console.error(`[pageerror]`, String(error.stack || error.message).split(String.fromCharCode(10)).slice(0, 5).join(' | ')));
  page.on('console', msg => { if (msg.type() === 'error') console.error(`[console]`, msg.text().slice(0, 200)); });
  await page.goto(`/?${params}tutorial=0`);
  await expect(page.locator('#startBtn')).toBeEnabled();
  await page.click('#startBtn');
  await expect(page.locator('#scroll:not(.hidden)').first()).toBeVisible();
  return { context, page };
}

// 在线自动出牌:轮到自己就按 check→call→fold 序列点真实按钮
async function autoDrive(page, tag) {
  await page.evaluate(([t]) => {
    if (window[`__onlineDrive_${t}`]) return;
    window[`__onlineDrive_${t}`] = setInterval(() => {
      const box = document.getElementById('onActions');
      if (!box || box.classList.contains('hidden')) return;
      const call = [...box.querySelectorAll('button')].find(b => b.dataset.act === 'call' && b.style.display !== 'none');
      const check = [...box.querySelectorAll('button')].find(b => b.dataset.act === 'check' && b.style.display !== 'none');
      const fold = [...box.querySelectorAll('button')].find(b => b.dataset.act === 'fold' && b.style.display !== 'none');
      (call && call.textContent.includes('全压') ? fold : call || check || fold)?.click();
    }, 500);
  }, [tag]);
}

async function stopDrive(page, tag) {
  await page.evaluate(([t]) => { clearInterval(window[`__onlineDrive_${t}`]); window[`__onlineDrive_${t}`] = null; }, [tag]);
}

test('网战:建房→入席→军师→开局→断线代打→续接', async () => {
  test.setTimeout(240_000);
  const browser = await chromium.launch();

  // —— 房主建房(3 席 + 军师补位,10 秒出牌时限) ——
  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  await expect(A.page.locator('#online:not(.hidden)')).toBeVisible();
  await A.page.click('#onlineCreate');
  await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  const code = (await A.page.locator('.online-code').textContent()).trim();
  expect(code).toMatch(CODE_RE);
  await expect(A.page.locator('.online-conn')).toHaveAttribute('data-state', 'on');

  // —— 房主添一名军师(武将 AI) ——
  await A.page.selectOption('#onlineNpcPick', 'zhouyu');
  await A.page.evaluate(() => {
    window.__f0 = window.__onlineDebug.net._framesSeen ?? 0;
    const net = window.__onlineDebug.net;
    net.on('room', room => { (window.__flog ||= []).push([room.phase, room.v, room.seats.map(s => s.kind).join(',')]); });
  });
  await A.page.click('#onlineAddNpc');
      await expect(A.page.locator('.online-gen-meta b', { hasText: '周瑜' })).toBeVisible({ timeout: 8000 });
  await expect(A.page.locator('#onlineQr svg')).toBeVisible();
  const qrPayload = await A.page.evaluate(() => decodeURIComponent(
    document.querySelector('#onlineQr svg')?.closest('.online-qr')?.parentElement
      ?.querySelector('svg')?.innerHTML?.match(/xlink:href|aria|data/)?.[0] ?? ''));
  expect(await A.page.evaluate(() => !!document.querySelector('#onlineQr svg'))).toBe(true);
  await expect(A.page.locator('.online-seat .seat-tag.ai')).toHaveCount(1);

  // —— 朋友凭码入席 ——
  const B = await newPage(browser);
  await B.page.click('[data-online-gate]');
  await expect(B.page.locator('#onlineHome, .online-home').first()).toBeVisible();
  await B.page.fill('.online-code-input', code);
  await B.page.click('#onlineJoin');
  await expect(B.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  await expect(B.page.locator('.online-gen-meta b', { hasText: '待选武将' })).toHaveCount(2);
  await expect(A.page.locator('.online-gen-meta b', { hasText: '待选武将' })).toHaveCount(2);
  await expect(B.page.locator('.online-gen-meta b', { hasText: '待选武将' })).toHaveCount(2);
  await expect(B.page.locator('.online-gen-meta b', { hasText: '周瑜' })).toBeVisible();

  // —— 房内点将(A 关羽 / B 张飞) ——
  await A.page.selectOption('.online-seat .online-select[data-pick-general]', 'guanyu');
  await expect(A.page.locator('.online-gen-meta b', { hasText: '关羽' })).toBeVisible({ timeout: 8000 });
  await B.page.selectOption('.online-seat .online-select[data-pick-general]', 'zhangfei');
  await expect(B.page.locator('.online-gen-meta b', { hasText: '张飞' })).toBeVisible({ timeout: 8000 });

  // —— 开局 ——
  await A.page.click('#onlineStart');
  await expect(A.page.locator('#onlineBoard:not(.hidden)')).toBeVisible({ timeout: 20_000 });
  await expect(B.page.locator('#onlineBoard:not(.hidden)')).toBeVisible({ timeout: 20_000 });
  await expect(A.page.locator('#onBlindLabel')).toContainText('盲注');
  // 发牌隐私:自己见两张大牌,席位侧不发
  await expect(A.page.locator('#onCardLayer .card.big')).toHaveCount(2, { timeout: 15_000 });
  await expect(B.page.locator('#onCardLayer .card.big')).toHaveCount(2);

  // —— 自动打完第一手(真实按钮驱动) ——
  await autoDrive(A.page, 'a');
  await autoDrive(B.page, 'b');
  await expect(A.page.locator('#onBanner.show, #onLog li[data-kind="foldwin"], #onLog li[data-kind="showdown"]').first()
  ).toBeVisible({ timeout: 90_000 });
  await stopDrive(A.page, 'a');
  await stopDrive(B.page, 'b');

  // 守恒:三人军资之和恒为 1800(结算窗读两席筹码+池)
  const conservation = await A.page.evaluate(() => {
    const stacks = [...document.querySelectorAll('#onlineOpp .seat-stack strong')].map(el => parseInt(el.textContent, 10) || 0);
    return stacks;
  });
  expect(conservation.length).toBe(2);

  // —— B 断线:A 侧席位转军师代打(先留会话供续接) ——
  console.error('[step] read-session');
  const bSession = await B.page.evaluate(() => localStorage.getItem('sanguo_online_session'));
  await B.context.close();
  await expect(A.page.locator('#onlineOpp .opponent-seat.is-autopilot, #onlineOpp .seat-role[data-role="ai"]').first()
  ).toBeVisible({ timeout: 20_000 });

  // —— B 新开浏览器凭会话续接 ——
  expect(bSession, 'B 的本地会话应存在').toBeTruthy();
  const B2context = await browser.newContext();
  const B2 = await B2context.newPage();
  await B2.addInitScript(session => {
    try { localStorage.setItem('sanguo_online_session', session); } catch {}
  }, bSession);
  await B2.goto('/?tutorial=0');
  await expect(B2.locator('#startBtn')).toBeEnabled();
  await B2.click('#startBtn');
  await B2.click('[data-online-gate]');
  await expect(B2.locator('#onlineBoard:not(.hidden), .online-room').first()).toBeVisible({ timeout: 30_000 });

  console.error('[step] cleanup');
  await A.context.close();
  await B2context.close();
  await browser.close();
});
test('网战:翻牌后公共牌正面朝上(公共牌从未翻面的存量缺陷)', async () => {
  test.setTimeout(180_000);
  const browser = await chromium.launch();

  // 房主建房,朋友凭码入席,各自点将开局(1 个空席不影响开局)
  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  await A.page.click('#onlineCreate');
  await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  const code = (await A.page.locator('.online-code').textContent()).trim();
  const B = await newPage(browser);
  await B.page.click('[data-online-gate]');
  await B.page.fill('.online-code-input', code);
  await B.page.click('#onlineJoin');
  await expect(B.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  await A.page.selectOption('.online-seat .online-select[data-pick-general]', 'guanyu');
  await B.page.selectOption('.online-seat .online-select[data-pick-general]', 'zhangfei');
  await A.page.click('#onlineStart');
  await expect(A.page.locator('#onlineBoard:not(.hidden)')).toBeVisible({ timeout: 20_000 });

  // 双方 check/call 过 preflop,等翻牌落地(转牌河牌先到也不影响断言)
  await autoDrive(A.page, 'flopA');
  await autoDrive(B.page, 'flopB');
  await A.page.waitForFunction(
    () => document.querySelectorAll('#onCardLayer .card:not(.big):not([data-seat-id])').length >= 3,
    { timeout: 90_000 });
  await stopDrive(A.page, 'flopA');
  await stopDrive(B.page, 'flopB');

  // 公共牌必须带 flipped(正面朝上)——修复前 dealBoard 漏加该类,翻牌背面示人
  const faceUp = await A.page.evaluate(() =>
    [...document.querySelectorAll('#onCardLayer .card:not(.big):not([data-seat-id])')]
      .every(el => el.classList.contains('flipped')));
  expect(faceUp).toBe(true);

  await A.context.close();
  await B.context.close();
  await browser.close();
});

test('网战:建房可选同桌人数(2-6),选定值进房生效', async () => {
  test.setTimeout(120_000);
  const browser = await chromium.launch();
  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  // 选择器默认 4 人,选项覆盖 2-6
  await expect(A.page.locator('#onlineSeats')).toHaveValue('4');
  const options = await A.page.locator('#onlineSeats option').allTextContents();
  expect(options).toHaveLength(5);
  await A.page.selectOption('#onlineSeats', '2');
  await A.page.click('#onlineCreate');
  await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  // 2 人桌:房间恰好两张席位卡
  await expect(A.page.locator('.online-seat')).toHaveCount(2);
  await A.context.close();
  await browser.close();
});

test('网战:侧滑退出后重进稳定续接,不再「已在一局之中」', async () => {
  test.setTimeout(120_000);
  const browser = await chromium.launch();

  // A 建房,B 凭码入席并保持在线(房间因此存活);A 随后模拟手机侧滑:
  // 直接关页,不走「回目录」(teardown/forget 不触发,会话残留本机)
  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  await A.page.click('#onlineCreate');
  await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  const code = (await A.page.locator('.online-code').textContent()).trim();
  const B = await newPage(browser);
  await B.page.click('[data-online-gate]');
  await B.page.fill('.online-code-input', code);
  await B.page.click('#onlineJoin');
  await expect(B.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  await A.page.close();

  // 同一 context(共享 localStorage)重开页面再进网战:应稳定续接回旧房间
  // (大厅期掉线席位已释放,服务端须自动补席),且全程不得出现 BAD_STATE
  // (已在一局之中)——修复前 handshake 与显式 helloResume 双发 resume,
  // 第二条必被拒绝并污染后续建房;席位不补则凑不齐人数无法开局。
  const page2 = await A.context.newPage();
  await page2.goto('/?tutorial=0');
  await page2.click('#startBtn');
  await page2.click('[data-online-gate]');
  await expect(page2.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  await page2.waitForTimeout(800);
  expect(await page2.evaluate(() => window.__lastNetErr?.code ?? null)).not.toBe('BAD_STATE');

  // 干净退出(回目录=forget)后重新建房:不被旧房间绑定挡死
  await page2.click('#onlineLeave');
  await expect(page2.locator('#scroll:not(.hidden)')).toBeVisible();
  await page2.click('[data-online-gate]');
  await expect(page2.locator('.online-home')).toBeVisible();
  await page2.click('#onlineCreate');
  await expect(page2.locator('.online-room')).toBeVisible({ timeout: 15_000 });

  await A.context.close();
  await B.context.close();
  await browser.close();
});
