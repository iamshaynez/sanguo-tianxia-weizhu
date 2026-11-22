// game.js —— 在线房间:权威状态机。规则引擎复用 src/table.js(与单人模式同一份代码),
// NPC 与离席代打复用 src/poker.js 的 aiDecide;发牌走种子洗牌,可验牌。
// 本文件不含任何网络代码:状态推进靠内部定时器,广播与持久化由 store 注入(touch)。
import * as T from '../src/table.js';
import * as PK from '../src/poker.js';
import { makePersona } from '../src/persona.js';
import { GENERAL_TRAITS, TRAIT_FALLBACK } from '../src/online/general-traits.js';
import {
  CODE_CHARS, CODE_LEN, SEAT_MAX,
  BLIND_PRESETS, PROCESSED_CAP, LOG_TAIL,
  DEAL_PAUSE, STREET_PAUSE, HAND_END_PAUSE,
  AI_THINK, OFFLINE_THINK, ACT_MIN_DELAY,
} from '../src/online/protocol.js';

const now = () => Date.now();
const rand = (arr, rng = Math.random) => arr[0] + Math.floor(rng() * (arr[1] - arr[0] + 1));
const round5 = v => Math.round(v / 5) * 5;

export function makeRoomCode(rng = Math.random) {
  let code = '';
  for (let i = 0; i < CODE_LEN; i++) code += CODE_CHARS[Math.floor(rng() * CODE_CHARS.length)];
  return code;
}

export function makeSeed(rng = Math.random) {
  let s = '';
  for (let i = 0; i < 6; i++) s += Math.floor(rng() * 16).toString(16).toUpperCase();
  return s;
}

export function traitsOfGen(genId) {
  const entry = GENERAL_TRAITS[genId];
  return entry ? entry.traits : { ...TRAIT_FALLBACK };
}

export class Room {
  constructor({ code, hostId, hostGenId, config, touch, rng = Math.random, pacing = {} }) {
    this.code = code;
    this.hostId = hostId;
    this.touch = touch;                     // (room) => 广播 + 快照,由 store 注入
    this.rng = rng;
    this.pacing = {
      deal: pacing.deal ?? DEAL_PAUSE,
      street: pacing.street ?? STREET_PAUSE,
      handEnd: pacing.handEnd ?? HAND_END_PAUSE,
      ai: pacing.ai ?? AI_THINK,
      offline: pacing.offline ?? OFFLINE_THINK,
      actMin: pacing.actMin ?? ACT_MIN_DELAY,
    };
    this.config = { ...config };
    this.players = new Map();               // playerId -> {id, genId, tokenHash, seatIndex, conns:Set}
    this.version = 0;
    this.phase = 'lobby';                   // lobby | playing | ended
    this.seed = makeSeed(rng);
    this.handNum = 0;
    this.button = 0;
    this.seats = Array.from({ length: config.seats }, (_, i) => this.blankSeat(i));
    this.H = null;
    this.board = [];
    this.deck = [];
    this.deckPtr = 0;
    this.lastHand = null;                   // 结算展示期数据(亮牌/分池/牌堆)
    this.street = -1;
    this.deadlineAt = 0;
    this.log = [];
    this.processed = new Map();             // "playerId:actionId" -> 指纹
    this.stats = { hands: 0, created: now() };
    this.lastActivity = now();
    this.timers = new Set();
    this.blindLevel = 0;
  }

  // ---------- 席位与玩家 ----------
  bump(room) {
    this.version += 1;          // 版本号必须递增:客户端以 v 单调性丢弃过期/重复帧
    this.touch(room);
  }

  blankSeat(index) {
    return {
      index, id: `s${index}`, kind: 'open', playerId: null, genId: null, name: '',
      stack: 0, hole: [], folded: false, bet: 0, committed: 0, handStartStack: 0,
      eliminated: false, online: false, slowplayed: false, bluffLine: false,
      read: PK.createRead(), persona: null,
    };
  }

  seatOf(playerId) {
    const player = this.players.get(playerId);
    return player && player.seatIndex >= 0 ? this.seats[player.seatIndex] : null;
  }

  genTaken(genId) {
    return this.seats.some(seat => seat.kind !== 'open' && seat.genId === genId);
  }

  occupiedCount() {
    return this.seats.filter(seat => seat.kind !== 'open').length;
  }

  humanCount() {
    return this.seats.filter(seat => seat.kind === 'human').length;
  }

  activeConns() {
    let n = 0;
    for (const player of this.players.values()) n += player.conns.size;
    return n;
  }

  addPlayer({ genId, tokenHash }) {
    const index = this.seats.findIndex(seat => seat.kind === 'open');
    if (index < 0) return { error: 'ROOM_FULL' };
    const seat = this.seats[index];
    seat.kind = 'human';
    seat.genId = genId || null;             // 允许先入席后点将(start 前必须选定)
    seat.name = seat.genId || '';
    seat.playerId = null;                   // 稍后由调用方绑定 playerId
    return { index, seat };
  }

  // 进房后点将:只限本人席位、lobby 阶段、武将未被占
  setGeneral(playerId, genId) {
    if (this.phase !== 'lobby') return { error: 'ALREADY_STARTED' };
    const player = this.players.get(playerId);
    const seat = player && player.seatIndex >= 0 ? this.seats[player.seatIndex] : null;
    if (!seat || seat.kind !== 'human') return { error: 'BAD_STATE' };
    if (!GENERAL_TRAITS[genId]) return { error: 'BAD_STATE' };
    const owner = this.seats.find(item => item.kind !== 'open' && item !== seat && item.genId === genId);
    if (owner) return { error: 'GEN_TAKEN' };
    seat.genId = genId;
    seat.name = genId;
    seat.persona = makePersona(traitsOfGen(genId));
    this.event('general', seat.index, null, genId);
    this.bump(this);
    return {};
  }

  bindPlayer(playerId, { genId, tokenHash }, seatIndex) {
    const player = { id: playerId, genId: genId || null, tokenHash, seatIndex, conns: new Set(), joinedAt: now() };
    this.players.set(playerId, player);
    const seat = this.seats[seatIndex];
    seat.playerId = playerId;
    if (this.phase === 'playing') seat.stack = this.config.stack; // 中途建号不会发生,防御
    this.event('join', seatIndex);
    return player;
  }

  addNpc(genId) {
    if (this.phase !== 'lobby') return { error: 'ALREADY_STARTED' };
    const pool = Object.keys(GENERAL_TRAITS).filter(id => !this.genTaken(id));
    const pick = genId && !this.genTaken(genId) && GENERAL_TRAITS[genId] ? genId
      : pool[Math.floor(this.rng() * pool.length)];
    if (!pick) return { error: 'ROOM_FULL' };
    const seat = this.seats.find(item => item.kind === 'open');
    if (!seat) return { error: 'ROOM_FULL' };
    seat.kind = 'npc';
    seat.genId = pick;
    seat.name = pick;
    seat.persona = makePersona(traitsOfGen(pick));
    this.event('npc', seat.index, null, pick);
    this.bump(this);
    return { seat };
  }

  removeNpc(seatIndex) {
    if (this.phase !== 'lobby') return { error: 'ALREADY_STARTED' };
    const seat = this.seats[seatIndex];
    if (!seat || seat.kind !== 'npc') return { error: 'BAD_STATE' };
    const index = seat.index;
    Object.assign(seat, this.blankSeat(index));
    this.bump(this);
    return {};
  }

  configure(partial) {
    if (this.phase !== 'lobby') return { error: 'ALREADY_STARTED' };
    if (partial.seats !== undefined && partial.seats < this.occupiedCount()) return { error: 'BAD_STATE' };
    const prev = this.config;
    this.config = { ...prev, ...partial };
    if (this.config.seats !== prev.seats) {
      this.seats = this.seats.slice(0, this.config.seats);
      while (this.seats.length < this.config.seats) {
        this.seats.push(this.blankSeat(this.seats.length));
      }
    }
    this.bump(this);
    return {};
  }

  // ---------- 连接生命周期 ----------
  attach(playerId, conn) {
    const player = this.players.get(playerId);
    if (!player) return;
    player.conns.add(conn);
    player.lastSeen = now();
    this.lastActivity = now();
    const seat = this.seatOf(playerId);
    const wasOffline = seat && seat.kind === 'human' && !seat.online;
    if (seat) seat.online = true;
    if (seat && wasOffline && this.H && this.H.actor === seat.id) {
      // 归席:撤销代打,重置完整行动时限
      this.cancelTimer(seat.id);
      this.armDeadline(seat);
    }
    this.bump(this);
  }

  detach(playerId, conn) {
    const player = this.players.get(playerId);
    if (!player) return;
    if (conn) player.conns.delete(conn);   // 先摘除本连接,再判断是否真的无人在线
    player.lastSeen = now();
    this.lastActivity = now();
    if (player.conns.size > 0) return;
    const seat = this.seatOf(playerId);
    if (this.phase === 'lobby') {
      this.freeSeat(seat);
      if (playerId === this.hostId) this.migrateHost();
      if (!this.humanCount() && this.occupiedCount() === 0) this.destroy();
    } else {
      if (seat) {
        seat.online = false;
        if (this.H && this.H.actor === seat.id) {
          this.cancelTimer(seat.id);
          this.armTakeover(seat);
        }
        this.event('offline', seat.index);
      }
    }
    this.bump(this);
  }

  freeSeat(seat) {
    if (!seat) return;
    const player = seat.playerId ? this.players.get(seat.playerId) : null;
    if (player) player.seatIndex = -1;
    Object.assign(seat, this.blankSeat(seat.index));
  }

  migrateHost() {
    const next = [...this.players.values()]
      .filter(player => player.seatIndex >= 0 && this.seats[player.seatIndex].kind === 'human')
      .sort((a, b) => a.joinedAt - b.joinedAt)[0];
    this.hostId = next ? next.id : null;
    this.event('host', next?.seatIndex ?? null);
  }

  leave(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;
    const seat = this.seatOf(playerId);
    if (this.phase === 'lobby') {
      this.freeSeat(seat);
      this.players.delete(playerId);
      if (playerId === this.hostId) this.migrateHost();
      if (!this.players.size && this.occupiedCount() === 0) this.destroy();
    } else {
      // 对局中离席:席位保留,军师接管到底;结算后席次保持,可续接观战
      seat.online = false;
      this.event('leave', seat.index);
    }
    this.bump(this);
  }

  // ---------- 大厅动作 ----------
  startGame(playerId) {
    if (this.phase !== 'lobby') return { error: 'ALREADY_STARTED' };
    if (playerId !== this.hostId) return { error: 'NOT_HOST' };
    if (this.occupiedCount() < 2) return { error: 'BAD_STATE' };
    const unselected = this.seats.filter(seat => seat.kind === 'human' && !seat.genId);
    if (unselected.length) return { error: 'NEED_GENERAL', detail: String(unselected[0].index) };
    for (const seat of this.seats) {
      if (seat.kind === 'open') continue;
      seat.stack = this.config.stack;
      seat.eliminated = false;
      seat.hole = [];
      seat.read = PK.createRead();
      seat.persona = makePersona(traitsOfGen(seat.genId));
    }
    this.seed = makeSeed(this.rng);
    this.handNum = 0;
    this.blindLevel = 0;
    this.stats.hands = 0;
    this.button = this.seats.findIndex(seat => seat.kind !== 'open');
    this.phase = 'playing';
    this.lastHand = null;
    this.event('start');
    this.bump(this);
    this.startHand();
    return {};
  }

  endGame(playerId, reason = 'host') {
    if (playerId !== undefined && playerId !== this.hostId) return { error: 'NOT_HOST' };
    if (this.phase === 'ended') return {};
    this.phase = 'ended';
    this.teardownHand();
    this.deadlineAt = 0;
    this.event('over', null, reason);
    this.bump(this);
    return {};
  }

  rematch(playerId) {
    if (this.phase !== 'ended') return { error: 'BAD_STATE' };
    if (playerId !== this.hostId) return { error: 'NOT_HOST' };
    for (const seat of this.seats) {
      if (seat.kind === 'open') continue;
      seat.stack = this.config.stack;
      seat.eliminated = false;
      seat.hole = [];
      seat.read = PK.createRead();
      seat.persona = makePersona(traitsOfGen(seat.genId));
    }
    this.seed = makeSeed(this.rng);
    this.handNum = 0;
    this.blindLevel = 0;
    this.stats.hands = 0;
    this.button = this.seats.findIndex(seat => seat.kind !== 'open');
    this.phase = 'playing';
    this.lastHand = null;
    this.event('start');
    this.bump(this);
    this.startHand();
    return {};
  }

  // ---------- 一手牌 ----------
  startHand() {
    if (this.phase !== 'playing') return;
    this.cancelAllTimers();
    this.handNum++;
    this.stats.hands++;
    this.lastHand = null;
    this.board = [];
    this.street = -1;
    this.deadlineAt = 0;

    const level = Math.min(6, Math.floor((this.handNum - 1) / this.config.escalate));
    const base = BLIND_PRESETS[this.config.blindsIdx];
    const blinds = level > 0
      ? [round5(base[0] * Math.pow(1.5, level)), round5(base[1] * Math.pow(1.5, level))]
      : [...base];
    if (level !== this.blindLevel) {
      this.blindLevel = level;
      this.event('blindup', null, blinds[1]);
    }

    // 庄位推进:沿席位序找下一个在席且有筹码者(与单人 nextButton 同语义)
    for (let step = 1; step <= this.seats.length; step++) {
      const pos = (this.button + step) % this.seats.length;
      const seat = this.seats[pos];
      if (seat.kind !== 'open' && !seat.eliminated && seat.stack > 0) { this.button = pos; break; }
    }

    const rng = PK.mulberry32(PK.hashSeed(`${this.seed}#${this.handNum}`));
    this.deck = PK.shuffle(PK.makeDeck(), rng);
    this.deckPtr = 0;

    const occupied = this.seats.filter(seat => seat.kind !== 'open' && !seat.eliminated);
    if (occupied.length < 2 || occupied.filter(seat => seat.stack > 0).length < 2) {
      return this.endGame(undefined, 'busted');
    }

    for (const seat of occupied) {
      seat.hole = [];
      seat.slowplayed = false;
      seat.bluffLine = false;
    }

    this.H = T.createHand(occupied, { button: occupied.findIndex(seat => seat.index === this.button), blinds });
    this.H.board = this.board;      // 与 battle.js 相同:公共牌共享引用,actionView 直接可读
    // table.js 会在 seat 对象上写 bet/committed/folded/handStartStack(引用共享,筹码结算自动回写)
    for (const seat of this.H.seats) seat.hole = [this.deck[this.deckPtr++], this.deck[this.deckPtr++]];
    this.street = 0;
    this.event('deal', null, blinds[1]);
    this.bump(this);
    this.after(this.pacing.deal, 'deal', () => this.scheduleActor());
  }

  scheduleActor() {
    if (!this.H || this.H.roundComplete || this.phase !== 'playing') return;
    const seatId = this.H.actor;
    const seat = this.H.seats.find(item => item.id === seatId);
    if (!seat) return;
    if (seat.kind === 'human' && seat.online) this.armDeadline(seat);
    else this.armTakeover(seat);
  }

  armDeadline(seat) {
    const delay = this.pacing.actMin + this.config.turnMs;
    this.deadlineAt = now() + delay;
    this.after(delay, seat.id, () => {
      this.event('autopilot', seat.index, null, 'timeout');
      this.aiAct(seat, true);
    });
    this.bump(this);
  }

  armTakeover(seat) {
    this.deadlineAt = 0;
    const delay = rand(seat.kind === 'npc' ? this.pacing.ai : this.pacing.offline, this.rng) + this.pacing.actMin;
    this.after(delay, seat.id, () => this.aiAct(seat, seat.kind === 'human'));
    this.bump(this);
  }

  cancelTimer(key) {
    for (const timer of this.timers) {
      if (timer.key === key) { clearTimeout(timer.handle); this.timers.delete(timer); }
    }
  }

  cancelAllTimers() {
    for (const timer of this.timers) clearTimeout(timer.handle);
    this.timers.clear();
  }

  after(ms, key, fn) {
    const handle = setTimeout(() => {
      for (const timer of this.timers) if (timer.handle === handle) this.timers.delete(timer);
      if (this.phase !== 'playing' && key !== 'handEnd') return;
      fn();
    }, ms);
    this.timers.add({ handle, key });
    if (this.timers.size > 64) console.warn(`room ${this.code} 计时器异常增多: ${this.timers.size}`);
    return handle;
  }

  // ---------- 行动 ----------
  act(playerId, { actionId, kind, amount }) {
    const player = this.players.get(playerId);
    const seat = this.seatOf(playerId);
    const fingerprint = JSON.stringify({ seat: seat?.id, kind, amount });
    const key = `${playerId}:${actionId}`;
    const seen = this.processed.get(key);
    if (seen) {
      if (seen === fingerprint) return { replay: true };
      return { error: 'ACTION_CONFLICT' };
    }
    if (!this.H || this.phase !== 'playing') return { error: 'BAD_STATE' };
    if (!seat || this.H.actor !== seat.id) return { error: 'NOT_YOUR_TURN' };
    if (!seat.online || seat.folded) return { error: 'NOT_YOUR_TURN' };

    const view = T.actionView(this.H, seat.id);
    let decision = { type: kind };
    if (kind === 'raise') {
      const amount2 = Math.min(seat.stack, Math.max(1, Math.round(amount)));
      decision = { type: 'raise', amount: Math.max(amount2, view.toCall + 1) };
    }
    let result;
    try {
      result = T.applyAction(this.H, seat.id, decision);
    } catch (error) {
      return { error: 'ILLEGAL_ACTION', detail: error.message };
    }
    this.processed.set(key, fingerprint);
    if (this.processed.size > PROCESSED_CAP) {
      const oldest = this.processed.keys().next().value;
      this.processed.delete(oldest);
    }
    this.commit(seat, result, view, { human: true });
    return { ok: true };
  }

  aiAct(seat, autopilot = false) {
    if (!this.H || this.phase !== 'playing' || this.H.actor !== seat.id || seat.folded) return;
    seat.persona ||= makePersona(traitsOfGen(seat.genId));   // 兜底:快照恢复/异常路径人格缺失时代打不崩
    const view = T.actionView(this.H, seat.id);
    const decision = PK.aiDecide({
      ...view,
      rng: PK.mulberry32(PK.hashSeed(`${this.seed}#${this.handNum}#ai#${seat.id}#${this.aiCounter++}`)),
      personality: seat.persona.ai,
      villain: seat.read.view(),
      slowplayed: seat.slowplayed,
      bluffLine: seat.bluffLine,
      equityRuns: this.H.seats.length > 2 ? 96 : undefined,
    });
    seat.slowplayed = !!decision.trapped;
    seat.bluffLine = (decision.type === 'bet' || decision.type === 'raise') && !!decision.bluff;
    let result;
    try {
      result = T.applyAction(this.H, seat.id, decision);
    } catch {
      // AI 决策与规则引擎不一致时,弃牌/过牌兜底,绝不卡死牌局
      const fallback = view.toCall > 0 ? { type: 'fold' } : { type: 'check' };
      try { result = T.applyAction(this.H, seat.id, fallback); } catch { return; }
    }
    this.commit(seat, result, view, { autopilot });
  }

  aiCounter = 0;

  commit(seat, result, view, meta = {}) {
    this.deadlineAt = 0;
    this.cancelAllTimers();
    const kind = result.allin && result.type === 'call' ? 'allin'
      : result.type === 'bet' ? 'bet' : result.type;
    this.event(kind, seat.index, result.amount, meta.autopilot ? 'auto' : null);
    // NPC 读人:聚合桌上其余玩家的动作倾向(battle.js 单挑读取的多人推广)
    for (const other of this.H.seats) {
      if (other === seat || other.kind !== 'npc') continue;
      other.read.track(view.toCall, result.type === 'allin' ? (view.stack <= view.toCall ? 'call' : 'raise') : result.type);
    }
    const complete = this.H.roundComplete;
    this.bump(this);
    if (complete) this.after(this.pacing.street, 'street', () => this.nextStreet());
    else this.scheduleActor();
  }

  nextStreet() {
    if (!this.H || this.phase !== 'playing') return;
    if (T.liveSeats(this.H.seats).length <= 1) return this.finishHand();
    if (this.street >= 3) return this.finishHand();
    T.closeRound(this.H);
    this.deckPtr++;                                     // 烧牌(与单人发牌流一致)
    const count = this.street === 0 ? 3 : 1;
    for (let i = 0; i < count; i++) this.board.push(this.deck[this.deckPtr++]);
    this.street++;
    T.beginRound(this.H, this.street);
    this.event('street', null, this.board.length);
    this.bump(this);
    if (this.H.roundComplete) this.after(this.pacing.street, 'street', () => this.nextStreet());
    else this.scheduleActor();
  }

  finishHand() {
    const H = this.H;
    const live = T.liveSeats(H.seats);
    const before = H.seats.reduce((sum, seat) => sum + seat.stack, 0) + T.potTotal(H.seats);
    let settled;
    const reveals = [];
    const evals = {};
    if (live.length === 1) {
      settled = T.settleHand(H);
      this.event('foldwin', live[0].index, T.potTotal(H.seats));
    } else {
      const scores = {};
      for (const seat of live) {
        const evaluation = PK.evaluate7([...seat.hole, ...this.board]);
        evals[seat.index] = { cat: evaluation.cat, best5: evaluation.best5, hole: [...seat.hole] };
        scores[seat.id] = evaluation.score;
        reveals.push({ seat: seat.index, cat: evaluation.cat, best5: evaluation.best5, hole: [...seat.hole] });
      }
      settled = T.settleHand(H, scores);
      this.event('showdown', null, null, reveals.map(item => item.seat));
    }
    const after = H.seats.reduce((sum, seat) => sum + seat.stack, 0);
    if (after !== before) console.error(`房间 ${this.code} 筹码不守恒: ${before} -> ${after}`);

    const awards = {};
    for (const seat of H.seats) awards[seat.index] = settled.awards[seat.id] || 0;
    const refunds = (settled.pots || []).filter(pot => pot.refund && pot.amount > 0)
      .map(pot => ({ seat: H.seats.findIndex(item => item.id === pot.id), amount: pot.amount }));
    this.lastHand = {
      kind: live.length === 1 ? 'foldwin' : 'showdown',
      handNum: this.handNum,
      board: [...this.board],
      deck: [...this.deck],
      seed: `${this.seed}#${this.handNum}`,
      reveals,
      awards,
      refunds,
      pots: settled.pots.map(pot => ({ amount: pot.amount, winners: (pot.winners || []).map(id => H.seats.findIndex(item => item.id === id)), refund: !!pot.refund })),
    };
    for (const seat of H.seats) { seat.bet = 0; seat.committed = 0; }
    this.teardownHand();
    this.bump(this);
    this.after(this.pacing.handEnd, 'handEnd', () => this.afterHand());
  }

  afterHand() {
    if (this.phase !== 'playing') return;
    const seated = this.seats.filter(seat => seat.kind !== 'open');
    for (const seat of seated) {
      if (!seat.eliminated && seat.stack <= 0) {
        seat.eliminated = true;
        this.event('elim', seat.index);
      }
    }
    const alive = seated.filter(seat => !seat.eliminated && seat.stack > 0);
    if (alive.length <= 1) {
      this.phase = 'ended';
      this.lastHand = null;
      this.event('over', alive[0]?.index ?? null, 'champion');
      this.bump(this);
      return;
    }
    this.startHand();
  }

  teardownHand() {
    this.H = null;
    this.board = [];
    this.street = -1;
    this.deadlineAt = 0;
    this.cancelAllTimers();
  }

  // ---------- 流水与视图 ----------
  event(t, s = null, a = null, x = null) {
    this.log.push({ n: this.handNum, t, s, a, x });
    if (this.log.length > 200) this.log.splice(0, this.log.length - 200);
  }

  standings() {
    return this.seats
      .filter(seat => seat.kind !== 'open')
      .map(seat => ({ seat: seat.index, genId: seat.genId, stack: seat.stack }))
      .sort((a, b) => b.stack - a.stack);
  }

  viewFor(playerId) {
    const player = this.players.get(playerId) || null;
    const youSeat = player && player.seatIndex >= 0 ? this.seats[player.seatIndex] : null;
    const H = this.H;
    const reveal = !!this.lastHand;
    const seats = this.seats.map(seat => {
      const pos = H ? H.seats.indexOf(seat) : -1;
      const roles = [];
      if (pos >= 0) {
        if (H.button === pos) roles.push('button');
        if (H.sb === pos) roles.push('sb');
        if (H.bb === pos) roles.push('bb');
      }
      const mine = seat === youSeat;
      const showHole = !!seat.hole?.length && (mine || (reveal && this.lastHand.kind === 'showdown' && !seat.folded));
      const showdownCard = reveal && this.lastHand.reveals?.find(item => item.seat === seat.index) || null;
      return {
        index: seat.index, id: seat.id, kind: seat.kind, genId: seat.genId,
        stack: seat.stack, eliminated: seat.eliminated, folded: !!seat.folded,
        bet: seat.bet, committed: seat.committed, online: seat.kind === 'npc' ? true : seat.online,
        autopilot: seat.kind === 'human' && this.phase === 'playing' && !seat.online,
        hole: showHole ? seat.hole : null, holeCount: seat.hole?.length || 0,
        roles, actor: !!H && H.actor === seat.id && !seat.folded,
        showdown: showdownCard ? { cat: showdownCard.cat, best5: showdownCard.best5 } : null,
      };
    });
    const mine = !!(H && youSeat && H.actor === youSeat.id && !youSeat.folded);
    const view = mine ? T.actionView(H, youSeat.id) : null;
    return {
      v: this.version,
      code: this.code,
      phase: this.phase,
      hostId: this.hostId,
      config: this.config,
      seats,
      you: player ? { seatIndex: player.seatIndex, isHost: playerId === this.hostId } : null,
      hand: H ? {
        handNum: this.handNum,
        street: this.street,
        board: [...this.board],
        pot: T.potTotal(H.seats),
        currentBet: H.currentBet,
        actor: H.actor,
        toCall: view ? view.toCall : 0,
        minRaise: view ? view.minRaise : H.minRaise,
        raisesLeft: view ? view.raisesLeft : 0,
        canRaise: view ? view.canRaise : false,
        stack: youSeat ? youSeat.stack : 0,
        hole: youSeat?.hole || [],
        deadline: mine ? this.deadlineAt : null,
        now: now(),
      } : null,
      lastHand: this.lastHand,
      log: this.log.slice(-LOG_TAIL),
      stats: { hands: this.stats.hands },
      standings: this.phase === 'ended' ? this.standings() : null,
      now: now(),
    };
  }

  // ---------- 幂等:room_action 复用同一指纹表 ----------
  roomAction(playerId, { actionId, kind, ...payload }) {
    const key = `${playerId}:${actionId}`;
    const fingerprint = JSON.stringify({ kind, ...payload });
    const seen = this.processed.get(key);
    if (seen) {
      if (seen === fingerprint) return { replay: true };
      return { error: 'ACTION_CONFLICT' };
    }
    let result;
    switch (kind) {
      case 'configure': result = this.configure(payload.config); break;
      case 'add_npc': result = this.addNpc(payload.genId); break;
      case 'remove_npc': result = this.removeNpc(payload.seat); break;
      case 'set_general': result = this.setGeneral(playerId, payload.genId); break;
      case 'start_game': result = this.startGame(playerId); break;
      case 'end_game': result = this.endGame(playerId, 'host'); break;
      case 'rematch': result = this.rematch(playerId); break;
      case 'leave': result = this.leave(playerId), result = {}; break;
      default: result = { error: 'BAD_STATE' };
    }
    if (result.error) return result;
    this.processed.set(key, fingerprint);
    if (this.processed.size > PROCESSED_CAP) {
      const oldest = this.processed.keys().next().value;
      this.processed.delete(oldest);
    }
    return { ok: true };
  }

  verifyDeck() {
    if (this.lastHand) {
      return { handNum: this.lastHand.handNum, seed: this.lastHand.seed, deck: this.lastHand.deck };
    }
    if (this.H) return { error: 'BAD_STATE', detail: '本手进行中,牌序待收池后可验' };
    return { error: 'BAD_STATE' };
  }

  destroy() {
    this.phase = this.phase === 'ended' ? 'ended' : 'closed';
    this.cancelAllTimers();
    this.players.clear();
    if (this.onDestroy) this.onDestroy(this);
  }

  // ---------- 快照 ----------
  serialize() {
    return {
      v: 1,
      code: this.code,
      hostId: this.hostId,
      phase: this.phase,
      config: this.config,
      seed: this.seed,
      handNum: this.handNum,
      button: this.button,
      blindLevel: this.blindLevel,
      stats: this.stats,
      midHand: !!this.H,
      seats: this.seats.map(seat => ({
        kind: seat.kind, genId: seat.genId, stack: seat.stack,
        playerId: seat.playerId, eliminated: seat.eliminated,
        handStartStack: seat.handStartStack,
      })),
      players: [...this.players.values()].map(player => ({
        id: player.id, genId: player.genId, tokenHash: player.tokenHash,
        seatIndex: player.seatIndex, joinedAt: player.joinedAt,
      })),
      processed: [...this.processed.entries()].slice(-PROCESSED_CAP),
      log: this.log.slice(-LOG_TAIL * 2),
      lastHand: this.lastHand,
      savedAt: now(),
    };
  }

  static restore(data, { touch, rng = Math.random, pacing = {} }) {
    if (data.v !== 1) throw new Error(`不认识的快照版本: ${data.v}`);
    const room = new Room({ code: data.code, hostId: data.hostId, config: data.config, touch, rng, pacing });
    room.phase = data.phase;
    room.seed = data.seed;
    room.handNum = data.handNum;
    room.button = data.button;
    room.blindLevel = data.blindLevel ?? 0;
    room.stats = data.stats || room.stats;
    room.log = data.log || [];
    room.lastHand = data.lastHand || null;
    room.processed = new Map(data.processed || []);
    room.seats = data.seats.map((seat, index) => {
      const restored = room.blankSeat(index);
      Object.assign(restored, {
        kind: seat.kind, genId: seat.genId, name: seat.genId, stack: seat.stack,
        playerId: seat.playerId, eliminated: seat.eliminated,
        handStartStack: seat.handStartStack || 0,   // 供 midHand 回退手前筹码
      });
      if (restored.kind !== 'open') restored.persona = makePersona(traitsOfGen(restored.genId));
      return restored;
    });
    for (const record of data.players || []) {
      room.players.set(record.id, {
        id: record.id, genId: record.genId, tokenHash: record.tokenHash,
        seatIndex: record.seatIndex, conns: new Set(), joinedAt: record.joinedAt || now(),
      });
    }
    if (room.phase === 'playing') {
      if (data.midHand) {
        // 恢复期遇上一手未完:退回手前筹码,该手作废重发
        for (const seat of room.seats) {
          if (seat.kind !== 'open' && seat.handStartStack > 0) seat.stack = seat.handStartStack;
        }
      }
      room.lastActivity = now();
      room.after(room.pacing.deal * 2, 'resume', () => room.startHand());
    }
    return room;
  }
}