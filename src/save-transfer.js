// save-transfer.js —— 存档文件导出、校验导入与覆盖确认。
import { normalizeProgress } from './scroll.js';

export const SAVE_FORMAT = 'sanguo-tianxia-weizhu-save';
const MAX_SAVE_BYTES = 1024 * 1024;
const INVALID_MESSAGE = '无法识别这个存档文件，请选择本游戏导出的 JSON 存档。';
const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);

function assertProgress(value) {
  if (!isRecord(value)) throw new Error(INVALID_MESSAGE);
  const known = ['version', 'pages', 'endings', 'annals', 'practice', 'flags', 'apocWins', 'settings', 'story', 'tutorial'];
  if (!known.some(key => Object.hasOwn(value, key))) throw new Error(INVALID_MESSAGE);
  for (const key of ['pages', 'annals', 'practice', 'flags', 'settings', 'story', 'tutorial']) {
    if (value[key] !== undefined && !isRecord(value[key])) throw new Error(INVALID_MESSAGE);
  }
  if (value.endings !== undefined && !Array.isArray(value.endings)) throw new Error(INVALID_MESSAGE);
  if (value.apocWins !== undefined && (!Number.isFinite(value.apocWins) || value.apocWins < 0)) throw new Error(INVALID_MESSAGE);
  return value;
}

export async function readSaveFile(file) {
  if (file.size > MAX_SAVE_BYTES) throw new Error('存档文件过大，导入上限为 1 MB。');
  let parsed;
  try { parsed = JSON.parse(await file.text()); }
  catch { throw new Error(INVALID_MESSAGE); }
  let raw = parsed;
  let exportedAt = null;
  if (isRecord(parsed) && parsed.format !== undefined) {
    if (parsed.format !== SAVE_FORMAT || parsed.formatVersion !== 1) throw new Error(INVALID_MESSAGE);
    raw = parsed.data;
    exportedAt = Number.isFinite(Date.parse(parsed.exportedAt)) ? parsed.exportedAt : null;
  }
  const progress = normalizeProgress(assertProgress(raw));
  return { progress, exportedAt };
}

export function downloadSave(progress) {
  const payload = {
    format: SAVE_FORMAT, formatVersion: 1,
    exportedAt: new Date().toISOString(), data: progress,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sanguo-save-${payload.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function summaryOf(progress) {
  const pages = Object.values(progress.pages).filter(state => ['yeshi', 'yeshiB', 'yeshiAB'].includes(state)).length;
  const practice = Object.values(progress.practice || {}).reduce((sum, rec) => sum + rec.seen, 0);
  return { pages, generals: Object.keys(progress.annals).length, endings: progress.endings.length, practice };
}

export function createSaveTransfer({ read, onImported }) {
  const $ = id => document.getElementById(id);
  const modal = $('saveModal'), input = $('saveImportInput'), preview = $('saveImportPreview');
  let pending = null;

  function close() {
    pending = null;
    input.value = '';
    preview.classList.add('hidden');
    modal.classList.add('hidden');
  }
  function open() {
    close();
    $('saveMessage').textContent = '';
    modal.classList.remove('hidden');
    $('saveExport').focus({ preventScroll: true });
  }
  $('saveBtn').addEventListener('click', open);
  $('saveClose').addEventListener('click', close);
  $('saveImportChoose').addEventListener('click', () => input.click());
  $('saveExport').addEventListener('click', () => {
    downloadSave(read());
    $('saveMessage').textContent = '已导出当前存档。';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    pending = null;
    preview.classList.add('hidden');
    $('saveMessage').textContent = '正在读取存档…';
    try {
      const imported = await readSaveFile(file);
      pending = imported;
      const summary = summaryOf(imported.progress);
      const date = imported.exportedAt ? ` · ${new Date(imported.exportedAt).toLocaleString('zh-CN', { hour12: false })}` : '';
      $('saveImportSummary').textContent = `已改写 ${summary.pages} 页 · ${summary.generals} 位武将列传 · ${summary.endings} 种终局 · 野战 ${summary.practice} 场${date}`;
      preview.classList.remove('hidden');
      $('saveMessage').textContent = '请核对摘要，确认后再覆盖当前进度。';
    } catch (error) {
      input.value = '';
      $('saveMessage').textContent = error.message || INVALID_MESSAGE;
    }
  });
  $('saveImportConfirm').addEventListener('click', async () => {
    if (!pending) return;
    try {
      await onImported(pending.progress);
      pending = null;
      input.value = '';
      preview.classList.add('hidden');
      $('saveMessage').textContent = '存档已导入，当前进度已更新。';
    } catch {
      $('saveMessage').textContent = '写入失败，当前存档未被替换。';
    }
  });
  return { open, close };
}
