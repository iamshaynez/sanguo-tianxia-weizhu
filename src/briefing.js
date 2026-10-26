// briefing.js —— 每场牌局前的史诗战书;只呈现与返回选择,不写剧情结果
import { briefingFor } from './story-data/briefings.js';
import { portraitImage } from './portrait.js';

const $ = id => document.getElementById(id);

function apocryphaBrief(chapter, boss, opponent) {
  const title = `${chapter.name.replace(/^外传 · /, '')} · ${boss ? '夜行关底' : '狭路遭遇'}`;
  return {
    era: '无纪年', source: '写卷人随机外传',
    lead: '这一页没有前回，也不保证有后继。今夜遇见的人与写下的结果，只属于这一次展卷。',
    battle: {
      title,
      why: boss
        ? `${opponent}守着这页没有史名的空白。你要赢下一场不在旧卷中的对局，证明无名之人也能成为故事。`
        : `${opponent}在夜路上拦住去意。没有军令与旧恩可援引，只有双方都不肯先让的一步。`,
      win: boss
        ? '外传野史落印，纸页随风而生；这一场只累计外传胜数，不改动正卷五十回。'
        : '夜路让开，军资随你继续向前；下一处空白会依照本次行程继续生长。',
      loss: '这一页被风吹回原处，不占正卷胜负；你可以重读外传，也可回到目录另择旧页。',
    },
  };
}

export function resolveBriefing(chapter, { boss = false, round = 1, revive = false, opponent = '' } = {}) {
  const brief = briefingFor(chapter);
  if (!brief) {
    const generated = apocryphaBrief(chapter, boss, opponent || chapter.boss?.name || '无名夜行人');
    return { ...generated, battle: generated.battle };
  }
  const battle = revive && brief.revive
    ? brief.revive
    : boss && brief.rounds?.[round - 1]
      ? brief.rounds[round - 1]
      : boss ? brief.boss : brief.skirmish;
  return { ...brief, battle };
}

export function createBattleBriefing({ audio, reduced = false } = {}) {
  const el = $('battleBriefing');
  const title = $('briefingTitle');
  const enter = $('briefingEnter');
  const back = $('briefingBack');
  const skip = $('briefingSkip');
  let current = null;

  function reveal() {
    if (!current) return;
    el.classList.add('is-open');
    skip.classList.add('hidden');
    if (document.activeElement === skip) title.focus({ preventScroll: true });
  }

  function finish(accepted) {
    if (!current) return;
    const active = current;
    current = null;
    document.removeEventListener('keydown', onKeydown);
    el.classList.remove('show', 'is-open');
    el.classList.add('hidden');
    document.body.classList.remove('briefing-open');
    for (const item of active.backgrounds) item.screen.inert = item.inert;
    active.resolve(accepted);
  }

  function onKeydown(event) {
    if (!current) return;
    if (event.key === 'Escape' && current.allowBack) {
      event.preventDefault();
      finish(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const buttons = [skip, back, enter].filter(button => !button.classList.contains('hidden') && !button.disabled);
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === title)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  skip.addEventListener('click', reveal);
  back.addEventListener('click', () => finish(false));
  enter.addEventListener('click', () => finish(true));

  function show({ chapter, node, roster, round = 1, rounds = 1, revive = false, allowBack = true }) {
    if (current) return current.promise;
    const boss = node.type === 'boss';
    const primary = roster[0];
    const brief = resolveBriefing(chapter, { boss, round, revive, opponent: primary.name });
    const text = brief.battle;
    const opponentLabel = roster.length > 1 ? `${primary.name} 等 ${roster.length} 将` : primary.name;

    $('briefingKicker').textContent = `${chapter.year || '残卷深处'} · ${chapter.name} · ${revive ? '回马战书' : boss ? '关底战书' : '遭遇战书'}`;
    $('briefingEra').textContent = brief.era;
    $('briefingSource').textContent = brief.source;
    title.textContent = text.title;
    $('briefingPlace').textContent = `战地 · ${node.name}`;
    $('briefingRound').textContent = revive ? '七进七出 · 回马再战' : rounds > 1 ? `第 ${round} / ${rounds} 阵 · 军资相随` : boss ? '关底决胜 · 胜则改页' : '行军遭遇 · 败亦入卷';
    $('briefingReason').textContent = text.why;
    $('briefingWin').textContent = text.win;
    $('briefingLoss').textContent = text.loss;
    $('briefingRule').textContent = chapter.ruleText || '';
    $('briefingRule').classList.toggle('hidden', !chapter.ruleText);
    $('briefingEnterDetail').textContent = `进入牌桌 · 对战${opponentLabel}`;
    $('briefingRoster').innerHTML = roster.map((member, index) => `
      <article class="briefing-enemy">
        <div class="briefing-enemy-art">${portraitImage(member.skin)}<span>${index + 1}</span></div>
        <div><b>${member.name}</b><small>${boss ? '关底敌将' : '遭遇敌将'} · 军资 ${member.stack}</small></div>
      </article>`).join('');

    const backgrounds = [...document.querySelectorAll('.screen')]
      .filter(screen => !screen.classList.contains('hidden'))
      .map(screen => ({ screen, inert: screen.inert }));
    for (const item of backgrounds) item.screen.inert = true;
    current = { backgrounds, resolve: null, allowBack };
    current.promise = new Promise(resolve => { current.resolve = resolve; });
    document.body.classList.add('briefing-open');
    el.classList.remove('hidden', 'is-open');
    back.classList.toggle('hidden', !allowBack);
    skip.classList.toggle('hidden', reduced);
    if (reduced) el.classList.add('is-open');
    void el.offsetWidth;
    el.classList.add('show');
    document.addEventListener('keydown', onKeydown);
    title.focus({ preventScroll: true });
    if (!reduced) audio?.card();
    return current.promise;
  }

  return { show, reveal };
}
