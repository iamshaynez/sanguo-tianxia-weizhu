export const SCROLL_4_STORIES = {
  yiling: {
    cast: ['liubei', 'luxun', 'guanyu', 'zhuge', 'huangquan', 'maliang', 'shamoke'],
    objective: '拆开七百里连营，在陆逊点火之前，让刘备看见复仇之外还有多少条命。',
    coldOpen: [
      { speaker: 'narrator', text: '猇亭的林叶密得透不过风。每一座营盘都挨着下一座，像有人把七百里怨气铺成了一根火绳。' },
      { speaker: 'guanyu', text: '麦城那条命，是你替我夺回来的。今日若还要东征，便别再拿我当报仇的理由。', when: 'page:maicheng:yeshi' },
      { speaker: 'liubei', text: '云长的首级送到洛阳时，朕没有哭。如今每一座营里都有人喊他，朕便不能再退。', when: '!page:maicheng:yeshi' },
      { speaker: 'huangquan', text: '陛下,水军当为前锋,沿江直下;若舍船就陆,连营林木之间,是把七百里的命交给天时。', when: '!seen:huangquan' },
      { speaker: 'maliang', text: '五溪番王沙摩柯已到,夷陵道上的图,马良又核了一遍。陛下,只差您一句「移营」。' },
      { speaker: 'shamoke', text: '汉家皇帝替俺们撑腰,这一仗,番王的骨朵不认吴人的水!' },
      { speaker: 'luxun', text: '我不怕刘使君怒。他越怒，越会把山林、连营和人心，亲手摆成一堆柴。' },
    ],
    intros: {
      luxun: [
        { when: 'page:maicheng:yeshi', bio: '荆州无恙，他仍守着江东；这一战不再只是复仇，却仍可能毁于意气。', quote: '关将军尚在，这仗便不该只为一口气。' },
        { bio: '他把少年意气藏进儒生衣袖，等刘备自己把胜机连成火路。', quote: '你家主公要仇，我要江东。火该落在何处？' },
      ],
    },
    map: [{
      id: 'move-camps', node: 1, title: '猇亭 · 火未到先移营',
      lines: [
        { speaker: 'liubei', text: '将士避暑入林，是朕的令。今日移营，便是叫他们以为朕怕了陆逊。' },
        { speaker: 'zhuge', text: '陛下，陆逊固守不是怯，是在等我们自己把营盘摆成柴。可退一座孤营，不可退七百里人心。' },
      ],
      choices: [
        { id: 'high-ground', text: '弃林就高，拆开相连营垒', detail: '本回看破提升，记住移营之策', effects: { keenEye: true, fact: 'yiling_high_camp' } },
        { id: 'fire-oil', text: '夜袭吴军火油队', detail: '陆逊军资 -200，记住火油所在', effects: { raid: true, fact: 'yiling_fireoil' } },
      ],
    }],
    battle: [
      { id: 'yiling-open', at: 'start', speaker: 'luxun', text: '你催得越急，我越不必急。你押上的不是军资，是蜀营还能忍几日。' },
      { id: 'yiling-anguish', at: 'hand:2', speaker: 'liubei', text: '我若在此退一步，是否便对不起那些随我入蜀、又随我东征的人？' },
      { id: 'yiling-brother', at: 'hand:3', speaker: 'guanyu', text: '大哥，我的命尚在。别再拿别人的命祭我。', when: 'page:maicheng:yeshi' },
      { id: 'yiling-counsel', at: 'hand:3', speaker: 'zhuge', text: '亡者不会因多死几人便归来。先看火油，再看你的仇。', when: '!page:maicheng:yeshi' },
      { id: 'yiling-low', at: 'low', speaker: 'luxun', text: '你终于肯看营外了。可惜火烧起来以后，再清醒的将令也会慢一步。' },
    ],
    win: {
      text: '第一支火箭落下时，旧营已经空了。陆逊隔江望着分散的高垒，终于收起那柄始终未点的火折。刘备没有乘胜追杀，只命人逐营清点归乡的姓名。',
      hook: '夷陵没有烧成灰烬，刘备却倒在了永安宫。下一页，对手连姓名也没有。',
      choiceFact: 'yiling_fire_avoided',
    },
    loss: {
      text: '火沿营盘奔去，比任何一道军令都快。你护着刘备退向白帝，才懂陆逊等的从来不是东风，而是你因愤怒而不肯改变的那一夜。',
      clue: '史鉴 · 陆逊以固守拖高盲注，再赌你急于求成；重开时假破绽减少，先拆连营之势。',
      clueFx: 'keenEye',
    },
  },

  baidicheng: {
    cast: ['liubei', 'zhuge', 'guanyu', 'caopi'],
    objective: '同沉疴争回刘备的时间，也让那句托孤从试探与重担，变回真正的信任。',
    coldOpen: [
      { speaker: 'narrator', text: '永安宫的药香压不住江潮。刘备枕边放着写了一半的遗诏，最后几个字迟迟不肯落下。' },
      { speaker: 'narrator', text: '两年前，曹丕在受禅台上接过汉家玉玺。消息传到成都，满朝劝进——先主登基，为的是续汉，也为了一句「汉可不亡」。' },
      { speaker: 'caopi', text: '舜禹之事,朕知之矣。汉四百年,终须有人替它合上书页——玄德,你不肯吗?', when: '!seen:caopi' },
      { speaker: 'liubei', text: '云长还活着，夷陵也没烧起来。可我为何还是躺到了这里？原来人躲过自己的错，也躲不过岁月。', when: ['page:maicheng:yeshi', 'page:yiling:yeshi'] },
      { speaker: 'liubei', text: '云长还活着，夷陵的火却仍旧烧过。原来救下一个名字，并不会替我们免去下一场错。', when: ['page:maicheng:yeshi', '!page:yiling:yeshi'] },
      { speaker: 'liubei', text: '二弟走后，我总觉得每一天都是借来的。今日连借也没处借了，只得把阿斗和孔明都叫来。', when: '!page:maicheng:yeshi' },
      { speaker: 'zhuge', text: '陛下，病可医，话不可反着留。您今日想见的是臣，还是一个能替您背完蜀汉的人？' },
    ],
    intros: {
      '天命 · 沉疴': [
        { when: 'page:yiling:yeshi', bio: '夷陵的火没能烧尽季汉，它便换作药碗与更漏，慢慢收走刘备。', quote: '人可躲过战火，未必躲得过岁月。' },
        { bio: '它不用兵，也不出千，只把每一天都从病榻前拿走一点。', quote: '你能赢群雄，可能赢一场病？' },
      ],
    },
    map: [{
      id: 'last-words', node: 1, title: '永安宫 · 遗诏未落笔',
      lines: [
        { speaker: 'liubei', text: '我若说“君可自取”，是信你，还是把我不敢放下的江山压给你？孔明，你猜我写这句话时怕不怕？' },
        { speaker: 'zhuge', text: '主公若真信亮，便别把信任写成一道不许拒绝的命。臣要的不是自取，是您把阿斗该担的也留给他。' },
      ],
      choices: [
        { id: 'plain-words', text: '请他当面说尽未言之语', detail: '本回看破提升，记住病榻真言', effects: { keenEye: true, fact: 'baidi_plain_words' } },
        { id: 'adou-duty', text: '让阿斗先自己读完奏章', detail: '天命起手士气 -1，记住少主亲政', effects: { sow: 1, fact: 'baidi_adou_duty' } },
      ],
    }],
    battle: [
      { id: 'baidi-open', at: 'start', speaker: 'unknown', text: '你改得了人的命，改得了日出日落吗？' },
      { id: 'baidi-trust', at: 'hand:2', speaker: 'liubei', text: '我这一生卖过草鞋，也坐过皇位。临到最后，最怕的竟是阿斗离了人便站不住。' },
      { id: 'baidi-answer', at: 'hand:3', speaker: 'zhuge', text: '那便让他今日自己站起来。臣能辅他，不能替他活。' },
      { id: 'baidi-brother', at: 'low', speaker: 'guanyu', text: '大哥，麦城你没丢下我。今日也不许先丢下自己。', when: 'page:maicheng:yeshi' },
      { id: 'baidi-memory', at: 'low', speaker: 'liubei', text: '云长，若你还在，会不会又骂我只会哭？', when: '!page:maicheng:yeshi' },
    ],
    win: {
      text: '天光透进永安宫时，刘备推开药碗，自己坐了起来。他把“君可自取”四字从遗诏上划去，只写阿斗当亲政、孔明当尽言。那句沉重得无人敢接的托付，终于没有说出口。',
      hook: '病榻之后，南中又来急报。孟获不服王化，孔明却说要先擒住他的心。',
      choiceFact: 'liubei_survives',
    },
    loss: {
      text: '遗诏还是写完了。诸葛亮俯身接诏，刘备终于安心，却也把一座江山从此压在了他一个人的晨起与夜寐上。',
      clue: '史鉴 · 沉疴靠长久消耗取胜；重开时军资 +150，先保住自己的底池，再谈托孤之外的可能。',
      clueFx: 'supply',
    },
  },

  qiqin: {
    cast: ['zhuge', 'menghuo'],
    objective: '七战不只擒人，更要让孟获从恼怒、猜疑到自省，亲口决定南中的明天。',
    coldOpen: [
      { speaker: 'narrator', text: '泸水瘴气未散，第一根绊马索已经备好。诸葛亮却命人连孟获的酒碗也一并洗净。' },
      { speaker: 'menghuo', text: '你带多少兵，我借多少山。南中不是你地图上一块空着的地方！' },
      { speaker: 'zhuge', text: '我若只要你的降表，擒一次便够。我要的是你回去以后，不必再靠造反证明自己。' },
    ],
    intros: {
      menghuo: [
        { when: 'page:qiqin:yeshi', bio: '南中已经心服，他却仍愿回到泸水，看看那次服气是不是偶然。', quote: '服过一回，不等于让你再赢七回！' },
        { when: 'seen:menghuo', bio: '他记得上次未被擒满的七局，也记得你每一次把他放到何处。', quote: '上次没打完。南王说话算数，从头来！' },
        { bio: '他有山的硬、酒的直，也有一句宁死不肯先说出口的“服”。', quote: '先赢我，再跟我讲什么攻心！' },
      ],
    },
    map: [{
      id: 'heart-of-nanzhong', node: 1, title: '泸水 · 放人与收心',
      lines: [
        { speaker: 'menghuo', text: '你们汉人擒了王，不斩便囚。你若真放我，不怕我带更多人回来？' },
        { speaker: 'zhuge', text: '怕。所以我不只放你，还要让你的族人看清：回去以后，盐粮归谁，山路归谁，明日归谁。' },
      ],
      choices: [
        { id: 'listen-elders', text: '先听南中长者说完旧俗', detail: '本回看破提升，记住南中之约', effects: { keenEye: true, fact: 'qiqin_listen' } },
        { id: 'return-salt', text: '分出军粮盐巴，送俘虏回乡', detail: '军资 -100，孟获士气 -1', effects: { chips: -100, sow: 1, fact: 'qiqin_hearts' } },
      ],
    }],
    battle: [
      { id: 'qiqin-r1', at: 'start', speaker: 'menghuo', text: '一场便想让我低头？南中的山都不答应！', when: 'round:1' },
      { id: 'qiqin-r2', at: 'start', speaker: 'menghuo', text: '上次是绊马索，不是真本事。有胆再擒我一次！', when: 'round:2' },
      { id: 'qiqin-r3', at: 'start', speaker: 'menghuo', text: '我输在自己轻敌，不输你。下次我把藤甲、毒泉和旧友都带来。', when: 'round:3' },
      { id: 'qiqin-r4', at: 'start', speaker: 'menghuo', text: '你烧的是藤甲，不是南中人的心。我还是不服！', when: 'round:4' },
      { id: 'qiqin-r5', at: 'start', speaker: 'menghuo', text: '为何每次擒了都放？你到底要我服你，还是服你的汉律？', when: 'round:5' },
      { id: 'qiqin-r6', at: 'start', speaker: 'menghuo', text: '我若再回去起兵，倒显得南中只识刀枪。且坐下，把这一局打完。', when: 'round:6' },
      { id: 'qiqin-r7', at: 'start', speaker: 'menghuo', text: '不必再放。今日我若输，替南中认你；我若赢，你也留下喝我一碗酒。', when: 'round:7' },
      { id: 'qiqin-answer', at: 'hand:2', speaker: 'zhuge', text: '他每怒一次，便多问一次为何。别堵住他的问题，攻心才有门。' },
      { id: 'qiqin-low', at: 'low', speaker: 'menghuo', text: '你赢的是底池，我还没输南中。再来！', when: '!round:7' },
      { id: 'qiqin-low-seven', at: 'low', speaker: 'menghuo', text: '我若此刻翻脸，先对不起的是那六次回去的路。', when: 'round:7' },
    ],
    win: {
      text: '第七次，孟获没有等兵士解绳，自己把王冠放在案上：“丞相，七次不是我的耻辱，是你七次肯信我还能明理。”他转身向族人挥手，南中的鼓声第一次不为迎战而响。',
      hook: '南中既安，汉中灯亮。诸葛亮展开《出师表》，祁山在纸背等一条新路。',
      choiceFact: 'nanzhong_at_peace',
    },
    loss: {
      text: '孟获又一次走出营门，这次却没有回头。不是他不服，是你只记住了要放六次，忘了每一次都该让他多明白一点。',
      clue: '史鉴 · 七场连战会耗尽底池，擒人之前先留退路；重开时军资 +150，别为一时痛快孤注一掷。',
      clueFx: 'supply',
    },
  },

  qishan: {
    cast: ['zhuge', 'zhaoyun', 'caozhen'],
    objective: '把《出师表》从遗言写成开端，在祁山打通一条粮道与人心都能久行的北伐路。',
    coldOpen: [
      { speaker: 'zhuge', text: '隆中那一日，我说天下可分。如今先主把未尽之言交给我，我才懂三分不是答案，只是让人少流血的起点。', when: 'page:sangu:yeshi' },
      { speaker: 'zhuge', text: '草堂门开了多少次，我便欠门外人多少句答复。今日出师，不为证明卧龙多智，只为不再只写“来日”。', when: '!page:sangu:yeshi' },
      { speaker: 'zhaoyun', text: '丞相，常山赵子龙还能请先登。别因我白了头，便把我写成一面只供人回望的旧旗。' },
      { speaker: 'caozhen', text: '诸葛亮，你把国事写成一表，我把祁山写成一堵墙。看谁先被自己的字困住。' },
    ],
    intros: {
      caozhen: [
        { when: 'page:qishan:yeshi', bio: '祁山曾被走通过一次，他不再只守关隘，而要找出那条重新续上的粮路。', quote: '同样的山路，我不会让你走通第二次。' },
        { bio: '他守住的不是一座祁山，而是魏国以逸待劳、耗空季汉的老办法。', quote: '表写得再好，粮车也不会自己过山。' },
      ],
    },
    map: [{
      id: 'road-beyond-fire', node: 1, title: '祁山 · 不用火的进军',
      lines: [
        { speaker: 'zhaoyun', text: '曹真把我的旗号都画在册上，却把我白发的数目画多了。他以为老将只能做疑兵。' },
        { speaker: 'zhuge', text: '博望初用火时，诸将只问我何时再烧。今日偏不烧——祁山要争的是一条明年还能走的道。' },
      ],
      choices: [
        { id: 'zhaoyun-feint', text: '让子龙以旧旗佯攻斜谷', detail: '曹真起手士气 -1，记住常山疑兵', effects: { sow: 1, fact: 'qishan_zhaoyun_feint' } },
        { id: 'grain-road', text: '先修粮站，再谈进兵', detail: '军资 +200，记住祁山粮道', effects: { chips: 200, fact: 'qishan_grain_road' } },
      ],
    }],
    battle: [
      { id: 'qishan-open', at: 'start', speaker: 'caozhen', text: '六出祁山？你若能出六次，我便能守六次。季汉耗得起几个六年？' },
      { id: 'qishan-patience', at: 'hand:2', speaker: 'zhuge', text: '他以为持久便是原地不动。非也。能让粮与人持续向前，才叫持久。' },
      { id: 'qishan-veteran', at: 'hand:3', speaker: 'zhaoyun', text: '长坂坡我七进七出，不是为了让后人只记住一个“勇”字。今日看我怎样回来。' },
      { id: 'qishan-low', at: 'low', speaker: 'caozhen', text: '你不火攻，不奇袭，竟真把一步一营走成了攻势？' },
    ],
    win: {
      text: '祁山关门未破，山路却先活了：粮站一站接一站，赵云的旧旗从斜谷安然折返。曹真这才发现，诸葛亮要的不是一次入关，而是以后每次都能再来。',
      hook: '路既通，下一道门叫街亭。马谡已在帐中铺开地图，把山上圈得极重。',
      choiceFact: 'qishan_road_open',
    },
    loss: {
      text: '《出师表》被风掀回案上。你不是败在曹真那一堵墙，而是把北伐当成一局必须立刻赢下的豪赌，忘了山路要留给下一年。',
      clue: '史鉴 · 曹真借祁山消耗你的耐心；重开时假破绽减少，辨清他何时真守、何时等你抢进。',
      clueFx: 'keenEye',
    },
  },

  jieting: {
    cast: ['zhuge', 'masuo', 'wangping', 'zhanghe'],
    objective: '让马谡把“高处必胜”改写成当道与水源，在张郃抵达前守住街亭，也守住他的命。',
    coldOpen: [
      { speaker: 'masuo', text: '丞相，置之死地而后生，兵书写得明白。山上俯瞰街亭，张郃来多少，我便破多少。' },
      { speaker: 'wangping', text: '马参军，兵书也写水源。你圈的山头那么高，可曾看见士兵要下山几日才喝到水？' },
      { speaker: 'zhuge', text: '幼常，我让你守的不是一幅好看的阵图。今日若再无人敢驳你，错便先在我。' },
      { speaker: 'zhanghe', text: '山上的旗越整齐越好。那样我只需围住山下，等他替我军渴死。' },
    ],
    intros: {
      zhanghe: [
        { when: 'page:jieting:history', bio: '他已在街亭等到过一次山上的破绽，这一次连水道会从哪里断都知道。', quote: '山与水，你还会把哪一个留给敌人？' },
        { bio: '张郃不与你争一处漂亮阵地，只逼你承认地形之外还有时日与渴。', quote: '兵无常势。你却把山当成了常势。' },
      ],
    },
    map: [{
      id: 'water-before-height', node: 1, title: '街亭 · 先看水后看山',
      lines: [
        { speaker: 'masuo', text: '若我今日听王平，是全军都会说我纸上谈兵，还是我终于敢承认自己也有一页没读懂？' },
        { speaker: 'wangping', text: '参军，肯改军令不是丢脸。让弟兄们活着看见明早，才轮得到你我的脸面。' },
      ],
      choices: [
        { id: 'joint-order', text: '让马谡与王平共签守寨军令', detail: '张郃起手士气 -1，记住两人共守', effects: { sow: 1, fact: 'jieting_joint_order' } },
        { id: 'survey-water', text: '带马谡亲自踏勘山下取水路', detail: '本回看破提升，记住水源军图', effects: { keenEye: true, fact: 'jieting_water_survey' } },
      ],
    }],
    battle: [
      { id: 'jieting-open', at: 'start', speaker: 'zhanghe', text: '马谡在山上？那我不必急着仰攻。先问他营中水囊，还够几局。' },
      { id: 'jieting-wangping', at: 'hand:2', speaker: 'wangping', text: '他切粮道是假，试水道是真。别追那一面来回晃的旗。' },
      { id: 'jieting-masuo', at: 'hand:3', speaker: 'masuo', text: '传令，下寨当道。不是王平胜了我，是街亭比我的胜负要紧。' },
      { id: 'jieting-low', at: 'low', speaker: 'zhanghe', text: '你肯从山上下来，我便少了一半胜算。诸葛亮身边，竟有人肯认错。' },
    ],
    win: {
      text: '张郃抵达时，当道营寨已经咬住山口，取水队从后沟安然往返。马谡亲手划去图上的山顶大寨，诸葛亮没有挥泪，只让他与王平同坐，重写那份军令。',
      hook: '街亭守住，司马懿却转向西城。那里没有马谡，只有一张琴和敞开的门。',
      choiceFact: 'jieting_held',
    },
    loss: {
      text: '山上的喊声先乱，随后才是刀兵。诸葛亮要斩的似乎不只是马谡，还有那个明知他爱逞才、却仍把街亭交给他的自己。',
      clue: '史鉴 · 张郃会假攻粮道、实困水源；重开时其起手士气 -1，先守住底池再图反击。',
      clueFx: 'sow',
    },
  },

  kongcheng: {
    cast: ['zhuge', 'simayi'],
    objective: '把无兵可守变成司马懿不敢承受的代价，让琴声、城门与他的多疑各守一道防线。',
    coldOpen: [
      { speaker: 'narrator', text: '西城的门轴上了油，连一声吱呀也不肯出。城中老弱洒扫，城上只摆一张琴。' },
      { speaker: 'simayi', text: '博望的火、赤壁的风，我都复盘过。孔明，你今日又替我备了什么？' },
      { speaker: 'zhuge', text: '街亭未失，他却仍咬住西城。看来他不是来捉马谡，是来逼我亲手承认无兵。', when: 'page:jieting:yeshi' },
      { speaker: 'zhuge', text: '街亭的败报在袖中，城中的老弱在门下。仲达要看我的破绽，便给他一个最像真的。', when: '!page:jieting:yeshi' },
    ],
    intros: {
      simayi: [
        { when: 'page:kongcheng:yeshi', bio: '他曾在西城退过一次，此后每一声琴都像在提醒那次不敢输。', quote: '同一座城，我不会再替你退第二次。' },
        { when: 'page:jieting:yeshi', bio: '街亭没有替他耗空蜀军，他便亲自来读诸葛亮最险的一笔。', quote: '马谡没败，你便以为我也看不穿西城？' },
        { when: 'seen:simayi', bio: '他记得你的下注，也记得自己曾因算得太深而放走一座城。', quote: '这次我会少算一层，还是多算一层？' },
        { bio: '冢虎第一次坐到卧龙对面，最利的武器不是兵，而是肯多想一层。', quote: '城中若无人，你为何敢请我进？' },
      ],
    },
    map: [{
      id: 'tune-for-sima', node: 1, title: '城楼 · 琴要弹给谁听',
      lines: [
        { speaker: 'zhuge', text: '他若进城，我输；他若因不敢输而退，我们便赢。把城门再擦净些，别留半分欲盖弥彰。' },
        { speaker: 'you', text: '若他这次宁可犯错，也要进来看一看呢？' },
        { speaker: 'zhuge', text: '所以琴不能只求镇定，要让他听见：我已经把他不肯认错的后路，也算进伏兵里。' },
      ],
      choices: [
        { id: 'slow-qin', text: '把最后一遍琴弹得更慢', detail: '司马懿起手士气 -1，记住慢琴', effects: { sow: 1, fact: 'kongcheng_slow_qin' } },
        { id: 'dust-reinforce', text: '令斜谷尘土佯作援军', detail: '司马懿军资 -200，记住疑兵尘影', effects: { raid: true, fact: 'kongcheng_dust' } },
      ],
    }],
    battle: [
      { id: 'kongcheng-open', at: 'start', speaker: 'simayi', text: '城中无人，你便是虚；城中有伏，你便是险。我只需决定，哪一种错更便宜。' },
      { id: 'kongcheng-zhuge', at: 'hand:2', speaker: 'zhuge', text: '别看他的手，看他每加注一次便多怕一分的后果。空城卖的是他的顾忌。' },
      { id: 'kongcheng-you', at: 'hand:3', speaker: 'you', text: '他怕的不是伏兵，是一旦攻错，天下都会说他输给了空城。' },
      { id: 'kongcheng-low', at: 'low', speaker: 'simayi', text: '琴弦若断，我进；琴弦不断，我便还要想。孔明，你连断弦也舍得拿来骗我。' },
    ],
    win: {
      text: '琴音落到城下，司马懿终于勒马。他在三十里外回望空门：“我不是输给伏兵，是输给了不敢输。”诸葛亮掌心全是汗，却只让书童再添一炉香。',
      hook: '空城各输一口气，五丈原再算总账。这一次，司马懿决定连琴也不听。',
      choiceFact: 'kongcheng_retreat',
    },
    loss: {
      text: '魏军踏过城门时，琴声还维持着最后一个音。司马懿没有笑，只说：“你赌我怕错，我这次偏要付一次错的代价。”',
      clue: '史鉴 · 司马懿会衡量诈唬的代价，而非只看气势；重开时假破绽减少，别重复同一条下注线。',
      clueFx: 'keenEye',
    },
  },

  wuzhangyuan: {
    cast: ['zhuge', 'simayi', 'jiangwei'],
    objective: '在粮尽与秋风之前逼司马懿作答，并把诸葛亮从既定的星落里带回人间。',
    coldOpen: [
      { speaker: 'zhuge', text: '博望借火，赤壁借风，我一生都在借天时。此次不借了。你替我争一日，我便把这一日活完。' },
      { speaker: 'simayi', text: '西城我退得太快，这次我连你的琴也不听。你粮尽之日，便是我出兵之时。', when: 'page:kongcheng:yeshi' },
      { speaker: 'simayi', text: '我不问你有何伏兵，也不问你有何妙计。五丈原只比一件事：谁先耗尽。', when: '!page:kongcheng:yeshi' },
      { speaker: 'jiangwei', text: '丞相，药又凉了。您总说看完这道军报，可军报永远没有最后一道。' },
    ],
    intros: {
      simayi: [
        { when: 'asZhuge', bio: '这一次你亲手执起羽扇，冢虎终于不必隔着蜀营猜测卧龙的神色。', quote: '孔明，你终于肯亲自坐在我对面。' },
        { when: 'page:wuzhangyuan:yeshi', bio: '东南星明以后，他知道命数也会被赢走，却仍相信自己最懂消耗。', quote: '多活的岁月，也是岁月。我仍耗得起。' },
        { when: 'page:kongcheng:yeshi', bio: '空城的退兵成了他的旧伤；如今他用坚壁把旧伤磨成耐心。', quote: '上次我算你的城，这次我只算你的粮。' },
        { bio: '他把不战当作最长久的一注，等秋风替自己清掉对面的筹码。', quote: '你可以赢每一阵，我只要等到最后一夜。' },
      ],
    },
    map: [{
      id: 'one-more-day', node: 1, title: '武功水 · 向人间借一日',
      lines: [
        { speaker: 'jiangwei', text: '他不接战，军中便都劝丞相再催。可愈催，愈像替他证明秋风真的站在魏营。' },
        { speaker: 'zhuge', text: '伯约，屯田不是认输。让兵士知道明年有粮，让百姓知道今年不扰，我才不必向夜空多借那几年。' },
      ],
      choices: [
        { id: 'tuntian', text: '与民屯田，让粮道自己生长', detail: '军资 +200，记住渭滨屯田', effects: { chips: 200, fact: 'wuzhang_tuntian' } },
        { id: 'raid-grain', text: '斜谷出奇兵，反断魏军粮路', detail: '司马懿军资 -200，记住反客为主', effects: { raid: true, fact: 'wuzhang_counterraid' } },
      ],
    }],
    battle: [
      { id: 'wuzhang-open', at: 'start', speaker: 'simayi', text: '你送女装来，我便穿给诸将看。能让丈夫羞怒的，从来不叫胜负。' },
      { id: 'wuzhang-zhuge', at: 'hand:2', speaker: 'zhuge', text: '他不是无胆，是把我的命也算作盲注。别陪他等，要让他每不应一次都付出军资。' },
      { id: 'wuzhang-jiangwei', at: 'hand:7', speaker: 'jiangwei', text: '丞相，东南星还未暗。您先喝药，这一手我陪您看。' },
      { id: 'wuzhang-tuntian-low', at: 'low', speaker: 'zhuge', text: '仲达，新粮已经入仓。你等的那阵秋风，今年怕要迟到了。', when: 'fact:wuzhang_tuntian' },
      { id: 'wuzhang-sima-low', at: 'low', speaker: 'simayi', text: '你要星星再亮十年，我只等它暗一刻。看谁先撑不住。', when: '!fact:wuzhang_tuntian' },
    ],
    win: {
      text: '五丈原的灯没有灭。司马懿终于出战，又在武功水畔折损先手；诸葛亮趁隙让大军与粮道一同向前。天亮时，他推开药碗，写下另一篇出师表——不是借来十年，而是不再把每一天交给命数。',
      hook: '十四年很快。洛阳有人开始装病；这一次，卧龙尚在，旧局未清。',
      choiceFact: 'zhuge_survives',
    },
    loss: {
      text: '东南星暗下去时，司马懿仍没有出战。他不是赢了某一手，只是让你把所有“明日再做”都拖成了秋风里的盲注。',
      clue: '史鉴 · 坚壁把盲注拖成刀；重开时军资 +150，先手争粮，莫与他比谁更能空耗。',
      clueFx: 'supply',
    },
  },

  gaopingling: {
    cast: ['simayi', 'caoshuang', 'simashi', 'zhuge'],
    objective: '拆穿一坛专给曹爽看的病，在司马懿睁眼之前守住诏书、武库与曹魏最后的选择。',
    coldOpen: [
      { speaker: 'zhuge', text: '五丈原后，我与他又通了许多年的信。今日只寄来四字：勿信其病。他不是等死，是等你先把他当死人。', when: 'page:wuzhangyuan:yeshi' },
      { speaker: 'writer', text: '五丈原的星已经落过。如今没人替你看冢虎，只剩一碗故意洒在手背上的粥。', when: '!page:wuzhangyuan:yeshi' },
      { speaker: 'caoshuang', text: '他连粥都喂不进，还能夺我的兵权？我去看过三次，三次都是如此。' },
      { speaker: 'simashi', text: '父亲病成这样,师儿只能先持家中馈。将军若疑,何不亲自再探一次?', when: '!seen:simashi' },
      { speaker: 'simayi', text: '大将军……老朽只有一事，不放心。来日……还请你多照看我的两个儿子。' },
    ],
    intros: {
      simayi: [
        { when: 'page:gaopingling:yeshi', bio: '高平陵败过一次后，他不再只装病，连你的疑心也可能被他拿来布局。', quote: '同一帖药，我不会再煎第二遍。' },
        { when: 'page:wuzhangyuan:yeshi', bio: '五丈原没能熬走卧龙，他便把耐心带回洛阳，等另一个轻敌的人。', quote: '孔明尚在，正好。我要让他看看，熬得住不只是命。' },
        { bio: '他熬走过太多对手，如今把衰老演成最后一层甲，把曹爽的轻视养成刀。', quote: '老朽病得很重。大将军，你当然可以放心。' },
      ],
    },
    map: [{
      id: 'medicine-and-armory', node: 1, title: '高平陵 · 病榻外有刀',
      lines: [
        { speaker: 'caoshuang', text: '他若装病，骗的是我；他若真病，我此时动手，便坐实了欺辱老臣。你要我怎么办？' },
        { speaker: 'zhuge', text: '五丈原后我只教他一件事：耐心也是下注。你若不看底牌，便会把他的忍耐当成天命。', when: 'page:wuzhangyuan:yeshi' },
        { speaker: 'writer', text: '没有卧龙隔江提醒，你只能自己分辨：那碗粥喂给了病人，还是喂给了你的轻视。', when: '!page:wuzhangyuan:yeshi' },
      ],
      choices: [
        { id: 'read-prescription', text: '对照药方、更次与喂粥的人', detail: '本回看破提升，记住病榻伪证', effects: { keenEye: true, fact: 'gaoping_medicine' } },
        { id: 'guard-armory', text: '先护太后诏书与洛阳武库', detail: '司马懿军资 -150，记住先手守门', effects: { oppChips: -150, fact: 'gaoping_armory' } },
      ],
    }],
    battle: [
      { id: 'gaoping-open-alive', at: 'start', speaker: 'simayi', text: '孔明还活着，你也还爱多事。看来五丈原那一局，我确实输得不甘心。', when: 'page:wuzhangyuan:yeshi' },
      { id: 'gaoping-open-fallen', at: 'start', speaker: 'simayi', text: '孔明已不在。你们还有谁，肯把一个将死之人当作对手？', when: '!page:wuzhangyuan:yeshi' },
      { id: 'gaoping-caoshuang', at: 'hand:2', speaker: 'caoshuang', text: '他是在装？可满朝都看见了……你为何不早说！' },
      { id: 'gaoping-letter', at: 'hand:3', speaker: 'zhuge', text: '你若只会等他死，便永远看不见他怎样活。', when: 'page:wuzhangyuan:yeshi' },
      { id: 'gaoping-low', at: 'low', speaker: 'simayi', text: '你识破我的病，却识不破百官的怕。刀出鞘以后，他们自会站到我这边。' },
    ],
    win: {
      text: '粥碗落地，司马懿翻身而起，却见武库门已闭、太后诏已读。曹爽没有交出印绶，满朝也没有等来一场只能站队的清洗。冢虎第一次发现，满座聪明人并不都愿意陪他装睡。',
      hook: '司马家的刀暂回鞘中，三国却未停手。多年后，阴平小道响起裹毡滚崖之声。',
      choiceFact: 'sima_coup_stopped',
    },
    loss: {
      text: '曹爽交印时还相信能做个富家翁。司马懿没有立刻杀他，只让他慢慢想明白：那坛病不是骗一个人的眼睛，是喂大一群人的侥幸。',
      clue: '史鉴 · 他的虚弱多是诱饵，真正的强注藏在病后；重开时假破绽减少，别因摊牌前的示弱松手。',
      clueFx: 'keenEye',
    },
  },

  yinping: {
    cast: ['dengai', 'dengzhong', 'jiangwei', 'zhugezhan', 'zhugeshang', 'zhuge'],
    objective: '从摩天岭到绵竹设下两重回答，让邓艾的孤军无处落地，诸葛父子不必以死守名。',
    coldOpen: [
      { speaker: 'narrator', text: '阴平没有路，只有被雨冲淡的兽迹。邓艾命人裹毡滚崖，把自己的命也卷进了那层旧毡。' },
      { speaker: 'dengai', text: '都、都说阴平无路。无路，才没人拦我。' },
      { speaker: 'dengzhong', text: '父、父亲,忠先下探。绵竹若破,成都不战自降——这一程,儿替您蹚。', when: '!seen:dengzhong' },
      { speaker: 'zhugezhan', text: '父相在时,常叹我等生于安乐。今日绵竹在身后,成都岁余,瞻,退无可退。' },
      { speaker: 'zhugeshang', text: '祖父,父亲,儿孙三代之名,系于今日。尚,愿先登!' },
      { speaker: 'jiangwei', text: '沓中不能丢，成都也不能丢。最怕的不是两线作战，是每一处都以为另一处有人。' },
    ],
    intros: {
      dengai: [
        { when: 'page:yinping:yeshi', bio: '阴平曾让他撞上伏守，他却更相信绝境里总还有第二条兽径。', quote: '这、这次我换一处下山。你还等得到吗？' },
        { bio: '他说得结巴，行得决绝；所有人口中的不可能，都是他敢孤注一掷的理由。', quote: '山、山不会让人。可人会绕过山。' },
      ],
      dengzhong: [
        { when: 'seen:dengzhong', bio: '初阵绵竹让他尝过血,这次把父亲的险棋又往前推了一格。', quote: '父、父亲教我的,我教给你。' },
        { bio: '虎父之下的少年,急于证明「邓」字不只属于上一辈。', quote: '家父面前,休得无礼!' },
      ],
    },
    map: [{
      id: 'light-on-cliff', node: 1, title: '阴平 · 无人处先点灯',
      lines: [
        { speaker: 'zhuge', text: '旧札只有一句：阴平非道，守江油者不可撤。当年人人说它多虑，如今纸页比崖石还重。' },
        { speaker: 'jiangwei', text: '守住了哨位，还要守哨位之间的回音。否则一盏灯灭，百里仍以为自己看得见。' },
        { speaker: 'zhugezhan', text: '父相旧札我读了三遍:「阴平非道,守江油者不可撤」。哨位要设在能互相看见的地方。', when: 'page:jieting:yeshi' },
      ],
      choices: [
        { id: 'three-beacons', text: '依旧札设三处互望烽哨', detail: '本回看破提升，记住绝壁灯火', effects: { keenEye: true, fact: 'yinping_beacons' } },
        { id: 'grain-ambush', text: '迁走江油粮道，反设空仓诱敌', detail: '邓艾军资 -200，记住空仓之计', effects: { raid: true, fact: 'yinping_empty_granary' } },
      ],
    }],
    battle: [
      { id: 'yinping-open', at: 'start', speaker: 'dengai', text: '我、我身后没有粮，脚下没有路。你猜我除了向前，还能往哪儿退？' },
      { id: 'yinping-jiangwei', at: 'hand:2', speaker: 'jiangwei', text: '别追他的将旗。裹着毡的才是他，走得最慢的辎重才藏着全军活路。' },
      { id: 'yinping-zhan', at: 'hand:3', speaker: 'zhugezhan', text: '高处不是胜势,能守住水与退路才是。绵竹的阵,瞻替父相补上这一课。', when: 'page:jieting:yeshi' },
      { id: 'yinping-shang', at: 'hand:3', speaker: 'zhugeshang', text: '邓忠!我祖我父之名在此——我的枪,比你的快!', when: 'multi' },
      { id: 'yinping-low', at: 'low', speaker: 'dengai', text: '山都让我过了，你、你以为几堆石头便能留住我？' },
    ],
    win: {
      text: '摩天岭上先有灯，再有滚木。邓艾抬头时，江油的空仓也已落锁；这条以命换出来的奇路，终于成了绝路。姜维收好旧札，没有庆功，只先给三处烽哨添了灯油。',
      hook: '蜀地守住，建业的潮声却渐低。旧史只剩最后一句：三分归晋。',
      choiceFact: 'yinping_held',
    },
    loss: {
      text: '邓艾落地时，身后只剩一层磨穿的毡。江油开门不是因为城中无勇，而是所有人都把阴平的那一句“不可能”当成了守备。',
      clue: '史鉴 · 邓艾以孤军不断抢进，退守只会替他省粮；重开时敌军军资 -200，抢先压住他的落地之势。',
      clueFx: 'raid',
    },
  },

  guijin: {
    cast: ['simayan', 'wangjun', 'duyu', 'sunhao', 'cenhun', 'writer'],
    objective: '在“天下归一”落笔前打完三国最后一局，证明合并不必等于抹掉所有人的名字。',
    coldOpen: [
      { speaker: 'simayan', text: '华容那一刀早落过，北方却照样换了人间。你们总说能改命，最后不还是由我司马氏收场？', when: ['choice:huarong:yeshi', '!choice:huarong:yeshiB'] },
      { speaker: 'simayan', text: '华容你肯放曹操，是给魏续了一口气。可惜那口气最后姓了司马，你的“义”又救了谁？', when: 'choice:huarong:yeshiB' },
      { speaker: 'wangjun', text: '楼船百丈,铁锁千寻。王濬在益州造了七年船,只为这一趟顺流。', when: '!seen:wangjun' },
      { speaker: 'duyu', text: '羊公临终荐预。荆州的人心他已经收好了,预只欠一场水涨。', when: '!seen:duyu' },
      { speaker: 'sunhao', text: '铁锁横江,天堑自在。晋人的楼船?让他们先问过江里的石头!' },
      { speaker: 'cenhun', text: '陛下放心,岑昏再加三道锁,火烧不断,水淹不透!' },
      { speaker: 'writer', text: '这是旧史最后一页。你若赢，“天下归一”便不再是唯一能写完的句子。' },
    ],
    intros: {
      simayan: [
        { when: 'page:guijin:yeshi', bio: '他曾被迫承认归并非唯一结局，因此再来时更想把所有可能一并收回。', quote: '上次你留下三面旗。这次朕连旗杆也要收走。' },
        { bio: '他继承的不只是三国疆土，还有祖父最懂的那种等待：等所有人都厌倦。', quote: '你们打了一辈子，最后还不是要一个“合”字？' },
      ],
      wangjun: [
        { when: 'seen:wangjun', bio: '上一场江风让他记住了你,这次连火炬都备了两份。', quote: '烧、烧不断的是我的船。再来!' },
        { bio: '七十岁还想封侯的老将,把半生都押在了这条江上。', quote: '楼船下益州。金陵王气,收在此行。' },
      ],
    },
    map: [{
      id: 'names-under-unification', node: 1, title: '石头城 · 降表外的姓名',
      lines: [
        { speaker: 'simayan', text: '朕给建业留全城性命，给蜀主留安乐封号。你们还要什么？难道割据一生的名字，比太平更要紧？' },
        { speaker: 'you', text: '太平若只准一个人命名，下一次分裂时，便又只有刀能说话。' },
        { speaker: 'writer', text: '别只替英雄争座位。看看降表背面，那些没被写进去的人，才真正等了三代。' },
      ],
      choices: [
        { id: 'record-people', text: '先记下降表背后的百姓姓名', detail: '本回看破提升，记住万民之史', effects: { keenEye: true, fact: 'guijin_people' } },
        { id: 'three-flags', text: '重列三国旧旗，再争最后一局', detail: '司马炎起手士气 -1，记住三分余响', effects: { sow: 1, fact: 'guijin_three_flags' } },
      ],
    }],
    battle: [
      { id: 'guijin-open', at: 'start', speaker: 'simayan', text: '魏熬走了蜀，晋又接过了魏。你看，等待比你们的奇谋都长久。' },
      { id: 'guijin-writer', at: 'hand:2', speaker: 'writer', text: '他把“归一”当作底牌，你便不必比他更像天命。让他证明，凭什么只能如此。' },
      { id: 'guijin-you', at: 'hand:3', speaker: 'you', text: '合不是把三个名字磨成一个，是让下一个名字出现时，不必先掀起一场乱世。' },
      { id: 'guijin-low', at: 'low', speaker: 'simayan', text: '没有朕来收场，你们还要打多少年？你敢把这句话也说给城中百姓听吗？' },
    ],
    win: {
      text: '楼船在江心停下，建业没有献出降表。司马炎看着三分旧旗，第一次问：“若天下不是一件战利品，朕还能留下什么？”没有人能替他作答，但城中粮市第二天照常开了门。',
      hook: '卷四写尽，纸背却还有一页。写卷人已摆好牌：他要与你谈谈这些被改过的命。',
      choiceFact: 'jin_unification_stopped',
    },
    loss: {
      text: '石头城终于挂出晋旗。百姓确实等来了太平，只是旧史把所有人的名字越写越小，最后只留下“归晋”二字。',
      clue: '史鉴 · 司马炎借归一大势持续施压；重开时敌军军资 -200，别替他提前相信结局。',
      clueFx: 'raid',
    },
  },

  zuizhong: {
    cast: ['writer'],
    objective: '让写卷人承认你不是他的注脚；赢下最后一局，在封卷、还史、撕卷之间决定全书的去处。',
    coldOpen: [
      { speaker: 'writer', text: '白门楼你让吕布活下，后来每个人都多了一条本不该有的路。你以为我没看见？我每一笔都记着。', when: 'fact:lvbu_lives' },
      { speaker: 'writer', text: '麦城你救下关羽，我便看着夷陵少了理由、白帝城少了遗恨。可你没有救下所有遗憾，对不对？', when: 'page:maicheng:yeshi' },
      { speaker: 'writer', text: '麦城的雪仍在，夷陵的火也曾等着。你救过一些人，也亲手翻过一些来不及救的页。', when: '!page:maicheng:yeshi' },
      { speaker: 'writer', text: '封卷，留住你的野史；还史，归还原来的命；撕卷，让往后不再有人预知。赢我，这三件事才轮得到你。' },
    ],
    intros: {
      '写卷人': [
        { when: 'page:zuizhong:yeshi', bio: '他记得你曾把结局带出这一页，却仍不肯承认书只能有一种归处。', quote: '又回来改答案？这次连我也不替你记着。' },
        { when: 'fact:zhuge_survives', bio: '他看见东南星仍亮，也知道你救下孔明之后，历史并没有因此变轻。', quote: '你救过他一次，便真懂怎样救人了吗？' },
        { bio: '他知道你翻过的每一页，却第一次坐在只能验牌、不能预设结果的位置。', quote: '我写过你的来路。现在，让我看看你的选择。' },
      ],
    },
    map: [],
    battle: [
      { id: 'zuizhong-open-survivor', at: 'start', speaker: 'writer', text: '五丈原那颗星还亮着。你以为救下孔明是答案？那只是让仲达多了一个不能靠等待赢的人。', when: 'fact:zhuge_survives' },
      { id: 'zuizhong-open-fallen', at: 'start', speaker: 'writer', text: '五丈原的秋风我留着。你可以赢司马懿，却未必背得动一个非死不可的人。', when: '!fact:zhuge_survives' },
      { id: 'zuizhong-seal', at: 'hand:2', speaker: 'writer', text: '封卷，我把这些野史装帧成书。他们会活在你改过的那一页，却永远到不了下一页。' },
      { id: 'zuizhong-return', at: 'hand:3', speaker: 'writer', text: '还史，我把笔墨收回。麦城的雪、五丈原的风照旧，你只带走自己见过他们的记忆。' },
      { id: 'zuizhong-tear', at: 'hand:4', speaker: 'writer', text: '撕卷，谁都可能再活一次，谁都可能再死一次。没有底稿，也没有我替你兜底。' },
      { id: 'zuizhong-huarong-spare', at: 'hand:5', speaker: 'writer', text: '华容你放走曹操，信一个“义”字能抵过后患。今日再问你：敢不敢信未知也能抵过结局？', when: 'choice:huarong:yeshiB' },
      { id: 'zuizhong-huarong-strike', at: 'hand:5', speaker: 'writer', text: '华容你让刀落下，改了一个奸雄的命，改不了后人争位。撕卷也不会替你免去选择。', when: ['choice:huarong:yeshi', '!choice:huarong:yeshiB'] },
      { id: 'zuizhong-low', at: 'low', speaker: 'writer', text: '我知你每一张旧牌，却不知下一张。读者，这就是我肯坐下与你赌的原因。' },
    ],
    win: {
      text: '写卷人推开牌，第一次没有替你写结局。桌上并排放着封绳、旧史与一把无刃的裁纸刀：封卷，留住所改；还史，承担所失；撕卷，交还未知。你伸手时，整本书都在等。',
      hook: '三个答案都在下一问里。你选择的不是结局，而是谁有权写下结局。',
    },
    loss: {
      text: '他提笔在你的名字旁添了一个“又”字，所有改写便退回页边。可他没有抹去你坐过的位置——那说明下一次，他仍需要你来。',
      clue: '史鉴 · 写卷人熟知你的旧策，却只能按牌理下注；重开时假破绽减少，别被他的全知语气吓退。',
      clueFx: 'keenEye',
    },
  },

  tianshui: {
    cast: ['zhuge', 'zhaoyun', 'jiangwei', 'weiyan', 'guanxing', 'zhangbao'],
    objective: '识破冀城少年的每一步先手,把北伐最大的意外之得,请进蜀营。',
    coldOpen: [
      { speaker: 'narrator', text: '一出祁山,三郡响应。诸葛亮亲自设伏天水,却见城头一少年按图布防,把丞相的疑兵一一识破。' },
      { speaker: 'zhaoyun', text: '某自长坂以来,未逢敌手。今日天水城下,这少年的枪,竟逼得某拨马而回。' },
      { speaker: 'jiangwei', text: '老将军莫怪。维自幼读丞相兵法,今日不过是,替守城的弟兄们,把它原样还回去。' },
      { speaker: 'zhuge', text: '子龙一生谨慎,能令他「拨马而回」的人,亮必亲往会之。' },
      { speaker: 'guanxing', text: '丞相,兴愿随军!听说是同辈人,某这口刀,也想会会他。' },
    ],
    intros: {
      jiangwei: [
        { when: 'seen:jiangwei', bio: '他记得你怎样一步步卸掉他的先手,这次把阵扎在了你要来的路上。', quote: '又来?这次,先手在我。' },
        { bio: '冀城天水之间的少年郡吏,兵法是偷学的,忠义是自家的。', quote: '姜维在此。丞相的计,某接得住。' },
      ],
    },
    map: [{
      id: 'young-reader', node: 1, title: '天水 · 他在读你',
      lines: [
        { speaker: 'zhuge', text: '亮布疑兵,他识疑兵;亮调粮道,他护粮道。此子用兵,倒像是把亮的旧稿先读了一遍。' },
        { speaker: 'weiyan', text: '丞相,何须费事?文长领一军,连夜拿下冀城,人自然到手!' },
        { speaker: 'zhangbao', text: '魏将军急什么!丞相要的不是城,是那个人。俺爹说过,抢来的不服,请来的才真。' },
        { speaker: 'you', text: '他现在守的,是郡守的命令。要赢他,得先让他发现,自己真正想守的是什么。' },
      ],
      choices: [
        { id: 'mirror-plan', text: '以丞相旧稿反设一局', detail: '本回看破提升,记住镜像之局', effects: { keenEye: true, fact: 'tianshui_mirror' } },
        { id: 'open-letter', text: '阵前递去丞相手书一封', detail: '军资 +120,姜维起手士气 -1', effects: { chips: 120, sow: 1, fact: 'tianshui_letter' } },
      ],
    }],
    battle: [
      { id: 'tianshui-open', at: 'start', speaker: 'jiangwei', text: '丞相的疑兵,某已拆过一遍。你,是第二遍吗?' },
      { id: 'tianshui-zhaoyun', at: 'hand:2', speaker: 'zhaoyun', text: '少年,你的枪是快。可你在守的是马遵的城,不是你自己的心。' },
      { id: 'tianshui-mirror', at: 'hand:3', speaker: 'narrator', text: '他照旧稿布的阵,被你用同一份旧稿反锁。少年盯着阵图,忽然发现自己烂熟于胸的,竟是蜀营的路数。', when: 'fact:tianshui_mirror' },
      { id: 'tianshui-low', at: 'low', speaker: 'zhuge', text: '伯约,亮不夺你的城。亮只想问你一句:你的兵法,可愿有个用它的天下?' },
    ],
    win: {
      text: '冀城开城的那天,姜维单骑出降,甲胄未卸,先向蜀营深深一揖。诸葛亮下车扶住他:"亮平生所学,今有传人。"赵云在一旁按枪而笑。此后北伐的每一次点将,名单上多了一个年轻的、读遍丞相旧稿的名字。',
      hook: '得了姜维,北伐的旗更急。可街亭的名字,已在军图上冷冷地亮了起来。',
    },
    loss: {
      text: '你急于收服,反被少年将计就计。天水城门合拢的那一刻,他站在城头轻声说:"丞相之才,某敬佩。可某的枪,只为守土而出。"',
      clue: '史鉴 · 姜维赢在先手,不在兵多。重开时先递信、后设局;让他自己走过来,别去追他。',
      clueFx: 'sow',
    },
  },

  chencang: {
    cast: ['zhuge', 'haozhao', 'weiyan', 'jiangwei', 'guanxing'],
    objective: '在云梯与火箭之间,找到郝昭守城的理由,再决定陈仓该不该破。',
    coldOpen: [
      { speaker: 'narrator', text: '陈仓城小而坚,守将郝昭,不过千人。蜀军云梯、冲车、地道轮番上阵,城头的火箭一一点名。' },
      { speaker: 'haozhao', text: '诸葛丞相的攻具,昭领教二十日了。城小,好在要守的也少。' },
      { speaker: 'zhuge', text: '郝伯道守城有法,强攻徒损将士。伯约,你说,困城先困什么?' },
      { speaker: 'jiangwei', text: '维以为,困城先困心。郝昭同乡靳详在军中,可先劝降,探他守志。' },
      { speaker: 'weiyan', text: '二十日了!再劝下去,长安的援军就到了。丞相,给文长三日益,必破此城!' },
    ],
    intros: {
      haozhao: [
        { when: 'seen:haozhao', bio: '他记得你的每一种攻具,城头又添了三排火箭。', quote: '云梯?冲车?还是地道?我都备好了。' },
        { bio: '千人守孤城,守的从来不是城,是一个「信」字。', quote: '昭受魏恩,城在人在。请丞相换法子吧。' },
      ],
      wangshuang: [
        { when: 'seen:wangshuang', bio: '他的流星锤记过你的将,也记过自己的轻进。', quote: '这次跟紧大队!锤下不留情!' },
        { bio: '陇西大汉,先登的奖赏他背了一路。', quote: '王双在此!谁的头,配我的锤?' },
      ],
    },
    map: [{
      id: 'siege-letters', node: 1, title: '散关 · 云梯与书信',
      lines: [
        { speaker: 'haozhao', text: '昭知丞相必得陈仓而后去。只可惜,陛下给的城,昭一寸也不让。' },
        { speaker: 'zhuge', text: '他不肯降,是信魏,还是信他身后无人肯守?攻具要继续,信,也要继续。' },
        { speaker: 'guanxing', text: '丞相,兴押粮时数过:城中炊烟,一日淡过一日。' },
        { speaker: 'you', text: '那就比谁先到——他的粮尽,还是长安的援军。' },
      ],
      choices: [
        { id: 'count-smoke', text: '以炊烟计城中存粮', detail: '本回看破提升,记住炊烟之数', effects: { keenEye: true, fact: 'chencang_smoke' } },
        { id: 'cut-relief', text: '伏兵散关,截长安援军', detail: '魏军起手军资 -200,记住断援', effects: { raid: true, fact: 'chencang_cut' } },
      ],
    }],
    battle: [
      { id: 'chencang-open', at: 'start', speaker: 'haozhao', text: '又是云梯。昭说过了——换法子吧,丞相。' },
      { id: 'chencang-fire', at: 'hand:2', speaker: 'narrator', text: '火箭如雨,云梯成排地烧。城头那个瘦削的身影,二十日来没有离开过一步。' },
      { id: 'chencang-shuang', at: 'hand:3', speaker: 'wangshuang', text: '郝昭撑住!王双的援军到了——呔!追兵也敢跟这么紧?!' },
      { id: 'chencang-low', at: 'low', speaker: 'zhuge', text: '罢。传令:敛兵,回汉中。陈仓虽在,郝伯道之名,亮记下了。' },
    ],
    win: {
      text: '退军的路上,王双追来,却一头撞进你布在散关的伏兵。斩王双,退大军,陈仓的城头,郝昭扶着垛口望了许久。他守住了城,诸葛亮赢得了整个陇右的从容——这一仗,两人都没有输。',
      hook: '陈仓虽退,北伐的心没有退。渭水上游,一场更大的对峙正在蓄水——这一次,对手是司马。',
    },
    loss: {
      text: '攻城的第二十日,云梯烧尽了,长安的援军也到了。你在陈仓城下学会了同一件事:有些城,强攻不动;有些将,劝降不动。',
      clue: '史鉴 · 郝昭以「守」待「攻」,你的每一步攻具都在替他点名。重开时先断援军、再数炊烟,等他的粮替你说话。',
      clueFx: 'keenEye',
    },
  },

  shangfanggu: {
    cast: ['zhuge', 'simayi', 'simazhao', 'weiyan', 'yangyi'],
    objective: '把司马懿父子诱入葫芦谷,在雨落下之前,让火替蜀军说最后一句话。',
    coldOpen: [
      { speaker: 'narrator', text: '渭水南岸,蜀军屯田,魏军筑垒。上方谷口堆满干柴,只等司马懿自己走进来。' },
      { speaker: 'simayi', text: '孔明屯田,是邀孤决战;孤偏不战。他若退,孤追——只追到谷口为止。' },
      { speaker: 'simazhao', text: '父亲,蜀军粮车连日向北原移动,孩儿愿领一军,探他虚实。' },
      { speaker: 'zhuge', text: '司马懿不是不肯来,是不肯一个人来。那就给他的儿子,一个非来不可的理由。' },
      { speaker: 'yangyi', text: '丞相,木牛流马三十车已备,每车都做了记号——威公保证,一车都不会真丢。' },
    ],
    intros: {
      simayi: [
        { when: 'page:kongcheng:yeshi', bio: '西城的琴声之后,他更信「孔明之退皆有伏」,这份疑心,正是你要的锁。', quote: '琴我听过一次。这次,我只信我的眼睛。' },
        { when: 'seen:simayi', bio: '他仍旧闭目养神,可耳听八方——你在谷口做的每一处记号,他都想知道。', quote: '把你的粮车再往前挪一里。孤,看着。' },
        { bio: '冢虎不出洞,除非洞外的人,替他把洞口的石头搬开。', quote: '孔明啊孔明,你的耐心,终究要输给岁数。' },
      ],
      simazhao: [
        { when: 'seen:simazhao', bio: '他领教过你的伏笔,这次把父亲的谨慎折了一半,添进自己的果决。', quote: '父亲的谨慎我学一半。另一半,我改。' },
        { bio: '随军的次子,眼睛却总盯着帅帐里那把还没坐热的椅子。', quote: '小将军司马昭,代父巡谷。' },
      ],
    },
    map: [{
      id: 'granary-carts', node: 1, title: '北原 · 粮车之饵',
      lines: [
        { speaker: 'weiyan', text: '丞相,诱敌的差事,该文长去了!司马懿若肯入谷,文长愿领五百人,替他关谷门!' },
        { speaker: 'zhuge', text: '文长守谷门,孤放心。只是记住——火起之后,门要关得快,开得更快。' },
        { speaker: 'yangyi', text: '粮车、干柴、火油,账目在此。丞相,威公只提醒一句:天,三月无雨了。' },
        { speaker: 'you', text: '无雨的天,是火的朋友,也是雨的前奏。这一局,要赢得比天气快。' },
      ],
      choices: [
        { id: 'watch-sky', text: '先观云脚,择干燥日纵火', detail: '本回看破提升,记住天时之择', effects: { keenEye: true, fact: 'shangfanggu_sky' } },
        { id: 'burn-carts', text: '弃三十车粮,佯败入谷', detail: '魏军起手军资 -200,记住弃粮之饵', effects: { raid: true, fact: 'shangfanggu_carts' } },
      ],
    }],
    battle: [
      { id: 'shangfanggu-open', at: 'start', speaker: 'simayi', text: '粮车北移,营垒东倾。孔明,你的每一步,都在请孤入谷。' },
      { id: 'shangfanggu-zhao', at: 'hand:2', speaker: 'simazhao', text: '父亲!粮车乱了,蜀军真的败了——追不追,就在此刻!', when: 'multi' },
      { id: 'shangfanggu-fire', at: 'hand:3', speaker: 'weiyan', text: '谷门——落!火箭,上!今日便叫魏军知道,什么叫进得来,出不去!' },
      { id: 'shangfanggu-low', at: 'low', speaker: 'simayi', text: '中计了……我父子三人,竟要毕命于此谷?罢了,罢了!' },
    ],
    win: {
      text: '火起时,谷口的牌局已经收官。司马懿仰头看天,乌云正从山后压过来——可这次,雨落在火烧完之后。他从灰烬里被扶出来,半晌只说了一句:「天意犹在,人事先尽。」渭南的魏军,从此再不出垒。',
      hook: '上方谷的火没能烧尽司马氏,却烧掉了他们的傲气。渭滨的秋风,就要替这场对峙收尾。',
    },
    loss: {
      text: '雨比你的火快了半刻。谷中父子在雨里放声大笑,笑声比火更烫。你终于明白:算尽了人事的人,输给天时,最痛。',
      clue: '史鉴 · 司马懿入谷前会反复试探。重开时先观云再纵火,弃粮之饵能减其军资 200——别让天气先亮牌。',
      clueFx: 'raid',
    },
  },

  tielongshan: {
    cast: ['jiangwei', 'simazhao', 'guohuai', 'xiahouba', 'zhangyi'],
    objective: '围住铁笼山的人,先要算赢解围的人——替姜维保住陇右这一手棋。',
    coldOpen: [
      { speaker: 'narrator', text: '姜维背水列阵,大破魏军于洮水,把司马昭围在了铁笼山上。山上无水,山下的人却带来了羌兵的火。' },
      { speaker: 'jiangwei', text: '司马昭困守无水之山,三日内必降。维只担心一件事——郭淮的援军,会借羌人的路。' },
      { speaker: 'simazhao', text: '山上掘三丈不得泉……父亲常说,困局先算援手。郭伯济,你会来吗?' },
      { speaker: 'guohuai', text: '羌人反复,魏蜀皆用。老夫此去,不必破姜维,只要让羌人的火,烧回他自己的营。', when: '!seen:guohuai' },
      { speaker: 'xiahouba', text: '伯约!夏侯霸降蜀三年,今日方知:陇右的每一寸,都是旧相识。' },
    ],
    intros: {
      guohuai: [
        { when: 'seen:guohuai', bio: '定军山的老对手还记得你的山,这次把援军藏进了羌帐。', quote: '上次你占了高地。这次,我借了风。' },
        { bio: '关西三十年,他最懂「借」字——借羌,借水,借你围城的耐心。', quote: '郭淮不与你斗围。我只拆你的围。' },
      ],
      simazhao: [
        { when: 'page:shangfanggu:yeshi', bio: '上方谷的雨救过他一次,他从此信「困局自有天意」。', quote: '又困我?上次的雨,这次也会来。' },
        { when: 'seen:simazhao', bio: '他尝过被围的滋味,这次在山上镇定得反常。', quote: '困我三日?我等得起。你呢?' },
        { bio: '被围的次子不慌,因为他的镇定本身就是疑兵。', quote: '姜将军,山高风大,你的粮,吹得散。' },
      ],
    },
    map: [{
      id: 'qiang-road', node: 1, title: '洮水 · 羌人的路',
      lines: [
        { speaker: 'xiahouba', text: '伯约,羌人与魏人眉来眼去三日了。雍州的事,仲权看了半辈子——他们只认粮,不认旗。' },
        { speaker: 'jiangwei', text: '维背水一战,已无退路。若羌人倒向郭淮,山上山下,就要换一个围法。' },
        { speaker: 'zhangyi', text: '将军,张翼愿领一军扼住羌道。翼位卑,可这一步棋,差不得。' },
        { speaker: 'you', text: '围山的人最怕两件事:山上的水,和山外的路。水他没找到,路,还在你手里。' },
      ],
      choices: [
        { id: 'hold-qiang', text: '先稳羌部,断郭淮之援', detail: '本回看破提升,记住羌道之要', effects: { keenEye: true, fact: 'tielongshan_qiang' } },
        { id: 'rush-hill', text: '趁无水速攻,先取山寨', detail: '军资 +150,山上守军士气 -1', effects: { chips: 150, sow: 1, fact: 'tielongshan_rush' } },
      ],
    }],
    battle: [
      { id: 'tielongshan-open', at: 'start', speaker: 'simazhao', text: '姜维,你围得住山,围不住天。三日后,自有你的败报。' },
      { id: 'tielongshan-guo', at: 'hand:2', speaker: 'guohuai', text: '羌帐已应老夫。姜将军,你的背后,还站得住人吗?' },
      { id: 'tielongshan-wing', at: 'hand:3', speaker: 'zhangyi', text: '羌道还在我手里!将军只管攻山——张翼的阵地,羌人过不来!', when: 'fact:tielongshan_qiang' },
      { id: 'tielongshan-low', at: 'low', speaker: 'jiangwei', text: '丞相,维又差一步……不,还差的那一步,维自己走!' },
    ],
    win: {
      text: '羌道未失,郭淮的「借」字落了空。铁笼山上,司马昭捧着最后一皮囊水解了渴,然后望着山下纹丝不动的蜀军营垒,第一次主动议和退兵。姜维没有追——洮水大胜,陇右的城一座座开了门,北伐的路,又宽了一程。',
      hook: '陇右烽烟未熄,淮南的檄文已至洛阳——魏国的土地上,连着三年,燃起了三把同名的火。',
    },
    loss: {
      text: '羌人的火从你背后烧起,铁笼山上的司马昭在雨里大笑。姜维引兵退回剑阁时,回头看了一眼那座山——围局如牌局,他终于信了这句话。',
      clue: '史鉴 · 郭淮赢在「借外势」,不在兵锋。重开时先定羌部再攻山;你的围,输给的一定是山外的路。',
      clueFx: 'keenEye',
    },
  },

  huainan: {
    cast: ['simashi', 'simazhao', 'guanqiujian', 'wenqin', 'zhugedan', 'wenyang'],
    objective: '在淮南三叛的连局里,读出忠义与侥幸的分界,替檄文找到它该送达的人。',
    coldOpen: [
      { speaker: 'narrator', text: '司马懿死后第二年,淮南第一道讨贼檄文竖起。此后四年,同样的火在这片土地上烧了三次。' },
      { speaker: 'guanqiujian', text: '司马师废帝自立,天地不容!淮南六军,今日只问一句:魏,还是司马?' },
      { speaker: 'simashi', text: '淮南又反。父亲留下的局面,师来收。眼疾再痛,也得亲征。' },
      { speaker: 'wenqin', text: '毌丘将军,文钦父子三千骑,愿为先锋!冲中军,擒司马师!' },
      { speaker: 'wenyang', text: '爹,夜里劫营,儿的枪先出。乐嘉城的魏旗,一夜就换!' },
    ],
    intros: {
      guanqiujian: [
        { when: 'seen:guanqiujian', bio: '辽东刻石的老将仍在等,等第二封没人敢回的檄文。', quote: '石头再硬,也要刻第二遍。' },
        { bio: '他刻过辽东的功勋,如今要刻司马氏的罪。', quote: '此檄一出,成败在天,名义在我。' },
      ],
      wenqin: [
        { bio: '勇而无谋的谯郡男儿,嗓门与胆气一样大。', quote: '怕死的不姓文!冲!' },
      ],
      zhugedan: [
        { when: 'seen:zhugedan', bio: '寿春的火他见过一次,这次把城墙又加高了三尺。', quote: '再守一次。反正天下人只记得我反了。' },
        { bio: '诸葛家的「狗」,咬得最凶,也最孤独。', quote: '宁作断头鬼,不姓司马!' },
      ],
      wenyang: [
        { bio: '十八岁的枪,追兵的梦。', quote: '谁敢追?文鸯在此!' },
      ],
      leshen: [
        { bio: '他守着父亲留下的淮南,守着乐进家的门楣。', quote: '家父的阵,我一步没改。' },
      ],
    },
    map: [{
      id: 'three-fires', node: 1, title: '项城 · 同名的火',
      lines: [
        { speaker: 'simazhao', text: '兄长眼里有瘤,仍要亲征淮南。我留在洛阳——不是怯,是要看着朝堂上每一双眼睛。' },
        { speaker: 'guanqiujian', text: '第一叛败于粮,第二叛败于疑,第三叛……老夫等不到了。后来的人,替我把檄文写完。' },
        { speaker: 'wenyang', text: '寿春城破那日,儿单骑七进七出。爹叫我走,我就走——留这条命,接着反!' },
        { speaker: 'you', text: '三把火,烧的是同一句话。你要读的是:哪一缕烟,是忠;哪一缕,只是不甘。' },
      ],
      choices: [
        { id: 'read-manifesto', text: '细读檄文署名与粮册', detail: '本回看破提升,记住檄文之别', effects: { keenEye: true, fact: 'huainan_read' } },
        { id: 'aid-shouchun', text: '护檄文东传,连结东吴', detail: '军资 +150,记住外援之约', effects: { chips: 150, fact: 'huainan_wu' } },
      ],
    }],
    battle: [
      { id: 'huainan-open', at: 'start', speaker: 'guanqiujian', text: '魏的将,司马的兵——诸位,你们的刀,究竟听谁的?!' },
      { id: 'huainan-yang', at: 'hand:2', speaker: 'wenyang', text: '追兵百骑?文鸯回头——一枪一个,排好队!', when: 'round:2' },
      { id: 'huainan-dan', at: 'hand:3', speaker: 'zhugedan', text: '寿春的粮,够守一年。你们司马家的刀,先钝!先冷!', when: 'round:2' },
      { id: 'huainan-low', at: 'low', speaker: 'simazhao', text: '杀他们的,不是我。是「等」字——等援军,等天命,等别人先拼命。' },
    ],
    win: {
      text: '檄文送到了洛阳,也送进了史官的梦里。三把火没有烧倒司马氏,却把「魏」字的笔画一根根烫深:连他们的兵都开始记住,自己曾经姓曹。司马师摘掉眼上的纱布,发现痛的不只是眼疾。',
      hook: '淮南的火三次燃尽,洛阳的天子坐不住了——他要亲手,把龙旗打出宫门。',
    },
    loss: {
      text: '三叛相继败亡,寿春城头三次换旗。你记住了每一份檄文的抬头,却没算到:东吴的援兵,每次都晚到一步,而司马氏的刀,一次比一次快。',
      clue: '史鉴 · 淮南之败不在寡助,在「各等各的」。重开时先读檄文分清主从;文鸯之勇是最后的门,别把他当成整座城。',
      clueFx: 'keenEye',
    },
  },

  ganlu: {
    cast: ['caomao', 'simazhao', 'jiachong', 'wangshen'],
    objective: '在南阙之前替天子留住最后一步退路——或者,一场问心无愧的死战。',
    coldOpen: [
      { speaker: 'narrator', text: '甘露五年,洛阳。二十岁的天子在陵云台写了最后一首诗,题目叫《潜龙》。诗成,他把笔一折。' },
      { speaker: 'caomao', text: '司马昭之心,路人皆知!朕不能坐受废辱——今日,卿等随朕,亲讨此贼!' },
      { speaker: 'jiachong', text: '殿下勿慌。天子亲自持剑,不过是个孩子的把戏。养兵千日——用在此刻。', when: '!seen:jiachong' },
      { speaker: 'wangshen', text: '陛下……沈,沈万死。可这件事,沈只能,只能先走一步了。' },
      { speaker: 'caomao', text: '朕意已决。纵使今日血溅宫墙,史笔之上,「魏」字仍在!' },
    ],
    intros: {
      jiachong: [
        { when: 'seen:jiachong', bio: '他记得上次那杆停在半空的戟,这次连「停」的口令都不下了。', quote: '这次,不留手。变数,先除。' },
        { bio: '他从不亲手拿刀,只负责把刀递到最合适的手里。', quote: '贾充在此。陛下,别让下人为难。' },
      ],
      simazhao: [
        { when: 'page:tielongshan:yeshi', bio: '铁笼山的困局让他学会了谦卑的外壳,如今壳更厚,刀更近。', quote: '困过我的人,都得死。天子,也不例外?' },
        { when: 'seen:simazhao', bio: '他与你交手多次,这次背靠的是整个司马氏的门楣。', quote: '又来。你的「改写」,朕…我,倒要看看能改到哪一页。' },
        { bio: '离皇位一步的人,最恨别人提醒他「名不正」。', quote: '天子亲征?好大的阵仗。可惜,兵符在我。' },
      ],
      wangshen: [
        { when: 'seen:wangshen', bio: '他的笔上次没能等到天亮,这次蘸墨蘸得更早。', quote: '沈的奏表,已誊了两份。给晋公的那份,先行一步。' },
        { bio: '史学世家的笔,在名节与门第之间,落了个干净利落。', quote: '王沈,有一表上奏。' },
      ],
    },
    map: [{
      id: 'dragon-poem', node: 1, title: '太极殿 · 潜龙之诗',
      lines: [
        { speaker: 'caomao', text: '「伤哉龙受困,不能越深渊。」……写得再好,也不过是替自己哭丧。' },
        { speaker: 'you', text: '陛下,诗可以留,路不能只剩一条。宫墙之外,还有人肯听天子的吗?' },
        { speaker: 'caomao', text: '有没有,朕都要走这一遭。史官,带上你的笔——今日每一笔,都直书!' },
        { speaker: 'jiachong', text: '南阙的甲士,只听成济的。而成济——只听我的。' },
      ],
      choices: [
        { id: 'rally-old-guard', text: '先聚三千宿卫旧臣', detail: '军资 +150,记住旧臣之心', effects: { chips: 150, fact: 'ganlu_rally' } },
        { id: 'read-halberd', text: '盯住成济握戟的手', detail: '本回看破提升,记住那杆戟', effects: { keenEye: true, fact: 'ganlu_halberd' } },
      ],
    }],
    battle: [
      { id: 'ganlu-open', at: 'start', speaker: 'caomao', text: '朕乃天子!谁敢弑君——谁敢?!' },
      { id: 'ganlu-chee', at: 'hand:2', speaker: 'jiachong', text: '司马公养你们,不就是为了今日吗?!动手——', when: 'multi' },
      { id: 'ganlu-halberd', at: 'hand:3', speaker: 'narrator', text: '成济的戟抬起来了。满街的甲士都在看着——看天子,也看这杆戟,究竟听谁的。', when: 'fact:ganlu_halberd' },
      { id: 'ganlu-low', at: 'low', speaker: 'caomao', text: '戟若落,史笔在;朕若死,「魏」字在。来啊——朕在此!' },
    ],
    win: {
      text: '南阙之下,成济的戟最终没有落下——你当街唤出了他父亲的名字,喊破了那道只认「主公」的军令。甲士哗然退散,贾充的袖子第一次空了。天子持剑立于宫门,史官蘸墨:「甘露五年,帝亲讨贼,贼党溃。」魏,还剩一口气;这口气,姓曹。',
      hook: '天子的血没有流,司马氏的耐心却到了头。魏蜀吴三家最后的名字,都将写进同一部史书。',
    },
    loss: {
      text: '戟落了。天子的血溅在南阙的砖上,三日不褪。司马昭闻讯「大惊」,诛了成济三族——把刀和罪,一起收回了鞘。',
      clue: '史鉴 · 贾充赢在「先断你的耳目」。重开时盯住那杆戟、聚拢旧臣;胜负之外,这一页赌的是史笔的下一行。',
      clueFx: 'keenEye',
    },
  },

  jiange: {
    cast: ['jiangwei', 'zhonghui', 'liaohua', 'zhangyi'],
    objective: '在剑阁天险挡住钟会的大军,也要替蜀汉挡住「侧面」两个字。',
    coldOpen: [
      { speaker: 'narrator', text: '十八万魏军压向剑阁,姜维凭险拒守。钟会的檄书写得漂亮,可惜剑门关只认得箭。' },
      { speaker: 'zhonghui', text: '姜伯约,孤城之守,守的是忠,还是不甘?献关者,会保你封侯。' },
      { speaker: 'jiangwei', text: '钟士季的檄文,比你的云梯好看。剑阁的路,却只有一条——你的兵,铺不开。' },
      { speaker: 'liaohua', text: '老夫从麦城一路退到剑阁,退了四十年。这一关,元俭不退了!' },
      { speaker: 'zhangyi', text: '将军,张翼再进一言:阴平小道,不可不防。艾若偷渡,剑阁再险也是空门!' },
    ],
    intros: {
      zhonghui: [
        { when: 'seen:zhonghui', bio: '他记过关前的每一面旗,这次把劝降书又多写了三页。', quote: '这次,孤连你劝降的退路都想好了。' },
        { bio: '颍川的贵公子,笔比剑快,野心比两者都快。', quote: '取蜀如摘冠。诸位,竞相摘之。' },
      ],
    },
    map: [{
      id: 'pass-and-flank', node: 1, title: '剑阁 · 关与侧翼',
      lines: [
        { speaker: 'zhangyi', text: '将军,正面交给我。可翼把丑话说完:邓艾在沓中,他若不走大道——' },
        { speaker: 'jiangwei', text: '伯恭放心。维在阴平留了哨,在江油留了眼。剑阁守的不是门,是整面墙。' },
        { speaker: 'liaohua', text: '墙再厚,也得有人肯站上来。老夫这把骨头,先靠上去了。' },
        { speaker: 'you', text: '钟会要的只是你回头。你一回头,正面就薄了——让他喊,别让他牵动。' },
      ],
      choices: [
        { id: 'hold-wall', text: '死守正面,不受檄文牵动', detail: '本回看破提升,记住墙式守御', effects: { keenEye: true, fact: 'jiange_wall' } },
        { id: 'flank-beacons', text: '分兵三哨,盯死阴平道', detail: '钟会起手军资 -200,记住侧翼之眼', effects: { raid: true, fact: 'jiange_beacons' } },
      ],
    }],
    battle: [
      { id: 'jiange-open', at: 'start', speaker: 'zhonghui', text: '姜维!剑阁虽险,你的粮,比我的笔先竭!' },
      { id: 'jiange-lao', at: 'hand:2', speaker: 'liaohua', text: '老夫守的这段墙,四十年了没让人过去!小辈,再加把劲!' },
      { id: 'jiange-flank', at: 'hand:3', speaker: 'zhangyi', text: '阴平三哨,灯都亮着!将军,正面放心——墙,是整面!', when: 'fact:jiange_beacons' },
      { id: 'jiange-low', at: 'low', speaker: 'jiangwei', text: '钟士季,你的檄文写得再好,也翻不过这道山。回去告诉司马昭:蜀,还有人在。' },
    ],
    win: {
      text: '钟会围关二十余日,粮草先尽,檄文写尽了最后的修辞。拔营西退那日,他回望剑门,把姜维的名字写进了自己的笔记:「取蜀不难,难在此人。」而剑阁的墙上,老将廖化靠着长刀睡着了——四十年,他第一次在关前睡着。',
      hook: '剑阁守住了正面,可摩天岭的雪线上,还有一支裹毡而下的孤军——那是下一页的风。',
    },
    loss: {
      text: '钟会的佯攻牵走了你的哨兵,剑门的正面在一夜之间薄成了一层纸。关破时姜维没有回望,只朝阴平的方向一抱拳:「伯恭,是维负了你。」',
      clue: '史鉴 · 钟会以「势」压「险」,劝降与强攻轮番上。重开时先定墙后设哨;他的檄文,是他最便宜的一种云梯。',
      clueFx: 'keenEye',
    },
  },

  yanglu: {
    cast: ['lukang', 'yanghu'],
    objective: '与羊祜对境两年,赢下「不战之战」,替吴国留住最后的将,也留住最后的信。',
    coldOpen: [
      { speaker: 'narrator', text: '荆州边境,两军对垒,却两年无战。吴人打猎,猎物逃入晋境,羊祜必遣人送还;陆抗病了,羊祜送药,陆抗当众服下。' },
      { speaker: 'yanghu', text: '陆将军,祜不欺丧乱之人,亦不欺有病之将。药在此,信亦在此。' },
      { speaker: 'lukang', text: '羊公赠药,抗岂疑之?倒是抗有一问:将军以信猎城,猎的究竟是吴地,还是吴心?' },
      { speaker: 'lukang', text: '建业来的诏书,比襄阳的兵更急。他们要抗出战,抗,偏要再守一年。' },
      { speaker: 'narrator', text: '西陵城下,步阐举城降晋。陆抗的围城,围的已是自家的叛城。' },
    ],
    intros: {
      yanghu: [
        { when: 'seen:yanghu', bio: '他把你的阵图读了两遍,仍只把围猎的网收紧一寸。', quote: '急什么?祜的网,一年只收一寸。' },
        { bio: '轻裘缓带的名将,以信为饵,以德为钩。', quote: '祜不与你斗刀兵。祜,只等人心自己过江。' },
      ],
    },
    map: [{
      id: 'border-trust', node: 1, title: '襄阳 · 各安其境',
      lines: [
        { speaker: 'yanghu', text: '祜每次会战,只与你约期而阵,不掩不袭。有人骂祜迂——他们不懂,这才是最快的刀。' },
        { speaker: 'lukang', text: '羊公以信待我,抗以信还之。可西陵一叛,两境的信,就要经受火了。' },
        { speaker: 'you', text: '他赢的方式是「不战」。你若急着开战,便替他把人心送过江去。' },
      ],
      choices: [
        { id: 'siege-xiling', text: '先克西陵,再论边境', detail: '晋军起手军资 -200,记住先定内', effects: { raid: true, fact: 'yanglu_xiling' } },
        { id: 'keep-compact', text: '守与羊公之约,不开边衅', detail: '本回看破提升,记住两年之信', effects: { keenEye: true, fact: 'yanglu_pact' } },
      ],
    }],
    battle: [
      { id: 'yanglu-open', at: 'start', speaker: 'yanghu', text: '陆将军,今日又免一战。祜备了新茶——江陵的,你尝得出来。' },
      { id: 'yanglu-city', at: 'hand:2', speaker: 'lukang', text: '西陵城破了。步阐的人头,抗亲自送还建业。晋公的算盘,少了一颗关键的子。', when: 'fact:yanglu_xiling' },
      { id: 'yanglu-tea', at: 'hand:3', speaker: 'yanghu', text: '茶要趁热,城要等熟。将军,祜等得起——你等得起建业吗?', when: 'fact:yanglu_pact' },
      { id: 'yanglu-low', at: 'low', speaker: 'lukang', text: '抗常胜于外,而困于内。羊公……你围的从来不是我,是我的朝廷,对吗?' },
    ],
    win: {
      text: '西陵既定,边信未破。羊祜临终前上表请伐吴,把一生的准备与一怀的药味一并交给了杜预;陆抗也在同一年病逝,吴人立碑,碑上无「败」字。两块碑隔江相望——你赢了这一页:两个名字,谁也没有输给谁。',
      hook: '羊陆之后,再无名将可守。益州的楼船已下水,建业的铁锁,正在一寸寸生锈。',
    },
    loss: {
      text: '建业催战的诏书终于压过了边境的信。你出兵的那一日,江边百姓指着晋营说:「羊公之德,不掠我禾。」仗还没打,城外的人心已先过江。',
      clue: '史鉴 · 羊祜的刀是「信」,急攻正中其怀。重开时先定西陵、再守其约;他输得起时间,你输不起人心。',
      clueFx: 'keenEye',
    },
  },
};
