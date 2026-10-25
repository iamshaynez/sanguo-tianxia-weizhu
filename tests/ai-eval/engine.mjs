// tests/ai-eval/engine.mjs —— 与正式游戏共用 table.js 的牌局模拟器(零依赖)
import * as PK from '../../src/poker.js';
import * as T from '../../src/table.js';

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
// AI 固定坐按钮位(小盲,翻牌前先动),与正式游戏的单挑特殊座位规则一致。
export function simulateHand({ rng, aiPersonality, villain, blinds = [10, 20], log = null, legality = null, read = null }) {
  const deck = PK.shuffle(PK.makeDeck(), rng);
  const ai = { id: 'ai', hole: [deck[0], deck[2]], stack: 1000 };
  const vil = { id: 'vil', hole: [deck[1], deck[3]], stack: 1000 };
  const H = T.createHand([ai, vil], { button: 0, blinds });
  H.board = [];
  let ptr = 4;
  const tracker = read || PK.createRead();
  const aiState = { slowplayed: false, bluffLine: false };

  function checkLegality(d, view) {
    if (!['fold', 'check', 'call', 'bet', 'raise', 'allin'].includes(d.type)) return '未知动作:' + d.type;
    if (d.type === 'fold' && view.toCall === 0) return '免费时弃牌';
    if (d.type === 'call' && view.toCall === 0) return '无需跟注时跟注';
    if (d.type === 'check' && view.toCall > 0) return '有跟注压力时过牌';
    if ((d.type === 'bet' || d.type === 'raise')) {
      if (!(d.amount > 0)) return '下注无量';
      if (d.amount > view.stack) return '下注超出筹码';
      if (d.type === 'bet' && view.toCall !== 0) return '有跟注时下注';
      if (d.type === 'raise' && view.toCall === 0 && view.currentBet > 0) return '无注可加却加注';
    }
    return null;
  }

  function bettingRound(street) {
    T.beginRound(H, street);
    while (!H.roundComplete) {
      const actor = H.actor;
      const isAI = actor === 'ai';
      const seat = isAI ? ai : vil;
      const view = { ...T.actionView(H, actor), personality: aiPersonality, rng };
      if (isAI) {
        view.villain = tracker.view();
        view.slowplayed = aiState.slowplayed;
        view.bluffLine = aiState.bluffLine;
      }
      const decision = isAI ? PK.aiDecide(view) : villain(view);
      if (isAI) {
        const bad = checkLegality(decision, view);
        if (bad && legality) legality.push({ street, hole: [...seat.hole], board: [...H.board], toCall: view.toCall, d: decision, bad });
        if (log) log.push({ street, toCall: view.toCall, pot: view.pot, hole: [...seat.hole], board: [...H.board], d: decision });
      }
      T.applyAction(H, actor, decision);
      if (isAI) {
        aiState.slowplayed = !!decision.trapped;
        aiState.bluffLine = (decision.type === 'bet' || decision.type === 'raise') && !!decision.bluff;
      } else {
        tracker.track(view.toCall, decision.type);
      }
    }
    T.closeRound(H);
  }

  bettingRound(0);
  if (T.liveSeats(H.seats).length > 1) {
    for (const street of [1, 2, 3]) {
      ptr += 1;
      H.board.push(...(street === 1 ? [deck[ptr], deck[ptr + 1], deck[ptr + 2]] : [deck[ptr]]));
      ptr += street === 1 ? 3 : 1;
      bettingRound(street);
      if (T.liveSeats(H.seats).length <= 1) break;
    }
  }

  const live = T.liveSeats(H.seats);
  const showdown = live.length > 1;
  const scores = {};
  if (showdown) {
    for (const seat of live) scores[seat.id] = PK.evaluate7([...seat.hole, ...H.board]).score;
  }
  T.settleHand(H, scores);
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
  const pct = (...types) => types.reduce((sum, type) => sum + (counts[type] || 0), 0) / n * 100;
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
