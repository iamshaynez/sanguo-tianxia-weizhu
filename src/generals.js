// generals.js —— 武将档案库:姓名只是入口,牌风才是本人
// 每条档案:tells 签名破绽(强/弱) / barks 台词(开场/被激/暴怒/得意/爆冷/免疫) / skin 造型键 / bio 小传
// 章节以 boss.gen 引用;境遇变化只改属性包,档案复用。配方由 chapters.lint.mjs 把守。

export const GENERALS = {
  lvbu: {
    name: '吕布', skin: 'lvbu', bio: '天下第一,不肯低头。',
    tells: { strong: '画戟横于膝上,指节发白', weak: '赤兔不安地刨蹄' },
    barks: {
      open: '天下无双,吕奉先!',
      taunt: '你说谁是三姓家奴?!',
      tilt: '方天画戟,取你首级!',
      smug: '还有谁?!',
      badbeat: '不可能……不可能!',
    },
  },
  huaxiong: {
    name: '华雄', skin: 'huaxiong', bio: '温酒未寒时的那个人。',
    tells: { strong: '按刀而立,纹丝不动', weak: '频频回望关门' },
    barks: {
      open: '华雄在此,谁敢出战!',
      taunt: '找死!',
      tilt: '斩了你祭旗!',
      smug: '诸侯不过如此。',
      badbeat: '怎会……',
    },
  },
  dongzhuo: {
    name: '董卓', skin: 'dongzhuo', bio: '郿坞深池,酒池肉林。',
    tells: { strong: '抚腹大笑,冠缨乱颤', weak: '肥硕的手捂住钱袋' },
    barks: {
      open: '咱家说了算。',
      taunt: '拖出去!',
      tilt: '咱家要你的命!',
      smug: '顺咱者昌。',
      badbeat: '奉先……何在?',
    },
  },
  jiling: {
    name: '纪灵', skin: 'jiling', bio: '袁术头号打手。',
    tells: { strong: '大刀顿地,声如闷雷', weak: '眼神瞟向自家营门' },
    barks: {
      open: '袁公路麾下,纪灵!',
      taunt: '放肆!',
      tilt: '拿下!',
      smug: '识相。',
      badbeat: '主公……',
    },
  },
  zhangxiu: {
    name: '张绣', skin: 'zhangxiu', bio: '北地枪王,降而复叛。',
    tells: { strong: '枪尖垂地,稳如磐石', weak: '舔了舔干裂的唇' },
    barks: {
      open: '宛城张绣,领教。',
      taunt: '你!',
      tilt: '杀!',
      smug: '这一枪,二十年的功夫。',
      badbeat: '文和,我错了……',
    },
  },
  caocao: {
    name: '曹操', skin: 'caocao', bio: '治世能臣,乱世奸雄。',
    tells: { strong: '横槊赋诗,旁若无人', weak: '抚须沉吟,目光游移' },
    barks: {
      open: '对酒当歌,人生几何。',
      taunt: '哦?',
      tilt: '孤……失态了。',
      smug: '宁教我负天下人。',
      badbeat: '……呵呵,有意思。',
    },
  },
  yuanshao: {
    name: '袁绍', skin: 'yuanshao', bio: '四世三公,色厉内荏。',
    tells: { strong: '四世三公,腰板笔直', weak: '不停地看向左右' },
    barks: {
      open: '四世三公,袁本初。',
      taunt: '放肆!',
      tilt: '来人!……罢了。',
      smug: '天命在袁。',
      badbeat: '岂有此理……',
    },
  },
  zhuge: {
    name: '诸葛亮', skin: 'zhuge', bio: '卧龙。',
    tells: { strong: '羽扇轻摇,不急不缓', weak: '扇面停了一瞬' },
    barks: {
      open: '亮,躬耕南阳一布衣。',
      taunt: '(摇扇,笑而不语)',
      tilt: '……亮,失态了。',
      smug: '略懂,略懂。',
      badbeat: '天不助我……',
    },
  },
  xiahoudun: {
    name: '夏侯惇', skin: 'xiahoudun', bio: '拔矢啖睛的独目将军。',
    tells: { strong: '独目如电,一瞬不瞬', weak: '独目避开了你' },
    barks: {
      open: '夏侯惇在此!',
      taunt: '找死!',
      tilt: '拔矢啖睛,何惧你!',
      smug: '元让未尝一败。',
      badbeat: '左眼……又痛了。',
    },
  },
  zhangzhao: {
    name: '张昭', skin: 'zhangzhao', bio: '江东文胆。',
    tells: { strong: '正襟危坐,引经据典', weak: '袖中的手在抖' },
    barks: {
      open: '江东张昭,有一问。',
      taunt: '竖子无礼!',
      tilt: '你、你……',
      smug: '理在我江东。',
      badbeat: '老朽……失言。',
    },
  },
  zhouyu: {
    name: '周瑜', skin: 'zhouyu', bio: '江东周郎,才情与火气并盛。',
    tells: { strong: '抚琴的手按住了剑', weak: '箭疮隐隐作痛' },
    barks: {
      open: '曲有误,周郎顾。',
      taunt: '你说什么?!',
      tilt: '既生瑜——!',
      smug: '谈笑间,樯橹灰飞烟灭。',
      badbeat: '怎么可能!',
    },
  },
  zhangren: {
    name: '张任', skin: 'zhangren', bio: '西川第一忠勇。',
    tells: { strong: '弓已满弦,纹丝不动', weak: '瞥了一眼落凤坡' },
    barks: {
      open: '张任,守土有责。',
      taunt: '休想!',
      tilt: '放箭!',
      smug: '雒城固若金汤。',
      badbeat: '坡上的伏兵……',
    },
  },
  xiahouyuan: {
    name: '夏侯渊', skin: 'xiahouyuan', bio: '兵贵神速,性如烈火。',
    tells: { strong: '虎步碾地,跃跃欲试', weak: '频频催促快些发牌' },
    barks: {
      open: '夏侯渊,速战速决!',
      taunt: '少废话!',
      tilt: '纳命来!',
      smug: '兵贵神速。',
      badbeat: '太快了……是我太快了。',
    },
  },
  yujin: {
    name: '于禁', skin: 'yujin', bio: '泰山之稳,晚节之痛。',
    tells: { strong: '军阵严整,呼吸不乱', weak: '望了一眼低洼处' },
    barks: {
      open: '于禁,奉令行事。',
      taunt: '……',
      tilt: '休得放肆!',
      smug: '军令如山。',
      badbeat: '水……水涨了吗?',
    },
  },
  lvmeng: {
    name: '吕蒙', skin: 'lvmeng', bio: '白衣渡江,刮目相看。',
    tells: { strong: '白衣执卷,气定神闲', weak: '咳嗽声压得很低' },
    barks: {
      open: '吕蒙,士别三日。',
      taunt: '(微笑)',
      tilt: '……失礼了。',
      smug: '刮目相看。',
      badbeat: '荆州……可惜了。',
    },
  },
  luxun: {
    name: '陆逊', skin: 'luxun', bio: '儒生都督,火烧连营。',
    tells: { strong: '负手观火,岿然不动', weak: '袖中掐算,迟迟不决' },
    barks: {
      open: '陆逊,请指教。',
      taunt: '(拱手一笑)',
      tilt: '……逊,失态。',
      smug: '火烧连营,不过如此。',
      badbeat: '这一局,算错了。',
    },
  },
  menghuo: {
    name: '孟获', skin: 'menghuo', bio: '七擒七纵的南王。',
    tells: { strong: '拍案而起,碗盏乱跳', weak: '挠头,嘿嘿干笑' },
    barks: {
      open: '南王孟获!',
      taunt: '不服!',
      tilt: '再打过!',
      smug: '南中无敌!',
      badbeat: '……服了。',
    },
  },
  caozhen: {
    name: '曹真', skin: 'caozhen', bio: '曹魏宗室名将。',
    tells: { strong: '按剑正坐,不动如山', weak: '挪动了一下坐姿' },
    barks: {
      open: '曹真,督诸军。',
      taunt: '哼。',
      tilt: '出战!',
      smug: '魏军威武。',
      badbeat: '孔明……果然。',
    },
  },
  zhanghe: {
    name: '张郃', skin: 'zhanghe', bio: '巧变善战的名将。',
    tells: { strong: '坐姿前倾,如狐伺兔', weak: '后退半步,重新打量你' },
    barks: {
      open: '张郃,请。',
      taunt: '哦?',
      tilt: '击破他们!',
      smug: '兵无常势。',
      badbeat: '街亭之后,再无退路……',
    },
  },
  simayi: {
    name: '司马懿', skin: 'simayi', bio: '冢虎。耗得起的,都赢了。',
    tells: { strong: '闭目养神,呼吸绵长', weak: '指节叩桌,三短一长' },
    barks: {
      open: '(闭目)……请发牌。',
      taunt: '(微笑,不为所动)',
      tilt: '……',
      smug: '(嘴角微动)',
      badbeat: '……无妨。',
    },
  },
  dengai: {
    name: '邓艾', skin: 'dengai', bio: '偷渡阴平的口吃将军。',
    tells: { strong: '口吃,目光却如炬', weak: '搓着衣角,结巴得更厉害' },
    barks: {
      open: '邓、邓艾,请战。',
      taunt: '你、你……',
      tilt: '放、放马过来!',
      smug: '险、险中求胜。',
      badbeat: '阴平……太险了。',
    },
  },
  simayan: {
    name: '司马炎', skin: 'simayan', bio: '三分归一的晋武帝。',
    tells: { strong: '冕旒不动,居高临下', weak: '频频看向殿外' },
    barks: {
      open: '朕,司马炎。',
      taunt: '大胆!',
      tilt: '拖下去!',
      smug: '天下归晋。',
      badbeat: '朕的江山……',
    },
  },
};

export const getGeneral = id => (id ? GENERALS[id] || null : null);
