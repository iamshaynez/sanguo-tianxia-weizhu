// lobby.js —— 在线大厅:建房 / 凭码(或扫码)加入 / 续接上局;房内席位、点将、军师与开局。
// 点将后置:入席时不必先选武将,进房后在自己席位上点将(start 前每人必须选定)。
// 只在 #online 屏内活动,退出即回到目录;牌局由 board.js 接管,本模块不渲染牌桌。
import { GENERALS, getGeneral } from '../generals.js';
import { localizeGeneral } from '../i18n.js';
import { portraitImage } from '../portrait.js';
import { loadSession } from './net.js';
import { t } from '../i18n.js';
import { joinUrl, roomQrSvg } from './qr.js';
import {
  STACK_PRESETS, BLIND_PRESETS, ESCALATE_PRESETS, TURN_MS_PRESETS, SEAT_MIN, SEAT_MAX,
} from './protocol.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function generalName(genId) {
  return localizeGeneral(GENERALS[genId], genId)?.name || genId || '';
}

// 头像:直接输出 portrait.js 的完整 <img>(portraitImage 返回的是标签而非 URL!)
export function generalPortrait(genId, className = 'online-portrait') {
  const gen = getGeneral(genId);
  return portraitImage(gen?.skin || 'default', className);
}

// taken:已被别的席位占用的武将——自己的选将下拉不再列出,从源头减少「该武将已在席上」
function generalOptions(selected = '', taken = new Set()) {
  return Object.keys(GENERALS)
    .filter(genId => !taken.has(genId))
    .map(genId => `<option value="${esc(genId)}"${genId === selected ? ' selected' : ''}>${esc(generalName(genId))}</option>`)
    .join('');
}

export function createOnlineLobby(root, net, hooks = {}) {
  const { onEnterTable = () => {}, onExit = () => {} } = hooks;
  root.classList.add('online-root');
  let currentRoom = null;   // 最近一帧 room 视图
  let view = 'home';        // home | room
  let autoJoined = false;   // 扫码自动入局只做一次(见 renderHome)
  const offRoom = net.on('room', room => {
    currentRoom = room;     // 任何阶段先落最新视图,渲染与判断都以它为准
    if (room.phase === 'lobby') {
      view = 'room';
      renderRoom();
    } else {
      // 非大厅帧只会发给已入房的连接:无论界面此刻停在哪,都该进牌桌
      view = 'room';
      onEnterTable(room);   // 开局/终局交给牌桌模块
    }
  });
  const offError = net.on('error', msg => {
    // 带 actionId 的是某次具体操作的失败(选到被占武将、未选将等),该操作的 catch
    // 已就地提示——不得据此把人踢回主页(曾因此触发扫码自动重入的死循环)。
    if (msg.actionId) return;
    if (['ROOM_FULL', 'ROOM_NOT_FOUND', 'ALREADY_STARTED', 'GEN_TAKEN', 'AUTH_FAILED'].includes(msg.code)) {
      view = 'home';
      renderHome(translateErr(msg.code, msg.message));
    }
  });
  const offWelcome = net.on('welcome', msg => {
    if (msg.seatIndex >= 0) onJoinRoom();
  });

  function onJoinRoom() {
    view = 'room';
    renderRoom();             // 先铺底,room 帧到达后重绘
  }

  function translateErr(code, fallback) {
    const key = {
      OFFLINE: 'offline', TIMEOUT: 'offline', ROOM_FULL: 'full', ROOM_NOT_FOUND: 'notFound',
      ALREADY_STARTED: 'started', GEN_TAKEN: 'genTaken', AUTH_FAILED: 'resume', NO_SESSION: 'resume',
      NEED_GENERAL: 'needGeneral', BAD_CODE: 'code',
    }[code];
    return key ? t(`online.err.${key}`) : (fallback || t('online.err.generic'));
  }

  // ---------- 主页(点将后置:建房/入局都不需要先选武将) ----------
  function renderHome(notice = '') {
    const params = new URLSearchParams(location.search);
    const inviteCode = (params.get('room') || '').toUpperCase();
    root.innerHTML = `
      <div class="online-home">
        <p class="online-kicker">${t('online.kicker')}</p>
        <h2 class="online-title">${t('online.title')}</h2>
        <p class="online-lead">${t('online.lead')}</p>
        ${notice ? `<p class="online-notice">${esc(notice)}</p>` : ''}
        <div class="online-home-actions">
          <label class="online-seats-pick">${t('online.seatsLabel')}
            <select id="onlineSeats" class="online-select">
              ${Array.from({ length: SEAT_MAX - SEAT_MIN + 1 }, (_, i) => {
                const n = SEAT_MIN + i;
                return `<option value="${n}"${n === 4 ? ' selected' : ''}>${t('online.seatsN', { n })}</option>`;
              }).join('')}
            </select>
          </label>
          <button id="onlineCreate">${t('online.create')}</button>
          <div class="online-join">
            <input id="onlineCode" class="online-code-input" maxlength="6" placeholder="${t('online.codePh')}" autocomplete="off" autocapitalize="characters" value="${esc(inviteCode)}">
            <button id="onlineJoin" class="${inviteCode ? '' : 'ghost'}">${t('online.join')}</button>
          </div>
          <button id="onlineResume" class="ghost${loadSession() ? '' : ' hidden'}">${t('online.resume')}</button>
          <button id="onlineLeaveHome" class="ghost">${t('online.back')}</button>
        </div>
        <p class="online-hint">${t('online.hint')}</p>
      </div>`;
    const lockButtons = disabled => {
      for (const button of root.querySelectorAll('button')) button.disabled = disabled;
    };
    const doJoin = async () => {
      const codeValue = root.querySelector('#onlineCode').value.trim().toUpperCase();
      if (codeValue.length !== 6) { renderHome(t('online.err.code')); return; }
      lockButtons(true);
      try {
        await net.helloJoin(codeValue);
      } catch (error) {
        lockButtons(false);
        renderHome(translateErr(error.code, error.message));
      }
    };
    root.querySelector('#onlineCreate').addEventListener('click', async () => {
      lockButtons(true);
      try {
        await net.helloCreate(null, readConfig());   // 点将进房后进行
      } catch (error) {
        lockButtons(false);
        renderHome(translateErr(error.code, error.message));
      }
    });
    root.querySelector('#onlineJoin').addEventListener('click', doJoin);
    root.querySelector('#onlineCode').addEventListener('keydown', event => {
      if (event.key === 'Enter') doJoin();
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
    root.querySelector('#onlineLeaveHome').addEventListener('click', onExit);
    // 扫码入局:带 ?room=CODE 打开即自动加入(入局意图明确),失败回落表单提示。
    // 只触发一次:renderHome 会被重绘反复调用,若每次都重发入局,连接已绑定房间时
    // 服务端必拒,报错→重绘→再入局→再报错,按钮被轮流锁死(「进不去也回不去」)。
    // 本机已有同一房间的会话时走续接(保留席位身份),不重复入局。
    if (inviteCode && !autoJoined && currentRoom?.code !== inviteCode && loadSession()?.code !== inviteCode) {
      autoJoined = true;
      doJoin();
    }
  }

  function readConfig() {
    // 席位数来自主页选择器(2-6,默认 4);其余对局参数仍用预设,后续可扩成表单
    const seats = parseInt(root.querySelector('#onlineSeats')?.value, 10) || 4;
    return {
      seats: Math.max(SEAT_MIN, Math.min(SEAT_MAX, seats)),
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
    const unselected = room.seats.filter(seat => seat.kind === 'human' && !seat.genId);
    const canStart = room.seats.filter(seat => seat.kind !== 'open').length >= 2 && !unselected.length;
    root.innerHTML = `
      <div class="online-room">
        <div class="online-room-head">
          <p class="online-kicker">${t('online.roomKicker')}</p>
          <div class="online-code-line"><span class="online-code">${esc(room.code)}</span>
            <button id="onlineCopy" class="ghost">${t('online.copy')}</button></div>
        </div>
        <div class="online-qr-row">
          <div class="online-qr" id="onlineQr" role="img" aria-label="${t('online.qrHint')}">${roomQrSvg(joinUrl(room.code))}</div>
          <div class="online-qr-meta">
            <p class="online-room-note">${t('online.roomNote')}</p>
            <p class="online-qr-hint">${t('online.qrHint')}</p>
          </div>
        </div>
        ${notice ? `<p class="online-notice">${esc(notice)}</p>` : ''}
        <div class="online-seats">${room.seats.map(seat => seatCard(room, seat, isHost)).join('')}</div>
        ${isHost ? hostPanel(room, canStart, unselected) : `<p class="online-waiting">${t('online.waitingHost')}</p>`}
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
      net.roomAction('leave').catch(() => {});   // 断线/未入房时离席失败无妨,本地照样退场
      net.forget();
      view = 'home';
      onExit();
    });
    const npcPick = root.querySelector('#onlineNpcPick');
    root.querySelector('#onlineAddNpc')?.addEventListener('click', async () => {
      net.roomAction('add_npc', { genId: npcPick.value || undefined })
        .catch(error => renderRoom(translateErr(error.code, error.message)));
    });
    root.querySelector('#onlineRandomNpc')?.addEventListener('click', () => {
      net.roomAction('add_npc').catch(error => renderRoom(translateErr(error.code, error.message)));
    });
    root.querySelector('#onlineStart')?.addEventListener('click', () => {
      if (!canStart) { renderRoom(unselected.length ? t('online.err.needGeneral') : t('online.err.needTwo')); return; }
      net.roomAction('start_game').catch(error => renderRoom(translateErr(error.code, error.message)));
    });
    for (const button of root.querySelectorAll('[data-remove-npc]')) {
      button.addEventListener('click', () => {
        net.roomAction('remove_npc', { seat: Number(button.dataset.removeNpc) }).catch(() => {});
      });
    }
    // 席位点将:自己席位 select 变更/随机按钮
    for (const select of root.querySelectorAll('[data-pick-general]')) {
      select.addEventListener('change', () => {
        if (!select.value) return;            // 原生选框被重绘打断时可能回落到占位项
        net.roomAction('set_general', { genId: select.value })
          .catch(error => renderRoom(translateErr(error.code, error.message)));
      });
    }
    for (const button of root.querySelectorAll('[data-random-general]')) {
      button.addEventListener('click', () => {
        const available = Object.keys(GENERALS)
          .filter(genId => !(currentRoom?.seats || []).some(seat => seat.kind !== 'open' && seat.genId === genId));
        const pick = available[Math.floor(Math.random() * available.length)];
        if (pick) net.roomAction('set_general', { genId: pick }).catch(() => {});
      });
    }
  }

  function seatCard(room, seat, isHost) {
    const you = seat.index === room.you?.seatIndex;
    if (seat.kind === 'open') {
      return `<div class="online-seat open">
        <span class="seat-tag">${t('online.seatOpen')}</span>
        <span class="seat-sub">${t('online.seatOpenSub')}</span>
      </div>`;
    }
    const tags = [];
    tags.push(`<span class="seat-tag ${seat.kind === 'npc' ? 'ai' : 'human'}">${seat.kind === 'npc' ? t('online.seatNpc') : t('online.seatHuman')}</span>`);
    if (you) tags.push(`<span class="seat-tag you">${t('online.seatYou')}</span>`);
    if (room.hostId && seat.playerId === room.hostId) tags.push(`<span class="seat-tag host">${t('online.seatHost')}</span>`);
    const picked = !!seat.genId;
    const takenByOthers = new Set(room.seats.filter(other => other.kind !== 'open' && other.index !== seat.index).map(other => other.genId));
    const picker = you && seat.kind === 'human' && !picked
      ? `<div class="online-pick-row">
           <select class="online-select" data-pick-general>
             <option value="" selected disabled>${t('online.pickGeneral')}</option>
             ${generalOptions('', takenByOthers)}
           </select>
           <button class="ghost" data-random-general>${t('online.random')}</button>
         </div>`
      : '';
    return `<div class="online-seat${picked ? '' : ' unpicked'}">
      ${generalPortrait(seat.genId)}
      <div class="online-gen-meta">
        <b>${picked ? esc(generalName(seat.genId)) : t('online.noGeneral')}${you ? ` · ${t('online.seatYou')}` : ''}</b>
        ${picked ? `<p class="dim">${esc(getGeneral(seat.genId)?.bio || '')}</p>` : `<p class="dim">${t('online.noGeneralSub')}</p>`}
        <div class="seat-tags">${tags.join('')}</div>
        ${picker}
      </div>
      ${seat.kind === 'npc' && isHost ? `<button class="ghost seat-remove" data-remove-npc="${seat.index}" title="${t('online.removeNpc')}">×</button>` : ''}
    </div>`;
  }

  function hostPanel(room, canStart, unselected) {
    const available = Object.keys(GENERALS)
      .filter(genId => !(room.seats || []).some(seat => seat.kind !== 'open' && seat.genId === genId));
    const config = room.config;
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
        <button id="onlineStart" class="online-start"${canStart ? '' : ' disabled'}>${t('online.start')}</button>
        ${unselected.length ? `<p class="online-start-hint">${t('online.err.needGeneral')}</p>` : ''}
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

  // 弃局退场后重置视图:否则下次 show() 沿用 'room' 渲染幽灵房间,
  // 玩家退出重进会以为「已经在游戏里」。
  function reset() {
    view = 'home';
    currentRoom = null;
    autoJoined = false;      // 再次进入网战(仍带 ?room=)时重新按扫码意图自动入局
  }
  return { show, hide, destroy, reset, get view() { return view; } };
}
