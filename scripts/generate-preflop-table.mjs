// scripts/generate-preflop-table.mjs —— 离线生成 169 类单挑起手牌胜率表。
// 用法:node scripts/generate-preflop-table.mjs [每类模拟次数,默认 12000]
import fs from 'node:fs';
import * as PK from '../src/poker.js';

const runs = Math.max(1000, Number(process.argv[2]) || 12000);
const entries = [];
for (let hi = 0; hi < 13; hi++) {
  for (let lo = 0; lo <= hi; lo++) {
    const kinds = hi === lo ? [''] : ['s', 'o'];
    for (const kind of kinds) {
      const hole = hi === lo ? [hi * 4, hi * 4 + 1] : [hi * 4, lo * 4 + (kind === 's' ? 0 : 1)];
      const key = hi === lo ? `${hi},${hi}` : `${hi},${lo}${kind}`;
      const rng = PK.mulberry32(PK.hashSeed(`preflop-v1|${key}|${runs}`));
      const result = PK.estimateEquity(hole, [], { runs, rng });
      entries.push([key, Number(result.e.toFixed(4))]);
    }
  }
}
if (entries.length !== 169) throw new Error(`应为 169 类,实际 ${entries.length}`);
const body = entries.map(([key, e]) => `  '${key}': ${e},`).join('\n');
const output = `// 由 scripts/generate-preflop-table.mjs 生成,请勿手改数值。\n// 每类 ${runs} 次全范围单挑模拟;键为高点,低点,s=同花,o=非同花。\nexport const PREFLOP_EQUITY = {\n${body}\n};\n`;
fs.writeFileSync(new URL('../src/preflop.js', import.meta.url), output);
console.log(`Generated ${entries.length} preflop classes × ${runs} runs → src/preflop.js`);
