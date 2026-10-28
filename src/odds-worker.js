import { analyzeOdds } from './odds.js';

self.addEventListener('message', event => {
  const { id, hole, board, opponents } = event.data || {};
  try {
    const result = analyzeOdds(hole, board, { opponents });
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: error.message || String(error) });
  }
});
