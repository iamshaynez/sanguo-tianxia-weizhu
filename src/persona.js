// persona.js —— 牌局人格基座:六维三国属性 → AI 战术参数
//
// 设计原则:
// 1. 具体人物只是一包属性。未来的武将、剧本角色、随机路人,都用同一框架生成,
//    剧本作者只需要填六维语义数值(0..100),不需要懂扑克参数。
// 2. 每个维度都必须真实改变牌局行为,由 tests/ai-eval 的场景统计证明,
//    不允许纯装饰属性。
// 3. 战术参数的默认值 = 旧版 AI 行为,是老回归场景的锚。

export const TRAITS = ['武勇', '智谋', '诈术', '胆识', '耐性', '心性'];

// 六维语义(0..100,50 为常人):
//   武勇 —— 进攻欲与价值打薄的幅度(打得凶、价值敢打)
//   智谋 —— 读人、连环诈唬、借题发挥、慢打的谋略含量
//   诈术 —— 诈唬频率、半诈唬选择、破绽作假概率
//   胆识 —— 抗压:边缘牌遭遇重压时不弃牌的骨气
//   耐性 —— 慢打埋伏与跟注火候(等得起、跟得住)
//   心性 —— 情绪稳定度;高者不动如山,低者一激就着

const T = (traits, k) => Math.max(0, Math.min(100, Number(traits[k] ?? 50) || 0));
const c01 = v => Math.max(0, Math.min(1, v));

// 难度评分(0..100):供地图强度匹配;eval 证明它与真实期望收益同向
export function estimateDifficulty(traits = {}) {
  return Math.round(
    T(traits, '武勇') * 0.20 + T(traits, '智谋') * 0.30 + T(traits, '诈术') * 0.15 +
    T(traits, '胆识') * 0.10 + T(traits, '耐性') * 0.15 + T(traits, '心性') * 0.10
  );
}

// 六维 → 完整牌局人格(纯函数,公式即文档)
export function makePersona(traits = {}) {
  const wu = T(traits, '武勇'), zhi = T(traits, '智谋'), zha = T(traits, '诈术');
  const dan = T(traits, '胆识'), nai = T(traits, '耐性'), xin = T(traits, '心性');
  return {
    traits: { 武勇: wu, 智谋: zhi, 诈术: zha, 胆识: dan, 耐性: nai, 心性: xin },
    ai: {
      aggr: 0.35 + wu * 0.009,                                  // 主动进攻
      bluff: 0.02 + zha * 0.003,                                // 诈唬频率
      semi: c01(zha * 0.006 + zhi * 0.004),                     // 半诈唬选择(听牌优先)
      trap: Math.max(0, (nai - 40) * 0.012) + zhi * 0.001,      // 慢打埋伏
      read: zhi / 100,                                          // 读人权重
      callBias: 0.005 + nai * 0.0007,                           // 跟注火候(正=爱跟)
      courage: 0.15 + dan * 0.008,                              // 抗压
      plan: (zhi / 100) * 0.85 * (0.5 + zha * 0.005),           // 连环诈唬
      scare: Math.max(0, (zhi - 30) * 0.008) + zha * 0.002,     // 借题发挥
      valueMin: 0.86 - wu * 0.0006 - zha * 0.0002,              // 价值加注阈值
      moraleSens: 1 - xin / 100,                                // 士气敏感度
      moraleStyle: xin >= 65 ? 'steady' : wu >= zhi ? 'rage' : 'sulk', // 受挫反应
    },
    tauntMult: xin >= 80 ? 0 : xin <= 25 ? 2 : 1,               // 激将相性
    lieChance: 0.05 + zha * 0.002,                              // 破绽作假概率
    difficulty: estimateDifficulty(traits),
  };
}

// 属性语义分档(供图鉴/剧本 UI 展示,也是映射表的「可解读」出口)
const BANDS = {
  武勇: [[80, '万夫不当'], [60, '骁勇'], [40, '稳健'], [0, '保守']],
  智谋: [[80, '神机妙算'], [60, '多谋'], [40, '有识'], [0, '少谋']],
  诈术: [[80, '诡道百出'], [60, '善诈'], [40, '有诈'], [0, '光明磊落']],
  胆识: [[80, '胆大包天'], [60, '果敢'], [40, '持重'], [0, '怯懦']],
  耐性: [[80, '坚如磐石'], [60, '能忍'], [40, '常人'], [0, '急躁']],
  心性: [[80, '不动如山'], [60, '沉稳'], [40, '常人'], [0, '易燃易爆']],
};
export function describeTraits(traits = {}) {
  return TRAITS.map(trait => {
    const value = T(traits, trait);
    const label = BANDS[trait].find(([min]) => value >= min)[1];
    return { trait, value, label };
  });
}
