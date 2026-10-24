// tests/ai-eval/engine.mjs —— 单挑牌局模拟器(复用 src/poker.js,零依赖)
import * as PK from '../../src/poker.js';

// 组牌:C('A','♠') 或 C('A',0);花色可用字符或序号
export const C = (rank, suit) =>
  PK.RANKS.indexOf(rank) * 4 + (typeof suit === 'number' ? suit : PK.SUITS.indexOf(suit));

// ---------------- 反派策略 ----------------
export const villains = {
  station: v => (v.toCall > 0 ? { type: 'call' } : { type: 'check' }),
  folder: v => {
    if (v.toCall === 0) return { type: 'check' };
    if (v.street === 0 && PK.preflopStrength(v.hole) > 0.7) return { type: 'call' };
    return { type: 'fold' };
  },
  maniac: v => {
    if (v.raisesLeft > 0 && v.stack > v.toCall + v.minRaise) {
      return { type: 'raise', amount: v.toCall + Math.max(v.minRaise, Math.round(v.pot)) };
    }
    return v.toCall > 0 ? { type: 'call' } : { type: 'check' };
  },
  mirror: v => PK.aiDecide(v),
};

// ---------------- 单手模拟 ----------------
// ai 固定坐按钮位(小盲,翻牌前先动),与游戏内一致
// read:可选的共享读人跟踪器(跨手积累);缺省每手独立(等价于无读人样本)
export function simulateHand({ rng, aiPersonality, villain, blinds = [10, 20], log = null, legality = null, read = null }) {
  const deck = PK.shuffle(PK.makeDeck(), rng);
  const ai = { hole: [deck[0], deck[2]], bet: 0, stack: 1000 };
  const vil = { hole: [deck[1], deck[3]], bet: 0, stack: 1000 };
  let ptr = 4, pot = 0;
  const board = [];
  ai.bet = Math.min(blinds[0], ai.stack); ai.stack -= ai.bet;
  vil.bet = Math.min(blinds[1], vil.stack); vil.stack -= vil.bet;

  const put = (P, amt) => { amt = Math.min(amt, P.stack); P.stack -= amt; P.bet += amt; };
  let raisesLeft = 3;
  const tracker = read || PK.createRead();            // AI 对 villain 的倾向跟踪
  const aiState = { slowplayed: false, bluffLine: false }; // AI 的跨街计谋状态(每手重置)

  const view = (P, Q, street) => ({
    street, hole: P.hole, board,
    toCall: Q.bet - P.bet, pot: pot + P.bet + Q.bet,
    stack: P.stack, minRaise: blinds[1], raisesLeft,
    personality: aiPersonality, rng,
  });

  function checkLegality(d, P, Q) {
    const toCall = Q.bet - P.bet;
    if (!['fold', 'check', 'call', 'bet', 'raise', 'allin'].includes(d.type)) return '未知动作:' + d.type;
    if (d.type === 'fold' && toCall === 0) return '免费时弃牌';
    if (d.type === 'call' && toCall === 0) return '无需跟注时跟注';
    if (d.type === 'check' && toCall > 0) return '有跟注压力时过牌';
    if ((d.type === 'bet' || d.type === 'raise')) {
      if (!(d.amount > 0)) return '下注无量';
      if (d.amount > P.stack) return '下注超出筹码';
      if (d.type === 'bet' && toCall !== 0) return '有跟注时下注';
      if (d.type === 'raise' && toCall === 0) return '无注可加却加注';
    }
    return null;
  }

  const apply = (P, Q, d) => {
    switch (d.type) {
      case 'fold': return 'fold';
      case 'check': return 'check';
      case 'call': put(P, Q.bet - P.bet); return 'call';
      case 'bet': case 'raise': put(P, d.amount); return 'raise';
      case 'allin': put(P, P.stack); return 'raise';
    }
  };

  const commit = () => {
    const matched = Math.min(ai.bet, vil.bet);
    const excess = Math.abs(ai.bet - vil.bet);
    if (excess) { if (ai.bet > vil.bet) ai.stack += excess; else vil.stack += excess; }
    pot += matched * 2; ai.bet = 0; vil.bet = 0;
  };

  const bettingRound = (street, first) => {
    const pending = new Set(['ai', 'vil']);
    let actor = first;
    raisesLeft = 3;
    while (pending.size) {
      if (!pending.has(actor)) { actor = actor === 'ai' ? 'vil' : 'ai'; continue; }
      if (ai.stack === 0 || vil.stack === 0) break;
      const isAI = actor === 'ai';
      const P = isAI ? ai : vil, Q = isAI ? vil : ai;
      const v = view(P, Q, street);
      if (isAI) { // 读人输入与计谋状态只喂给 AI 侧
        v.villain = tracker.view();
        v.slowplayed = aiState.slowplayed;
        v.bluffLine = aiState.bluffLine;
      }
      const d = isAI ? PK.aiDecide(v) : villain(v);
      if (isAI) {
        const bad = checkLegality(d, P, Q);
        if (bad && legality) legality.push({ street, hole: [...P.hole], board: [...board], toCall: v.toCall, d, bad });
        if (log) log.push({ street, toCall: v.toCall, pot: v.pot, hole: [...P.hole], board: [...board], d });
      }
      const r = apply(P, Q, d);
      if (isAI) {
        aiState.slowplayed = !!d.trapped;
        aiState.bluffLine = (d.type === 'bet' || d.type === 'raise') && !!d.bluff;
      } else {
        tracker.track(v.toCall, d.type);
      }
      pending.delete(actor);
      if (r === 'fold') return { folded: actor };
      if (r === 'raise') { raisesLeft--; pending.add(isAI ? 'vil' : 'ai'); }
      actor = isAI ? 'vil' : 'ai';
    }
    commit();
    return { folded: null };
  };

  let r = bettingRound(0, 'ai');
  if (!r.folded) {
    for (const street of [1, 2, 3]) {
      ptr += 1;
      board.push(...(street === 1 ? [deck[ptr], deck[ptr + 1], deck[ptr + 2]] : [deck[ptr]]));
      ptr += street === 1 ? 3 : 1;
      if (ai.stack === 0 || vil.stack === 0) continue;
      r = bettingRound(street, 'vil');
      if (r.folded) break;
    }
  }

  commit(); // 收拢剩余注额(弃牌时也在此退还未跟注部分)
  let showdown = false;
  if (r.folded) {
    const winner = r.folded === 'ai' ? vil : ai;
    winner.stack += pot;
  } else {
    showdown = true;
    const m = PK.evaluate7([...ai.hole, ...board]);
    const h = PK.evaluate7([...vil.hole, ...board]);
    const cmp = PK.compareScore(m.score, h.score);
    if (cmp > 0) ai.stack += pot;
    else if (cmp < 0) vil.stack += pot;
    else { ai.stack += pot / 2; vil.stack += pot / 2; }
  }
  return { deltaAi: ai.stack - 1000, showdown, aiWon: ai.stack > 1000, tied: ai.stack === 1000 };
}

// ---------------- 决策探针 ----------------
export function probe({ state, personality, n = 400, seed = 7 }) {
  const rng = PK.mulberry32(seed);
  const counts = {};
  for (let i = 0; i < n; i++) {
    const d = PK.aiDecide({ ...state, personality, rng });
    counts[d.type] = (counts[d.type] || 0) + 1;
  }
  const pct = (...types) => types.reduce((s, t) => s + (counts[t] || 0), 0) / n * 100;
  return { counts, pct };
}

// 随机局面生成器
export function randomState(rng, personality, { forceToCall = false } = {}) {
  const deck = PK.shuffle(PK.makeDeck(), rng);
  const street = Math.floor(rng() * 4);
  const nBoard = [0, 3, 4, 5][street];
  return {
    street, hole: deck.slice(0, 2), board: deck.slice(2, 2 + nBoard),
    toCall: forceToCall ? 1 + Math.floor(rng() * 150) : Math.floor(rng() * 150),
    pot: 20 + Math.floor(rng() * 400),
    stack: 800, minRaise: 20, raisesLeft: 1, personality, rng,
  };
}
