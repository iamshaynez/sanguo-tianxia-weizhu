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
    cast: ['zhuge', 'lusu', 'caocao', 'caizhong'],
    objective: '在雾散前让曹军自己决定放箭，把曹操的多疑借成江东的军需。',
    coldOpen: [
      { speaker: 'narrator', text: '第三更，鲁肃摸着船上的稻草人，终于明白诸葛亮要借的不只是箭，还有曹操不敢出兵的那一颗心。' },
      { speaker: 'lusu', text: '若雾突然散了呢？子敬可以陪你冒险，江东不能陪你陪葬。' },
      { speaker: 'caizhong', text: '丞相放心,小人兄弟早把江东水路摸熟了——这雾夜里,他们绝不敢出船。', when: '!seen:caizhong' },
      { speaker: 'zhuge', text: '堂上既已请江东主战，箭便不能只在账上。子敬，这一船是还愿，不是赌命。' },
      { speaker: 'you', text: '雾只负责遮船。让曹操看见什么，还得由我们来说。' },
    ],
    intros: {
      caizhong: [
        { when: 'seen:caizhong', bio: '诈降的兄弟档又换了一套装束,口径却仍旧差半拍。', quote: '这、这次弟弟没来。情报,小人一个人包了。' },
        { bio: '蔡夫人族中小子,降书里的每一个字都商量好了,唯独彼此没商量。', quote: '降卒蔡中,愿为丞相效犬马!' },
      ],
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
    cast: ['pangtong', 'liubei', 'zhangren', 'liuzhang'],
    objective: '利用的卢与张任对凤雏的执念，让伏兵射中一个错误的目标。',
    coldOpen: [
      { speaker: 'narrator', text: '落凤坡前，的卢不肯踏过白石道。庞统翻身下马，将缰绳递回刘备手里，忽然问张任要杀的究竟是马，还是人。' },
      { speaker: 'pangtong', text: '孔明来信只说将帅多凶少吉。他连我也一并算了，却忘了伏兵也要先认人。' },
      { speaker: 'liuzhang', text: '父兄守了三十年的蜀道,竟真有人打进来……任儿,成都的门,拜托你了。', when: '!seen:liuzhang' },
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
    cast: ['huangzhong', 'xiahouyuan', 'zhanghe', 'fazheng', 'yanyan'],
    objective: '借夏侯渊的快与张郃的变互相牵制，让老将一刀落在两人换防的半拍。',
    coldOpen: [
      { speaker: 'narrator', text: '定军山上下各有一面鼓。夏侯渊催人快攻，张郃却按兵测路；两面鼓总差半拍，黄忠听了三遍，解下了弓。' },
      { speaker: 'huangzhong', text: '他们说老将只剩一刀。够是够，只怕有人快得撞上来，有人巧得不肯来。' },
      { speaker: 'fazheng', text: '汉升,山上两将不和,便是天给你的第三条路。孝直在旌旗上,只写一个「待」字。', when: '!seen:fazheng' },
      { speaker: 'yanyan', text: '老哥哥,当年蜀道上一声「断头将军」,今日原样奉还。你的侧翼,严颜包了。' },
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
    cast: ['guanyu', 'yujin', 'pangde'],
    objective: '蓄水而不恃水，在七军改营前锁住高地与退路，把天时变成军令。',
    coldOpen: [
      { speaker: 'narrator', text: '沔水已经漫过旧界石，于禁仍把营垒排得一线不乱。庞德的棺木停在辕门外，漆色比乌云更沉。' },
      { speaker: 'guanyu', text: '七军之稳，在令行禁止；七军之险，也在无人敢先违令移营。' },
      { speaker: 'yujin', text: '关云长，天时未必助你。营中粮尚可支十日，你若久等，先乱的是樊城外。' },
      { speaker: 'pangde', text: '于将军,庞某此来,榇已在营外。你我同守,守的不是魏土,是各自主帅的名字。', when: '!seen:pangde' },
      { speaker: 'you', text: '他要等雨停。我不必让雨更早，只要让他舍不得先动。' },
    ],
    intros: {
      yujin: [
        { when: 'seen:yujin', bio: '他记得低洼怎样吞掉军阵，这次仍不肯让一次擅动毁去严名。', quote: '水涨可测。军心，不可先乱。' },
        { bio: '泰山之稳，最信军令，也最晚承认军令已经过时。', quote: '各营听令，无令不得移驻一步。' },
      ],
      pangde: [
        { when: 'seen:pangde', bio: '西凉旧部出身的他不信天命,只信手中刀与营外那口棺。', quote: '再战一场。棺未用,人未还。' },
        { when: 'page:tongguan:yeshi', bio: '他记得西凉的散与聚,如今把不服换成了决死的忠。', quote: '马儿败在西凉。庞某,不会败在这里。' },
        { bio: '抬榇而来的降将,每一箭都在替自己的名节还债。', quote: '榇在此。关公,请全力。' },
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
    cast: ['guanyu', 'lvmeng', 'luxun', 'guanping', 'zhoucang', 'panzhang'],
    objective: '拆穿白衣与卑辞共同织成的旧我之局，让关羽不以华容的旧账决定麦城的活路。',
    coldOpen: [
      { speaker: 'narrator', text: '麦城的雪盖住烽火台，吕蒙的白衣与陆逊的绶带一前一后入帐。关羽案上，摆着当年华容留下的一截刀穗。' },
      { speaker: 'guanyu', when: 'choice:huarong:yeshiB', text: '那日刀未落，曹军今日在北按兵。关某放下的义，原来会沿地图回来要账。' },
      { speaker: 'guanyu', when: 'choice:huarong:yeshi', text: '那日刀落，北方诸侯各怀心思，求援的信到临沮便没了下文。恩义清了，路却未宽。' },
      { speaker: 'guanping', text: '父亲,平儿探过路了:北面小道可走,唯临沮一带林密,恐有吴人设网。' },
      { speaker: 'zhoucang', text: '俺的腿快过他们的马!将军上马,俺扛刀开路——谁挡,俺踩谁!' },
      { speaker: 'lvmeng', text: '云长，你最盛时水淹七军；可盟友与旧敌，都从那场水里学会了怎样对付你。' },
    ],
    intros: {
      panzhang: [
        { when: 'seen:panzhang', bio: '他惦记的从来不只是城,还有城里那口八十二斤的刀。', quote: '青龙刀……这次,该换个主人了。' },
        { bio: '设网的人先算的不是兵,是走投无路者的习惯。', quote: '雪夜赶路的人,总爱挑最近的那条。' },
      ],
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

  nanjun: {
    cast: ['zhouyu', 'caoren', 'chengpu', 'ganning', 'lusu'],
    objective: '在江陵城下与曹仁对读,让周瑜的箭疮不必第二次裂开。',
    coldOpen: [
      { speaker: 'narrator', text: '赤壁的火光才熄,南郡的旗还在曹仁手里。周瑜披甲临江,箭疮尚未收口,曹仁却在城头摆开了嘲讽的鼓。' },
      { speaker: 'zhouyu', text: '曹子孝守城,十年不倦。要取南郡,先要赢他不肯出城的那颗心。' },
      { speaker: 'caoren', text: '都督箭疮未愈吧?本将这面鼓,专为你擂。你若动气,城门便为你开。', when: '!seen:caoren' },
      { speaker: 'ganning', text: '都督,把夷陵交给兴霸。铃响之处,便是吴军又进一步。' },
      { speaker: 'chengpu', text: '公瑾,老夫陪你压阵。箭疮这东西,最怕的不是箭,是气。' },
    ],
    intros: {
      caoren: [
        { when: 'seen:caoren', bio: '他记得你怎样替周瑜挡下怒气,这次连鼓都懒得擂了。', quote: '又来?这次我连激你的兴致都省了。' },
        { bio: '他把守城写成一门手艺:不赌气,不侥幸,不心疼一砖一瓦。', quote: '江陵的砖,一块一块都数过。来。' },
      ],
      caohong: [
        { bio: '他替兄长守夷陵道,信奉的道理只有一条:主公的退路比自己的命长。', quote: '这道口,姓曹。想过?留下买路的东西。' },
      ],
    },
    map: [{
      id: 'outside-mock', node: 1, title: '江陵 · 城下之鼓',
      lines: [
        { speaker: 'zhouyu', text: '他每日擂鼓骂我箭疮,要我拔营决战。我若应战,疮裂;我若不应,军心馁。' },
        { speaker: 'lusu', text: '都督不如把他擂给你的每一面鼓,都记成他出城的日子。' },
        { speaker: 'you', text: '鼓声是他的表,不是你的。让鼓替你数他的换防。' },
      ],
      choices: [
        { id: 'count-drums', text: '记录鼓点与垛口换防', detail: '本回看破提升,记住换防之隙', effects: { keenEye: true, fact: 'nanjun_count' } },
        { id: 'yiling-feint', text: '佯攻夷陵,分其兵势', detail: '曹军起手军资 -200,记住分兵', effects: { raid: true, fact: 'nanjun_feint' } },
      ],
    }],
    battle: [
      { id: 'nanjun-open', at: 'start', speaker: 'caoren', text: '周郎!箭疮好些了吗?本将的鼓,今日擂得更响!' },
      { id: 'nanjun-anger', at: 'hand:2', speaker: 'zhouyu', text: '他把鼓擂给我,我便把怒气记在他账上。等他换了第三班守军——' },
      { id: 'nanjun-gap', at: 'hand:3', speaker: 'ganning', text: '夷陵铃响了!曹洪分兵了,江陵的墙薄了一层!', when: 'fact:nanjun_feint' },
      { id: 'nanjun-low', at: 'low', speaker: 'chengpu', text: '都督的脸白了。老夫替你压住阵脚——这一阵,赢了再养伤!' },
    ],
    win: {
      text: '曹仁弃城西走的那夜,周瑜按着箭伤登上了江陵城头。他没有接受欢呼,只让人把城头那面嘲弄过他的鼓抬来,亲手敲了三下,又送还曹仁:"替我谢谢它,守住了我的耐心。"南郡,终于姓孙。',
      hook: '南郡到手,荆州的账才翻开了第一页。而北方的马蹄声,已带着一腔仇恨碾向潼关。',
    },
    loss: {
      text: '鼓声第三次响起时,周瑜提枪上马,箭疮在甲缝里裂开。你扶住他的一瞬,江陵城门轰然大开——曹仁等的正是这一刻。',
      clue: '史鉴 · 曹仁的鼓是给你情绪上的枷。重开后他的假破绽减少;数他的换防,别数他的挑衅。',
      clueFx: 'keenEye',
    },
  },

  tongguan: {
    cast: ['machao', 'xuchu', 'caocao', 'jiaxu', 'xuhuang'],
    objective: '在西凉铁骑的怒火里护住曹操,也让马超的仇有一个说得出口的去处。',
    coldOpen: [
      { speaker: 'narrator', text: '潼关的风卷着沙,马超的白袍在阵前来回,像一杆不肯倒的旗。曹操的中军帐里,贾诩慢慢研着墨。' },
      { speaker: 'machao', text: '曹瞒!杀父之仇,欺天之恨!今日不把你剁在潼关,马超誓不为人!' },
      { speaker: 'caocao', text: '马儿不死,孤无葬地也。诸公,谁替孤挡住这阵风?' },
      { speaker: 'xuchu', text: '主公下帐,退后!虎痴在此——马儿,过来!' },
      { speaker: 'jiaxu', text: '明公莫慌。西凉人多,心却不齐。文和的墨,比虎痴的刀慢,却更毒。', when: '!seen:jiaxu' },
    ],
    intros: {
      machao: [
        { when: 'seen:machao', bio: '他记得渭水那夜的冰与火,恨意未减,枪却更沉了。', quote: '又来挡我?先问过我手里的枪!' },
        { when: 'page:jiameng:yeshi', bio: '葭萌的火盆边他曾放下过枪,此刻枪尖却在微微发抖。', quote: '你见过我放下枪的样子……别再提!' },
        { bio: '锦袍银枪,半生都在替死去的父叔讨一个说法。', quote: '父债子偿,天经地义。让开!' },
      ],
      xuchu: [
        { when: 'seen:xuchu', bio: '渭水之战让他记住了你,这次把腰间的绳又紧了三圈。', quote: '再来!俺的力气还没用完!' },
        { bio: '他不懂什么离间计,只认一个理:主公在身后,就不能退。', quote: '马儿的枪快?俺的命更硬!' },
      ],
    },
    map: [{
      id: 'weishui-ice', node: 1, title: '渭南 · 冰城疑云',
      lines: [
        { speaker: 'xuhuang', text: '一夜寒风,渭水结出了冰沙。若连夜筑城,天明便有一座冰营——马超的骑兵,冲不动冰。' },
        { speaker: 'jiaxu', text: '冰城只能挡马,挡不住恨。要拆西凉,须先拆韩遂与马超的情分——一封信,够了。' },
        { speaker: 'you', text: '让他先把怒气全押上来,再让他看见信上的墨点。' },
      ],
      choices: [
        { id: 'ice-wall', text: '连夜筑冰城,以静制动', detail: '本回看破提升,记住冰城之利', effects: { keenEye: true, fact: 'tongguan_ice' } },
        { id: 'letter-smudge', text: '在离间信上留下涂改的墨点', detail: '西凉军起手士气 -1,记住墨点之疑', effects: { sow: 1, fact: 'tongguan_smudge' } },
      ],
    }],
    battle: [
      { id: 'tongguan-open', at: 'start', speaker: 'machao', text: '曹瞒!你修的冰城,挡得住马,挡不住仇!' },
      { id: 'tongguan-bare', at: 'hand:2', speaker: 'xuchu', text: '马儿,认得俺吗?虎侯今天,就站你面前!', when: 'multi' },
      { id: 'tongguan-letter', at: 'hand:3', speaker: 'narrator', text: '韩遂捧着那封信,手指停在墨点上。马超瞥见的那一眼,比曹操的千军更冷。', when: 'fact:tongguan_smudge' },
      { id: 'tongguan-low', at: 'low', speaker: 'caocao', text: '马儿,孤知你不服。可你父之死——你真敢把账全算在孤一人身上吗?' },
    ],
    win: {
      text: '渭南的风停时,西凉的营自己烧了起来——不是曹操的火,是那封信上的墨点。马超单骑立在残阵之前,枪指曹操,久久没有落下,最终调头向西。曹操抚着胡须轻声说:"孤赢的不是他,是他终于开始想,那笔账到底该找谁算。"',
      hook: '西凉散了,仇恨却还在寻找一个骑手。它会在葭萌关的火盆边,再等马超三年。',
    },
    loss: {
      text: '马超的怒火没有等你的离间计生效。铁骑三冲,冰城四裂,曹操割须弃袍的那一刻,你在乱军中只看见了虎痴的背影。',
      clue: '史鉴 · 马超的强在于怒气换筹码。重开后他的假破绽减少;先用冰城耗,再用墨点疑。',
      clueFx: 'keenEye',
    },
  },

  ruxu: {
    cast: ['ganning', 'zhoutai', 'sunquan', 'lingtong', 'caocao'],
    objective: '护住百骑劫营的每一声铃响,让曹操的四十万大军自乱一夜。',
    coldOpen: [
      { speaker: 'narrator', text: '曹操四十万大军压向濡须,孙权帐中鸦雀无声。甘宁把一百枚铜铃摆上案,一枚一枚,摆成一条线。' },
      { speaker: 'sunquan', text: '孟德有张辽,孤有兴霸。可一百骑进四十万人的营,兴霸,孤要你活着回来。' },
      { speaker: 'ganning', text: '主公放心。铃响则进,铃停则回——兴霸带的不是一百个送死的,是一百个来记账的!' },
      { speaker: 'lingtong', text: '甘宁!你又抢头阵!我父亲的旧部,还没死绝!', when: '!seen:ganning' },
      { speaker: 'zhoutai', text: '都尉少说一句。这一百骑里,有公绩你父亲的老兄弟。' },
    ],
    intros: {
      caocao: [
        { when: 'page:caochuan:yeshi', bio: '草船的雾与今夜的铃,让他把江东的胆量重新记了一账。', quote: '借了孤的箭,又来借孤的营。好胆!' },
        { when: 'seen:caocao', bio: '他记得你每次都借他的多疑,这次索性把疑心布满四十万营。', quote: '孤的营,今夜谁碰谁死——问题是谁来碰?' },
        { bio: '四十万人的营火,把江面照成了白昼,也把每一条影子都放大成敌。', quote: '江东鼠辈,只会借雾借火。正面,孤等他们。' },
      ],
      xuhuang: [
        { bio: '他布的阵讲究一个「整」字,连劫营者都会被整阵逼回原路。', quote: '来劫营?先过我这排整齐的拒马。' },
      ],
      lejin: [
        { bio: '文谦的名字取「进」,人也一样——前锋永远比军令快一步。', quote: '先锋营,先登!江东人,尝尝乐进的刀!' },
      ],
    },
    map: [{
      id: 'hundred-bells', node: 1, title: '横江 · 铃响为号',
      lines: [
        { speaker: 'ganning', text: '每人一根白鹅翎,衔在嘴里。进营不杀人,只砍旗、放火、擂他们的鼓。' },
        { speaker: 'zhoutai', text: '幼平守坞门。铃响第二遍,无论回来几个,坞门都开。' },
        { speaker: 'you', text: '四十万人的营,最怕的不是一百骑,是「不知来了多少骑」。' },
      ],
      choices: [
        { id: 'feather-quiet', text: '衔枚裹铃,先静后炸', detail: '本回看破提升,记住静默之利', effects: { keenEye: true, fact: 'ruxu_quiet' } },
        { id: 'three-fires', text: '三处举火,令其自相惊扰', detail: '曹军起手军资 -200,记住火号', effects: { raid: true, fact: 'ruxu_fires' } },
      ],
    }],
    battle: [
      { id: 'ruxu-open', at: 'start', speaker: 'caocao', text: '江上静得反常。传令各营:今夜有警,先守,后动,别中了疑兵!' },
      { id: 'ruxu-bells', at: 'hand:2', speaker: 'ganning', text: '铃——响!兄弟们,让曹营自己踩自己!' },
      { id: 'ruxu-chaos', at: 'hand:3', speaker: 'narrator', text: '三处火起,四十万营帐的鼓互相擂响了。没有一支箭知道该射向哪里。', when: 'fact:ruxu_fires' },
      { id: 'ruxu-low', at: 'low', speaker: 'sunquan', text: '铃停了……数一数,回来几个?一个、两个……都在。都在就好。' },
    ],
    win: {
      text: '天明时清点,一百骑连人带铃,一枚不少。曹操望着一夜自相踩踏的营盘,对左右说:"孙权治军如此,孤不可急图也。"遂班师。孙权亲自替甘宁斟酒:"孟德有张辽,孤有兴霸——足矣。"',
      hook: '濡须的铃声让合肥的名字更加滚烫。张辽在那里等着,把「吴」字写成江东儿郎的梦魇。',
    },
    loss: {
      text: '铃响得太早,四十万营从慌乱里醒过来。回来的铃,只有七十枚。甘宁把缺了三十枚的铃串收进怀里,从此再没提过这一夜。',
      clue: '史鉴 · 百骑劫营赢在「乱其耳目」而非「战其兵锋」。重开时先静后炸;曹操的多疑是你唯一的内应。',
      clueFx: 'keenEye',
    },
  },

  jiameng: {
    cast: ['zhangfei', 'machao', 'zhuge', 'weiyan'],
    objective: '在葭萌关的火盆边,让两杆天下最烈的枪打完,再谈谁跟谁走。',
    coldOpen: [
      { speaker: 'narrator', text: '渭南的败兵投了张鲁,马超领兵来到葭萌关下。关上的张飞听说来的是他,先大笑三声,再让人把戒酒的誓书压在案下。' },
      { speaker: 'zhangfei', text: '马超!听说你在潼关追得曹操割须?好!俺老张遇强则喜——来来来,大战三百回合!' },
      { speaker: 'machao', text: '燕人张飞?潼关之后,人人都说天下只有你的三弟配和我一战。放马过来!' },
      { speaker: 'zhuge', text: '翼德,此人恨极而勇,不可力取。亮只要你记住:打满,别打死。', when: '!fact:jiameng_done' },
      { speaker: 'weiyan', text: '军师,文长愿领一军绕后。若张将军有个闪失——', when: 'seen:weiyan' },
    ],
    intros: {
      machao: [
        { when: 'page:tongguan:yeshi', bio: '渭南的墨点他至今没想透,这份恨意使他的枪少了三分方向。', quote: '离间计赢不了两次。这次,只论枪!' },
        { when: 'seen:machao', bio: '他与张飞一战之后,枪里多了些说不清的东西。', quote: '又见面了。这次,先打完,再说话。' },
        { bio: '败军之将,把最后的体面都押在了这杆枪上。', quote: '西凉已失,家已无。我只有这场仗。' },
      ],
      madai: [
        { when: 'seen:madai', bio: '他护着堂兄的侧翼,也护着马家最后的人丁。', quote: '我兄长的事,便是我马岱的事。' },
        { bio: '话不多的西凉刀客,刀法与心事一样沉。', quote: '先过我这一关。' },
      ],
    },
    map: [{
      id: 'lamp-duel', node: 1, title: '葭萌关 · 挑灯夜战',
      lines: [
        { speaker: 'zhangfei', text: '天黑了打不痛快!来人,点起火把,两百盏!俺们夜战!' },
        { speaker: 'machao', text: '好气魄!张飞,你比我听闻的更像条汉子!' },
        { speaker: 'you', text: '火把照得亮枪,也照得亮人心。打到后来,枪会说话。' },
      ],
      choices: [
        { id: 'keep-count', text: '替张飞数回合,严控体力', detail: '本回看破提升,记住二百回合', effects: { keenEye: true, fact: 'jiameng_count' } },
        { id: 'warm-wine', text: '温两碗酒候在场边', detail: '军资 +120,二人愈战愈敬', effects: { chips: 120, sow: 1, fact: 'jiameng_wine' } },
      ],
    }],
    battle: [
      { id: 'jiameng-open', at: 'start', speaker: 'zhangfei', text: '马超!接矛!今日不喝倒你,俺老张不姓张!' },
      { id: 'jiameng-fire', at: 'hand:2', speaker: 'narrator', text: '两百盏火把把战场照成了白昼。两杆枪在光里绞了又绞,看台上的人渐渐忘了喝彩。' },
      { id: 'jiameng-madai', at: 'hand:3', speaker: 'madai', text: '兄长,退吧!张鲁的援兵到不了,西凉的人也剩不多了!', when: '!fact:jiameng_wine' },
      { id: 'jiameng-wine', at: 'hand:3', speaker: 'machao', text: '……场边那两碗酒,是给谁的?', when: 'fact:jiameng_wine' },
      { id: 'jiameng-low', at: 'low', speaker: 'zhuge', text: '翼德,收三分力。此人心中有事,枪再烈,也撑到头了。' },
    ],
    win: {
      text: '两百余合之后,火把烧短了半截。张飞把矛往地上一拄:"马超,歇一夜,明日再打!"马超在马上沉默良久,忽然问:"张将军,刘皇叔……真能容下我这身仇?"场边那两碗温酒,最终三个人分了——你,翼德,和一杆放平的枪。',
      hook: '葭萌的火盆边,西凉的枪找到了新的方向。而在荆州,鲁肃正为一张借据,请云长过江。',
    },
    loss: {
      text: '你急着替张飞找胜机,反而打断了那杆枪想说的话。马超勒马回阵,从此闭门不出,谁也请不动。',
      clue: '史鉴 · 这一页的胜负在枪外。重开时让两人打满:数回合者得全局,温酒者得人心。',
      clueFx: 'sow',
    },
  },

  daodan: {
    cast: ['guanyu', 'lusu', 'guanping', 'zhoucang', 'zhuge'],
    objective: '在陆口的酒宴上,让鲁肃讨不到荆州,也让关羽不必拔刀。',
    coldOpen: [
      { speaker: 'narrator', text: '鲁肃的请帖写了三遍,措辞一遍比一遍客气。江心的船已备好,舱里坐着刀斧手,帖上却只写了一个「叙旧」。' },
      { speaker: 'lusu', text: '云长,肃别无他意,只求把荆州的账,当面算清。' },
      { speaker: 'guanyu', text: '子敬相邀,关某岂敢不来。平儿,随我赴宴;周仓,扛刀。' },
      { speaker: 'guanping', text: '父亲,临行前军师嘱托:此宴在酒,不在荆州;在信,不在刀。' },
      { speaker: 'zhoucang', text: '俺就把刀立在船头,让江东人看看分量!' },
    ],
    intros: {
      lusu: [
        { when: 'seen:lusu', bio: '他上次没能讨回荆州,这一次把道理磨得更圆,刀斧手埋得更深。', quote: '云长,这次肃要的仍不是降,是一个「还」字。' },
        { bio: '江东最厚道的人,也终于学会了在酒里设局。', quote: '借据在此。云长,请过目。' },
      ],
      dingfeng: [
        { when: 'seen:dingfeng', bio: '他埋伏的位置换了三次,却始终没等到那声摔杯。', quote: '再等等……主将的杯子,怎么还不落地?' },
        { bio: '雪中奋短兵的老将,此刻把短兵藏在了案几之下。', quote: '酒过三巡,听杯为号。' },
      ],
    },
    map: [{
      id: 'river-feast', node: 1, title: '陆口 · 江心一宴',
      lines: [
        { speaker: 'lusu', text: '云长,席间只有你我旧谊,别无他事——肃先干为敬。' },
        { speaker: 'guanyu', text: '子敬的酒,关某喝。荆州的账,醉后再说。' },
        { speaker: 'you', text: '借据压在他袖底,刀斧手压在船板下。谁先急,谁先输。' },
      ],
      choices: [
        { id: 'count-cups', text: '数鲁肃斟酒的节奏与眼神', detail: '本回看破提升,记住斟酒之律', effects: { keenEye: true, fact: 'daodan_count' } },
        { id: 'hold-scabbard', text: '按住周仓的刀鞘,先礼后兵', detail: '东吴伏兵起手士气 -1,记住按刀之义', effects: { sow: 1, fact: 'daodan_hold' } },
      ],
    }],
    battle: [
      { id: 'daodan-open', at: 'start', speaker: 'lusu', text: '云长,今日只谈旧谊。来,满饮此杯——' },
      { id: 'daodan-deed', at: 'hand:2', speaker: 'guanyu', text: '子敬,酒是好酒。只是这借据上的墨,关某记得比你清楚。' },
      { id: 'daodan-blade', at: 'hand:3', speaker: 'zhoucang', text: '船板底下有脚步声!将军,俺的刀——', when: '!fact:daodan_hold' },
      { id: 'daodan-hold', at: 'hand:3', speaker: 'guanyu', text: '周仓,退后。今日这把刀,只陪关某喝酒。', when: 'fact:daodan_hold' },
      { id: 'daodan-low', at: 'low', speaker: 'guanping', text: '父亲,鲁肃亲自送我们到船头了。他的手,一直在袖子里攥着那份借据。' },
    ],
    win: {
      text: '船离江心,鲁肃立在渡口,久久望着那口八十二斤的刀远去。他没有摔杯,因为关羽临走时说:"子敬,荆州之约,关某记下了。你保的不是借据,是两家还没破裂的信。"回营的船上汽笛无声,只有你知道,这杯酒替荆州又买了几年。',
      hook: '单刀会散,两家的账却没散。合肥的方向,一声更比一声紧的战鼓,正在等孙权。',
    },
    loss: {
      text: '刀出鞘的那一瞬,宴席就输了。你没能按住那八十二斤的火气,也没能按住船板下的短兵。江水把「单刀赴会」冲成了「两败俱伤」。',
      clue: '史鉴 · 鲁肃要的是「信」不是「城」,伏兵等的是「刀」不是「理」。重开后看破提升,先按刀,再算账。',
      clueFx: 'keenEye',
    },
  },

  xiaoyaojin: {
    cast: ['sunquan', 'zhangliao', 'lingtong', 'ganning', 'zhoutai'],
    objective: '在逍遥津的窄桥边,让张辽的八百冲不散十万,也护住凌统的断后。',
    coldOpen: [
      { speaker: 'narrator', text: '合肥城头,张辽把八百死士列在门前,甲叶上一滴水都没有——他们已等了一夜。城外,吴军十万,刚拔完营。' },
      { speaker: 'zhangliao', text: '吴人新至,营垒未立。此刻冲阵,八百人能当八万。随我——冲!' },
      { speaker: 'sunquan', text: '张辽?!他怎么敢出城!各营勿慌,先稳住——甘宁,凌统,护住侧翼!' },
      { speaker: 'lingtong', text: '主公先走!凌家三百亲兵,还够挡一阵!' },
      { speaker: 'ganning', text: '公绩!别逞英雄!你的三百人,不是拿来换主公一程的!' },
    ],
    intros: {
      zhangliao: [
        { when: 'seen:zhangliao', bio: '他记得你的阵怎样在半渡时稳住,这次把冲锋的时机又提前了半刻。', quote: '又想稳住阵脚?我的刀,不给你列阵的时间。' },
        { bio: '八百人的胆,是他一夜一夜喂出来的。', quote: '辽来十年,只为今日这一冲!' },
      ],
      lejin: [
        { bio: '他与张辽、李典共守合肥,三人面和心齐,刀却各自藏锋。', quote: '张将军冲前,乐某守后——合肥的门,进得来出不去。' },
      ],
      lidian: [
        { bio: '他劝张辽「先折其盛气」时不带私怨,布阵最重「余地」二字。', quote: '李曼成不与你斗狠。我只封你要退的路。' },
      ],
    },
    map: [{
      id: 'half-ford', node: 1, title: '逍遥津 · 半渡之桥',
      lines: [
        { speaker: 'zhoutai', text: '主公,津桥的板朽了两块,马不能疾驰。幼平先背主公过桥!' },
        { speaker: 'lingtong', text: '幼平带主公走!我挡张辽!' },
        { speaker: 'you', text: '张辽要的不是杀孙权,是「吴军自乱」四个字。别把十万人的心,输给八百人的胆。' },
      ],
      choices: [
        { id: 'hold-line', text: '教十万军先结阵,再渡桥', detail: '本回看破提升,记住结阵渡桥', effects: { keenEye: true, fact: 'xiaoyaojin_line' } },
        { id: 'rear-guard', text: '亲领断后,换主公先渡', detail: '军资 +100,张辽军起手士气 -1', effects: { chips: 100, sow: 1, fact: 'xiaoyaojin_rear' } },
      ],
    }],
    battle: [
      { id: 'xiaoyaojin-open', at: 'start', speaker: 'zhangliao', text: '张辽在此!吴军听着——今日,只取你们阵中最乱的一处!' },
      { id: 'xiaoyaojin-charge', at: 'hand:2', speaker: 'narrator', text: '八百人凿进吴阵,像一柄锥子。所过之处,十万人的旗自己在倒。' },
      { id: 'xiaoyaojin-ling', at: 'hand:3', speaker: 'lingtong', text: '主公过了桥!三百亲兵……还剩几十。够了,够再挡一阵!' },
      { id: 'xiaoyaojin-low', at: 'low', speaker: 'sunquan', text: '公绩回来!凌统——回来!孤的江东,不能靠你们一个个用命换!' },
    ],
    win: {
      text: '津桥修复的那一瞬,吴军十万终于列成了阵。张辽在城头望见,收刀入鞘:"吴人能稳住了,此城不可再出。"凌统浑身是血地踏上桥板,孙权亲自下马扶住他。回建业的路上再无笑声,只有孙权的一句:"孤记住了合肥,记住了张文远。"',
      hook: '逍遥津的教训,让江东把目光彻底收回荆州。而刘备的汉中鼓声,已经敲到了定军山下。',
    },
    loss: {
      text: '十万人的阵,终究没能挡住八百人的胆。津桥一断,凌统的三百亲兵留在了对岸,张辽的名字从此压在江东六岁孩童的哭声里。',
      clue: '史鉴 · 张辽赢在「趁乱」不在「兵多」。重开时先结阵再渡桥;他冲不乱你,就轮到他不敢单独出城。',
      clueFx: 'keenEye',
    },
  },
};
