// fullscreen.js —— 浏览器全屏状态与入口;同时兼容标准及 WebKit 前缀接口。
export function initFullscreen(button) {
  if (!button) return;
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  const activeElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  const enabled = document.fullscreenEnabled ?? document.webkitFullscreenEnabled ?? true;
  const supported = typeof request === 'function' && typeof exit === 'function' && enabled;
  const status = document.createElement('div');
  status.id = 'fullscreenStatus';
  status.className = 'fullscreen-status hidden';
  status.setAttribute('role', 'status');
  document.body.appendChild(status);
  let statusTimer;

  function sync() {
    const active = !!activeElement();
    const label = active ? '退出全屏' : '全 屏';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? '退出全屏' : '进入全屏');
    button.title = active ? '退出浏览器全屏' : '进入浏览器全屏';
  }

  function notify(text) {
    clearTimeout(statusTimer);
    status.textContent = text;
    status.classList.remove('hidden');
    statusTimer = setTimeout(() => status.classList.add('hidden'), 4000);
  }

  if (!supported) {
    button.textContent = '全屏不可用';
    button.disabled = true;
    button.title = '当前浏览器或页面权限不支持全屏';
    button.setAttribute('aria-label', '当前浏览器不支持全屏');
    return;
  }

  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      if (activeElement()) await exit.call(document);
      else await request.call(root);
    } catch {
      notify(activeElement() ? '退出全屏未完成，请使用浏览器的退出全屏操作。' : '浏览器未允许全屏，请检查权限或使用浏览器菜单。');
    } finally {
      button.disabled = false;
      sync();
    }
  });
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  sync();
}
