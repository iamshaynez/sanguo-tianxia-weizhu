// auto-update.js —— 版本巡检:发现新部署时提示刷新,不打断进行中的牌局。
// runtime.json 由容器 entrypoint 每次启动重写;commit/startedAt/version 任一
// 变化即视为新部署。刷新只由用户点击触发——行军进度与牌局在中途 reload 会丢,
// 所以绝不自动刷新,只给一个常驻的低打扰提示。
// 注意首次读取只用于确立基线:页面打开时它就是最新版,变化从第二次巡检起算。

export function watchRuntimeVersion({ intervalMs = 60_000 } = {}) {
  let baseline = null;
  let toast = null;

  async function probe() {
    try {
      const response = await fetch(`./runtime.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const fingerprint = `${data.commit ?? ''}|${data.startedAt ?? ''}|${data.version ?? ''}`;
      if (!baseline) {
        baseline = fingerprint;
        window.__updateBaseline = fingerprint; // e2e/调试可见的基线锚点
        return;
      }
      if (fingerprint !== baseline && !toast) show();
    } catch { /* 离线或旧服务无 runtime.json:静默,下轮再试 */ }
  }

  function show() {
    toast = document.createElement('div');
    toast.className = 'update-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span>新版本已部署</span><button type="button">刷新</button>`;
    toast.querySelector('button').addEventListener('click', () => location.reload());
    document.body.appendChild(toast);
  }

  setInterval(probe, intervalMs);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) probe(); });
  window.addEventListener('online', probe);
  window.__probeUpdate = probe; // e2e/调试钩子
  probe();
}
