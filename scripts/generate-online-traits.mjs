// generate-online-traits.mjs —— 从章节遭遇与野战阵容提取武将六维，
// 生成 src/online/general-traits.js，供在线服务器端离线判定 AI 人格。
// 数据保持单一来源：章节/练习场改动后运行 npm run gen:online-traits 重新生成。
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERALS } from '../src/generals.js';
import { CHAPTERS } from '../src/chapters.js';
import { chapterEncounters } from '../src/encounters.js';
import { PRACTICE_ARENAS } from '../src/practice-data.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const TRAITS = ['武勇', '智谋', '诈术', '胆识', '耐性', '心性'];

function sanitizeTraits(raw) {
  const out = {};
  for (const key of TRAITS) {
    const value = Math.round(Number(raw?.[key]));
    out[key] = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 50;
  }
  return out;
}

const table = {};
const missing = [];
for (const genId of Object.keys(GENERALS)) {
  let source = null;
  let traits = null;
  for (const chapter of CHAPTERS) {
    const encounter = chapterEncounters(chapter).find(item => item.cfg?.gen === genId);
    if (encounter) { traits = encounter.cfg.traits; source = `chapter:${chapter.id}`; break; }
  }
  if (!traits) {
    for (const arena of PRACTICE_ARENAS) {
      const opponent = (arena.opponents || []).find(opp => opp.gen === genId);
      if (opponent) { traits = opponent.traits; source = `arena:${arena.id}`; break; }
    }
  }
  if (!traits) { missing.push(genId); }
  table[genId] = { name: GENERALS[genId].name, source: traits ? source : 'fallback', traits: sanitizeTraits(traits || {}) };
}

const banner = `// general-traits.js —— 在线模式武将六维表(自动生成,勿手改)
// 生成器:scripts/generate-online-traits.mjs;数据来源:章节遭遇 > 野战阵容。
// ${Object.keys(table).length}/${Object.keys(GENERALS).length} 名武将有六维记录;
// 未收录者(${missing.length})由 fallback 均衡六维代打。
`;
const body = `export const GENERAL_TRAITS = ${JSON.stringify(table, null, 2)};
export const TRAIT_FALLBACK = ${JSON.stringify(Object.fromEntries(TRAITS.map(key => [key, 50])))};
`;
const target = path.join(root, '../src/online/general-traits.js');
await writeFile(target, banner + body, 'utf8');
console.log(`生成 ${target}: ${Object.keys(table).length} 名有据,缺省 ${missing.length}: ${missing.join(', ') || '无'}`);
