// scroll.js —— 残卷:目录、翻页题记、天时、结算、终局;补全度持久化与卷解锁
import { CHAPTERS, SCROLLS, GATE_IDS, NORMAL_IDS, getChapter } from './chapters.js';
import { traitGrid } from './general-card.js';
import { portraitImage } from './portrait.js';

const $ = id => document.getElementById(id);
export const SAVE_KEY = 'yxj_v1';

// ---------------- 进度 ----------------
export function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    return { pages: p.pages || {}, endings: p.endings || [], annals: p.annals || {}, flags: p.flags || {}, apocWins: p.apocWins || 0 };
  } catch { return { pages: {}, endings: [], annals: {}, flags: {}, apocWins: 0 }; }
}
export function saveProgress(p) { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); }

export function pageState(p, id) { return p.pages[id] || 'unread'; }
export function isYeshi(st) { return st === 'yeshi' || st === 'yeshiB' || st === 'yeshiAB'; }
export function markPage(p, id, st) {
  if (st === 'history' && isYeshi(p.pages[id])) return; // 正史不覆盖野史
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
  return GATE_IDS.every(id => isYeshi(pageState(p, id))) && yeshiCount(p) >= 20;
}

// ---------------- 目录 ----------------
const STATE_MARK = { unread: '○', history: '史', yeshi: '野', yeshiB: '野', yeshiAB: '全' };
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
  $('pageRule').textContent = chapter.ruleText || '';
  $('pageRule').classList.toggle('hidden', !chapter.ruleText);
  $('pageNote').textContent = opts.note || chapter.note;
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
// win: { text } 展示野史(choice 页先出抉择;yeshiExtra 为执子之手等追注);loss: 兵败批注 + 正史入账
export function settle(chapter, { win, annotation, yeshiExtra }) {
  const modal = $('settle');
  const stamp = $('settleStamp'), title = $('settleTitle');
  const his = $('settleHistory'), ye = $('settleYeshi'), note = $('settleNote');
  const choices = $('settleChoices'), retry = $('settleRetry'), home = $('settleHome');
  modal.classList.remove('hidden');
  choices.innerHTML = '';
  return new Promise(resolve => {
    const done = r => { modal.classList.add('hidden'); resolve(r); };
    if (win) {
      stamp.textContent = '改'; stamp.className = 'stamp seal';
      title.textContent = '你改写了这一页';
      title.style.color = '#e9d9b0';
      his.innerHTML = `<s>史:${chapter.history}</s>`;
      note.textContent = '';
      retry.style.display = 'none'; home.textContent = '回 目 录';
      const showYeshi = (text, key) => {
        ye.textContent = '野史:' + text;
        ye.style.display = '';
        note.textContent = yeshiExtra || '';
        choices.innerHTML = '';
        home.onclick = () => done({ r: 'home', yeshiKey: key });
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
      his.innerHTML = `史:${chapter.history}`;
      ye.style.display = 'none';
      note.textContent = annotation || chapter.defeat;
      retry.style.display = ''; retry.textContent = '翻页重开';
      home.textContent = '回 目 录';
      retry.onclick = () => done({ r: 'retry' });
      home.onclick = () => done({ r: 'home' });
    }
  });
}

// ---------------- 终局三问 ----------------
export const ENDINGS = [
  { q: '问他:你是谁?', a: '「我是每一个把三国讲到落泪的人。这一卷,替你收下。」' },
  { q: '问他:我是谁?', a: '「你是第一个坐下来,肯把每一页打完的读者。」' },
  { q: '问他:牌外还有什么?', a: '「牌外没有别的了——所以才要一直打下去。」' },
];
export function finale(p) {
  const modal = $('finale');
  modal.classList.remove('hidden');
  $('finaleText').textContent = '';
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
        $('finaleHome').onclick = () => { modal.classList.add('hidden'); resolve(e.q); };
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
    const appearances = chapters.filter(c => c.boss?.gen === gid).map(c => c.name).join(' · ');
    const bands = describeTraits(traitsOf(gid)).map(b => `${b.trait}<b>${b.label}</b>`).join(' ');
    const tellLine = ['strong', 'weak'].filter(k => a.tells?.[k]?.n > 0)
      .map(k => `「${g.tells[k]}」 见过${a.tells[k].n}次,识破${a.tells[k].hit}次`).join('<br>');
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
