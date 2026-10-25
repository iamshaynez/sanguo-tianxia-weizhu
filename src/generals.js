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
  liubei: {
    name: '刘备', skin: 'liubei', bio: '屡败屡起，最懂人心未凉。',
    tells: { strong: '双剑并放，眉目温和', weak: '袖中拇指反复摩挲' },
    barks: { open: '备，愿与君同行。', taunt: '备并非无怒，只是不轻怒。', tilt: '莫非天意如此!', smug: '仁义并非退让。', badbeat: '败了，便再来。' },
  },
  guanyu: {
    name: '关羽', skin: 'guanyu', bio: '青龙偃月，一诺重于千钧。',
    tells: { strong: '丹凤眼微睁，抚须不语', weak: '刀尖向下一垂' },
    barks: { open: '关某，领教。', taunt: '多言无益。', tilt: '鼠辈，安敢如此!', smug: '义之所至，何惧之有。', badbeat: '这一局，关某记下了。' },
  },
  zhangfei: {
    name: '张飞', skin: 'zhangfei', bio: '豹头环眼，粗中亦有细。',
    tells: { strong: '环眼圆睁，向前倾身', weak: '摸起酒碗又放下' },
    barks: { open: '燕人张飞在此!', taunt: '你再说一遍?!', tilt: '俺要掀了这桌!', smug: '痛快，再来!', badbeat: '俺偏不信这个邪!' },
  },
  chengong: {
    name: '陈宫', skin: 'chengong', bio: '谋士所争，常是主公一念。',
    tells: { strong: '合袖正坐，目光不移', weak: '望向城图一角' },
    barks: { open: '陈宫，有一策。', taunt: '激我无益。', tilt: '竖子不足与谋!', smug: '此局尚可挽回。', badbeat: '明公……仍不肯听吗?' },
  },
  zhaoyun: {
    name: '赵云', skin: 'zhaoyun', bio: '一身是胆，长坂护主。',
    tells: { strong: '枪锋收在身后，呼吸绵长', weak: '护住怀中襁褓' },
    barks: { open: '常山赵子龙，请战。', taunt: '云并无惧意。', tilt: '挡我者，让开!', smug: '进退自如。', badbeat: '少主尚在，云不能退。' },
  },
  dianwei: {
    name: '典韦', skin: 'dianwei', bio: '双戟在手，营门便在。',
    tells: { strong: '双戟顿地，寸步不退', weak: '回头望了一眼营门' },
    barks: { open: '典韦在此，谁也别想过。', taunt: '找死!', tilt: '先问过我的双戟!', smug: '营门无恙。', badbeat: '主公……可曾走远?' },
  },
  diaochan: {
    name: '貂蝉', skin: 'diaochan', bio: '连环计中，最自由的一步。',
    tells: { strong: '眼波未动，笑意不减', weak: '指尖掠过袖中短刃' },
    barks: { open: '诸位，何必急着相看两厌。', taunt: '将军也只会说狠话吗?', tilt: '你们都不肯听我说。', smug: '局中人，未必知局。', badbeat: '原来我也不在计外。' },
  },
  sunquan: {
    name: '孙权', skin: 'sunquan', bio: '坐断东南，善择人和。',
    tells: { strong: '按剑听潮，不置一词', weak: '反复权衡左右神色' },
    barks: { open: '江东孙权，愿闻高见。', taunt: '仲谋自有决断。', tilt: '欺人太甚!', smug: '江东不可轻侮。', badbeat: '再议，再议。' },
  },
  lusu: {
    name: '鲁肃', skin: 'lusu', bio: '榻上之策，厚道亦有锋。',
    tells: { strong: '拱手微笑，言辞笃定', weak: '欲言又止，望向江北' },
    barks: { open: '鲁肃，愿两家都好。', taunt: '足下何必如此。', tilt: '肃也要争一回!', smug: '和并非让。', badbeat: '是肃看漏了一层。' },
  },
  pangtong: {
    name: '庞统', skin: 'pangtong', bio: '凤雏不栖枯枝。',
    tells: { strong: '负手大笑，目光犀利', weak: '咳嗽一声，避开坡名' },
    barks: { open: '庞士元，献丑了。', taunt: '你且说说谁不中用。', tilt: '竖子安敢轻我!', smug: '小计而已。', badbeat: '落凤……果然不吉。' },
  },
  huangzhong: {
    name: '黄忠', skin: 'huangzhong', bio: '老将开弓，不服春秋。',
    tells: { strong: '弓满如月，臂不摇', weak: '揉了揉右肩' },
    barks: { open: '老将黄忠，请战!', taunt: '谁敢说我老!', tilt: '看我再开一石弓!', smug: '尚能饭否?能!', badbeat: '这一刀，慢了吗?' },
  },
  masuo: {
    name: '马谡', skin: 'masuo', bio: '纸上兵势，山上孤寨。',
    tells: { strong: '谈兵不止，手指山河', weak: '反复寻找水源' },
    barks: { open: '马幼常，早已胸有成竹。', taunt: '你懂什么兵法!', tilt: '我之计绝无疏漏!', smug: '居高临下，势如破竹。', badbeat: '丞相……谡错了。' },
  },
  wangping: {
    name: '王平', skin: 'wangping', bio: '沉实善守，知何时进。',
    tells: { strong: '阵列齐整，呼吸沉稳', weak: '低声清点水源' },
    barks: { open: '王平，奉令守此。', taunt: '守好自己再说。', tilt: '不可乱了阵脚!', smug: '稳，也是胜。', badbeat: '终究没能劝住。' },
  },
  jiangwei: {
    name: '姜维', skin: 'jiangwei', bio: '幼麟继志，锐气未折。',
    tells: { strong: '挺枪直视，神采逼人', weak: '短暂望向汉中' },
    barks: { open: '天水姜伯约，请赐教。', taunt: '再来便是。', tilt: '维宁死不退!', smug: '此志尚可继。', badbeat: '丞相……维有愧。' },
  },
  caoshuang: {
    name: '曹爽', skin: 'caoshuang', bio: '权柄在手，疑心在门。',
    tells: { strong: '凭几而坐，号令随意', weak: '频频探问府外' },
    barks: { open: '大将军面前，还不行礼。', taunt: '你也配激我?', tilt: '调兵!快调兵!', smug: '魏室尽在我手。', badbeat: '仲达竟真敢……' },
  },
  yufan: {
    name: '虞翻', skin: 'yufan', bio: '江东直士，话里藏针。',
    tells: { strong: '拂袖反问，声调愈高', weak: '捻须停顿片刻' },
    barks: { open: '虞仲翔，有一问。', taunt: '狂生无礼!', tilt: '你休要强辩!', smug: '理屈词穷了吧。', badbeat: '是翻失言了。' },
  },
  luji: {
    name: '陆绩', skin: 'luji', bio: '陆郎怀橘，少年有锋。',
    tells: { strong: '正襟反问，寸步不让', weak: '看向案上橘核' },
    barks: { open: '陆公纪，愿闻其详。', taunt: '莫欺我年少!', tilt: '你此话不通!', smug: '此问已答。', badbeat: '绩，受教了。' },
  },
  kongxiu: {
    name: '孔秀', skin: 'commander', bio: '东岭守将，一关亦一诺。',
    tells: { strong: '横刀关上，脚跟不动', weak: '回望身后印信' },
    barks: { open: '东岭孔秀，验文过关。', taunt: '你敢闯关!', tilt: '关门落锁!', smug: '无令莫行。', badbeat: '关某之名，不假。' },
  },
  hanfu: {
    name: '韩福', skin: 'commander', bio: '洛阳关吏，刀快心虚。',
    tells: { strong: '拔刀抢先，声势逼人', weak: '频繁擦拭掌心' },
    barks: { open: '韩福在此，留下文凭。', taunt: '找死!', tilt: '放箭，快放箭!', smug: '此关难越。', badbeat: '我怎敢拦他……' },
  },
  bianxi: {
    name: '卞喜', skin: 'bianxi', bio: '镇国寺僧，袈裟藏刃。',
    tells: { strong: '合十低眉，气息沉稳', weak: '袖中刀环轻响' },
    barks: { open: '镇国寺一叙，如何?', taunt: '佛也渡不得你。', tilt: '动手!', smug: '此地清静。', badbeat: '刀藏在佛前，也瞒不过他。' },
  },
  wangzhi: {
    name: '王植', skin: 'commander', bio: '荥阳太守，笑里设局。',
    tells: { strong: '笑容不改，杯盏极稳', weak: '瞥向廊下伏兵' },
    barks: { open: '王植备了薄酒。', taunt: '莫给脸不要脸。', tilt: '放火!', smug: '入我彀中矣。', badbeat: '这一局，反被你看破。' },
  },
  qinqi: {
    name: '秦琪', skin: 'commander', bio: '黄河渡口，最后一声喝。',
    tells: { strong: '横刀立马，目光直迫', weak: '握缰的手收紧' },
    barks: { open: '秦琪守渡，来者止步。', taunt: '你敢小瞧我!', tilt: '渡口封死!', smug: '插翅难飞。', badbeat: '黄河，也拦不住你。' },
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
