// rooms.js —— 房间仓库:建房/续码/快照持久化(防抖原子写)与空房回收。
import { mkdir, readFile, rename, writeFile, rm } from 'node:fs/promises';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { Room, makeRoomCode } from './game.js';
import { SNAPSHOT_DEBOUNCE, GC_SWEEP, IDLE_LOBBY_MS, IDLE_PLAY_MS, IDLE_END_MS, CODE_LEN, CODE_CHARS, PROCESSED_CAP } from '../src/online/protocol.js';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const tokenMatch = (a, b) => {
  const ha = Buffer.from(a, 'hex');
  const hb = Buffer.from(b, 'hex');
  return ha.length === hb.length && timingSafeEqual(ha, hb);
};

export function newToken() {
  return randomBytes(24).toString('base64url');
}

export class RoomStore {
  constructor({ dataFile = null, logger = console } = {}) {
    this.rooms = new Map();        // code -> Room
    this.dataFile = dataFile;
    this.logger = logger;
    this.saveTimer = null;
    this.broadcaster = null;       // index.mjs 注入: room => 网关广播
  }

  onTouch(room) {
    this.save(room);
    if (this.broadcaster) this.broadcaster(room);
  }

  async boot() {
    if (this.dataFile) {
      try {
        const raw = await readFile(this.dataFile, 'utf8');
        const data = JSON.parse(raw);
        let restored = 0, skipped = 0;
        for (const record of data.rooms || []) {
          try {
            if (record.phase === 'ended' && Date.now() - (record.savedAt || 0) > IDLE_END_MS) { skipped++; continue; }
            const room = Room.restore(record, { touch: target => this.onTouch(target) });
            room.onDestroy = target => this.drop(target.code);
            this.rooms.set(room.code, room);
            restored++;
          } catch (error) {
            skipped++;
            this.logger.warn(`房间快照 ${record.code} 无法恢复:`, error.message);
          }
        }
        if (restored) this.logger.log(`已恢复 ${restored} 个房间快照`);
        if (skipped) this.logger.log(`跳过 ${skipped} 个过期快照`);
      } catch {
        this.logger.log('尚无房间快照,冷启动');
      }
    }
    this.gcTimer = setInterval(() => this.gc(), GC_SWEEP);
    this.gcTimer.unref?.();
  }

  get(code) {
    return this.rooms.get(String(code || '').toUpperCase()) || null;
  }

  save(room) {
    if (!this.dataFile) return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), SNAPSHOT_DEBOUNCE);
    this.saveTimer.unref?.();
  }

  async flush() {
    if (!this.dataFile) return;
    this.saveTimer = null;
    const payload = {
      v: 1,
      savedAt: Date.now(),
      rooms: [...this.rooms.values()]
        .filter(room => room.phase !== 'closed')
        .map(room => room.serialize()),
    };
    try {
      await mkdir(path.dirname(this.dataFile), { recursive: true });
      const tmp = `${this.dataFile}.${process.pid}.tmp`;
      await writeFile(tmp, JSON.stringify(payload), { mode: 0o600 });
      await rename(tmp, this.dataFile);
    } catch (error) {
      this.logger.warn('快照写入失败(继续内存运行):', error.message);
    }
  }

  drop(code) {
    this.rooms.delete(code);
    this.save({});   // 触发防抖落盘
  }

  createRoom({ hostId, genId, config, tokenHash }) {
    let code = null;
    for (let attempt = 0; attempt < 24; attempt++) {
      const candidate = makeRoomCode();
      if (!this.rooms.has(candidate)) { code = candidate; break; }
    }
    if (!code) throw new Error('房间号分配失败');
    const room = new Room({
      code, hostId, config,
      touch: target => this.onTouch(target),
    });
    room.onDestroy = target => this.drop(target.code);
    this.rooms.set(code, room);
    return room;
  }

  gc() {
    const nowMs = Date.now();
    for (const room of this.rooms.values()) {
      const idle = nowMs - room.lastActivity;
      const limit = room.phase === 'lobby' ? IDLE_LOBBY_MS
        : room.phase === 'ended' ? IDLE_END_MS : IDLE_PLAY_MS;
      if (room.activeConns() === 0 && idle > limit) {
        this.logger.log(`回收空闲房间 ${room.code}(${room.phase},静默 ${Math.round(idle / 60000)} 分钟)`);
        room.destroy();
      }
    }
  }

  async close() {
    if (this.gcTimer) clearInterval(this.gcTimer);
    if (this.saveTimer) { clearTimeout(this.saveTimer); this.saveTimer = null; }
    await this.flush();
  }
}

// 鉴权辅助:welcome 时生成 token,resume 时比对哈希
export { sha256 as hashToken, tokenMatch };
