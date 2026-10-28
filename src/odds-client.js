// odds-client.js —— 每次只保留最新计算;关闭面板即终止 Worker,不在后台空算。
export function createOddsCalculator() {
  let worker = null;
  let sequence = 0;
  const pending = new Map();

  function stop() {
    worker?.terminate();
    worker = null;
    for (const { reject } of pending.values()) reject(new DOMException('计算已取消', 'AbortError'));
    pending.clear();
  }

  function ensureWorker() {
    if (worker) return worker;
    const instance = new Worker(new URL('assets/odds-worker.js', document.baseURI), { type: 'module', name: 'public-odds' });
    worker = instance;
    instance.addEventListener('message', event => {
      if (worker !== instance) return;
      const { id, result, error } = event.data || {};
      const request = pending.get(id);
      if (!request) return;
      pending.delete(id);
      if (error) request.reject(new Error(error));
      else request.resolve(result);
    });
    instance.addEventListener('error', event => {
      if (worker !== instance) return;
      event.preventDefault();
      instance.terminate();
      worker = null;
      const error = new Error(event.message || '局势计算暂时不可用');
      for (const { reject } of pending.values()) reject(error);
      pending.clear();
    });
    return instance;
  }

  return {
    analyze({ hole, board, opponents }) {
      stop();
      const id = ++sequence;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        try { ensureWorker().postMessage({ id, hole: [...hole], board: [...board], opponents }); }
        catch (error) { pending.delete(id); reject(error); }
      });
    },
    cancel: stop,
    destroy: stop,
  };
}
