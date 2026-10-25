export const SCROLL_3_STORIES = {
  shezhan: {
    cast: ['zhangzhao', 'yufan', 'luji', 'zhuge', 'sunquan'],
    objective: '拆穿“降曹保江东”的退路，让孙权听见群臣没有说出口的恐惧。',
    coldOpen: [
      { speaker: 'narrator', text: '议事厅里摆着四张案，三张堆满经书，唯独你的案上只有一柄羽扇。张昭先问刘备几败，虞翻已替你把“丧家”二字写在唇边。' },
      { speaker: 'zhangzhao', text: '曹公拥百万之众，先生以何御之？莫把隆中一对，当作救命符。' },
      { speaker: 'sunquan', text: '先生，孤要听的不是谁的经熟，是谁敢担江东的明日。' },
      { speaker: 'zhuge', text: '隆中你问的是天下，今日他们问的是输赢。别答反了。' },
    ],
    intros: {
      zhangzhao: [
        { when: 'seen:zhangzhao', bio: '他记得你上次怎样拆题，这次先把每部经典都摆成了盾。', quote: '典故可以重引。先生，败绩也能重答么？' },
        { bio: '江东文胆，以经典为城，以主和为最后一道门。', quote: '先不论兵。刘豫州屡败，可是事实？' },
      ],
      yufan: [{ bio: '他的话不绕弯，专挑对手最狼狈的地方落刃。', quote: '避难的人，也敢来谈救人？' }],
      luji: [{ bio: '他把名分说得端正，袖中却藏着不敢独担的降书。', quote: '抗曹之前，先答我何谓汉臣。' }],
    },
    map: [{
      id: 'three-questions', node: 1, title: '馆驿 · 三问同锁',
      lines: [
        { speaker: 'yufan', text: '张公问强弱，陆公问名分。我只问你：败到夏口的人，凭什么谈救别人？' },
        { speaker: 'luji', text: '曹丞相奉天子以令不臣。你要抗的，究竟是曹军，还是朝廷？' },
        { speaker: 'you', text: '三道题共用一把锁：先让我承认，自己已经输了。' },
      ],
      choices: [
        { id: 'ask-burden', text: '追问“降后谁担江东”', detail: '看破提升，记住共同前提', effects: { keenEye: true, fact: 'shezhan_common_fear' } },
        { id: 'sign-surrender', text: '请主和者各写一个降字', detail: '众儒起手士气 -1，记住署名', effects: { sow: 1, fact: 'shezhan_signed' } },
      ],
    }],
    battle: [
      { id: 'shezhan-open-multi', at: 'start', speaker: 'zhangzhao', when: 'multi', text: '我们三人依次问。先生若有一处语塞，便不必再谈抗曹。' },
      { id: 'shezhan-open-single', at: 'start', speaker: 'zhangzhao', when: 'single', text: '曹操之强，史书可查。先生要拿主公性命，替自己立名么？' },
      { id: 'shezhan-defeats', at: 'hand:2', speaker: 'yufan', text: '你莫绕。刘豫州一败再败，难道不是事实？' },
      { id: 'shezhan-name', at: 'hand:3', speaker: 'luji', text: '汉室倾颓，正需识时务者。你连名分都不顾，还谈什么兴复？' },
      { id: 'shezhan-low-fear', at: 'low', speaker: 'you', when: 'fact:shezhan_common_fear', text: '你们说江东不可赌，原来是怕自己的名字留在抗曹那一页。' },
      { id: 'shezhan-low-sign', at: 'low', speaker: 'zhuge', when: 'fact:shezhan_signed', text: '他们不肯独书一个降字，却敢替万民同写。子布，这算谁的江东？' },
    ],
    win: {
      text: '孙权将案上的“降”字翻扣，命人取来战图。张昭没有再问曹操有多少兵，只问江东还有多少可战之船。群臣仍有异议，却再不能把主和说成一个不必负责的答案。',
      hook: '鲁肃已在江边备船。诸葛亮尚需十万支箭，而曹操的箭，比江东的耐心多。',
    },
    loss: {
      text: '你逐条答完了典故，却没让他们承认惧意。孙权只听见一场争吵，没听见谁愿意承担抗曹的后果。',
      clue: '史鉴 · 群儒会轮流转问，把争胜变成消耗；先拆共同前提，重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  caochuan: {
    cast: ['zhuge', 'lusu', 'caocao'],
    objective: '在雾散前让曹军自己决定放箭，把曹操的多疑借成江东的军需。',
    coldOpen: [
      { speaker: 'narrator', text: '第三更，鲁肃摸着船上的稻草人，终于明白诸葛亮要借的不只是箭，还有曹操不敢出兵的那一颗心。' },
      { speaker: 'lusu', text: '若雾突然散了呢？子敬可以陪你冒险，江东不能陪你陪葬。' },
      { speaker: 'zhuge', text: '堂上既已请江东主战，箭便不能只在账上。子敬，这一船是还愿，不是赌命。' },
      { speaker: 'you', text: '雾只负责遮船。让曹操看见什么，还得由我们来说。' },
    ],
    intros: {
      caocao: [
        { when: 'page:zhujiu:yeshi', bio: '他在青梅亭读过你的藏锋，如今更不信江上的每一次试探。', quote: '青梅旧友，也学会借雾藏锋了？' },
        { bio: '北岸水寨，他把每一声鼓都当成一句没说完的谎话。', quote: '雾夜来船，必有深意。先莫出击。' },
      ],
    },
    map: [{
      id: 'fog-cadence', node: 1, title: '江雾 · 留白令敌',
      lines: [
        { speaker: 'lusu', text: '箭垛、船只、更次都齐了，只差曹操肯不肯。若他看出是草人呢？' },
        { speaker: 'zhuge', text: '所以不能只让他看不清。要让他觉得，自己看得比我们更远。' },
        { speaker: 'you', text: '雾遮住船，鼓声替他补出一支伏兵。' },
      ],
      choices: [
        { id: 'full-drums', text: '二十船同擂，假装主力', detail: '曹军起手士气 -1，记住鼓阵', effects: { sow: 1, fact: 'caochuan_full_drums' } },
        { id: 'answering-drums', text: '首尾应鼓，留出空船', detail: '看破提升，记住雾中留白', effects: { keenEye: true, fact: 'caochuan_empty_space' } },
      ],
    }],
    battle: [
      { id: 'caochuan-open', at: 'start', speaker: 'caocao', text: '水寨不出，弓弩向前。孤倒要看，雾里藏了多少人。' },
      { id: 'caochuan-drums', at: 'hand:2', speaker: 'zhuge', when: 'fact:caochuan_full_drums', text: '现在撤下一半鼓。曹操听见势弱，反会认定我们开始收网。' },
      { id: 'caochuan-space', at: 'hand:2', speaker: 'lusu', when: 'fact:caochuan_empty_space', text: '空船转到外舷了。曹操不看鼓声最密处，偏要猜最静的地方。' },
      { id: 'caochuan-more-arrows', at: 'hand:3', speaker: 'caocao', text: '鼓声虚了。莫追，添箭——他们若退，便是有诈。' },
      { id: 'caochuan-low', at: 'low', speaker: 'you', text: '箭不是骗来的，是他替自己心里的伏兵预备的。' },
    ],
    win: {
      text: '雾散时，各船草人都已满箭。鲁肃不再问若雾早退怎么办，只忙着催人报数；诸葛亮折下一枚簇尖收进袖中。箭已够用，下一页要借的是火。',
      hook: '箭已备，东风未至。周瑜在赤壁等你，也等诸葛亮露出一丝来不及。',
    },
    loss: {
      text: '雾未散，曹操先停了箭。你把多疑当成一道不会更改的命令，忘了多疑的人最擅长改主意；鲁肃只好带你退回空船。',
      clue: '史鉴 · 曹操会根据鼓声重新判断虚实；别把同一种试探用到底，重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  chibi: {
    cast: ['caocao', 'zhouyu', 'zhuge'],
    objective: '在三方各怀胜负的牌局里，让火船、东南风与曹操的疑心同时到位。',
    coldOpen: [
      { speaker: 'narrator', text: '曹操的连舫在北，周瑜的火船在南，诸葛亮的七星坛夹在两者之间。三方同桌，却没有任何两人的胜利完全相同。' },
      { speaker: 'caocao', text: '连舫稳如平地。孤倒要听听，东吴还能拿什么来烧。' },
      { speaker: 'zhouyu', text: '孔明若借不来风，火攻便止；你若只赢他，曹操照样过江。' },
      { speaker: 'zhuge', text: '所以这一局没有盟友。只有谁先看见，风已在谁的袖中。' },
    ],
    intros: {
      caocao: [
        { when: 'page:zhujiu:yeshi', bio: '从青梅到赤壁，他仍想逼你把藏住的答案押上桌面。', quote: '煮酒能藏雷，今日烈火往哪里藏？' },
        { bio: '八十万连舫，他要北方从此不必再懂水战。', quote: '船已相连，江上也是孤的中原。' },
      ],
      zhouyu: [
        { when: 'page:caochuan:yeshi', bio: '他看见十万支箭如约而至，更不肯让孔明独占赤壁。', quote: '箭你借到了。火，还得听我的。' },
        { bio: '他的火攻万事俱备，唯独不愿承认自己也在等风。', quote: '曲有误，周郎顾；风若误呢？' },
      ],
      zhuge: [
        { when: 'seen:zhuge', bio: '他记得隆中的天下，也记得你怎样把一场对话变成战局。', quote: '今日不论谁先胜，先论风何时起。' },
        { bio: '七星坛上，他把最难借的东西说得像已经入袖。', quote: '风会来。人未必肯等。' },
      ],
    },
    map: [{
      id: 'three-fuses', node: 1, title: '乌林 · 三方引信',
      lines: [
        { speaker: 'zhouyu', text: '火船只能烧一次。孔明先离场，风未必来；孟德先离场，他会带走主力。' },
        { speaker: 'caocao', text: '你们都等风。孤已把船锁在一起，风来，也不过多照几处灯火。' },
        { speaker: 'you', text: '要赢的不是三份筹码，是让三个人都不能提前离席。' },
      ],
      choices: [
        { id: 'loose-chain', text: '暗解一节连环索', detail: '曹军起手军资 -200，记住暗索', effects: { raid: true, fact: 'chibi_loose_chain' } },
        { id: 'empty-jars', text: '把火油换成空坛示弱', detail: '看破提升，记住空坛真火', effects: { keenEye: true, fact: 'chibi_empty_jars' } },
      ],
    }],
    battle: [
      { id: 'chibi-open', at: 'start', speaker: 'caocao', when: 'multi', text: '一个借风，一个纵火，一个无名之辈。很好，孤一桌收拾。' },
      { id: 'chibi-read', at: 'hand:2', speaker: 'zhouyu', when: 'multi', text: '先碰孔明，还是先碰我？你每赢一家，另一家都在读你的牌。' },
      { id: 'chibi-chain', at: 'hand:3', speaker: 'zhuge', when: 'fact:chibi_loose_chain', text: '断索让他以为船可散逃。可命令传到各舰之前，火已经替他做了决定。' },
      { id: 'chibi-jars', at: 'hand:3', speaker: 'zhuge', when: 'fact:chibi_empty_jars', text: '空坛不是无火，是让公瑾以为你没有后手。现在，把真火油推出来。' },
      { id: 'chibi-low', at: 'low', speaker: 'you', when: 'multi', text: '曹操怕埋伏，周瑜怕无功，孔明怕风失期。火起的空隙，就在三种恐惧之间。' },
    ],
    win: {
      text: '最后一名对手离席时，东南风才越过旗角。火船借风撞入连舫，周瑜没有看你，诸葛亮却已收扇——两人都明白，你方才留住的不是三份筹码，是同一刻。',
      hook: '曹操败向华容。关羽的刀已等在那里，而诸葛亮说，今夜还欠他一份人情。',
    },
    loss: {
      text: '你先清掉周瑜，曹操便收船；你先压住曹操，诸葛亮便不再等风。赤壁没有败给某一张牌，败给三方从未同时入局。',
      clue: '史鉴 · 多方会彼此读取你的下注，先清一家会给另一家收帆的机会；重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  huarong: {
    cast: ['caocao', 'guanyu', 'zhuge'],
    objective: '赢下穷途之后仍要亲手选择：让旧账随刀落，还是让义成为麦城必须偿还的债。',
    coldOpen: [
      { speaker: 'narrator', text: '曹操的坐骑陷在泥里，身后只剩十几骑。关羽横刀立马，却没看你，也没看那条通往江陵的空路。' },
      { speaker: 'caocao', text: '赤壁能烧连舫，烧不尽旧账。云长，今日这桌上只剩你我了吗？' },
      { speaker: 'guanyu', text: '军令在此，旧恩也在此。关某只问一句：这一刀，你替谁看？' },
      { speaker: 'zhuge', text: '别替他选。你赢下的，只是让选择真的发生。' },
    ],
    intros: {
      caocao: [
        { when: 'page:zhujiu:yeshi', bio: '从青梅到赤壁，他每次穷途都仍记得怎样与你谈旧情。', quote: '青梅酒、连舫火。你我又走到窄路了。' },
        { bio: '败军不足以护驾，他便把昔日恩情也编成了亲军。', quote: '孤今日不讲天下，只讲故人。' },
      ],
      guanyu: [
        { when: 'seen:guanyu', bio: '从虎牢到华容，他的一诺始终比刀更重，也更难放下。', quote: '你已知关某如何出刀。今日且看为何收刀。' },
        { bio: '军令状在怀，旧恩在心，他不肯让任何一笔由旁人代签。', quote: '关某在此。忠与义，都不许借名。' },
      ],
    },
    map: [{
      id: 'two-debts', node: 1, title: '华容 · 刀下两账',
      lines: [
        { speaker: 'caocao', text: '云长杀我，是奉军令；放我，是还旧恩。可你要他替哪一笔担罪？' },
        { speaker: 'guanyu', text: '他把活路说成了两笔债。你听着，像哪一笔？' },
        { speaker: 'you', text: '都不是。刀在活人手里，就不该由死去的情分替今日决定。' },
      ],
      choices: [
        { id: 'weigh-oath', text: '展开军令状，先念军法', detail: '曹军起手士气 -1，记住军令', effects: { sow: 1, fact: 'huarong_oath' } },
        { id: 'weigh-debt', text: '收起军令状，只听旧恩', detail: '看破提升，记住旧恩', effects: { keenEye: true, fact: 'huarong_debt' } },
      ],
    }],
    battle: [
      { id: 'huarong-open', at: 'start', speaker: 'caocao', text: '赤壁你懂得让三家都不能先走。今日只剩你我，反倒难了吧？' },
      { id: 'huarong-oath', at: 'hand:2', speaker: 'guanyu', when: 'fact:huarong_oath', text: '军令我立，罪我领。你若只把军法推给我，仍是让旁人替你落刀。' },
      { id: 'huarong-debt', at: 'hand:2', speaker: 'guanyu', when: 'fact:huarong_debt', text: '恩是关某欠的，命是三军争来的。别拿一个义字，替所有人免单。' },
      { id: 'huarong-unwritten', at: 'hand:3', speaker: 'zhuge', text: '我算到曹操命不该绝，却算不到你怎样选。这一页，终于轮到人胜天一着。' },
      { id: 'huarong-low', at: 'low', speaker: 'you', text: '他已不谈天下，只谈旧情。穷途上的曹操，仍知道什么能当筹码。' },
    ],
    win: {
      text: '曹操的筹码尽散，泥路静得能听见刀环。关羽终于看向你。前方无人阻拦，后方军令犹在；赢牌没有替你写下结局，只把刀落与不落都留成了你的亲手之笔。',
      hook: '这一刀无论落未落，都会沿荆州传到麦城。冬天还远，账已经记下了。',
    },
    loss: {
      text: '曹操仍从泥里走出。你忙着替关羽计算忠义，却忘了他最擅长让别人替他争一个活口。',
      clue: '史鉴 · 穷途曹操会把军令与旧恩轮流推上桌；重开时看破提升，终局选择仍由你作出。',
      clueFx: 'keenEye',
    },
  },

  sanqi: {
    cast: ['zhouyu', 'zhuge', 'lusu', 'liubei'],
    objective: '不再用第三激杀人，而让周瑜在最难堪的一手里看见自己的生路。',
    coldOpen: [
      { speaker: 'narrator', text: '巴丘的药已经煎黑，周瑜却把第三封战书压在琴下。前两气让他失血，第三气却先让他笑了。' },
      { speaker: 'zhouyu', text: '赤壁同桌，你拿风作了引信。今日又想拿什么，点我的箭疮？' },
      { speaker: 'lusu', text: '孔明来书只有四字：何必如此。公瑾看完，便把你的名字写了三遍。' },
      { speaker: 'zhuge', text: '若只想赢他，再激一次就够。若想让他活，得先让他有一次不失态。' },
    ],
    intros: {
      zhouyu: [
        { when: 'page:chibi:yeshi', bio: '赤壁的火赢了曹操，也烧亮了他不肯居于人后的心。', quote: '江上你留住同一刻。巴丘呢，等我先乱？' },
        { bio: '箭疮未愈，他把每一次迟疑都听成了曲误。', quote: '第三封书来了？念。看我还能气几次。' },
      ],
    },
    map: [{
      id: 'third-letter', node: 1, title: '柴桑 · 第三封书',
      lines: [
        { speaker: 'lusu', text: '他认定你每一步都在笑他。你送药，他先找毒；你退兵，他先找伏。' },
        { speaker: 'zhuge', text: '所以第三封书里，我一句也没有辩解。只写了赤壁那一手，他本可怎样赢我。' },
        { speaker: 'you', text: '把胜法还给对手，比把罪名塞给他更难。' },
      ],
      choices: [
        { id: 'write-way-out', text: '在信尾写清他的胜机', detail: '看破提升，记住第三解', effects: { keenEye: true, fact: 'sanqi_way_out' } },
        { id: 'remove-taunts', text: '请鲁肃收走所有激将话', detail: '周瑜起手士气 -1，记住不激', effects: { sow: 1, fact: 'sanqi_no_taunt' } },
      ],
    }],
    battle: [
      { id: 'sanqi-open', at: 'start', speaker: 'zhouyu', text: '你又带着孔明的信来。说罢，这次是哪座城、哪一句既生瑜？' },
      { id: 'sanqi-way-out', at: 'hand:2', speaker: 'zhuge', when: 'fact:sanqi_way_out', text: '看他弃掉好牌的那一手。他不是让你，是在逼自己承认还有下局。' },
      { id: 'sanqi-no-taunt', at: 'hand:2', speaker: 'lusu', when: 'fact:sanqi_no_taunt', text: '他等你讥讽，你便只报牌。没有人接怒，火便只能烧回他自己。' },
      { id: 'sanqi-silence', at: 'hand:3', speaker: 'zhouyu', text: '你为何不笑？我若连怒都无处落，岂不成了你琴上一根断弦？' },
      { id: 'sanqi-low', at: 'low', speaker: 'you', text: '第三气不必是一句话。让他发现，败也可以不成为笑话。' },
    ],
    win: {
      text: '周瑜没有再喊“既生瑜”。他把那封写着自己胜机的信压在琴上，慢慢弹错一音，又自己笑了一声。鲁肃听见笑声，才敢让医官进帐。',
      hook: '周郎暂离巴丘，入蜀的山路却正向庞统收拢。落凤坡这个地名，诸葛亮看了很久。',
    },
    loss: {
      text: '你把他的失态当作唯一的胜门，第三激终于奏效，也永远关上了所有下局。琴没有断，听琴的人先散了。',
      clue: '史鉴 · 周瑜会等你先出讥讽再反扑；少接他的怒，重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  luofengpo: {
    cast: ['pangtong', 'liubei', 'zhangren'],
    objective: '利用的卢与张任对凤雏的执念，让伏兵射中一个错误的目标。',
    coldOpen: [
      { speaker: 'narrator', text: '落凤坡前，的卢不肯踏过白石道。庞统翻身下马，将缰绳递回刘备手里，忽然问张任要杀的究竟是马，还是人。' },
      { speaker: 'pangtong', text: '孔明来信只说将帅多凶少吉。他连我也一并算了，却忘了伏兵也要先认人。' },
      { speaker: 'liubei', text: '士元，换马本是好意。若这好意正好替你写了死籍呢？' },
      { speaker: 'zhangren', text: '不见的卢，不许放箭。我要刘备，莫伤错了人。' },
    ],
    intros: {
      zhangren: [
        { when: 'seen:zhangren', bio: '他记得伏兵怎样扑空，这一次把每面旗号都问得更细。', quote: '旗号可以换。守土的心，你换不了。' },
        { bio: '西川第一忠勇，谨慎是他守城的墙，也是伏兵的号令。', quote: '白马未现，诸军不得擅发一箭。' },
      ],
    },
    map: [{
      id: 'false-phoenix', node: 1, title: '落凤坡 · 反借伏眼',
      lines: [
        { speaker: 'zhangren', text: '林深，马快。可我伏兵的号令只有一个：白马入坡，万箭齐发。' },
        { speaker: 'pangtong', text: '他要射的是刘备必骑的卢这个成见。地名未必克我，人名却会骗人。' },
        { speaker: 'liubei', text: '那就让这成见，最后一次替我们带路。' },
      ],
      choices: [
        { id: 'horse-decoy', text: '空缰牵的卢走前队', detail: '看破伏兵，记住白马诱饵', effects: { keenEye: true, fact: 'luofengpo_horse_decoy' } },
        { id: 'banner-decoy', text: '以凤翎旗引偏箭雨', detail: '伏兵起手军资 -200，记住假旗', effects: { raid: true, fact: 'luofengpo_banner_decoy' } },
      ],
    }],
    battle: [
      { id: 'luofengpo-open', at: 'start', speaker: 'zhangren', text: '庞统，你若真懂趋吉避凶，便不该走进这座坡。' },
      { id: 'luofengpo-horse', at: 'hand:2', speaker: 'pangtong', when: 'fact:luofengpo_horse_decoy', text: '听，箭都追着的卢去了。张任守的是刘备必骑白马，不是落凤坡。' },
      { id: 'luofengpo-banner', at: 'hand:2', speaker: 'pangtong', when: 'fact:luofengpo_banner_decoy', text: '凤旗向东，伏兵便向东。所谓落凤，也可以由我指定落在哪处。' },
      { id: 'luofengpo-turn', at: 'hand:3', speaker: 'zhangren', text: '白马是假，旗号也是假。你们拿我的谨慎，做了自己的弓。' },
      { id: 'luofengpo-low', at: 'low', speaker: 'liubei', text: '士元，伏兵已乱。今日不换马，换一条他们没写过的路。' },
    ],
    win: {
      text: '箭雨落在空马与假旗之后，庞统从侧坡踏上高处。他没有庆幸地名失效，只在那封“多凶少吉”的信后添了四字：人心亦然。成都的关门，第一次为凤雏露出缝隙。',
      hook: '凤雏入蜀，汉中随之成为下一张必争之牌。定军山上，黄忠正在擦拭一把不肯老的刀。',
    },
    loss: {
      text: '你只顾离开的卢，却仍沿张任预设的山道前行。避开了被认出的马，没有避开被算准的人；第二轮箭雨不再等候号令。',
      clue: '史鉴 · 张任先认旗号再下令，伏兵齐射前有一次错认；重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  dingjunshan: {
    cast: ['huangzhong', 'xiahouyuan', 'zhanghe'],
    objective: '借夏侯渊的快与张郃的变互相牵制，让老将一刀落在两人换防的半拍。',
    coldOpen: [
      { speaker: 'narrator', text: '定军山上下各有一面鼓。夏侯渊催人快攻，张郃却按兵测路；两面鼓总差半拍，黄忠听了三遍，解下了弓。' },
      { speaker: 'huangzhong', text: '他们说老将只剩一刀。够是够，只怕有人快得撞上来，有人巧得不肯来。' },
      { speaker: 'xiahouyuan', text: '年迈还敢居高？天明的鼓未响，我便先上山取你的刀。' },
      { speaker: 'zhanghe', text: '妙才，居高者故意示弱。你若只会快，便正好替他省去诱敌。' },
    ],
    intros: {
      xiahouyuan: [{ bio: '兵贵神速是他的军令，也是别人最容易拨快的那面鼓。', quote: '张郃善变，夏侯善速。你先接哪一个？' }],
      zhanghe: [{ bio: '巧变名将，最会改阵，却未必改得了同袍的急性。', quote: '兵无常势。可惜妙才只认一种快。' }],
      huangzhong: [{ bio: '老将不与人争脚力，只争敌人迈入刀势的那一步。', quote: '老的是年岁，不是这一刀。' }],
    },
    map: [{
      id: 'half-beat', node: 1, title: '定军山 · 换防半拍',
      lines: [
        { speaker: 'zhanghe', text: '我若向左补防，妙才必从右路抢功。你站得越高，他越不肯等我的旗。' },
        { speaker: 'xiahouyuan', text: '等你阵成，黄忠早跑了！速战便是最稳的阵。' },
        { speaker: 'huangzhong', text: '不必盼他们和睦。一快一慢，正好替老朽数刀。' },
      ],
      choices: [
        { id: 'measure-beats', text: '先测两营更鼓，再布刀阵', detail: '看破提升，记住半拍', effects: { keenEye: true, fact: 'dingjunshan_measured_beats' } },
        { id: 'leave-antlers', text: '留一段残破鹿角诱敌抢修', detail: '曹军起手军资 -200，记住假隙', effects: { raid: true, fact: 'dingjunshan_repair_bait' } },
      ],
    }],
    battle: [
      { id: 'dingjunshan-open', at: 'start', speaker: 'xiahouyuan', when: 'multi', text: '张郃你看住侧翼。至于你——接得住我三次快攻，再谈年迈不年迈。' },
      { id: 'dingjunshan-change', at: 'hand:2', speaker: 'zhanghe', when: 'multi', text: '他越催，你越该看我。妙才的刀从正面来，我的阵可从你背后合。' },
      { id: 'dingjunshan-measured', at: 'hand:3', speaker: 'huangzhong', when: 'fact:dingjunshan_measured_beats', text: '你量的不是山，是妙才听见快字以后，不肯回头的那半拍。' },
      { id: 'dingjunshan-bait', at: 'hand:3', speaker: 'huangzhong', when: 'fact:dingjunshan_repair_bait', text: '你补的不是鹿角，是给妙才一条非快不可的理由。现在，等他冲开门。' },
      { id: 'dingjunshan-low', at: 'low', speaker: 'huangzhong', when: 'multi', text: '一个要我快，一个要他慢。老朽只需站在两令之间。' },
    ],
    win: {
      text: '夏侯渊冲进那半拍时，张郃的新阵尚未转身。黄忠没有追第二刀，只把刀背在肩上一横，汉中各营便同时改旗。山上的两面鼓，终于只敲出一个更次。',
      hook: '汉中的胜利把关羽推上威震华夏的高处。沔水秋雨将至，盛名也会成为最醒目的一面旗。',
    },
    loss: {
      text: '夏侯渊的快逼你仓促，张郃的变又封住退路。你等着他们相撞，却先被两种节奏轮流拖走；老将的刀始终没有出鞘。',
      clue: '史鉴 · 两人会交替抢速与变阵，等一方行动后再读另一方；重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  shuiyan: {
    cast: ['guanyu', 'yujin'],
    objective: '蓄水而不恃水，在七军改营前锁住高地与退路，把天时变成军令。',
    coldOpen: [
      { speaker: 'narrator', text: '沔水已经漫过旧界石，于禁仍把营垒排得一线不乱。关羽看了很久，让人撤去一面写着水字的旗。' },
      { speaker: 'guanyu', text: '七军之稳，在令行禁止；七军之险，也在无人敢先违令移营。' },
      { speaker: 'yujin', text: '关云长，天时未必助你。营中粮尚可支十日，你若久等，先乱的是樊城外。' },
      { speaker: 'you', text: '他要等雨停。我不必让雨更早，只要让他舍不得先动。' },
    ],
    intros: {
      yujin: [
        { when: 'seen:yujin', bio: '他记得低洼怎样吞掉军阵，这次仍不肯让一次擅动毁去严名。', quote: '水涨可测。军心，不可先乱。' },
        { bio: '泰山之稳，最信军令，也最晚承认军令已经过时。', quote: '各营听令，无令不得移驻一步。' },
      ],
    },
    map: [{
      id: 'dry-order', node: 1, title: '罾口川 · 水未先攻',
      lines: [
        { speaker: 'yujin', text: '你若决堤，我军便上高处；你若久围，樊城先求援。雨再大，也不能替我下令。' },
        { speaker: 'guanyu', text: '他最需要的不只是高地，还有一道仍允许他守住体面的军令。' },
        { speaker: 'you', text: '那就给他一条看似不必移营的退路。' },
      ],
      choices: [
        { id: 'old-channel', text: '留出旧河道，示弱不封', detail: '看破退路，记住旧河道', effects: { keenEye: true, fact: 'shuiyan_old_channel' } },
        { id: 'highland-stakes', text: '暗桩封住高地渡口', detail: '于禁起手军资 -200，记住暗桩', effects: { raid: true, fact: 'shuiyan_highland_stakes' } },
      ],
    }],
    battle: [
      { id: 'shuiyan-open', at: 'start', speaker: 'yujin', text: '军阵未乱，水便只是水。关羽盛名在外，也不过要等天替他交战。' },
      { id: 'shuiyan-channel', at: 'hand:2', speaker: 'guanyu', when: 'fact:shuiyan_old_channel', text: '旧河道看似能退，其实最浅。于禁不肯弃营，你便把这条稳路走成绝路。' },
      { id: 'shuiyan-stakes', at: 'hand:2', speaker: 'guanyu', when: 'fact:shuiyan_highland_stakes', text: '暗桩已沉。他仍说高地可登，只因还没看见水下那道门已经关了。' },
      { id: 'shuiyan-no-reply', at: 'hand:3', speaker: 'yujin', text: '水位过膝，各军仍不得擅动。等等——传令高地，为何不回报？' },
      { id: 'shuiyan-low', at: 'low', speaker: 'guanyu', text: '水不是刀。令他不能退的是军令如山，水只负责把山淹了。' },
    ],
    win: {
      text: '七军旗帜一面面没入浑水，于禁放下剑时，关羽先命人递去一条干舟，而非绳索。威震华夏的呼声到夜里才起；他却独自回望上游，像已看见盛名之后那条更窄的雪路。',
      hook: '于禁已擒，许都震动。吕蒙却在江东脱下战袍、换上白衣，陆逊把一封极恭顺的信送往荆州。',
    },
    loss: {
      text: '雨终于来了，你却把涨水当成已经获胜。于禁依令退上高地，七军虽湿未乱；关羽的楼船反而被堵在自己准备的河道里。',
      clue: '史鉴 · 水势只压低阵型，不等于封死退路；先夺高地，重开时看破提升。',
      clueFx: 'keenEye',
    },
  },

  maicheng: {
    cast: ['guanyu', 'lvmeng', 'luxun'],
    objective: '拆穿白衣与卑辞共同织成的旧我之局，让关羽不以华容的旧账决定麦城的活路。',
    coldOpen: [
      { speaker: 'narrator', text: '麦城的雪盖住烽火台，吕蒙的白衣与陆逊的绶带一前一后入帐。关羽案上，摆着当年华容留下的一截刀穗。' },
      { speaker: 'guanyu', when: 'choice:huarong:yeshiB', text: '那日刀未落，曹军今日在北按兵。关某放下的义，原来会沿地图回来要账。' },
      { speaker: 'guanyu', when: 'choice:huarong:yeshi', text: '那日刀落，北方诸侯各怀心思，求援的信到临沮便没了下文。恩义清了，路却未宽。' },
      { speaker: 'lvmeng', text: '云长，你最盛时水淹七军；可盟友与旧敌，都从那场水里学会了怎样对付你。' },
    ],
    intros: {
      lvmeng: [
        { when: 'choice:huarong:yeshiB', bio: '他知道你曾放曹操北归，便把这段旧义也算进了求援路。', quote: '你能纵虎，能否走过我留给义气的路？' },
        { when: 'choice:huarong:yeshi', bio: '他记得华容刀落，不再指望旧恩能拖住你的刀。', quote: '你既杀过曹操，便该知道我无旧恩可还。' },
        { bio: '白衣之下不是商贾，是一个把关羽读得太熟的人。', quote: '士别三日。云长，可还认得吕蒙？' },
      ],
      luxun: [
        { when: 'page:sanqi:yeshi', bio: '公瑾因你而活，他却要证明救命之恩改变不了荆州之争。', quote: '你救得公瑾，未必救得荆州。' },
        { bio: '他把恭顺写得越低，麦城四周的网便收得越慢、越紧。', quote: '后生陆逊，特来向威震华夏者请教。' },
      ],
    },
    map: [{
      id: 'old-self-road', node: 1, title: '临沮 · 雪路旧账',
      lines: [
        { speaker: 'lvmeng', text: '我们不必猜关羽会不会降。只要算出他还相信谁，麦城便没有第二扇门。' },
        { speaker: 'guanyu', text: '荆州之失，不在一城一将。是每个人都把旧日的我，当成了今日的路标。' },
        { speaker: 'lvmeng', when: 'choice:huarong:yeshiB', text: '华容刀未落，曹操便欠你一命。可他按兵，是要还情，还是要等吴蜀两伤？' },
        { speaker: 'luxun', when: 'choice:huarong:yeshi', text: '华容刀落，北方自顾不暇。你烧掉一条外援，也烧掉了敌人对你的旧判断。' },
      ],
      choices: [
        { id: 'split-letters', text: '把求援信分送北、西两路', detail: '军资 +150，吕蒙军资 +100，记住分信', effects: { chips: 150, oppChips: 100, fact: 'maicheng_split_letters' } },
        { id: 'burn-letters', text: '烧掉旧信，只带精锐突围', detail: '看破提升，记住焚信', effects: { keenEye: true, fact: 'maicheng_burn_letters' } },
        { id: 'false-beacons', text: '重燃烽燧，假作仍在坚守', detail: '吴军起手军资 -200，记住空烽', effects: { raid: true, fact: 'maicheng_false_beacons' } },
      ],
    }],
    battle: [
      { id: 'maicheng-open', at: 'start', speaker: 'lvmeng', when: 'multi', text: '陆逊让你以为还有时间，我负责让时间走完。云长，该换一种看法了。' },
      { id: 'maicheng-letters', at: 'hand:2', speaker: 'luxun', when: 'multi', text: '你每次求援，我都先替收信人想一遍。等你想通，路已成了我的阵。' },
      { id: 'maicheng-spared', at: 'hand:3', speaker: 'guanyu', when: 'choice:huarong:yeshiB', text: '华容那一放，不是叫曹操今日替我活。关某的义，从不向北国收利。' },
      { id: 'maicheng-slain', at: 'hand:3', speaker: 'guanyu', when: 'choice:huarong:yeshi', text: '华容那一落，关某未曾后悔。今日才懂，杀一人不能杀尽天下的算计。' },
      { id: 'maicheng-zhouyu', at: 'hand:4', speaker: 'lvmeng', when: 'page:sanqi:yeshi', text: '你让公瑾多活十年，却没让江东忘掉荆州。他欠你一命，我不能替他还一城。' },
      { id: 'maicheng-low-split', at: 'low', speaker: 'you', when: 'fact:maicheng_split_letters', text: '分信不是等谁来救，是让吴军不知该堵哪路。援书未至，疑兵已经出城。' },
      { id: 'maicheng-low-burn', at: 'low', speaker: 'you', when: 'fact:maicheng_burn_letters', text: '旧信烧尽，吕蒙只能猜今日的关羽。突围，也要先让旧我消失。' },
      { id: 'maicheng-low-beacon', at: 'low', speaker: 'you', when: 'fact:maicheng_false_beacons', text: '烽火仍亮，吕蒙回头望城的一瞬，雪下小路才不是他算好的那页。' },
    ],
    win: {
      text: '麦城西门在雪停前打开，关羽带残军突出临沮。华容那一刀，无论落过或未落，都没有替今日开门；他把旧刀穗留在雪中，活着的人不再拿旧账抵新命。荆州尚有来路，季汉也尚有一局。',
      hook: '荆州未失，复仇之名却未必会散。夷陵的营火与白帝城的托孤，都在下一卷等你改写。',
    },
    loss: {
      text: '吕蒙算你的旧义，陆逊算你的新断。一个封住求援，一个等你犹豫；雪停时，麦城仍只记住了那个不肯改变的关羽。',
      clue: '史鉴 · 吕蒙与陆逊会分别利用旧恩与退路；重开时看破提升，华容的选择仍会留下不同劝谏。',
      clueFx: 'keenEye',
    },
  },
};
