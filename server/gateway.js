// gateway.js —— WebSocket 网关:鉴权会话、消息路由、限流、心跳与广播。
// 消息一律 JSON;超帧、超速、越权一律断开或回 error,绝不静默吞掉。
import { WebSocketServer } from 'ws';
import {
  WS_PATH, MAX_FRAME, MSG_RATE, PROTOCOL_VERSION, CODE_LEN, SEAT_MAX, ERR,
  validateClientMessage,
} from '../src/online/protocol.js';
import { newToken, hashToken, tokenMatch } from './rooms.js';

function originAllowed(req, extra = []) {
  const origin = req.headers.origin;
  if (!origin) return true;                    // 非浏览器客户端
  try {
    const url = new URL(origin);
    const host = req.headers.host || '';
    if (url.host === host) return true;
    if (['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname)) return true;
    return extra.includes(origin);
  } catch { return false; }
}

class RateBucket {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.stamps = [];
  }

  allow(nowMs = Date.now()) {
    this.stamps = this.stamps.filter(stamp => nowMs - stamp < this.windowMs);
    if (this.stamps.length >= this.limit) return false;
    this.stamps.push(nowMs);
    return true;
  }
}

export function attachGateway(httpServer, store, { allowedOrigins = [], logger = console } = {}) {
  const wss = new WebSocketServer({ server: httpServer, path: WS_PATH, maxPayload: MAX_FRAME });
  const conns = new Set();

  function send(conn, payload) {
    if (conn.ws.readyState !== conn.ws.OPEN) return;
    try { conn.ws.send(JSON.stringify(payload)); } catch { /* 发送竞态,断线由 close 统一处理 */ }
  }

  function broadcast(room) {
    for (const conn of conns) {
      if (conn.room !== room || !conn.playerId) continue;
      send(conn, { type: 'room', room: room.viewFor(conn.playerId) });
      if (process.env.BROADCAST_LOG) console.log('[broadcast]', room.code, 'v' + room.version);
    }
  }

  function welcome(conn, room, player, token) {
    conn.room = room;
    conn.playerId = player.id;
    // welcome 先行,attach 的首帧广播随后到达(客户端按 welcome 建立 session)
    send(conn, {
      type: 'welcome',
      proto: PROTOCOL_VERSION,
      playerId: player.id,
      token,
      code: room.code,
      seatIndex: player.seatIndex,
    });
    room.attach(player.id, conn);
  }

  function fail(conn, code, message, actionId = null) {
    send(conn, { type: 'error', code, message, actionId });
  }

  function detach(conn) {
    conns.delete(conn);
    if (conn.room && conn.playerId) {
      conn.room.detach(conn.playerId, conn);
      conn.room = null;
      conn.playerId = null;
    }
  }

  function route(conn, msg) {
    const room = conn.room;
    switch (msg.type) {
      case 'ping':
        send(conn, { type: 'pong', now: Date.now() });
        return;
      case 'hello_create': {
        if (room) { fail(conn, ERR.BAD_STATE, '已在一局之中'); return; }
        const player = { id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}` };
        const token = newToken();
        const tokenHash = hashToken(token);
        const created = store.createRoom({ hostId: player.id, config: msg.config });
        created.addPlayer({ genId: msg.genId, tokenHash });
        created.bindPlayer(player.id, { genId: msg.genId, tokenHash }, 0);
        player.seatIndex = 0;
        welcome(conn, created, player, token);
        return;
      }
      case 'hello_join': {
        if (room) { fail(conn, ERR.BAD_STATE, '已在一局之中'); return; }
        const target = store.get(msg.code);
        if (!target) { fail(conn, ERR.ROOM_NOT_FOUND, '房间不存在或已解散'); return; }
        if (target.phase !== 'lobby') { fail(conn, ERR.ALREADY_STARTED, '牌局已开始,请等待下一局'); return; }
        if (target.occupiedCount() >= target.config.seats) { fail(conn, ERR.ROOM_FULL, '席位已满'); return; }
        if (msg.genId && target.genTaken(msg.genId)) { fail(conn, ERR.GEN_TAKEN, '该武将已在席上,请另择一人'); return; }
        const token = newToken();
        const tokenHash = hashToken(token);
        const seatInfo = target.addPlayer({ genId: msg.genId, tokenHash });
        if (seatInfo.error) { fail(conn, seatInfo.error, '无法入席'); return; }
        const player = { id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`, seatIndex: seatInfo.index };
        target.bindPlayer(player.id, { genId: msg.genId, tokenHash }, seatInfo.index);
        welcome(conn, target, player, token);
        return;
      }
      case 'hello_resume': {
        if (room) { fail(conn, ERR.BAD_STATE, '已在一局之中'); return; }
        const target = store.get(msg.code);
        if (!target) { fail(conn, ERR.ROOM_NOT_FOUND, '房间不存在或已解散'); return; }
        let player = null;
        for (const candidate of target.players.values()) {
          if (candidate.tokenHash && tokenMatch(hashToken(msg.token), candidate.tokenHash)) { player = candidate; break; }
        }
        if (!player) { fail(conn, ERR.AUTH_FAILED, '凭据不符,无法续接'); return; }
        welcome(conn, target, player, msg.token);
        return;
      }
      case 'room_action': {
        if (!room || !conn.playerId) { fail(conn, ERR.BAD_STATE, '尚未入房', msg.actionId); return; }
        const result = room.roomAction(conn.playerId, msg);
        if (result.error) { fail(conn, result.error, result.detail || '房间操作未执行', msg.actionId); return; }
        send(conn, { type: 'ack', actionId: msg.actionId });
        return;
      }
      case 'poker_action': {
        if (!room || !conn.playerId) { fail(conn, ERR.BAD_STATE, '尚未入房', msg.actionId); return; }
        const result = room.act(conn.playerId, msg);
        if (result.error) { fail(conn, result.error, result.detail || '此步不可行', msg.actionId); return; }
        send(conn, { type: 'ack', actionId: msg.actionId });
        return;
      }
      case 'verify_deck': {
        if (!room) { fail(conn, ERR.BAD_STATE, '尚未入房'); return; }
        const deck = room.verifyDeck();
        if (deck.error) { fail(conn, deck.error, deck.detail || '暂无牌序可验'); return; }
        send(conn, { type: 'deck', handNum: deck.handNum, seed: deck.seed, deck: deck.deck });
        return;
      }
      default:
        fail(conn, ERR.BAD_MESSAGE, '未知消息');
    }
  }

  wss.on('connection', (ws, req) => {
    if (!originAllowed(req, allowedOrigins)) {
      ws.close(1008, 'origin denied');
      return;
    }
    const conn = { ws, room: null, playerId: null, budget: new RateBucket(MSG_RATE.limit, MSG_RATE.windowMs), alive: true };
    conns.add(conn);
    ws.on('pong', () => { conn.alive = true; });
    ws.on('message', data => {
      conn.alive = true;
      if (!conn.budget.allow()) {
        fail(conn, ERR.RATE_LIMITED, '消息过于频繁');
        return;
      }
      let msg;
      try { msg = JSON.parse(data.toString('utf8')); } catch { fail(conn, ERR.BAD_MESSAGE, '帧不是合法 JSON'); return; }
      const verdict = validateClientMessage(msg);
      if (!verdict.ok) { fail(conn, verdict.code || ERR.BAD_MESSAGE, '消息未通过校验'); return; }
      try { route(conn, verdict); } catch (error) {
        logger.error('消息处理异常:', error);
        fail(conn, ERR.BAD_STATE, '服务器处理异常');
      }
    });
    ws.on('close', () => detach(conn));
    ws.on('error', () => { try { ws.terminate(); } catch { /* 已断 */ } });
  });

  // 心跳:30s 协议级 ping;两个周期无响应则视为假在线,终止连接
  const heartbeat = setInterval(() => {
    for (const conn of conns) {
      if (!conn.alive) { try { conn.ws.terminate(); } catch { /* 已断 */ } continue; }
      conn.alive = false;
      try { conn.ws.ping(); } catch { /* 已断 */ }
    }
  }, 30_000);
  heartbeat.unref?.();

  return {
    broadcast,
    conns,
    close: () => new Promise(resolve => {
      clearInterval(heartbeat);
      for (const conn of conns) { try { conn.ws.close(1001, 'server closing'); } catch { /* 已断 */ } }
      wss.close(() => resolve());
    }),
  };
}
