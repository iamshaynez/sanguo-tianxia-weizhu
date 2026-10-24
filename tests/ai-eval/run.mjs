// tests/ai-eval/run.mjs —— AI 行为评估执行器
import { scenarios } from './scenarios.mjs';

const rows = [];
let passCount = 0, lastGroup = null;

console.log('\n  AI 行为评估报告 —— 暮色牌局\n');

for (const s of scenarios) {
  const t0 = Date.now();
  let r;
  try {
    r = s.run();
  } catch (e) {
    r = { actual: '异常: ' + e.message, pass: false };
  }
  const ms = Date.now() - t0;
  if (s.group !== lastGroup) {
    console.log(`  【${s.group}】`);
    lastGroup = s.group;
  }
  const mark = r.pass ? '✅' : '❌';
  console.log(`  ${mark} ${s.desc}`);
  console.log(`      实际: ${r.actual}  (${ms}ms)`);
  if (r.pass) passCount++;
  rows.push({ id: s.id, pass: r.pass });
}

console.log(`\n  汇总: ${passCount}/${scenarios.length} 通过\n`);

const failed = rows.filter(r => !r.pass);
if (failed.length) {
  console.log('  未通过: ' + failed.map(f => f.id).join(', ') + '\n');
  process.exit(1);
}
