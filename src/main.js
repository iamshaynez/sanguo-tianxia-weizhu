// main.js —— 主流程:开卷 → 目录 → 翻页题记 → 天时 → 行军图 → 战役 → 结算 → 目录
import { startBackdrop, wait } from './fx2d.js';
import { AudioFX } from './audio.js';
import { createOpponent } from './character.js';
import { startBattle } from './battle.js';
import { buildMarch, createMap, eventModal } from './map.js';
import { makePersona, TRAITS, describeTraits } from './persona.js';
import { FX, getChapter, CHAPTERS } from './chapters.js';
import { getGeneral, GENERALS } from './generals.js';
import { renderGeneralCard } from './general-card.js';
import * as SC from './scroll.js';

const $ = id => document.getElementById(id);
window.addEventListener('error', e => { $('errBox').textContent += e.message + '\n'; });
window.addEventListener('unhandledrejection', e => { $('errBox').textContent += (e.reason?.message || e.reason) + '\n'; });

startBackdrop($('backdrop'));
const audio = new AudioFX();
const oppChar = createOpponent($('oppChar'));

// ---------------- HUD 适配层 ----------------
const actions = $('actions'), raiseOpts = $('raiseOpts');

const ui = {
  setOppName(n) { oppChar.setName(n); },
  setStacks(you, opp) { $('youStack').textContent = you; oppChar.setStack(opp); },
  setPot(n) { $('potNum').textContent = n; },
  setBlind(t) { $('blindLabel').textContent = t; },
  setHand(t) { $('handLabel').textContent = '当前牌型 ' + t; },
  setSeed(t) { $('seedVal').textContent = t; },
  setTilt(n) { oppChar.setTilt(n); },
  setPlayerName(n) { $('youName').textContent = n || '你'; },
  setTauntLabel(t) { $('tauntBtn').textContent = t || '攻 心'; },
  enableTaunt(v) { $('tauntBtn').disabled = !v; },
  clearCodex() { $('codexList').innerHTML = '<li class="empty">尚无记录 —— 盯住他的手。</li>'; },
  codexAdd(html) {
    const list = $('codexList');
    list.querySelector('.empty')?.remove();
    const li = document.createElement('li');
    li.innerHTML = html;
    list.prepend(li);
    while (list.children.length > 6) list.lastChild.remove();
  },
  bubble(text, dur = 2.6) { oppChar.say(text, dur); },
  banner(main, sub = '') {
    $('bannerMain').textContent = main;
    $('bannerSub').textContent = sub;
    const b = $('banner');
    b.classList.remove('hidden', 'show');
    void b.offsetWidth;
    b.classList.add('show');
  },
  vignette(on) { $('vignette').classList.toggle('on', on); },
  showSeedModal(seedTxt, deckHtml) {
    $('modalSeed').textContent = seedTxt;
    $('deckOrder').innerHTML = deckHtml;
    $('seedModal').classList.remove('hidden');
  },
  promptAction({ toCall, stack, presets }) {
    return new Promise(resolve => {
      const btns = [...actions.querySelectorAll('button')];
      const vis = {
        fold: toCall > 0,
        check: toCall === 0,
        call: toCall > 0,
        raise: stack > toCall && presets.length > 0,
        allin: stack > 0,
      };
      const cleanup = () => {
        actions.classList.add('hidden');
        raiseOpts.classList.add('hidden');
      };
      actions.classList.remove('hidden');
      const fresh = btns.map(b => { const c = b.cloneNode(true); b.replaceWith(c); return c; });
      for (const b of fresh) {
        const act = b.dataset.act;
        b.style.display = vis[act] ? '' : 'none';
        if (act === 'call') b.innerHTML = toCall >= stack ? `全压跟注 <b>${stack}</b>` : `跟注 <b>${toCall}</b>`;
        if (act === 'raise') b.textContent = toCall > 0 ? '加注' : '下注';
        b.addEventListener('click', () => {
          if (act === 'raise') {
            raiseOpts.innerHTML = '';
            raiseOpts.classList.remove('hidden');
            for (const p of presets) {
              const pb = document.createElement('button');
              pb.innerHTML = `${p.label} <b>${p.amount}</b>`;
              pb.addEventListener('click', () => { cleanup(); resolve({ type: 'raise', amount: p.amount }); });
              raiseOpts.appendChild(pb);
            }
            const cancel = document.createElement('button');
            cancel.textContent = '返回';
            cancel.addEventListener('click', () => raiseOpts.classList.add('hidden'));
            raiseOpts.appendChild(cancel);
          } else {
            cleanup();
            resolve({ type: act });
          }
        });
      }
    });
  },
  onTaunt(fn) { $('tauntBtn').onclick = fn; },
  onVerify(fn) { $('verifyBtn').onclick = fn; },
};
$('closeSeed').addEventListener('click', () => $('seedModal').classList.add('hidden'));

// 席位详情复用完整武将卡;只关闭详情,不触发任何战斗流程。
$('oppChar').addEventListener('seatinspect', e => {
  const profile = e.detail;
  const el = $('bossIntro');
  renderGeneralCard($('generalIntroCard'), {
    name: profile.name || '敌将',
    bio: profile.bio || '乱世群雄,各有一局。',
    traits: profile.traits || {},
    rule: '牌桌之上,观其取舍。',
    skin: profile.skin || 'default',
    eyebrow: '阵 前 将 谱',
    year: '当前对局',
    gate: !!profile.boss,
  });
  $('introSkip').innerHTML = '合 卷<small>返回牌桌</small>';
  el.dataset.kind = 'boss';
  el.classList.toggle('gate', !!profile.boss);
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('show');
  $('introSkip').addEventListener('click', () => {
    el.classList.remove('show');
    el.classList.add('hidden');
  }, { once: true });
});

// ---------------- 屏幕切换 ----------------
const SCREENS = ['intro', 'scroll', 'page', 'map', 'battle'];
function show(name) {
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== name);
  document.body.dataset.screen = name;
  if (name === 'intro') $('intro').classList.remove('fade');
}

// ---------------- 调试钩子 ----------------
const PARAMS = new URLSearchParams(location.search);
// ?seed=固定种子 ?chips=起手筹码 ?opp=对方筹码 ?bossopp=关卡筹码 ?fast=演出加速 ?traits=六维覆盖
// ?chapter=回目id 直达某页 ?omen=fx 预选天时 ?stage=boss 直达关卡(行军图前段置为已竟)
function traitsParam() {
  const s = PARAMS.get('traits');
  if (!s) return null;
  const t = {};
  s.split(',').forEach((v, i) => { if (Number.isFinite(+v) && TRAITS[i]) t[TRAITS[i]] = +v; });
  return t;
}
const TRAITS_OVERRIDE = traitsParam();
const personaOf = traits => makePersona(TRAITS_OVERRIDE || traits);

// 无名部曲使用原版通用头像,名将按档案匹配。
function opponentSkin(cfg, gen, boss) {
  if (gen?.skin) return gen.skin;
  if (/写卷人|天命/.test(cfg.name || '')) return 'default';
  return boss ? 'commander' : 'soldier';
}

// ---------------- 残卷主循环 ----------------
let P = SC.loadProgress();     // 补全度(持久)
let R = null;                  // 当前回的运行态

let marchBusy = false; // 亮相/战斗/事件期间锁住军令,防连点重入
const map = createMap({
  getRun: () => R,
  async onPick(node) {
    if (marchBusy) return;
    marchBusy = true;
    try {
      if (node.type === 'battle') {
        const win = await enterBattle(node, R.chapter.skirmish, { stack: 500 });
        if (!win) return await endChapter(false);
        node.done = true;
        R.current = node.id;
        show('map');
        map.render();
        return;
      }
      if (node.type === 'boss') return await enterBoss(node);
      const key = await eventModal(node.type, R);
      if (key === 'heal') R.chips += 80;
      if (key === 'money') R.chips += 150;
      if (key === 'loot') R.chips += 150;
      if (key === 'calm') R.keenEye = true;
      if (key === 'eye') R.keenEye = true;
      if (key === 'bribe') R.bribe = true;
      node.done = true;
      R.current = node.id;
      map.render();
    } finally {
      marchBusy = false;
    }
  },
});

function showCodex() {
  R = null;
  show('scroll');
  SC.renderCodex(P, openChapterPage);
}

function openChapterPage(chapter) {
  const ov = SC.causalFor(P, chapter); // 页间因果:前页改写,此页题记随变
  const alt = chapter.id === 'wuzhangyuan' && SC.isYeshi(SC.pageState(P, 'wuzhangyuan'));
  const begin = (asZhuge) => async () => {
    const fx = PARAMS.get('omen') || await SC.pickOmen(chapter, FX);
    startMarch(chapter, fx, { asZhuge });
  };
  show('page');
  SC.renderPage(chapter, begin(false), showCodex, {
    premise: ov?.premise,
    note: ov?.note,
    alt: alt ? { label: '执子之手', start: begin(true) } : null,
  });
}

function startMarch(chapter, omenFx, { asZhuge = false } = {}) {
  const baseChips = parseInt(PARAMS.get('chips') || '1000', 10);
  R = {
    chapter, omenFx, asZhuge,
    chips: baseChips + (omenFx === 'supply' ? 200 : 0),
    nodes: buildMarch(chapter),
    current: null,
    seed: PARAMS.get('seed') || Math.random().toString(16).slice(2, 8).toUpperCase(),
    keenEye: omenFx === 'keenEye',
    oppMorale0: omenFx === 'sow' ? -1 : 0,
    raid: omenFx === 'raid',
    bribe: false,
    marchInfo: `${chapter.year || '残卷'} · ${chapter.name}`,
  };
  if (PARAMS.get('stage') === 'boss') { // 调试:直达关卡
    const last = R.nodes[R.nodes.length - 1];
    for (const n of R.nodes) if (n.id !== last.id) n.done = true;
    R.current = R.nodes[R.nodes.length - 2]?.id || null;
  }
  $('marchTitle').textContent = `行 军 图 · ${chapter.name}`;
  show('map');
  map.render();
}

// 一场战斗(遭遇战/关卡单场);返回 Promise<win:boolean>
async function enterBattle(node, cfg, { stack, roundInfo = '', noOverride = false } = {}) {
  const boss = node.type === 'boss';
  let oppStack = (PARAMS.get('opp') && !noOverride) ? parseInt(PARAMS.get('opp'), 10) : (stack ?? cfg.stack);
  if (boss && PARAMS.get('bossopp') && !noOverride) oppStack = parseInt(PARAMS.get('bossopp'), 10);
  if (R.bribe) { oppStack = Math.max(300, oppStack - 250); R.bribe = false; }
  if (R.raid && boss) { oppStack = Math.max(300, oppStack - 200); R.raid = false; }
  const battleSeed = `${R.seed}#${R.chapter.id}#${node.id}${roundInfo}`;
  ui.setSeed('#' + battleSeed);
  const gen = getGeneral(cfg.gen);
  if (!boss) await opponentIntro(R.chapter, cfg, false);

  show('battle');
  return new Promise(resolve => {
    startBattle({
      playerStack: R.chips,
      oppStack,
      blinds0: cfg.blinds || [10, 20],
      escalateEvery: cfg.escalate || 4,
      boss,
      oppName: cfg.name,
      persona: personaOf(cfg.traits),
      rule: R.chapter.rule || {},
      oppMorale0: R.oppMorale0,
      general: gen,
      oppSkin: opponentSkin(cfg, gen, boss),
      playerName: boss && R.asZhuge ? '诸葛亮' : undefined, // 执子之手:你执丞相
      zhiZi: boss && R.asZhuge,
      seed: battleSeed,
      keenEye: R.keenEye,
      ui, audio, oppChar,
      onTell(t) { if (gen) annalsTell(cfg.gen, t); },
      onEnd(win, finalStack) {
        R.chips = Math.max(0, finalStack);
        if (gen) annalsRecord(cfg.gen, win);
        resolve(win);
      },
    });
  });
}

// 全对手亮相:遭遇战短卡、关卡完整卡;点击「应战」可立即跳过
async function opponentIntro(chapter, cfg, boss) {
  const el = $('bossIntro');
  const gen = getGeneral(cfg.gen);
  renderGeneralCard($('generalIntroCard'), {
    name: cfg.name,
    bio: gen?.bio || (boss ? '乱世群雄,各有一局。' : '无名之辈,也守着不肯退的一步。'),
    quote: gen?.barks?.open || (boss ? '此路,先问过我的牌。' : '前路遭遇,胜负手上见。'),
    traits: cfg.traits,
    rule: chapter.ruleText || chapter.premise,
    skin: opponentSkin(cfg, gen, boss),
    eyebrow: boss ? (chapter.gate ? '大 关' : '敌 将 亮 相') : '遭 遇',
    year: chapter.year || '残卷深处',
    gate: boss && chapter.gate,
    skirmish: !boss,
  });
  el.dataset.kind = boss ? 'boss' : 'skirmish';
  el.classList.toggle('gate', !!(boss && chapter.gate));
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('show');
  let skip;
  const skipped = new Promise(resolve => { skip = resolve; });
  $('introSkip').addEventListener('click', skip, { once: true });
  await Promise.race([wait(boss ? (chapter.gate ? 3.6 : 3.0) : 2.2), skipped]);
  el.classList.remove('show');
  el.classList.add('hidden');
}
async function bossIntro(chapter) {
  return opponentIntro(chapter, chapter.boss, true);
}

// 关卡:单场或连战(gauntlet)
async function enterBoss(node) {
  const c = R.chapter;
  await bossIntro(c);
  const rounds = c.rule?.gauntlet || 1;
  for (let r = 1; r <= rounds; r++) {
    R.marchInfo = rounds > 1 ? `${c.name} · 第 ${r} / ${rounds} 阵` : `${c.year || '残卷'} · ${c.name}`;
    if (rounds > 1) {
      ui.banner(`第 ${r} 阵`, rounds > 1 && c.id === 'qiqin' ? '擒他,也放他。' : '');
      await wait(1.0);
    }
    const win = await enterBattle(node, c.boss, { stack: c.boss.stack, roundInfo: '#r' + r });
    if (!win) {
      // 专属机制·七进七出:本场首次清台,半仓再战
      if (c.rule?.reviveOnce && !R.revived) {
        R.revived = true;
        R.chips = Math.max(500, R.chips);
        ui.banner('七进七出', '你杀出重围,又杀了回来。');
        audio.chime();
        await wait(1.6);
        const again = await enterBattle(node, c.boss, {
          stack: Math.max(300, Math.floor(c.boss.stack * 0.6)),
          roundInfo: '#revive',
          noOverride: true, // 复活战不受 ?opp/?bossopp 影响(测试以此制造必败首战)
        });
        if (again) { node.done = true; R.current = node.id; return endChapter(true); }
      }
      return endChapter(false);
    }
    if (r < rounds) {
      R.chips += 100; // 阵间小补给
      await wait(0.8);
    }
  }
  node.done = true;
  R.current = node.id;
  return endChapter(true);
}

// ---------------- 列传(观阵录持久化) ----------------
function annals() { return P.annals || (P.annals = {}); }
function annalsRecord(genId, win) {
  const a = annals()[genId] || (annals()[genId] = { seen: 0, won: 0, tells: {} });
  a.seen++;
  if (win) a.won++;
  SC.saveProgress(P);
}
function annalsTell(genId, t) {
  const a = annals()[genId] || (annals()[genId] = { seen: 0, won: 0, tells: {} });
  const k = t.shown;
  a.tells[k] = a.tells[k] || { n: 0, hit: 0 };
  a.tells[k].n++;
  if (t.hit) a.tells[k].hit++;
  SC.saveProgress(P);
}
// 列传六维:取该武将首次出场回的属性包
function traitsOfGen(genId) {
  const c = CHAPTERS.find(c => c.boss?.gen === genId);
  return c ? c.boss.traits : {};
}

$('annalsBtn').addEventListener('click', () => {
  SC.renderAnnals(P, { generals: GENERALS, chapters: CHAPTERS, describeTraits, traitsOf: traitsOfGen });
  $('annalsModal').classList.remove('hidden');
});
$('annalsClose').addEventListener('click', () => $('annalsModal').classList.add('hidden'));

async function endChapter(win) {
  const c = R.chapter;
  if (!win) { // 兵败即刻入账:正史写入残卷
    SC.markPage(P, c.id, 'history');
    SC.saveProgress(P);
  }
  const yeshiExtra = R.asZhuge ? '批注:这一局,你亲手执过丞相之手。' : '';
  const res = await SC.settle(c, { win, annotation: c.defeat, yeshiExtra });
  if (win) {
    SC.markPage(P, c.id, res.yeshiKey || 'yeshi');
    if (c.apocrypha) P.apocWins = (P.apocWins || 0) + 1; // 无终稿:只计数,不占正卷
    if (R.asZhuge) P.flags = { ...P.flags, zhizishou: true };
    SC.saveProgress(P);
    if (c.type === 'finale') {
      const q = await SC.finale(P);
      P.endings.push(q);
      SC.saveProgress(P);
    }
    return showCodex();
  }
  SC.markPage(P, c.id, 'history');
  SC.saveProgress(P);
  if (res.r === 'retry') return startMarch(c, R.omenFx, { asZhuge: R.asZhuge });
  return showCodex();
}

// ---------------- 残卷无终稿(NG+:随机外传) ----------------
import { genApocrypha } from './apocrypha.js';
$('apocBtn').addEventListener('click', () => openChapterPage(genApocrypha()));

// ---------------- 开卷 ----------------
$('startBtn').addEventListener('click', () => {
  audio.resume();
  $('intro').classList.add('fade');
  setTimeout(() => {
    const direct = PARAMS.get('chapter');
    const c = direct ? getChapter(direct) : null;
    if (c) openChapterPage(c);
    else showCodex();
  }, 900);
});
