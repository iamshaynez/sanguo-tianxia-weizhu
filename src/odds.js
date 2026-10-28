// odds.js —— 仅基于公开信息的胜率、终局牌型分布与 outs 分析。
import {
  HAND_NAMES, estimateEquity, evaluate7, hashSeed,
  madeName, makeDeck, mulberry32, rankOf, shuffle,
} from './poker.js';

function validate(hole, board, opponents) {
  if (!Array.isArray(hole) || hole.length !== 2) throw new Error('手牌必须为两张');
  if (!Array.isArray(board) || ![0, 3, 4, 5].includes(board.length)) throw new Error('公共牌必须为 0、3、4 或 5 张');
  if (!Number.isInteger(opponents) || opponents < 1 || opponents > 9) throw new Error('对手数必须为 1 到 9');
  const known = [...hole, ...board];
  if (new Set(known).size !== known.length || known.some(id => !Number.isInteger(id) || id < 0 || id >= 52)) {
    throw new Error('手牌或公共牌包含重复/非法牌');
  }
}

function distributionResult(counts, runouts, exact) {
  const categories = counts.map(count => count / runouts);
  return { categories, runouts, exact };
}

// 翻牌/转牌/河牌穷举所有剩余公共牌;翻牌前只抽样,避免 171 万种组合阻塞。
function finalHandDistribution(hole, board, deck, { runs, rng }) {
  const counts = Array(9).fill(0);
  let runouts = 0;
  const record = cards => { counts[evaluate7(cards).cat]++; runouts++; };

  if (board.length >= 3) {
    const missing = 5 - board.length;
    if (missing === 0) record([...hole, ...board]);
    else if (missing === 1) {
      for (const card of deck) record([...hole, ...board, card]);
    } else if (missing === 2) {
      for (let a = 0; a < deck.length - 1; a++) {
        for (let b = a + 1; b < deck.length; b++) record([...hole, ...board, deck[a], deck[b]]);
      }
    }
    return distributionResult(counts, runouts, true);
  }

  for (let run = 0; run < runs; run++) {
    const cards = shuffle(deck.slice(), rng).slice(0, 5);
    record([...hole, ...cards]);
  }
  return distributionResult(counts, runouts, false);
}

// outs 与终局概率均按最终最佳牌型互斥归类,同花顺不会被重复计作同花。
function drawAnalysis(hole, board, deck, currentCat, distribution) {
  if (![3, 4].includes(board.length)) return [];
  const outs = Array.from({ length: 9 }, () => []);
  for (const card of deck) {
    const cat = evaluate7([...hole, ...board, card]).cat;
    if (cat > currentCat) outs[cat].push(card);
  }
  const draws = [];
  for (let cat = Math.max(1, currentCat + 1); cat <= 8; cat++) {
    if (!outs[cat].length) continue;
    draws.push({
      cat, name: HAND_NAMES[cat], probability: distribution.categories[cat],
      nextProbability: outs[cat].length / deck.length, outs: outs[cat],
    });
  }
  return draws.sort((a, b) => b.probability - a.probability || b.cat - a.cat);
}

export function analyzeOdds(hole, board = [], { opponents = 1, runs } = {}) {
  validate(hole, board, opponents);
  const simulationRuns = runs ?? (opponents > 1 ? 1200 : 1800);
  if (!Number.isInteger(simulationRuns) || simulationRuns < 100) throw new Error('模拟次数必须为不少于 100 的整数');

  const cards = [...hole].sort((a, b) => a - b).join(',') + '|' + [...board].sort((a, b) => a - b).join(',');
  const seed = hashSeed(`public-odds-v1|${cards}|${opponents}`);
  const equity = estimateEquity(hole, board, {
    opponents, runs: simulationRuns, rng: mulberry32(seed),
  });
  const deck = makeDeck().filter(id => ![...hole, ...board].includes(id));
  const distribution = finalHandDistribution(hole, board, deck, {
    runs: simulationRuns, rng: mulberry32(seed ^ 0x9e3779b9),
  });
  const evaluated = board.length >= 3 ? evaluate7([...hole, ...board]) : null;
  const currentCat = evaluated?.cat ?? (rankOf(hole[0]) === rankOf(hole[1]) ? 1 : 0);

  return {
    equity, distribution,
    draws: drawAnalysis(hole, board, deck, currentCat, distribution),
    current: evaluated || { cat: currentCat, name: madeName(hole, board) },
    opponents, street: board.length, model: 'random-opponents',
  };
}
