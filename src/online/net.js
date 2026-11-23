// net.js —— 在线对局连接层:WebSocket 会话、断线重连退避、version 防回退、actionId 幂等。
// 服务端消息只信欢迎帧之后的 room 版本号;本地会话存 localStorage,刷新页面可续接原席位。
const SESSION_KEY = 'sanguo_online_session';
const BACKOFF_BASE = 500;
const BACKOFF_CAP = 6000;

const url = () => `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;
    return session && session.code && session.token && session.playerId ? session : null;
  } catch { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* 隐私模式 */ }
}

export function createOnlineNet() {
  const listeners = new Map();          // type -> Set<fn>
  let ws = null;
  let intentional = false;
  let attempts = 0;
  let reconnectTimer = null;
  let version = -1;                     // 已应用的最高 room 版本
  let code = null;
  let playerId = null;
  let token = null;
  let sessionActive = false;            // 已进入某房间(resume/create/join 之后)
  const pending = new Map();            // actionId -> { resolve, reject, timer }
  let nowOffset = 0;                    // 服务器时钟 - 本地时钟

  window.__lastNetErr = null;   // 诊断窗:最近一帧 error(e2e/diag)
  const emit = (type, payload) => {
    for (const fn of listeners.get(type) || []) {
      try { fn(payload); } catch (error) { console.error('online listener', error); }
    }
  };
  const on = (type, fn) => {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(fn);
    return () => listeners.get(type)?.delete(fn);
  };

  const saveSession = () => {
    if (!code || !token) return;
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ code, playerId, token, savedAt: Date.now() })); } catch { /* 隐私模式 */ }
  };

  function rawSend(payload) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(payload));
    return true;
  }

  // 续接单飞:handshake 的自动续接(为断线重连设计)与显式 helloResume 共用同一次
  // 发送。此前两条 hello_resume 并发,服务端把第二条判为「已在一局之中」(BAD_STATE)
  // 拒绝,显式续接 promise 被误杀 → clearSession 后 socket 仍绑在旧房间,后续
  // 建房/加入全被「已在一局之中」挡死——手机侧滑退出(不走回目录)再重进必现。
  let resumeFlight = null;
  function sendResume() {
    const session = loadSession();
    if (!session?.code || !session?.token) {
      return Promise.reject(Object.assign(new Error('本机没有可续接的牌局'), { code: 'NO_SESSION' }));
    }
    if (!resumeFlight) {
      code = session.code;
      token = session.token;
      // 落定即清空:失败(如重连未及时建立导致 OFFLINE)后,下一次连接打开还要能重新续接
      resumeFlight = helloRequest({ type: 'hello_resume', code: session.code, token: session.token })
        .finally(() => { resumeFlight = null; });
      resumeFlight.catch(() => {}); // 调用方各自感知;后台自动续接无调用方,防未处理拒绝
    }
    return resumeFlight;
  }

  function handshake() {
    if (sessionActive) return;                    // 本连接已续接过
    sendResume().catch(() => {});                 // 失败留在当前界面,由用户操作兜底
  }

  function handleMessage(data) {
    let msg;
    try { msg = JSON.parse(data.toString()); } catch { return; }
    if (msg.now) nowOffset = msg.now - Date.now();
    switch (msg.type) {
      case 'welcome': {
        code = msg.code;
        playerId = msg.playerId;
        token = msg.token;
        sessionActive = true;
        attempts = 0;
        version = -1;
        saveSession();
        const helloWaiter = pending.get('__hello__');
        if (helloWaiter) { clearTimeout(helloWaiter.timer); pending.delete('__hello__'); helloWaiter.resolve(msg); }
        emit('welcome', msg);
        break;
      }
      case 'room': {
        if (sessionActive && msg.room.v <= version) return;   // 过期/重复帧丢弃
        version = msg.room.v;
        emit('room', msg.room);
        break;
      }
      case 'ack': {
        const waiter = pending.get(msg.actionId);
        if (waiter) { clearTimeout(waiter.timer); pending.delete(msg.actionId); waiter.resolve(); }
        break;
      }
      case 'deck':
        emit('deck', msg);
        break;
      case 'error': {
        if (typeof window !== 'undefined') window.__lastNetErr = { code: msg.code, message: msg.message };
        const waiter = msg.actionId ? pending.get(msg.actionId) : null;
        if (waiter) { clearTimeout(waiter.timer); pending.delete(msg.actionId); waiter.reject(Object.assign(new Error(msg.message || msg.code), { code: msg.code })); }
        else if (msg.code === 'AUTH_FAILED' || msg.code === 'ROOM_NOT_FOUND') {
          clearSession();
          sessionActive = false;
        }
        if (msg.code && ['AUTH_FAILED', 'ROOM_NOT_FOUND', 'ROOM_FULL', 'ALREADY_STARTED', 'GEN_TAKEN', 'BAD_STATE', 'OFFLINE'].includes(msg.code)) {
          const helloWaiter = pending.get('__hello__');
          if (helloWaiter) { clearTimeout(helloWaiter.timer); pending.delete('__hello__'); helloWaiter.reject(Object.assign(new Error(msg.message || msg.code), { code: msg.code })); }
        }
        emit('error', msg);
        break;
      }
      case 'pong':
        nowOffset = msg.now - Date.now();
        break;
      default:
        break;
    }
  }

  function scheduleReconnect() {
    if (intentional || reconnectTimer) return;
    const delay = Math.min(BACKOFF_CAP, BACKOFF_BASE * 2 ** attempts) + Math.random() * 200;
    attempts++;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
    emit('reconnecting', { delay, attempt: attempts });
  }

  function connect() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
    intentional = false;                          // 显式 connect 即「要联网」:上次退出留下的标记不沿用到这一次
    resumeFlight = null;                          // 新连接:续接可重新单飞一次
    let socket;
    try { socket = ws = new WebSocket(url()); } catch { scheduleReconnect(); return; }
    // 只认「当前连接」的事件:被 forget/close 替换掉的旧连接,其迟到的 close 不得
    // 误把新连接置空或触发多余的重连。
    const stale = () => socket !== ws;
    socket.onopen = () => { if (stale()) return; handshake(); emit('open'); };
    socket.onmessage = event => { if (!stale()) handleMessage(event.data); };
    socket.onclose = () => {
      if (stale()) return;
      ws = null;
      sessionActive = false;                      // 连接已断:重连后由 handshake 重新续接归席
      emit('disconnected');
      scheduleReconnect();
    };
    socket.onerror = () => { try { socket.close(); } catch { /* 已断 */ } };
  }

  const action = (type, fields = {}) => new Promise((resolve, reject) => {
    const actionId = `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const timer = setTimeout(() => {
      pending.delete(actionId);
      reject(Object.assign(new Error('指令超时,请检查网络'), { code: 'TIMEOUT' }));
    }, 8000);
    pending.set(actionId, { resolve, reject, timer });
    if (!rawSend({ type, actionId, ...fields })) {
      clearTimeout(timer);
      pending.delete(actionId);
      reject(Object.assign(new Error('尚未连接到战场服务器'), { code: 'OFFLINE' }));
    }
  });

  function helloRequest(payload) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearInterval(kicker);
        pending.delete('__hello__');
        reject(Object.assign(new Error('服务器没有应答,请稍后再试'), { code: 'TIMEOUT' }));
      }, 10_000);
      pending.set('__hello__', { resolve, reject, timer });
      // WS 可能还在握手:小步重发直到发出(真正的拒绝由服务端 error 帧回)
      let tries = 0;
      const kicker = setInterval(() => {
        if (rawSend(payload) || ++tries >= 40) clearInterval(kicker);
        if (tries >= 40 && pending.get('__hello__')) {
          clearInterval(kicker);
          clearTimeout(timer);
          pending.delete('__hello__');
          reject(Object.assign(new Error('尚未连接到战场服务器'), { code: 'OFFLINE' }));
        }
      }, 120);
    });
  }

  return {
    on,
    connect,
    close() {
      intentional = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
      try { ws?.close(); } catch { /* 已断 */ }
      ws = null;
    },
    get connected() { return !!ws && ws.readyState === WebSocket.OPEN; },
    get code() { return code; },
    get playerId() { return playerId; },
    now: () => Date.now() + nowOffset,
    forget() {
      clearSession();
      sessionActive = false;
      resumeFlight = null;
      code = null;
      token = null;
      playerId = null;
      intentional = true;
      const socket = ws;
      ws = null;                                  // 立即断引用:旧连接的迟到 close 会被 connect 里的身份判断忽略
      try { socket?.close(); } catch { /* 已断 */ }
    },
    // hello 类指令的应答是 welcome/error 而非 ack,单独走 __hello__ 通道
    helloCreate(genId, config) {
      return helloRequest({ type: 'hello_create', genId, config });
    },
    helloJoin(roomCode, genId) {
      sessionActive = false;               // 旧会话让位:加入成功后由 welcome 覆盖
      return helloRequest({ type: 'hello_join', code: String(roomCode || '').toUpperCase(), genId });
    },
    helloResume() {
      return sendResume();
    },
    roomAction(kind, fields = {}) {
      return action('room_action', { kind, ...fields });
    },
    pokerAction(kind, amount = 0) {
      return action('poker_action', { kind, amount });
    },
    verifyDeck() {
      return action('verify_deck');
    },
    ping() {
      rawSend({ type: 'ping' });
    },
    abandon() {
      if (!code) return;                          // 以「是否知道自己在哪个房间」为准:断线重连期间同样要能离席
      sessionActive = false;
      rawSend({ type: 'room_action', actionId: `lv${Date.now().toString(36)}`, kind: 'leave' });
    },
  };
}
