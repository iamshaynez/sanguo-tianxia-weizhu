// tests/online/run.mjs —— 在线服务端集成测试(真实子进程 + 真实 ws 客户端)。
// 覆盖:建房/加入/NPC/开局/下注/幂等/隐私/守恒/验牌/断线代打/续接/越权/快照恢复。
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import WebSocket from 'ws';

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const PORT = Number(process.env.TEST_PORT || 8641);
const WS_URL = `ws://127.0.0.1:${PORT}/ws`;
const dataDir = mkdtempSync(path.join(tmpdir(), 'sanguo-online-test-'));
const dataFile = path.join(dataDir, 'rooms.json');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let passed = 0;
const failures = [];
const kids = new Set();
process.on('exit', () => { for (const kid of kids) { try { kid.kill('SIGKILL'); } catch {} } });
function check(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (error) { failures.push({ name, error }); console.error(`  ✗ ${name}: ${error.message}`); }
}

function makeClient(label) {
  const state = { label, ws: null, playerId: null, token: null, code: null, inbox: [], waiters: [], closed: false };
  const unwrap = msg => (msg.type === 'room' ? msg.room : msg);
  const client = {
    state,
    open: () => new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);
      state.ws = ws;
      ws.on('open', resolve);
      ws.on('error', reject);
      ws.on('message', data => {
        const msg = JSON.parse(data.toString());
        state.inbox.push(msg);
        for (let i = state.waiters.length - 1; i >= 0; i--) {
          const waiter = state.waiters[i];
          if (waiter.match(msg)) { state.waiters.splice(i, 1); waiter.resolve(msg); }
        }
      });
      ws.on('close', () => { state.closed = true; });
    }),
    send: payload => {
      if (!state.ws || state.ws.readyState !== WebSocket.OPEN) throw new Error(`${label} 已断线`);
      state.ws.send(JSON.stringify(payload));
    },
    waitFor: (type, predicate = () => true, timeoutMs = 15_000) => new Promise((resolve, reject) => {
      const hit = state.inbox.find(msg => msg.type === type && predicate(unwrap(msg)));
      if (hit) return resolve(hit);
      const timer = setTimeout(() => {
        const dump = process.env.DUMP ? state.inbox.slice(-3).map(msg => JSON.stringify(msg).slice(0, 500)).join('\n---\n') : '';
        const recent = state.inbox.slice(-6).map(msg => msg.type + (msg.code ? `:${msg.code}` : ''));
        reject(new Error(`${label} 等待 ${type} 超时 | 最近帧: ${recent.join(', ')}${dump ? `\nDUMP:\n${dump}` : ''}`));
      }, timeoutMs);
      state.waiters.push({
        match: msg => msg.type === type && predicate(unwrap(msg)),
        resolve: msg => { clearTimeout(timer); resolve(msg); },
      });
    }),
    room: () => [...state.inbox].reverse().find(msg => msg.type === 'room')?.room || null,
    reset: () => { state.inbox.length = 0; },
    close: () => new Promise(resolve => {
      if (!state.ws || state.closed) return resolve();
      state.ws.on('close', resolve);
      state.ws.close();
    }),
  };
  return client;
}

const totalStack = room => room.seats.reduce((sum, seat) => sum + seat.stack + (seat.committed || 0), 0);
const expectedTotal = room => room.seats.filter(seat => seat.kind !== 'open').length * room.config.stack;

function startServer() {
  const child = spawn('node', [path.join(root, 'server', 'index.mjs')], {
    env: { ...process.env, PORT: String(PORT), DIST_DIR: path.join(root, 'dist'), ONLINE_DATA: dataFile, APP_VERSION: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  kids.add(child);
  child.stdout.on('data', chunk => process.stdout.write(`    [server] ${chunk}`));
  child.stderr.on('data', chunk => process.stdout.write(`    [server!] ${chunk}`));
  return child;
}
const stopServer = child => new Promise(resolve => {
  if (child.exitCode !== null || child.signalCode) return resolve();
  child.on('exit', resolve);
  child.kill('SIGTERM');
  setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 3000);
});

async function roomOfTwo({ turnMs = 4000 } = {}) {
  const a = makeClient('A');
  const b = makeClient('B');
  await a.open();
  a.send({ type: 'hello_create', config: { seats: 2, stack: 1000, blindsIdx: 0, escalate: 4, turnMs } });
  const wa = await a.waitFor('welcome');
  a.state.playerId = wa.playerId;
  a.state.token = wa.token;
  a.state.code = wa.code;
  await a.waitFor('room', room => room.phase === 'lobby');
  await b.open();
  b.send({ type: 'hello_join', code: a.state.code });
  const wb = await b.waitFor('welcome');
  b.state.playerId = wb.playerId;
  b.state.token = wb.token;
  b.state.code = wb.code;
  await b.waitFor('room', room => room.seats.filter(seat => seat.kind !== 'open').length === 2);
  a.reset();
  b.reset();
  // 点将后置:入席无将,开局前各自点将(先验证未点将被拒)
  a.send({ type: 'room_action', actionId: 'gate-1', kind: 'start_game' });
  const gateErr = await a.waitFor('error', error => error.code === 'NEED_GENERAL', 8000);
  a.state.lastGate = gateErr.code;
  a.send({ type: 'room_action', actionId: 'genx-a1', kind: 'set_general', genId: 'guanyu' });
  await a.waitFor('ack', ack => ack.actionId === 'genx-a1');
  b.send({ type: 'room_action', actionId: 'genx-b1', kind: 'set_general', genId: 'zhangfei' });
  await b.waitFor('ack', ack => ack.actionId === 'genx-b1');
  a.send({ type: 'room_action', actionId: 'start-1', kind: 'start_game' });
  await a.waitFor('ack', ack => ack.actionId === 'start-1');
  await Promise.all([
    a.waitFor('room', room => room.phase === 'playing'),
    b.waitFor('room', room => room.phase === 'playing'),
  ]);
  return { a, b };
}

// 自动出牌:轮到就弃牌(不触筹码流动,只推进局)。kind 序列 check→call→fold 视 toCall 而定。
function autoDrive(client, tag) {
  const timer = setInterval(() => {
    const room = client.room();
    const you = room?.you;
    const hand = room?.hand;
    if (!room || !hand || !you || you.seatIndex < 0) return;
    if (hand.actor !== `s${you.seatIndex}`) return;
    const kind = hand.toCall > 0 ? 'fold' : 'check';
    client.send({ type: 'poker_action', actionId: `${tag}-${Date.now()}`, kind });
  }, 350);
  return () => clearInterval(timer);
}

console.log('== 在线服务端集成测试 ==');
const server = startServer();
try {
  await sleep(900);

  // [1] 建房 → 加入 → 开局
  console.log('[1] 建房 → 加入 → 开局');
  const { a, b } = await roomOfTwo();
  check('双方进入 playing,双人在席', () => {
    const room = a.room();
    assert.equal(room.phase, 'playing');
    assert.equal(room.seats.filter(seat => seat.kind === 'human').length, 2);
  });
  check('发牌隐私:只下发自己的底牌', () => {
    const va = a.room();
    const vb = b.room();
    assert.equal(va.hand.hole.length, 2, 'A 见两张');
    assert.equal(vb.hand.hole.length, 2, 'B 见两张');
    assert.equal(va.seats[1].hole, null, 'A 不见 B 的牌');
    assert.equal(vb.seats[0].hole, null, 'B 不见 A 的牌');
    assert.equal(va.hand.pot, 30, '盲注 10+20 入池');
  });
  check('入席无将、开局前点将生效', () => {
    const room = a.room();
    assert.equal(room.seats[0].genId, 'guanyu');
    assert.equal(room.seats[1].genId, 'zhangfei');
    assert.equal(a.state.lastGate, 'NEED_GENERAL', '未点将 start 被拒');
  });
  check('庄位/盲注角色齐备', () => {
    const roles = a.room().seats.map(seat => seat.roles.join(','));
    assert.ok(roles.some(role => role.includes('button')));
    assert.ok(roles.some(role => role.includes('sb')));
    assert.ok(roles.some(role => role.includes('bb')));
  });

  // [2] 全程审计:守恒 + 隐私 + 幂等
  console.log('[2] 下注/幂等/隐私/守恒/验牌');
  let conservationOk = true;
  let privacyOk = true;
  const audit = msg => {
    const room = msg.type === 'room' ? msg.room : null;
    if (!room) return;
    if (!room.lastHand && room.phase === 'playing' && totalStack(room) !== expectedTotal(room)) {
      conservationOk = false;
      console.error('    守恒破坏:', totalStack(room), '期望', expectedTotal(room),
        JSON.stringify(room.seats.map(seat => [seat.stack, seat.committed])));
    }
    const mine = room.you?.seatIndex;
    if (mine != null && mine >= 0 && !room.lastHand) {
      for (const seat of room.seats) {
        if (seat.index !== mine && seat.hole) privacyOk = false;
      }
    }
  };
  a.state.ws.on('message', raw => audit(JSON.parse(raw.toString())));
  b.state.ws.on('message', raw => audit(JSON.parse(raw.toString())));

  // 幂等探针:等 A 的行动窗口,重放 actionId
  await a.waitFor('room', room => room.hand && room.hand.actor === `s${room.you.seatIndex}`, 20_000);
  await sleep(400);
  const stackBefore = totalStack(a.room());
  const dupKind = a.room().hand.toCall > 0 ? 'fold' : 'check';
  a.send({ type: 'poker_action', actionId: 'dupx-1', kind: dupKind });
  await a.waitFor('ack', ack => ack.actionId === 'dupx-1');
  a.send({ type: 'poker_action', actionId: 'dupx-1', kind: dupKind });
  await a.waitFor('ack', ack => ack.actionId === 'dupx-1');
  check('重放 actionId 不重复执行', () => {
    assert.equal(totalStack(a.room()), stackBefore, '重放后总额不变');
  });

  const stopA = autoDrive(a, 'a');
  const stopB = autoDrive(b, 'b');
  const endMsg = await a.waitFor('room', room => !!room.lastHand, 60_000);
  stopA();
  stopB();
  check('一手打完有结算', () => {
    const last = endMsg.room.lastHand;
    assert.ok(last.kind === 'showdown' || last.kind === 'foldwin');
    assert.equal(last.deck.length, 52);
    assert.ok(new Set(last.deck).size === 52, '52 张无重复');
    assert.ok(last.seed.includes('#'));
  });
  if (endMsg.room.lastHand.kind === 'showdown') {
    check('摊牌亮牌含牌型与最佳五张', () => {
      for (const reveal of endMsg.room.lastHand.reveals) {
        assert.ok(Number.isInteger(reveal.cat));
        assert.equal(reveal.best5.length, 5);
      }
    });
  }
  check('全程筹码守恒', () => assert.ok(conservationOk));
  check('全程暗牌隐私(foldwin 也不亮)', () => assert.ok(privacyOk));

  // 轮询验牌:发牌进行中服务端按规拒绝(BAD_STATE),直到收池间隙放行
  let deckMsg = null;
  for (let attempt = 0; attempt < 24 && !deckMsg; attempt++) {
    a.reset();
    a.send({ type: 'verify_deck' });
    const reply = await a.waitFor('deck', () => true, 8000).catch(() => null);
    const err = a.state.inbox.find(msg => msg.type === 'error');
    if (reply) deckMsg = reply;
    else await sleep(900);
    void err;
  }
  check('验牌:种子带手号,52 张有序', () => {
    assert.ok(deckMsg.seed.includes('#'));
    assert.equal(deckMsg.deck.length, 52);
  });

  // [3] 断线代打 + 续接
  console.log('[3] 断线代打与续接');
  const stopA2 = autoDrive(a, 'a2');
  await b.close();
  await a.waitFor('room', room => room.seats[1].online === false, 8000);
  check('B 掉线即时可见(online=false + 代打角标)', () => {
    const seat = a.room().seats[1];
    assert.equal(seat.online, false);
    assert.equal(seat.autopilot, true);
  });
  await a.waitFor('room', room => room.lastHand && room.lastHand.handNum >= 2, 90_000);
  stopA2();
  check('B 断线后牌局推进到第 2 手结束', () => {
    assert.ok(a.room().log.some(event => event.t === 'autopilot'), '流水含代打记录');
  });
  const b2 = makeClient('B2');
  await b2.open();
  b2.send({ type: 'hello_resume', code: a.state.code, token: b.state.token });
  const wb2 = await b2.waitFor('welcome', welcome => welcome.playerId === b.state.playerId, 8000);
  check('resume 恢复原玩家与席位', () => {
    assert.equal(wb2.playerId, b.state.playerId);
    assert.equal(wb2.seatIndex, 1);
  });
  await b2.waitFor('room', room => room.seats[1].online === true, 8000);
  check('归席后 online 恢复、代打解除', () => {
    const room = b2.room();
    assert.equal(room.seats[1].online, true);
    assert.equal(room.seats[1].autopilot, false);
  });

  const bad = makeClient('BAD');
  await bad.open();
  bad.send({ type: 'hello_resume', code: a.state.code, token: 'not-a-real-token-123456' });
  const authFail = await bad.waitFor('error', error => error.code === 'AUTH_FAILED');
  check('伪造 token → AUTH_FAILED', () => assert.equal(authFail.code, 'AUTH_FAILED'));
  bad.send({ type: 'hello_join', code: 'ZZZZ99', genId: 'lvbu' });
  const notFound = await bad.waitFor('error', error => error.code === 'ROOM_NOT_FOUND');
  check('不存在房间 → ROOM_NOT_FOUND', () => assert.equal(notFound.code, 'ROOM_NOT_FOUND'));
  bad.send('this is not json');
  await bad.waitFor('error', error => error.code === 'BAD_MESSAGE', 5000).catch(() => {});
  check('垃圾帧 → BAD_MESSAGE 或断开', () => {
    assert.ok(bad.state.inbox.some(msg => msg.type === 'error') || bad.state.closed);
  });
  bad.send({ type: 'poker_action', actionId: 'rogue-1', kind: 'fold' });
  const rogue = await bad.waitFor('error', error => error.code === 'BAD_STATE', 5000);
  check('未入房出牌 → BAD_STATE', () => assert.equal(rogue.code, 'BAD_STATE'));
  await bad.close();

  // [4] NPC 房:超时代打
  console.log('[4] NPC 房与超时代打');
  const c = makeClient('C');
  await c.open();
  c.send({ type: 'hello_create', config: { seats: 3, stack: 600, blindsIdx: 0, escalate: 4, turnMs: 4000 } });
  const wc = await c.waitFor('welcome');
  c.state.playerId = wc.playerId;
  c.state.code = wc.code;
  await c.waitFor('room', room => room.phase === 'lobby');
  c.send({ type: 'room_action', actionId: 'npcx-add1', kind: 'add_npc', genId: 'zhouyu' });
  await c.waitFor('ack', ack => ack.actionId === 'npcx-add1');
  await c.waitFor('room', room => room.seats.some(seat => seat.kind === 'npc' && seat.genId === 'zhouyu'));
  check('NPC 入席可辨', () => {
    const npc = c.room().seats.find(seat => seat.kind === 'npc');
    assert.equal(npc.genId, 'zhouyu');
    assert.equal(npc.online, true, 'NPC 恒在线');
  });
  c.send({ type: 'room_action', actionId: 'genx-c1', kind: 'set_general', genId: 'caocao' });
  await c.waitFor('ack', ack => ack.actionId === 'genx-c1');
  c.send({ type: 'room_action', actionId: 'npcx-go2', kind: 'start_game' });
  await c.waitFor('room', room => room.phase === 'playing');
  let conservation3 = true;
  c.state.ws.on('message', raw => {
    const msg = JSON.parse(raw.toString());
    const room = msg.type === 'room' ? msg.room : null;
    if (room && !room.lastHand && room.phase === 'playing' && totalStack(room) !== expectedTotal(room)) {
      conservation3 = false;
      console.error('    NPC房守恒破坏:', totalStack(room), JSON.stringify(room.seats.map(seat => [seat.kind, seat.stack, seat.committed, seat.folded, seat.eliminated])), 'hand', room.hand?.handNum, 'lastHand', room.lastHand?.handNum ?? null, 'log', JSON.stringify(room.log.slice(-4)));
    }
  });
  // 不给 C 挂 autoDrive:故意让 4s 超时打满,验证军师代打路径。
  // C 的代打全押可能首手爆仓出局(牌局种子随机,属正常终局),此时无第 2 手——
  // 终局与第 2 手任一到达即算推进,断言只在未终局时要求第 2 手。
  await c.waitFor('room', room => room.log.some(event => event.t === 'deal' && event.n >= 2)
    || room.log.some(event => event.t === 'over'), 150_000);

  check('人机局推进(超时代打入流水,首手爆仓终局亦算)', () => {
    assert.ok(c.room().log.some(event => event.t === 'autopilot'));
    const ended = c.room().log.some(event => event.t === 'over');
    if (!ended) assert.ok(c.room().log.some(event => event.t === 'deal' && event.n >= 2));
  });
  check('人机局守恒(3×600)', () => assert.ok(conservation3));
  await c.close();

  await a.close();
  await b2.close();

  // [4.5] 崩溃回归:恢复含离线玩家的对局,军师代打路径不得崩进程
  console.log('[4.5] 恢复离线玩家房间(代打崩溃回归)');
  const e = makeClient('E');
  const f = makeClient('F');
  await e.open();
  e.send({ type: 'hello_create', config: { seats: 2, stack: 1000, blindsIdx: 0, escalate: 4, turnMs: 4000 } });
  const we = await e.waitFor('welcome');
  e.state.code = we.code;
  e.state.playerId = we.playerId;
  e.state.token = we.token;
  await e.waitFor('room', room => room.phase === 'lobby');
  await f.open();
  f.send({ type: 'hello_join', code: e.state.code });
  const wf = await f.waitFor('welcome');
  f.state.token = wf.token;
  await f.waitFor('room', room => room.seats.filter(seat => seat.kind !== 'open').length === 2);
  e.send({ type: 'room_action', actionId: 'genx-e1', kind: 'set_general', genId: 'lvbu' });
  await e.waitFor('ack', ack => ack.actionId === 'genx-e1');
  f.send({ type: 'room_action', actionId: 'genx-f1', kind: 'set_general', genId: 'machao' });
  await f.waitFor('ack', ack => ack.actionId === 'genx-f1');
  e.send({ type: 'room_action', actionId: 'gox-e1', kind: 'start_game' });
  await e.waitFor('room', room => room.phase === 'playing');
  await e.close();
  await f.close();                         // 双双离线 → 全 AI 代打推进中
  await sleep(2500);                       // 代打至少走几步
  // 双离线代打推进中即停服(存下 mid-hand 快照),重启段验证恢复后代打不崩
  await stopServer(server);

  // [5] 快照持久化与重启恢复
  console.log('[5] 快照持久化与重启恢复');
  await stopServer(server);
  const snapshot = JSON.parse(readFileSync(dataFile, 'utf8'));
  check('快照落盘含双房与凭据哈希', () => {
    assert.ok(Array.isArray(snapshot.rooms) && snapshot.rooms.length >= 2);
    const rec = snapshot.rooms.find(room => room.code === a.state.code);
    assert.ok(rec, '房间1在快照中');
    assert.equal(rec.players.length, 2);
    assert.ok(rec.players[0].tokenHash.length >= 32);
  });
  const server2 = startServer();
  await sleep(900);
  const r2 = makeClient('R2');
  await r2.open();
  r2.send({ type: 'hello_resume', code: a.state.code, token: a.state.token });
  const wr2 = await r2.waitFor('welcome', welcome => welcome.playerId === a.state.playerId, 8000);
  check('重启后 resume 成功', () => assert.equal(wr2.playerId, a.state.playerId));
  await r2.waitFor('room', room => room.phase === 'playing' && room.hand, 15_000);
  check('恢复的房间继续开新手', () => {
    const room = r2.room();
    assert.equal(room.phase, 'playing');
    assert.ok(room.hand && room.hand.handNum >= 1);
    assert.equal(totalStack(room), expectedTotal(room));
  });
  // 崩溃回归主断言:含离线玩家的房间恢复后,代打路径不再崩进程
  const e2 = makeClient('E2');
  await e2.open();
  e2.send({ type: 'hello_resume', code: e.state.code, token: e.state.token });
  await e2.waitFor('welcome', welcome => welcome.playerId === e.state.playerId, 8000);
  await e2.waitFor('room', room => room.phase === 'playing' && room.hand, 20_000);
  await sleep(6000);                       // 让代打真实走几步
  check('离线玩家房间恢复后由军师代打继续推进(进程不崩)', () => {
    const room = e2.room();
    assert.ok(room.hand.handNum >= 1);
    assert.ok(room.log.some(event => event.t === 'deal'), '已开新手');
  });
  await e2.close();
  await r2.close();
  await stopServer(server2);
} finally {
  rmSync(dataDir, { recursive: true, force: true });
}

console.log(`\n结果: ${passed} 通过 / ${failures.length} 失败`);
if (failures.length) {
  for (const f of failures) console.error(`  ✗ ${f.name}: ${f.error.message}`);
  process.exit(1);
}
