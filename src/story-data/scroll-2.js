export const SCROLL_2_STORIES = {
  zhujiu: {
    cast: ['caocao', 'liubei', 'lvbu'],
    objective: '藏住自己的答案，也听清曹操没有说出口的那一句。',
    coldOpen: [
      { speaker: 'caocao', text: '白门楼上你替他选了一条活路。今日这杯酒，我想知道你替自己选什么。', when: 'page:baimenlou:yeshi' },
      { speaker: 'liubei', text: '他若提起奉先，别急着答。先听他把天下说到第几个人。', when: 'page:baimenlou:yeshi' },
      { speaker: 'caocao', text: '白门楼一别，玄德愈发谨慎了。谨慎的人，最适合对酌。', when: 'page:baimenlou:history' },
      { speaker: 'narrator', text: '青梅过小盏，远处一声雷。你忽然明白，这桌酒没有一题是问天下。' },
    ],
    intros: {
      caocao: [
        { when: 'page:baimenlou:yeshi', bio: '他记得白门楼的每一个选择，尤其记得你让谁活了下来。', quote: '奉先未死，玄德在座。今日英雄，恐怕不止两个。' },
        { bio: '青梅煮酒，他把每个人的野心都当作可以试出的底牌。', quote: '莫怕雷。怕我接下来这句。' },
      ],
    },
    map: [{
      id: 'green-plum', node: 1, title: '青梅亭 · 未问先答',
      lines: [
        { speaker: 'liubei', text: '他说你是英雄时，你若只谦虚，他便知道你听懂了。' },
        { speaker: 'you', text: '那我该装作不懂？' },
        { speaker: 'liubei', text: '不。让他以为你只懂牌。' },
      ],
      choices: [
        { id: 'thunder', text: '借雷声藏住神情', detail: '曹操起手士气 -1', effects: { sow: 1, fact: 'thunder_mask' } },
        { id: 'watch-cao', text: '反问他白门楼最怕什么', detail: '本回看破提升', effects: { keenEye: true, fact: 'watch_cao' } },
      ],
    }],
    battle: [
      { id: 'zhujiu-open', at: 'start', speaker: 'caocao', text: '牌如人。先看，莫急着认。' },
      { id: 'zhujiu-mid', at: 'hand:2', speaker: 'caocao', text: '今天下英雄——你觉得，我会先说谁？' },
      { id: 'zhujiu-low', at: 'low', speaker: 'liubei', text: '雷要来了。你该落筷了。' },
    ],
    win: {
      text: '筷落，雷止。曹操笑着替你斟酒，没有再问第二遍。刘备知道，方才有一瞬，你们三人都看见了彼此的底牌。',
      hook: '关羽即将挂印封金。许都这一局，曹操记住了你的藏锋。',
    },
    loss: {
      text: '你回答了“谁是英雄”，却没听出他真正问的是“你愿不愿与我为敌”。酒未毒，话已经把你围住。',
      clue: '史鉴 · 曹操会在第二手开始读你的下注；重开时他的假破绽减少。',
      clueFx: 'keenEye',
    },
  },
  qianli: {
    cast: ['guanyu', 'liubei', 'zhangfei', 'caocao', 'kongxiu', 'hanfu', 'bianxi', 'wangzhi', 'qinqi'],
    objective: '护送车仗穿过五关，辨认孔秀、韩福、卞喜、王植、秦琪各自的拦法，把最后一点气力留给古城重逢。',
    coldOpen: [
      { speaker: 'narrator', text: '许都城门在身后，印绶高悬，金帛未动。关羽只带车仗与一柄不愿再受人情的刀。' },
      { speaker: 'caocao', text: '那日煮酒，玄德借雷藏锋；今日云长要去寻他，孤该放行，还是再留一顿酒？', when: 'page:zhujiu:yeshi' },
      { speaker: 'guanyu', text: '丞相之义，关某记在心里；兄长之约，却在前面等我。' },
      { speaker: 'liubei', text: '云长，见字如面。莫以我为念，亦莫以我为负。能来便来，古城有人等你。' },
    ],
    intros: {
      kongxiu: [{ bio: '东岭关的锁只认文书，他把职责守得比性命更窄。', quote: '没有丞相文凭，关云长也不能过。' }],
      hanfu: [{ bio: '他把敬重藏在弓弦后，放箭之前仍想保住一份旧情。', quote: '关将军，韩某敬你，却不能弃关。' }],
      bianxi: [{ bio: '镇国寺的香火压不住杀气，他的平安路只通向埋伏。', quote: '刀留佛前，酒入口中，将军便可安睡。' }],
      wangzhi: [{ bio: '荥阳的馆舍过于齐整，每一扇门都已想好何时上锁。', quote: '夜长路远，何不住到火起——住到天明？' }],
      qinqi: [{ bio: '黄河渡口的最后一道军令，他把旧交与风浪都挡在岸上。', quote: '过了四关又如何？黄河只认秦某这一面旗。' }],
    },
    map: [{
      id: 'two-kinds-of-gates', node: 2, title: '洛阳 · 明暗两关',
      lines: [
        { speaker: 'guanyu', text: '孔秀要文凭，韩福藏冷箭，卞喜却把酒摆到佛前。关隘不同，拦人的理由也不同。' },
        { speaker: 'narrator', text: '车仗里没有催促。关羽回望来路，把刀从右手换到左手，只为让赶车的人安心。' },
      ],
      choices: [
        { id: 'share-rations', text: '以干粮换百姓口述五关地形', detail: '本回看破提升，记住沿途人心', effects: { keenEye: true, fact: 'qianli_guides' } },
        { id: 'guard-the-rear', text: '亲自断后，让车仗先行', detail: '守将起手士气 -1，记住断后之诺', effects: { sow: 1, fact: 'qianli_rearguard' } },
      ],
    }],
    battle: [
      { id: 'qianli-kongxiu', at: 'start', speaker: 'kongxiu', text: '东岭关只认丞相文凭，不认你的旧名。没有文书，青龙刀也得留下。', when: 'round:1' },
      { id: 'qianli-hanfu', at: 'start', speaker: 'hanfu', text: '关将军，韩某敬你之名，却不能弃守关之责。这一箭之后，莫怪我。', when: 'round:2' },
      { id: 'qianli-bianxi', at: 'start', speaker: 'bianxi', text: '镇国寺酒已温。将军把刀留在佛前，卞某便让你看一条平安路。', when: 'round:3' },
      { id: 'qianli-wangzhi', at: 'start', speaker: 'wangzhi', text: '荥阳馆舍洁净，夜色也长。将军何不住下，等我把各处的门都替你关好？', when: 'round:4' },
      { id: 'qianli-qinqi', at: 'start', speaker: 'qinqi', text: '黄河在此。四关的人情到这里用尽；秦琪只认夏侯将军的军令。', when: 'round:5' },
      { id: 'qianli-no-sixth-grave', at: 'hand:2', speaker: 'guanyu', text: '五关各有锁，人心却未必都是锁。能绕过的杀念，便别把它变成第六座坟。' },
      { id: 'qianli-drums', at: 'low', speaker: 'zhangfei', text: '二哥，听见鼓没有？五关不必再替谁守了，回来与俺击这一面！', when: 'round:5' },
    ],
    win: {
      text: '秦琪倒下时，黄河浪声盖过了刀声。关羽没有数第五颗首级，只回身扶稳车仗。古城门下，张飞扔了鼓槌便来抱马；刘备赶到时，关羽只说“来迟了”。三双眼睛都在回答：回来便好。',
      hook: '古城鼓声未歇，北方的袁曹已经相持。下一场不再是一人过五关，而是两军争一口气。',
    },
    loss: {
      text: '你在某一关赢得了刀光，却把车仗、筹码与归期都留在身后。千里最难的从不是杀出一条直路，是到古城时仍有资格说一句“都平安”。',
      clue: '史鉴 · 孔秀耗令、韩福冷箭、卞喜设宴、王植借火、秦琪守渡。五关共用一条命，莫为一关押尽路费；重开军资 +150。',
      clueFx: 'supply',
    },
  },

  guandu: {
    cast: ['caocao', 'yuanshao', 'guojia', 'xuyou', 'tianfeng', 'jushou'],
    objective: '让袁绍的雄厚军资变成迟疑，在盲注吞尽曹军之前找到乌巢真正的软肋。',
    coldOpen: [
      { speaker: 'narrator', text: '官渡的粮簿比战报更薄。曹操每划掉一日，袁绍帐中便多一位自称有策的谋士。' },
      { speaker: 'yuanshao', text: '孟德，你我自幼相识。你的脾气我清楚，你的粮草，我更清楚。' },
      { speaker: 'caocao', text: '云长终究还是去找玄德了。孤留得住赤兔，留不住人心；本初，你却连人心都未看清。', when: 'page:qianli:yeshi' },
      { speaker: 'guojia', text: '明公，袁氏十胜十败之说，嘉只敢保证前九。最后一胜，要你亲自去赢。' },
      { speaker: 'tianfeng', text: '主公若胜，丰必死；若败，丰亦死。冀州的牢里，元皓已替你们把话写好了。', when: '!seen:tianfeng' },
      { speaker: 'caocao', text: '许攸来了便请他坐。孤可以只穿一只鞋迎他，却不能让全军看见孤只剩三日粮。' },
    ],
    intros: {
      yuanshao: [
        { when: 'page:zhujiu:yeshi', bio: '他听说青梅亭只论了刘曹，偏要把旧友局变成天下的答辩。', quote: '孟德，今日再数一次英雄，可还有袁本初？' },
        { when: 'seen:yuanshao', bio: '他仍带千军与满腹计策归来，仍缺一个肯为决定署名的人。', quote: '上次众议未决。这次，你听谁？' },
        { bio: '四世三公给了他太多谋士，也给了他永远不必先认错的位置。', quote: '河北兵精粮足。孟德，你拿什么拖？' },
      ],
    },
    map: [{
      id: 'true-ledger', node: 2, title: '官渡 · 真账假账',
      lines: [
        { speaker: 'caocao', text: '许攸问孤还有几粮。孤若说实话，他或许给乌巢；若说假话，他今夜便会走。' },
        { speaker: 'narrator', text: '帐外袁绍的催战鼓一声近过一声。曹操把真账推给你：这回要烧的不是粮，是他让别人替自己作主的习惯。' },
      ],
      choices: [
        { id: 'true-account', text: '以真实粮数换许攸一句真话', detail: '本回看破提升，记住赤足相迎', effects: { keenEye: true, fact: 'guandu_true_account' } },
        { id: 'feint-wuchao', text: '分兵佯攻，只留乌巢一路实棋', detail: '袁绍起手军资 -200，记住乌巢奇袭', effects: { raid: true, fact: 'guandu_feint' } },
      ],
    }],
    battle: [
      { id: 'guandu-open', at: 'start', speaker: 'yuanshao', text: '你每一手都在算还能活几日，我只需等。河北最不怕的，就是多开一次军议。' },
      { id: 'guandu-old-friend', at: 'hand:2', speaker: 'caocao', text: '本初，你不是不知该听谁，是只怕听错以后无人可怪。' },
      { id: 'guandu-unsigned', at: 'hand:3', speaker: 'narrator', text: '乌巢未燃，河北诸将却都在等别人先改口。千条计策，忽然没有一条肯署名。' },
      { id: 'guandu-low', at: 'low', speaker: 'yuanshao', text: '田丰、沮授、许攸……究竟是谁误我？孟德，你先说！' },
    ],
    win: {
      text: '乌巢没有火，袁绍帐中的灯却一盏盏灭了。曹操没有趁胜追骂旧友，只把写满虚假余粮的账簿合上：“本初，你输在人人都在等别人先认。”',
      hook: '北方将定，刘备却在新野等一场雪。曹操已有谋士满帐，他连一个肯开门的人还未寻到。',
    },
    loss: {
      text: '乌巢的火终究没有烧起来。袁绍仍坐在成堆军报之后，每一份都有道理，每一份都不必由他负责。你的粮却真的一日日尽了。',
      clue: '史鉴 · 袁绍的筹码多不是弱点，怕独自担责才是。逼他在盲注升高前自己选；重开先劫乌巢，敌军军资 -200。',
      clueFx: 'raid',
    },
  },

  sangu: {
    cast: ['liubei', 'guanyu', 'zhangfei', 'zhuge'],
    objective: '让三次敲门各有来意：前两次无论胜败都肯再访，第三次才听懂卧龙真正要问的天下。',
    coldOpen: [
      { speaker: 'narrator', text: '新野到隆中的路，刘备已经走过两遍。张飞把第三次风雪叫作折腾，关羽却替兄长又掸了一遍名刺。' },
      { speaker: 'zhangfei', text: '二哥千里回来，俺才懂路远不怕。可一个先生，凭什么叫俺们走三回？', when: 'page:qianli:yeshi' },
      { speaker: 'liubei', text: '因为他若肯为百姓出山，备多走几次，又算得了什么。' },
      { speaker: 'guanyu', text: '胜败可以催，开门不能催。翼德，把火折子收起来。' },
    ],
    intros: {
      zhuge: [
        { when: 'page:bowang:yeshi', bio: '博望之后，他不再只看你有没有耐心，也看你能否容别人立功。', quote: '草堂一别，你已会退。今日可还肯等？' },
        { when: 'seen:zhuge', bio: '前两顾的输赢他都记得，唯独不拿它们当开门的钥匙。', quote: '胜败我看见了。今日，你为何还来？' },
        { bio: '他在门后听了两次风雪，第三次才把天下摆上桌。', quote: '将军请进。先莫问天下，可还坐得住？' },
      ],
    },
    map: [{
      id: 'leave-the-door-unforced', node: 1, title: '隆中 · 门不可催',
      lines: [
        { speaker: 'liubei', text: '今日若仍不见，备便把名刺留下。求贤不是叫天下人都按刘备的时辰起身。' },
        { speaker: 'zhangfei', text: '那俺在外面等！若等得不耐烦，便数雪，不数他的过错。' },
        { speaker: 'guanyu', text: '你能这样等，大哥这一趟便已没有白来。' },
      ],
      choices: [
        { id: 'disarm-and-wait', text: '命全军解甲，只在门外静候', detail: '卧龙起手士气 -1，记住解甲之礼', effects: { sow: 1, fact: 'sangu_disarmed_wait' } },
        { id: 'ask-the-sleep', text: '不问天下，先问先生睡得可安稳', detail: '本回看破提升，记住不催之问', effects: { keenEye: true, fact: 'sangu_gentle_question' } },
      ],
    }],
    battle: [
      { id: 'sangu-first-door', at: 'start', speaker: 'unknown', text: '第一顾，先生不在。你可以赢这一局，却不能替他答应相见。', when: 'round:1' },
      { id: 'sangu-first-return', at: 'hand:2', speaker: 'zhangfei', text: '输了便输了，大哥，俺们明日再来。总比在这里替他守门强！', when: 'round:1' },
      { id: 'sangu-second-snow', at: 'start', speaker: 'unknown', text: '第二顾，雪满草庐。你昨日又来了——这一次，你为求胜，还是为求人？', when: 'round:2' },
      { id: 'sangu-second-intent', at: 'hand:2', speaker: 'liubei', text: '云长，翼德，雪大便靠近些。先生可以不见，我们不可失了来意。', when: 'round:2' },
      { id: 'sangu-third-reveal', at: 'start', speaker: 'zhuge', text: '前两局的书童与冷遇，都是亮借来问你的：胜后会不会狂，败后还肯不肯来。你来了三次，门便该开了。', when: 'round:3' },
      { id: 'sangu-third-world', at: 'hand:2', speaker: 'zhuge', text: '现在莫问牌。将军要荆益二州，还是要一个让百姓不必再逃的天下？', when: 'round:3' },
      { id: 'sangu-third-answer', at: 'hand:3', speaker: 'liubei', text: '先生若不出山，备仍去；先生若肯同行，这条路便不只属于备。', when: 'round:3' },
    ],
    win: {
      text: '诸葛亮把荆襄与益州写在同一盏灯下，却没有写下谁是主、谁是客。刘备起身长揖，关羽收刀，张飞替你搬来第四张凳子：这一局，终于不是为了请谁认输。',
      hook: '隆中对策已定，曹操的先锋也到了新野。卧龙出山第一把火，要先让最不服他的两个人心服。',
    },
    loss: {
      text: '第三顾你终于见到隆中图，却还在翻前两局的旧账。诸葛亮收扇不语：耐心不是多走两趟，是见到答案以后仍肯听别人说完。',
      clue: '史鉴 · 前两顾输了也会再访，不必为每阵强撑；把气力留到第三顾。重开军资 +150。',
      clueFx: 'supply',
    },
  },

  bowang: {
    cast: ['liubei', 'guanyu', 'zhangfei', 'zhaoyun', 'zhuge', 'xiahoudun'],
    objective: '让关羽张飞心服用兵，让夏侯惇把每一次追击都当成自己的主意。',
    coldOpen: [
      { speaker: 'narrator', text: '博望坡的草干得正好。诸葛亮把火折子压在地图下，先给每个人派了一条必须败着走完的路。' },
      { speaker: 'zhangfei', text: '三顾时俺服的是大哥的礼。今日你若只会叫俺退，俺可不服！', when: 'page:sangu:yeshi' },
      { speaker: 'zhuge', text: '益德，退到你能听见云长的金声便停。火攻之前，先莫把诱饵做成真败。' },
      { speaker: 'liubei', text: '备请先生出山，不是请他替你们逞强，是请他教你们不必白白逞强。' },
    ],
    intros: {
      xiahoudun: [
        { when: 'seen:xiahoudun', bio: '他记得上一次的伏兵，却仍不愿承认追击也能被人牵着走。', quote: '同一道坡，我不会再替你看第二次。' },
        { bio: '独目只肯向前看，他把每一次后退都读成敌人的胆怯。', quote: '新野若只有火，便让它先烧刘备自己。' },
      ],
    },
    map: [{
      id: 'planned-retreat', node: 1, title: '博望坡 · 退到何处',
      lines: [
        { speaker: 'guanyu', text: '军师要我们各退几步，却连停在哪一棵树后都写清了。看来这“败”字，比胜还难演。' },
        { speaker: 'zhaoyun', text: '我的枪先露给夏侯惇。他若咬住我，云长与翼德才有真正的伏兵。' },
        { speaker: 'zhangfei', text: '好！俺便输得像些。可谁先忍不住真逃，谁回来替全军洗矛！' },
      ],
      choices: [
        { id: 'brothers-ambush', text: '令云长益德互以金声为号', detail: '夏侯惇起手士气 -1，记住兄弟伏兵', effects: { sow: 1, fact: 'bowang_brothers_ambush' } },
        { id: 'zhaoyun-route', text: '与子龙逐段走完诱敌退路', detail: '本回看破提升，记住每段伏兵', effects: { keenEye: true, fact: 'bowang_zhaoyun_route' } },
      ],
    }],
    battle: [
      { id: 'bowang-open', at: 'start', speaker: 'xiahoudun', text: '刘玄德新得军师，便只会后退？那我便一路追到你们无坡可伏。' },
      { id: 'bowang-bait', at: 'hand:2', speaker: 'zhaoyun', text: '夏侯惇已咬住我的枪。军师，火还未到吗？' },
      { id: 'bowang-wait', at: 'hand:3', speaker: 'zhuge', text: '不急。他还在赢，才会继续追；火要烧的是他确信自己正确的这一刻。' },
      { id: 'bowang-low', at: 'low', speaker: 'zhangfei', text: '俺懂了！这一退不是把路让给他，是把他的路越让越窄。' },
    ],
    win: {
      text: '张飞先收矛，关羽随后抱拳。诸葛亮没有受这一拜，只把烧弯的军旗交给子龙。刘备笑了：从今日起，他们争的不是谁先来，是谁肯最后一个退。',
      hook: '博望的火让曹军记住了新野。下一回来得更快：子龙将抱着阿斗，从熟悉的伏兵图里反向杀出。',
    },
    loss: {
      text: '夏侯惇没有冲进火里，因为你的败退太像真的败退：伏兵急着救，诱兵忘了停。博望坡只剩烟，没有一个曹军走进计中。',
      clue: '史鉴 · 退不是逃；每次示弱都要保留下一段伏兵与回本的钱。重开军资 +150，别把诱敌变成真败。',
      clueFx: 'supply',
    },
  },

  changban: {
    cast: ['liubei', 'zhaoyun', 'zhangfei', 'caocao', 'xiahoudun', 'zhanghe', 'wenpin'],
    objective: '在曹操、夏侯惇、张郃同桌追剿下，让赵云带回阿斗、张飞守住当阳桥。',
    coldOpen: [
      { speaker: 'narrator', text: '长坂的尘土里，百姓、辎重和败兵挤成一条路。赵云逆向而行，张飞却勒马停在桥头。' },
      { speaker: 'zhaoyun', text: '主公，夫人与阿斗还在后面。云去去便回——若不回，翼德替我守桥。' },
      { speaker: 'zhangfei', text: '俺不要你替！回来，自己守！' },
      { speaker: 'wenpin', text: '常山赵子龙……文聘奉命拦截，却不忍逼之过死。这一枪，聘自留三分。', when: '!seen:wenpin' },
      { speaker: 'caocao', text: '传令，赵云要活的。至于桥上的黑脸将军——孤要亲自看看，他凭什么叫三军停下。' },
    ],
    intros: {
      wenpin: [
        { when: 'page:chibi:yeshi', bio: '赤壁之后他守着荆州旧地，深知追与不追都写进史笔。', quote: '当年长坂追与不追，聘如今仍未想明白。' },
        { when: 'seen:wenpin', bio: '他还记得长坂那半式收回的枪，出手便不再留情面。', quote: '这次不让你过。对不住旧主的家眷。' },
        { bio: '新附曹营的荆州旧将，枪一寸寸都在尽忠与旧义之间。', quote: '聘奉命巡此。长坂的路，不通。' },
      ],
      caocao: [
        { when: 'page:zhujiu:yeshi', bio: '青梅亭后他仍记得那声雷，如今要用千军逼出藏住的答案。', quote: '那次让你借雷藏住了。今日，孤看千军替你开牌。' },
        { when: 'page:bowang:yeshi', bio: '博望新败让他更谨慎，也更不肯给刘备第二次整军的机会。', quote: '一把火赢不了第二次。追。' },
        { bio: '他要的不只是玄德的败，还要看看什么人值得败军仍然回头。', quote: '赵云要活的。其余人，不必留。' },
      ],
      xiahoudun: [
        { when: 'page:bowang:yeshi', bio: '博望坡的火还留在独目里，他把子龙的回马看作同一道伏兵。', quote: '诸葛不在桥上。今日看谁还能救你。' },
        { when: 'seen:xiahoudun', bio: '他与你重逢仍只肯向前，却开始防着每一条过分好走的退路。', quote: '这次你退，我先看你身后。' },
        { bio: '独目将军带着博望的旧怒，最先追上赵云，也最容易追过头。', quote: '长坂之前，先还博望一箭。' },
      ],
      zhanghe: [
        { when: 'seen:zhanghe', bio: '他记得你上次怎样找路，这次先把所有回路都标进阵图。', quote: '上次让你走脱的路，这次我亲自封。' },
        { bio: '他不与夏侯惇争先，只计算赵云和张飞之间还剩几步。', quote: '一个救人，一个守桥。分开他们。' },
      ],
    },
    map: [
      {
        id: 'rescue-route', node: 1, title: '当阳 · 逆行人潮',
        lines: [
          { speaker: 'liubei', text: '子龙，备不能命你舍百姓而救我儿。若只带回阿斗，却把他们留在刀下，这仗仍是我败。' },
          { speaker: 'zhaoyun', text: '云明白。七进七出不是七次逞勇，是每一次回来，都知道还有人等。' },
        ],
        choices: [
          { id: 'people-first', text: '先护百姓，再循哭声寻阿斗', detail: '本回看破提升，记住逆行之义', effects: { keenEye: true, fact: 'changban_people_first' } },
          { id: 'bridge-mark', text: '与子龙约定只认翼德旗色回桥', detail: '追军起手士气 -1，记住回桥之约', effects: { sow: 1, fact: 'changban_bridge_mark' } },
        ],
      },
      {
        id: 'bridge-signal', node: 2, title: '长坂坡 · 一桥三令',
        lines: [
          { speaker: 'zhangfei', text: '桥后尘土少了，曹操必疑；尘土多了，百姓又无路。子龙还没回来，俺连断桥都不能痛痛快快断！' },
          { speaker: 'zhaoyun', text: '翼德，留一道只容单骑的缝。曹军若三人同追，便叫他们先争谁先过桥。' },
        ],
        choices: [
          { id: 'single-file-gap', text: '断桥之前先留一条单骑马道', detail: '本回看破提升，记住一线生机', effects: { keenEye: true, fact: 'changban_single_file' } },
          { id: 'split-banners', text: '移动三面残旗，分开三路追兵', detail: '曹操起手军资 -150，记住分追之策', effects: { oppChips: -150, fact: 'changban_split_pursuit' } },
        ],
      },
    ],
    battle: [
      { id: 'changban-open', at: 'start', speaker: 'caocao', text: '元让追子龙，儁乂断归桥。孤只要玄德走投无路。', when: 'multi' },
      { id: 'changban-zhaoyun', at: 'hand:2', speaker: 'zhaoyun', text: '阿斗在怀，枪便不能只为取胜。翼德，桥还在吗？', when: 'multi' },
      { id: 'changban-zhanghe', at: 'hand:3', speaker: 'zhanghe', text: '他每次回马都在找同一个人。别追枪，追他要回的那座桥。', when: 'multi' },
      { id: 'changban-xiahoudun', at: 'hand:4', speaker: 'xiahoudun', text: '博望那把火，今日拿你的退路来还！', when: 'multi' },
      { id: 'changban-low', at: 'low', speaker: 'zhangfei', text: '俺只要还站在这里，他们的十万兵就得一个一个来！', when: 'multi' },
    ],
    win: {
      text: '赵云把孩子递回刘备怀里，张飞才肯退下桥头。曹操没有责罚夏侯惇与张郃，只望着那道断桥：“他们一个敢回来，一个肯不走。我输的不是追兵。”',
      hook: '汉津舟楫已近，曹操也记住了这座桥。下一路要走江东：刘备需要一句能让孙权出兵的话。',
    },
    loss: {
      text: '赵云找回了阿斗，却找不到回桥的路；张飞喝住了追兵，却喝不住三支军令同时分开。孤勇能赢一阵，救不了所有人。',
      clue: '史鉴 · 曹操要活口，元让要报仇，张郃要截桥。让他们争同一条追击线，别把三人各推向一条退路；重开敌军士气 -1。',
      clueFx: 'sow',
    },
  },

  baima: {
    cast: ['guanyu', 'caocao', 'guojia', 'xunyu', 'yanliang', 'wenchou'],
    objective: '在白马与延津两阵之间,替关羽把两场大功,赢成一条回家的路。',
    coldOpen: [
      { speaker: 'narrator', text: '白马坡前,颜良连斩宋宪魏续,二十合败徐晃,曹营诸将栗然。曹操把目光投向了那个始终背对着战报的人。' },
      { speaker: 'caocao', text: '云长,孤知道你人在心不在。可颜良的刀,如今悬在孤所有将军的头上。' },
      { speaker: 'guanyu', text: '关某答应过,立功便走。此阵之后,请丞相守信——备的下落,孤已听说了。' },
      { speaker: 'guojia', text: '颜良之勇不可力敌,文丑之躁可以计取。奉孝只担心一件事:云长这两刀砍完,天下再无人留得住他。', when: '!seen:guojia' },
      { speaker: 'yanliang', text: '曹营无人了吗?叫那个红脸的马弓手上来看看。', when: '!seen:yanliang' },
    ],
    intros: {
      yanliang: [
        { when: 'seen:yanliang', bio: '他记得那次快得看不清的刀光,这次把营垒扎得更深。', quote: '那口刀……这次,我要看清它来路。' },
        { bio: '河北第一刀,连胜让他相信天下没有第二口更快的刀。', quote: '连营十里,谁来谁死。' },
      ],
      wenchou: [
        { when: 'seen:wenchou', bio: '界桥之后他学会等,延津却又要他追——他最恨这种矛盾。', quote: '你教会我数节拍。那这次,换你数我的马蹄。' },
        { bio: '为颜良复仇的心比枪更重,辎重散落一地也拦不住他的冲锋。', quote: '白马的账,延津清。' },
      ],
      songxian: [
        { bio: '他从吕布的旧梦里醒来,急着向新主证明自己。', quote: '温侯旧部,不是孬种!看我的!' },
      ],
    },
    map: [{
      id: 'two-blades', node: 1, title: '黎阳 · 两阵之间',
      lines: [
        { speaker: 'xunyu', text: '颜良兵精而不识变,文丑勇而性躁。两阵之间,真正要读的是云长的心。' },
        { speaker: 'guanyu', text: '荀令君放心。关某的刀只为丞相砍这一回,砍完,便去寻兄。' },
        { speaker: 'you', text: '两阵两刀,刀刀都要干净。拖泥带水,走的路就长了。' },
      ],
      choices: [
        { id: 'feed-few', text: '以老弱为饵,佯弃辎重', detail: '文丑军起手军资 -200,记住饵兵之计', effects: { raid: true, fact: 'baima_bait' } },
        { id: 'watch-blade', text: '陪关羽先看清颜良的麾盖', detail: '本回看破提升,记住麾盖之下', effects: { keenEye: true, fact: 'baima_watch' } },
      ],
    }],
    battle: [
      { id: 'baima-open', at: 'start', speaker: 'yanliang', text: '又来?宋宪魏续的刀,还在我马上挂着!' },
      { id: 'baima-ride', at: 'hand:2', speaker: 'narrator', text: '赤兔马从土山后转出,颜良的麾盖在阵前孤零零亮着——他想问来将何人,刀已经到了。', when: 'fact:baima_watch' },
      { id: 'baima-clash', at: 'hand:2', speaker: 'guanyu', text: '麾盖之下,便是他要护的军心。破了他的旗,这一阵就完了。', when: '!fact:baima_watch' },
      { id: 'baima-wen', at: 'hand:3', speaker: 'wenchou', text: '马快!文丑的枪还没热,你跑什么?!' },
      { id: 'baima-low', at: 'low', speaker: 'guojia', text: '两阵之间最忌恋战。云长,酒在这里,路也在这里。' },
    ],
    win: {
      text: '白马的麾盖倒下时,延津的文丑还在马蹄声里数你的节拍。两阵两刀,干净得像关羽的刀背。曹操亲斟的酒他没有喝,只拱了拱手:"丞相,关某去也。"袖中那封寻兄的书信,终于用上了。',
      hook: '两阵大功换来一纸放行。前方五关六将,没有一人读过这封信。',
    },
    loss: {
      text: '第一阵的胜利让你贪了第二阵的快。文丑的铁骑漫过河滩时,你才想起郭嘉那句"两阵之间,真正要读的是云长的心"。',
      clue: '史鉴 · 颜良输给轻敌,文丑赢在等你急。重开时先弃辎重乱其军心:文丑起手军资 -200。',
      clueFx: 'raid',
    },
  },
};
