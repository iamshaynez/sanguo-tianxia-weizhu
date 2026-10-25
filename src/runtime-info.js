// runtime-info.js —— 页脚版本与服务器启动时间;只读同源静态 runtime.json
import { APP_VERSION } from './version.js';

const $ = id => document.getElementById(id);

function displayTime(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ') + 'Z';
}

export async function initRuntimeInfo() {
  const footer = $('appVersion');
  const version = $('versionNumber');
  const started = $('serverStartedAt');
  version.textContent = `v${APP_VERSION}`;
  started.textContent = '启动时间读取中…';
  try {
    const response = await fetch(`./runtime.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`runtime.json ${response.status}`);
    const data = await response.json();
    if (data.version) version.textContent = `v${data.version}`;
    if (data.commit) version.textContent += `+${String(data.commit).slice(0, 7)}`;
    const formatted = displayTime(data.startedAt);
    if (!formatted) throw new Error('invalid server start time');
    started.textContent = `启动 ${formatted}`;
    started.dateTime = data.startedAt;
    footer.title = `服务器启动于 ${data.startedAt}`;
    footer.dataset.status = 'ready';
  } catch {
    started.textContent = '启动时间未登记';
    started.removeAttribute('datetime');
    footer.title = '当前服务未生成 runtime.json；请使用 npm start 或新的 Docker 启动脚本';
    footer.dataset.status = 'missing';
  }
}
