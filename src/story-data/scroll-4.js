export const SCROLL_4_STORIES = {
  yiling: {
    cast: ['liubei', 'luxun', 'guanyu', 'zhuge'],
    objective: '拆开七百里连营，在陆逊点火之前，让刘备看见复仇之外还有多少条命。',
    coldOpen: [
      { speaker: 'narrator', text: '猇亭的林叶密得透不过风。每一座营盘都挨着下一座，像有人把七百里怨气铺成了一根火绳。' },
      { speaker: 'guanyu', text: '麦城那条命，是你替我夺回来的。今日若还要东征，便别再拿我当报仇的理由。', when: 'page:maicheng:yeshi' },
      { speaker: 'liubei', text: '云长的首级送到洛阳时，朕没有哭。如今每一座营里都有人喊他，朕便不能再退。', when: '!page:maicheng:yeshi' },
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
    cast: ['liubei', 'zhuge', 'guanyu'],
    objective: '同沉疴争回刘备的时间，也让那句托孤从试探与重担，变回真正的信任。',
    coldOpen: [
      { speaker: 'narrator', text: '永安宫的药香压不住江潮。刘备枕边放着写了一半的遗诏，最后几个字迟迟不肯落下。' },
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
    cast: ['simayi', 'caoshuang', 'zhuge'],
    objective: '拆穿一坛专给曹爽看的病，在司马懿睁眼之前守住诏书、武库与曹魏最后的选择。',
    coldOpen: [
      { speaker: 'zhuge', text: '五丈原后，我与他又通了许多年的信。今日只寄来四字：勿信其病。他不是等死，是等你先把他当死人。', when: 'page:wuzhangyuan:yeshi' },
      { speaker: 'writer', text: '五丈原的星已经落过。如今没人替你看冢虎，只剩一碗故意洒在手背上的粥。', when: '!page:wuzhangyuan:yeshi' },
      { speaker: 'caoshuang', text: '他连粥都喂不进，还能夺我的兵权？我去看过三次，三次都是如此。' },
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
    cast: ['dengai', 'jiangwei', 'zhuge', 'masuo'],
    objective: '从沓中回防阴平，在人人认定无人会来的绝壁上设哨，让邓艾的孤军无处落地。',
    coldOpen: [
      { speaker: 'narrator', text: '阴平没有路，只有被雨冲淡的兽迹。邓艾命人裹毡滚崖，把自己的命也卷进了那层旧毡。' },
      { speaker: 'dengai', text: '都、都说阴平无路。无路，才没人拦我。' },
      { speaker: 'jiangwei', text: '沓中不能丢，成都也不能丢。最怕的不是两线作战，是每一处都以为另一处有人。' },
      { speaker: 'writer', text: '最险的小路，在旧史里总是无人看守。你要让那一页多出一盏灯。' },
    ],
    intros: {
      dengai: [
        { when: 'page:yinping:yeshi', bio: '阴平曾让他撞上伏守，他却更相信绝境里总还有第二条兽径。', quote: '这、这次我换一处下山。你还等得到吗？' },
        { bio: '他说得结巴，行得决绝；所有人口中的不可能，都是他敢孤注一掷的理由。', quote: '山、山不会让人。可人会绕过山。' },
      ],
    },
    map: [{
      id: 'light-on-cliff', node: 1, title: '阴平 · 无人处先点灯',
      lines: [
        { speaker: 'zhuge', text: '旧札只有一句：阴平非道，守江油者不可撤。当年人人说它多虑，如今纸页比崖石还重。' },
        { speaker: 'jiangwei', text: '守住了哨位，还要守哨位之间的回音。否则一盏灯灭，百里仍以为自己看得见。' },
        { speaker: 'masuo', text: '街亭我错把高处当险固。如今才懂，险地无粮无援，只是死处。哨位要放在能互相看见的地方。', when: 'page:jieting:yeshi' },
      ],
      choices: [
        { id: 'three-beacons', text: '依旧札设三处互望烽哨', detail: '本回看破提升，记住绝壁灯火', effects: { keenEye: true, fact: 'yinping_beacons' } },
        { id: 'grain-ambush', text: '迁走江油粮道，反设空仓诱敌', detail: '邓艾军资 -200，记住空仓之计', effects: { raid: true, fact: 'yinping_empty_granary' } },
      ],
    }],
    battle: [
      { id: 'yinping-open', at: 'start', speaker: 'dengai', text: '我、我身后没有粮，脚下没有路。你猜我除了向前，还能往哪儿退？' },
      { id: 'yinping-jiangwei', at: 'hand:2', speaker: 'jiangwei', text: '别追他的将旗。裹着毡的才是他，走得最慢的辎重才藏着全军活路。' },
      { id: 'yinping-masuo', at: 'hand:3', speaker: 'masuo', text: '高处不是胜势，能守住水与退路才是。这一句，我欠街亭太多年。', when: 'page:jieting:yeshi' },
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
    cast: ['simayan', 'writer'],
    objective: '在“天下归一”落笔前打完三国最后一局，证明合并不必等于抹掉所有人的名字。',
    coldOpen: [
      { speaker: 'simayan', text: '华容那一刀早落过，北方却照样换了人间。你们总说能改命，最后不还是由我司马氏收场？', when: ['choice:huarong:yeshi', '!choice:huarong:yeshiB'] },
      { speaker: 'simayan', text: '华容你肯放曹操，是给魏续了一口气。可惜那口气最后姓了司马，你的“义”又救了谁？', when: 'choice:huarong:yeshiB' },
      { speaker: 'narrator', text: '楼船沿江而下，吴、蜀、魏的旧旗在库里沾了同样的灰。石头城上无人再谈英雄，只问明日粮价。' },
      { speaker: 'writer', text: '这是旧史最后一页。你若赢，“天下归一”便不再是唯一能写完的句子。' },
    ],
    intros: {
      simayan: [
        { when: 'page:guijin:yeshi', bio: '他曾被迫承认归并非唯一结局，因此再来时更想把所有可能一并收回。', quote: '上次你留下三面旗。这次朕连旗杆也要收走。' },
        { bio: '他继承的不只是三国疆土，还有祖父最懂的那种等待：等所有人都厌倦。', quote: '你们打了一辈子，最后还不是要一个“合”字？' },
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
};
