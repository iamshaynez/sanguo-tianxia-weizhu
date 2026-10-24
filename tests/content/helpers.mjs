// tests/content/helpers.mjs —— 内容测试的公共出口(避免 lint 直接依赖游戏内部路径多处写死)
export { CHAPTERS, FX, SCROLLS, GATE_IDS, NORMAL_IDS, getChapter } from '../../src/chapters.js';
export { TRAITS } from '../../src/persona.js';
export { GENERALS } from '../../src/generals.js';
export { SKINS } from '../../src/character.js';
