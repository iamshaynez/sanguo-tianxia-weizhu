// main.js —— 总导演:场景装配 + 单挑牌局流程 + 演出
import * as THREE from 'three';
import { fx, tween, wait, flyTo, updateTweens, setupPost, AudioFX, ease } from './fx.js';
import { buildWorld } from './world.js';
import { buildTable, makeCard, renderChipStack, CARD_W, CARD_H } from './table.js';
import { createOpponent } from './opponent.js';
import { initUI } from './ui.js';
import * as PK from './poker.js';

const errBox = document.getElementById('errBox');
window.addEventListener('error', e => { errBox.textContent += e.message + '\n'; });
window.addEventListener('unhandledrejection', e => { errBox.textContent += (e.reason?.message || e.reason) + '\n'; });

// ---------------- 渲染基础 ----------------
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.getElementById('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 500);
const CAM_BASE = new THREE.Vector3(0, 1.5, 3.24);
const CAM_TGT = new THREE.Vector3(0, 1.32, -0.8);
camera.position.copy(CAM_BASE);

const world = buildWorld(scene);
const { feltY } = buildTable(scene);
const TY = feltY + 0.002;
const opp = createOpponent(scene);
const post = setupPost(renderer, scene, camera, innerWidth, innerHeight);
const audio = new AudioFX();
opp.onSlam(() => audio.thud());

// ---------------- 桌面布局 ----------------
const POS = {
  deck: new THREE.Vector3(-0.98, TY, -0.05),
  playerHole: i => new THREE.Vector3(i === 0 ? -0.1 : 0.1, TY, 1.06),
  oppHole: i => new THREE.Vector3(i === 0 ? -0.075 : 0.075, TY, -0.92),
  community: i => new THREE.Vector3(-0.36 + i * 0.18, TY, -0.28),
  pot: new THREE.Vector3(0, TY, 0.12),
  playerBet: new THREE.Vector3(0, TY, 0.55),
  oppBet: new THREE.Vector3(0, TY, -0.58),
  playerStack: new THREE.Vector3(0.82, TY, 0.66),
  oppStack: new THREE.Vector3(-0.82, TY, -0.66),
};
const pile = { stackP: grp(POS.playerStack), stackO: grp(POS.oppStack), betP: grp(POS.playerBet), betO: grp(POS.oppBet), pot: grp(POS.pot) };
function grp(p) { const g = new THREE.Group(); g.position.copy(p); scene.add(g); return g; }

// 庄家按钮
{
  const btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.01, 24),
    new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.9, roughness: 0.25 })
  );
  btn.position.set(-0.52, TY + 0.005, 0.72);
  scene.add(btn);
}

// ---------------- 游戏状态 ----------------
const BLINDS = [[10, 20], [15, 30], [25, 50], [50, 100], [100, 200]];
const G = {
  seed: Math.random().toString(16).slice(2, 8).toUpperCase(),
  handNum: 0, blindLv: 0,
  p: { stack: 1000, bet: 0, hole: [] },
  o: { stack: 1000, bet: 0, hole: [] },
  pot: 0, board: [], deck: [], deckPtr: 0, deckLog: [],
  tilt: 0, taunted: false, over: false, runout: false,
  tell: null, camPush: 0, focus: 'opp', busy: false,
  meshByCard: new Map(), holeMeshesP: [], holeMeshesO: [], boardMeshes: [],
};
const AI_P = { aggr: 0.8, bluff: 0.16, get tilt() { return G.tilt; } };

const LINES = {
  deal: ['又是一手。庄家在看着。', '洗牌、发牌,命运重新排列。'],
  bet: ['下注。别浪费我的时间。', '跟上,或者让开。'],
  raise: ['加注。', '价格涨了。'],
  call: ['跟。', '看看你能走多远。'],
  check: ['过。', '……慢慢来。'],
  fold: ['这手让给你。', '……不值得。'],
  allin: ['全压。债务到期了。', '要么全跟,要么滚下桌。'],
  win: ['筹码,回到它们该在的地方。', '庄家向你问好。'],
  lose: ['……留着吧,利息照算。', '这一手,记你账上。'],
  taunt: ['……口舌之快。', '牌桌上,话多的人输得快。'],
  tauntTilt: ['闭嘴!', '你、再、说、一、遍?'],
};
const say = (key, p = 0.55) => { if (Math.random() < p) ui.bubble(LINES[key][Math.floor(Math.random() * LINES[key].length)]); };

// ---------------- UI ----------------
const ui = initUI({
  onStart() {
    audio.resume();
    ui.setSeed('#' + G.seed);
    ui.setStacks(G.p.stack, G.o.stack);
    ui.setPot(0); ui.setTilt(0);
    ui.showHUD();
    introCamera().then(() => gameLoop());
  },
  onRestart() {},
  onVerify() {
    const html = G.deckLog.length
      ? G.deckLog.map(id => `<span class="${PK.SUIT_RED[PK.suitOf(id)] ? 'red' : 'blk'}">${PK.cardName(id)}</span>`).join(' ')
      : '第一手尚未发出。';
    ui.showSeedModal('#' + G.seed + ' · 第' + Math.max(1, G.handNum) + '手', html);
  },
  onTaunt() {
    if (G.taunted || G.busy) return;
    G.taunted = true;
    ui.enableTaunt(false);
    G.tilt = Math.min(3, G.tilt + 1);
    opp.setTilt(G.tilt); ui.setTilt(G.tilt);
    ui.bubble(G.tilt >= 2 ? LINES.tauntTilt[Math.floor(Math.random() * 2)] : LINES.taunt[Math.floor(Math.random() * 2)]);
    audio.thud();
  },
});

// ---------------- 演出工具 ----------------
let focusDist = 3.4;
function setFocus(name) { G.focus = name; }
function focusPoint() {
  if (G.focus === 'pot') return new THREE.Vector3(0, 0.82, 0.1);
  if (G.focus === 'cards') return new THREE.Vector3(0, 0.82, 0.95);
  return new THREE.Vector3(0, 1.5, -1.5); // 面具
}

async function dramatic(on) {
  if (on) {
    fx.timeScale = 0.35;
    ui.vignette(true);
    audio.heartStart();
    tween(0.9, k => { G.camPush = k; });
  } else {
    fx.timeScale = 1;
    ui.vignette(false);
    audio.heartStop();
    await tween(0.7, k => { G.camPush = 1 - k; });
  }
}

let camFree = false; // true 时开场运镜接管相机
function introCamera() {
  camFree = true;
  const from = new THREE.Vector3(16, 10.5, 19);
  const tgtFrom = new THREE.Vector3(0, 3, -10);
  return tween(4.6, k => {
    camera.position.lerpVectors(from, CAM_BASE, k);
    camera.lookAt(tgtFrom.clone().lerp(CAM_TGT, k));
  }, ease.inOut).then(() => { camFree = false; });
}

// ---------------- 牌与筹码操作 ----------------
function spawnCard(id, faceUp) {
  const c = makeCard(id);
  c.position.copy(POS.deck).add(new THREE.Vector3(0, 0.05, 0));
  c.rotation.set(0, 0, Math.PI);
  scene.add(c);
  G.meshByCard.set(id, c);
  return c;
}

function flatQuat(faceUp, roll = 0) {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, roll, faceUp ? 0 : Math.PI));
}

async function dealCardTo(id, pos, faceUp, dur = 0.45, roll = 0) {
  const c = spawnCard(id, faceUp);
  audio.card();
  await flyTo(c, pos, flatQuat(faceUp, roll), dur, 0.35);
  return c;
}

function nextCard() { return G.deck[G.deckPtr++]; }

function refreshPiles() {
  renderChipStack(pile.stackP, G.p.stack, 'ivory');
  renderChipStack(pile.stackO, G.o.stack, 'black');
  renderChipStack(pile.betP, G.p.bet, 'ivory');
  renderChipStack(pile.betO, G.o.bet, 'black');
  renderChipStack(pile.pot, G.pot, 'ivory');
  ui.setStacks(G.p.stack, G.o.stack);
  ui.setPot(G.pot + G.p.bet + G.o.bet);
}

function putChips(who, amt) {
  const P = who === 'p' ? G.p : G.o;
  amt = Math.min(amt, P.stack);
  P.stack -= amt; P.bet += amt;
  audio.chip();
  refreshPiles();
  return amt;
}

async function commitBets() {
  if (G.p.bet === 0 && G.o.bet === 0) return;
  audio.chip();
  await Promise.all([
    flyTo(pile.betP, POS.pot, pile.betP.quaternion.clone(), 0.4, 0.15),
    flyTo(pile.betO, POS.pot, pile.betO.quaternion.clone(), 0.4, 0.15),
  ]);
  // 未跟注部分退还给下注方
  const matched = Math.min(G.p.bet, G.o.bet);
  const excess = Math.abs(G.p.bet - G.o.bet);
  if (excess > 0) {
    if (G.p.bet > G.o.bet) G.p.stack += excess; else G.o.stack += excess;
  }
  G.pot += matched * 2;
  G.p.bet = 0; G.o.bet = 0;
  pile.betP.position.copy(POS.playerBet);
  pile.betO.position.copy(POS.oppBet);
  refreshPiles();
}

async function sweepPot(who) {
  const target = who === 'p' ? POS.playerStack : POS.oppStack;
  audio.chip();
  await flyTo(pile.pot, target, pile.pot.quaternion.clone(), 0.7, 0.3);
  if (who === 'p') G.p.stack += G.pot; else G.o.stack += G.pot;
  G.pot = 0;
  pile.pot.position.copy(POS.pot);
  refreshPiles();
}

// ---------------- 破绽 ----------------
function applyTell(street) {
  let e;
  if (street === 0) e = PK.preflopStrength(G.o.hole);
  else e = PK.postflopEquity(G.o.hole, G.board).e;
  const actual = e > 0.66 ? 'strong' : e < 0.34 ? 'weak' : 'mid';
  let shown = actual;
  // 15% 概率他在演;上头的傀儡不会演
  const rng = Math.random();
  if (G.tilt < 2 && rng < 0.15) shown = actual === 'strong' ? 'weak' : 'strong';
  G.tell = { street, shown, actual };
  G.tellState = shown === 'strong' ? 'strong' : shown === 'weak' ? 'bluff' : 'neutral';
  opp.setState(G.tellState);
}

function codexFromShowdown(playerHandName, oppHandName) {
  if (!G.tell || G.tell.shown === 'mid') return;
  const desc = G.tell.shown === 'strong' ? '右手护住筹码堆' : '左手摩挲面具边缘';
  const hit = G.tell.shown === G.tell.actual;
  ui.codexAdd(
    `第${G.handNum}手 · 他亮出<b>${oppHandName}</b><br>` +
    `「${desc}」 → ${G.tell.actual === 'strong' ? '强牌' : '弱牌'} ${hit ? '<b>✓ 命中</b>' : '<b>✗ 是假动作</b>'}`
  );
}

// ---------------- 下注轮 ----------------
function other(x) { return x === 'p' ? 'o' : 'p'; }

async function playerAct(street) {
  const toCall = G.o.bet - G.p.bet;
  const totalPot = G.pot + G.p.bet + G.o.bet;
  const BB = BLINDS[G.blindLv][1];
  const presets = [];
  if (G.p.stack > toCall) {
    for (const f of [0.5, 1, 2]) {
      const extra = Math.max(BB, Math.round(totalPot * f / 5) * 5);
      const amount = Math.min(G.p.stack, toCall + extra);
      if (amount > toCall && !presets.some(p => p.amount === amount)) {
        presets.push({ label: f === 0.5 ? '½ 底池' : f === 1 ? '1 底池' : '2 底池', amount });
      }
    }
  }
  setFocus('opp');
  const a = await ui.promptAction({ toCall, stack: G.p.stack, presets });
  if (a.type === 'fold') return { type: 'fold' };
  if (a.type === 'check') return { type: 'check' };
  if (a.type === 'call') { putChips('p', toCall); return { type: 'call' }; }
  if (a.type === 'allin') {
    const wasRaise = G.p.stack > toCall;
    putChips('p', G.p.stack);
    await dramatic(true);
    return { type: wasRaise ? 'raise' : 'call', allin: true };
  }
  // raise
  putChips('p', a.amount);
  if (G.p.stack === 0) await dramatic(true);
  return { type: 'raise', allin: G.p.stack === 0 };
}

async function oppAct(street, rng) {
  opp.setState('thinking');
  setFocus('opp');
  await wait(0.9 + Math.random() * 0.8);
  const toCall = G.p.bet - G.o.bet;
  const BB = BLINDS[G.blindLv][1];
  const d = PK.aiDecide({
    street, hole: G.o.hole, board: G.board,
    toCall, pot: G.pot + G.p.bet + G.o.bet, stack: G.o.stack,
    minRaise: BB, raisesLeft: G.raisesLeft > 0 ? 1 : 0,
    personality: AI_P, rng,
  });
  opp.setState(G.tellState);
  if (d.type === 'fold') { say('fold'); return { type: 'fold' }; }
  if (d.type === 'check') { say('check', 0.3); return { type: 'check' }; }
  if (d.type === 'call') {
    say('call', 0.35);
    putChips('o', toCall);
    return { type: 'call' };
  }
  // bet / raise
  const allin = d.amount >= G.o.stack;
  putChips('o', d.amount);
  say(allin ? 'allin' : (toCall > 0 ? 'raise' : 'bet'), 0.7);
  if (allin) await dramatic(true);
  return { type: 'raise', allin };
}

async function bettingRound(street, rng) {
  let actor = street === 0 ? 'p' : 'o'; // 翻牌前按钮(你)先动;之后大盲(他)先动
  const pending = new Set(['p', 'o']);
  G.raisesLeft = 3;
  while (pending.size) {
    if (!pending.has(actor)) { actor = other(actor); continue; }
    // 一方已全压则无需再行动
    if (G.p.stack === 0 || G.o.stack === 0) break;
    const res = actor === 'p' ? await playerAct(street) : await oppAct(street, rng);
    pending.delete(actor);
    if (res.type === 'fold') return { folded: actor };
    if (res.type === 'raise') {
      G.raisesLeft--;
      pending.add(other(actor));
    }
    await wait(0.25);
    actor = other(actor);
  }
  await commitBets();
  return { folded: null };
}

// ---------------- 街道 ----------------
async function burnCard() {
  const c = spawnCard(nextCard(), false);
  audio.card();
  await flyTo(c, POS.deck.clone().add(new THREE.Vector3(0, 0.02, 0.12)), flatQuat(false), 0.3, 0.15);
  setTimeout(() => scene.remove(c), 600);
}

async function dealStreet(street) {
  setFocus('pot');
  if (G.runout) await wait(0.7);
  await burnCard();
  if (street === 1) {
    for (let i = 0; i < 3; i++) {
      const id = nextCard();
      G.board.push(id);
      G.boardMeshes[i] = await dealCardTo(id, POS.community(i), true, 0.5, (Math.random() - 0.5) * 0.05);
      await wait(0.12);
    }
  } else {
    const id = nextCard();
    G.board.push(id);
    G.boardMeshes[street + 1] = await dealCardTo(id, POS.community(street + 1), true, 0.5);
  }
  ui.setHand(PK.madeName(G.p.hole, G.board));
}

// ---------------- 摊牌与结算 ----------------
async function showdown() {
  setFocus('opp');
  // 翻傀儡的牌
  audio.card();
  for (let i = 0; i < 2; i++) {
    const c = G.holeMeshesO[i];
    const z0 = c.rotation.z;
    await tween(0.5, k => {
      c.rotation.z = z0 + k * Math.PI;
      c.position.y = TY + Math.sin(k * Math.PI) * 0.12;
    }, ease.inOut);
  }
  await wait(0.4);

  const mine = PK.evaluate7([...G.p.hole, ...G.board]);
  const his = PK.evaluate7([...G.o.hole, ...G.board]);
  const cmp = PK.compareScore(mine.score, his.score);
  codexFromShowdown(mine.name, his.name);

  // 赢家高亮
  const winCards = cmp >= 0 ? mine.best5 : his.best5;
  for (const id of winCards) {
    const m = G.meshByCard.get(id);
    if (!m) continue;
    const f = m.userData.front;
    tween(1.6, k => { f.material.emissiveIntensity = 0.34 + Math.sin(k * Math.PI * 3) * 0.9; });
  }
  setFocus('pot');
  await wait(0.6);

  if (cmp > 0) {
    const wonPot = G.pot;
    ui.banner(mine.name, `你赢下底池 ${wonPot}`);
    audio.win();
    await sweepPot('p');
    say('lose');
    if (wonPot >= 300) bumpTilt(1, true); // 输大池,傀儡上火
  } else if (cmp < 0) {
    ui.banner(his.name, `他赢下底池 ${G.pot}`);
    await sweepPot('o');
    say('win');
  } else {
    ui.banner('平分底池', `同为${mine.name}`);
    const half = Math.floor(G.pot / 2);
    G.pot = half; await sweepPot('p');
    G.pot = half; await sweepPot('o');
  }
  await wait(0.8);
}

function bumpTilt(n, quip) {
  G.tilt = Math.min(3, G.tilt + n);
  opp.setTilt(G.tilt); ui.setTilt(G.tilt);
  if (quip && G.tilt >= 2) ui.bubble(LINES.tauntTilt[Math.floor(Math.random() * 2)]);
}

async function resolveFold(loser) {
  const winner = loser === 'p' ? 'o' : 'p';
  await commitBets();
  ui.banner(winner === 'p' ? '他弃牌了' : '你弃牌了', `底池 ${G.pot}`);
  await sweepPot(winner);
  if (winner === 'p') say('fold');
  await wait(0.6);
}

async function clearTable() {
  const all = [...G.holeMeshesP, ...G.holeMeshesO, ...G.boardMeshes].filter(Boolean);
  await Promise.all(all.map((c, i) => {
    const p = POS.deck.clone().add(new THREE.Vector3(0, 0.03 + i * 0.002, 0.1));
    return flyTo(c, p, flatQuat(false), 0.45, 0.2);
  }));
  all.forEach(c => scene.remove(c));
  G.holeMeshesP = []; G.holeMeshesO = []; G.boardMeshes = [];
  G.meshByCard.clear();
}

// ---------------- 一手牌 ----------------
async function playHand() {
  G.handNum++;
  G.busy = false;
  G.runout = false;
  G.taunted = false;
  ui.enableTaunt(true);
  G.p.bet = 0; G.o.bet = 0; G.pot = 0;
  G.board = [];
  G.p.hole = []; G.o.hole = [];
  ui.setHand('—');
  refreshPiles();

  // 盲注升级
  const lv = Math.min(BLINDS.length - 1, Math.floor((G.handNum - 1) / 4));
  const [SB, BB] = BLINDS[lv];
  ui.setBlind(`盲注 ${SB} / ${BB} · 第 ${G.handNum} 手`);
  if (lv !== G.blindLv) {
    G.blindLv = lv;
    ui.banner('盲注升级', `${SB} / ${BB}`);
    audio.chime();
    await wait(1.2);
  }

  // 洗牌(种子可验)
  const rng = PK.mulberry32(PK.hashSeed(G.seed + '#' + G.handNum));
  G.deck = PK.shuffle(PK.makeDeck(), rng);
  G.deckPtr = 0;
  G.deckLog = [...G.deck];

  say('deal', 0.4);
  // 下盲注
  putChips('p', SB); await wait(0.3);
  putChips('o', BB); await wait(0.5);

  // 发底牌
  setFocus('cards');
  G.p.hole = [nextCard(), nextCard()];
  G.o.hole = [nextCard(), nextCard()];
  G.holeMeshesP[0] = await dealCardTo(G.p.hole[0], POS.playerHole(0), true, 0.45, -0.04);
  G.holeMeshesO[0] = await dealCardTo(G.o.hole[0], POS.oppHole(0), false, 0.45);
  G.holeMeshesP[1] = await dealCardTo(G.p.hole[1], POS.playerHole(1), true, 0.45, 0.04);
  G.holeMeshesO[1] = await dealCardTo(G.o.hole[1], POS.oppHole(1), false, 0.45);
  // 玩家的牌放大一号,保证可读
  G.holeMeshesP.forEach(c => c.scale.setScalar(1.35));
  ui.setHand(PK.madeName(G.p.hole, []));

  applyTell(0);
  let r = await bettingRound(0, rng);
  if (r.folded) { await finishHand(r.folded); return; }

  for (const street of [1, 2, 3]) {
    if (G.p.stack === 0 || G.o.stack === 0) G.runout = true;
    await dealStreet(street);
    applyTell(street);
    if (!G.runout) {
      r = await bettingRound(street, rng);
      if (r.folded) { await finishHand(r.folded); return; }
    }
  }
  await showdown();
  await finishHand(null);
}

async function finishHand(foldLoser) {
  if (foldLoser) await resolveFold(foldLoser);
  await dramatic(false);
  await clearTable();

  if (G.o.stack <= 0) {
    // 傀儡被清台:面具坠落
    const { mesh, from } = G.maskFall = opp.maskFall(feltY);
    const to = new THREE.Vector3(0.28, feltY + 0.05, -0.35);
    const q0 = mesh.quaternion.clone();
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.2, 0.4, 0.3));
    tween(0.9, k => {
      mesh.position.lerpVectors(from, to, k);
      mesh.position.y += Math.sin(k * Math.PI) * 0.35;
      mesh.quaternion.slerpQuaternions(q0, q1, k);
    }, ease.in).then(() => audio.thud());
    opp.setState('defeat');
    await wait(1.6);
    ui.showEnd(true, '他被清台了', '瓷面落在绒布上。今夜,你从庄家手里赢回了一枚注。');
    G.over = true;
    return;
  }
  if (G.p.stack <= 0) {
    ui.showEnd(false, '你被清台了', '庄家仁慈地笑了笑:「随时欢迎回来,孩子。」');
    G.over = true;
    return;
  }
  await wait(1.2);
}

async function gameLoop() {
  while (!G.over) {
    await playHand();
  }
}

// ---------------- 交互:环视与看牌 ----------------
const mouse = { x: 0, y: 0 };
addEventListener('pointermove', e => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = (e.clientY / innerHeight) * 2 - 1;
});

const raycaster = new THREE.Raycaster();
let peeking = false;
addEventListener('pointerdown', e => {
  if (peeking || !G.holeMeshesP.length) return;
  raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera);
  const hits = raycaster.intersectObjects(G.holeMeshesP, true);
  if (!hits.length) return;
  peeking = true;
  const anims = G.holeMeshesP.map((c, i) => {
    const p0 = c.position.clone(), q0 = c.quaternion.clone();
    const p1 = p0.clone().add(new THREE.Vector3(0, 0.16, 0.06));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, i === 0 ? -0.1 : 0.1, 0));
    return { c, p0, q0, p1, q1 };
  });
  setFocus('cards');
  tween(0.3, k => anims.forEach(a => {
    a.c.position.lerpVectors(a.p0, a.p1, k);
    a.c.quaternion.slerpQuaternions(a.q0, a.q1, k);
  })).then(() => wait(1.3)).then(() => tween(0.3, k => anims.forEach(a => {
    a.c.position.lerpVectors(a.p1, a.p0, k);
    a.c.quaternion.slerpQuaternions(a.q1, a.q0, k);
  }))).then(() => { peeking = false; setFocus('opp'); });
});

// ---------------- 主循环 ----------------
const clock = new THREE.Clock();
const parallax = new THREE.Vector2();
const bubbleV = new THREE.Vector3();
let lastFrame = performance.now();

function frame(manual = false) {
  lastFrame = performance.now();
  // 看门狗驱动时按真实流逝时间推进(上限 0.3s),rAF 驱动时按帧间隔(上限 0.05s)
  const dt = Math.min(manual ? 0.3 : 0.05, clock.getDelta());
  const sdt = dt * fx.timeScale;
  updateTweens(sdt);
  world.update(sdt);
  opp.update(sdt);

  // 相机:基础位 + 视差 + 全压推镜(开场运镜时不插手)
  if (!camFree) {
    parallax.x += (mouse.x * 0.24 - parallax.x) * 0.05;
    parallax.y += (-mouse.y * 0.1 - parallax.y) * 0.05;
    camera.position.set(
      CAM_BASE.x + parallax.x,
      CAM_BASE.y + parallax.y + G.camPush * 0.3,
      CAM_BASE.z - G.camPush * 1.05
    );
    camera.lookAt(
      CAM_TGT.x,
      CAM_TGT.y - G.camPush * 0.34,
      CAM_TGT.z + G.camPush * 0.88
    );
  }

  // 景深对焦
  const d = camera.position.distanceTo(focusPoint());
  focusDist += (d - focusDist) * 0.07;
  post.setFocus(focusDist);

  // 气泡跟随
  opp.anchor.getWorldPosition(bubbleV);
  bubbleV.project(camera);
  ui.moveBubble((bubbleV.x * 0.5 + 0.5) * innerWidth, (-bubbleV.y * 0.5 + 0.5) * innerHeight);

  post.composer.render();
}

renderer.setAnimationLoop(frame);
// 看门狗:rAF 被节流(窗口失焦)时用定时器继续驱动,牌局不冻结
setInterval(() => {
  if (performance.now() - lastFrame > 400) frame(true);
}, 300);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  post.setSize(innerWidth, innerHeight);
});
