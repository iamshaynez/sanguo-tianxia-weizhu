// encounters.js —— 遭遇配置归一化:单对手、同桌阵容与 named 连战共用
export function rosterOf(cfg = {}) {
  return Array.isArray(cfg.opponents) && cfg.opponents.length ? cfg.opponents : [cfg];
}

export function roundConfig(cfg = {}, round = 1) {
  const override = cfg.rounds?.[round - 1];
  if (!override) return cfg;
  const { rounds, ...base } = cfg;
  return { ...base, ...override, traits: override.traits || base.traits };
}

export function chapterEncounters(chapter) {
  const out = [];
  if (chapter.skirmish) out.push({ kind: 'skirmish', cfg: chapter.skirmish });
  if (chapter.boss) {
    const rounds = chapter.rule?.gauntlet || 1;
    for (let round = 1; round <= rounds; round++) {
      const cfg = roundConfig(chapter.boss, round);
      for (const opponent of rosterOf(cfg)) out.push({ kind: 'boss', cfg: opponent, round });
    }
  }
  return out;
}
