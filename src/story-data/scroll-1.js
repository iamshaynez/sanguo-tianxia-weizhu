export const SCROLL_1_STORIES = {
  taoyuan: {
    cast: ['liubei', 'guanyu', 'zhangfei'],
    objective: '在黄巾乱兵中护住乡勇，也让三个陌生人的誓约经得住第一场败仗。',
    coldOpen: [
      { speaker: 'narrator', text: '涿郡的桃花落在告示上，黄巾二字被雨浸开。三个人同时伸手去揭，指尖碰在一处。' },
      { speaker: 'liubei', text: '备只有一双草鞋、一腔热血。二位若愿同行，先把这条命借给乡亲。' },
      { speaker: 'zhangfei', text: '俺有酒，有矛，最不怕把命押上！只是输了以后，谁来替俺们收尸？' },
      { speaker: 'guanyu', text: '所以今日不求同胜，先约一件事：无论谁退，另外两人都要接他回来。' },
    ],
    map: [{
      id: 'peach-oath', node: 1, title: '桃林 · 先约退路',
      lines: [
        { speaker: 'zhangfei', text: '结义还不先喝酒？俺连今后埋在哪座山头都不怕！' },
        { speaker: 'guanyu', text: '不怕死容易。难的是看见兄弟败了，肯放下自己的胜名去接。' },
        { speaker: 'liubei', text: '那便把这一条放在同年同月之前。能回来，才有下一次同行。' },
      ],
      choices: [
        { id: 'mutual-cover', text: '把“接回彼此”写进誓约', detail: '敌军起手士气 -1，记住互救之约', effects: { sow: 1, fact: 'taoyuan_cover' } },
        { id: 'village-rearguard', text: '先教乡勇辨认退路', detail: '本回看破提升，记住乡勇退路', effects: { keenEye: true, fact: 'taoyuan_rearguard' } },
      ],
    }],
    battle: [
      { id: 'taoyuan-open', at: 'start', speaker: 'zhangfei', text: '俺先冲！你们可别跟得太慢，叫黄巾看了笑话！' },
      { id: 'taoyuan-cover', at: 'hand:2', speaker: 'guanyu', text: '益德逼阵，玄德护住乡勇。别三人同时向前，把退路空给敌人。' },
      { id: 'taoyuan-low-oath', at: 'low', speaker: 'liubei', text: '翼德，回来！你答应过，败了也有人接，不许把誓约只用在别人身上。', when: 'fact:taoyuan_cover' },
      { id: 'taoyuan-low', at: 'low', speaker: 'liubei', text: '别盯着倒下的旗。先看清谁还在等同伴伸手。' },
    ],
    win: {
      text: '桃花落在三只碗里，刘备把第四只推给你，却没有请你改口叫兄长。“今日你看见我们如何开始；他日若有人走散，替我们记得回来。”',
      hook: '桃园酒未醒，酸枣诸侯已会盟。下一杯，要在一个叫华雄的人面前保持温热。',
    },
    loss: {
      text: '酒还温着，三人却各自被困在一处。你终于明白，同生共死若只是同时向前，便只是三场互不相见的孤战。',
      clue: '史鉴 · 互救不是三人一起全押：有人逼阵，便要有人留后。重开军资 +150，先给同伴留退路。',
      clueFx: 'supply',
    },
  },

  sishui: {
    cast: ['liubei', 'guanyu', 'zhangfei', 'caocao', 'huaxiong'],
    objective: '在诸侯的轻视与华雄的连胜里，替关羽争到一杯仍未凉的出战机会。',
    coldOpen: [
      { speaker: 'narrator', text: '诸侯帐中摆着十九路酒杯，关外华雄连斩两将。第三杯酒斟好了，却没人肯起身。' },
      { speaker: 'caocao', text: '这酒我斟。谁能取华雄首级，回来便还是温的。' },
      { speaker: 'guanyu', text: '桃园之约，不是叫兄弟替我去死。此杯请留，关某自己回来喝。', when: 'page:taoyuan:yeshi' },
      { speaker: 'zhangfei', text: '二哥，俺替你擂鼓。你若不回来，酒再热俺也不饮！' },
    ],
    intros: {
      huaxiong: [
        { when: 'seen:huaxiong', bio: '他记得上次那杯没有凉的酒，更记得是谁没有急。', quote: '又斟酒？这次，我让它开席便冷。' },
        { bio: '连胜让他相信，每一个挑战者都会比上一个更急。', quote: '酒温正好。你的首级，也正好。' },
      ],
    },
    map: [{
      id: 'warm-cup', node: 1, title: '汜水关 · 杯酒为凭',
      lines: [
        { speaker: 'caocao', text: '满帐都在数华雄杀了几人，只有云长在看他杀完以后往哪里回头。' },
        { speaker: 'guanyu', text: '他靠下一阵连胜压住诸侯。若我不替自己急，他便要替我急。' },
      ],
      choices: [
        { id: 'leave-wine', text: '把酒留在帐中，不发豪言', detail: '华雄起手士气 -1，记住这杯归约', effects: { sow: 1, fact: 'sishui_return_cup' } },
        { id: 'watch-reins', text: '先看华雄如何勒马回头', detail: '本回看破提升，记住他的回望', effects: { keenEye: true, fact: 'sishui_horse_reins' } },
      ],
    }],
    battle: [
      { id: 'sishui-open', at: 'start', speaker: 'huaxiong', text: '又来一个借酒出名的。酒冷之前，够你败三次。' },
      { id: 'sishui-cup', at: 'hand:2', speaker: 'caocao', text: '酒面还静。云长，满帐催的是鼓，不是你的刀。' },
      { id: 'sishui-low', at: 'low', speaker: 'guanyu', text: '关某不急。他若只敢在连胜时挥刀，酒凉之前，急的一定是他。' },
    ],
    win: {
      text: '关羽把酒杯递回曹操手中，酒面仍暖。刘备替他解下染尘的披风，张飞的鼓直到此刻才停。曹操却看向你：“方才满帐都急，只有你肯等他。”',
      hook: '华雄已退，虎牢关门却开了。吕布只问一句：方才温酒的人，敢不敢再来？',
    },
    loss: {
      text: '酒彻底冷了，帐内无人再提第二杯。你不是败给华雄的快刀，是把“回来喝酒”误听成了“必须立刻赢”。',
      clue: '史鉴 · 温酒不是催你速胜，而是相信能回来。华雄靠连胜逼人抢攻；让他先急，重开时其起手士气 -1。',
      clueFx: 'sow',
    },
  },

  hulao: {
    cast: ['lvbu', 'liubei', 'guanyu', 'zhangfei'],
    objective: '看清吕布的进退，在虎牢关前赢下第一场“不可能”。',
    coldOpen: [
      { speaker: 'narrator', text: '关上画戟一指，诸侯的旗号便矮了半截。你刚到，刘备却把一杯酒推到你面前。' },
      { speaker: 'liubei', text: '我二弟的酒曾斩华雄。今日这一杯，你敢不敢接？' },
      { speaker: 'writer', text: '这一页人人知道结局。可没有人知道，你为何也在场。', when: '!seen:lvbu' },
      { speaker: 'lvbu', text: '又是你。上次没打完的，今日一并算。', when: 'seen:lvbu' },
    ],
    intros: {
      lvbu: [
        { when: 'seen:lvbu', bio: '他记得你上一次坐在对面，也记得你怎样赢下底池。', quote: '别拿诸侯吓唬我。你，一个人上来。' },
        { bio: '虎牢关前，他把“天下无双”当作最短的战书。', quote: '三英一起来，或你一个人来。别让我等。' },
      ],
    },
    map: [{
      id: 'three-heroes', node: 1, title: '汜水 · 三英旧约',
      lines: [
        { speaker: 'guanyu', text: '他的强，不在每一手都进；在你怕了以后，他不必再有牌。' },
        { speaker: 'zhangfei', text: '说这些作甚！俺先替你掀他一阵！' },
      ],
      choices: [
        { id: 'allies', text: '请三英掠阵', detail: '军资 +100，吕布起手士气 -1', effects: { chips: 100, sow: 1, fact: 'hulao_allies' } },
        { id: 'watch', text: '独自看他打完一手', detail: '本回假破绽减少', effects: { keenEye: true, fact: 'hulao_watch' } },
      ],
    }],
    battle: [
      { id: 'hulao-open', at: 'start', speaker: 'lvbu', text: '你的筹码像诸侯的胆子——看着不少。' },
      { id: 'hulao-read', at: 'hand:2', speaker: 'guanyu', text: '他越顺，越会把强牌写在眉上。别急着替他怕。' },
      { id: 'hulao-low', at: 'low', speaker: 'lvbu', text: '好！这才配叫虎牢！', when: '!fact:hulao_watch' },
      { id: 'hulao-low-watch', at: 'low', speaker: 'you', text: '原来“只进不退”不是勇，是他只会这一种赢法。', when: 'fact:hulao_watch' },
    ],
    win: {
      text: '画戟坠地，诸侯却没有欢呼。刘备先扶住你，关羽拾起了那杯始终未动的酒。',
      hook: '吕布败走前记住了你的名字。下一次相见，不会还在虎牢。',
    },
    loss: {
      text: '你跟着诸侯一起退了。直到离开虎牢，你才懂：他一直在逼你把“天下第一”当成第五张公共牌。',
      clue: '史鉴 · 吕布靠连续施压放大恐惧；重开时，他的假破绽会减少。',
      clueFx: 'keenEye',
    },
  },

  fengyiting: {
    cast: ['diaochan', 'dongzhuo', 'lvbu'],
    objective: '让董卓与吕布在同一张桌上互相猜疑，替貂蝉把连环计走完最后一步。',
    coldOpen: [
      { speaker: 'narrator', text: '凤仪亭的荷花开得极静。董卓在亭外等美人，吕布在假山后等一个解释，貂蝉却只等他们同席。' },
      { speaker: 'diaochan', text: '太师要我的归顺，将军要我的誓言。今日我不答，我要他们听见彼此的答案。' },
      { speaker: 'lvbu', text: '虎牢你逼我退一步，今日若叫我再退，走的便不是我，是这整座郿坞。', when: 'page:hulao:yeshi' },
      { speaker: 'dongzhuo', text: '奉先，咱家待你不薄。连你也要隔着珠帘看她么？' },
    ],
    intros: {
      dongzhuo: [
        { when: 'seen:dongzhuo', bio: '郿坞的门换过锁，他仍以为所有真心都能收入库中。', quote: '又来挑唆？咱家这次先看你，再看奉先。' },
        { bio: '他把恩情写成账簿，也要吕布用顺从逐笔偿还。', quote: '父子同席，有什么话不能明着说？' },
      ],
      lvbu: [
        { when: 'page:hulao:yeshi', bio: '虎牢之后他肯退一次，却不肯再让任何人替他决定去处。', quote: '上次你赢我的戟。这次，别替她选。' },
        { when: 'seen:lvbu', bio: '旧败没有磨去锋芒，只让他更难忍受被当作他人之物。', quote: '我认得你。也认得你眼里那种“为我好”。' },
        { bio: '方天画戟立在亭外，他最怕的却是亭内一句含糊的话。', quote: '让她说清楚。你也一样。' },
      ],
    },
    map: [{
      id: 'two-listeners', node: 1, title: '凤仪亭 · 一句话两人听',
      lines: [
        { speaker: 'diaochan', text: '他们若各自来问，我只能各答一半。同席以后，太师加注要看奉先脸色，奉先弃牌也要听太师笑声。' },
        { speaker: 'you', text: '所以你不必骗两个人，只要让同一句真话有两种听法。' },
        { speaker: 'diaochan', text: '不。我还要他们终于明白，我不是那句真话里的酬劳。' },
      ],
      choices: [
        { id: 'tell-dong', text: '让董卓先看见吕布的迟疑', detail: '本回看破提升，记住太师的疑', effects: { keenEye: true, fact: 'fengyi_dong_doubt' } },
        { id: 'tell-lvbu', text: '让吕布听见董卓的占有', detail: '敌军起手士气 -1，记住奉先的怒', effects: { sow: 1, fact: 'fengyi_lvbu_rage' } },
      ],
    }],
    battle: [
      { id: 'fengyi-open-multi', at: 'start', speaker: 'diaochan', text: '今日没有两张底牌，只有一道父子名分。谁先把对方当敌人，谁便替我开了局。', when: 'multi' },
      { id: 'fengyi-dong', at: 'hand:2', speaker: 'dongzhuo', text: '奉先，你跟她走，还是跟咱家走？想清楚再下注。', when: 'multi' },
      { id: 'fengyi-lvbu', at: 'hand:3', speaker: 'lvbu', text: '义父口口声声待我不薄，原来我的一切，都记得这么清楚。', when: 'multi' },
      { id: 'fengyi-low', at: 'low', speaker: 'diaochan', text: '别看我。看你们自己：一个怕失去权，一个怕从来不是自己。', when: 'multi' },
    ],
    win: {
      text: '貂蝉推开亭门，第一次不必借谁的眼色说话。董卓与吕布仍盯着彼此，直到父子之名只剩一张撕开的请帖。她没有奔向任何一人，只把自己的路走出了郿坞。',
      hook: '凤仪亭一别，吕布与貂蝉都离开了郿坞。小沛来的使者却在路上——下回，他要替两家解仇。',
    },
    loss: {
      text: '董卓只当你争宠，吕布只当你欺瞒。貂蝉摘下耳珰，没有哭：你想替她赢下两个男人，却忘了她真正要赢的是不再属于任何人的一句话。',
      clue: '史鉴 · 别分头猜董卓与吕布的牌；要看一人下注时另一人先望向谁。连环计的缝隙在两人之间，重开后假破绽减少。',
      clueFx: 'keenEye',
    },
  },

  yuanshemen: {
    cast: ['lvbu', 'jiling', 'liubei', 'guanyu', 'zhangfei'],
    objective: '让纪灵与刘备都保住退路，也逼吕布证明那一箭不是另一种恃强。',
    coldOpen: [
      { speaker: 'narrator', text: '辕门外的画戟只有小枝可中，辕门内却坐着两支随时会厮杀的大军。吕布把弓放在桌上，先请你发牌。' },
      { speaker: 'lvbu', text: '虎牢你说我只知进。今日两家都在，看我如何用一支箭叫他们退。', when: 'page:hulao:yeshi' },
      { speaker: 'jiling', text: '纪某奉主公之命，不因一箭退兵。除非满座都承认，这一箭赌得起。' },
      { speaker: 'liubei', text: '备不愿拿小沛百姓的命，替任何人证明箭术。' },
    ],
    intros: {
      jiling: [
        { when: 'seen:jiling', bio: '他仍不服那一箭，却开始认真衡量箭下的另一条命。', quote: '再赌可以。先把两家的条件一字不改地说清。' },
        { bio: '三尖刀压着军令，他不能退得像一个被神箭吓走的人。', quote: '吕将军有神射，纪某也有军令。' },
      ],
    },
    map: [{
      id: 'shared-wager', node: 1, title: '辕门 · 共认一注',
      lines: [
        { speaker: 'zhangfei', text: '一箭便叫俺大哥免于刀兵？若射不中，俺先掀了他的弓！' },
        { speaker: 'guanyu', text: '所以最难不在射中，在射失以后两家也认这笔账。' },
        { speaker: 'lvbu', text: '那就把不中怎么办也说清。吕某今日不靠别人替我自信。' },
      ],
      choices: [
        { id: 'name-the-miss', text: '先说箭若不中，两家如何收兵', detail: '本回看破提升，记住共同的赌注', effects: { keenEye: true, fact: 'yuanshemen_named_miss' } },
        { id: 'seat-the-rivals', text: '请玄德与纪灵同坐一侧', detail: '纪灵起手士气 -1，记住同席之义', effects: { sow: 1, fact: 'yuanshemen_shared_seat' } },
      ],
    }],
    battle: [
      { id: 'yuanmen-open', at: 'start', speaker: 'jiling', text: '先别谈神射。我若赢了这一手，你敢不敢也让玄德出城一战？' },
      { id: 'yuanmen-arrow', at: 'hand:2', speaker: 'lvbu', text: '我若射不中，自然依你。可你若只想看我出丑，便没听懂这局。' },
      { id: 'yuanmen-low', at: 'low', speaker: 'liubei', text: '纪将军，今日要赢的不是你的军令，是你回去以后仍能向士卒交代。' },
    ],
    win: {
      text: '箭离弦时，纪灵没有看小枝，先看刘备。刘备把面前的刀推远一寸，他才终于收兵。吕布大笑，只有你看见他掌心也有汗：这一箭若只是神技，救不了任何人。',
      hook: '辕门保住了小沛，却保不住吕布自己的下邳；而许都来的曹操，已先一步走向宛城。',
    },
    loss: {
      text: '箭还未离弦，纪灵与刘备已经各自起身。你忙着替吕布保证必中，忘了问另外两人是否愿意把军令与百姓押在同一句话上。',
      clue: '史鉴 · 和事不是两边都不得罪，而是先让两边承认同一个赌注。箭未离弦前别说满；重开后假破绽减少。',
      clueFx: 'keenEye',
    },
  },

  wancheng: {
    cast: ['caocao', 'dianwei', 'zhangxiu'],
    objective: '在张绣降而复叛的一夜，先看住典韦的双戟，再替曹操留住最后一条退路。',
    coldOpen: [
      { speaker: 'narrator', text: '宛城降旗尚未收起，曹营的宴席已经唱到深夜。典韦抱着双戟坐在帐外，只有你看见墙影里多了一双脚。' },
      { speaker: 'caocao', text: '汜水那杯温酒，孤至今记得。可惜今夜人心比酒凉得快，孤竟没尝出来。', when: 'page:sishui:yeshi' },
      { speaker: 'dianwei', text: '主公安睡。典某不懂牌，只懂这扇门：人在，戟在，门便在。' },
      { speaker: 'zhangxiu', text: '降将的酒，是不是总要低头才配喝？曹公，你也来算算这一夜谁欠谁。' },
    ],
    intros: {
      zhangxiu: [
        { when: 'seen:zhangxiu', bio: '降旗可以再次升起，被当作无声的屈辱却再难收回。', quote: '这次莫问双戟。先问你还肯不肯听我说完。' },
        { bio: '北地枪王已经降过一次，再出手时便不会留第二次犹豫。', quote: '白日受降，夜里听枪。曹公请坐。' },
      ],
    },
    map: [{
      id: 'twin-halberds', node: 1, title: '宛城 · 双戟未失',
      lines: [
        { speaker: 'dianwei', text: '胡车儿今夜敬了我三碗酒，眼睛却总落在戟上。兵器若失，我拿什么替主公争一条退路？' },
        { speaker: 'caocao', text: '张绣既降，为何还像坐在针毡？孤是不是把“归顺”误听成了“无话可说”。' },
      ],
      choices: [
        { id: 'guard-arms', text: '与典韦同守双戟和后营马道', detail: '本回看破提升，双戟与退路同守', effects: { keenEye: true, fact: 'wancheng_arms_ready' } },
        { id: 'return-camps', text: '让降卒各归旧营，不夺其械', detail: '张绣起手士气 -1，记住降卒之心', effects: { sow: 1, fact: 'wancheng_respect' } },
      ],
    }],
    battle: [
      { id: 'wancheng-open', at: 'start', speaker: 'zhangxiu', text: '白日你受我的降，夜里却当我无话可说。张绣这一枪，现在才递出去。' },
      { id: 'wancheng-regret', at: 'hand:2', speaker: 'caocao', text: '孤错算了张绣，还是错算了自己？典韦，先莫让任何人进帐。' },
      { id: 'wancheng-low-ready', at: 'low', speaker: 'dianwei', text: '主公先走！双戟还在，今夜便没有人能叫典某空手守门。', when: 'fact:wancheng_arms_ready' },
      { id: 'wancheng-low', at: 'low', speaker: 'dianwei', text: '主公先走！莫问典某还能站多久，只问马是否备好。' },
    ],
    win: {
      text: '双戟仍在典韦手中，张绣的火没能封住营门。曹操走出很远才回头，第一次没有问损失多少兵马，只问：“典韦可还站在原处？”身后的壮汉举了举戟，算是回答。',
      hook: '宛城的门守住了，曹操却来不及学乖。他已兵临下邳；这一次，被围的是吕布。',
    },
    loss: {
      text: '双戟被盗那刻，你才懂张绣等的不是曹操熟睡，是他把别人的屈辱当作安全。营门还亮着火，典韦没有再退。',
      clue: '史鉴 · 张绣决意，在他不再看曹操时便已写下。别只盯枪尖，先守营门与双戟；重开后假破绽减少。',
      clueFx: 'keenEye',
    },
  },

  baimenlou: {
    cast: ['lvbu', 'chengong', 'caocao', 'liubei'],
    objective: '在吕布与陈宫之间找出真正的死局，决定下邳还有没有明天。',
    coldOpen: [
      { speaker: 'chengong', text: '城外是曹军，城内是渴了三日的兵。温候仍说，只要他肯出战，便没有输。' },
      { speaker: 'lvbu', text: '虎牢那次，你赢的是牌。今日敢拿命再赌一次？', when: 'page:hulao:yeshi' },
      { speaker: 'chengong', text: '你来了。虎牢那页我读过——可这一回，要救的不是他的胜名。', when: 'page:hulao:yeshi' },
      { speaker: 'writer', text: '白门楼的绳子悬在页外。你每赢一手，它便清楚一分。' },
    ],
    intros: {
      lvbu: [
        { when: 'page:hulao:yeshi', bio: '虎牢败过一次的吕布，更不肯承认自己已被困死。', quote: '你能让我败，能不能让我活？' },
        { bio: '泗水淹城，天下第一仍在等一个可以冲锋的方向。', quote: '让开。我再去杀一条路。' },
      ],
      chengong: [{ bio: '他不是来替吕布求胜，是来替下邳求一条退路。', quote: '若只会赢牌，你救不了他。' }],
    },
    map: [{
      id: 'last-counsel', node: 1, title: '泗水 · 最后一策',
      lines: [
        { speaker: 'chengong', text: '我劝他出城，他问我出城以后还是不是吕布。你看，这才是他的牢。' },
        { speaker: 'caocao', text: '玄德也在楼上。你若救下奉先，他日谁来制他？' },
      ],
      choices: [
        { id: 'chen-plan', text: '替陈宫说完那一条退路', detail: '看破提升，记住陈宫之谋', effects: { keenEye: true, fact: 'chen_plan' } },
        { id: 'lvbu-oath', text: '让吕布亲口许诺不再轻进', detail: '敌军起手士气 -1', effects: { sow: 1, fact: 'lvbu_oath' } },
      ],
    }],
    battle: [
      { id: 'baimen-open', at: 'start', speaker: 'chengong', text: '看他筹码少于三成时。困兽会把最后一丝理智也压上去。' },
      { id: 'baimen-low', at: 'low', speaker: 'lvbu', text: '陈宫！若我这次听了你的，世人会不会笑我？' },
      { id: 'baimen-answer', at: 'low', speaker: 'chengong', text: '会。可活着的人，才轮得到被笑话。' },
    ],
    win: {
      text: '吕布终于没有冲向城门。他摘下束发金冠，第一次问陈宫：“往哪里退？”下邳的哭声停了一夜。',
      hook: '许都青梅将熟。曹操已经听说：天下第一没有死，而你就在那张桌边。',
      choiceFact: 'lvbu_lives',
    },
    loss: {
      text: '绳索收紧时，你才发现自己一直在回答“怎样赢吕布”，却从没回答“吕布怎样才肯活”。',
      clue: '史鉴 · 陈宫看穿了困兽的节奏；重开时假破绽减少。',
      clueFx: 'keenEye',
    },
  },
};
