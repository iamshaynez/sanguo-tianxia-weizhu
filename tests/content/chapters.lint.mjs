// tests/content/chapters.lint.mjs —— 章节数据配方校验(内容即数据,数据有测试)
// 配方:槽位齐全 / 文案长度上限(防长文渗漏) / 引用合法 / 结构契约 / 武将档案配方
import { CHAPTERS, FX, GENERALS, SKINS, STORY_DATA, BRIEFINGS, SPEAKERS, chapterEncounters, rosterOf } from './helpers.mjs';
import { existsSync } from 'node:fs';

const TRAIT_KEYS = ['武勇', '智谋', '诈术', '胆识', '耐性', '心性'];
const len = s => [...String(s || '')].length;
const fails = [];
const check = (ok, msg) => { if (!ok) fails.push(msg); };

// 文案长度上限:单屏永远一行
const LIMIT = { premise: 26, history: 32, yeshi: 46, note: 30, defeat: 26, ruleText: 40, omenN: 6, mapName: 6 };

const ids = new Set();
let gateCount = 0;

for (const c of CHAPTERS) {
  const at = `[${c.id || '???'}]`;
  check(c.id && !ids.has(c.id), `${at} id 缺失或重复`);
  ids.add(c.id);
  check(c.scroll >= 1 && c.scroll <= 5, `${at} scroll 越界`);
  check(c.scroll === 5 || len(c.year) > 0, `${at} 缺年号`);
  check(len(c.name) >= 1 && len(c.name) <= 12, `${at} 回目名长度异常`);
  check(['assault', 'scheme', 'gauntlet', 'choice', 'finale'].includes(c.type), `${at} type 非法:${c.type}`);

  check(len(c.premise) > 0 && len(c.premise) <= LIMIT.premise, `${at} 题记超长(${len(c.premise)})`);
  check(len(c.history) > 0 && len(c.history) <= LIMIT.history, `${at} 正史超长(${len(c.history)})`);
  check(len(c.yeshi) > 0 && len(c.yeshi) <= LIMIT.yeshi, `${at} 野史超长(${len(c.yeshi)})`);
  check(len(c.note) > 0 && len(c.note) <= LIMIT.note, `${at} 写卷人注超长`);
  check(len(c.defeat) > 0 && len(c.defeat) <= LIMIT.defeat, `${at} 兵败批注超长`);
  check(len(c.ruleText) <= LIMIT.ruleText, `${at} 规则说明超长`);

  check(Array.isArray(c.map) && c.map.length >= 1, `${at} 行军图缺失`);
  for (const m of c.map) check(len(m) >= 2 && len(m) <= LIMIT.mapName, `${at} 地名「${m}」长度异常`);

  for (const side of ['skirmish', 'boss']) {
    const o = c[side];
    check(o && len(o.name) > 0, `${at} ${side} 缺名称`);
    check(o && o.traits, `${at} ${side} 缺属性包`);
    if (o?.traits) {
      for (const k of TRAIT_KEYS) {
        check(Number.isFinite(o.traits[k]) && o.traits[k] >= 0 && o.traits[k] <= 100, `${at} ${side}.traits.${k} 越界`);
      }
    }
  }
  check(c.boss && Number.isFinite(c.boss.stack) && c.boss.stack > 0, `${at} boss 缺 stack`);
  if (c.boss?.opponents) check(c.boss.opponents.length >= 2 && c.boss.opponents.length <= 3, `${at} 同桌阵容须为 2–3 人`);
  if (c.boss?.rounds) check(c.boss.rounds.length === c.rule?.gauntlet, `${at} named 连战轮次与 gauntlet 不一致`);
  for (const encounter of chapterEncounters(c)) {
    const ec = encounter.cfg;
    check(ec.name && len(ec.name) > 0, `${at} 遭遇配置缺名称`);
    check(encounter.kind === 'skirmish' || (Number.isFinite(ec.stack) && ec.stack > 0), `${at}/${ec.name} 缺有效军资`);
    if (ec.gen) check(GENERALS[ec.gen], `${at}/${ec.name} 武将未登记:${ec.gen}`);
    for (const key of TRAIT_KEYS) check(Number.isFinite(ec.traits?.[key]) && ec.traits[key] >= 0 && ec.traits[key] <= 100, `${at}/${ec.name} 六维 ${key} 异常`);
  }

  check(Array.isArray(c.omens) && c.omens.length === 3, `${at} 天时必须三选`);
  const fxSet = new Set();
  for (const o of c.omens || []) {
    check(len(o.n) >= 2 && len(o.n) <= LIMIT.omenN, `${at} 天时名「${o.n}」长度异常`);
    check(o.fx in FX, `${at} 天时效果键非法:${o.fx}`);
    fxSet.add(o.fx);
  }
  check(fxSet.size === (c.omens || []).length, `${at} 天时效果重复`);

  if (c.type === 'choice') {
    check(c.rule?.choice?.a && c.rule?.choice?.b, `${at} choice 缺选项`);
    check(len(c.yeshiB) > 0 && len(c.yeshiB) <= LIMIT.yeshi, `${at} 缺野史 B 线`);
  }
  if (c.type === 'gauntlet') {
    check(Number.isInteger(c.rule?.gauntlet) && c.rule.gauntlet >= 2 && c.rule.gauntlet <= 7, `${at} gauntlet 场数异常`);
  }
  if (c.rule?.lieMult) check(c.rule.lieMult >= 1 && c.rule.lieMult <= 3, `${at} lieMult 越界`);
  if (c.gate) gateCount++;
}

// 结构契约:大关回齐备 + 最后一页存在
for (const g of ['baimenlou', 'changban', 'maicheng', 'wuzhangyuan']) {
  check(CHAPTERS.find(c => c.id === g && c.gate), `缺大关回 ${g}`);
}
const finale = CHAPTERS.find(c => c.id === 'zuizhong');
check(finale && finale.scroll === 5 && finale.type === 'finale', '缺最后一页');
check(gateCount === 5, `大关回数量异常:${gateCount}`);

// 页间因果:手工精选的例外,不是通用系统——全书限量
let causalPairs = 0;
const idsSet = new Set(CHAPTERS.map(c => c.id));
for (const c of CHAPTERS) {
  for (const e of c.causal || []) {
    causalPairs++;
    const m = /^(\w+):(yeshi|history)$/.exec(e.when || '');
    check(m && idsSet.has(m[1]), `[${c.id}] 因果 when 非法:${e.when}`);
    check(len(e.premise) > 0 && len(e.premise) <= LIMIT.premise, `[${c.id}] 因果题记超长`);
    check(len(e.note) > 0 && len(e.note) <= LIMIT.note, `[${c.id}] 因果批注超长`);
  }
}
check(causalPairs <= 6, `因果对超限:${causalPairs} > 6(精选例外,不许当系统用)`);

// 武将引用:boss.gen 必须在档案库中
for (const c of CHAPTERS) {
  if (c.boss?.gen) check(GENERALS[c.boss.gen], `[${c.id}] boss.gen 未登记:${c.boss.gen}`);
}

// 武将档案配方:签名破绽/台词/小传/造型键,全部槽位齐全且不超长
const GLIMIT = { tell: 18, bark: 24, bio: 26 };
for (const [gid, g] of Object.entries(GENERALS)) {
  const at = `[武将 ${gid}]`;
  check(g.name && len(g.name) <= 8, `${at} 姓名异常`);
  check(g.skin && g.skin in SKINS, `${at} 造型键未登记:${g.skin}`);
  check(len(g.bio) > 0 && len(g.bio) <= GLIMIT.bio, `${at} 小传超长(${len(g.bio)})`);
  check(len(g.tells?.strong) > 0 && len(g.tells.strong) <= GLIMIT.tell, `${at} 强牌破绽缺失/超长`);
  check(len(g.tells?.weak) > 0 && len(g.tells.weak) <= GLIMIT.tell, `${at} 弱牌破绽缺失/超长`);
  for (const k of ['open', 'taunt', 'tilt', 'smug', 'badbeat']) {
    check(len(g.barks?.[k]) > 0 && len(g.barks[k]) <= GLIMIT.bark, `${at} 台词 ${k} 缺失/超长`);
  }
}

// 所有注册头像必须存在于本地,通用武将像也只使用明确的通用键
for (const [key, skin] of Object.entries(SKINS)) {
  check(/^No_(?:pk_)?\d{3}\.jpg$/.test(skin.file), `[头像 ${key}] 文件名异常:${skin.file}`);
  check(existsSync(`assets/portraits/san9/${skin.file}`), `[头像 ${key}] 文件不存在:${skin.file}`);
}

// 史实底稿与逐战战书:每一回都必须能交代年代、来源、改编、对阵与胜负代价
const BRIEF_LIMIT = { era: 34, source: 80, record: 170, adaptation: 170, lead: 150, title: 34, body: 170 };
function checkBattleBrief(brief, at) {
  check(brief && len(brief.title) > 0 && len(brief.title) <= BRIEF_LIMIT.title, `${at} 战题缺失或过长`);
  for (const key of ['why', 'win', 'loss']) {
    check(len(brief?.[key]) >= 12 && len(brief?.[key]) <= BRIEF_LIMIT.body, `${at} ${key} 战书缺失或长度异常(${len(brief?.[key])})`);
  }
}
check(Object.keys(BRIEFINGS).length === CHAPTERS.length, '史实底稿数量必须与正卷及终章一致');
for (const id of Object.keys(BRIEFINGS)) check(idsSet.has(id), `[战书 ${id}] 没有对应章节`);
for (const c of CHAPTERS) {
  const at = `[战书 ${c.id}]`;
  const brief = BRIEFINGS[c.id];
  check(!!brief, `${at} 缺史实底稿`);
  if (!brief) continue;
  for (const key of ['era', 'source', 'record', 'adaptation', 'lead']) {
    check(len(brief[key]) > 0 && len(brief[key]) <= BRIEF_LIMIT[key], `${at} ${key} 缺失或过长(${len(brief[key])})`);
  }
  checkBattleBrief(brief.skirmish, `${at}/遭遇`);
  checkBattleBrief(brief.boss, `${at}/关底`);
  if (c.rule?.gauntlet) {
    check(Array.isArray(brief.rounds) && brief.rounds.length === c.rule.gauntlet, `${at} 连战战书必须覆盖每一阵`);
    (brief.rounds || []).forEach((round, index) => checkBattleBrief(round, `${at}/第${index + 1}阵`));
  } else {
    check(!brief.rounds, `${at} 非连战不应配置逐阵战书`);
  }
  if (c.rule?.reviveOnce) checkBattleBrief(brief.revive, `${at}/回马再战`);
}
check(CHAPTERS.find(c => c.id === 'guijin')?.year === '太康元年', '[guijin] 灭吴归晋应使用太康元年');
check(BRIEFINGS.guijin?.era.includes('280'), '[guijin] 史实底稿应标明 280 年');
check(!JSON.stringify({ CHAPTERS, STORY_DATA, BRIEFINGS }).includes('温候'), '吕布封号统一为「温侯」');

// 章回剧本:长文按场景拆拍,不再用“一行上限”压制叙事
const STORY_LINE_LIMIT = { coldOpen: 100, map: 120, battle: 72, outcome: 220, clue: 120 };
const EFFECT_KEYS = new Set(['chips', 'oppChips', 'keenEye', 'sow', 'fact', 'raid']);
const WHEN_KINDS = new Set(['page', 'choice', 'clue', 'fact', 'seen', 'round', 'hand', 'multi', 'single', 'asZhuge', 'omen']);
function checkWhen(when, at) {
  const atoms = Array.isArray(when) ? when : (when ? [when] : []);
  for (const raw of atoms) {
    const atom = String(raw).replace(/^!/, '');
    const kind = atom.split(':')[0];
    check(WHEN_KINDS.has(kind), `${at} 未知剧情条件:${raw}`);
  }
}
function checkLines(lines, kind, at) {
  check(Array.isArray(lines) && lines.length > 0, `${at} 缺${kind}文本`);
  for (const line of lines || []) {
    check(line && typeof line.speaker === 'string' && (SPEAKERS[line.speaker] || GENERALS[line.speaker]), `${at} 说话人未登记:${line?.speaker}`);
    check(len(line.text) > 0 && len(line.text) <= STORY_LINE_LIMIT[kind], `${at} ${kind}文本长度异常(${len(line.text)})`);
    checkWhen(line.when, at);
  }
}
for (const [cid, story] of Object.entries(STORY_DATA)) {
  const at = `[剧本 ${cid}]`;
  const chapterRef = CHAPTERS.find(c => c.id === cid);
  check(!!chapterRef, `${at} 没有对应章节`);
  check(Array.isArray(story.cast) && story.cast.length > 0, `${at} 缺登场人物`);
  for (const gid of story.cast || []) check(GENERALS[gid] || SPEAKERS[gid], `${at} 登场人物未登记:${gid}`);
  check(len(story.objective) > 0 && len(story.objective) <= 90, `${at} 本回目标缺失或过长`);
  checkLines(story.coldOpen, 'coldOpen', at);
  check(Array.isArray(story.map) && (cid === 'zuizhong' || story.map.length > 0), `${at} 缺专属行军场景`);
  const sceneIds = new Set();
  for (const scene of story.map || []) {
    check(scene.id && !sceneIds.has(scene.id), `${at} 地图场景 ID 缺失或重复`);
    sceneIds.add(scene.id);
    check(Number.isInteger(scene.node) || typeof scene.node === 'string', `${at}/${scene.id} 节点引用异常`);
    if (Number.isInteger(scene.node)) check(scene.node > 0 && chapterRef && scene.node < chapterRef.map.length - 1, `${at}/${scene.id} 不在可到达的中间节点`);
    check(len(scene.title) > 0 && len(scene.title) <= 24, `${at}/${scene.id} 场景标题异常`);
    checkLines(scene.lines, 'map', `${at}/${scene.id}`);
    check(Array.isArray(scene.choices) && scene.choices.length >= 1 && scene.choices.length <= 3, `${at}/${scene.id} 选项数量异常`);
    const choiceIds = new Set();
    for (const choice of scene.choices || []) {
      check(choice.id && !choiceIds.has(choice.id), `${at}/${scene.id} 选项 ID 缺失或重复`);
      choiceIds.add(choice.id);
      check(len(choice.text) > 0 && len(choice.text) <= 36, `${at}/${scene.id} 选项文本异常`);
      for (const key of Object.keys(choice.effects || {})) check(EFFECT_KEYS.has(key), `${at}/${scene.id} 未知效果:${key}`);
    }
  }
  check(Array.isArray(story.battle) && story.battle.length >= 2, `${at} 至少两个牌局拍点`);
  const beatIds = new Set();
  for (const beat of story.battle || []) {
    check(beat.id && !beatIds.has(beat.id), `${at} 牌局拍点 ID 缺失或重复`);
    beatIds.add(beat.id);
    check(['start', 'low'].includes(beat.at) || /^hand:[1-9]\d*$/.test(beat.at), `${at}/${beat.id} 拍点触发器异常`);
    checkLines([beat], 'battle', `${at}/${beat.id}`);
  }
  for (const result of ['win', 'loss']) {
    check(len(story[result]?.text) > 0 && len(story[result].text) <= STORY_LINE_LIMIT.outcome, `${at} ${result} 结局文本异常`);
    checkLines(story[result]?.lines || [{ speaker: 'narrator', text: story[result]?.text }], 'outcome', `${at}/${result}`);
  }
  check(len(story.win?.hook) > 0 && len(story.win.hook) <= 100, `${at} 缺下页钩子`);
  check(len(story.loss?.clue) > 0 && len(story.loss.clue) <= STORY_LINE_LIMIT.clue, `${at} 缺失败史鉴`);
  if (story.loss?.clueFx) check(story.loss.clueFx in FX, `${at} 史鉴效果非法`);
}
for (const id of ['hulao', 'baimenlou', 'zhujiu']) check(STORY_DATA[id], `缺连续剧情样板:${id}`);
for (const chapter of CHAPTERS) check(STORY_DATA[chapter.id], `[${chapter.id}] 缺完整章回剧本`);

if (fails.length) {
  console.error(`❌ 章节配方校验 ${fails.length} 项未过:`);
  for (const f of fails) console.error('  - ' + f);
  process.exit(1);
}
console.log(`✅ 章节配方校验通过:${CHAPTERS.length} 回(含最后一页),完整剧本 ${Object.keys(STORY_DATA).length} 回,史实底稿 ${Object.keys(BRIEFINGS).length} 回,武将 ${Object.keys(GENERALS).length} 名,大关回 4 + 终局,天时效果键 ${Object.keys(FX).length} 种`);
