// board.js —— 在线牌桌渲染器:把服务端权威视图变成 2.5D 牌桌。
// 与 battle.js 同一套视觉语言(.card/.chip/#oppChar 席位组件、弧形对手坐标、
// 种子验牌),但状态完全来自 room 帧:客户端不做任何规则判断,只做展示与转发操作。
import * as PK from '../poker.js';
import { wait } from '../fx2d.js';
import { POSE, renderSeatRoles } from '../character.js';
import { createOpponent } from '../character.js';
import { getGeneral } from '../generals.js';
import { localizeGeneral } from '../i18n.js';
import { t } from '../i18n.js';
import { BLIND_PRESETS } from './protocol.js';
import { generalPortrait } from './lobby.js';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function cardEl(id, big = false, seatId = '') {
  const el = document.createElement('div');
  el.className = 'card' + (PK.SUIT_RED[PK.suitOf(id)] ? ' red' : '') + (big ? ' big' : '');
  const r = PK.RANKS[PK.rankOf(id)], suit = PK.SUITS[PK.suitOf(id)];
  const face = r >= 9
    ? `<div class="pip big-letter">${r}</div><div class="pip mid-suit">${suit}</div>`
    : `<div class="pip mid-suit only">${suit}</div><div class="pip small-rank">${r}</div>`;
  el.innerHTML = `<div class="inner"><div class="face front"><div class="corner tl">${r}<br>${suit}</div><div class="center">${face}</div><div class="corner br">${r}<br>${suit}</div></div><div class="face back"><div class="back-sig">♦</div></div></div>`;
  el.dataset.cardId = id;
  if (seatId) el.dataset.seatId = seatId;
  return el;
}

function backCardEl(seatId = '') {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = '<div class="inner"><div class="face front"><div class="corner tl"></div><div class="corner br"></div><div class="center"></div></div><div class="face back"><div class="back-sig">♦</div></div></div>';
  if (seatId) el.dataset.seatId = seatId;
  return el;
}

function renderStackChips(el, count, tone) {
  el.innerHTML = '';
  const n = Math.min(Math.max(0, Math.round(count / 60)), 10);
  for (let i = 0; i < n; i++) {
    const chip = document.createElement('div');
    chip.className = 'chip ' + tone;
    chip.style.bottom = i * 5 + 'px';
    el.appendChild(chip);
  }
}

// 对手弧形坐标(与 battle.js opponentSpot 同公式)
function opponentSpot(index, count) {
  if (count === 1) return { x: 50, y: 27 };
  if (count === 2) return { x: [31, 69][index], y: 22 };
  if (count === 3) return { x: [20, 50, 80][index], y: 22 };
  const t = index / (count - 1);
  return { x: 8 + t * 84, y: Math.round(13 + 21 * (1 - Math.sin(Math.PI * t))) };
}

const SLOT = {
  community: i => ({ x: 50 + (i - 2) * 11.5, y: 45 }),
  pot: { x: 50, y: 38 },
  deck: { x: 10, y: 42 },
  muck: { x: 10, y: 66 },
  heroHole: (i, narrow) => ({ x: 50 + (i ? (narrow ? 14 : 10) / 2 : -(narrow ? 14 : 10) / 2), y: 97 }),
  heroBet: { x: 50, y: 66 },
  heroStack: { x: 87, y: 76 },
};

export function createOnlineBoard(root, net, hooks = {}) {
  const { onLeave = () => {} } = hooks;
  const cardLayer = root.querySelector('#onCardLayer');
  const oppMount = root.querySelector('#onlineOpp');
  const seatsView = createOpponent(oppMount);
  const piles = new Map();          // seatIndex -> { bet, stack }
  const cards = new Map();          // cardId -> el
  let boardEls = [];
  let renderedHand = 0;
  let renderEpoch = 0;
  let renderedBoard = -1;
  let countdownTimer = null;
  let deadline = 0;
  let lastPhase = '';
  let replayedHandFor = 0;          // lastHand 展示过的 handNum

  // ---------- 坐标 ----------
  // 手机端手牌锚定操作坞上方(同 battle.js 的 heroHoleY):视口被浏览器工具栏
  // 压矮后,挂桌下缘(y:97)的手牌会被固定像素高的 #onDock 盖住。
  function heroHoleY() {
    const layer = cardLayer.getBoundingClientRect();
    const dock = root.querySelector('#onDock');
    if (!dock || !layer.height) return 97;
    const aboveDock = dock.getBoundingClientRect().top - 62 - layer.top; // 坞顶-8px 间隙-半张牌
    return Math.max(60, Math.min(97, aboveDock / layer.height * 100));
  }
  function slotFor(room, seat, kind, cardIndex = 0) {
    const you = room.you?.seatIndex;
    const narrow = window.innerWidth <= 640;
    if (seat.index === you) {
      if (kind === 'hole') {
        const slot = SLOT.heroHole(cardIndex, narrow);
        return narrow ? { ...slot, y: heroHoleY() } : slot;
      }
      if (kind === 'bet') return SLOT.heroBet;
      return SLOT.heroStack;
    }
    const opponents = room.seats.filter(item => item.kind !== 'open' && item.index !== you);
    const i = opponents.findIndex(item => item.index === seat.index);
    const spot = opponentSpot(i, opponents.length);
    if (kind === 'hole') {
      const offset = narrow ? (opponents.length >= 4 ? 6 : 8) : (opponents.length >= 4 ? 4.5 : 5.5);
      return { x: spot.x + (cardIndex ? offset : -offset), y: spot.y };
    }
    if (kind === 'bet') return { x: spot.x, y: opponents.length === 1 ? 26 : spot.y + 8 };
    return { x: opponents.length === 1 ? 11 : spot.x, y: opponents.length === 1 ? 13 : Math.max(3, spot.y - 11) };
  }

  function slotPos(slot, el) {
    const r = cardLayer.getBoundingClientRect();
    return { x: r.width * slot.x / 100 - el.offsetWidth / 2, y: r.height * slot.y / 100 - el.offsetHeight / 2 };
  }

  function place(el, slot, immediate = false) {
    if (immediate) el.classList.add('no-anim');
    const pos = slotPos(slot, el);
    el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    if (immediate) { void el.offsetWidth; el.classList.remove('no-anim'); }
  }

  function pileTo(el, slot) {
    const r = cardLayer.getBoundingClientRect();
    el.style.left = `${r.width * slot.x / 100}px`;
    el.style.top = `${r.height * slot.y / 100}px`;
  }

  function layoutPiles(room) {
    pileTo(root.querySelector('#onPot'), SLOT.pot);
    pileTo(root.querySelector('#onDeck'), SLOT.deck);
    for (const [seatIndex, pair] of piles) {
      const seat = room.seats[seatIndex];
      pileTo(pair.bet, slotFor(room, seat, 'bet'));
      pileTo(pair.stack, slotFor(room, seat, 'stack'));
    }
  }

  // ---------- 席位 ----------
  function seatName(seat) {
    if (!seat.genId) return t('online.noGeneral');
    return localizeGeneral(getGeneral(seat.genId), seat.genId)?.name || seat.genId;
  }

  function rolesOf(room, seat) {
    const roles = seat.roles.map(role => ({
      button: { kind: 'button', label: t('battle.roles.button') },
      sb: { kind: 'sb', label: `${t('battle.roles.sb')} ${BLIND_PRESETS[room.config.blindsIdx]?.[0] ?? 10}` },
      bb: { kind: 'bb', label: `${t('battle.roles.bb')} ${BLIND_PRESETS[room.config.blindsIdx]?.[1] ?? 20}` },
    }[role])).filter(Boolean);
    if (seat.autopilot) roles.push({ kind: 'ai', label: t('online.autopilot') });
    if (seat.kind === 'npc') roles.push({ kind: 'ai', label: t('online.npc') });
    return roles;
  }

  function refreshSeats(room) {
    const you = room.you?.seatIndex;
    const others = room.seats.filter(seat => seat.kind !== 'open' && seat.index !== you);
    seatsView.setPlayers(others.map(seat => ({
      id: String(seat.index),
      name: seatName(seat),
      stack: seat.stack,
      skin: getGeneral(seat.genId)?.skin || 'default',
      boss: false,
    })));
    for (const seat of others) {
      const id = String(seat.index);
      seatsView.setProfile({ bio: getGeneral(seat.genId)?.bio || '', traits: [] }, id);
      seatsView.setStack(seat.stack, id);
      seatsView.setFolded(!!seat.folded, id);
      seatsView.setActive(!!seat.actor, id);
      seatsView.setPose(seat.actor ? POSE.THINKING : POSE.NEUTRAL, id);
      seatsView.setRoles(rolesOf(room, seat), id);
      seatsView.setEliminated(!!seat.eliminated, id);
      if (seat.showdown) seatsView.setShowdown(PK.getHandName(seat.showdown.cat), seat.awarded ? 'win' : '', id);
      else seatsView.clearShowdown(id);
    }
    // 我方席位
    const mine = you != null && you >= 0 ? room.seats[you] : null;
    root.querySelector('#onYouName').textContent = mine ? `${seatName(mine)} · ${t('online.you')}` : t('online.you');
    root.querySelector('#onYouStack').textContent = mine?.stack ?? 0;
    renderSeatRoles(root.querySelector('#onYouRoles'), mine ? rolesOf(room, mine) : []);
    root.querySelector('#onYouPlate').classList.toggle('is-folded', !!mine?.folded);
    root.querySelector('#onYouFold').classList.toggle('hidden', !mine?.folded);
    // 筹码堆
    if (mine && !piles.has(mine.index)) ensurePiles(room);
    for (const [seatIndex, pair] of piles) {
      const seat = room.seats[seatIndex];
      renderStackChips(pair.stack, seat.stack, seat.index === you ? 'ivory' : 'ebony');
      renderStackChips(pair.bet, seat.bet || 0, seat.index === you ? 'ivory' : 'ebony');
    }
    const pot = room.hand ? room.hand.pot : (room.lastHand?.pot ?? 0);
    renderStackChips(root.querySelector('#onPot'), pot, 'pot');
    root.querySelector('#onPotNum').textContent = pot;
  }

  function ensurePiles(room) {
    piles.clear();
    const tableEl = root.querySelector('#onTable');
    for (const seat of room.seats) {
      if (seat.kind === 'open') continue;
      const betEl = document.createElement('div');
      const stackEl = document.createElement('div');
      betEl.className = 'stack opponent-bet';
      stackEl.className = 'stack opponent-stack';
      betEl.dataset.seatId = seat.id;
      stackEl.dataset.seatId = seat.id;
      tableEl.append(betEl, stackEl);
      piles.set(seat.index, { bet: betEl, stack: stackEl });
    }
    layoutPiles(room);
  }

  // ---------- 牌 ----------
  function clearCards() {
    for (const el of cards.values()) el.remove();
    cards.clear();
    boardEls = [];
    renderedBoard = -1;
  }

  async function dealHole(room) {
    const you = room.you?.seatIndex;
    for (const seat of room.seats) {
      if (seat.kind === 'open' || !seat.holeCount) continue;
      const mine = seat.index === you;
      const hole = mine ? room.hand.hole : null;
      for (let i = 0; i < seat.holeCount; i++) {
        const el = mine && hole ? cardEl(hole[i], true, seat.id) : backCardEl(seat.id);
        cardLayer.appendChild(el);
        cards.set(el.dataset.cardId = `h${seat.index}_${i}`, el);
        place(el, SLOT.deck, true);
        el.classList.toggle('flipped', mine);
        void el.offsetWidth;
        place(el, slotFor(room, seat, 'hole', i));
        await wait(0.04);
      }
    }
  }

  async function dealBoard(room) {
    while (renderedBoard < room.hand.board.length - 1) {
      renderedBoard++;
      const id = room.hand.board[renderedBoard];
      const el = cardEl(id);
      cardLayer.appendChild(el);
      cards.set(`b${renderedBoard}`, el);
      place(el, SLOT.deck, true);
      void el.offsetWidth;
      place(el, SLOT.community(renderedBoard));
      await wait(0.3);
    }
    const hole = room.hand.hole;
    if (hole?.length === 2) root.querySelector('#onHandLabel').textContent = `${t('poker.handDesc.lead')} ${PK.madeName(hole, room.hand.board)}`;
  }

  async function revealShowdown(room) {
    const last = room.lastHand;
    if (!last) return;
    for (const reveal of last.reveals || []) {
      for (let i = 0; i < (reveal.hole?.length || 0); i++) {
        const key = `h${reveal.seat}_${i}`;
        let el = cards.get(key);
        if (!el) {
          el = cardEl(reveal.hole[i], false, `s${reveal.seat}`);
          cardLayer.appendChild(el);
          cards.set(key, el);
          place(el, slotFor(room, room.seats[reveal.seat], 'hole', i), true);
        }
        el.dataset.cardId = String(reveal.hole[i]);
        const tl = el.querySelector('.corner.tl');
        if (tl) tl.innerHTML = `${PK.RANKS[PK.rankOf(reveal.hole[i])]}<br>${PK.SUITS[PK.suitOf(reveal.hole[i])]}`;
        el.classList.add('flipped');
      }
    }
    for (const cardId of last.winnersBest5 || []) {
      const el = cards.get(String(cardId)) || [...cards.entries()].find(([, node]) => String(node.dataset.cardId) === String(cardId))?.[1];
      el?.classList.add('hl');
    }
  }

  async function sweepCards() {
    for (const el of cards.values()) {
      el.classList.remove('flipped', 'hl');
      place(el, { x: 50, y: -30 });
      el.style.opacity = 0;
    }
    await wait(0.5);
    clearCards();
  }

  // ---------- 行动 ----------
  function renderActions(room) {
    const actionsBox = root.querySelector('#onActions');
    const raiseBox = root.querySelector('#onRaise');
    const hand = room.hand;
    const mine = hand && room.you && hand.actor === `s${room.you.seatIndex}`;
    if (!mine) { actionsBox.classList.add('hidden'); raiseBox.classList.add('hidden'); stopCountdown(); return; }
    const seat = room.seats[room.you.seatIndex];
    const toCall = hand.toCall;
    const canRaise = hand.canRaise;
    const visible = {
      fold: toCall > 0,
      check: toCall === 0,
      call: toCall > 0,
      raise: canRaise,
      allin: seat.stack > 0,
    };
    actionsBox.classList.remove('hidden');
    for (const button of actionsBox.querySelectorAll('button')) {
      const act = button.dataset.act;
      button.style.display = visible[act] ? '' : 'none';
      if (act === 'fold') button.textContent = t('poker.actions.fold');
      if (act === 'check') button.textContent = t('poker.actions.check');
      if (act === 'call') button.innerHTML = toCall >= seat.stack
        ? `${t('poker.actions.allInCall')} <b>${seat.stack}</b>`
        : `${t('poker.actions.call')} <b>${toCall}</b>`;
      if (act === 'raise') button.textContent = toCall > 0 ? t('poker.actions.raise') : t('poker.actions.bet');
      if (act === 'allin') button.innerHTML = `${t('poker.actions.allIn')} <b>${seat.stack}</b>`;
      button.disabled = !!button.dataset.busy;
    }
    if (canRaise) {
      const presets = [];
      for (const ratio of [0.5, 1, 2]) {
        const extra = Math.max(hand.minRaise, Math.round(hand.pot * ratio / 5) * 5);
        const amount = Math.min(seat.stack, toCall + extra);
        if (amount > toCall && !presets.some(p => p.amount === amount)) {
          presets.push({ label: `${ratio}× ${t('battle.pot')}`, amount });
        }
      }
      raiseBox.innerHTML = presets.map(preset =>
        `<button data-amount="${preset.amount}">${preset.label} <b>${preset.amount}</b></button>`).join('')
        + `<button class="ghost" data-raise-cancel>${t('poker.actions.cancel')}</button>`;
    }
    startCountdown(hand.deadline, room.config.turnMs);
  }

  function bindActions() {
    const actionsBox = root.querySelector('#onActions');
    const raiseBox = root.querySelector('#onRaise');
    actionsBox.addEventListener('click', event => {
      const button = event.target.closest('button[data-act]');
      if (!button || button.disabled) return;
      const act = button.dataset.act;
      if (act === 'raise') { raiseBox.classList.remove('hidden'); return; }
      sendAct(act === 'allin' ? 'allin' : act, 0, button);
    });
    raiseBox.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.raiseCancel !== undefined) { raiseBox.classList.add('hidden'); return; }
      sendAct('raise', Number(button.dataset.amount) || 0, button);
    });
    function sendAct(kind, amount, button) {
      button.disabled = true;
      button.dataset.busy = '1';
      net.pokerAction(kind, amount)
        .catch(error => {
          if (error.code === 'NOT_YOUR_TURN' || error.code === 'TIMEOUT' || error.code === 'OFFLINE') {
            banner(t('online.err.actionFailed'), error.message);
          }
        })
        .finally(() => { delete button.dataset.busy; });
    }
  }

  function startCountdown(deadlineAt, turnMs) {
    stopCountdown();
    const wrapEl = root.querySelector('#onCountdown');
    const barEl = wrapEl.querySelector('i');
    if (!deadlineAt) { wrapEl.classList.add('hidden'); return; }
    deadline = deadlineAt;
    wrapEl.classList.remove('hidden');
    const tick = () => {
      const left = deadline - net.now();
      const ratio = Math.max(0, Math.min(1, left / turnMs));
      barEl.style.width = `${ratio * 100}%`;
      barEl.dataset.low = ratio < 0.25 ? '1' : '0';
      if (left <= 0) stopCountdown();
    };
    tick();
    countdownTimer = setInterval(tick, 250);
  }

  function stopCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = null;
    root.querySelector('#onCountdown')?.classList.add('hidden');
  }

  // ---------- 横幅 / 流水 / 结算 ----------
  function banner(main, sub = '') {
    const el = root.querySelector('#onBanner');
    root.querySelector('#onBannerMain').textContent = main;
    root.querySelector('#onBannerSub').textContent = sub;
    el.classList.remove('hidden', 'show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  function verbLabel(room, event) {
    const seat = event.s != null && event.s >= 0 ? room.seats[event.s] : null;
    const who = seat ? seatName(seat) : '';
    const map = {
      deal: () => t('online.verbs.deal', { n: event.n }),
      blindup: () => t('online.verbs.blindup', { bb: event.a }),
      street: () => t('online.verbs.street', { count: event.a }),
      showdown: () => t('online.verbs.showdown'),
      foldwin: () => `${who} ${t('online.verbs.foldwin')}`,
      elim: () => t('online.verbs.elim', { who }),
      autopilot: () => `${who} ${t('online.verbs.autopilot')}`,
      join: () => t('online.verbs.join', { who }),
      leave: () => t('online.verbs.leave', { who }),
      over: () => t('online.verbs.over'),
      npc: () => t('online.verbs.npc', { who }),
      general: () => `${who} ${t('online.verbs.general', { gen: event.x ? seatName({ genId: event.x }) : '' })}`
    };
    const action = { fold: 'fold', check: 'check', call: 'call', bet: 'bet', raise: 'raise', allin: 'allin' }[event.t];
    if (action) {
      const label = t(`poker.actions.${action === 'allin' ? 'allIn' : action}`);
      return `${who} ${label}${event.a ? ` <b>${event.a}</b>` : ''}`;
    }
    return (map[event.t]?.() || '') || `${who} ${event.t}`;
  }

  function renderLog(room) {
    const list = root.querySelector('#onLog');
    list.innerHTML = room.log.slice(-10).map(event => `<li data-kind="${event.t}">${verbLabel(room, event)}</li>`).join('');
  }

  function renderLastHand(room, previousPhase) {
    const last = room.lastHand;
    if (!last || last.handNum === replayedHandFor) return;
    replayedHandFor = last.handNum;
    const you = room.you?.seatIndex;
    const win = last.awards?.[you] > 0;
    const reveals = last.reveals || [];
    if (last.kind === 'showdown') {
      const names = [...new Set(last.pots.flatMap(pot => pot.winners))].map(index => seatName(room.seats[index]));
      banner(`${names.join(' · ')} ${t('online.winsPot')}`, reveals.map(reveal => `${seatName(room.seats[reveal.seat])} · ${PK.getHandName(reveal.cat)}`).join(' · '));
      for (const seat of room.seats) {
        if (seat.kind === 'open') continue;
        const reveal = reveals.find(item => item.seat === seat.index);
        if (reveal && seat.index !== you) seatsView.setShowdown(PK.getHandName(reveal.cat), last.awards?.[seat.index] > 0 ? 'win' : 'lose', String(seat.index));
      }
    } else if (last.kind === 'foldwin') {
      const winner = Object.entries(last.awards || {}).find(([, amount]) => amount > 0)?.[0];
      banner(`${seatName(room.seats[Number(winner)])} ${t('online.winsPot')}`, `${t('battle.pot')} ${last.pots.reduce((sum, pot) => sum + pot.amount, 0)}`);
    }
    void previousPhase;
  }

  function renderEnded(room, previousPhase) {
    if (room.phase !== 'ended') { root.querySelector('#onEnd').classList.add('hidden'); return; }
    if (previousPhase === 'ended') return;
    const box = root.querySelector('#onEnd');
    const rows = (room.standings || []).map((row, rank) => `
      <li class="${rank === 0 ? 'champion' : ''}">
        <span class="rank">${rank + 1}</span>${generalPortrait(row.genId)}
        <span class="seat-name">${esc(seatName(row))}</span>
        <b>${row.stack}</b>
      </li>`).join('');
    box.querySelector('#onEndList').innerHTML = rows;
    const youRow = (room.standings || []).find(row => row.index === room.you?.seatIndex);
    box.querySelector('#onEndNote').textContent = youRow?.stack != null && room.standings?.[0]?.index === room.you?.seatIndex
      ? t('online.endChampion') : t('online.endNote');
    box.querySelector('#onRematch').classList.toggle('hidden', !room.you?.isHost);
    box.classList.remove('hidden');
  }

  // ---------- 验牌 ----------
  async function verifyDeck() {
    try {
      const reply = await new Promise((resolve, reject) => {
        const off = net.on('deck', payload => { off(); resolve(payload); });
        net.verifyDeck().catch(error => { off(); reject(error); });
      });
      $('modalSeed').textContent = `#${reply.seed}`;
      $('deckOrder').innerHTML = reply.deck.map(id => `<span class="${PK.SUIT_RED[PK.suitOf(id)] ? 'red' : 'blk'}">${PK.cardName(id)}</span>`).join(' ');
      $('seedModal').classList.remove('hidden');
    } catch (error) {
      banner(t('online.err.verify'), error.message);
    }
  }

  // ---------- 主渲染 ----------
  async function render(room) {
    const epoch = ++renderEpoch;
    const phase = room.phase;
    const playing = phase === 'playing';
    root.classList.remove('hidden');
    document.getElementById('onCode').textContent = room.code;
    root.querySelector('#onBlindLabel').textContent = playing
      ? t('online.blindLine', {
          sb: BLIND_PRESETS[room.config.blindsIdx]?.[0] ?? 10,
          bb: BLIND_PRESETS[room.config.blindsIdx]?.[1] ?? 20,
          n: room.hand?.handNum ?? 0,
          seats: room.seats.filter(seat => seat.kind !== 'open' && !seat.eliminated).length,
        })
      : t('online.waitingLine');
    const seed = room.lastHand?.seed;
    root.querySelector('#onSeedVal').textContent = seed ? `#${seed.split('#')[0]} · ${t('online.handN', { n: lastHandNum(room) })}` : '—';
    root.querySelector('#onVerifyBtn').classList.toggle('hidden', !seed);

    if (!piles.size) ensurePiles(room);
    refreshSeats(room);
    layoutPiles(room);

    if (playing && room.hand) {
      if (renderedHand !== room.hand.handNum) {
        renderedHand = room.hand.handNum;
        renderedBoard = -1;
        await sweepCards();
        if (epoch !== renderEpoch) return;
        await dealHole(room);
        if (epoch !== renderEpoch) return;
      }
      await dealBoard(room);
      if (epoch !== renderEpoch) return;
    } else if (room.lastHand) {
      await revealShowdown(room);
      if (epoch !== renderEpoch) return;
    } else if (phase === 'ended' && renderedHand) {
      await sweepCards();
      renderedHand = 0;
    }
    renderActions(room);
    renderLog(room);
    renderLastHand(room, lastPhase);
    renderEnded(room, lastPhase);
    lastPhase = phase;
  }

  function lastHandNum(room) {
    return room.lastHand?.handNum ?? room.hand?.handNum ?? 0;
  }

  // ---------- 连接状态 ----------

  // ---------- 装配 ----------
  bindActions();
  root.querySelector('#onVerifyBtn').addEventListener('click', () => verifyDeck());
  document.getElementById('onlineLeave').addEventListener('click', () => {
    net.abandon();
    onLeave();
  });
  const offRoom = net.on('room', room => { if (room.phase !== 'lobby') void render(room); });
  const offError = net.on('error', msg => {
    if (msg.code === 'ROOM_NOT_FOUND' || msg.code === 'AUTH_FAILED') {
      banner(t('online.err.roomGone'), msg.message);
    }
  });

  function show() {
    root.classList.remove('hidden');
  }

  function hide() {
    root.classList.add('hidden');
    stopCountdown();
  }

  function destroy() {
    offRoom();
    offError();
    stopCountdown();
    clearCards();
  }

  return { show, hide, destroy, banner };
}
