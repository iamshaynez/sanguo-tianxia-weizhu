// protocol.js —— 在线对局共享协议:常量、上限与消息校验。
// 客户端(esbuild 打包)与服务端(node 直跑 src)共用同一份,规则只此一处。

export const WS_PATH = '/ws';
export const PROTOCOL_VERSION = 1;

// ---- 房间 ----
export const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去易混淆字符
export const CODE_LEN = 6;
export const SEAT_MIN = 2;
export const SEAT_MAX = 6;
export const MAX_FRAME = 16384;          // 单帧上限,超出直接断开
export const MSG_RATE = { limit: 40, windowMs: 10_000 };

// ---- 牌桌参数(对齐野战练习场) ----
export const STACK_PRESETS = [600, 1000, 2000, 2800];
export const BLIND_PRESETS = [[10, 20], [15, 30], [20, 40]];
export const ESCALATE_PRESETS = [4, 6, 8];      // 每 N 手升盲
export const TURN_MS_PRESETS = [10_000, 20_000, 30_000, 45_000, 60_000];
export const TURN_MS_DEFAULT = 30_000;
export const TURN_MS_MIN = 4_000;               // 集成测试走协议直连可更短
export const TURN_MS_MAX = 90_000;

// ---- 节奏(服务端推进,客户端按版本号渲染) ----
export const DEAL_PAUSE = 900;                  // 发牌亮相
export const STREET_PAUSE = 750;                // 街与街之间收池
export const HAND_END_PAUSE = 2800;             // 结算展示
export const AI_THINK = [800, 1700];            // NPC 思考
export const OFFLINE_THINK = [900, 1600];       // 离席代打接管延迟
export const ACT_MIN_DELAY = 260;               // 广播落地的最小缓冲

// ---- 房间生命周期 ----
export const SNAPSHOT_DEBOUNCE = 150;
export const GC_SWEEP = 30_000;
export const IDLE_LOBBY_MS = 10 * 60_000;       // 大厅无人连接
export const IDLE_PLAY_MS = 45 * 60_000;        // 对局中全员离线
export const IDLE_END_MS = 10 * 60_000;         // 已收桌
export const PROCESSED_CAP = 400;               // 幂等指纹上限
export const LOG_TAIL = 30;                     // 视图携带的行动流水

export const ERR = {
  BAD_MESSAGE: 'BAD_MESSAGE',
  BAD_STATE: 'BAD_STATE',
  NOT_HOST: 'NOT_HOST',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  ALREADY_STARTED: 'ALREADY_STARTED',
  AUTH_FAILED: 'AUTH_FAILED',
  GEN_TAKEN: 'GEN_TAKEN',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  ILLEGAL_ACTION: 'ILLEGAL_ACTION',
  ACTION_CONFLICT: 'ACTION_CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  NEED_GENERAL: 'NEED_GENERAL',
};

// ---- 客户端 → 服务端 ----
export const CLIENT_KINDS = ['hello_create', 'hello_join', 'hello_resume', 'room_action', 'poker_action', 'verify_deck', 'ping'];
export const ROOM_ACTIONS = ['configure', 'add_npc', 'remove_npc', 'set_general', 'start_game', 'end_game', 'rematch', 'leave'];

// ---- 服务端 → 客户端 ----
export const SERVER_KINDS = ['welcome', 'room', 'deck', 'ack', 'error', 'pong'];

const isStr = (v, min = 1, max = 64) => typeof v === 'string' && v.length >= min && v.length <= max;
const isInt = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);

export function clampConfig(raw = {}) {
  const pick = (list, value, fallback) => (list.includes(value) ? value : fallback);
  const stack = pick(STACK_PRESETS, raw.stack, 1000);
  const blindsIdx = Math.max(0, Math.min(BLIND_PRESETS.length - 1, isInt(raw.blindsIdx, 0, BLIND_PRESETS.length - 1) ? raw.blindsIdx : 0));
  const escalate = pick(ESCALATE_PRESETS, raw.escalate, 6);
  const seats = Math.max(SEAT_MIN, Math.min(SEAT_MAX, isInt(raw.seats, SEAT_MIN, SEAT_MAX) ? raw.seats : 4));
  let turnMs = pick(TURN_MS_PRESETS, raw.turnMs, TURN_MS_DEFAULT);
  if (Number.isInteger(raw.turnMs)) turnMs = Math.max(TURN_MS_MIN, Math.min(TURN_MS_MAX, raw.turnMs));
  return { seats, stack, blindsIdx, escalate, turnMs };
}

// 逐条校验;合法返回 {ok:true, ...字段},非法返回 {ok:false, code}
export function validateClientMessage(msg) {
  if (!isObj(msg) || !isStr(msg.type) || !CLIENT_KINDS.includes(msg.type)) return { ok: false, code: ERR.BAD_MESSAGE };
  switch (msg.type) {
    case 'ping':
      return { ok: true, type: msg.type };
    case 'hello_create': {
      if (msg.genId != null && !isStr(msg.genId)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.config !== undefined && !isObj(msg.config)) return { ok: false, code: ERR.BAD_MESSAGE };
      return { ok: true, type: msg.type, genId: msg.genId ?? null, config: clampConfig(msg.config) };
    }
    case 'hello_join':
    case 'hello_resume': {
      if (!isStr(msg.code, CODE_LEN, CODE_LEN)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.type === 'hello_resume' && !isStr(msg.token, 16, 64)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.type === 'hello_join' && msg.genId != null && !isStr(msg.genId)) return { ok: false, code: ERR.BAD_MESSAGE };
      return { ok: true, type: msg.type, code: msg.code, genId: msg.genId ?? null, token: msg.token };
    }
    case 'room_action': {
      if (!isStr(msg.actionId, 6, 64)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (!ROOM_ACTIONS.includes(msg.kind)) return { ok: false, code: ERR.BAD_MESSAGE };
      const out = { ok: true, type: msg.type, actionId: msg.actionId, kind: msg.kind };
      if (msg.kind === 'configure') {
        if (!isObj(msg.config)) return { ok: false, code: ERR.BAD_MESSAGE };
        out.config = clampConfig(msg.config);
      }
      if (msg.kind === 'add_npc' && msg.genId !== undefined && !isStr(msg.genId)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.kind === 'add_npc') out.genId = msg.genId;   // 透传给房间
      if (msg.kind === 'remove_npc' && !isInt(msg.seat, 0, SEAT_MAX - 1)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.kind === 'remove_npc') out.seat = msg.seat;   // 只校验不透传曾让「请出」永远拿到 undefined 席位
      if (msg.kind === 'set_general' && !isStr(msg.genId)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.kind === 'set_general') out.genId = msg.genId;
      return out;
    }
    case 'poker_action': {
      if (!isStr(msg.actionId, 6, 64)) return { ok: false, code: ERR.BAD_MESSAGE };
      const kinds = ['fold', 'check', 'call', 'raise', 'allin'];
      if (!kinds.includes(msg.kind)) return { ok: false, code: ERR.BAD_MESSAGE };
      if (msg.kind === 'raise' && !isInt(msg.amount, 1, 1_000_000)) return { ok: false, code: ERR.BAD_MESSAGE };
      return { ok: true, type: msg.type, actionId: msg.actionId, kind: msg.kind, amount: msg.amount ?? 0 };
    }
    case 'verify_deck':
      return { ok: true, type: msg.type };
    default:
      return { ok: false, code: ERR.BAD_MESSAGE };
  }
}
