// practice.js —— 野战练习场全屏选关页:残卷目录之外,与正史并列的沙场
// 只负责陈列与导航;战书与牌局由 main.js 接线。
import { PRACTICE_ARENAS, PRACTICE_TIERS, arenaRoster } from './practice-data.js';
import { portraitImage } from './portrait.js';

const $ = id => document.getElementById(id);

function rosterLabel(arena) {
  const names = arenaRoster(arena).map(member => member.name.split(' · ')[0]);
  return names.length <= 3 ? names.join(' · ') : `${names.slice(0, 3).join(' · ')} 等${names.length}将`;
}

function renderStats(P) {
  const seen = Object.values(P.practice || {}).reduce((sum, rec) => sum + rec.seen, 0);
  const won = Object.values(P.practice || {}).reduce((sum, rec) => sum + rec.won, 0);
  const cleared = PRACTICE_ARENAS.filter(arena => P.practice?.[arena.id]?.won > 0).length;
  $('practiceStats').innerHTML = seen
    ? `已战 <b>${seen}</b> 场 · 胜 <b>${won}</b> · 破阵 <b>${cleared}</b> / ${PRACTICE_ARENAS.length}`
    : `尚无战录 · ${PRACTICE_ARENAS.length} 处战场静候点兵`;
}

function renderArenaCard(arena, P, onPick) {
  const rec = P.practice?.[arena.id];
  const won = !!rec?.won;
  const gen = arenaRoster(arena)[0];
  const depth = Math.round(arena.stack / arena.blinds[1]);
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'practice-arena' + (won ? ' is-won' : '');
  b.dataset.arena = arena.id;
  b.title = arena.lead;
  b.innerHTML = `
    <span class="pa-art">${portraitImage(gen.skin, 'pa-portrait')}
      <i class="pa-count">敌${arena.opponents.length}将</i>${won ? '<i class="pa-seal">胜</i>' : ''}</span>
    <span class="pa-main">
      <b class="pa-name">${arena.name}</b>
      <span class="pa-meta">${arena.year} · ${arena.place} · 军资各 ${arena.stack} · ${depth}BB</span>
      <span class="pa-opp">${rosterLabel(arena)}</span>
    </span>
    <span class="pa-side">${rec
      ? `<b>${rec.won}</b><small>胜 / ${rec.seen - rec.won} 负</small>`
      : '<b>○</b><small>未 战</small>'}</span>`;
  b.addEventListener('click', () => onPick(arena));
  return b;
}

export function renderPractice(P, onPick) {
  renderStats(P);
  const box = $('practiceList');
  box.innerHTML = '';
  for (const tier of PRACTICE_TIERS) {
    const arenas = PRACTICE_ARENAS.filter(arena => arena.size === tier.size);
    if (!arenas.length) continue;
    const group = document.createElement('section');
    group.className = 'practice-tier';
    group.dataset.size = String(tier.size);
    group.innerHTML = `<header class="practice-tier-head">
      <h3>${tier.label}<small>${tier.size} 人桌</small></h3>
      <p>${tier.desc}</p>
    </header>`;
    const row = document.createElement('div');
    row.className = 'practice-tier-row';
    for (const arena of arenas) row.appendChild(renderArenaCard(arena, P, onPick));
    group.appendChild(row);
    box.appendChild(group);
  }
  $('practiceBack').focus({ preventScroll: true });
}

// 残卷目录的并列入口:野卷旗帜,四位名将压阵
export function renderPracticeGate(mount, onEnter) {
  const gate = document.createElement('div');
  gate.className = 'practiceGate';
  gate.innerHTML = `
    <h3 class="practiceGate-head"><span class="title-seal">野</span>野卷 · 沙场点兵</h3>
    <button type="button" class="practiceGate-btn" data-practice-gate>
      <span class="pg-art">${['guanyu', 'caocao', 'zhouyu', 'lvbu'].map(s => portraitImage(s)).join('')}</span>
      <span class="pg-main">
        <b>三十三处典故 · 点兵即战</b>
        <small>二至八人桌 · 军资等额 · 不改史册</small>
      </span>
      <span class="pg-go">入 阵<small>点兵台</small></span>
    </button>`;
  gate.querySelector('[data-practice-gate]').addEventListener('click', onEnter);
  mount.appendChild(gate);
}

// 返回目录与键盘收起(与既有屏幕同一套约定)
export function initPracticeScreen(onBack) {
  $('practiceBack').addEventListener('click', onBack);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('practice').classList.contains('hidden')) onBack();
  });
}
