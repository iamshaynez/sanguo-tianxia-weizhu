// portrait.js —— 本地《三国志9》头像，供入场卡与观阵录共用。
export const PORTRAITS = {
  default: { file: 'No_670.jpg', name: '文官' },
  soldier: { file: 'No_671.jpg', name: '士兵' },
  commander: { file: 'No_687.jpg', name: '新武将' },
  lvbu: { file: 'No_004.jpg', name: '吕布' },
  huaxiong: { file: 'No_009.jpg', name: '华雄' },
  dongzhuo: { file: 'No_069.jpg', name: '董卓' },
  jiling: { file: 'No_156.jpg', name: '纪灵' },
  zhangxiu: { file: 'No_161.jpg', name: '张绣' },
  caocao: { file: 'No_061.jpg', name: '曹操' },
  yuanshao: { file: 'No_006.jpg', name: '袁绍' },
  zhuge: { file: 'No_046.jpg', name: '诸葛亮' },
  xiahoudun: { file: 'No_008.jpg', name: '夏侯惇' },
  zhangzhao: { file: 'No_103.jpg', name: '张昭' },
  zhouyu: { file: 'No_092.jpg', name: '周瑜' },
  zhangren: { file: 'No_219.jpg', name: '张任' },
  xiahouyuan: { file: 'No_007.jpg', name: '夏侯渊' },
  yujin: { file: 'No_077.jpg', name: '于禁' },
  lvmeng: { file: 'No_031.jpg', name: '吕蒙' },
  luxun: { file: 'No_118.jpg', name: '陆逊' },
  menghuo: { file: 'No_030.jpg', name: '孟获' },
  caozhen: { file: 'No_099.jpg', name: '曹真' },
  zhanghe: { file: 'No_026.jpg', name: '张郃' },
  simayi: { file: 'No_050.jpg', name: '司马懿' },
  dengai: { file: 'No_127.jpg', name: '邓艾' },
  simayan: { file: 'No_210.jpg', name: '司马炎' },
};

export function portraitImage(key = 'default', className = '') {
  const skinKey = PORTRAITS[key] ? key : 'default';
  const portrait = PORTRAITS[skinKey];
  return `<img class="portrait-img ${className}" data-skin="${skinKey}" src="./assets/portraits/san9/${portrait.file}" alt="${portrait.name}" draggable="false">`;
}
