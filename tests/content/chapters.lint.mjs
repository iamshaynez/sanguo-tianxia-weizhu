// tests/content/chapters.lint.mjs —— 章节数据配方校验(内容即数据,数据有测试)
// 配方:槽位齐全 / 文案长度上限(防长文渗漏) / 引用合法 / 结构契约 / 武将档案配方
import { CHAPTERS, FX, GENERALS, SKINS } from './helpers.mjs';

const TRAIT_KEYS = ['武勇', '智谋', '诈术', '胆识', '耐性', '心性'];
const len = s => [...String(s || '')].length;
const fails = [];
const check = (ok, msg) => { if (!ok) fails.push(msg); };

// 文案长度上限:单屏永远一行
const LIMIT = { premise: 26, history: 32, yeshi: 46, note: 30, defeat: 26, ruleText: 40, omenN: 6, mapName: 6 };

const ids = new Set();
let gateCount = 0;

for (const c of CHAPTERS) {
  const at = `[${c.id || '???'}]`;
  check(c.id && !ids.has(c.id), `${at} id 缺失或重复`);
  ids.add(c.id);
  check(c.scroll >= 1 && c.scroll <= 5, `${at} scroll 越界`);
  check(c.scroll === 5 || len(c.year) > 0, `${at} 缺年号`);
  check(len(c.name) >= 1 && len(c.name) <= 12, `${at} 回目名长度异常`);
  check(['assault', 'scheme', 'gauntlet', 'choice', 'finale'].includes(c.type), `${at} type 非法:${c.type}`);

  check(len(c.premise) > 0 && len(c.premise) <= LIMIT.premise, `${at} 题记超长(${len(c.premise)})`);
  check(len(c.history) > 0 && len(c.history) <= LIMIT.history, `${at} 正史超长(${len(c.history)})`);
  check(len(c.yeshi) > 0 && len(c.yeshi) <= LIMIT.yeshi, `${at} 野史超长(${len(c.yeshi)})`);
  check(len(c.note) > 0 && len(c.note) <= LIMIT.note, `${at} 写卷人注超长`);
  check(len(c.defeat) > 0 && len(c.defeat) <= LIMIT.defeat, `${at} 兵败批注超长`);
  check(len(c.ruleText) <= LIMIT.ruleText, `${at} 规则说明超长`);

  check(Array.isArray(c.map) && c.map.length >= 1, `${at} 行军图缺失`);
  for (const m of c.map) check(len(m) >= 2 && len(m) <= LIMIT.mapName, `${at} 地名「${m}」长度异常`);

  for (const side of ['skirmish', 'boss']) {
    const o = c[side];
    check(o && len(o.name) > 0, `${at} ${side} 缺名称`);
    check(o && o.traits, `${at} ${side} 缺属性包`);
    if (o?.traits) {
      for (const k of TRAIT_KEYS) {
        check(Number.isFinite(o.traits[k]) && o.traits[k] >= 0 && o.traits[k] <= 100, `${at} ${side}.traits.${k} 越界`);
      }
    }
  }
  check(c.boss && Number.isFinite(c.boss.stack) && c.boss.stack > 0, `${at} boss 缺 stack`);

  check(Array.isArray(c.omens) && c.omens.length === 3, `${at} 天时必须三选`);
  const fxSet = new Set();
  for (const o of c.omens || []) {
    check(len(o.n) >= 2 && len(o.n) <= LIMIT.omenN, `${at} 天时名「${o.n}」长度异常`);
    check(o.fx in FX, `${at} 天时效果键非法:${o.fx}`);
    fxSet.add(o.fx);
  }
  check(fxSet.size === (c.omens || []).length, `${at} 天时效果重复`);

  if (c.type === 'choice') {
    check(c.rule?.choice?.a && c.rule?.choice?.b, `${at} choice 缺选项`);
    check(len(c.yeshiB) > 0 && len(c.yeshiB) <= LIMIT.yeshi, `${at} 缺野史 B 线`);
  }
  if (c.type === 'gauntlet') {
    check(Number.isInteger(c.rule?.gauntlet) && c.rule.gauntlet >= 2 && c.rule.gauntlet <= 7, `${at} gauntlet 场数异常`);
  }
  if (c.rule?.lieMult) check(c.rule.lieMult >= 1 && c.rule.lieMult <= 3, `${at} lieMult 越界`);
  if (c.gate) gateCount++;
}

// 结构契约:大关回齐备 + 最后一页存在
for (const g of ['baimenlou', 'changban', 'maicheng', 'wuzhangyuan']) {
  check(CHAPTERS.find(c => c.id === g && c.gate), `缺大关回 ${g}`);
}
const finale = CHAPTERS.find(c => c.id === 'zuizhong');
check(finale && finale.scroll === 5 && finale.type === 'finale', '缺最后一页');
check(gateCount === 5, `大关回数量异常:${gateCount}`);

// 页间因果:手工精选的例外,不是通用系统——全书限量
let causalPairs = 0;
const idsSet = new Set(CHAPTERS.map(c => c.id));
for (const c of CHAPTERS) {
  for (const e of c.causal || []) {
    causalPairs++;
    const m = /^(\w+):(yeshi|history)$/.exec(e.when || '');
    check(m && idsSet.has(m[1]), `[${c.id}] 因果 when 非法:${e.when}`);
    check(len(e.premise) > 0 && len(e.premise) <= LIMIT.premise, `[${c.id}] 因果题记超长`);
    check(len(e.note) > 0 && len(e.note) <= LIMIT.note, `[${c.id}] 因果批注超长`);
  }
}
check(causalPairs <= 6, `因果对超限:${causalPairs} > 6(精选例外,不许当系统用)`);

// 武将引用:boss.gen 必须在档案库中
for (const c of CHAPTERS) {
  if (c.boss?.gen) check(GENERALS[c.boss.gen], `[${c.id}] boss.gen 未登记:${c.boss.gen}`);
}

// 武将档案配方:签名破绽/台词/小传/造型键,全部槽位齐全且不超长
const GLIMIT = { tell: 18, bark: 24, bio: 26 };
for (const [gid, g] of Object.entries(GENERALS)) {
  const at = `[武将 ${gid}]`;
  check(g.name && len(g.name) <= 8, `${at} 姓名异常`);
  check(g.skin && g.skin in SKINS, `${at} 造型键未登记:${g.skin}`);
  check(len(g.bio) > 0 && len(g.bio) <= GLIMIT.bio, `${at} 小传超长(${len(g.bio)})`);
  check(len(g.tells?.strong) > 0 && len(g.tells.strong) <= GLIMIT.tell, `${at} 强牌破绽缺失/超长`);
  check(len(g.tells?.weak) > 0 && len(g.tells.weak) <= GLIMIT.tell, `${at} 弱牌破绽缺失/超长`);
  for (const k of ['open', 'taunt', 'tilt', 'smug', 'badbeat']) {
    check(len(g.barks?.[k]) > 0 && len(g.barks[k]) <= GLIMIT.bark, `${at} 台词 ${k} 缺失/超长`);
  }
}

if (fails.length) {
  console.error(`❌ 章节配方校验 ${fails.length} 项未过:`);
  for (const f of fails) console.error('  - ' + f);
  process.exit(1);
}
console.log(`✅ 章节配方校验通过:${CHAPTERS.length} 回(含最后一页),大关回 4 + 终局,天时效果键 ${Object.keys(FX).length} 种`);
