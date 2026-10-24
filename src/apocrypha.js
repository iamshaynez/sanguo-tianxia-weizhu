// apocrypha.js —— 残卷无终稿(NG+):通关后的随机外传页
// 从武将档案池、地名池、规则库、天时池中随机组装一页;只计胜场,不占正卷三十二回。
import { GENERALS } from './generals.js';
import { FX } from './chapters.js';

const TITLES = ['风雪劫', '雾中约', '夜半局', '孤城计', '渡口灯', '残卷尾页', '驿亭对坐', '江雾残牌'];
const PLACES = ['虎牢道', '渭水', '乌林岸', '隆中径', '街亭道', '麦城道', '斜谷口', '濡须坞', '五丈原下', '白帝城头'];
const OMEN_NAMES = ['江雾四合', '天狼未陨', '粮道已通', '北风乍起', '残灯将尽', '驿马星动'];
const RULES = [
  { rule: null, text: '' },
  { rule: { lieMult: 1.6 }, text: '此页眼见未必为实:破绽假动作加多。' },
  { rule: { gauntlet: 3 }, text: '连战三场,筹码一路相随。' },
  { rule: { tauntImmune: true }, text: '他不接话,也不动气——攻心无用。' },
];
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function genApocrypha(rng = Math.random) {
  const gid = pick(rng, Object.keys(GENERALS));
  const g = GENERALS[gid];
  const r = pick(rng, RULES);
  const mapN = 3 + Math.floor(rng() * 2);
  const map = [...PLACES].sort(() => rng() - 0.5).slice(0, mapN);
  const omenFx = Object.keys(FX).sort(() => rng() - 0.5).slice(0, 3);
  const omenNames = [...OMEN_NAMES].sort(() => rng() - 0.5).slice(0, 3);
  return {
    id: 'apoc-' + Math.random().toString(36).slice(2, 8),
    apocrypha: true,
    scroll: 0, year: '', name: `外传 · ${pick(rng, TITLES)}`,
    type: 'assault',
    premise: '这一页不在正卷里。它只属于今夜。',
    map,
    skirmish: { name: '夜行人', traits: { 武勇: 50, 智谋: 45, 诈术: 45, 胆识: 50, 耐性: 45, 心性: 45 } },
    boss: {
      name: `${g.name} · 夜行`, gen: gid,
      traits: { 武勇: clamp(40 + rng() * 55, 5, 95), 智谋: clamp(40 + rng() * 55, 5, 95), 诈术: clamp(30 + rng() * 60, 5, 95), 胆识: clamp(40 + rng() * 50, 5, 95), 耐性: clamp(35 + rng() * 55, 5, 95), 心性: clamp(30 + rng() * 60, 5, 95) },
      stack: 800 + Math.floor(rng() * 600),
    },
    omens: omenFx.map((fx, i) => ({ n: omenNames[i], fx })),
    rule: r.rule || {},
    ruleText: r.text,
    history: '此页无正史。',
    yeshi: '你赢下这一页,纸页随风而散,又生新页。',
    note: '写卷人注:无终稿,无终局。',
    defeat: '风把这一页吹回了原处。',
  };
}
