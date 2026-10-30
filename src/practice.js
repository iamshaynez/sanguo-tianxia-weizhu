// practice.js —— 野战练习场选关界面:目录分档陈列 33 处典故牌桌
// 只读存档、只发选择事件;战书与牌局由 main.js 接线。
import { PRACTICE_ARENAS, PRACTICE_TIERS, arenaRoster } from './practice-data.js';
import { GENERALS } from './generals.js';
import { portraitImage } from './portrait.js';

const $ = id => document.getElementById(id);

function arenaRecord(P, id) {
  const rec = P.practice?.[id];
  if (!rec || !rec.seen) return null;
  return rec;
}

function rosterLabel(arena) {
  const names = arenaRoster(arena).map(member => member.name.split(' · ')[0]);
  return names.length <= 3 ? names.join(' · ') : `${names.slice(0, 3).join(' · ')} 等${names.length}将`;
}

function renderList(P, onPick) {
  const box = $('practiceList');
  box.innerHTML = '';
  for (const tier of PRACTICE_TIERS) {
    const arenas = PRACTICE_ARENAS.filter(arena => arena.size === tier.size);
    if (!arenas.length) continue;
    const group = document.createElement('section');
    group.className = 'practice-group';
    group.dataset.size = String(tier.size);
    group.innerHTML = `<h3>${tier.label}<small>${tier.size} 人桌</small></h3>`;
    for (const arena of arenas) {
      const rec = arenaRecord(P, arena.id);
      const gen = GENERALS[arena.opponents[0].gen];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'practice-arena' + (rec?.won ? ' is-won' : '');
      b.dataset.arena = arena.id;
      b.title = arena.lead;
      b.innerHTML = `
        <span class="pa-mark">${rec?.won ? '胜' : '○'}</span>
        <span class="pa-main">
          <b class="pa-name">${arena.name}</b>
          <span class="pa-meta">${arena.year} · ${arena.place} · 军资各 ${arena.stack}</span>
          <span class="pa-opp">${rosterLabel(arena)}</span>
        </span>
        ${portraitImage(gen.skin, 'pa-portrait')}
        ${rec ? `<span class="pa-rec">${rec.won} 胜 / ${rec.seen - rec.won} 负</span>` : ''}`;
      b.addEventListener('click', () => onPick(arena));
      group.appendChild(b);
    }
    box.appendChild(group);
  }
}

export function openPractice(P, onPick) {
  renderList(P, onPick);
  const modal = $('practiceModal');
  modal.classList.remove('hidden');
  $('practiceClose').focus({ preventScroll: true });
}

export function closePractice() {
  $('practiceModal').classList.add('hidden');
}

// 弹窗开关与键盘收起(与设置弹窗同一套轻量约定)
export function initPracticeModal(P, onPick) {
  $('practiceBtn').addEventListener('click', () => openPractice(P, onPick));
  $('practiceClose').addEventListener('click', closePractice);
  $('practiceModal').addEventListener('click', event => {
    if (event.target === $('practiceModal')) closePractice();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('practiceModal').classList.contains('hidden')) closePractice();
  });
}
