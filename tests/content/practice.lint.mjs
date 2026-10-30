// tests/content/practice.lint.mjs —— 野战练习场数据配方校验
// 与章节 lint 同一套纪律:内容即数据,数据有测试。
import { PRACTICE_ARENAS, PRACTICE_TIERS, arenaRoster, practiceBrief, GENERALS } from './helpers.mjs';

const TRAIT_KEYS = ['武勇', '智谋', '诈术', '胆识', '耐性', '心性'];
const len = s => [...String(s || '')].length;
const fails = [];
const check = (ok, msg) => { if (!ok) fails.push(msg); };

// 文案长度上限与章节战书同档(why/win/loss 下限防占位文本)
const LIMIT = {
  name: 12, place: 8, title: 34, era: 34, source: 80,
  lead: 150, body: 170, bodyMin: 12, ruleText: 40, oppTitle: 6,
};

check(PRACTICE_ARENAS.length >= 30, `练习场数量不足 30(当前 ${PRACTICE_ARENAS.length})`);

// 桌型覆盖:1-8 人(2-8 人桌)每种至少一场;分档白描齐全
const sizes = new Set(PRACTICE_ARENAS.map(a => a.size));
for (let s = 2; s <= 8; s++) check(sizes.has(s), `缺 ${s} 人桌练习场`);
check(PRACTICE_TIERS.length === 7, '桌型分档必须为 2..8 七档');
for (const tier of PRACTICE_TIERS) {
  check(Number.isInteger(tier.size) && tier.size >= 2 && tier.size <= 8, `分档 size 越界:${tier.size}`);
  check(len(tier.label) >= 2 && len(tier.label) <= 10, `分档「${tier.label}」名长度异常`);
  check(len(tier.desc) >= 8 && len(tier.desc) <= 30, `分档「${tier.label}」白描缺失或超长(${len(tier.desc)})`);
}

const ids = new Set();
let totalOpponents = 0;
const usedGens = new Set();
for (const a of PRACTICE_ARENAS) {
  const at = `[${a.id || '???'}]`;
  check(a.id && !ids.has(a.id), `${at} id 缺失或重复`);
  ids.add(a.id);
  check(Number.isInteger(a.size) && a.size >= 2 && a.size <= 8, `${at} size 越界:${a.size}`);
  check(Array.isArray(a.opponents) && a.opponents.length === a.size - 1, `${at} 对手数(${a.opponents?.length})与 size(${a.size}) 不一致`);

  check(len(a.name) >= 2 && len(a.name) <= LIMIT.name, `${at} 名长度异常`);
  check(len(a.place) >= 2 && len(a.place) <= LIMIT.place, `${at} 战地名长度异常`);
  check(len(a.year) > 0 && len(a.year) <= 10, `${at} 缺年号或超长`);

  // 公平对战:军资全员等额、50 的倍数;盲注小盲 = 大盲一半、5 的倍数;升盲为 2..12 手
  check(Number.isFinite(a.stack) && a.stack >= 500 && a.stack % 50 === 0, `${at} 军资异常:${a.stack}`);
  check(Array.isArray(a.blinds) && a.blinds.length === 2, `${at} 盲注缺失`);
  const [sb, bb] = a.blinds || [];
  check(Number.isFinite(sb) && Number.isFinite(bb) && bb % 10 === 0 && bb % 5 === 0 && sb === bb / 2, `${at} 盲注配比异常:${a.blinds}`);
  check(Number.isInteger(a.escalate) && a.escalate >= 2 && a.escalate <= 12, `${at} 升盲手数异常:${a.escalate}`);
  const depth = Math.round(a.stack / bb);
  check(depth >= 20 && depth <= 150, `${at} 起手深度异常:${depth}BB`);

  // 战书文本:与章节同档
  check(len(a.era) > 0 && len(a.era) <= LIMIT.era, `${at} 史实坐标缺失/超长`);
  check(len(a.source) > 0 && len(a.source) <= LIMIT.source, `${at} 出处缺失/超长`);
  check(len(a.lead) >= 12 && len(a.lead) <= LIMIT.lead, `${at} 典故背景长度异常(${len(a.lead)})`);
  const brief = practiceBrief(a);
  check(len(brief.battle.title) > 0 && len(brief.battle.title) <= LIMIT.title, `${at} 战题缺失/过长`);
  for (const key of ['why', 'win', 'loss']) {
    check(len(brief.battle[key]) >= LIMIT.bodyMin && len(brief.battle[key]) <= LIMIT.body, `${at} ${key} 缺失或长度异常(${len(brief.battle[key])})`);
  }
  check(len(a.ruleText) <= LIMIT.ruleText, `${at} 规则说明超长`);
  if (a.rule?.lieMult) check(a.rule.lieMult >= 1 && a.rule.lieMult <= 3, `${at} lieMult 越界`);

  // 同桌武将不重复;六维齐全;军资等额;档案必须已登记
  const tableGens = new Set();
  for (const member of a.opponents || []) {
    totalOpponents++;
    const mAt = `${at}/${member.gen || '???'}`;
    check(GENERALS[member.gen], `${mAt} 武将未登记`);
    check(!tableGens.has(member.gen), `${mAt} 同桌重复`);
    tableGens.add(member.gen);
    usedGens.add(member.gen);
    check(len(member.title) >= 2 && len(member.title) <= LIMIT.oppTitle, `${mAt} 名号长度异常`);
    for (const k of TRAIT_KEYS) {
      check(Number.isFinite(member.traits?.[k]) && member.traits[k] >= 0 && member.traits[k] <= 100, `${mAt} 六维 ${k} 异常`);
    }
  }
  // 阵容解析:等额军资、可生成战书
  const roster = arenaRoster(a);
  check(roster.length === a.opponents.length, `${at} 阵容解析数量不符`);
  check(roster.every(member => member.stack === a.stack), `${at} 阵容军资不等额`);
  check(roster.every(member => member.name.includes('·')), `${at} 阵容名号格式异常`);
  check(brief.place === a.place && brief.year === a.year, `${at} 战书坐标不一致`);
}

if (fails.length) {
  console.error(`❌ 野战练习场配方校验 ${fails.length} 项未过:`);
  for (const f of fails) console.error('  - ' + f);
  process.exit(1);
}
console.log(`✅ 野战练习场配方校验通过:${PRACTICE_ARENAS.length} 处典故牌桌(2-8 人桌齐备),对手席位 ${totalOpponents} 个,登场武将 ${usedGens.size} 名`);
