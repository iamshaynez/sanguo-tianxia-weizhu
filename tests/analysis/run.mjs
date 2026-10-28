import assert from 'node:assert/strict';
import { analyzeOdds } from '../../src/odds.js';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const C = (rank, suit) => ranks.indexOf(rank) * 4 + suit;
const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const sum = values => values.reduce((a, b) => a + b, 0);
const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('翻牌同花听牌:9 outs,转牌 9/47,河牌前精确 378/1081', () => {
  const result = analyzeOdds([C('A', 0), C('2', 0)], [C('K', 0), C('7', 0), C('2', 1)], { runs: 200 });
  const flush = result.draws.find(draw => draw.cat === 5);
  assert.equal(flush.outs.length, 9);
  near(flush.nextProbability, 9 / 47);
  near(flush.probability, 378 / 1081);
  assert.equal(result.distribution.runouts, 1081);
  assert.equal(result.distribution.exact, true);
  near(sum(result.distribution.categories), 1);
});

test('两头顺:下一张 8 outs,终局分布完整', () => {
  const result = analyzeOdds([C('8', 3), C('9', 2)], [C('6', 0), C('7', 1), C('2', 2)], { runs: 200 });
  const straight = result.draws.find(draw => draw.cat === 4);
  assert.equal(straight.outs.length, 8);
  near(straight.nextProbability, 8 / 47);
  near(sum(result.distribution.categories), 1);
});

test('转牌同花听牌:河牌精确 9/46,河牌圈不再展示听牌', () => {
  const hole = [C('A', 0), C('2', 0)], flop = [C('K', 0), C('7', 0), C('2', 1)];
  const turn = analyzeOdds(hole, [...flop, C('3', 2)], { runs: 200 });
  const flush = turn.draws.find(draw => draw.cat === 5);
  assert.equal(flush.outs.length, 9);
  near(flush.probability, 9 / 46);
  assert.equal(turn.distribution.runouts, 46);
  const river = analyzeOdds(hole, [...flop, C('3', 2), C('4', 3)], { runs: 200 });
  assert.deepEqual(river.draws, []);
  assert.equal(river.distribution.runouts, 1);
  assert.equal(river.current.cat, 1);
});

test('河牌圈四条:终局牌型分布退化为确定结果', () => {
  const result = analyzeOdds(
    [C('A', 0), C('A', 1)],
    [C('A', 2), C('A', 3), C('K', 0), C('2', 1), C('3', 2)],
    { runs: 200 },
  );
  assert.equal(result.current.cat, 7);
  assert.equal(result.distribution.categories[7], 1);
  near(sum(result.distribution.categories), 1);
});

test('翻牌前同输入可复现,且不修改手牌或对手数量', () => {
  const hole = [C('A', 0), C('K', 1)], before = [...hole];
  const a = analyzeOdds(hole, [], { opponents: 3, runs: 300 });
  const b = analyzeOdds(hole, [], { opponents: 3, runs: 300 });
  assert.deepEqual(a, b);
  assert.deepEqual(hole, before);
  assert.equal(a.opponents, 3);
  assert.equal(a.distribution.exact, false);
  assert.equal(a.distribution.runouts, 300);
  assert.deepEqual(a.draws, []);
});

test('非法牌面、重复牌和非法对手数会被拒绝', () => {
  const validHole = [C('A', 0), C('K', 1)];
  assert.throws(() => analyzeOdds(validHole, [C('2', 0)], { runs: 200 }));
  assert.throws(() => analyzeOdds([C('A', 0), C('A', 0)], [], { runs: 200 }));
  assert.throws(() => analyzeOdds(validHole, [], { opponents: 0, runs: 200 }));
  assert.throws(() => analyzeOdds(validHole, [], { runs: 99 }));
});

let failed = 0;
for (const { name, fn } of tests) {
  try { fn(); console.log(`✓ ${name}`); }
  catch (error) { failed++; console.error(`✗ ${name}\n${error.stack}`); }
}
if (failed) throw new Error(`${failed} 个局势分析测试失败`);
console.log(`局势分析:${tests.length} 项全部通过`);
