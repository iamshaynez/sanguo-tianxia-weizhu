// i18n.js —— 全局多语言支持引擎与适配器
import { UI_STRINGS } from './locales/ui/index.js';
import { GENERAL_LOCALES } from './locales/generals/index.js';
import { CHAPTER_LOCALES } from './locales/chapters/index.js';
import { PRACTICE_LOCALES } from './locales/practice/index.js';
import { TELL_LOCALES, INTENT_NOTES_LOCALES } from './locales/tells/index.js';
import { BRIEFING_LOCALES } from './locales/briefings/index.js';
import { STORY_LOCALES } from './locales/stories/index.js';

export const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'ja', 'en'];

export const LOCALE_LABELS = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'ja': '日本語',
  'en': 'English',
};

const STORAGE_KEY = 'sanguo_poker_language';
const listeners = new Set();

function resolveInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  } catch {}

  const nav = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
  if (nav.startsWith('zh-tw') || nav.startsWith('zh-hk') || nav.startsWith('zh-mo') || nav.includes('hant')) {
    return 'zh-TW';
  }
  if (nav.startsWith('zh')) {
    return 'zh-CN';
  }
  if (nav.startsWith('ja')) {
    return 'ja';
  }
  if (nav.startsWith('en')) {
    return 'en';
  }
  return 'zh-CN';
}

let currentLocale = resolveInitialLocale();

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  if (currentLocale === locale) {
    applyDocumentLocale(locale);
    return;
  }
  currentLocale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  applyDocumentLocale(locale);
  translatePage();
  for (const fn of listeners) {
    try { fn(locale); } catch (e) { console.error('Locale listener error:', e); }
  }
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function applyDocumentLocale(locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dataset.lang = locale;
  document.body?.setAttribute('data-lang', locale);
}

// 核心翻译函数: t('section.key', { varName: 'value' })
export function t(key, params = {}) {
  const dict = UI_STRINGS[currentLocale] || UI_STRINGS['zh-CN'] || {};
  const fallbackDict = UI_STRINGS['zh-CN'] || {};

  const getNested = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj);

  let val = getNested(dict, key);
  if (val === undefined || val === null) {
    val = getNested(fallbackDict, key);
  }
  if (val === undefined || val === null) {
    return key;
  }

  if (typeof val === 'string' && Object.keys(params).length > 0) {
    return val.replace(/\{(\w+)\}/g, (match, p1) => (params[p1] !== undefined ? params[p1] : match));
  }
  return val;
}

// DOM 翻译自动化
export function translatePage() {
  if (typeof document === 'undefined') return;
  applyDocumentLocale(currentLocale);

  const elements = document.querySelectorAll('[data-i18n]');
  for (const el of elements) {
    const key = el.getAttribute('data-i18n');
    if (!key) continue;
    const translated = t(key);
    if (el.tagName === 'INPUT' && el.getAttribute('type') === 'button') {
      el.value = translated;
    } else {
      el.textContent = translated;
    }
  }

  const attrElements = document.querySelectorAll('[data-i18n-title]');
  for (const el of attrElements) {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.setAttribute('title', t(key));
  }

  const ariaElements = document.querySelectorAll('[data-i18n-aria]');
  for (const el of ariaElements) {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  }

  // 更新语言切换按钮状态
  const activeLangBtn = document.querySelector(`.lang-btn[data-locale="${currentLocale}"]`);
  if (activeLangBtn) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    activeLangBtn.classList.add('active');
  }

  // 深度更新首页及主要界面核心节点
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    const sub = startBtn.querySelector('span');
    const startTxt = t('app.startBtn');
    const subTxt = t('toc.readStory');
    if (sub) {
      if (startBtn.childNodes[0]?.nodeType === Node.TEXT_NODE) {
        startBtn.childNodes[0].textContent = startTxt + ' ';
      }
      sub.textContent = subTxt;
    } else {
      startBtn.textContent = startTxt;
    }
  }

  const introTitle = document.querySelector('#intro h1');
  if (introTitle) introTitle.textContent = t('app.title');

  const introSub = document.querySelector('#intro .sub');
  if (introSub) introSub.textContent = t('app.tagline');

  const introStory = document.getElementById('introStory');
  if (introStory) introStory.textContent = t('app.introPoem');

  const fullscreenToggle = document.getElementById('fullscreenToggle');
  if (fullscreenToggle) fullscreenToggle.textContent = t('app.fullscreen');
}

// ======================== 数据对象本地化适配器 ========================

// 1. 武将数据本地化
export function localizeGeneral(gen, id) {
  if (!gen) return gen;
  if (currentLocale === 'zh-CN') return gen;

  const loc = GENERAL_LOCALES[currentLocale]?.[id];
  if (!loc) return gen;

  return {
    ...gen,
    name: loc.name || gen.name,
    bio: loc.bio || gen.bio,
    tells: {
      strong: loc.tells?.strong || gen.tells?.strong,
      weak: loc.tells?.weak || gen.tells?.weak,
    },
    barks: {
      open: loc.barks?.open || gen.barks?.open,
      taunt: loc.barks?.taunt || gen.barks?.taunt,
      tilt: loc.barks?.tilt || gen.barks?.tilt,
      smug: loc.barks?.smug || gen.barks?.smug,
      badbeat: loc.barks?.badbeat || gen.barks?.badbeat,
    },
  };
}

// 2. 章节数据本地化
export function localizeChapter(chap) {
  if (!chap) return chap;
  if (currentLocale === 'zh-CN') return chap;

  const loc = CHAPTER_LOCALES[currentLocale]?.[chap.id];
  if (!loc) return chap;

  return {
    ...chap,
    year: loc.year || chap.year,
    name: loc.name || chap.name,
    premise: loc.premise || chap.premise,
    regret: loc.regret || chap.regret,
    ruleText: loc.ruleText !== undefined ? loc.ruleText : chap.ruleText,
    history: loc.history || chap.history,
    yeshi: loc.yeshi || chap.yeshi,
    note: loc.note || chap.note,
    defeat: loc.defeat || chap.defeat,
    map: loc.map || chap.map,
    omens: chap.omens?.map((o, idx) => ({
      ...o,
      n: loc.omens?.[idx]?.n || o.n,
    })) || chap.omens,
    skirmish: chap.skirmish ? {
      ...chap.skirmish,
      name: loc.skirmish?.name || chap.skirmish.name,
    } : chap.skirmish,
    boss: chap.boss ? {
      ...chap.boss,
      name: loc.boss?.name || chap.boss.name,
    } : chap.boss,
  };
}

// 3. 野战场本地化
export function localizePracticeArena(arena) {
  if (!arena) return arena;
  if (currentLocale === 'zh-CN') return arena;

  const loc = PRACTICE_LOCALES[currentLocale]?.[arena.id];
  if (!loc) return arena;

  return {
    ...arena,
    name: loc.name || arena.name,
    place: loc.place || arena.place,
    year: loc.year || arena.year,
    era: loc.era || arena.era,
    source: loc.source || arena.source,
    lead: loc.lead || arena.lead,
    btitle: loc.btitle || arena.btitle,
    why: loc.why || arena.why,
    win: loc.win || arena.win,
    loss: loc.loss || arena.loss,
    ruleText: loc.ruleText || arena.ruleText,
    opponents: arena.opponents?.map((opp, idx) => ({
      ...opp,
      title: loc.opponents?.[idx]?.title || opp.title,
    })) || arena.opponents,
  };
}

// 4. 破绽台词与意图判词本地化
export function localizeTells(namedTells, defaultTells) {
  if (currentLocale === 'zh-CN') return { named: namedTells, defaults: defaultTells };

  const loc = TELL_LOCALES[currentLocale];
  if (!loc) return { named: namedTells, defaults: defaultTells };

  return {
    named: loc.named || namedTells,
    defaults: loc.defaults || defaultTells,
  };
}

export function localizeIntentNotes(notes) {
  if (currentLocale === 'zh-CN') return notes;
  return INTENT_NOTES_LOCALES[currentLocale] || notes;
}

// 5. 战前简报本地化
export function localizeBriefing(briefing, chapterId) {
  if (!briefing) return briefing;
  if (currentLocale === 'zh-CN') return briefing;

  const loc = BRIEFING_LOCALES[currentLocale]?.[chapterId];
  if (!loc) return briefing;

  return {
    ...briefing,
    era: loc.era || briefing.era,
    source: loc.source || briefing.source,
    record: loc.record || briefing.record,
    adaptation: loc.adaptation || briefing.adaptation,
    lead: loc.lead || briefing.lead,
    skirmish: briefing.skirmish ? {
      ...briefing.skirmish,
      title: loc.skirmish?.title || briefing.skirmish.title,
      why: loc.skirmish?.why || briefing.skirmish.why,
      win: loc.skirmish?.win || briefing.skirmish.win,
      loss: loc.skirmish?.loss || briefing.skirmish.loss,
    } : briefing.skirmish,
    boss: briefing.boss ? {
      ...briefing.boss,
      title: loc.boss?.title || briefing.boss.title,
      why: loc.boss?.why || briefing.boss.why,
      win: loc.boss?.win || briefing.boss.win,
      loss: loc.boss?.loss || briefing.boss.loss,
    } : briefing.boss,
  };
}

// 6. 剧本长卷本地化
export function localizeStory(story, chapterId, scrollId) {
  if (!story) return story;
  if (currentLocale === 'zh-CN') return story;

  const scrollStories = STORY_LOCALES[currentLocale]?.[scrollId];
  const loc = scrollStories?.[chapterId];
  if (!loc) return story;

  return {
    ...story,
    objective: loc.objective || story.objective,
    coldOpen: loc.coldOpen || story.coldOpen,
    map: loc.map || story.map,
    skirmishIntro: loc.skirmishIntro || story.skirmishIntro,
    skirmishOutcomes: loc.skirmishOutcomes || story.skirmishOutcomes,
    bossIntro: loc.bossIntro || story.bossIntro,
    bossOutcomes: loc.bossOutcomes || story.bossOutcomes,
    epilogue: loc.epilogue || story.epilogue,
    choicePrompt: loc.choicePrompt || story.choicePrompt,
    choices: loc.choices || story.choices,
  };
}
