// table.js —— 无 DOM 的多人德州规则:行动轮、总贡献、主/边池与守恒结算
import { compareScore } from './poker.js';

export const potTotal = seats => seats.reduce((sum, seat) => sum + seat.committed, 0);
export const liveSeats = seats => seats.filter(seat => !seat.folded);
export const actionableSeats = seats => seats.filter(seat => !seat.folded && seat.stack > 0);

function nextPos(seats, from, predicate = () => true, include = false) {
  for (let step = include ? 0 : 1; step <= seats.length; step++) {
    const pos = (from + step + seats.length) % seats.length;
    if (predicate(seats[pos], pos)) return pos;
  }
  return -1;
}

function contribute(seat, amount) {
  const actual = Math.max(0, Math.min(seat.stack, Math.round(amount)));
  seat.stack -= actual;
  seat.bet += actual;
  seat.committed += actual;
  return actual;
}

export function createHand(seats, { button = 0, blinds = [10, 20] } = {}) {
  const active = seats.filter(seat => seat.stack > 0);
  if (active.length < 2) throw new Error('至少需要两位有筹码的玩家');
  const buttonId = seats[button]?.stack > 0 ? seats[button].id : active[0].id;
  for (const seat of active) {
    seat.bet = 0;
    seat.committed = 0;
    seat.folded = false;
    seat.handStartStack = seat.stack;
  }
  const H = {
    seats: active,
    button: Math.max(0, active.findIndex(seat => seat.id === buttonId)),
    blinds: [...blinds], currentBet: 0, minRaise: blinds[1], raisesLeft: 3,
    pending: [], actor: null, roundComplete: true, street: 0, sb: 0, bb: 0,
  };
  H.sb = H.seats.length === 2 ? H.button : nextPos(H.seats, H.button);
  H.bb = nextPos(H.seats, H.sb);
  contribute(H.seats[H.sb], blinds[0]);
  contribute(H.seats[H.bb], blinds[1]);
  H.currentBet = Math.max(...H.seats.map(seat => seat.bet));
  beginRound(H, 0);
  return H;
}

function roundDone(H) {
  const live = liveSeats(H.seats);
  if (live.length <= 1) return true;
  const actionable = actionableSeats(live);
  if (!actionable.length || !H.pending.length) return true;
  if (actionable.length === 1 && actionable[0].bet >= H.currentBet) return true;
  return false;
}

export function beginRound(H, street) {
  H.street = street;
  if (street > 0) {
    for (const seat of H.seats) seat.bet = 0;
    H.currentBet = 0;
  }
  H.minRaise = H.blinds[1];
  H.raisesLeft = 3;
  const live = liveSeats(H.seats);
  const actionable = actionableSeats(live);
  H.pending = actionable.map(seat => seat.id);
  H.roundComplete = live.length <= 1 || !actionable.length
    || (actionable.length === 1 && actionable[0].bet >= H.currentBet);
  if (H.roundComplete) {
    H.pending = [];
    H.actor = null;
    return H;
  }
  const first = street === 0
    ? (H.seats.length === 2 ? H.button : nextPos(H.seats, H.bb))
    : nextPos(H.seats, H.button);
  const pendingIds = new Set(H.pending);
  const actorPos = nextPos(H.seats, first, seat => pendingIds.has(seat.id), true);
  H.actor = actorPos >= 0 ? H.seats[actorPos].id : null;
  return H;
}

export function actionView(H, seatId) {
  const seat = H.seats.find(item => item.id === seatId);
  if (!seat) throw new Error(`未知席位:${seatId}`);
  const toCall = Math.max(0, H.currentBet - seat.bet);
  const live = liveSeats(H.seats);
  const canRespond = live.some(other => other.id !== seatId && other.stack > 0);
  const raisesLeft = canRespond ? H.raisesLeft : 0;
  return {
    street: H.street, hole: seat.hole, board: H.board || [],
    toCall, pot: potTotal(H.seats), stack: seat.stack,
    minRaise: H.minRaise, raisesLeft,
    opponents: live.length - 1,
    canRaise: raisesLeft > 0 && seat.stack > toCall && canRespond,
  };
}

function finishAction(H, actorId, reopened) {
  H.pending = H.pending.filter(id => id !== actorId);
  if (reopened) {
    for (const seat of actionableSeats(H.seats)) {
      if (seat.id !== actorId && !H.pending.includes(seat.id)) H.pending.push(seat.id);
    }
  }
  H.roundComplete = roundDone(H);
  if (H.roundComplete) {
    H.actor = null;
    H.pending = [];
    return;
  }
  const from = H.seats.findIndex(seat => seat.id === actorId);
  const pendingIds = new Set(H.pending);
  const pos = nextPos(H.seats, from, seat => pendingIds.has(seat.id));
  H.actor = pos >= 0 ? H.seats[pos].id : null;
}

export function applyAction(H, seatId, decision) {
  if (H.roundComplete || H.actor !== seatId) throw new Error(`未到 ${seatId} 行动`);
  const seat = H.seats.find(item => item.id === seatId);
  const view = actionView(H, seatId);
  // 无人可再响应时，全压只能补齐跟注，不能额外造出未跟注额。
  const type = decision.type === 'allin'
    ? (view.toCall > 0 && (seat.stack <= view.toCall || !view.canRaise) ? 'call' : (!view.canRaise ? 'check' : 'raise'))
    : decision.type;
  let amount = 0;
  let reopened = false;

  if (type === 'fold') {
    if (view.toCall <= 0) throw new Error('无注可弃时不能执行弃牌动作');
    seat.folded = true;
  } else if (type === 'check') {
    if (view.toCall !== 0) throw new Error('有跟注压力时不能过牌');
  } else if (type === 'call') {
    if (view.toCall <= 0) throw new Error('无需跟注时不能跟注');
    amount = contribute(seat, view.toCall);
  } else if (type === 'bet' || type === 'raise') {
    if (type === 'bet' && view.toCall !== 0) throw new Error('有跟注压力时不能下注');
    if (!view.canRaise) throw new Error('当前不能加注');
    const requested = decision.type === 'allin' ? seat.stack : decision.amount;
    const extra = requested - view.toCall;
    if (!(requested > view.toCall)) throw new Error('加注必须超过跟注额');
    if (extra < H.minRaise && requested < seat.stack) throw new Error('加注低于最小加注额');
    amount = contribute(seat, requested);
    if (seat.bet <= H.currentBet) throw new Error('加注未超过当前注额');
    const raisedBy = seat.bet - H.currentBet;
    H.currentBet = seat.bet;
    if (raisedBy >= H.minRaise) H.minRaise = raisedBy;
    H.raisesLeft = Math.max(0, H.raisesLeft - 1);
    reopened = true;
  } else {
    throw new Error(`未知动作:${decision.type}`);
  }

  finishAction(H, seatId, reopened);
  return { type, amount, allin: seat.stack === 0, reopened, folded: seat.folded };
}

export function closeRound(H) {
  for (const seat of H.seats) seat.bet = 0;
  H.currentBet = 0;
  H.pending = [];
  H.actor = null;
  H.roundComplete = true;
}

export function buildPots(seats) {
  const levels = [...new Set(seats.filter(seat => seat.committed > 0).map(seat => seat.committed))].sort((a, b) => a - b);
  const pots = [], refunds = [];
  let previous = 0;
  for (const level of levels) {
    const contributors = seats.filter(seat => seat.committed >= level);
    const amount = (level - previous) * contributors.length;
    previous = level;
    if (contributors.length === 1 && !contributors[0].folded) {
      refunds.push({ id: contributors[0].id, amount });
      continue;
    }
    const eligible = contributors.filter(seat => !seat.folded).map(seat => seat.id);
    if (!eligible.length) {
      if (pots.length) pots[pots.length - 1].amount += amount;
      else pots.push({ amount, eligible: liveSeats(seats).map(seat => seat.id) });
    } else {
      pots.push({ amount, eligible });
    }
  }
  return { pots, refunds };
}

export function settleHand(H, scores = {}) {
  const before = H.seats.reduce((sum, seat) => sum + seat.stack + seat.committed, 0);
  const { pots, refunds } = buildPots(H.seats);
  const awards = Object.fromEntries(H.seats.map(seat => [seat.id, 0]));
  const results = [];
  for (const refund of refunds) {
    awards[refund.id] += refund.amount;
    results.push({ ...refund, refund: true, winners: [refund.id] });
  }
  const order = H.seats.map((_, i) => (H.button + 1 + i) % H.seats.length);
  for (const pot of pots) {
    let best = null;
    let winners = [];
    for (const id of pot.eligible) {
      const score = scores[id];
      if (pot.eligible.length > 1 && !score) throw new Error(`摊牌缺少 ${id} 的牌型评分`);
      const cmp = best ? compareScore(score, best) : 1;
      if (!best || cmp > 0) { best = score; winners = [id]; }
      else if (cmp === 0) winners.push(id);
    }
    const share = Math.floor(pot.amount / winners.length);
    let odd = pot.amount - share * winners.length;
    for (const id of winners) awards[id] += share;
    if (odd) {
      const ranked = [...winners].sort((a, b) => {
        const pa = H.seats.findIndex(seat => seat.id === a), pb = H.seats.findIndex(seat => seat.id === b);
        return order.indexOf(pa) - order.indexOf(pb);
      });
      for (const id of ranked) {
        if (!odd) break;
        awards[id] += 1;
        odd--;
      }
    }
    results.push({ ...pot, winners });
  }
  for (const seat of H.seats) seat.stack += awards[seat.id];
  const after = H.seats.reduce((sum, seat) => sum + seat.stack, 0);
  if (after !== before) throw new Error(`筹码不守恒:${before} -> ${after}`);
  return { awards, pots: results, before, after };
}

export function nextButton(seats, button) {
  if (!seats.length) return 0;
  return nextPos(seats, button, seat => seat.stack > 0);
}
