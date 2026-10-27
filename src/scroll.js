// scroll.js —— 残卷:目录、翻页题记、天时、结算、终局;补全度持久化与卷解锁
import { CHAPTERS, SCROLLS, GATE_IDS, NORMAL_IDS, getChapter } from './chapters.js';
import { traitGrid } from './general-card.js';
import { portraitImage } from './portrait.js';
import { normalizeStoryState, coldOpenFor, storyFor, speakerName, outcomeVariant } from './story-engine.js';
import { chapterEncounters } from './encounters.js';
import { briefingFor } from './story-data/runtime.js';

const $ = id => document.getElementById(id);
export const SAVE_KEY = 'yxj_v1';
export const TUTORIAL_VERSION = 1;

// ---------------- 进度 ----------------
export function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const returning = Object.keys(p.pages || {}).length > 0 || Object.keys(p.annals || {}).length > 0 || (p.endings || []).length > 0;
    return {
      version: 2,
      pages: p.pages || {}, endings: p.endings || [], annals: p.annals || {}, flags: p.flags || {}, apocWins: p.apocWins || 0,
      story: normalizeStoryState(p.story),
      tutorial: {
        version: TUTORIAL_VERSION,
        introDone: p.tutorial ? !!p.tutorial.introDone : returning,
        steps: p.tutorial?.steps || {},
        skipped: !!p.tutorial?.skipped,
      },
    };
  } catch {
    return { version: 2, pages: {}, endings: [], annals: {}, flags: {}, apocWins: 0,
      story: normalizeStoryState(), tutorial: { version: TUTORIAL_VERSION, introDone: false, steps: {}, skipped: false } };
  }
}
export function saveProgress(p) { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); }

export function pageState(p, id) { return p.pages[id] || 'unread'; }
export function isYeshi(st) { return st === 'yeshi' || st === 'yeshiB' || st === 'yeshiAB'; }
export function markPage(p, id, st) {
  if (st === 'history' && isYeshi(p.pages[id])) return; // 原卷不覆盖野史
  if (isYeshi(st) && isYeshi(p.pages[id]) && p.pages[id] !== st) p.pages[id] = 'yeshiAB';
  else p.pages[id] = st;
}
export function yeshiCount(p) { return NORMAL_IDS.filter(id => isYeshi(pageState(p, id))).length; }

// 卷解锁:卷一初始;卷 n 由卷 n-1 的大关回改写解锁;最后一页由终局门槛解锁
export function scrollUnlocked(p, s) {
  if (s === 1) return true;
  if (s === 5) return finaleUnlocked(p);
  const gate = CHAPTERS.find(c => c.scroll === s - 1 && c.gate);
  return gate ? isYeshi(pageState(p, gate.id)) : false;
}
export function finaleUnlocked(p) {
  return GATE_IDS.every(id => isYeshi(pageState(p, id))) && yeshiCount(p) >= 30;
}

// ---------------- 目录 ----------------
const STATE_MARK = { unread: '○', history: '原', yeshi: '野', yeshiB: '野', yeshiAB: '全' };
export function renderCodex(p, onPick) {
  $('codexProgress').innerHTML =
    `已改写 <b>${yeshiCount(p)}</b> / ${NORMAL_IDS.length} 页` +
    (finaleUnlocked(p) ? ' · <b class="gold">最后一页已现</b>' : '');
  const apoc = $('apocBtn');
  if (apoc) { // 残卷无终稿:通关(问过写卷人)后开放
    const open = !!(p.endings && p.endings.length);
    apoc.style.display = open ? '' : 'none';
    apoc.textContent = `残卷无终稿${p.apocWins ? ` · 已胜 ${p.apocWins} 页` : ''}`;
  }
  const box = $('scrollList');
  box.innerHTML = '';
  for (let s = 1; s <= 5; s++) {
    const unlocked = scrollUnlocked(p, s);
    const group = document.createElement('div');
    group.className = 'scrollGroup' + (unlocked ? '' : ' locked');
    group.dataset.scroll = s;
    const title = s === 5 ? '最后一页' : `卷${'一二三四'[s - 1]} · ${SCROLLS[s - 1]}`;
    group.innerHTML = `<h3 class="scrollHead">${unlocked ? title : title + ' 🔒'}</h3>`;
    const row = document.createElement('div');
    row.className = 'chips';
    for (const c of CHAPTERS.filter(c => c.scroll === s)) {
      const st = pageState(p, c.id);
      const b = document.createElement('button');
      b.className = `chip st-${isYeshi(st) ? 'yeshi' : st}` + (unlocked ? '' : ' locked');
      b.dataset.ch = c.id;
      b.innerHTML = `<i>${STATE_MARK[st] || '○'}</i>${c.name}`;
      if (unlocked) b.addEventListener('click', () => onPick(c));
      row.appendChild(b);
    }
    group.appendChild(row);
    box.appendChild(group);
  }
}

// ---------------- 翻页题记 ----------------
// opts: { premise, note } 因果覆盖;{ alt: { label, start } } 追加入口(执子之手)
export function renderPage(chapter, onStart, onBack, opts = {}) {
  $('pageYear').textContent = chapter.year ? chapter.year : '残卷深处';
  $('pageName').textContent = chapter.name;
  $('pagePremise').textContent = opts.premise || chapter.premise;
  const brief = briefingFor(chapter);
  $('pageHistory').classList.toggle('hidden', !brief);
  if (brief) {
    $('pageEra').textContent = brief.era;
    $('pageSource').textContent = brief.source;
    $('pageRecord').textContent = brief.record;
    $('pageAdaptation').textContent = brief.adaptation;
    $('pageLead').textContent = brief.lead;
  }
  $('pageRule').textContent = chapter.ruleText || '';
  $('pageRule').classList.toggle('hidden', !chapter.ruleText);
  $('pageNote').textContent = opts.note || chapter.note;
  const story = storyFor(chapter);
  const storyCtx = { P: opts.P, chapter };
  $('pageCast').innerHTML = story ? story.cast.map(id => `<span>${speakerName(id)}</span>`).join('') : '';
  $('pageCast').classList.toggle('hidden', !story);
  const coldOpen = story ? coldOpenFor(chapter, storyCtx) : [];
  $('pageColdOpen').innerHTML = coldOpen.map(line =>
    `<div class="story-line"><span class="story-speaker">${speakerName(line.speaker)}</span><p class="story-text">${line.text}</p></div>`).join('');
  $('pageColdOpen').classList.toggle('hidden', !coldOpen.length);
  $('pageObjective').textContent = story?.objective || '';
  $('pageObjective').classList.toggle('hidden', !story?.objective);
  const siblings = CHAPTERS.filter(c => c.scroll === chapter.scroll);
  const ordinal = siblings.findIndex(c => c.id === chapter.id) + 1;
  $('pageFolio').textContent = chapter.apocrypha ? '无终稿 · 随机外传'
    : chapter.type === 'finale' ? '最后一页 · 写卷人'
      : `卷${'一二三四'[chapter.scroll - 1] || ''} · 第 ${ordinal} 回`;
  const route = $('pageRoute');
  route.innerHTML = '';
  (chapter.map || []).forEach((place, i) => {
    if (i) { const arrow = document.createElement('i'); arrow.textContent = '→'; route.appendChild(arrow); }
    const stop = document.createElement('span'); stop.textContent = place; route.appendChild(stop);
  });
  const start = $('openPage'), back = $('pageBack'), alt = $('pageAlt');
  const s2 = start.cloneNode(true), b2 = back.cloneNode(true), a2 = alt.cloneNode(true);
  start.replaceWith(s2); back.replaceWith(b2); alt.replaceWith(a2);
  s2.addEventListener('click', onStart);
  b2.addEventListener('click', onBack);
  if (opts.alt) {
    a2.classList.remove('hidden');
    a2.textContent = opts.alt.label;
    a2.addEventListener('click', opts.alt.start);
  } else {
    a2.classList.add('hidden');
  }
}

// 页间因果:章节声明的因果对,首个命中的生效(历史被你改写,后页随之而变)
export function causalFor(p, chapter) {
  for (const c of chapter.causal || []) {
    const [id, st] = String(c.when).split(':');
    const cur = pageState(p, id);
    if (st === 'yeshi' ? isYeshi(cur) : cur === 'history') return c;
  }
  return null;
}

// ---------------- 天时三选 ----------------
export function pickOmen(chapter, FX) {
  const box = $('omenBox');
  box.innerHTML = `<h3>天 时</h3><p class="ev-story">${chapter.year || '残卷'} · ${chapter.name}<br>临行前,择一天时。</p><div class="ev-opts"></div>`;
  const opts = box.querySelector('.ev-opts');
  $('omenModal').classList.remove('hidden');
  return new Promise(resolve => {
    for (const o of chapter.omens) {
      const b = document.createElement('button');
      b.innerHTML = `${o.n} <b>${FX[o.fx].desc}</b>`;
      b.dataset.fx = o.fx;
      b.addEventListener('click', () => { $('omenModal').classList.add('hidden'); resolve(o.fx); });
      opts.appendChild(b);
    }
  });
}

// ---------------- 结算 ----------------
// win: { text } 展示野史(choice 页先出抉择;yeshiExtra 为执子之手等追注);loss: 兵败批注 + 原卷入账
export function settle(chapter, { win, annotation, yeshiExtra, storyOutcome = null, next = null }) {
  const modal = $('settle');
  const stamp = $('settleStamp'), title = $('settleTitle');
  const his = $('settleHistory'), ye = $('settleYeshi'), note = $('settleNote');
  const hook = $('settleHook'), clue = $('settleClue');
  const choices = $('settleChoices'), retry = $('settleRetry'), home = $('settleHome');
  const nextButton = $('settleNext');
  nextButton.classList.add('hidden');
  hook.textContent = ''; clue.textContent = '';
  modal.classList.remove('hidden');
  choices.innerHTML = '';
  return new Promise(resolve => {
    const done = r => { modal.classList.add('hidden'); resolve(r); };
    if (win) {
      stamp.textContent = '改'; stamp.className = 'stamp seal';
      title.textContent = '你改写了这一页';
      title.style.color = '#e9d9b0';
      his.innerHTML = `<s>原卷:${chapter.history}</s>`;
      note.textContent = '';
      retry.style.display = 'none'; home.textContent = '回 目 录';
      const showYeshi = (text, key) => {
        const variant = outcomeVariant(storyOutcome, key);
        const outcomeText = chapter.rule?.choice && !variant ? text : (variant?.text || storyOutcome?.text || text);
        ye.textContent = '野史:' + outcomeText;
        ye.style.display = '';
        hook.textContent = variant?.hook || storyOutcome?.hook || '';
        note.textContent = yeshiExtra || '';
        choices.innerHTML = '';
        home.onclick = () => done({ r: 'home', yeshiKey: key });
        nextButton.classList.toggle('hidden', !next);
        if (next) {
          nextButton.textContent = `续读 · ${next.name}`;
          nextButton.onclick = () => done({ r: 'next', yeshiKey: key });
        }
      };
      if (chapter.rule?.choice) {
        ye.style.display = 'none';
        for (const k of ['a', 'b']) {
          const b = document.createElement('button');
          b.textContent = chapter.rule.choice[k];
          b.addEventListener('click', () => showYeshi(k === 'a' ? chapter.yeshi : chapter.yeshiB, k === 'a' ? 'yeshi' : 'yeshiB'));
          choices.appendChild(b);
        }
      } else {
        showYeshi(chapter.yeshi, 'yeshi');
      }
    } else {
      stamp.textContent = '史'; stamp.className = 'stamp dim';
      title.textContent = '这一页,兵败';
      title.style.color = '#c85a4a';
      his.innerHTML = `原卷:${chapter.history}`;
      ye.style.display = 'none';
      hook.textContent = '';
      clue.textContent = storyOutcome?.clue || '';
      note.textContent = annotation || chapter.defeat;
      retry.style.display = ''; retry.textContent = '翻页重开';
      home.textContent = '回 目 录';
      retry.onclick = () => done({ r: 'retry' });
      home.onclick = () => done({ r: 'home' });
    }
  });
}

// ---------------- 终局三种署名 ----------------
export const ENDINGS = [
  { key: 'seal', q: '封卷 · 留下你改写的三国', a: '你把笔搁在最后一页。有人活了下来，也有人替这份圆满付了账。写卷人合上封面：“这一次，别再说你不知道代价。”' },
  { key: 'restore', q: '还史 · 让该发生的仍发生', a: '你把野史一页页撕下，原卷重新显露。故人们没有忘记你。麦城的雪里、五丈原的秋风里，总有人忽然想起：曾有读者替他们不甘过。' },
  { key: 'unwritten', q: '撕卷 · 三国不许有终稿', a: '你撕掉最后一页，碎纸却化成更多空白。写卷人笑了：“好。那就让后人每一次不甘，都长出一个新的三国。”无终稿由此展开。' },
];
export function finale(p) {
  const modal = $('finale');
  modal.classList.remove('hidden');
  $('finaleText').textContent = '';
  const huarong = p.story?.choices?.huarong || p.pages?.huarong;
  const maicheng = p.pages?.maicheng;
  $('finaleMemory').textContent = (huarong === 'yeshiB' ? '他先提起华容：“你放过曹操，是因为义，还是因为不愿看他死？” ' : '')
    + (maicheng && maicheng !== 'unread' ? '又翻到麦城：“这一页，你终于看懂吕蒙让你看的是哪只手了。”' : '他翻着你留下的页码：“现在，告诉我哪一部才算真的三国。”');
  const box = $('finaleQ');
  box.innerHTML = '';
  $('finaleHome').style.display = 'none';
  return new Promise(resolve => {
    for (const e of ENDINGS) {
      const b = document.createElement('button');
      b.textContent = e.q;
      b.addEventListener('click', () => {
        box.innerHTML = '';
        $('finaleText').textContent = e.a;
        $('finaleHome').style.display = '';
        $('finaleHome').onclick = () => { modal.classList.add('hidden'); resolve(e.key); };
      });
      box.appendChild(b);
    }
  });
}

export { getChapter };

// ---------------- 观阵录(列传) ----------------
// 战绩与破绽识破,由 main.js 在战斗中记账;此处只负责陈列
export function renderAnnals(p, { generals, chapters, describeTraits, traitsOf }) {
  const box = $('annalsBox');
  const ids = Object.keys(p.annals || {});
  if (!ids.length) {
    box.innerHTML = '<p class="ev-story">尚无列传 —— 先去会一会他们。</p>';
    return;
  }
  box.innerHTML = '';
  for (const gid of ids) {
    const g = generals[gid];
    if (!g) continue;
    const a = p.annals[gid];
    const appearances = chapters.filter(c => chapterEncounters(c).some(encounter => encounter.cfg.gen === gid)).map(c => c.name).join(' · ');
    const bands = describeTraits(traitsOf(gid)).map(b => `${b.trait}<b>${b.label}</b>`).join(' ');
    // 破绽履历四类:牌力签名(strong/weak,文案在武将档案)+ 意图(bluff/trap,恒真泄露)
    const TELL_LABELS = { strong: g.tells.strong, weak: g.tells.weak, bluff: '诈唬之意', trap: '埋伏之意' };
    const tellLine = Object.keys(TELL_LABELS).filter(k => a.tells?.[k]?.n > 0)
      .map(k => `「${TELL_LABELS[k]}」 见过${a.tells[k].n}次,识破${a.tells[k].hit}次`).join('<br>');
    const card = document.createElement('div');
    card.className = 'annalCard';
    card.dataset.gen = gid;
    card.innerHTML = `
      <div class="annalVisual">${portraitImage(g.skin)}</div>
      <div class="annalMain">
        <div class="annalHead"><b class="annalName">${g.name}</b><span class="annalBio">${g.bio}</span>
          <span class="annalRec">${a.won} 胜 / ${a.seen - a.won} 负</span></div>
        <div class="annalBody">
          <p class="annalRow dim">出场:${appearances}</p>
          <p class="annalRow bands">${bands}</p>
          ${tellLine ? `<p class="annalRow tells">${tellLine}</p>` : '<p class="annalRow dim">破绽尚未识破 —— 盯住他的手。</p>'}
        </div>
        ${traitGrid(traitsOf(gid), { className: 'annalTraits', compact: true })}
      </div>`;
    box.appendChild(card);
  }
}
