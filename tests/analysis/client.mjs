import assert from 'node:assert/strict';
import { createOddsCalculator } from '../../src/odds-client.js';

class FakeWorker {
  static instances = [];
  constructor(url, options) {
    this.url = String(url); this.options = options; this.handlers = {};
    this.terminated = false; FakeWorker.instances.push(this);
  }
  addEventListener(type, handler) { (this.handlers[type] ||= []).push(handler); }
  postMessage(message) { this.message = message; }
  terminate() { this.terminated = true; }
  emit(type, data) {
    const event = { ...data, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const handler of this.handlers[type] || []) handler(event);
    return event;
  }
}
globalThis.Worker = FakeWorker;
globalThis.document = { baseURI: 'https://example.test/' };

const calculator = createOddsCalculator();
const input = { hole: [48, 45], board: [], opponents: 1 };
const first = calculator.analyze(input);
const firstWorker = FakeWorker.instances[0];
const second = calculator.analyze(input);
const secondWorker = FakeWorker.instances[1];
await assert.rejects(first, { name: 'AbortError' });
assert.equal(firstWorker.terminated, true);
assert.equal(secondWorker.terminated, false);

// 已淘汰 Worker 的延迟错误不得取消最新 Worker 或最新请求。
const staleEvent = firstWorker.emit('error', { message: '旧 Worker 错误' });
assert.equal(staleEvent.defaultPrevented, false);
assert.equal(secondWorker.terminated, false);
secondWorker.emit('message', { data: { id: secondWorker.message.id, result: { equity: { win: 0.5 } } } });
assert.deepEqual(await second, { equity: { win: 0.5 } });

const third = calculator.analyze(input);
const thirdWorker = FakeWorker.instances[2];
thirdWorker.emit('error', { message: '当前 Worker 错误' });
await assert.rejects(third, /当前 Worker 错误/);
assert.equal(thirdWorker.terminated, true);
calculator.destroy();
console.log('✓ Worker 替换、延迟错误隔离与当前错误传播');
