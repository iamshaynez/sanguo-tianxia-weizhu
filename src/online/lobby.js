// lobby.js —— 在线大厅:建房 / 凭码加入 / 续接上局;房内席位、军师配置与开局。
// 只在 #online 屏内活动,退出即回到目录;牌局由 board.js 接管,本模块不渲染牌桌。
import { GENERALS, getGeneral } from '../generals.js';
import { localizeGeneral } from '../i18n.js';
import { portraitImage } from '../portrait.js';
import { traitGrid } from '../general-card.js';
import { GENERAL_TRAITS, TRAIT_FALLBACK } from './general-traits.js';
import { loadSession } from './net.js';
import { t } from '../i18n.js';
import {
  STACK_PRESETS, BLIND_PRESETS, ESCALATE_PRESETS, TURN_MS_PRESETS,
  SEAT_MIN, SEAT_MAX,
} from './protocol.js';

// 与服务端 traitsOfGen 同语义(客户端本地查表,供选将卡展示)
const traitsOfGen = genId => GENERAL_TRAITS[genId]?.traits || { ...TRAIT_FALLBACK };

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function generalName(genId) {
  return localizeGeneral(GENERALS[genId], genId)?.name || genId || '';
}

function generalOptions(selected = '') {
  return Object.keys(GENERALS)
    .map(genId => {
      const name = generalName(genId);
      return `<option value="${esc(genId)}"${genId === selected ? ' selected' : ''}>${esc(name)}</option>`;
    })
    .join('');
}

function generalPortrait(genId) {
  const gen = getGeneral(genId);
  return `<img class="online-portrait" src="${portraitImage(gen?.skin || 'default')}" alt="${esc(generalName(genId))}">`;
}

export function createOnlineLobby(root, net, hooks = {}) {
  const { onEnterTable = () => {}, onExit = () => {} } = hooks;
  root.classList.add('online-root');
  let currentRoom = null;   // 最近一帧 lobby 视图
  let view = 'home';        // home | room | gone
  const offRoom = net.on('room', room => {
    currentRoom = room;   // 任何阶段先落最新视图,渲染与判断都以它为准
    if (room.phase === 'lobby') {
      if (view !== 'room') {
        view = 'room';
        renderRoom();
      } else {
        renderRoom();
      }
    } else if (room.phase !== 'lobby' && view === 'room') {
      // 开局/终局交给牌桌模块
      onEnterTable(room);
    }
  });
  const offError = net.on('error', msg => {
    if (['ROOM_FULL', 'ROOM_NOT_FOUND', 'ALREADY_STARTED', 'GEN_TAKEN', 'AUTH_FAILED'].includes(msg.code)) {
      view = 'home';
      renderHome(msg.message || t('online.err.generic'));
    }
  });
  const offWelcome = net.on('welcome', msg => {
    if (msg.seatIndex >= 0) onJoinRoom();
  });

  function onJoinRoom() {
    view = 'room';
    renderRoom();            // 先铺底,room 帧到达后重绘
  }

  // ---------- 主页 ----------
  function renderHome(notice = '') {
    root.innerHTML = `
      <div class="online-home">
        <p class="online-kicker">${t('online.kicker')}</p>
        <h2 class="online-title">${t('online.title')}</h2>
        <p class="online-lead">${t('online.lead')}</p>
        ${notice ? `<p class="online-notice">${esc(notice)}</p>` : ''}
        <div class="online-gen-pick">
          <label class="online-label" for="onlineGen">${t('online.pickGeneral')}</label>
          <div class="online-gen-row">
            <select id="onlineGen" class="online-select">${generalOptions(sessionGen())}</select>
            <div class="online-gen-card" id="onlineGenCard"></div>
          </div>
        </div>
        <div class="online-home-actions">
          <button id="onlineCreate">${t('online.create')}</button>
          <div class="online-join">
            <input id="onlineCode" class="online-code-input" maxlength="${6}" placeholder="${t('online.codePh')}" autocomplete="off" autocapitalize="characters">
            <button id="onlineJoin" class="ghost">${t('online.join')}</button>
          </div>
          <button id="onlineResume" class="ghost${loadSession() ? '' : ' hidden'}">${t('online.resume')}</button>
          <button id="onlineLeaveHome" class="ghost">${t('online.back')}</button>
        </div>
        <p class="online-hint">${t('online.hint')}</p>
      </div>`;
    const genSelect = root.querySelector('#onlineGen');
    const paintCard = () => {
      const genId = genSelect.value;
      const traits = traitsOfGen(genId);
      root.querySelector('#onlineGenCard').innerHTML = `
        ${generalPortrait(genId)}
        <div class="online-gen-meta">
          <b>${esc(generalName(genId))}</b>
          <p class="dim">${esc(getGeneral(genId)?.bio || '')}</p>
          ${traitGrid(traits, { compact: true, className: 'online-traits' })}
        </div>`;
    };
    genSelect.addEventListener('change', paintCard);
    paintCard();
    root.querySelector('#onlineCreate').addEventListener('click', async () => {
      lockButtons(true);
      try {
        await net.helloCreate(genSelect.value, readConfig());
        // 成功后 welcome/room 事件接管视图
      } catch (error) {
        lockButtons(false);
        renderHome(t('online.err.' + (error.code === 'OFFLINE' ? 'offline' : 'generic')));
      }
    });
    root.querySelector('#onlineJoin').addEventListener('click', async () => {
      const codeValue = root.querySelector('#onlineCode').value.trim().toUpperCase();
      if (codeValue.length !== 6) { renderHome(t('online.err.code')); return; }
      lockButtons(true);
      try {
        await net.helloJoin(codeValue, genSelect.value);
      } catch (error) {
        lockButtons(false);
        renderHome(translateErr(error.code, error.message));
      }
    });
    root.querySelector('#onlineResume')?.addEventListener('click', async () => {
      lockButtons(true);
      try {
        await net.helloResume();
      } catch (error) {
        lockButtons(false);
        renderHome(translateErr(error.code, error.message));
      }
    });
    root.querySelector('#onlineLeaveHome').addEventListener('click', () => {
      onExit();
    });
    function lockButtons(disabled) {
      for (const button of root.querySelectorAll('button')) button.disabled = disabled;
    }
  }

  function translateErr(code, fallback) {
    const key = {
      OFFLINE: 'offline', TIMEOUT: 'offline', ROOM_FULL: 'full', ROOM_NOT_FOUND: 'notFound',
      ALREADY_STARTED: 'started', GEN_TAKEN: 'genTaken', AUTH_FAILED: 'resume', NO_SESSION: 'resume',
      BAD_CODE: 'code',
    }[code];
    return key ? t(`online.err.${key}`) : (fallback || t('online.err.generic'));
  }

  function sessionGen() {
    return '';
  }

  function readConfig() {
    return {
      seats: 4,
      stack: STACK_PRESETS[1],
      blindsIdx: 0,
      escalate: ESCALATE_PRESETS[1],
      turnMs: TURN_MS_PRESETS[1],
    };
  }

  // ---------- 房内大厅 ----------
  function renderRoom(notice = '') {
    const room = currentRoom;
    if (!room) return;
    const isHost = room.you?.isHost;
    const config = room.config;
    root.innerHTML = `
      <div class="online-room">
        <div class="online-room-head">
          <p class="online-kicker">${t('online.roomKicker')}</p>
          <div class="online-code-line"><span class="online-code">${esc(room.code)}</span>
            <button id="onlineCopy" class="ghost">${t('online.copy')}</button></div>
        </div>
        <p class="online-room-note">${t('online.roomNote')}</p>
        ${notice ? `<p class="online-notice">${esc(notice)}</p>` : ''}
        <div class="online-seats">${room.seats.map(seat => seatCard(seat, isHost)).join('')}</div>
        ${isHost ? hostPanel(config) : `<p class="online-waiting">${t('online.waitingHost')}</p>`}
        <div class="online-room-actions">
          <button id="onlineQuitRoom" class="ghost">${t('online.leave')}</button>
        </div>
      </div>`;
    root.querySelector('#onlineCopy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(room.code);
        root.querySelector('#onlineCopy').textContent = t('online.copied');
        setTimeout(() => { const b = root.querySelector('#onlineCopy'); if (b) b.textContent = t('online.copy'); }, 1500);
      } catch { /* 剪贴板不可用 */ }
    });
    root.querySelector('#onlineQuitRoom').addEventListener('click', () => {
      net.roomAction('leave');
      net.forget();
      view = 'home';
      onExit();
    });
    if (isHost) {
      const npcPick = root.querySelector('#onlineNpcPick');
      root.querySelector('#onlineAddNpc')?.addEventListener('click', async () => {
        net.roomAction('add_npc', { genId: npcPick.value || undefined }).catch(error => {
          console.error('[lobby] add_npc failed:', error.code, error.message);
          renderRoom(error.message);
        });
      });
      root.querySelector('#onlineRandomNpc')?.addEventListener('click', () => {
        net.roomAction('add_npc').catch(() => {});
      });
      root.querySelector('#onlineStart')?.addEventListener('click', () => {
        if (room.seats.filter(seat => seat.kind !== 'open').length < 2) {
          renderRoom(t('online.err.needTwo'));
          return;
        }
        net.roomAction('start_game').catch(error => renderRoom(translateErr(error.code, error.message)));
      });
      for (const button of root.querySelectorAll('[data-remove-npc]')) {
        button.addEventListener('click', () => {
          net.roomAction('remove_npc', { seat: Number(button.dataset.removeNpc) }).catch(() => {});
        });
      }
    }
  }

  function seatCard(seat, isHost) {
    if (seat.kind === 'open') {
      return `<div class="online-seat open">
        <span class="seat-tag">${t('online.seatOpen')}</span>
        <span class="seat-sub">${t('online.seatOpenSub')}</span>
      </div>`;
    }
    const gen = getGeneral(seat.genId);
    const you = seat.index === currentRoom?.you?.seatIndex;
    const tags = [];
    tags.push(`<span class="seat-tag ${seat.kind === 'npc' ? 'ai' : 'human'}">${seat.kind === 'npc' ? t('online.seatNpc') : t('online.seatHuman')}</span>`);
    if (you) tags.push(`<span class="seat-tag you">${t('online.seatYou')}</span>`);
    if (seat.index === 0 || currentRoom?.hostId === firstPlayerOf(seat)) tags.push('');
    return `<div class="online-seat">
      ${generalPortrait(seat.genId)}
      <div class="online-gen-meta">
        <b>${esc(generalName(seat.genId))}${you ? ` · ${t('online.seatYou')}` : ''}</b>
        <p class="dim">${esc(gen?.bio || '')}</p>
        <div class="seat-tags">${tags.join('')}</div>
      </div>
      ${seat.kind === 'npc' && isHost ? `<button class="ghost seat-remove" data-remove-npc="${seat.index}" title="${t('online.removeNpc')}">×</button>` : ''}
    </div>`;
  }

  function firstPlayerOf(seat) {
    return seat.playerId || '';
  }

  function hostPanel(config) {
    const available = Object.keys(GENERALS)
      .filter(genId => !(currentRoom?.seats || []).some(seat => seat.kind !== 'open' && seat.genId === genId));
    return `
      <div class="online-host-panel">
        <div class="online-npc-row">
          <select id="onlineNpcPick" class="online-select">${available.map(genId => `<option value="${esc(genId)}">${esc(generalName(genId))}</option>`).join('')}</select>
          <button id="onlineAddNpc">${t('online.addNpc')}</button>
          <button id="onlineRandomNpc" class="ghost">${t('online.randomNpc')}</button>
        </div>
        <p class="online-config-line">${t('online.configLine', {
          seats: config.seats,
          stack: config.stack,
          sb: BLIND_PRESETS[config.blindsIdx]?.[0] ?? 10,
          bb: BLIND_PRESETS[config.blindsIdx]?.[1] ?? 20,
          escalate: config.escalate,
          turn: Math.round(config.turnMs / 1000),
        })}</p>
        <button id="onlineStart" class="online-start">${t('online.start')}</button>
      </div>`;
  }


  function show(notice = '') {
    root.classList.remove('hidden');
    if (view === 'room') renderRoom(notice);
    else renderHome(notice);
  }

  function hide() {
    root.classList.add('hidden');
  }

  function destroy() {
    offRoom();
    offError();
    offWelcome();
    root.innerHTML = '';
  }

  return { show, hide, destroy, get view() { return view; } };
}
