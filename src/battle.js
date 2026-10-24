// battle.js —— 2.5D 牌桌战斗:发牌、下注、破绽、摊牌、清台
import * as PK from './poker.js';
import { makePersona } from './persona.js';
import { wait } from './fx2d.js';
import { POSE } from './character.js';

const $ = id => document.getElementById(id);

const SLOTS = {
  community: i => ({ x: 50 + (i - 2) * 11.5, y: 45 }),
  pot: { x: 50, y: 38 },
  betP: { x: 50, y: 66 },
  betO: { x: 50, y: 26 },
  stackP: { x: 87, y: 74 },
  stackO: { x: 11, y: 13 },
  deck: { x: 10, y: 42 },
  oppHole: i => ({ x: i === 0 ? 45.5 : 54.5, y: 27 }),
  playerHole: i => ({ x: i === 0 ? 45 : 55, y: 97 }),
};

const LINES = {
  deal: ['又是一手。', '洗牌、发牌,阵前再见。'],
  bet: ['下注。', '跟上,或者让开。'],
  raise: ['加注。', '此注,翻倍。'],
  call: ['跟。', '看你这一手。'],
  check: ['过。', '……慢慢来。'],
  fold: ['这手让给你。', '……不值得。'],
  allin: ['全压。', '要么全跟,要么退。'],
  win: ['筹码,该是我的。', '承让。'],
  lose: ['……留着吧。', '这一手,记下。'],
  taunt: ['……口舌之快。', '阵前斗口,输家的把戏。'],
  tauntTilt: ['放肆!', '你、再、说、一、遍?'],
};

// ---------------- 牌元素 ----------------
function cardEl(id, big = false) {
  const el = document.createElement('div');
  el.className = 'card' + (PK.SUIT_RED[PK.suitOf(id)] ? ' red' : '') + (big ? ' big' : '');
  const r = PK.RANKS[PK.rankOf(id)], s = PK.SUITS[PK.suitOf(id)];
  const face = r >= 9 || r === 0 && false
    ? `<div class="pip big-letter">${r}</div><div class="pip mid-suit">${s}</div>`
    : `<div class="pip mid-suit only">${s}</div><div class="pip small-rank">${r}</div>`;
  el.innerHTML = `
    <div class="inner">
      <div class="face front">
        <div class="corner tl">${r}<br>${s}</div>
        <div class="center">${face}</div>
        <div class="corner br">${r}<br>${s}</div>
      </div>
      <div class="face back"><div class="back-sig">♠</div></div>
    </div>`;
  el.dataset.cardId = id;
  return el;
}

function stackEl(count, tone) {
  const el = document.createElement('div');
  el.className = 'stack';
  renderStack(el, count, tone);
  return el;
}

function renderStack(el, count, tone) {
  el.innerHTML = '';
  const n = Math.min(Math.max(0, Math.round(count)), 12);
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'chip ' + tone;
    c.style.bottom = i * 5 + 'px';
    el.appendChild(c);
  }
}

// ---------------- 战斗 ----------------
export function startBattle(opts) {
  const {
    playerStack = 1000, oppStack = 1000,
    blinds0 = [10, 20], escalateEvery = 4,
    boss = false, oppName = '收债人 · 无名氏',
    rule = {}, oppMorale0 = 0, general = null,
    ui, audio, oppChar, onEnd,
  } = opts;

  const table = $('table'), cardLayer = $('cardLayer'), scene = $('scene');
  const piles = {
    pot: $('stPot'), betP: $('stBetP'), betO: $('stBetO'),
    stackP: $('stStackP'), stackO: $('stStackO'),
  };
  const BL = i => {
    const m = Math.pow(1.5, i);
    return [Math.round(blinds0[0] * m / 5) * 5, Math.round(blinds0[1] * m / 5) * 5];
  };

  const G = {
    handNum: 0, blindLv: 0,
    p: { stack: playerStack, bet: 0, hole: [] },
    o: { stack: oppStack, bet: 0, hole: [] },
    pot: 0, board: [], deck: [], deckPtr: 0, deckLog: [],
    morale: oppMorale0, oLossStreak: 0, taunted: false, over: false,
    slowplayed: false, bluffLine: false,
    tell: null, meshByCard: new Map(), holeP: [], holeO: [], boardEls: [],
    seed: opts.seed,
    keenEye: !!opts.keenEye,
    oStack0: oppStack,
  };
  // 人格基座:六维属性 → 战术参数;缺省为全 50 常人
  const PERSONA = opts.persona || makePersona();
  // 武将档案:签名破绽与台词(无名偏将用通用套话)
  const GEN = general;
  const TELLS = GEN?.tells || { strong: '右手护住筹码堆', weak: '左手抚上瓷面' };
  const BARK = (k, fallback) => GEN?.barks?.[k] || fallback;
  // 士气 → 怒气(破绽诚实度、UI 灯):消沉/暴怒都算失守
  const tiltOf = () => Math.max(0, Math.min(3, -G.morale));
  const readStats = PK.createRead();
  const AI_P = {
    ...PERSONA.ai,
    get tilt() { return tiltOf(); },
    get morale() { return G.morale; },
  };
  const say = (key, p = 0.55) => { if (Math.random() < p) ui.bubble(LINES[key][Math.floor(Math.random() * LINES[key].length)]); };

  oppChar.setBoss(boss);
  oppChar.setSkin(opts.oppSkin || GEN?.skin || 'default');
  oppChar.setProfile({
    bio: GEN?.bio || '乱世群雄,各有一局。',
    traits: PERSONA.traits,
  });
  // 执子之手:你执丞相——名牌与攻心钮让位给观星
  ui.setPlayerName?.(opts.playerName);
  ui.setTauntLabel?.(opts.zhiZi ? '观 星' : '攻 心');
  ui.setOppName(oppName);
  ui.setStacks(G.p.stack, G.o.stack);
  ui.setPot(0); ui.setTilt(tiltOf()); ui.setBlind('');
  ui.setHand('—'); ui.clearCodex();

  // ---------- 布局与动画 ----------
  function slotPos(slot, el) {
    const r = cardLayer.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { x: r.width * slot.x / 100 - er.width / 2, y: r.height * slot.y / 100 - er.height / 2 };
  }

  function place(el, slot, immediate = false) {
    const p = slotPos(slot, el);
    if (immediate) el.classList.add('no-anim');
    el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    if (immediate) { el.offsetHeight; el.classList.remove('no-anim'); }
  }

  function pileTo(pileEl, slot) {
    const r = cardLayer.getBoundingClientRect();
    pileEl.style.left = (r.width * slot.x / 100) + 'px';
    pileEl.style.top = (r.height * slot.y / 100) + 'px';
  }

  function layoutPiles() {
    pileTo(piles.pot, SLOTS.pot); pileTo(piles.betP, SLOTS.betP);
    pileTo(piles.betO, SLOTS.betO); pileTo(piles.stackP, SLOTS.stackP);
    pileTo(piles.stackO, SLOTS.stackO);
    pileTo($('deckEl'), SLOTS.deck);
  }
  layoutPiles();
  const relayout = () => layoutPiles();
  addEventListener('resize', relayout);

  function refreshPiles() {
    renderStack(piles.stackP, G.p.stack, 'ivory');
    renderStack(piles.stackO, G.o.stack, 'ebony');
    renderStack(piles.betP, G.p.bet, 'ivory');
    renderStack(piles.betO, G.o.bet, 'ebony');
    renderStack(piles.pot, G.pot, 'pot');
    ui.setStacks(G.p.stack, G.o.stack);
    ui.setPot(G.pot + G.p.bet + G.o.bet);
  }
  refreshPiles();

  function putChips(who, amt) {
    const P = who === 'p' ? G.p : G.o;
    amt = Math.min(amt, P.stack);
    P.stack -= amt; P.bet += amt;
    audio.chip();
    refreshPiles();
    return amt;
  }

  async function flyChips(fromSlot, toSlot, tone) {
    const el = stackEl(Math.min(8, 8), tone);
    el.classList.add('fly');
    cardLayer.appendChild(el);
    place(el, fromSlot, true);
    await wait(0.03);
    place(el, toSlot);
    audio.chip();
    await wait(0.42);
    el.remove();
  }

  async function commitBets() {
    if (G.p.bet === 0 && G.o.bet === 0) return;
    await Promise.all([flyChips(SLOTS.betP, SLOTS.pot, 'ivory'), flyChips(SLOTS.betO, SLOTS.pot, 'ebony')]);
    const matched = Math.min(G.p.bet, G.o.bet);
    const excess = Math.abs(G.p.bet - G.o.bet);
    if (excess > 0) { if (G.p.bet > G.o.bet) G.p.stack += excess; else G.o.stack += excess; }
    G.pot += matched * 2;
    G.p.bet = 0; G.o.bet = 0;
    refreshPiles();
  }

  async function sweepPot(who) {
    await flyChips(SLOTS.pot, who === 'p' ? SLOTS.stackP : SLOTS.stackO, 'pot');
    if (who === 'p') G.p.stack += G.pot; else G.o.stack += G.pot;
    G.pot = 0;
    refreshPiles();
  }

  async function dealCard(id, slot, faceUp, big = false) {
    const el = cardEl(id, big);
    cardLayer.appendChild(el);
    G.meshByCard.set(id, el);
    place(el, SLOTS.deck, true);
    if (faceUp) el.classList.add('flipped');
    await wait(0.03);
    audio.card();
    place(el, slot);
    await wait(0.4);
    return el;
  }

  function nextCard() { return G.deck[G.deckPtr++]; }

  async function clearTable() {
    const all = [...G.holeP, ...G.holeO, ...G.boardEls].filter(Boolean);
    for (const el of all) {
      el.classList.remove('flipped', 'hl');
      place(el, { x: 50, y: -30 });
      el.style.opacity = 0;
    }
    await wait(0.5);
    all.forEach(el => el.remove());
    G.holeP = []; G.holeO = []; G.boardEls = [];
    G.meshByCard.clear();
  }

  // ---------- 破绽 ----------
  function applyTell(street, rng = Math.random) {
    let e;
    if (street === 0) e = PK.preflopStrength(G.o.hole);
    else e = PK.postflopEquity(G.o.hole, G.board).e;
    const actual = e > 0.66 ? 'strong' : e < 0.34 ? 'weak' : 'mid';
    let shown = actual;
    const lieMult = rule.lieMult || 1;
    const lieChance = (G.keenEye ? PERSONA.lieChance * 0.35 : PERSONA.lieChance) * lieMult;
    if (rule.lieAll && G.handNum <= rule.lieAll) {
      // 专属机制·白衣全谎:前几手的破绽全是假动作(示弱诱敌)
      shown = actual === 'weak' ? 'strong' : 'weak';
    } else if (tiltOf() < 2 && rng() < lieChance) {
      shown = actual === 'strong' ? 'weak' : 'strong';
    }
    G.tell = { street, shown, actual };
    oppChar.setPose(shown === 'strong' ? POSE.STRONG : shown === 'weak' ? POSE.BLUFF : POSE.NEUTRAL);
  }

  function codexFromShowdown(oppHandName) {
    if (!G.tell || G.tell.shown === 'mid') return;
    const desc = G.tell.shown === 'strong' ? TELLS.strong : TELLS.weak;
    const hit = G.tell.shown === G.tell.actual;
    ui.codexAdd(
      `第${G.handNum}手 · 他亮出<b>${oppHandName}</b><br>` +
      `「${desc}」 → ${G.tell.actual === 'strong' ? '强牌' : '弱牌'} ${hit ? '<b>✓ 命中</b>' : '<b>✗ 是假动作</b>'}`
    );
    opts.onTell?.({ shown: G.tell.shown, actual: G.tell.actual, hit });
  }

  // ---------- 下注轮 ----------
  const other = x => x === 'p' ? 'o' : 'p';

  async function playerAct() {
    oppChar.setActive(false);
    const toCall = G.o.bet - G.p.bet;
    const totalPot = G.pot + G.p.bet + G.o.bet;
    const BB = BL(G.blindLv)[1];
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
    const a = await ui.promptAction({ toCall, stack: G.p.stack, presets });
    if (a.type === 'fold' || a.type === 'check') { readStats.track(toCall, a.type); return { type: a.type }; }
    if (a.type === 'call') { putChips('p', toCall); readStats.track(toCall, 'call'); return { type: 'call' }; }
    if (a.type === 'allin') {
      const wasRaise = G.p.stack > toCall;
      putChips('p', G.p.stack);
      readStats.track(toCall, wasRaise ? 'raise' : 'call');
      await dramatic(true);
      return { type: wasRaise ? 'raise' : 'call', allin: true };
    }
    putChips('p', a.amount);
    readStats.track(toCall, 'raise');
    if (G.p.stack === 0) await dramatic(true);
    return { type: 'raise', allin: G.p.stack === 0 };
  }

  async function oppAct(street, rng) {
    oppChar.setActive(true);
    oppChar.setPose(POSE.THINKING);
    await wait(0.8 + Math.random() * 0.8);
    const toCall = G.p.bet - G.o.bet;
    // 专属机制·困兽:背水一战,攻势更烈
    const pers = (rule.cornered && G.o.stack < G.oStack0 * 0.3)
      ? { ...AI_P, aggr: AI_P.aggr * 1.4 }
      : AI_P;
    const d = PK.aiDecide({
      street, hole: G.o.hole, board: G.board,
      toCall, pot: G.pot + G.p.bet + G.o.bet, stack: G.o.stack,
      minRaise: BL(G.blindLv)[1], raisesLeft: G.raisesLeft > 0 ? 1 : 0,
      personality: pers, rng,
      villain: readStats.view(), slowplayed: G.slowplayed, bluffLine: G.bluffLine,
    });
    // 跨街计谋状态:慢打埋伏与诈唬一线
    G.slowplayed = !!d.trapped;
    G.bluffLine = (d.type === 'bet' || d.type === 'raise') && !!d.bluff;
    applyTell(street, rng);
    oppChar.setActive(false);
    if (d.type === 'fold') { say('fold'); return { type: 'fold' }; }
    if (d.type === 'check') { say('check', 0.3); return { type: 'check' }; }
    if (d.type === 'call') { say('call', 0.35); putChips('o', toCall); return { type: 'call' }; }
    const allin = d.amount >= G.o.stack;
    putChips('o', d.amount);
    say(allin ? 'allin' : (toCall > 0 ? 'raise' : 'bet'), 0.7);
    if (allin) await dramatic(true);
    return { type: 'raise', allin };
  }

  async function bettingRound(street, rng) {
    let actor = street === 0 ? 'p' : 'o';
    const pending = new Set(['p', 'o']);
    G.raisesLeft = 3;
    while (pending.size) {
      if (!pending.has(actor)) { actor = other(actor); continue; }
      if (G.p.stack === 0 || G.o.stack === 0) break;
      const res = actor === 'p' ? await playerAct() : await oppAct(street, rng);
      pending.delete(actor);
      if (res.type === 'fold') return { folded: actor };
      if (res.type === 'raise') { G.raisesLeft--; pending.add(other(actor)); }
      await wait(0.22);
      actor = other(actor);
    }
    await commitBets();
    return { folded: null };
  }

  // ---------- 演出 ----------
  let dramaticOn = false;
  async function dramatic(on) {
    dramaticOn = on;
    ui.vignette(on);
    if (on) { audio.heartStart(); scene.classList.add('allin'); }
    else { audio.heartStop(); scene.classList.remove('allin'); }
  }

  async function dealStreet(street) {
    // 烧牌(只示牌背,迅速飞走淡出)
    audio.card();
    nextCard();
    const burnEl = document.createElement('div');
    burnEl.className = 'burnCard';
    cardLayer.appendChild(burnEl);
    place(burnEl, SLOTS.deck, true);
    await wait(0.02);
    place(burnEl, { x: 10, y: 66 });
    burnEl.style.opacity = 0;
    setTimeout(() => burnEl.remove(), 460);

    if (street === 1) {
      for (let i = 0; i < 3; i++) {
        const id = nextCard();
        G.board.push(id);
        G.boardEls[i] = await dealCard(id, SLOTS.community(i), true);
        await wait(0.12);
      }
    } else {
      const id = nextCard();
      G.board.push(id);
      G.boardEls[street + 1] = await dealCard(id, SLOTS.community(street + 1), true);
    }
    ui.setHand(PK.madeName(G.p.hole, G.board));
  }

  async function showdown() {
    for (const el of G.holeO) { el.classList.add('flipped'); }
    audio.card();
    await wait(0.7);
    const mine = PK.evaluate7([...G.p.hole, ...G.board]);
    const his = PK.evaluate7([...G.o.hole, ...G.board]);
    const cmp = PK.compareScore(mine.score, his.score);
    codexFromShowdown(his.name);

    const winCards = cmp >= 0 ? mine.best5 : his.best5;
    for (const id of winCards) {
      const el = G.meshByCard.get(id);
      if (el) el.classList.add('hl');
    }
    await wait(0.9);

    if (cmp > 0) {
      const wonPot = G.pot;
      ui.banner(mine.name, `你赢下底池 ${wonPot}`);
      audio.win();
      await sweepPot('p');
      say('lose');
      // 士气事件:爆冷(好牌输大池)重创,大池落败小创,连败累积
      const BB = BL(G.blindLv)[1];
      const hisE = PK.postflopEquity(G.o.hole, G.board).e;
      G.oLossStreak++;
      if (hisE >= 0.75 && wonPot >= BB * 6) bumpMorale(-2);
      else if (wonPot >= 300) bumpMorale(-1);
      if (G.oLossStreak >= 3) { bumpMorale(-1); G.oLossStreak = 0; }
    } else if (cmp < 0) {
      const wonPot = G.pot;
      ui.banner(his.name, `他赢下底池 ${wonPot}`);
      await sweepPot('o');
      say('win');
      // 士气事件:大胜得意
      G.oLossStreak = 0;
      if (wonPot >= BL(G.blindLv)[1] * 8) bumpMorale(1);
    } else {
      ui.banner('平分底池', `同为${mine.name}`);
      const half = Math.floor(G.pot / 2);
      G.pot = half; await sweepPot('p');
      G.pot = half; await sweepPot('o');
    }
    await wait(0.7);
  }

  function bumpMorale(n) {
    const before = G.morale;
    G.morale = Math.max(-3, Math.min(2, G.morale + n));
    ui.setTilt(tiltOf());
    oppChar.setTilted(tiltOf() >= 2);
    if (tiltOf() >= 2) ui.bubble(BARK('tilt', LINES.tauntTilt[Math.floor(Math.random() * 2)]));
    else if (n <= -2 && G.morale < before) ui.bubble(BARK('badbeat', '……这一手,记下。'));
    else if (n > 0 && G.morale > 0) ui.bubble(BARK('smug', '承让。'));
  }

  async function resolveFold(loser) {
    const winner = loser === 'p' ? 'o' : 'p';
    await commitBets();
    ui.banner(winner === 'p' ? '他弃牌了' : '你弃牌了', `底池 ${G.pot}`);
    await sweepPot(winner);
    if (winner === 'p') say('fold');
    await wait(0.5);
  }

  // ---------- 一手牌 ----------
  async function playHand() {
    G.handNum++;
    G.taunted = false;
    ui.enableTaunt(true);
    G.p.bet = 0; G.o.bet = 0; G.pot = 0;
    G.board = []; G.p.hole = []; G.o.hole = [];
    ui.setHand('—');
    refreshPiles();

    // 开场白(本场第一手)与专属机制·秋风(第 N 手,他等到了)
    if (G.handNum === 1 && GEN?.barks?.open) ui.bubble(GEN.barks.open, 3.2);
    if (rule.autumnWind && G.handNum === rule.autumnWind) {
      ui.banner('秋风起', '他等到了他要等的。');
      bumpMorale(1);
      await wait(1.4);
    }

    const lv = Math.min(6, Math.floor((G.handNum - 1) / escalateEvery));
    const [SB, BB] = BL(lv);
    ui.setBlind(`盲注 ${SB} / ${BB} · 第 ${G.handNum} 手`);
    if (lv !== G.blindLv) {
      G.blindLv = lv;
      ui.banner('盲注升级', `${SB} / ${BB}`);
      audio.chime();
      await wait(1.1);
    }

    const rng = PK.mulberry32(PK.hashSeed(G.seed + '#' + G.handNum));
    G.deck = PK.shuffle(PK.makeDeck(), rng);
    G.deckPtr = 0;
    G.deckLog = [...G.deck];

    say('deal', G.handNum === 1 && GEN?.barks?.open ? 0 : 0.4);
    putChips('p', SB); await wait(0.3);
    putChips('o', BB); await wait(0.4);

    G.p.hole = [nextCard(), nextCard()];
    G.o.hole = [nextCard(), nextCard()];
    G.holeP[0] = await dealCard(G.p.hole[0], SLOTS.playerHole(0), true, true);
    G.holeO[0] = await dealCard(G.o.hole[0], SLOTS.oppHole(0), false);
    G.holeP[1] = await dealCard(G.p.hole[1], SLOTS.playerHole(1), true, true);
    G.holeO[1] = await dealCard(G.o.hole[1], SLOTS.oppHole(1), false);
    ui.setHand(PK.madeName(G.p.hole, []));

    applyTell(0, rng);
    let r = await bettingRound(0, rng);
    if (r.folded) { await finishHand(r.folded); return; }

    for (const street of [1, 2, 3]) {
      await dealStreet(street);
      applyTell(street, rng);
      if (!(G.p.stack === 0 || G.o.stack === 0)) {
        r = await bettingRound(street, rng);
        if (r.folded) { await finishHand(r.folded); return; }
      } else if (street < 3) {
        await wait(0.6); // 全压后依次亮街
      }
    }
    await showdown();
    await finishHand(null);
  }

  async function finishHand(foldLoser) {
    if (foldLoser) await resolveFold(foldLoser);
    await dramatic(false);
    await clearTable();
    if (G.o.stack <= 0) { G.over = true; return endBattle(true); }
    if (G.p.stack <= 0) { G.over = true; return endBattle(false); }
    await wait(1.1);
  }

  async function endBattle(win) {
    if (win) {
      oppChar.setPose(POSE.NEUTRAL);
      ui.banner(boss ? '关隘已破' : '他被清台了', boss ? '这一页,等你改写' : '他掷杖离席');
      audio.win();
      await wait(1.8);
    }
    cleanup();
    onEnd(win, G.p.stack);
  }

  function cleanup() {
    removeEventListener('resize', relayout);
    oppChar.setTilted(false);
    ui.enableTaunt(false);
    ui.vignette(false);
    ui.setPlayerName?.();
    ui.setTauntLabel?.();
  }

  // 攻心按钮回调注册(激将相性由人格心性决定;章节规则可令攻心无效)
  ui.onTaunt(() => {
    if (G.taunted || G.over) return;
    G.taunted = true;
    ui.enableTaunt(false);
    // 执子之手·观星:不激将,只看破——洞悉其真实之势
    if (opts.zhiZi) {
      const a = G.tell?.actual;
      ui.bubble(a ? `观星 · 其势实为${a === 'strong' ? '强' : a === 'weak' ? '弱' : '中'}` : '观星 · 星象未明', 3);
      audio.chime();
      return;
    }
    if (rule.tauntImmune || PERSONA.tauntMult === 0) {
      ui.bubble(BARK('taunt', '(他不动声色,仿佛没听见。)'));
      audio.thud();
      return;
    }
    G.morale = Math.max(-3, G.morale - PERSONA.tauntMult);
    ui.setTilt(tiltOf());
    oppChar.setTilted(tiltOf() >= 2);
    ui.bubble(tiltOf() >= 2
      ? BARK('tilt', LINES.tauntTilt[Math.floor(Math.random() * 2)])
      : BARK('taunt', LINES.taunt[Math.floor(Math.random() * 2)]));
    audio.thud();
  });
  ui.onVerify(() => {
    const html = G.deckLog.length
      ? G.deckLog.map(id => `<span class="${PK.SUIT_RED[PK.suitOf(id)] ? 'red' : 'blk'}">${PK.cardName(id)}</span>`).join(' ')
      : '第一手尚未发出。';
    ui.showSeedModal('#' + G.seed + ' · 第' + Math.max(1, G.handNum) + '手', html);
  });

  // 玩家看牌
  $('playerCardsHint').classList.remove('hidden');
  cardLayer.addEventListener('pointerdown', e => {
    const t = e.target.closest('.card.big');
    if (t) t.classList.toggle('peek');
  });

  (async () => {
    while (!G.over) await playHand();
  })();
}
