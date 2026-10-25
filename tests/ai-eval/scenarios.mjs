// tests/ai-eval/scenarios.mjs —— AI 行为评估场景库
import * as PK from '../../src/poker.js';
import { C, villains, simulateHand, probe, randomState } from './engine.mjs';
import { makePersona, describeTraits, estimateDifficulty, TRAITS } from '../../src/persona.js';
import { CHAPTERS } from '../../src/chapters.js';
import { GENERALS } from '../../src/generals.js';
import { multiwayScenarios } from './multiway-scenarios.mjs';

const P0 = { aggr: 0.8, bluff: 0.16, tilt: 0 };
const P3 = { aggr: 0.8, bluff: 0.16, tilt: 3 };
const MARGINAL_TURN = {
  street: 2, hole: [C('2', 0), C('2', 1)],
  board: [C('K', 2), C('Q', 3), C('8', 0), C('A', 1)],
  pot: 100, stack: 900, minRaise: 20, raisesLeft: 1, equityRuns: 1200,
};

// 单手日志(每手独立收集,便于跨街分析;read 跟踪器跨手共享,读人才能积累样本)
function handLogs(personality, villain, hands, seed) {
  const rng = PK.mulberry32(seed);
  const read = PK.createRead();
  const out = [];
  for (let i = 0; i < hands; i++) {
    const log = [];
    simulateHand({ rng, aiPersonality: personality, villain, log, read });
    out.push(log);
  }
  return out;
}
const flat = logs => logs.flat();

export const scenarios = [
  // ---------- 零、胜率引擎 ----------
  {
    id: 'equity_strength_and_player_count',
    group: '胜率引擎',
    desc: 'AA > KK > 72o,同一手牌随对手增加而权益下降',
    run() {
      const measure = (hole, opponents = 1) => PK.estimateEquity(hole, [], {
        opponents, runs: 800, rng: PK.mulberry32(1001),
      });
      const aa = measure([C('A', 0), C('A', 1)]);
      const kk = measure([C('K', 0), C('K', 1)]);
      const trash = measure([C('7', 0), C('2', 2)]);
      const multi = measure([C('A', 0), C('A', 1)], 3);
      const ok = aa.e > kk.e && kk.e > trash.e && aa.e > multi.e && aa.e > 0.78 && trash.e < 0.45;
      return {
        actual: `AA ${aa.e.toFixed(3)} / KK ${kk.e.toFixed(3)} / 72o ${trash.e.toFixed(3)} / AA vs3 ${multi.e.toFixed(3)}`,
        pass: ok,
      };
    },
  },
  {
    id: 'preflop_table_complete',
    group: '胜率引擎',
    desc: '169 类翻牌前胜率全部可查且处于 0..1',
    run() {
      let count = 0, valid = true;
      for (let hi = 0; hi < 13; hi++) for (let lo = 0; lo <= hi; lo++) {
        for (const kind of hi === lo ? [''] : ['s', 'o']) {
          const hole = hi === lo ? [hi * 4, hi * 4 + 1] : [hi * 4, lo * 4 + (kind === 's' ? 0 : 1)];
          const e = PK.preflopEquity(hole);
          count++;
          if (!(e > 0 && e < 1)) valid = false;
        }
      }
      const rejected = [[], [0], [0, 0], [52, 1], ['0', 1]].every(hole => {
        try { PK.preflopEquity(hole); return false; } catch { return true; }
      });
      return { actual: `${count} 类 / 全部有效 ${valid} / 非法输入拒绝 ${rejected}`, pass: count === 169 && valid && rejected };
    },
  },
  {
    id: 'equity_multiway_split_share',
    group: '胜率引擎',
    desc: '四人共有皇家同花顺:权益精确为 1/4,而非固定半池',
    run() {
      const board = [C('A', 0), C('K', 0), C('Q', 0), C('J', 0), C('10', 0)];
      const r = PK.estimateEquity([C('7', 1), C('2', 2)], board, {
        opponents: 3, runs: 24, rng: PK.mulberry32(1002),
      });
      const ok = r.win === 0 && r.tie === 1 && r.loss === 0 && Math.abs(r.e - 0.25) < 1e-9;
      return { actual: `win ${r.win} / tie ${r.tie} / equity ${r.e}`, pass: ok };
    },
  },
  {
    id: 'equity_seed_and_inputs_reproduce',
    group: '胜率引擎',
    desc: '同种子结果一致,且不修改手牌或公共牌输入',
    run() {
      const hole = [C('A', 0), C('K', 1)], board = [C('Q', 2), C('7', 3), C('2', 0)];
      const before = JSON.stringify({ hole, board });
      const measure = () => PK.estimateEquity(hole, board, {
        opponents: 2, runs: 400, rng: PK.mulberry32(1003),
      });
      const a = measure(), b = measure();
      const same = JSON.stringify(a) === JSON.stringify(b);
      const unchanged = before === JSON.stringify({ hole, board });
      return { actual: `复现 ${same} / 输入不变 ${unchanged} / e=${a.e}`, pass: same && unchanged };
    },
  },
  {
    id: 'equity_decision_sequence_reproducible',
    group: '胜率引擎',
    desc: '同一初始种子的完整 AI 决策序列可复现',
    run() {
      const state = { street: 1, hole: [C('8', 0), C('8', 1)], board: [C('K', 2), C('5', 3), C('2', 0)], toCall: 70, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 };
      const play = () => {
        const rng = PK.mulberry32(1004);
        return Array.from({ length: 24 }, () => PK.aiDecide({ ...state, personality: P0, rng }));
      };
      const a = play(), b = play();
      const same = JSON.stringify(a) === JSON.stringify(b);
      return { actual: `${a.map(d => d.type).join(',')} / 复现 ${same}`, pass: same };
    },
  },
  {
    id: 'equity_performance_budget',
    group: '胜率引擎',
    desc: '1000 次单挑模拟在 500ms 内完成',
    run() {
      const start = performance.now();
      const r = PK.estimateEquity([C('A', 0), C('K', 1)], [C('Q', 2), C('7', 3), C('2', 0)], {
        runs: 1000, rng: PK.mulberry32(1005),
      });
      const ms = performance.now() - start;
      return { actual: `${ms.toFixed(1)}ms / e=${r.e.toFixed(3)}`, pass: ms < 500 };
    },
  },

  // ---------- 一、基础纪律 ----------
  {
    id: 'preflop_premium_never_folds',
    group: '基础纪律',
    desc: 'AA/KK 面对加注,弃牌率 = 0%',
    run() {
      for (const hole of [[C('A', 0), C('A', 1)], [C('K', 0), C('K', 1)]]) {
        const r = probe({
          state: { street: 0, hole, board: [], toCall: 60, pot: 90, stack: 940, minRaise: 20, raisesLeft: 1 },
          personality: P0,
        });
        if (r.pct('fold') !== 0) return { actual: `fold ${r.pct('fold').toFixed(1)}%`, pass: false };
      }
      return { actual: '0.0%', pass: true };
    },
  },
  {
    id: 'preflop_trash_folds_to_pressure',
    group: '基础纪律',
    desc: '72o 面对大加注,弃牌率 ≥ 80%',
    run() {
      const r = probe({
        state: { street: 0, hole: [C('7', 0), C('2', 2)], board: [], toCall: 100, pot: 150, stack: 900, minRaise: 20, raisesLeft: 1 },
        personality: P0,
      });
      const v = r.pct('fold');
      return { actual: v.toFixed(1) + '%', pass: v >= 80 };
    },
  },
  {
    id: 'no_fold_when_free',
    group: '基础纪律',
    desc: '无跟注压力时绝不弃牌(200 随机局面)',
    run() {
      const rng = PK.mulberry32(42);
      let folds = 0;
      for (let i = 0; i < 200; i++) {
        const s = randomState(rng, P0);
        s.toCall = 0;
        const d = PK.aiDecide(s);
        if (d.type === 'fold') folds++;
      }
      return { actual: `${folds} 次`, pass: folds === 0 };
    },
  },
  {
    id: 'premium_raises_for_value',
    group: '基础纪律',
    desc: 'KK 面对跟注,加注率 ≥ 70%',
    run() {
      const r = probe({
        state: { street: 0, hole: [C('K', 0), C('K', 1)], board: [], toCall: 0, pot: 30, stack: 990, minRaise: 20, raisesLeft: 1 },
        personality: P0,
      });
      const v = r.pct('bet', 'raise');
      return { actual: v.toFixed(1) + '%', pass: v >= 70 };
    },
  },

  // ---------- 二、翻牌后判断 ----------
  {
    id: 'nuts_never_fold',
    group: '翻牌后',
    desc: '四条面对下注,弃牌率 = 0% 且加注率 ≥ 80%',
    run() {
      const r = probe({
        state: { street: 1, hole: [C('A', 0), C('A', 1)], board: [C('A', 2), C('A', 3), C('K', 0)], toCall: 100, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 },
        personality: P0,
      });
      const f = r.pct('fold'), ra = r.pct('raise');
      return { actual: `fold ${f}% / raise ${ra.toFixed(1)}%`, pass: f === 0 && ra >= 80 };
    },
  },
  {
    id: 'air_folds_bigbet',
    group: '翻牌后',
    desc: '纯空气无听牌面对 1.2 倍底池注,弃牌率 ≥ 65%',
    run() {
      const r = probe({
        state: { street: 1, hole: [C('7', 0), C('2', 1)], board: [C('K', 2), C('9', 3), C('4', 0)], toCall: 120, pot: 100, stack: 880, minRaise: 20, raisesLeft: 1 },
        personality: P0,
      });
      const v = r.pct('fold');
      return { actual: v.toFixed(1) + '%', pass: v >= 65 };
    },
  },
  {
    id: 'potodds_monotonic',
    group: '翻牌后',
    desc: '中等对子:底池赔率越差,跟注率单调不增',
    run() {
      const mk = toCall => probe({
        state: { street: 1, hole: [C('8', 0), C('8', 1)], board: [C('K', 2), C('5', 3), C('2', 0)], toCall, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 },
        personality: P0, seed: 99,
      }).pct('call', 'raise');
      const a = mk(30), b = mk(100), c = mk(300);
      return {
        actual: `0.3池 ${a.toFixed(0)}% → 1池 ${b.toFixed(0)}% → 3池 ${c.toFixed(0)}%`,
        pass: a >= b && b >= c && a > c,
      };
    },
  },
  {
    id: 'draws_price_sensitive',
    group: '翻牌后',
    desc: '同花听牌:0.4 池注继续率 ≥ 55%,5 池注弃牌率 ≥ 70%',
    run() {
      const base = { street: 1, hole: [C('A', 0), C('5', 0)], board: [C('K', 0), C('7', 0), C('2', 1)], stack: 900, minRaise: 20, raisesLeft: 1 };
      const cheap = probe({ state: { ...base, toCall: 40, pot: 100 }, personality: P0, seed: 5 });
      const dear = probe({ state: { ...base, toCall: 500, pot: 100 }, personality: P0, seed: 5 });
      const cont = cheap.pct('call', 'raise'), fold = dear.pct('fold');
      return { actual: `小注继续 ${cont.toFixed(0)}% / 巨注弃牌 ${fold.toFixed(0)}%`, pass: cont >= 55 && fold >= 70 };
    },
  },

  // ---------- 三、情绪模型 ----------
  {
    id: 'tilt_loosens_calls',
    group: '情绪模型',
    desc: '上头(tilt3)对边缘低对大注的跟注率显著高于冷静(≥25 点)',
    run() {
      const state = { ...MARGINAL_TURN, toCall: 100 };
      const calm = probe({ state, personality: P0, seed: 11 }).pct('call', 'raise');
      const hot = probe({ state, personality: P3, seed: 11 }).pct('call', 'raise');
      const gap = hot - calm;
      return { actual: `冷静 ${calm.toFixed(0)}% → 上头 ${hot.toFixed(0)}%(+${gap.toFixed(0)})`, pass: gap >= 25 };
    },
  },
  {
    id: 'tilt_boosts_aggression',
    group: '情绪模型',
    desc: '上头后主动进攻率显著提升(≥25 点)',
    run() {
      const state = { ...MARGINAL_TURN, toCall: 0 };
      const calm = probe({ state, personality: P0, seed: 13 }).pct('bet', 'raise');
      const hot = probe({ state, personality: P3, seed: 13 }).pct('bet', 'raise');
      const gap = hot - calm;
      return { actual: `冷静 ${calm.toFixed(0)}% → 上头 ${hot.toFixed(0)}%(+${gap.toFixed(0)})`, pass: gap >= 25 };
    },
  },
  {
    id: 'bluff_bounded',
    group: '情绪模型',
    desc: '诈唬有节制:500 随机翻牌前受压局面,诈唬加注率 ≤ 12%',
    run() {
      const rng = PK.mulberry32(2024);
      let bluffs = 0;
      for (let i = 0; i < 500; i++) {
        const s = randomState(rng, P0, { forceToCall: true });
        s.street = 0; s.board = [];
        const d = PK.aiDecide(s);
        if (d.type === 'raise' && d.bluff) bluffs++;
      }
      const v = bluffs / 500 * 100;
      return { actual: v.toFixed(1) + '%', pass: v <= 12 };
    },
  },

  // ---------- 四、合法性与长期对抗 ----------
  {
    id: 'legality_property',
    group: '合法性',
    desc: '2000 随机局面:零非法动作',
    run() {
      const rng = PK.mulberry32(777);
      const bad = [];
      for (let i = 0; i < 2000; i++) {
        const s = randomState(rng, P0);
        const d = PK.aiDecide(s);
        if (d.type === 'fold' && s.toCall === 0) bad.push('免费弃牌');
        if ((d.type === 'bet' || d.type === 'raise') && d.amount > s.stack) bad.push('超筹码');
        if (d.type === 'bet' && s.toCall > 0) bad.push('受压下注');
        if (d.type === 'raise' && s.raisesLeft === 0) bad.push('超加注帽');
      }
      return { actual: `${bad.length} 例${bad[0] ? ':' + bad[0] : ''}`, pass: bad.length === 0 };
    },
  },
  {
    id: 'ai_beats_station',
    group: '长期对抗',
    desc: 'vs 跟注站 2000 手:净筹码 > 0',
    run() {
      const rng = PK.mulberry32(31415);
      let delta = 0, wins = 0, showdowns = 0;
      const legality = [];
      for (let i = 0; i < 2000; i++) {
        const r = simulateHand({ rng, aiPersonality: P0, villain: villains.station, legality });
        delta += r.deltaAi;
        if (r.aiWon) wins++;
        if (r.showdown) showdowns++;
      }
      const per = delta / 2000;
      return {
        actual: `均手 +${per.toFixed(1)} 筹码,胜率 ${(wins / 2000 * 100).toFixed(1)}%,摊牌率 ${(showdowns / 2000 * 100).toFixed(0)}%,非法 ${legality.length}`,
        pass: delta > 0 && legality.length === 0,
      };
    },
  },
  {
    id: 'ai_beats_maniac',
    group: '长期对抗',
    desc: 'vs 疯子 1000 手:净筹码 > 0',
    run() {
      const rng = PK.mulberry32(2718);
      let delta = 0;
      const legality = [];
      for (let i = 0; i < 1000; i++) {
        const r = simulateHand({ rng, aiPersonality: P0, villain: villains.maniac, legality });
        delta += r.deltaAi;
      }
      const per = delta / 1000;
      return { actual: `均手 +${per.toFixed(1)} 筹码,非法 ${legality.length}`, pass: delta > 0 && legality.length === 0 };
    },
  },
  {
    id: 'mirror_fairness',
    group: '长期对抗',
    desc: '镜像自搏 3000 手:胜率落在 44%~56%',
    run() {
      const rng = PK.mulberry32(1618);
      let aiWins = 0, ties = 0;
      for (let i = 0; i < 3000; i++) {
        const r = simulateHand({ rng, aiPersonality: P0, villain: villains.mirror });
        if (r.tied) ties++;
        else if (r.aiWon) aiWins++;
      }
      const share = aiWins / (3000 - ties) * 100;
      return { actual: `按钮位胜率 ${share.toFixed(1)}%(平局 ${ties})`, pass: share >= 44 && share <= 56 };
    },
  },
  {
    id: 'overbet_discipline',
    group: '长期对抗',
    desc: 'vs 超额加压:强牌继续率 ≥80%,弱牌且赔率不足时弃牌率 ≥55%',
    run() {
      const overbet = v => {
        if (v.raisesLeft > 0 && v.stack > v.toCall + v.minRaise) {
          return { type: 'raise', amount: Math.min(v.stack, v.toCall + Math.max(v.minRaise, Math.round(v.pot * 3))) };
        }
        return v.toCall > 0 ? { type: 'call' } : { type: 'check' };
      };
      const rng = PK.mulberry32(888);
      const log = [];
      for (let i = 0; i < 400; i++) simulateHand({ rng, aiPersonality: P0, villain: overbet, log });
      const pre = log.filter(e => e.street === 0 && e.toCall > 0);
      const strong = pre.filter(e => PK.preflopStrength(e.hole) > 0.75);
      const weak = pre.filter(e => PK.preflopStrength(e.hole) < 0.3 && e.toCall / (e.pot + e.toCall) >= 0.4);
      const cont = strong.filter(e => e.d.type !== 'fold').length / Math.max(1, strong.length) * 100;
      const fold = weak.filter(e => e.d.type === 'fold').length / Math.max(1, weak.length) * 100;
      return {
        actual: `强牌继续 ${cont.toFixed(0)}%(${strong.length} 例)/ 弱牌坏赔率弃牌 ${fold.toFixed(0)}%(${weak.length} 例)`,
        pass: cont >= 80 && fold >= 55 && weak.length >= 10,
      };
    },
  },

  // ---------- 五、战术维度(机制证明:每个维度都真实改变牌局) ----------
  {
    id: 'd_read_adapts_bluff',
    group: '战术维度',
    desc: '读人:同一读人型人格,对弃牌型的诈唬份额 ≥ 对跟注站的 3 倍',
    run() {
      const reader = { aggr: 0.8, bluff: 0.25, read: 0.9, courage: 1 };
      const logF = flat(handLogs(reader, villains.folder, 600, 101));
      const logS = flat(handLogs(reader, villains.station, 600, 101));
      const share = log => log.filter(e => e.d.bluff).length / Math.max(1, log.length);
      const f = share(logF), s = share(logS);
      const ratio = f / Math.max(0.0001, s);
      return { actual: `对弃牌型 ${(f * 100).toFixed(1)}% vs 对跟注站 ${(s * 100).toFixed(2)}%(×${ratio.toFixed(1)})`, pass: ratio >= 3 };
    },
  },
  {
    id: 'd_semi_bluff_draws',
    group: '战术维度',
    desc: '半诈唬:semi 0.9 的听牌份额高 ≥20 点,semi 0.1 仍以空气为主',
    run() {
      const drawShare = semi => {
        const log = flat(handLogs({ aggr: 0.8, bluff: 0.3, semi, courage: 1 }, villains.station, 600, 202));
        const bluffs = log.filter(e => e.d.bluff && e.street > 0);
        const withDraw = bluffs.filter(e => {
          const q = PK.postflopEquity(e.hole, e.board);
          return q.flushDraw || q.oesd;
        }).length;
        return withDraw / Math.max(1, bluffs.length) * 100;
      };
      const hi = drawShare(0.9), lo = drawShare(0.1);
      // 真实胜率会提高听牌在诈唬中的自然占比,但低 semi 仍必须让空气过半。
      return { actual: `semi0.9 → ${hi.toFixed(0)}% 带听牌 / semi0.1 → ${lo.toFixed(0)}%(差 ${(hi - lo).toFixed(0)})`, pass: hi >= 38 && hi - lo >= 20 && lo < 50 };
    },
  },
  {
    id: 'd_trap_slowplay_and_spring',
    group: '战术维度',
    desc: '慢打:四条遇注,trap0.8 跟注埋伏率 ≥55%;上手埋伏后遇注收网加注率 ≥90%',
    run() {
      const quads = { street: 1, hole: [C('A', 0), C('A', 1)], board: [C('A', 2), C('A', 3), C('K', 0)], toCall: 100, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 };
      const trapper = { aggr: 0.8, bluff: 0.1, trap: 0.8, courage: 1 };
      const slow = probe({ state: quads, personality: trapper });
      const spring = probe({ state: { ...quads, street: 2, slowplayed: true }, personality: trapper });
      return {
        actual: `埋伏跟注 ${slow.pct('call').toFixed(0)}% / 收网加注 ${spring.pct('raise').toFixed(0)}%`,
        pass: slow.pct('call') >= 55 && spring.pct('raise') >= 90,
      };
    },
  },
  {
    id: 'd_callbias_widens_calls',
    group: '战术维度',
    desc: '火候:边缘对子遇 0.9 池注,callBias 0.09 比 0 的继续率高 ≥25 点',
    run() {
      const state = { ...MARGINAL_TURN, toCall: 90 };
      const loose = probe({ state, personality: { aggr: 0.8, bluff: 0.16, callBias: 0.09, courage: 1 }, seed: 31 });
      const tight = probe({ state, personality: { aggr: 0.8, bluff: 0.16, callBias: 0, courage: 1 }, seed: 31 });
      const gap = loose.pct('call', 'raise') - tight.pct('call', 'raise');
      return { actual: `爱跟 ${loose.pct('call', 'raise').toFixed(0)}% vs 谨跟 ${tight.pct('call', 'raise').toFixed(0)}%(+${gap.toFixed(0)})`, pass: gap >= 25 };
    },
  },
  {
    id: 'd_courage_holds_pressure',
    group: '战术维度',
    desc: '抗压:边缘对子遇重压,courage 0.8 比 0.2 的继续率高 ≥25 点',
    run() {
      const state = { ...MARGINAL_TURN, toCall: 90 };
      const brave = probe({ state, personality: { aggr: 0.8, bluff: 0.16, callBias: 0.08, courage: 0.8 }, seed: 37 });
      const timid = probe({ state, personality: { aggr: 0.8, bluff: 0.16, callBias: 0.08, courage: 0.2 }, seed: 37 });
      const gap = brave.pct('call', 'raise') - timid.pct('call', 'raise');
      return { actual: `胆大 ${brave.pct('call', 'raise').toFixed(0)}% vs 胆怯 ${timid.pct('call', 'raise').toFixed(0)}%(+${gap.toFixed(0)})`, pass: gap >= 25 };
    },
  },
  {
    id: 'd_morale_rage_vs_sulk',
    group: '战术维度',
    desc: '士气:同受重挫,rage 进攻率比 sulk 高 ≥20 点;sulk 受压弃牌比 rage 高 ≥20 点',
    run() {
      const base = { aggr: 0.7, bluff: 0.1, courage: 0.5, morale: -3, moraleSens: 1 };
      const atk = { ...MARGINAL_TURN, toCall: 0 };
      const rageA = probe({ state: atk, personality: { ...base, moraleStyle: 'rage' }, seed: 41 }).pct('bet', 'raise');
      const sulkA = probe({ state: atk, personality: { ...base, moraleStyle: 'sulk' }, seed: 41 }).pct('bet', 'raise');
      const def = { ...MARGINAL_TURN, toCall: 70 };
      const rageD = probe({ state: def, personality: { ...base, callBias: 0.04, moraleStyle: 'rage' }, seed: 43 }).pct('call', 'raise');
      const sulkD = probe({ state: def, personality: { ...base, callBias: 0.04, moraleStyle: 'sulk' }, seed: 43 }).pct('call', 'raise');
      return {
        actual: `进攻 rage ${rageA.toFixed(0)}% vs sulk ${sulkA.toFixed(0)}% / 续战 rage ${rageD.toFixed(0)}% vs sulk ${sulkD.toFixed(0)}%`,
        pass: rageA - sulkA >= 20 && rageD - sulkD >= 20,
      };
    },
  },
  {
    id: 'd_smug_value_thinner',
    group: '战术维度',
    desc: '得意:士气 +2 时价值打薄(约 0.81 权益的加注率比冷静高 ≥50 点)',
    run() {
      const state = { street: 2, hole: [C('Q', 0), C('J', 1)], board: [C('Q', 2), C('8', 3), C('2', 0), C('K', 1)], toCall: 100, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1, equityRuns: 1200 };
      const calm = probe({ state, personality: { aggr: 0.8, bluff: 0.1, courage: 1, morale: 0, moraleSens: 1 }, seed: 47 }).pct('raise');
      const smug = probe({ state, personality: { aggr: 0.8, bluff: 0.1, courage: 1, morale: 2, moraleSens: 1 }, seed: 47 }).pct('raise');
      const gap = smug - calm;
      return { actual: `冷静 ${calm.toFixed(0)}% → 得意 ${smug.toFixed(0)}%(+${gap.toFixed(0)})`, pass: gap >= 50 };
    },
  },
  {
    id: 'd_plan_continues_bluff_line',
    group: '战术维度',
    desc: '连环:翻牌诈唬后,plan0.9 转牌续诈率 ≥65%;plan0 ≤40%',
    run() {
      const cont = plan => {
        const logs = handLogs({ aggr: 0.7, bluff: 0.3, semi: 0, plan, courage: 1 }, villains.station, 700, 303);
        let total = 0, hit = 0;
        for (const log of logs) {
          if (!log.some(e => e.street === 1 && e.d.bluff)) continue;
          total++;
          if (log.some(e => e.street === 2 && e.toCall === 0 && e.d.bluff)) hit++;
        }
        return hit / Math.max(1, total) * 100;
      };
      const hi = cont(0.9), lo = cont(0);
      return { actual: `plan0.9 续诈 ${hi.toFixed(0)}% / plan0 续诈 ${lo.toFixed(0)}%`, pass: hi >= 65 && lo <= 40 };
    },
  },
  {
    id: 'd_scare_bluffs_texture',
    group: '战术维度',
    desc: '借题:同花面上 scare0.8 的空气进攻率比 scare0 高 ≥25 点;干牌面差距 ≤10 点',
    run() {
      const air = [C('8', 0), C('6', 0)];
      const mono = { street: 2, hole: air, board: [C('K', 1), C('7', 1), C('2', 1), C('4', 3)], toCall: 0, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 };
      const dry = { ...mono, board: [C('K', 1), C('7', 2), C('2', 3), C('4', 0)] };
      const mk = scare => ({ aggr: 0.8, bluff: 0.16, scare, courage: 1 });
      const mHi = probe({ state: mono, personality: mk(0.8), seed: 53 }).pct('bet', 'raise');
      const mLo = probe({ state: mono, personality: mk(0), seed: 53 }).pct('bet', 'raise');
      const dHi = probe({ state: dry, personality: mk(0.8), seed: 53 }).pct('bet', 'raise');
      const dLo = probe({ state: dry, personality: mk(0), seed: 53 }).pct('bet', 'raise');
      return {
        actual: `同花面 ${mLo.toFixed(0)}%→${mHi.toFixed(0)}%(+${(mHi - mLo).toFixed(0)}) / 干面 ${dLo.toFixed(0)}%→${dHi.toFixed(0)}%(+${(dHi - dLo).toFixed(0)})`,
        pass: mHi - mLo >= 25 && dHi - dLo <= 10,
      };
    },
  },

  // ---------- 六、框架映射(六维三国属性 → 战术参数,真实生效) ----------
  {
    id: 'f_mapping_monotonic',
    group: '框架映射',
    desc: '映射单调:六维各自驱动对应战术参数同向变化,且受挫反应分派正确',
    run() {
      const a = makePersona({ 武勇: 20 }).ai, b = makePersona({ 武勇: 80 }).ai;
      const c = makePersona({ 智谋: 20 }).ai, d = makePersona({ 智谋: 80 }).ai;
      const e2 = makePersona({ 诈术: 20 }), f = makePersona({ 诈术: 80 });
      const g = makePersona({ 胆识: 20 }).ai, h = makePersona({ 胆识: 80 }).ai;
      const i2 = makePersona({ 耐性: 20 }).ai, j = makePersona({ 耐性: 80 }).ai;
      const k = makePersona({ 心性: 20 }).ai, l = makePersona({ 心性: 80 }).ai;
      const checks = [
        ['武勇→进攻', b.aggr > a.aggr], ['武勇→价值打薄', b.valueMin < a.valueMin],
        ['智谋→读人', d.read > c.read], ['智谋→连环', d.plan > c.plan], ['智谋→借题', d.scare > c.scare],
        ['诈术→诈唬', f.ai.bluff > e2.ai.bluff], ['诈术→半诈唬', f.ai.semi > e2.ai.semi], ['诈术→破绽作假', f.lieChance > e2.lieChance],
        ['胆识→抗压', h.courage > g.courage],
        ['耐性→慢打', j.trap > i2.trap], ['耐性→跟注火候', j.callBias > i2.callBias],
        ['心性→情绪稳定', l.moraleSens < k.moraleSens],
        ['心性高→steady', makePersona({ 心性: 70 }).ai.moraleStyle === 'steady'],
        ['武高心低→rage', makePersona({ 心性: 40, 武勇: 80, 智谋: 30 }).ai.moraleStyle === 'rage'],
        ['智高心低→sulk', makePersona({ 心性: 40, 武勇: 30, 智谋: 80 }).ai.moraleStyle === 'sulk'],
      ];
      const bad = checks.filter(([, ok]) => !ok).map(([name]) => name);
      return { actual: bad.length ? '失败:' + bad.join('、') : `${checks.length} 项全部同向`, pass: bad.length === 0 };
    },
  },
  {
    id: 'f_taunt_and_bands',
    group: '框架映射',
    desc: '激将相性:心性 ≥80 免疫、≤25 双倍;属性分档可解读',
    run() {
      const t0 = makePersona({ 心性: 85 }).tauntMult;
      const t2 = makePersona({ 心性: 20 }).tauntMult;
      const t1 = makePersona({ 心性: 50 }).tauntMult;
      const bands = describeTraits({ 武勇: 95 });
      const wu = bands.find(b => b.trait === '武勇');
      const allLabeled = describeTraits({}).every(b => b.label) && TRAITS.length === 6;
      const ok = t0 === 0 && t2 === 2 && t1 === 1 && wu.label === '万夫不当' && allLabeled;
      return { actual: `心性85→${t0} / 50→${t1} / 20→${t2};武勇95→「${wu.label}」`, pass: ok };
    },
  },
  {
    id: 'f_difficulty_orders',
    group: '框架映射',
    desc: '难度真实:弱/中/强三档属性 vs 跟注站,三种子 2400 手收益严格递增且强档 >0',
    run() {
      const weak = makePersona({ 武勇: 35, 智谋: 10, 诈术: 65, 胆识: 35, 耐性: 20, 心性: 15 });
      const mid = makePersona({});
      const strong = makePersona({ 武勇: 70, 智谋: 80, 诈术: 55, 胆识: 70, 耐性: 70, 心性: 70 });
      const hands = 2400;
      const deltas = [weak, mid, strong].map(p => {
        let delta = 0;
        for (let seed = 0; seed < 3; seed++) {
          const rng = PK.mulberry32(6000 + seed);
          const read = PK.createRead();
          for (let i = 0; i < hands / 3; i++) delta += simulateHand({ rng, aiPersonality: p.ai, villain: villains.station, read }).deltaAi;
        }
        return delta / hands;
      });
      const [dw, dm, ds] = deltas;
      const estOk = weak.difficulty < mid.difficulty && mid.difficulty < strong.difficulty;
      return {
        actual: `评分 ${weak.difficulty}/${mid.difficulty}/${strong.difficulty};均手收益 弱 ${dw.toFixed(1)} → 中 ${dm.toFixed(1)} → 强 ${ds.toFixed(1)}`,
        pass: estOk && dw < dm && dm < ds && ds > 0,
      };
    },
  },
  {
    id: 'f_space_legal',
    group: '框架映射',
    desc: '全空间合法:40 个随机属性包 × 150 随机局面,零非法动作',
    run() {
      const rng = PK.mulberry32(9001);
      const bad = [];
      for (let p = 0; p < 40; p++) {
        const traits = {};
        for (const k of TRAITS) traits[k] = Math.floor(rng() * 101);
        const persona = makePersona(traits);
        for (let i = 0; i < 150; i++) {
          const s = randomState(rng, persona.ai);
          const d = PK.aiDecide(s);
          if (d.type === 'fold' && s.toCall === 0) bad.push('免费弃牌');
          if ((d.type === 'bet' || d.type === 'raise') && d.amount > s.stack) bad.push('超筹码');
          if (d.type === 'bet' && s.toCall > 0) bad.push('受压下注');
          if (d.type === 'raise' && s.raisesLeft === 0) bad.push('超加注帽');
          if (d.type === 'call' && s.toCall === 0) bad.push('免费跟注');
        }
      }
      return { actual: `${bad.length} 例${bad[0] ? ':' + bad[0] : ''}(40 包 × 150 局面)`, pass: bad.length === 0 };
    },
  },

  // ---------- 七、人物保真度(武将档案的牌风必须像本人) ----------
  {
    id: 'f_simayi_unmoved',
    group: '人物保真度',
    desc: '司马懿(心性90,steady):士气 -3 与士气 0 的决策分布完全一致',
    run() {
      const ai = makePersona(CHAPTERS.find(c => c.id === 'wuzhangyuan').boss.traits).ai;
      const state = { street: 1, hole: [C('J', 0), C('10', 0)], board: [C('J', 1), C('10', 2), C('2', 3)], toCall: 0, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 };
      const calm = probe({ state, personality: { ...ai, morale: 0 }, seed: 71 }).counts;
      const shaken = probe({ state, personality: { ...ai, morale: -3 }, seed: 71 }).counts;
      const same = JSON.stringify(calm) === JSON.stringify(shaken);
      return { actual: `冷静 ${JSON.stringify(calm)} vs 重挫 ${JSON.stringify(shaken)}`, pass: same };
    },
  },
  {
    id: 'f_lvbu_pressure_and_rage',
    group: '人物保真度',
    desc: '吕布三性:自由进攻率高于司马懿;价值打薄(约 0.81 权益加注差距 ≥30 点);暴怒(士气-3 进攻率提升 ≥25 点)',
    run() {
      const lv = makePersona(CHAPTERS.find(c => c.id === 'hulao').boss.traits).ai;
      const si = makePersona(CHAPTERS.find(c => c.id === 'wuzhangyuan').boss.traits).ai;
      // (a) 自由进攻率(vs 跟注站,无跟注压力时的出手)
      const free = ai => {
        const log = flat(handLogs(ai, villains.station, 400, 808)).filter(e => e.street >= 1 && e.toCall === 0);
        return log.filter(e => e.d.type === 'bet').length / Math.max(1, log.length) * 100;
      };
      const aLv = free(lv), aSi = free(si);
      // (b) 价值打薄:约 0.81 权益遇注,吕布应加注、司马懿只跟
      const thin = { street: 2, hole: [C('Q', 0), C('J', 1)], board: [C('Q', 2), C('8', 3), C('2', 0), C('K', 1)], toCall: 100, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1, equityRuns: 1200 };
      const rLv = probe({ state: thin, personality: lv, seed: 82 }).pct('raise');
      const rSi = probe({ state: thin, personality: si, seed: 82 }).pct('raise');
      // (c) 暴怒:士气 -3 主动进攻率提升
      const atk = { street: 2, hole: [C('2', 0), C('2', 1)], board: [C('K', 2), C('Q', 3), C('8', 0), C('3', 1)], toCall: 0, pot: 100, stack: 900, minRaise: 20, raisesLeft: 1 };
      const calm = probe({ state: atk, personality: { ...lv, morale: 0 }, seed: 84 }).pct('bet', 'raise');
      const rage = probe({ state: atk, personality: { ...lv, morale: -3 }, seed: 84 }).pct('bet', 'raise');
      return {
        actual: `自由进攻 ${aLv.toFixed(0)}%>${aSi.toFixed(0)}% / 打薄 吕布${rLv.toFixed(0)}% vs 司马${rSi.toFixed(0)}% / 暴怒 +${(rage - calm).toFixed(0)}`,
        pass: aLv > aSi && rLv - rSi >= 30 && rage - calm >= 25,
      };
    },
  },
  {
    id: 'f_generals_all_legal',
    group: '人物保真度',
    desc: '全武将合法:总目全部 boss 属性包 × 120 随机局面,零非法动作',
    run() {
      const rng = PK.mulberry32(6006);
      const bad = [];
      const seen = new Set();
      for (const c of CHAPTERS) {
        if (!c.boss?.gen || seen.has(c.boss.gen)) continue;
        seen.add(c.boss.gen);
        const persona = makePersona(c.boss.traits);
        for (let i = 0; i < 120; i++) {
          const s = randomState(rng, persona.ai);
          const d = PK.aiDecide(s);
          if (d.type === 'fold' && s.toCall === 0) bad.push(c.boss.gen + ':免费弃牌');
          if ((d.type === 'bet' || d.type === 'raise') && d.amount > s.stack) bad.push(c.boss.gen + ':超筹码');
          if (d.type === 'bet' && s.toCall > 0) bad.push(c.boss.gen + ':受压下注');
          if (d.type === 'raise' && s.raisesLeft === 0) bad.push(c.boss.gen + ':超加注帽');
        }
      }
      return { actual: `${bad.length} 例(${seen.size} 名武将 × 120 局面)`, pass: bad.length === 0 };
    },
  },
  {
    id: 'f_generals_roster_covers_book',
    group: '人物保真度',
    desc: '档案契约:总目引用的每名武将都有签名破绽与完整台词',
    run() {
      const bad = [];
      for (const c of CHAPTERS) {
        if (!c.boss?.gen) continue;
        const g = GENERALS[c.boss.gen];
        if (!g) { bad.push(`${c.boss.gen}:未登记`); continue; }
        if (!g.tells?.strong || !g.tells?.weak) bad.push(`${c.boss.gen}:缺破绽`);
        for (const k of ['open', 'taunt', 'tilt', 'smug', 'badbeat']) if (!g.barks?.[k]) bad.push(`${c.boss.gen}:缺台词${k}`);
        if (!g.skin) bad.push(`${c.boss.gen}:缺造型`);
      }
      return { actual: bad.length ? bad.join('、') : '29 处引用全部档案齐备', pass: bad.length === 0 };
    },
  },
  ...multiwayScenarios,
];
