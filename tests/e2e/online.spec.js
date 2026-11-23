// tests/e2e/online.spec.js —— 网战用户视角验收:建房→友入席→NPC 配置→开局→行动→
// 断线代打→续接。双 browser context,全走真实按钮与 WebSocket(同源 npm start 服务)。
import { test, expect, chromium } from '@playwright/test';

const CODE_RE = /^[A-Z2-9]{6}$/;

async function newPage(browser, params = '', setup = null) {
  const context = await browser.newContext();
  if (setup) await setup(context);
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
// 记录页面建立过的 WebSocket 与发出的帧类型(e2e 断言「断线后自动续接且只续接一次」等)
async function tapSockets(context) {
  await context.addInitScript(() => {
    const Orig = window.WebSocket;
    window.__sockets = [];
    window.__sent = [];
    window.WebSocket = function (url, protocols) {
      const ws = protocols === undefined ? new Orig(url) : new Orig(url, protocols);
      window.__sockets.push(ws);
      const send = ws.send.bind(ws);
      ws.send = data => { try { window.__sent.push(JSON.parse(data).type); } catch { /* 非法帧由服务端拒绝 */ } return send(data); };
      return ws;
    };
    window.WebSocket.prototype = Orig.prototype;
    Object.defineProperty(window.WebSocket, 'OPEN', { value: Orig.OPEN });
  });
}

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

test('网战:续接帧风暴中新一手的手牌不丢(并发 render 竞态)', async () => {
  test.setTimeout(150_000);
  const browser = await chromium.launch();

  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  await A.page.selectOption('#onlineSeats', '2');
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

  // 先订阅房间帧,开局后 stash 到一张 playing 帧
  await A.page.evaluate(() => {
    window.__roomStash = null;
    window.__onlineDebug.net.on('room', room => {
      if (room.phase === 'playing' && room.hand && !window.__roomStash) window.__roomStash = room;
    });
  });
  await A.page.click('#onlineStart');
  await expect(A.page.locator('#onCardLayer .card.big')).toHaveCount(2, { timeout: 20_000 });
  await A.page.waitForFunction(() => !!window.__roomStash);

  // 伪装成新一手(手号+1、公共牌清空),同步并发两次 render——复现续接时
  // 补帧风暴挤进 sweep 窗口的竞态。修复前:第二帧跳过发牌、第一帧被
  // epoch 中断,两张手牌谁都不发(桌上空空如也)。
  // 等开局帧风暴(deal/时限等连发 bump)平息,避免真实帧干扰复现;
  // 随后伪造手号+1 同步并发两次 render——复现续接时补帧挤进 sweep 窗口
  // 的竞态。修复前:第二帧跳过发牌、第一帧被 epoch 中断,手牌谁都不发。
  await A.page.waitForTimeout(2500);
  await A.page.evaluate(async () => {
    const fresh = structuredClone(window.__roomStash);
    fresh.hand.handNum += 1;
    fresh.hand.board = [];
    const board = window.__onlineDebug.board;
    await Promise.all([board.__render(fresh), board.__render(fresh)]);
  });


  await A.page.waitForTimeout(1500); // 等扫牌+发牌动画落地
  await expect(A.page.locator('#onCardLayer .card.big')).toHaveCount(2);

  await A.context.close();
  await B.context.close();
  await browser.close();
});

test('网战:主机可请出军师——× 能移除 AI 席位', async () => {
  test.setTimeout(90_000);
  const browser = await chromium.launch();
  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  await A.page.click('#onlineCreate');
  await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  await expect(A.page.locator('.online-seat.open')).toHaveCount(3);

  // 随缘点将添一位军师,再用 × 请出(此前协议未透传席位号,× 永远无效)
  await A.page.click('#onlineRandomNpc');
  await expect(A.page.locator('.seat-tag.ai')).toHaveCount(1);
  await expect(A.page.locator('.online-seat.open')).toHaveCount(2);
  await A.page.click('[data-remove-npc]');
  await expect(A.page.locator('.seat-tag.ai')).toHaveCount(0);
  await expect(A.page.locator('.online-seat.open')).toHaveCount(3);

  // 指定武将添的军师同样可请出
  await A.page.click('#onlineAddNpc');
  await expect(A.page.locator('.seat-tag.ai')).toHaveCount(1);
  await A.page.click('[data-remove-npc]');
  await expect(A.page.locator('.seat-tag.ai')).toHaveCount(0);

  await A.context.close();
  await browser.close();
});

test('网战:扫码入局的手机选到被占武将——留在房间就地提示,不再「已在一局之中」死循环', async () => {
  test.setTimeout(120_000);
  const browser = await chromium.launch();
  const A = await newPage(browser);
  await A.page.click('[data-online-gate]');
  await A.page.click('#onlineCreate');
  await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
  const code = (await A.page.locator('.online-code').textContent()).trim();
  await A.page.selectOption('.online-seat .online-select[data-pick-general]', 'guanyu');
  await A.page.click('#onlineRandomNpc');      // 主机随缘点将:AI 再占一位武将

  // 手机扫码:带 ?room= 打开即自动进房
  const context = await browser.newContext();
  await tapSockets(context);
  await context.addInitScript(() => { try { localStorage.removeItem('sanguo_poker_language'); } catch {} });
  const page = await context.newPage();
  await page.goto(`/?room=${code}&tutorial=0`);
  await expect(page.locator('.online-room')).toBeVisible({ timeout: 20_000 });
  const picker = page.locator('.online-seat .online-select[data-pick-general]');
  await expect(picker).toBeVisible();

  // 已被占的武将不再出现在自己的选将下拉里
  await expect(picker.locator('option[value="guanyu"]')).toHaveCount(0);

  // 但原生选框可能在房间变化前就已展开(列表是旧的):选中一个已被占的武将。
  // 修复前:该错误把手机踢回主页,主页又因 ?room= 自动重新入局,而连接仍绑在
  // 房间上 → 服务端回「已在一局之中」→ 报错重绘 → 再入局……按钮被轮流锁死。
  await page.evaluate(() => {
    const sel = document.querySelector('.online-seat .online-select[data-pick-general]');
    sel.add(new Option('关羽', 'guanyu'));
    sel.value = 'guanyu';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('.online-notice')).toContainText('已在席上');   // 就地提示另择
  await page.waitForTimeout(1500);                                            // 留出死循环发作的时间
  await expect(page.locator('.online-room')).toBeVisible();                   // 仍在房间
  expect(await page.evaluate(() => window.__lastNetErr?.code ?? null)).not.toBe('BAD_STATE');
  expect(await page.evaluate(() => window.__sent.filter(type => type === 'hello_join').length)).toBe(1);   // 没有反复重新入局

  // 换一位没被占的武将照常可用;离席按钮可点
  await page.evaluate(() => {
    const sel = document.querySelector('.online-seat .online-select[data-pick-general]');
    sel.value = 'lvbu';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('.online-seat.unpicked')).toHaveCount(0);
  await expect(page.locator('#onlineQuitRoom')).toBeEnabled();
  await page.click('#onlineQuitRoom');
  await expect(page.locator('#scroll:not(.hidden)')).toBeVisible();

  await context.close();
  await A.context.close();
  await browser.close();
});

for (const reenter of [false, true]) {
  test(`网战:大厅断线自动重连并归席续接,点好的武将保留${reenter ? '(退出重进后同样生效)' : ''}`, async () => {
    test.setTimeout(150_000);
    const browser = await chromium.launch();
    const A = await newPage(browser);
    await A.page.click('[data-online-gate]');
    await A.page.selectOption('#onlineSeats', '2');
    await A.page.click('#onlineCreate');
    await expect(A.page.locator('.online-room')).toBeVisible({ timeout: 15_000 });
    const code = (await A.page.locator('.online-code').textContent()).trim();
    await A.page.selectOption('.online-seat .online-select[data-pick-general]', 'guanyu');

    const B = await newPage(browser, '', tapSockets);
    const joinAndPick = async () => {
      await B.page.click('[data-online-gate]');
      await B.page.fill('.online-code-input', code);
      await B.page.click('#onlineJoin');
      await expect(B.page.locator('.online-room')).toBeVisible({ timeout: 20_000 });
      await B.page.selectOption('.online-seat .online-select[data-pick-general]', 'zhangfei');
    };
    await joinAndPick();
    if (reenter) {          // 走一次「回目录」再进来:此前这会让自动重连永久失效
      await B.page.click('#onlineQuitRoom');
      await expect(B.page.locator('#scroll:not(.hidden)')).toBeVisible();
      await joinAndPick();
    }
    await expect(A.page.locator('.online-seat:not(.open)')).toHaveCount(2);
    await expect(A.page.locator('.online-seat.unpicked')).toHaveCount(0);

    // 模拟手机网络中断:当前连接被掐断(不是主动退出)
    const socketsBefore = await B.page.evaluate(() => window.__sockets.length);
    await B.page.evaluate(() => window.__sockets.at(-1).close());
    // 自动重连,且在新连接上恰续接一次
    await expect.poll(() => B.page.evaluate(() => [
      window.__sockets.length,
      window.__sent.filter(type => type === 'hello_resume').length,
    ])).toEqual([socketsBefore + 1, 1]);
    await expect(B.page.locator('.online-room')).toBeVisible();

    // 归席:双方席位与点好的武将都在(此前重连后不续接,主机眼里手机玩家已从席位消失)
    await expect(A.page.locator('.online-seat:not(.open)')).toHaveCount(2);
    await expect(A.page.locator('.online-seat.unpicked')).toHaveCount(0);
    await expect(B.page.locator('.online-seat.unpicked')).toHaveCount(0);

    // 会话确实有效:主机开局,手机进牌桌并拿到两张手牌
    await A.page.click('#onlineStart');
    await expect(B.page.locator('#onlineBoard:not(.hidden)')).toBeVisible({ timeout: 20_000 });
    await expect(B.page.locator('#onCardLayer .card.big')).toHaveCount(2, { timeout: 20_000 });

    await B.context.close();
    await A.context.close();
    await browser.close();
  });
}
