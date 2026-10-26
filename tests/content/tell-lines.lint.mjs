// tell-lines.lint.mjs —— 破绽台词池完整性校验
// 规则:名将池每个 id 必须在 GENERALS 档案里存在,六类别齐全且每类 ≥2 句;
// 原型池四档六类齐全且每类 ≥3 句;台词非空、≤24 字;分类映射与取词函数全组合可返回。
import { TELL_LINE_POOLS, tellCategory, tellLine, archetypeOf } from '../../src/tell-lines.js';
import { GENERALS } from '../../src/generals.js';

const { FAMOUS, ARCHETYPE, CATEGORIES } = TELL_LINE_POOLS;
const errors = [];

for (const [genId, pool] of Object.entries(FAMOUS)) {
  if (!GENERALS[genId]) errors.push(`名将词池 ${genId} 不在 GENERALS 档案中`);
  for (const cat of CATEGORIES) {
    const lines = pool[cat];
    if (!Array.isArray(lines) || lines.length < 2) { errors.push(`${genId}.${cat} 缺池或少于2句`); continue; }
    for (const line of lines) {
      if (!line || typeof line !== 'string') errors.push(`${genId}.${cat} 含空台词`);
      else if (line.length > 24) errors.push(`${genId}.${cat} 台词超24字: ${line}`);
    }
  }
  const extra = Object.keys(pool).filter(k => !CATEGORIES.includes(k));
  if (extra.length) errors.push(`${genId} 有未知类别: ${extra.join(',')}`);
}

for (const [arch, pool] of Object.entries(ARCHETYPE)) {
  for (const cat of CATEGORIES) {
    const lines = pool[cat];
    if (!Array.isArray(lines) || lines.length < 3) { errors.push(`原型 ${arch}.${cat} 缺池或少于3句`); continue; }
    for (const line of lines) {
      if (!line || typeof line !== 'string') errors.push(`${arch}.${cat} 含空台词`);
      else if (line.length > 24) errors.push(`${arch}.${cat} 台词超24字: ${line}`);
    }
  }
}

// 分类映射:四象限 + mid 不入池
const mapping = [
  ['strong', 'strong', 'strongTrue'], ['strong', 'weak', 'strongFake'],
  ['weak', 'weak', 'weakTrue'], ['weak', 'strong', 'weakFake'],
  ['mid', 'strong', null], ['mid', 'weak', null], ['mid', 'mid', null],
];
for (const [shown, actual, want] of mapping) {
  const got = tellCategory(shown, actual);
  if (got !== want) errors.push(`tellCategory(${shown},${actual})=${got} 应为 ${want}`);
}

// 取词:名将/原型/无档案 三路全类别可返回非空
const traitSets = [
  { 武勇: 90, 智谋: 30 }, { 武勇: 30, 智谋: 90 }, { 武勇: 70, 智谋: 70 }, { 武勇: 40, 智谋: 40 }, {},
];
for (const traits of traitSets) {
  for (const cat of CATEGORIES) {
    let i = 0;
    const rng = () => (i++ % 7) / 7; // 遍历式伪随机,保证覆盖到每一条
    for (let k = 0; k < 8; k++) {
      const line = tellLine({ genId: 'guanyu', category: cat, traits, rng });
      if (!line) errors.push(`tellLine(guanyu/${cat}) 返回空`);
      const fallback = tellLine({ genId: '___不存在___', category: cat, traits, rng });
      if (!fallback) errors.push(`tellLine(原型/${cat}) 返回空`);
    }
  }
}
if (archetypeOf({ 武勇: 90, 智谋: 30 }) !== 'fierce') errors.push('archetypeOf 猛将判定错误');
if (archetypeOf({ 武勇: 30, 智谋: 90 }) !== 'sage') errors.push('archetypeOf 谋士判定错误');
if (archetypeOf({ 武勇: 70, 智谋: 70 }) !== 'commander') errors.push('archetypeOf 统帅判定错误');
if (archetypeOf({ 武勇: 40, 智谋: 40 }) !== 'veteran') errors.push('archetypeOf 宿将判定错误');

if (errors.length) {
  console.error(`破绽台词池校验失败(${errors.length}):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
const famousCount = Object.keys(FAMOUS).length;
const lineCount = [...Object.values(FAMOUS), ...Object.values(ARCHETYPE)]
  .flatMap(pool => Object.values(pool)).reduce((sum, lines) => sum + lines.length, 0);
console.log(`破绽台词池校验通过: 名将 ${famousCount} 位 + 原型 4 档, 共 ${lineCount} 句`);
