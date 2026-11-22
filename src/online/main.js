// online/main.js —— 在线对局模块入口:目录入口按钮、屏幕路由(大厅/牌桌)、终局战绩入档。
// 单人模式零依赖:不点入口就完全不碰网络;离线打开时入口仍在,连接失败只在大厅里提示。
import { createOnlineNet, loadSession, clearSession } from './net.js';
import { createOnlineLobby } from './lobby.js';
import { createOnlineBoard } from './board.js';
import { t, onLocaleChange } from '../i18n.js';

export function initOnline({ P, show, save }) {
  const root = document.getElementById('online');
  if (!root) return;
  const net = createOnlineNet();
  let statsBaseline = 0;          // 入局时的 hands 基线,结算时算增量
  let endedCounted = false;

  const lobby = createOnlineLobby(root.querySelector('#onlineLobby'), net, {
    onEnterTable() {
      lobby.hide();
      board.show();
    },
    onExit() {
      teardown();
    },
  });

  const board = createOnlineBoard(root.querySelector('#onlineBoard'), net, {
    onLeave() {
      teardown();
    },
  });

  function teardown() {
    net.forget();
    board.hide();
    lobby.hide();
    root.classList.add('hidden');
    endedCounted = false;
    show('scroll');
  }

  // 屏幕路由:phase 驱动大厅 ↔ 牌桌
  net.on('room', room => {
    if (root.classList.contains('hidden')) return;
    if (room.phase === 'lobby') {
      board.hide();
      lobby.show();
    } else {
      if (room.phase !== 'ended') statsBaseline = Math.min(statsBaseline || room.stats.hands, room.stats.hands);
      lobby.hide();
      board.show();
    }
    if (room.phase === 'ended' && !endedCounted) {
      endedCounted = true;
      recordOnlineStats(room);
    }
    if (room.phase === 'playing' && room.stats.hands === 1) {
      statsBaseline = 0;          // 新开一手局重置基线
      endedCounted = false;
    }
  });

  net.on('error', msg => {
    if (root.classList.contains('hidden')) return;
    if (msg.code === 'ROOM_NOT_FOUND' || msg.code === 'AUTH_FAILED') {
      board.hide();
      lobby.show(t('online.err.roomGone'));
    }
  });

  function recordOnlineStats(room) {
    P.online = P.online || { tables: 0, wins: 0, hands: 0, bestStack: 0 };
    P.online.tables += 1;
    P.online.hands += Math.max(0, (room.stats.hands || 0) - statsBaseline);
    const you = room.you?.seatIndex;
    const rank = (room.standings || []).findIndex(row => row.index === you);
    if (rank === 0) P.online.wins += 1;
    const myStack = (room.standings || []).find(row => row.index === you)?.stack || 0;
    P.online.bestStack = Math.max(P.online.bestStack || 0, myStack);
    save?.();
  }

  function enterOnline() {
    show('online');
    net.connect();
    const session = loadSession();
    if (session) {
      lobby.show();
      net.helloResume().catch(() => { clearSession(); lobby.show(); });
    } else {
      lobby.show();
    }
  }

  // 连接徽章:全站唯一所有者,任何子视图不再各自为政
  const connBadge = root.querySelector('#onlineConn');
  const paintConn = state => {
    connBadge.dataset.state = state;
    connBadge.querySelector('.conn-text').textContent =
      state === 'on' ? t('online.conn.on') : state === 'off' ? t('online.conn.reconnect') : t('online.conn.connecting');
  };
  paintConn(net.connected ? 'on' : 'connecting');
  net.on('open', () => paintConn('on'));
  net.on('disconnected', () => paintConn('off'));
  net.on('reconnecting', () => paintConn('off'));

  document.getElementById('onlineBtn')?.addEventListener('click', enterOnline);
  window.__onlineDebug = { net, lobby, board };   // 仅供 e2e/diag
  root.querySelector('#onlineLeave').addEventListener('click', () => {
    if (net.code) net.abandon();
    teardown();
  });
  root.querySelector('#onRematch')?.addEventListener('click', () => {
    net.roomAction('rematch').catch(() => {});
  });
  root.querySelector('#onlineLeave2')?.addEventListener('click', teardown);

  onLocaleChange(() => {
    if (root.classList.contains('hidden')) return;
    // 重绘当前前台文案(牌桌文案随下一帧 room 亦会刷新)
    if (!root.querySelector('#onlineBoard').classList.contains('hidden')) board.banner(t('online.langChanged'));
    else lobby.show();
  });
}
