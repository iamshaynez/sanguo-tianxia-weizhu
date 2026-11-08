export default {
  "1": {
    "taoyuan": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "在黃巾亂兵中护住乡勇，也讓三个陌生人的誓约经得住第一場败仗。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "涿郡的桃花落在告示上，黃巾二字被雨浸開。三个人同時伸手去揭，指尖碰在一处。"
        },
        {
          "speaker": "liubei",
          "text": "備只有一雙草鞋、一腔热血。二位若愿同行，先把這條命借給乡亲。"
        },
        {
          "speaker": "zhangfei",
          "text": "俺有酒，有矛，最不怕把命押上！只是输了以後，誰來替俺们收尸？"
        },
        {
          "speaker": "guanyu",
          "text": "所以今日不求同勝，先约一件事：無论誰退，另外兩人都要接他回來。"
        }
      ],
      "map": [
        {
          "id": "peach-oath",
          "node": 1,
          "title": "桃林 · 先约退路",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "结義還不先喝酒？俺连今後埋在哪座山頭都不怕！"
            },
            {
              "speaker": "guanyu",
              "text": "不怕死容易。難的是看見兄弟败了，肯放下自己的勝名去接。"
            },
            {
              "speaker": "liubei",
              "text": "那便把這一條放在同年同月之前。能回來，才有下一次同行。"
            }
          ],
          "choices": [
            {
              "id": "mutual-cover",
              "text": "把“接回彼此”写进誓约",
              "detail": "敌军起手士气 -1，记住互救之约",
              "effects": {
                "sow": 1,
                "fact": "taoyuan_cover"
              }
            },
            {
              "id": "village-rearguard",
              "text": "先教乡勇辨认退路",
              "detail": "本回看破提升，记住乡勇退路",
              "effects": {
                "keenEye": true,
                "fact": "taoyuan_rearguard"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "taoyuan-open",
          "at": "start",
          "speaker": "zhangfei",
          "text": "俺先冲！你们可别跟得太慢，叫黃巾看了笑話！"
        },
        {
          "id": "taoyuan-cover",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "益德逼陣，玄德护住乡勇。别三人同時向前，把退路空給敌人。"
        },
        {
          "id": "taoyuan-low-oath",
          "at": "low",
          "speaker": "liubei",
          "text": "翼德，回來！你答應過，败了也有人接，不许把誓约只用在别人身上。",
          "when": "fact:taoyuan_cover"
        },
        {
          "id": "taoyuan-low",
          "at": "low",
          "speaker": "liubei",
          "text": "别盯着倒下的旗。先看清誰還在等同伴伸手。"
        }
      ],
      "win": {
        "text": "桃花落在三只碗里，劉備把第四只推給你，却没有请你改口叫兄長。“今日你看見我们如何開始；他日若有人走散，替我们记得回來。”",
        "hook": "桃园酒未醒，酸枣诸侯已会盟。下一杯，要在一个叫華雄的人面前保持溫热。"
      },
      "loss": {
        "text": "酒還溫着，三人却各自被困在一处。你终于明白，同生共死若只是同時向前，便只是三場互不相見的孤戰。",
        "clue": "史鉴 · 互救不是三人一起全押：有人逼陣，便要有人留後。重開軍資 +150，先給同伴留退路。",
        "clueFx": "supply"
      }
    },
    "sishui": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "caocao",
        "huaxiong"
      ],
      "objective": "在诸侯的輕视与華雄的连勝里，替關羽争到一杯仍未凉的出戰機会。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "诸侯帳中摆着十九路酒杯，關外華雄连斬兩将。第三杯酒斟好了，却没人肯起身。"
        },
        {
          "speaker": "caocao",
          "text": "這酒我斟。誰能取華雄首级，回來便還是溫的。"
        },
        {
          "speaker": "guanyu",
          "text": "桃园之约，不是叫兄弟替我去死。此杯请留，關某自己回來喝。",
          "when": "page:taoyuan:yeshi"
        },
        {
          "speaker": "zhangfei",
          "text": "二哥，俺替你擂鼓。你若不回來，酒再热俺也不飲！"
        }
      ],
      "intros": {
        "huaxiong": [
          {
            "when": "seen:huaxiong",
            "bio": "他记得上次那杯没有凉的酒，更记得是谁没有急。",
            "quote": "又斟酒？这次，我让它开席便冷。"
          },
          {
            "bio": "连胜让他相信，每一个挑战者都会比上一个更急。",
            "quote": "酒温正好。你的首级，也正好。"
          }
        ]
      },
      "map": [
        {
          "id": "warm-cup",
          "node": 1,
          "title": "汜水關 · 杯酒為凭",
          "lines": [
            {
              "speaker": "caocao",
              "text": "满帳都在数華雄杀了几人，只有云長在看他杀完以後往哪里回頭。"
            },
            {
              "speaker": "guanyu",
              "text": "他靠下一陣连勝壓住诸侯。若我不替自己急，他便要替我急。"
            }
          ],
          "choices": [
            {
              "id": "leave-wine",
              "text": "把酒留在帐中，不发豪言",
              "detail": "华雄起手士气 -1，记住这杯归约",
              "effects": {
                "sow": 1,
                "fact": "sishui_return_cup"
              }
            },
            {
              "id": "watch-reins",
              "text": "先看华雄如何勒马回头",
              "detail": "本回看破提升，记住他的回望",
              "effects": {
                "keenEye": true,
                "fact": "sishui_horse_reins"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "sishui-open",
          "at": "start",
          "speaker": "huaxiong",
          "text": "又來一个借酒出名的。酒冷之前，够你败三次。"
        },
        {
          "id": "sishui-cup",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "酒面還静。云長，满帳催的是鼓，不是你的刀。"
        },
        {
          "id": "sishui-low",
          "at": "low",
          "speaker": "guanyu",
          "text": "關某不急。他若只敢在连勝時挥刀，酒凉之前，急的一定是他。"
        }
      ],
      "win": {
        "text": "關羽把酒杯递回曹操手中，酒面仍暖。劉備替他解下染尘的披風，張飞的鼓直到此刻才停。曹操却看向你：“方才满帳都急，只有你肯等他。”",
        "hook": "華雄已退，虎牢關門却開了。吕布只問一句：方才溫酒的人，敢不敢再來？"
      },
      "loss": {
        "text": "酒彻底冷了，帳内無人再提第二杯。你不是败給華雄的快刀，是把“回來喝酒”误聽成了“必须立刻赢”。",
        "clue": "史鉴 · 溫酒不是催你速勝，而是相信能回來。華雄靠连勝逼人抢攻；讓他先急，重開時其起手士氣 -1。",
        "clueFx": "sow"
      }
    },
    "hulao": {
      "cast": [
        "lvbu",
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "看清吕布的進退，在虎牢關前赢下第一場“不可能”。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "關上画戟一指，诸侯的旗号便矮了半截。你刚到，劉備却把一杯酒推到你面前。"
        },
        {
          "speaker": "liubei",
          "text": "我二弟的酒曾斬華雄。今日這一杯，你敢不敢接？"
        },
        {
          "speaker": "writer",
          "text": "這一頁人人知道结局。可没有人知道，你為何也在場。",
          "when": "!seen:lvbu"
        },
        {
          "speaker": "lvbu",
          "text": "又是你。上次没打完的，今日一并算。",
          "when": "seen:lvbu"
        }
      ],
      "intros": {
        "lvbu": [
          {
            "when": "seen:lvbu",
            "bio": "他记得你上一次坐在对面，也记得你怎样赢下底池。",
            "quote": "别拿诸侯吓唬我。你，一个人上来。"
          },
          {
            "bio": "虎牢关前，他把“天下无双”当作最短的战书。",
            "quote": "三英一起来，或你一个人来。别让我等。"
          }
        ]
      },
      "map": [
        {
          "id": "three-heroes",
          "node": 1,
          "title": "汜水 · 三英旧约",
          "lines": [
            {
              "speaker": "guanyu",
              "text": "他的强，不在每一手都進；在你怕了以後，他不必再有牌。"
            },
            {
              "speaker": "zhangfei",
              "text": "說這些作甚！俺先替你掀他一陣！"
            }
          ],
          "choices": [
            {
              "id": "allies",
              "text": "请三英掠阵",
              "detail": "军资 +100，吕布起手士气 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "hulao_allies"
              }
            },
            {
              "id": "watch",
              "text": "独自看他打完一手",
              "detail": "本回假破绽减少",
              "effects": {
                "keenEye": true,
                "fact": "hulao_watch"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "hulao-open",
          "at": "start",
          "speaker": "lvbu",
          "text": "你的籌碼像诸侯的胆子——看着不少。"
        },
        {
          "id": "hulao-read",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "他越顺，越会把强牌写在眉上。别急着替他怕。"
        },
        {
          "id": "hulao-low",
          "at": "low",
          "speaker": "lvbu",
          "text": "好！這才配叫虎牢！",
          "when": "!fact:hulao_watch"
        },
        {
          "id": "hulao-low-watch",
          "at": "low",
          "speaker": "you",
          "text": "原來“只進不退”不是勇，是他只会這一种赢法。",
          "when": "fact:hulao_watch"
        }
      ],
      "win": {
        "text": "画戟坠地，诸侯却没有欢呼。劉備先扶住你，關羽拾起了那杯始终未動的酒。",
        "hook": "吕布败走前记住了你的名字。下一次相見，不会還在虎牢。"
      },
      "loss": {
        "text": "你跟着诸侯一起退了。直到离開虎牢，你才懂：他一直在逼你把“天下第一”当成第五張公共牌。",
        "clue": "史鉴 · 吕布靠连续施壓放大恐惧；重開時，他的假破绽会减少。",
        "clueFx": "keenEye"
      }
    },
    "fengyiting": {
      "cast": [
        "diaochan",
        "dongzhuo",
        "lvbu"
      ],
      "objective": "讓董卓与吕布在同一張桌上互相猜疑，替貂蝉把连环計走完最後一步。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "凤仪亭的荷花開得極静。董卓在亭外等美人，吕布在假山後等一个解释，貂蝉却只等他们同席。"
        },
        {
          "speaker": "diaochan",
          "text": "太师要我的歸顺，将軍要我的誓言。今日我不答，我要他们聽見彼此的答案。"
        },
        {
          "speaker": "lvbu",
          "text": "虎牢你逼我退一步，今日若叫我再退，走的便不是我，是這整座郿坞。",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "dongzhuo",
          "text": "奉先，咱家待你不薄。连你也要隔着珠帘看她么？"
        }
      ],
      "intros": {
        "dongzhuo": [
          {
            "when": "seen:dongzhuo",
            "bio": "郿坞的门换过锁，他仍以为所有真心都能收入库中。",
            "quote": "又来挑唆？咱家这次先看你，再看奉先。"
          },
          {
            "bio": "他把恩情写成账簿，也要吕布用顺从逐笔偿还。",
            "quote": "父子同席，有什么话不能明着说？"
          }
        ],
        "lvbu": [
          {
            "when": "page:hulao:yeshi",
            "bio": "虎牢之后他肯退一次，却不肯再让任何人替他决定去处。",
            "quote": "上次你赢我的戟。这次，别替她选。"
          },
          {
            "when": "seen:lvbu",
            "bio": "旧败没有磨去锋芒，只让他更难忍受被当作他人之物。",
            "quote": "我认得你。也认得你眼里那种“为我好”。"
          },
          {
            "bio": "方天画戟立在亭外，他最怕的却是亭内一句含糊的话。",
            "quote": "让她说清楚。你也一样。"
          }
        ]
      },
      "map": [
        {
          "id": "two-listeners",
          "node": 1,
          "title": "凤仪亭 · 一句話兩人聽",
          "lines": [
            {
              "speaker": "diaochan",
              "text": "他们若各自來問，我只能各答一半。同席以後，太师加注要看奉先脸色，奉先弃牌也要聽太师笑声。"
            },
            {
              "speaker": "you",
              "text": "所以你不必骗兩个人，只要讓同一句真話有兩种聽法。"
            },
            {
              "speaker": "diaochan",
              "text": "不。我還要他们终于明白，我不是那句真話里的酬劳。"
            }
          ],
          "choices": [
            {
              "id": "tell-dong",
              "text": "让董卓先看见吕布的迟疑",
              "detail": "本回看破提升，记住太师的疑",
              "effects": {
                "keenEye": true,
                "fact": "fengyi_dong_doubt"
              }
            },
            {
              "id": "tell-lvbu",
              "text": "让吕布听见董卓的占有",
              "detail": "敌军起手士气 -1，记住奉先的怒",
              "effects": {
                "sow": 1,
                "fact": "fengyi_lvbu_rage"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "fengyi-open-multi",
          "at": "start",
          "speaker": "diaochan",
          "text": "今日没有兩張底牌，只有一道父子名分。誰先把对方当敌人，誰便替我開了局。",
          "when": "multi"
        },
        {
          "id": "fengyi-dong",
          "at": "hand:2",
          "speaker": "dongzhuo",
          "text": "奉先，你跟她走，還是跟咱家走？想清楚再下注。",
          "when": "multi"
        },
        {
          "id": "fengyi-lvbu",
          "at": "hand:3",
          "speaker": "lvbu",
          "text": "義父口口声声待我不薄，原來我的一切，都记得這么清楚。",
          "when": "multi"
        },
        {
          "id": "fengyi-low",
          "at": "low",
          "speaker": "diaochan",
          "text": "别看我。看你们自己：一个怕失去權，一个怕从來不是自己。",
          "when": "multi"
        }
      ],
      "win": {
        "text": "貂蝉推開亭門，第一次不必借誰的眼色說話。董卓与吕布仍盯着彼此，直到父子之名只剩一張撕開的请帖。她没有奔向任何一人，只把自己的路走出了郿坞。",
        "hook": "凤仪亭一别，吕布与貂蝉都离開了郿坞。小沛來的使者却在路上——下回，他要替兩家解仇。"
      },
      "loss": {
        "text": "董卓只当你争宠，吕布只当你欺瞒。貂蝉摘下耳珰，没有哭：你想替她赢下兩个男人，却忘了她真正要赢的是不再属于任何人的一句話。",
        "clue": "史鉴 · 别分頭猜董卓与吕布的牌；要看一人下注時另一人先望向誰。连环計的缝隙在兩人之间，重開後假破绽减少。",
        "clueFx": "keenEye"
      }
    },
    "yuanshemen": {
      "cast": [
        "lvbu",
        "jiling",
        "yuanshu",
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "讓纪靈与劉備都保住退路，也逼吕布证明那一箭不是另一种恃强。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "辕門外的画戟只有小枝可中，辕門内却坐着兩支随時会厮杀的大軍。吕布把弓放在桌上，先请你發牌。"
        },
        {
          "speaker": "lvbu",
          "text": "虎牢你說我只知進。今日兩家都在，看我如何用一支箭叫他们退。",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "yuanshu",
          "text": "纪靈聽令:小沛若不下,休回淮南!孤的玉玺要配的是天下,不是一个吕布的情面。",
          "when": "!seen:yuanshu"
        },
        {
          "speaker": "jiling",
          "text": "纪某奉主公之命，不因一箭退兵。除非满座都承認，這一箭赌得起。"
        },
        {
          "speaker": "liubei",
          "text": "備不愿拿小沛百姓的命，替任何人证明箭术。"
        }
      ],
      "intros": {
        "jiling": [
          {
            "when": "seen:jiling",
            "bio": "他仍不服那一箭，却开始认真衡量箭下的另一条命。",
            "quote": "再赌可以。先把两家的条件一字不改地说清。"
          },
          {
            "bio": "三尖刀压着军令，他不能退得像一个被神箭吓走的人。",
            "quote": "吕将军有神射，纪某也有军令。"
          }
        ]
      },
      "map": [
        {
          "id": "shared-wager",
          "node": 1,
          "title": "辕門 · 共認一注",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "一箭便叫俺大哥免于刀兵？若射不中，俺先掀了他的弓！"
            },
            {
              "speaker": "guanyu",
              "text": "所以最難不在射中，在射失以後兩家也認這笔账。"
            },
            {
              "speaker": "lvbu",
              "text": "那就把不中怎么办也說清。吕某今日不靠别人替我自信。"
            }
          ],
          "choices": [
            {
              "id": "name-the-miss",
              "text": "先说箭若不中，两家如何收兵",
              "detail": "本回看破提升，记住共同的赌注",
              "effects": {
                "keenEye": true,
                "fact": "yuanshemen_named_miss"
              }
            },
            {
              "id": "seat-the-rivals",
              "text": "请玄德与纪灵同坐一侧",
              "detail": "纪灵起手士气 -1，记住同席之义",
              "effects": {
                "sow": 1,
                "fact": "yuanshemen_shared_seat"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yuanmen-open",
          "at": "start",
          "speaker": "jiling",
          "text": "先别谈神射。我若赢了這一手，你敢不敢也讓玄德出城一戰？"
        },
        {
          "id": "yuanmen-arrow",
          "at": "hand:2",
          "speaker": "lvbu",
          "text": "我若射不中，自然依你。可你若只想看我出丑，便没聽懂這局。"
        },
        {
          "id": "yuanmen-low",
          "at": "low",
          "speaker": "liubei",
          "text": "纪将軍，今日要赢的不是你的軍令，是你回去以後仍能向士卒交代。"
        }
      ],
      "win": {
        "text": "箭离弦時，纪靈没有看小枝，先看劉備。劉備把面前的刀推远一寸，他才终于收兵。吕布大笑，只有你看見他掌心也有汗：這一箭若只是神技，救不了任何人。",
        "hook": "辕門保住了小沛，却保不住吕布自己的下邳；而许都來的曹操，已先一步走向宛城。"
      },
      "loss": {
        "text": "箭還未离弦，纪靈与劉備已经各自起身。你忙着替吕布保证必中，忘了問另外兩人是否愿意把軍令与百姓押在同一句話上。",
        "clue": "史鉴 · 和事不是兩邊都不得罪，而是先讓兩邊承認同一个赌注。箭未离弦前别說满；重開後假破绽减少。",
        "clueFx": "keenEye"
      }
    },
    "wancheng": {
      "cast": [
        "caocao",
        "dianwei",
        "zhangxiu"
      ],
      "objective": "在張繡降而复叛的一夜，先看住典韦的雙戟，再替曹操留住最後一條退路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "宛城降旗尚未收起，曹营的宴席已经唱到深夜。典韦抱着雙戟坐在帳外，只有你看見墙影里多了一雙脚。"
        },
        {
          "speaker": "caocao",
          "text": "汜水那杯溫酒，孤至今记得。可惜今夜人心比酒凉得快，孤竟没尝出來。",
          "when": "page:sishui:yeshi"
        },
        {
          "speaker": "dianwei",
          "text": "主公安睡。典某不懂牌，只懂這扇門：人在，戟在，門便在。"
        },
        {
          "speaker": "zhangxiu",
          "text": "降将的酒，是不是總要低頭才配喝？曹公，你也來算算這一夜誰欠誰。"
        }
      ],
      "intros": {
        "zhangxiu": [
          {
            "when": "seen:zhangxiu",
            "bio": "降旗可以再次升起，被当作无声的屈辱却再难收回。",
            "quote": "这次莫问双戟。先问你还肯不肯听我说完。"
          },
          {
            "bio": "北地枪王已经降过一次，再出手时便不会留第二次犹豫。",
            "quote": "白日受降，夜里听枪。曹公请坐。"
          }
        ]
      },
      "map": [
        {
          "id": "twin-halberds",
          "node": 1,
          "title": "宛城 · 雙戟未失",
          "lines": [
            {
              "speaker": "dianwei",
              "text": "胡车儿今夜敬了我三碗酒，眼睛却總落在戟上。兵器若失，我拿什么替主公争一條退路？"
            },
            {
              "speaker": "caocao",
              "text": "張繡既降，為何還像坐在针毡？孤是不是把“歸顺”误聽成了“無話可說”。"
            }
          ],
          "choices": [
            {
              "id": "guard-arms",
              "text": "与典韦同守双戟和后营马道",
              "detail": "本回看破提升，双戟与退路同守",
              "effects": {
                "keenEye": true,
                "fact": "wancheng_arms_ready"
              }
            },
            {
              "id": "return-camps",
              "text": "让降卒各归旧营，不夺其械",
              "detail": "张绣起手士气 -1，记住降卒之心",
              "effects": {
                "sow": 1,
                "fact": "wancheng_respect"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "wancheng-open",
          "at": "start",
          "speaker": "zhangxiu",
          "text": "白日你受我的降，夜里却当我無話可說。張繡這一枪，现在才递出去。"
        },
        {
          "id": "wancheng-regret",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "孤错算了張繡，還是错算了自己？典韦，先莫讓任何人進帳。"
        },
        {
          "id": "wancheng-low-ready",
          "at": "low",
          "speaker": "dianwei",
          "text": "主公先走！雙戟還在，今夜便没有人能叫典某空手守門。",
          "when": "fact:wancheng_arms_ready"
        },
        {
          "id": "wancheng-low",
          "at": "low",
          "speaker": "dianwei",
          "text": "主公先走！莫問典某還能站多久，只問馬是否備好。"
        }
      ],
      "win": {
        "text": "雙戟仍在典韦手中，張繡的火没能封住营門。曹操走出很远才回頭，第一次没有問损失多少兵馬，只問：“典韦可還站在原处？”身後的壮漢举了举戟，算是回答。",
        "hook": "宛城的門守住了，曹操却來不及学乖。他已兵临下邳；這一次，被围的是吕布。"
      },
      "loss": {
        "text": "雙戟被盗那刻，你才懂張繡等的不是曹操熟睡，是他把别人的屈辱当作安全。营門還亮着火，典韦没有再退。",
        "clue": "史鉴 · 張繡决意，在他不再看曹操時便已写下。别只盯枪尖，先守营門与雙戟；重開後假破绽减少。",
        "clueFx": "keenEye"
      }
    },
    "baimenlou": {
      "cast": [
        "lvbu",
        "chengong",
        "caocao",
        "liubei"
      ],
      "objective": "在吕布与陈宫之间找出真正的死局，决定下邳還有没有明天。",
      "coldOpen": [
        {
          "speaker": "chengong",
          "text": "城外是曹軍，城内是渴了三日的兵。溫侯仍說，只要他肯出戰，便没有输。"
        },
        {
          "speaker": "lvbu",
          "text": "虎牢那次，你赢的是牌。今日敢拿命再赌一次？",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "chengong",
          "text": "你來了。虎牢那頁我读過——可這一回，要救的不是他的勝名。",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "writer",
          "text": "白門楼的绳子悬在頁外。你每赢一手，它便清楚一分。"
        }
      ],
      "intros": {
        "lvbu": [
          {
            "when": "page:hulao:yeshi",
            "bio": "虎牢败过一次的吕布，更不肯承认自己已被困死。",
            "quote": "你能让我败，能不能让我活？"
          },
          {
            "bio": "泗水淹城，天下第一仍在等一个可以冲锋的方向。",
            "quote": "让开。我再去杀一条路。"
          }
        ],
        "chengong": [
          {
            "bio": "他不是来替吕布求胜，是来替下邳求一条退路。",
            "quote": "若只会赢牌，你救不了他。"
          }
        ]
      },
      "map": [
        {
          "id": "last-counsel",
          "node": 1,
          "title": "泗水 · 最後一策",
          "lines": [
            {
              "speaker": "chengong",
              "text": "我劝他出城，他問我出城以後還是不是吕布。你看，這才是他的牢。"
            },
            {
              "speaker": "caocao",
              "text": "玄德也在楼上。你若救下奉先，他日誰來制他？"
            }
          ],
          "choices": [
            {
              "id": "chen-plan",
              "text": "替陈宫说完那一条退路",
              "detail": "看破提升，记住陈宫之谋",
              "effects": {
                "keenEye": true,
                "fact": "chen_plan"
              }
            },
            {
              "id": "lvbu-oath",
              "text": "让吕布亲口许诺不再轻进",
              "detail": "敌军起手士气 -1",
              "effects": {
                "sow": 1,
                "fact": "lvbu_oath"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "baimen-open",
          "at": "start",
          "speaker": "chengong",
          "text": "看他籌碼少于三成時。困兽会把最後一丝理智也壓上去。"
        },
        {
          "id": "baimen-low",
          "at": "low",
          "speaker": "lvbu",
          "text": "陈宫！若我這次聽了你的，世人会不会笑我？"
        },
        {
          "id": "baimen-answer",
          "at": "low",
          "speaker": "chengong",
          "text": "会。可活着的人，才轮得到被笑話。"
        }
      ],
      "win": {
        "text": "吕布终于没有冲向城門。他摘下束發金冠，第一次問陈宫：“往哪里退？”下邳的哭声停了一夜。",
        "hook": "许都青梅将熟。曹操已经聽說：天下第一没有死，而你就在那張桌邊。",
        "choiceFact": "lvbu_lives"
      },
      "loss": {
        "text": "绳索收紧時，你才發现自己一直在回答“怎样赢吕布”，却从没回答“吕布怎样才肯活”。",
        "clue": "史鉴 · 陈宫看穿了困兽的节奏；重開時假破绽减少。",
        "clueFx": "keenEye"
      }
    },
    "xianshan": {
      "cast": [
        "sunjian",
        "huanggai",
        "chengpu",
        "handang",
        "liubiao"
      ],
      "objective": "在岘山的竹影里替孫坚读出那一箭,讓江東的火种不灭在起笔。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "洛阳的余烬未冷,传國玉玺贴着孫坚的胸口發烫。襄阳城頭,劉表的第二支箭已经搭上弦。"
        },
        {
          "speaker": "sunjian",
          "text": "孤从長沙杀到洛阳,没输過一陣。劉景升凭一座城、几支箭,就想留下江東的虎?"
        },
        {
          "speaker": "chengpu",
          "text": "主公,岘山竹密,追兵不宜盡出。不如先遣人探路,老臣壓陣。"
        },
        {
          "speaker": "huanggai",
          "text": "德謀谨慎過了頭。那「吕公」跑得连盔都歪了,再不追,劉表就真寻着援軍了!"
        },
        {
          "speaker": "writer",
          "text": "野史里,猛虎常死于最信任自己爪牙的那一天。",
          "when": "!seen:sunjian"
        }
      ],
      "intros": {
        "huangzu": [
          {
            "when": "seen:huangzu",
            "bio": "他记得孙坚的刀有多快,这次把伏兵埋得更深。",
            "quote": "又来一只孙家的虎。岘山的箭,管够。"
          },
          {
            "bio": "他打不过孙坚,但他认得孙坚的性子——猛虎从不绕路。",
            "quote": "江夏的箭,等这一天等了两年。"
          }
        ],
        "caimao": [
          {
            "when": "seen:caimao",
            "bio": "水军布好了退路,他只剩一件事:别让蔡家陪葬。",
            "quote": "这次我守水路。山里的事,黄将军请自便。"
          },
          {
            "bio": "他把姐姐的枕风与姐夫的兵符都换成了筹码。",
            "quote": "荆州的水养不了虎。将军,别白费箭。"
          }
        ]
      },
      "map": [
        {
          "id": "bamboo-veil",
          "node": 1,
          "title": "邓塞 · 竹影疑兵",
          "lines": [
            {
              "speaker": "handang",
              "text": "竹影里有人影,数不清。末将愿帶義从先探,主公壓後。"
            },
            {
              "speaker": "sunjian",
              "text": "義公的話,孤聽見了。可若孤壓後,将士便会替孤慢半拍。"
            },
            {
              "speaker": "you",
              "text": "虎的胆氣在陣前,虎的活路却常常在回頭的那一眼。"
            }
          ],
          "choices": [
            {
              "id": "scout-first",
              "text": "先遣韩当探竹,全军缓进",
              "detail": "本回看破提升,记住竹影之疑",
              "effects": {
                "keenEye": true,
                "fact": "xianshan_scout"
              }
            },
            {
              "id": "tiger-charge",
              "text": "随猛虎直接凿穿竹阵",
              "detail": "军资 +100,敌军起手士气 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "xianshan_charge"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "xianshan-open",
          "at": "start",
          "speaker": "huangzu",
          "text": "孫坚!你追了兩天,箭也追了你兩天!"
        },
        {
          "id": "xianshan-slow",
          "at": "hand:2",
          "speaker": "chengpu",
          "text": "别急着回應每一声鼓。竹子会响,响的不都是人。",
          "when": "fact:xianshan_scout"
        },
        {
          "id": "xianshan-rain",
          "at": "hand:2",
          "speaker": "sunjian",
          "text": "箭雨将至。看旗不看他——旗倒的方向,才是伏兵真处。",
          "when": "!fact:xianshan_scout"
        },
        {
          "id": "xianshan-low",
          "at": "low",
          "speaker": "huanggai",
          "text": "主公,换馬!公覆的背,還挡得住一轮!"
        }
      ],
      "win": {
        "text": "竹影里的箭一一落空,黃祖被按在馬下時還在喊\"不可能\"。孫坚没有杀他,只折断了他兩支箭:\"回去告诉劉景升,襄阳的城門,孤明年再來敲。\"江東的火种,就這样越過了岘山。",
        "hook": "猛虎既全,江東的故事有了下一个名字——界桥的白馬,正朝幽州奔去。"
      },
      "loss": {
        "text": "箭入竹影的那一刻,你才看清那陣\"溃逃\"有多整齐。猛虎死于追击,而江東還要等一个少年接住這个名字。",
        "clue": "史鉴 · 黃祖的伏兵靠「亂」诱你全押:竹响時先看旗。重開後他的假破绽会减少。",
        "clueFx": "keenEye"
      }
    },
    "jieqiao": {
      "cast": [
        "gongsunzan",
        "zhaoyun",
        "quyi",
        "wenchou"
      ],
      "objective": "在界桥替白馬義从挡下先登的弩,也替赵云挣到第一次被看清的出手。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "幽州的白馬義从号称天下第一骑,直到界桥对岸,八百先登营沉默地張開了弩。"
        },
        {
          "speaker": "gongsunzan",
          "text": "白馬義从,冲一次,河北就安静十年。伯圭在幽州見過最强的是狼,没見過会等人的狼。"
        },
        {
          "speaker": "zhaoyun",
          "text": "云自常山來,投的是守土之軍,不是送死之軍。将軍,敌陣不齐,必有後變。"
        },
        {
          "speaker": "quyi",
          "text": "骑兵?過了河,就是一排排会喘氣的靶子。",
          "when": "seen:quyi"
        },
        {
          "speaker": "wenchou",
          "text": "袁公說,河北的枪,今日要教幽州人怎么用。",
          "when": "!seen:wenchou"
        }
      ],
      "intros": {
        "quyi": [
          {
            "when": "seen:quyi",
            "bio": "他记得上一次你的白马怎样绕开弩阵,这次把盾压得更低。",
            "quote": "又想绕?我的弩,不止一排。"
          },
          {
            "bio": "他麾下八百人,人人见过血,个个不怕骑。",
            "quote": "过河吧。我的弩等你很久了。"
          }
        ],
        "wenchou": [
          {
            "when": "page:baima:yeshi",
            "bio": "颜良的名字是他的伤疤,也是他的火——他听说那阵输得不明不白。",
            "quote": "河北双壁,少了一壁。今日我来补上。"
          },
          {
            "when": "seen:wenchou",
            "bio": "他仍不服上一阵,枪却收起了三分轻敌。",
            "quote": "这次,我先等你过河。"
          },
          {
            "bio": "他与颜良并称河北双壁,唯一胜过颜良的,是耐心。",
            "quote": "我不急。枪比你长,我等得起。"
          }
        ]
      },
      "map": [
        {
          "id": "river-read",
          "node": 1,
          "title": "界桥 · 半渡之機",
          "lines": [
            {
              "speaker": "zhaoyun",
              "text": "桥窄,馬密。若先登趁我半渡放弩,白馬再多也挤不成陣。"
            },
            {
              "speaker": "gongsunzan",
              "text": "子龍太谨慎。当年孤帶着几十骑,就敢凿穿鲜卑的狼群。"
            },
            {
              "speaker": "you",
              "text": "凿穿靠的是出其不意。今日对岸的人,专等你们冲。"
            }
          ],
          "choices": [
            {
              "id": "dismount-line",
              "text": "令前锋下马结盾,牵马过桥",
              "detail": "本回看破提升,记住半渡之险",
              "effects": {
                "keenEye": true,
                "fact": "jieqiao_dismount"
              }
            },
            {
              "id": "white-storm",
              "text": "白马全速,直扑先登",
              "detail": "军资 +100,先登起手士气 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "jieqiao_storm"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jieqiao-open",
          "at": "start",
          "speaker": "quyi",
          "text": "盾——起!弩——抬!讓幽州人見识什么叫先登!"
        },
        {
          "id": "jieqiao-shield",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "他的盾每落一次,弩就要重上一弦。数他的节拍,别数他的箭。",
          "when": "fact:jieqiao_dismount"
        },
        {
          "id": "jieqiao-wen",
          "at": "hand:3",
          "speaker": "wenchou",
          "text": "白馬亂了!河北的枪,收账!"
        },
        {
          "id": "jieqiao-low",
          "at": "low",
          "speaker": "gongsunzan",
          "text": "義从折损過半……子龍,你說得对,是伯圭急了。"
        }
      ],
      "win": {
        "text": "弩陣的节拍被你数盡,白馬分三队轮冲,先登的盾墙终于裂開一角。文丑挺枪來救時,赵云一枪逼住他:\"将軍的枪很稳,可惜為骄人而用。\"袁绍的中軍退回河北,界桥兩岸,从此都知道了常山赵子龍的名字。",
        "hook": "公孫瓒勝了這一陣,却败給了自己的高墙。而在郿坞的凤仪亭,另一場父子裂痕正待花開。"
      },
      "loss": {
        "text": "半渡時弩声齐响,白馬成排倒在河里。赵云断後救回公孫瓒,回頭看你一眼,没有說話。",
        "clue": "史鉴 · 麹義的弩陣赢在「等你冲」。重開後他的假破绽减少;别在半渡時把義从全部推上。",
        "clueFx": "keenEye"
      }
    },
    "shenting": {
      "cast": [
        "sunce",
        "taishici",
        "zhouyu",
        "chengpu"
      ],
      "objective": "在神亭岭讓兩件兵器打完整場,替孫策与太史慈都留下体面。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曲阿城外,斥候來报:孫策只帶十二骑,去探劉繇大营。太史慈提枪上馬,身後只跟了一个会打鼓的小卒。"
        },
        {
          "speaker": "sunce",
          "text": "人人都叫我小霸王。今日岭上無陣無鼓,正好看看,名号底下還剩什么。"
        },
        {
          "speaker": "taishici",
          "text": "東莱太史慈,饭都吃不饱的人,偏偏枪不输人。戰便戰,誰怕誰!"
        },
        {
          "speaker": "zhouyu",
          "text": "伯符,神亭岭的風向不对。這一仗打到一半,必來第三拨人。"
        }
      ],
      "intros": {
        "taishici": [
          {
            "when": "seen:taishici",
            "bio": "上一次的戟与甲让他记住了你的名字,也记住了你的公平。",
            "quote": "又是你。这次,借你的眼看谁更配赢。"
          },
          {
            "when": "page:jieqiao:yeshi",
            "bio": "他听说过界桥那个数节拍的读卷人,枪下便多了三分敬。",
            "quote": "数得清弩阵的人,应该也数得清我的枪。"
          },
          {
            "bio": "他一生只认两个东西:母亲的教诲,和打得赢的对手。",
            "quote": "神亭岭的风大。兵器拿稳了!"
          }
        ]
      },
      "map": [
        {
          "id": "no-flags",
          "node": 2,
          "title": "神亭岭 · 無鼓之陣",
          "lines": [
            {
              "speaker": "taishici",
              "text": "此间没有軍令,没有陣圖。你若替誰出謀,這一架便不干净了。"
            },
            {
              "speaker": "sunce",
              "text": "好!那便讓開戰場。公瑾退後三十步——今日单挑,誰插手我跟誰急!"
            },
            {
              "speaker": "you",
              "text": "那我押在一旁看。看誰先露出真本事,也看誰先露出真性情。"
            }
          ],
          "choices": [
            {
              "id": "fair-watch",
              "text": "袖手旁观,记下二人枪路",
              "detail": "本回看破提升,记住神亭枪路",
              "effects": {
                "keenEye": true,
                "fact": "shenting_watch"
              }
            },
            {
              "id": "drink-bet",
              "text": "在岭头摆酒,赌谁先脱力",
              "detail": "军资 +120,二人战意更盛",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "shenting_bet"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shenting-open",
          "at": "start",
          "speaker": "taishici",
          "text": "小霸王,接枪!别叫旁人小看了你我!"
        },
        {
          "id": "shenting-halberd",
          "at": "hand:2",
          "speaker": "sunce",
          "text": "好戟法!枪再快些——我孫家的手,還没抖!"
        },
        {
          "id": "shenting-armor",
          "at": "hand:3",
          "speaker": "taishici",
          "text": "盔給你扯了,甲也快了。還想打?我陪到底!"
        },
        {
          "id": "shenting-low",
          "at": "low",
          "speaker": "zhouyu",
          "text": "兩虎相争,必有一伤——而伤的那个,明日還要守城。"
        }
      ],
      "win": {
        "text": "戟折了,甲裂了,兩人抱着兵器躺在岭上喘氣,忽然同時大笑。太史慈翻身坐起:\"孫郎,明日陣前再見,我可不讓你。\"孫策把断戟扔給他:\"留着。修好了,再來。\"你把岭頭的酒分作兩碗,一碗給了赢家,一碗給了没输的人。",
        "hook": "神亭的笑声未落,江東的版圖正待铺開。而在小沛,一支画戟又要替兩家人說和。"
      },
      "loss": {
        "text": "你的插手讓单挑變了味,兩件兵器同時指住了你。太史慈失望地收枪:\"原來读卷人,也会掀桌。\"",
        "clue": "史鉴 · 這一頁要的不是速勝,是讓二人打满全場。重開時,先看誰先脱力再落注。",
        "clueFx": "keenEye"
      }
    }
  },
  "2": {
    "zhujiu": {
      "cast": [
        "caocao",
        "liubei",
        "lvbu"
      ],
      "objective": "藏住自己的答案，也聽清曹操没有說出口的那一句。",
      "coldOpen": [
        {
          "speaker": "caocao",
          "text": "白門楼上你替他選了一條活路。今日這杯酒，我想知道你替自己選什么。",
          "when": "page:baimenlou:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "他若提起奉先，别急着答。先聽他把天下說到第几个人。",
          "when": "page:baimenlou:yeshi"
        },
        {
          "speaker": "caocao",
          "text": "白門楼一别，玄德愈發谨慎了。谨慎的人，最适合对酌。",
          "when": "page:baimenlou:history"
        },
        {
          "speaker": "narrator",
          "text": "青梅過小盏，远处一声雷。你忽然明白，這桌酒没有一题是問天下。"
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:baimenlou:yeshi",
            "bio": "他记得白门楼的每一个选择，尤其记得你让谁活了下来。",
            "quote": "奉先未死，玄德在座。今日英雄，恐怕不止两个。"
          },
          {
            "bio": "青梅煮酒，他把每个人的野心都当作可以试出的底牌。",
            "quote": "莫怕雷。怕我接下来这句。"
          }
        ]
      },
      "map": [
        {
          "id": "green-plum",
          "node": 1,
          "title": "青梅亭 · 未問先答",
          "lines": [
            {
              "speaker": "liubei",
              "text": "他說你是英雄時，你若只谦虚，他便知道你聽懂了。"
            },
            {
              "speaker": "you",
              "text": "那我该装作不懂？"
            },
            {
              "speaker": "liubei",
              "text": "不。讓他以為你只懂牌。"
            }
          ],
          "choices": [
            {
              "id": "thunder",
              "text": "借雷声藏住神情",
              "detail": "曹操起手士气 -1",
              "effects": {
                "sow": 1,
                "fact": "thunder_mask"
              }
            },
            {
              "id": "watch-cao",
              "text": "反问他白门楼最怕什么",
              "detail": "本回看破提升",
              "effects": {
                "keenEye": true,
                "fact": "watch_cao"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "zhujiu-open",
          "at": "start",
          "speaker": "caocao",
          "text": "牌如人。先看，莫急着認。"
        },
        {
          "id": "zhujiu-mid",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "今天下英雄——你觉得，我会先說誰？"
        },
        {
          "id": "zhujiu-low",
          "at": "low",
          "speaker": "liubei",
          "text": "雷要來了。你该落筷了。"
        }
      ],
      "win": {
        "text": "筷落，雷止。曹操笑着替你斟酒，没有再問第二遍。劉備知道，方才有一瞬，你们三人都看見了彼此的底牌。",
        "hook": "關羽即将挂印封金。许都這一局，曹操记住了你的藏锋。"
      },
      "loss": {
        "text": "你回答了“誰是英雄”，却没聽出他真正問的是“你愿不愿与我為敌”。酒未毒，話已经把你围住。",
        "clue": "史鉴 · 曹操会在第二手開始读你的下注；重開時他的假破绽减少。",
        "clueFx": "keenEye"
      }
    },
    "qianli": {
      "cast": [
        "guanyu",
        "liubei",
        "zhangfei",
        "caocao",
        "kongxiu",
        "hanfu",
        "bianxi",
        "wangzhi",
        "qinqi"
      ],
      "objective": "护送车仗穿過五關，辨認孔秀、韩福、卞喜、王植、秦琪各自的拦法，把最後一點氣力留給古城重逢。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "许都城門在身後，印绶高悬，金帛未動。關羽只帶车仗与一柄不愿再受人情的刀。"
        },
        {
          "speaker": "caocao",
          "text": "那日煮酒，玄德借雷藏锋；今日云長要去寻他，孤该放行，還是再留一顿酒？",
          "when": "page:zhujiu:yeshi"
        },
        {
          "speaker": "guanyu",
          "text": "丞相之義，關某记在心里；兄長之约，却在前面等我。"
        },
        {
          "speaker": "liubei",
          "text": "云長，見字如面。莫以我為念，亦莫以我為負。能來便來，古城有人等你。"
        }
      ],
      "intros": {
        "kongxiu": [
          {
            "bio": "东岭关的锁只认文书，他把职责守得比性命更窄。",
            "quote": "没有丞相文凭，关云长也不能过。"
          }
        ],
        "hanfu": [
          {
            "bio": "他把敬重藏在弓弦后，放箭之前仍想保住一份旧情。",
            "quote": "关将军，韩某敬你，却不能弃关。"
          }
        ],
        "bianxi": [
          {
            "bio": "镇国寺的香火压不住杀气，他的平安路只通向埋伏。",
            "quote": "刀留佛前，酒入口中，将军便可安睡。"
          }
        ],
        "wangzhi": [
          {
            "bio": "荥阳的馆舍过于齐整，每一扇门都已想好何时上锁。",
            "quote": "夜长路远，何不住到火起——住到天明？"
          }
        ],
        "qinqi": [
          {
            "bio": "黄河渡口的最后一道军令，他把旧交与风浪都挡在岸上。",
            "quote": "过了四关又如何？黄河只认秦某这一面旗。"
          }
        ]
      },
      "map": [
        {
          "id": "two-kinds-of-gates",
          "node": 2,
          "title": "洛阳 · 明暗兩關",
          "lines": [
            {
              "speaker": "guanyu",
              "text": "孔秀要文凭，韩福藏冷箭，卞喜却把酒摆到佛前。關隘不同，拦人的理由也不同。"
            },
            {
              "speaker": "narrator",
              "text": "车仗里没有催促。關羽回望來路，把刀从右手换到左手，只為讓赶车的人安心。"
            }
          ],
          "choices": [
            {
              "id": "share-rations",
              "text": "以干粮换百姓口述五关地形",
              "detail": "本回看破提升，记住沿途人心",
              "effects": {
                "keenEye": true,
                "fact": "qianli_guides"
              }
            },
            {
              "id": "guard-the-rear",
              "text": "亲自断后，让车仗先行",
              "detail": "守将起手士气 -1，记住断后之诺",
              "effects": {
                "sow": 1,
                "fact": "qianli_rearguard"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "qianli-kongxiu",
          "at": "start",
          "speaker": "kongxiu",
          "text": "東岭關只認丞相文凭，不認你的旧名。没有文書，青龍刀也得留下。",
          "when": "round:1"
        },
        {
          "id": "qianli-hanfu",
          "at": "start",
          "speaker": "hanfu",
          "text": "關将軍，韩某敬你之名，却不能弃守關之责。這一箭之後，莫怪我。",
          "when": "round:2"
        },
        {
          "id": "qianli-bianxi",
          "at": "start",
          "speaker": "bianxi",
          "text": "镇國寺酒已溫。将軍把刀留在佛前，卞某便讓你看一條平安路。",
          "when": "round:3"
        },
        {
          "id": "qianli-wangzhi",
          "at": "start",
          "speaker": "wangzhi",
          "text": "荥阳馆舍洁净，夜色也長。将軍何不住下，等我把各处的門都替你關好？",
          "when": "round:4"
        },
        {
          "id": "qianli-qinqi",
          "at": "start",
          "speaker": "qinqi",
          "text": "黃河在此。四關的人情到這里用盡；秦琪只認夏侯将軍的軍令。",
          "when": "round:5"
        },
        {
          "id": "qianli-no-sixth-grave",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "五關各有锁，人心却未必都是锁。能绕過的杀念，便别把它變成第六座坟。"
        },
        {
          "id": "qianli-drums",
          "at": "low",
          "speaker": "zhangfei",
          "text": "二哥，聽見鼓没有？五關不必再替誰守了，回來与俺击這一面！",
          "when": "round:5"
        }
      ],
      "win": {
        "text": "秦琪倒下時，黃河浪声盖過了刀声。關羽没有数第五颗首级，只回身扶稳车仗。古城門下，張飞扔了鼓槌便來抱馬；劉備赶到時，關羽只說“來迟了”。三雙眼睛都在回答：回來便好。",
        "hook": "古城鼓声未歇，北方的袁曹已经相持。下一場不再是一人過五關，而是兩軍争一口氣。"
      },
      "loss": {
        "text": "你在某一關赢得了刀光，却把车仗、籌碼与歸期都留在身後。千里最難的从不是杀出一條直路，是到古城時仍有資格說一句“都平安”。",
        "clue": "史鉴 · 孔秀耗令、韩福冷箭、卞喜设宴、王植借火、秦琪守渡。五關共用一條命，莫為一關押盡路费；重開軍資 +150。",
        "clueFx": "supply"
      }
    },
    "guandu": {
      "cast": [
        "caocao",
        "yuanshao",
        "guojia",
        "xuyou",
        "tianfeng",
        "jushou"
      ],
      "objective": "讓袁绍的雄厚軍資變成迟疑，在盲注吞盡曹軍之前找到乌巢真正的软肋。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "官渡的粮簿比戰报更薄。曹操每划掉一日，袁绍帳中便多一位自称有策的謀士。"
        },
        {
          "speaker": "yuanshao",
          "text": "孟德，你我自幼相识。你的脾氣我清楚，你的粮草，我更清楚。"
        },
        {
          "speaker": "caocao",
          "text": "云長终究還是去找玄德了。孤留得住赤兔，留不住人心；本初，你却连人心都未看清。",
          "when": "page:qianli:yeshi"
        },
        {
          "speaker": "guojia",
          "text": "明公，袁氏十勝十败之說，嘉只敢保证前九。最後一勝，要你亲自去赢。"
        },
        {
          "speaker": "tianfeng",
          "text": "主公若勝，丰必死；若败，丰亦死。冀州的牢里，元皓已替你们把話写好了。",
          "when": "!seen:tianfeng"
        },
        {
          "speaker": "caocao",
          "text": "许攸來了便请他坐。孤可以只穿一只鞋迎他，却不能讓全軍看見孤只剩三日粮。"
        }
      ],
      "intros": {
        "yuanshao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "他听说青梅亭只论了刘曹，偏要把旧友局变成天下的答辩。",
            "quote": "孟德，今日再数一次英雄，可还有袁本初？"
          },
          {
            "when": "seen:yuanshao",
            "bio": "他仍带千军与满腹计策归来，仍缺一个肯为决定署名的人。",
            "quote": "上次众议未决。这次，你听谁？"
          },
          {
            "bio": "四世三公给了他太多谋士，也给了他永远不必先认错的位置。",
            "quote": "河北兵精粮足。孟德，你拿什么拖？"
          }
        ]
      },
      "map": [
        {
          "id": "true-ledger",
          "node": 2,
          "title": "官渡 · 真账假账",
          "lines": [
            {
              "speaker": "caocao",
              "text": "许攸問孤還有几粮。孤若說實話，他或许給乌巢；若說假話，他今夜便会走。"
            },
            {
              "speaker": "narrator",
              "text": "帳外袁绍的催戰鼓一声近過一声。曹操把真账推給你：這回要烧的不是粮，是他讓别人替自己作主的习惯。"
            }
          ],
          "choices": [
            {
              "id": "true-account",
              "text": "以真实粮数换许攸一句真话",
              "detail": "本回看破提升，记住赤足相迎",
              "effects": {
                "keenEye": true,
                "fact": "guandu_true_account"
              }
            },
            {
              "id": "feint-wuchao",
              "text": "分兵佯攻，只留乌巢一路实棋",
              "detail": "袁绍起手军资 -200，记住乌巢奇袭",
              "effects": {
                "raid": true,
                "fact": "guandu_feint"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "guandu-open",
          "at": "start",
          "speaker": "yuanshao",
          "text": "你每一手都在算還能活几日，我只需等。河北最不怕的，就是多開一次軍议。"
        },
        {
          "id": "guandu-old-friend",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "本初，你不是不知该聽誰，是只怕聽错以後無人可怪。"
        },
        {
          "id": "guandu-unsigned",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "乌巢未燃，河北诸将却都在等别人先改口。千條計策，忽然没有一條肯署名。"
        },
        {
          "id": "guandu-low",
          "at": "low",
          "speaker": "yuanshao",
          "text": "田丰、沮授、许攸……究竟是誰误我？孟德，你先說！"
        }
      ],
      "win": {
        "text": "乌巢没有火，袁绍帳中的灯却一盏盏灭了。曹操没有趁勝追骂旧友，只把写满虚假余粮的账簿合上：“本初，你输在人人都在等别人先認。”",
        "hook": "北方将定，劉備却在新野等一場雪。曹操已有謀士满帳，他连一个肯開門的人還未寻到。"
      },
      "loss": {
        "text": "乌巢的火终究没有烧起來。袁绍仍坐在成堆軍报之後，每一份都有道理，每一份都不必由他負责。你的粮却真的一日日盡了。",
        "clue": "史鉴 · 袁绍的籌碼多不是弱點，怕獨自担责才是。逼他在盲注升高前自己選；重開先劫乌巢，敌軍軍資 -200。",
        "clueFx": "raid"
      }
    },
    "sangu": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "zhuge"
      ],
      "objective": "讓三次敲門各有來意：前兩次無论勝败都肯再访，第三次才聽懂卧龍真正要問的天下。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "新野到隆中的路，劉備已经走過兩遍。張飞把第三次風雪叫作折腾，關羽却替兄長又掸了一遍名刺。"
        },
        {
          "speaker": "zhangfei",
          "text": "二哥千里回來，俺才懂路远不怕。可一个先生，凭什么叫俺们走三回？",
          "when": "page:qianli:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "因為他若肯為百姓出山，備多走几次，又算得了什么。"
        },
        {
          "speaker": "guanyu",
          "text": "勝败可以催，開門不能催。翼德，把火折子收起來。"
        }
      ],
      "intros": {
        "zhuge": [
          {
            "when": "page:bowang:yeshi",
            "bio": "博望之后，他不再只看你有没有耐心，也看你能否容别人立功。",
            "quote": "草堂一别，你已会退。今日可还肯等？"
          },
          {
            "when": "seen:zhuge",
            "bio": "前两顾的输赢他都记得，唯独不拿它们当开门的钥匙。",
            "quote": "胜败我看见了。今日，你为何还来？"
          },
          {
            "bio": "他在门后听了两次风雪，第三次才把天下摆上桌。",
            "quote": "将军请进。先莫问天下，可还坐得住？"
          }
        ]
      },
      "map": [
        {
          "id": "leave-the-door-unforced",
          "node": 1,
          "title": "隆中 · 門不可催",
          "lines": [
            {
              "speaker": "liubei",
              "text": "今日若仍不見，備便把名刺留下。求贤不是叫天下人都按劉備的時辰起身。"
            },
            {
              "speaker": "zhangfei",
              "text": "那俺在外面等！若等得不耐烦，便数雪，不数他的過错。"
            },
            {
              "speaker": "guanyu",
              "text": "你能這样等，大哥這一趟便已没有白來。"
            }
          ],
          "choices": [
            {
              "id": "disarm-and-wait",
              "text": "命全军解甲，只在门外静候",
              "detail": "卧龙起手士气 -1，记住解甲之礼",
              "effects": {
                "sow": 1,
                "fact": "sangu_disarmed_wait"
              }
            },
            {
              "id": "ask-the-sleep",
              "text": "不问天下，先问先生睡得可安稳",
              "detail": "本回看破提升，记住不催之问",
              "effects": {
                "keenEye": true,
                "fact": "sangu_gentle_question"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "sangu-first-door",
          "at": "start",
          "speaker": "unknown",
          "text": "第一顾，先生不在。你可以赢這一局，却不能替他答應相見。",
          "when": "round:1"
        },
        {
          "id": "sangu-first-return",
          "at": "hand:2",
          "speaker": "zhangfei",
          "text": "输了便输了，大哥，俺们明日再來。總比在這里替他守門强！",
          "when": "round:1"
        },
        {
          "id": "sangu-second-snow",
          "at": "start",
          "speaker": "unknown",
          "text": "第二顾，雪满草庐。你昨日又來了——這一次，你為求勝，還是為求人？",
          "when": "round:2"
        },
        {
          "id": "sangu-second-intent",
          "at": "hand:2",
          "speaker": "liubei",
          "text": "云長，翼德，雪大便靠近些。先生可以不見，我们不可失了來意。",
          "when": "round:2"
        },
        {
          "id": "sangu-third-reveal",
          "at": "start",
          "speaker": "zhuge",
          "text": "前兩局的書童与冷遇，都是亮借來問你的：勝後会不会狂，败後還肯不肯來。你來了三次，門便该開了。",
          "when": "round:3"
        },
        {
          "id": "sangu-third-world",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "现在莫問牌。将軍要荆益二州，還是要一个讓百姓不必再逃的天下？",
          "when": "round:3"
        },
        {
          "id": "sangu-third-answer",
          "at": "hand:3",
          "speaker": "liubei",
          "text": "先生若不出山，備仍去；先生若肯同行，這條路便不只属于備。",
          "when": "round:3"
        }
      ],
      "win": {
        "text": "诸葛亮把荆襄与益州写在同一盏灯下，却没有写下誰是主、誰是客。劉備起身長揖，關羽收刀，張飞替你搬來第四張凳子：這一局，终于不是為了请誰認输。",
        "hook": "隆中对策已定，曹操的先锋也到了新野。卧龍出山第一把火，要先讓最不服他的兩个人心服。"
      },
      "loss": {
        "text": "第三顾你终于見到隆中圖，却還在翻前兩局的旧账。诸葛亮收扇不语：耐心不是多走兩趟，是見到答案以後仍肯聽别人說完。",
        "clue": "史鉴 · 前兩顾输了也会再访，不必為每陣强撑；把氣力留到第三顾。重開軍資 +150。",
        "clueFx": "supply"
      }
    },
    "bowang": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "zhaoyun",
        "zhuge",
        "xiahoudun"
      ],
      "objective": "讓關羽張飞心服用兵，讓夏侯惇把每一次追击都当成自己的主意。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "博望坡的草干得正好。诸葛亮把火折子壓在地圖下，先給每个人派了一條必须败着走完的路。"
        },
        {
          "speaker": "zhangfei",
          "text": "三顾時俺服的是大哥的礼。今日你若只会叫俺退，俺可不服！",
          "when": "page:sangu:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "益德，退到你能聽見云長的金声便停。火攻之前，先莫把诱饵做成真败。"
        },
        {
          "speaker": "liubei",
          "text": "備请先生出山，不是请他替你们逞强，是请他教你们不必白白逞强。"
        }
      ],
      "intros": {
        "xiahoudun": [
          {
            "when": "seen:xiahoudun",
            "bio": "他记得上一次的伏兵，却仍不愿承认追击也能被人牵着走。",
            "quote": "同一道坡，我不会再替你看第二次。"
          },
          {
            "bio": "独目只肯向前看，他把每一次后退都读成敌人的胆怯。",
            "quote": "新野若只有火，便让它先烧刘备自己。"
          }
        ]
      },
      "map": [
        {
          "id": "planned-retreat",
          "node": 1,
          "title": "博望坡 · 退到何处",
          "lines": [
            {
              "speaker": "guanyu",
              "text": "軍师要我们各退几步，却连停在哪一棵树後都写清了。看來這“败”字，比勝還難演。"
            },
            {
              "speaker": "zhaoyun",
              "text": "我的枪先露給夏侯惇。他若咬住我，云長与翼德才有真正的伏兵。"
            },
            {
              "speaker": "zhangfei",
              "text": "好！俺便输得像些。可誰先忍不住真逃，誰回來替全軍洗矛！"
            }
          ],
          "choices": [
            {
              "id": "brothers-ambush",
              "text": "令云长益德互以金声为号",
              "detail": "夏侯惇起手士气 -1，记住兄弟伏兵",
              "effects": {
                "sow": 1,
                "fact": "bowang_brothers_ambush"
              }
            },
            {
              "id": "zhaoyun-route",
              "text": "与子龙逐段走完诱敌退路",
              "detail": "本回看破提升，记住每段伏兵",
              "effects": {
                "keenEye": true,
                "fact": "bowang_zhaoyun_route"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "bowang-open",
          "at": "start",
          "speaker": "xiahoudun",
          "text": "劉玄德新得軍师，便只会後退？那我便一路追到你们無坡可伏。"
        },
        {
          "id": "bowang-bait",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "夏侯惇已咬住我的枪。軍师，火還未到吗？"
        },
        {
          "id": "bowang-wait",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "不急。他還在赢，才会继续追；火要烧的是他确信自己正确的這一刻。"
        },
        {
          "id": "bowang-low",
          "at": "low",
          "speaker": "zhangfei",
          "text": "俺懂了！這一退不是把路讓給他，是把他的路越讓越窄。"
        }
      ],
      "win": {
        "text": "張飞先收矛，關羽随後抱拳。诸葛亮没有受這一拜，只把烧弯的軍旗交給子龍。劉備笑了：从今日起，他们争的不是誰先來，是誰肯最後一个退。",
        "hook": "博望的火讓曹軍记住了新野。下一回來得更快：子龍将抱着阿鬥，从熟悉的伏兵圖里反向杀出。"
      },
      "loss": {
        "text": "夏侯惇没有冲進火里，因為你的败退太像真的败退：伏兵急着救，诱兵忘了停。博望坡只剩烟，没有一个曹軍走進計中。",
        "clue": "史鉴 · 退不是逃；每次示弱都要保留下一段伏兵与回本的钱。重開軍資 +150，别把诱敌變成真败。",
        "clueFx": "supply"
      }
    },
    "changban": {
      "cast": [
        "liubei",
        "zhaoyun",
        "zhangfei",
        "caocao",
        "xiahoudun",
        "zhanghe",
        "wenpin"
      ],
      "objective": "在曹操、夏侯惇、張郃同桌追剿下，讓赵云帶回阿鬥、張飞守住当阳桥。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "長坂的尘土里，百姓、辎重和败兵挤成一條路。赵云逆向而行，張飞却勒馬停在桥頭。"
        },
        {
          "speaker": "zhaoyun",
          "text": "主公，夫人与阿鬥還在後面。云去去便回——若不回，翼德替我守桥。"
        },
        {
          "speaker": "zhangfei",
          "text": "俺不要你替！回來，自己守！"
        },
        {
          "speaker": "wenpin",
          "text": "常山赵子龍……文聘奉命拦截，却不忍逼之過死。這一枪，聘自留三分。",
          "when": "!seen:wenpin"
        },
        {
          "speaker": "caocao",
          "text": "传令，赵云要活的。至于桥上的黑脸将軍——孤要亲自看看，他凭什么叫三軍停下。"
        }
      ],
      "intros": {
        "wenpin": [
          {
            "when": "page:chibi:yeshi",
            "bio": "赤壁之后他守着荆州旧地，深知追与不追都写进史笔。",
            "quote": "当年长坂追与不追，聘如今仍未想明白。"
          },
          {
            "when": "seen:wenpin",
            "bio": "他还记得长坂那半式收回的枪，出手便不再留情面。",
            "quote": "这次不让你过。对不住旧主的家眷。"
          },
          {
            "bio": "新附曹营的荆州旧将，枪一寸寸都在尽忠与旧义之间。",
            "quote": "聘奉命巡此。长坂的路，不通。"
          }
        ],
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "青梅亭后他仍记得那声雷，如今要用千军逼出藏住的答案。",
            "quote": "那次让你借雷藏住了。今日，孤看千军替你开牌。"
          },
          {
            "when": "page:bowang:yeshi",
            "bio": "博望新败让他更谨慎，也更不肯给刘备第二次整军的机会。",
            "quote": "一把火赢不了第二次。追。"
          },
          {
            "bio": "他要的不只是玄德的败，还要看看什么人值得败军仍然回头。",
            "quote": "赵云要活的。其余人，不必留。"
          }
        ],
        "xiahoudun": [
          {
            "when": "page:bowang:yeshi",
            "bio": "博望坡的火还留在独目里，他把子龙的回马看作同一道伏兵。",
            "quote": "诸葛不在桥上。今日看谁还能救你。"
          },
          {
            "when": "seen:xiahoudun",
            "bio": "他与你重逢仍只肯向前，却开始防着每一条过分好走的退路。",
            "quote": "这次你退，我先看你身后。"
          },
          {
            "bio": "独目将军带着博望的旧怒，最先追上赵云，也最容易追过头。",
            "quote": "长坂之前，先还博望一箭。"
          }
        ],
        "zhanghe": [
          {
            "when": "seen:zhanghe",
            "bio": "他记得你上次怎样找路，这次先把所有回路都标进阵图。",
            "quote": "上次让你走脱的路，这次我亲自封。"
          },
          {
            "bio": "他不与夏侯惇争先，只计算赵云和张飞之间还剩几步。",
            "quote": "一个救人，一个守桥。分开他们。"
          }
        ]
      },
      "map": [
        {
          "id": "rescue-route",
          "node": 1,
          "title": "当阳 · 逆行人潮",
          "lines": [
            {
              "speaker": "liubei",
              "text": "子龍，備不能命你舍百姓而救我儿。若只帶回阿鬥，却把他们留在刀下，這仗仍是我败。"
            },
            {
              "speaker": "zhaoyun",
              "text": "云明白。七進七出不是七次逞勇，是每一次回來，都知道還有人等。"
            }
          ],
          "choices": [
            {
              "id": "people-first",
              "text": "先护百姓，再循哭声寻阿斗",
              "detail": "本回看破提升，记住逆行之义",
              "effects": {
                "keenEye": true,
                "fact": "changban_people_first"
              }
            },
            {
              "id": "bridge-mark",
              "text": "与子龙约定只认翼德旗色回桥",
              "detail": "追军起手士气 -1，记住回桥之约",
              "effects": {
                "sow": 1,
                "fact": "changban_bridge_mark"
              }
            }
          ]
        },
        {
          "id": "bridge-signal",
          "node": 2,
          "title": "長坂坡 · 一桥三令",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "桥後尘土少了，曹操必疑；尘土多了，百姓又無路。子龍還没回來，俺连断桥都不能痛痛快快断！"
            },
            {
              "speaker": "zhaoyun",
              "text": "翼德，留一道只容单骑的缝。曹軍若三人同追，便叫他们先争誰先過桥。"
            }
          ],
          "choices": [
            {
              "id": "single-file-gap",
              "text": "断桥之前先留一条单骑马道",
              "detail": "本回看破提升，记住一线生机",
              "effects": {
                "keenEye": true,
                "fact": "changban_single_file"
              }
            },
            {
              "id": "split-banners",
              "text": "移动三面残旗，分开三路追兵",
              "detail": "曹操起手军资 -150，记住分追之策",
              "effects": {
                "oppChips": -150,
                "fact": "changban_split_pursuit"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "changban-open",
          "at": "start",
          "speaker": "caocao",
          "text": "元讓追子龍，儁乂断歸桥。孤只要玄德走投無路。",
          "when": "multi"
        },
        {
          "id": "changban-zhaoyun",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "阿鬥在怀，枪便不能只為取勝。翼德，桥還在吗？",
          "when": "multi"
        },
        {
          "id": "changban-zhanghe",
          "at": "hand:3",
          "speaker": "zhanghe",
          "text": "他每次回馬都在找同一个人。别追枪，追他要回的那座桥。",
          "when": "multi"
        },
        {
          "id": "changban-xiahoudun",
          "at": "hand:4",
          "speaker": "xiahoudun",
          "text": "博望那把火，今日拿你的退路來還！",
          "when": "multi"
        },
        {
          "id": "changban-low",
          "at": "low",
          "speaker": "zhangfei",
          "text": "俺只要還站在這里，他们的十萬兵就得一个一个來！",
          "when": "multi"
        }
      ],
      "win": {
        "text": "赵云把孩子递回劉備怀里，張飞才肯退下桥頭。曹操没有责罚夏侯惇与張郃，只望着那道断桥：“他们一个敢回來，一个肯不走。我输的不是追兵。”",
        "hook": "漢津舟楫已近，曹操也记住了這座桥。下一路要走江東：劉備需要一句能讓孫權出兵的話。"
      },
      "loss": {
        "text": "赵云找回了阿鬥，却找不到回桥的路；張飞喝住了追兵，却喝不住三支軍令同時分開。孤勇能赢一陣，救不了所有人。",
        "clue": "史鉴 · 曹操要活口，元讓要报仇，張郃要截桥。讓他们争同一條追击線，别把三人各推向一條退路；重開敌軍士氣 -1。",
        "clueFx": "sow"
      }
    },
    "baima": {
      "cast": [
        "guanyu",
        "caocao",
        "guojia",
        "xunyu",
        "yanliang",
        "wenchou"
      ],
      "objective": "在白馬与延津兩陣之间,替關羽把兩場大功,赢成一條回家的路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "白馬坡前,颜良连斬宋宪魏续,二十合败徐晃,曹营诸将栗然。曹操把目光投向了那个始终背对着戰报的人。"
        },
        {
          "speaker": "caocao",
          "text": "云長,孤知道你人在心不在。可颜良的刀,如今悬在孤所有将軍的頭上。"
        },
        {
          "speaker": "guanyu",
          "text": "關某答應過,立功便走。此陣之後,请丞相守信——備的下落,孤已聽說了。"
        },
        {
          "speaker": "guojia",
          "text": "颜良之勇不可力敌,文丑之躁可以計取。奉孝只担心一件事:云長這兩刀砍完,天下再無人留得住他。",
          "when": "!seen:guojia"
        },
        {
          "speaker": "yanliang",
          "text": "曹营無人了吗?叫那个红脸的馬弓手上來看看。",
          "when": "!seen:yanliang"
        }
      ],
      "intros": {
        "yanliang": [
          {
            "when": "seen:yanliang",
            "bio": "他记得那次快得看不清的刀光,这次把营垒扎得更深。",
            "quote": "那口刀……这次,我要看清它来路。"
          },
          {
            "bio": "河北第一刀,连胜让他相信天下没有第二口更快的刀。",
            "quote": "连营十里,谁来谁死。"
          }
        ],
        "wenchou": [
          {
            "when": "seen:wenchou",
            "bio": "界桥之后他学会等,延津却又要他追——他最恨这种矛盾。",
            "quote": "你教会我数节拍。那这次,换你数我的马蹄。"
          },
          {
            "bio": "为颜良复仇的心比枪更重,辎重散落一地也拦不住他的冲锋。",
            "quote": "白马的账,延津清。"
          }
        ],
        "songxian": [
          {
            "bio": "他从吕布的旧梦里醒来,急着向新主证明自己。",
            "quote": "温侯旧部,不是孬种!看我的!"
          }
        ]
      },
      "map": [
        {
          "id": "two-blades",
          "node": 1,
          "title": "黎阳 · 兩陣之间",
          "lines": [
            {
              "speaker": "xunyu",
              "text": "颜良兵精而不识變,文丑勇而性躁。兩陣之间,真正要读的是云長的心。"
            },
            {
              "speaker": "guanyu",
              "text": "荀令君放心。關某的刀只為丞相砍這一回,砍完,便去寻兄。"
            },
            {
              "speaker": "you",
              "text": "兩陣兩刀,刀刀都要干净。拖泥帶水,走的路就長了。"
            }
          ],
          "choices": [
            {
              "id": "feed-few",
              "text": "以老弱为饵,佯弃辎重",
              "detail": "文丑军起手军资 -200,记住饵兵之计",
              "effects": {
                "raid": true,
                "fact": "baima_bait"
              }
            },
            {
              "id": "watch-blade",
              "text": "陪关羽先看清颜良的麾盖",
              "detail": "本回看破提升,记住麾盖之下",
              "effects": {
                "keenEye": true,
                "fact": "baima_watch"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "baima-open",
          "at": "start",
          "speaker": "yanliang",
          "text": "又來?宋宪魏续的刀,還在我馬上挂着!"
        },
        {
          "id": "baima-ride",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "赤兔馬从土山後轉出,颜良的麾盖在陣前孤零零亮着——他想問來将何人,刀已经到了。",
          "when": "fact:baima_watch"
        },
        {
          "id": "baima-clash",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "麾盖之下,便是他要护的軍心。破了他的旗,這一陣就完了。",
          "when": "!fact:baima_watch"
        },
        {
          "id": "baima-wen",
          "at": "hand:3",
          "speaker": "wenchou",
          "text": "馬快!文丑的枪還没热,你跑什么?!"
        },
        {
          "id": "baima-low",
          "at": "low",
          "speaker": "guojia",
          "text": "兩陣之间最忌恋戰。云長,酒在這里,路也在這里。"
        }
      ],
      "win": {
        "text": "白馬的麾盖倒下時,延津的文丑還在馬蹄声里数你的节拍。兩陣兩刀,干净得像關羽的刀背。曹操亲斟的酒他没有喝,只拱了拱手:\"丞相,關某去也。\"袖中那封寻兄的書信,终于用上了。",
        "hook": "兩陣大功换來一紙放行。前方五關六将,没有一人读過這封信。"
      },
      "loss": {
        "text": "第一陣的勝利讓你贪了第二陣的快。文丑的铁骑漫過河滩時,你才想起郭嘉那句\"兩陣之间,真正要读的是云長的心\"。",
        "clue": "史鉴 · 颜良输給輕敌,文丑赢在等你急。重開時先弃辎重亂其軍心:文丑起手軍資 -200。",
        "clueFx": "raid"
      }
    }
  },
  "3": {
    "shezhan": {
      "cast": [
        "zhangzhao",
        "yufan",
        "luji",
        "zhuge",
        "sunquan"
      ],
      "objective": "拆穿“降曹保江東”的退路，讓孫權聽見群臣没有說出口的恐惧。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "议事厅里摆着四張案，三張堆满经書，唯獨你的案上只有一柄羽扇。張昭先問劉備几败，虞翻已替你把“丧家”二字写在唇邊。"
        },
        {
          "speaker": "zhangzhao",
          "text": "曹公拥百萬之众，先生以何御之？莫把隆中一对，当作救命符。"
        },
        {
          "speaker": "sunquan",
          "text": "先生，孤要聽的不是誰的经熟，是誰敢担江東的明日。"
        },
        {
          "speaker": "zhuge",
          "text": "隆中你問的是天下，今日他们問的是输赢。别答反了。"
        }
      ],
      "intros": {
        "zhangzhao": [
          {
            "when": "seen:zhangzhao",
            "bio": "他记得你上次怎样拆题，这次先把每部经典都摆成了盾。",
            "quote": "典故可以重引。先生，败绩也能重答么？"
          },
          {
            "bio": "江东文胆，以经典为城，以主和为最后一道门。",
            "quote": "先不论兵。刘豫州屡败，可是事实？"
          }
        ],
        "yufan": [
          {
            "bio": "他的话不绕弯，专挑对手最狼狈的地方落刃。",
            "quote": "避难的人，也敢来谈救人？"
          }
        ],
        "luji": [
          {
            "bio": "他把名分说得端正，袖中却藏着不敢独担的降书。",
            "quote": "抗曹之前，先答我何谓汉臣。"
          }
        ]
      },
      "map": [
        {
          "id": "three-questions",
          "node": 1,
          "title": "馆驿 · 三問同锁",
          "lines": [
            {
              "speaker": "yufan",
              "text": "張公問强弱，陆公問名分。我只問你：败到夏口的人，凭什么谈救别人？"
            },
            {
              "speaker": "luji",
              "text": "曹丞相奉天子以令不臣。你要抗的，究竟是曹軍，還是朝廷？"
            },
            {
              "speaker": "you",
              "text": "三道题共用一把锁：先讓我承認，自己已经输了。"
            }
          ],
          "choices": [
            {
              "id": "ask-burden",
              "text": "追问“降后谁担江东”",
              "detail": "看破提升，记住共同前提",
              "effects": {
                "keenEye": true,
                "fact": "shezhan_common_fear"
              }
            },
            {
              "id": "sign-surrender",
              "text": "请主和者各写一个降字",
              "detail": "众儒起手士气 -1，记住署名",
              "effects": {
                "sow": 1,
                "fact": "shezhan_signed"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shezhan-open-multi",
          "at": "start",
          "speaker": "zhangzhao",
          "when": "multi",
          "text": "我们三人依次問。先生若有一处语塞，便不必再谈抗曹。"
        },
        {
          "id": "shezhan-open-single",
          "at": "start",
          "speaker": "zhangzhao",
          "when": "single",
          "text": "曹操之强，史書可查。先生要拿主公性命，替自己立名么？"
        },
        {
          "id": "shezhan-defeats",
          "at": "hand:2",
          "speaker": "yufan",
          "text": "你莫绕。劉豫州一败再败，難道不是事實？"
        },
        {
          "id": "shezhan-name",
          "at": "hand:3",
          "speaker": "luji",
          "text": "漢室倾颓，正需识時务者。你连名分都不顾，還谈什么兴复？"
        },
        {
          "id": "shezhan-low-fear",
          "at": "low",
          "speaker": "you",
          "when": "fact:shezhan_common_fear",
          "text": "你们說江東不可赌，原來是怕自己的名字留在抗曹那一頁。"
        },
        {
          "id": "shezhan-low-sign",
          "at": "low",
          "speaker": "zhuge",
          "when": "fact:shezhan_signed",
          "text": "他们不肯獨書一个降字，却敢替萬民同写。子布，這算誰的江東？"
        }
      ],
      "win": {
        "text": "孫權将案上的“降”字翻扣，命人取來戰圖。張昭没有再問曹操有多少兵，只問江東還有多少可戰之船。群臣仍有异议，却再不能把主和說成一个不必負责的答案。",
        "hook": "鲁肃已在江邊備船。诸葛亮尚需十萬支箭，而曹操的箭，比江東的耐心多。"
      },
      "loss": {
        "text": "你逐條答完了典故，却没讓他们承認惧意。孫權只聽見一場争吵，没聽見誰愿意承担抗曹的後果。",
        "clue": "史鉴 · 群儒会轮流轉問，把争勝變成消耗；先拆共同前提，重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "caochuan": {
      "cast": [
        "zhuge",
        "lusu",
        "caocao",
        "caizhong"
      ],
      "objective": "在雾散前讓曹軍自己决定放箭，把曹操的多疑借成江東的軍需。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "第三更，鲁肃摸着船上的稻草人，终于明白诸葛亮要借的不只是箭，還有曹操不敢出兵的那一颗心。"
        },
        {
          "speaker": "lusu",
          "text": "若雾突然散了呢？子敬可以陪你冒险，江東不能陪你陪葬。"
        },
        {
          "speaker": "caizhong",
          "text": "丞相放心,小人兄弟早把江東水路摸熟了——這雾夜里,他们绝不敢出船。",
          "when": "!seen:caizhong"
        },
        {
          "speaker": "zhuge",
          "text": "堂上既已请江東主戰，箭便不能只在账上。子敬，這一船是還愿，不是赌命。"
        },
        {
          "speaker": "you",
          "text": "雾只負责遮船。讓曹操看見什么，還得由我们來說。"
        }
      ],
      "intros": {
        "caizhong": [
          {
            "when": "seen:caizhong",
            "bio": "诈降的兄弟档又换了一套装束,口径却仍旧差半拍。",
            "quote": "这、这次弟弟没来。情报,小人一个人包了。"
          },
          {
            "bio": "蔡夫人族中小子,降书里的每一个字都商量好了,唯独彼此没商量。",
            "quote": "降卒蔡中,愿为丞相效犬马!"
          }
        ],
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "他在青梅亭读过你的藏锋，如今更不信江上的每一次试探。",
            "quote": "青梅旧友，也学会借雾藏锋了？"
          },
          {
            "bio": "北岸水寨，他把每一声鼓都当成一句没说完的谎话。",
            "quote": "雾夜来船，必有深意。先莫出击。"
          }
        ]
      },
      "map": [
        {
          "id": "fog-cadence",
          "node": 1,
          "title": "江雾 · 留白令敌",
          "lines": [
            {
              "speaker": "lusu",
              "text": "箭垛、船只、更次都齐了，只差曹操肯不肯。若他看出是草人呢？"
            },
            {
              "speaker": "zhuge",
              "text": "所以不能只讓他看不清。要讓他觉得，自己看得比我们更远。"
            },
            {
              "speaker": "you",
              "text": "雾遮住船，鼓声替他补出一支伏兵。"
            }
          ],
          "choices": [
            {
              "id": "full-drums",
              "text": "二十船同擂，假装主力",
              "detail": "曹军起手士气 -1，记住鼓阵",
              "effects": {
                "sow": 1,
                "fact": "caochuan_full_drums"
              }
            },
            {
              "id": "answering-drums",
              "text": "首尾应鼓，留出空船",
              "detail": "看破提升，记住雾中留白",
              "effects": {
                "keenEye": true,
                "fact": "caochuan_empty_space"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "caochuan-open",
          "at": "start",
          "speaker": "caocao",
          "text": "水寨不出，弓弩向前。孤倒要看，雾里藏了多少人。"
        },
        {
          "id": "caochuan-drums",
          "at": "hand:2",
          "speaker": "zhuge",
          "when": "fact:caochuan_full_drums",
          "text": "现在撤下一半鼓。曹操聽見势弱，反会認定我们開始收网。"
        },
        {
          "id": "caochuan-space",
          "at": "hand:2",
          "speaker": "lusu",
          "when": "fact:caochuan_empty_space",
          "text": "空船轉到外舷了。曹操不看鼓声最密处，偏要猜最静的地方。"
        },
        {
          "id": "caochuan-more-arrows",
          "at": "hand:3",
          "speaker": "caocao",
          "text": "鼓声虚了。莫追，添箭——他们若退，便是有诈。"
        },
        {
          "id": "caochuan-low",
          "at": "low",
          "speaker": "you",
          "text": "箭不是骗來的，是他替自己心里的伏兵预備的。"
        }
      ],
      "win": {
        "text": "雾散時，各船草人都已满箭。鲁肃不再問若雾早退怎么办，只忙着催人报数；诸葛亮折下一枚簇尖收進袖中。箭已够用，下一頁要借的是火。",
        "hook": "箭已備，東風未至。周瑜在赤壁等你，也等诸葛亮露出一丝來不及。"
      },
      "loss": {
        "text": "雾未散，曹操先停了箭。你把多疑当成一道不会更改的命令，忘了多疑的人最擅長改主意；鲁肃只好帶你退回空船。",
        "clue": "史鉴 · 曹操会根据鼓声重新判断虚實；别把同一种试探用到底，重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "chibi": {
      "cast": [
        "caocao",
        "zhouyu",
        "zhuge"
      ],
      "objective": "在三方各怀勝負的牌局里，讓火船、東南風与曹操的疑心同時到位。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曹操的连舫在北，周瑜的火船在南，诸葛亮的七星坛夹在兩者之间。三方同桌，却没有任何兩人的勝利完全相同。"
        },
        {
          "speaker": "caocao",
          "text": "连舫稳如平地。孤倒要聽聽，東吴還能拿什么來烧。"
        },
        {
          "speaker": "zhouyu",
          "text": "孔明若借不來風，火攻便止；你若只赢他，曹操照样過江。"
        },
        {
          "speaker": "zhuge",
          "text": "所以這一局没有盟友。只有誰先看見，風已在誰的袖中。"
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "从青梅到赤壁，他仍想逼你把藏住的答案押上桌面。",
            "quote": "煮酒能藏雷，今日烈火往哪里藏？"
          },
          {
            "bio": "八十万连舫，他要北方从此不必再懂水战。",
            "quote": "船已相连，江上也是孤的中原。"
          }
        ],
        "zhouyu": [
          {
            "when": "page:caochuan:yeshi",
            "bio": "他看见十万支箭如约而至，更不肯让孔明独占赤壁。",
            "quote": "箭你借到了。火，还得听我的。"
          },
          {
            "bio": "他的火攻万事俱备，唯独不愿承认自己也在等风。",
            "quote": "曲有误，周郎顾；风若误呢？"
          }
        ],
        "zhuge": [
          {
            "when": "seen:zhuge",
            "bio": "他记得隆中的天下，也记得你怎样把一场对话变成战局。",
            "quote": "今日不论谁先胜，先论风何时起。"
          },
          {
            "bio": "七星坛上，他把最难借的东西说得像已经入袖。",
            "quote": "风会来。人未必肯等。"
          }
        ]
      },
      "map": [
        {
          "id": "three-fuses",
          "node": 1,
          "title": "乌林 · 三方引信",
          "lines": [
            {
              "speaker": "zhouyu",
              "text": "火船只能烧一次。孔明先离場，風未必來；孟德先离場，他会帶走主力。"
            },
            {
              "speaker": "caocao",
              "text": "你们都等風。孤已把船锁在一起，風來，也不過多照几处灯火。"
            },
            {
              "speaker": "you",
              "text": "要赢的不是三份籌碼，是讓三个人都不能提前离席。"
            }
          ],
          "choices": [
            {
              "id": "loose-chain",
              "text": "暗解一节连环索",
              "detail": "曹军起手军资 -200，记住暗索",
              "effects": {
                "raid": true,
                "fact": "chibi_loose_chain"
              }
            },
            {
              "id": "empty-jars",
              "text": "把火油换成空坛示弱",
              "detail": "看破提升，记住空坛真火",
              "effects": {
                "keenEye": true,
                "fact": "chibi_empty_jars"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "chibi-open",
          "at": "start",
          "speaker": "caocao",
          "when": "multi",
          "text": "一个借風，一个纵火，一个無名之辈。很好，孤一桌收拾。"
        },
        {
          "id": "chibi-read",
          "at": "hand:2",
          "speaker": "zhouyu",
          "when": "multi",
          "text": "先碰孔明，還是先碰我？你每赢一家，另一家都在读你的牌。"
        },
        {
          "id": "chibi-chain",
          "at": "hand:3",
          "speaker": "zhuge",
          "when": "fact:chibi_loose_chain",
          "text": "断索讓他以為船可散逃。可命令传到各舰之前，火已经替他做了决定。"
        },
        {
          "id": "chibi-jars",
          "at": "hand:3",
          "speaker": "zhuge",
          "when": "fact:chibi_empty_jars",
          "text": "空坛不是無火，是讓公瑾以為你没有後手。现在，把真火油推出來。"
        },
        {
          "id": "chibi-low",
          "at": "low",
          "speaker": "you",
          "when": "multi",
          "text": "曹操怕埋伏，周瑜怕無功，孔明怕風失期。火起的空隙，就在三种恐惧之间。"
        }
      ],
      "win": {
        "text": "最後一名对手离席時，東南風才越過旗角。火船借風撞入连舫，周瑜没有看你，诸葛亮却已收扇——兩人都明白，你方才留住的不是三份籌碼，是同一刻。",
        "hook": "曹操败向華容。關羽的刀已等在那里，而诸葛亮說，今夜還欠他一份人情。"
      },
      "loss": {
        "text": "你先清掉周瑜，曹操便收船；你先壓住曹操，诸葛亮便不再等風。赤壁没有败給某一張牌，败給三方从未同時入局。",
        "clue": "史鉴 · 多方会彼此读取你的下注，先清一家会給另一家收帆的機会；重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "huarong": {
      "cast": [
        "caocao",
        "guanyu",
        "zhuge"
      ],
      "objective": "赢下穷途之後仍要亲手選择：讓旧账随刀落，還是讓義成為麦城必须偿還的债。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曹操的坐骑陷在泥里，身後只剩十几骑。關羽横刀立馬，却没看你，也没看那條通往江陵的空路。"
        },
        {
          "speaker": "caocao",
          "text": "赤壁能烧连舫，烧不盡旧账。云長，今日這桌上只剩你我了吗？"
        },
        {
          "speaker": "guanyu",
          "text": "軍令在此，旧恩也在此。關某只問一句：這一刀，你替誰看？"
        },
        {
          "speaker": "zhuge",
          "text": "别替他選。你赢下的，只是讓選择真的發生。"
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "从青梅到赤壁，他每次穷途都仍记得怎样与你谈旧情。",
            "quote": "青梅酒、连舫火。你我又走到窄路了。"
          },
          {
            "bio": "败军不足以护驾，他便把昔日恩情也编成了亲军。",
            "quote": "孤今日不讲天下，只讲故人。"
          }
        ],
        "guanyu": [
          {
            "when": "seen:guanyu",
            "bio": "从虎牢到华容，他的一诺始终比刀更重，也更难放下。",
            "quote": "你已知关某如何出刀。今日且看为何收刀。"
          },
          {
            "bio": "军令状在怀，旧恩在心，他不肯让任何一笔由旁人代签。",
            "quote": "关某在此。忠与义，都不许借名。"
          }
        ]
      },
      "map": [
        {
          "id": "two-debts",
          "node": 1,
          "title": "華容 · 刀下兩账",
          "lines": [
            {
              "speaker": "caocao",
              "text": "云長杀我，是奉軍令；放我，是還旧恩。可你要他替哪一笔担罪？"
            },
            {
              "speaker": "guanyu",
              "text": "他把活路說成了兩笔债。你聽着，像哪一笔？"
            },
            {
              "speaker": "you",
              "text": "都不是。刀在活人手里，就不该由死去的情分替今日决定。"
            }
          ],
          "choices": [
            {
              "id": "weigh-oath",
              "text": "展开军令状，先念军法",
              "detail": "曹军起手士气 -1，记住军令",
              "effects": {
                "sow": 1,
                "fact": "huarong_oath"
              }
            },
            {
              "id": "weigh-debt",
              "text": "收起军令状，只听旧恩",
              "detail": "看破提升，记住旧恩",
              "effects": {
                "keenEye": true,
                "fact": "huarong_debt"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "huarong-open",
          "at": "start",
          "speaker": "caocao",
          "text": "赤壁你懂得讓三家都不能先走。今日只剩你我，反倒難了吧？"
        },
        {
          "id": "huarong-oath",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:huarong_oath",
          "text": "軍令我立，罪我领。你若只把軍法推給我，仍是讓旁人替你落刀。"
        },
        {
          "id": "huarong-debt",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:huarong_debt",
          "text": "恩是關某欠的，命是三軍争來的。别拿一个義字，替所有人免单。"
        },
        {
          "id": "huarong-unwritten",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "我算到曹操命不该绝，却算不到你怎样選。這一頁，终于轮到人勝天一着。"
        },
        {
          "id": "huarong-low",
          "at": "low",
          "speaker": "you",
          "text": "他已不谈天下，只谈旧情。穷途上的曹操，仍知道什么能当籌碼。"
        }
      ],
      "win": {
        "text": "曹操的籌碼盡散，泥路静得能聽見刀环。關羽终于看向你。前方無人阻拦，後方軍令犹在；赢牌没有替你写下结局，只把刀落与不落都留成了你的亲手之笔。",
        "hook": "這一刀無论落未落，都会沿荆州传到麦城。冬天還远，账已经记下了。"
      },
      "loss": {
        "text": "曹操仍从泥里走出。你忙着替關羽計算忠義，却忘了他最擅長讓别人替他争一个活口。",
        "clue": "史鉴 · 穷途曹操会把軍令与旧恩轮流推上桌；重開時看破提升，终局選择仍由你作出。",
        "clueFx": "keenEye"
      }
    },
    "sanqi": {
      "cast": [
        "zhouyu",
        "zhuge",
        "lusu",
        "liubei"
      ],
      "objective": "不再用第三激杀人，而讓周瑜在最難堪的一手里看見自己的生路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "巴丘的药已经煎黑，周瑜却把第三封戰書壓在琴下。前兩氣讓他失血，第三氣却先讓他笑了。"
        },
        {
          "speaker": "zhouyu",
          "text": "赤壁同桌，你拿風作了引信。今日又想拿什么，點我的箭疮？"
        },
        {
          "speaker": "lusu",
          "text": "孔明來書只有四字：何必如此。公瑾看完，便把你的名字写了三遍。"
        },
        {
          "speaker": "zhuge",
          "text": "若只想赢他，再激一次就够。若想讓他活，得先讓他有一次不失态。"
        }
      ],
      "intros": {
        "zhouyu": [
          {
            "when": "page:chibi:yeshi",
            "bio": "赤壁的火赢了曹操，也烧亮了他不肯居于人后的心。",
            "quote": "江上你留住同一刻。巴丘呢，等我先乱？"
          },
          {
            "bio": "箭疮未愈，他把每一次迟疑都听成了曲误。",
            "quote": "第三封书来了？念。看我还能气几次。"
          }
        ]
      },
      "map": [
        {
          "id": "third-letter",
          "node": 1,
          "title": "柴桑 · 第三封書",
          "lines": [
            {
              "speaker": "lusu",
              "text": "他認定你每一步都在笑他。你送药，他先找毒；你退兵，他先找伏。"
            },
            {
              "speaker": "zhuge",
              "text": "所以第三封書里，我一句也没有辩解。只写了赤壁那一手，他本可怎样赢我。"
            },
            {
              "speaker": "you",
              "text": "把勝法還給对手，比把罪名塞給他更難。"
            }
          ],
          "choices": [
            {
              "id": "write-way-out",
              "text": "在信尾写清他的胜机",
              "detail": "看破提升，记住第三解",
              "effects": {
                "keenEye": true,
                "fact": "sanqi_way_out"
              }
            },
            {
              "id": "remove-taunts",
              "text": "请鲁肃收走所有激将话",
              "detail": "周瑜起手士气 -1，记住不激",
              "effects": {
                "sow": 1,
                "fact": "sanqi_no_taunt"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "sanqi-open",
          "at": "start",
          "speaker": "zhouyu",
          "text": "你又帶着孔明的信來。說罢，這次是哪座城、哪一句既生瑜？"
        },
        {
          "id": "sanqi-way-out",
          "at": "hand:2",
          "speaker": "zhuge",
          "when": "fact:sanqi_way_out",
          "text": "看他弃掉好牌的那一手。他不是讓你，是在逼自己承認還有下局。"
        },
        {
          "id": "sanqi-no-taunt",
          "at": "hand:2",
          "speaker": "lusu",
          "when": "fact:sanqi_no_taunt",
          "text": "他等你讥讽，你便只报牌。没有人接怒，火便只能烧回他自己。"
        },
        {
          "id": "sanqi-silence",
          "at": "hand:3",
          "speaker": "zhouyu",
          "text": "你為何不笑？我若连怒都無处落，岂不成了你琴上一根断弦？"
        },
        {
          "id": "sanqi-low",
          "at": "low",
          "speaker": "you",
          "text": "第三氣不必是一句話。讓他發现，败也可以不成為笑話。"
        }
      ],
      "win": {
        "text": "周瑜没有再喊“既生瑜”。他把那封写着自己勝機的信壓在琴上，慢慢弹错一音，又自己笑了一声。鲁肃聽見笑声，才敢讓医官進帳。",
        "hook": "周郎暂离巴丘，入蜀的山路却正向龐统收拢。落凤坡這个地名，诸葛亮看了很久。"
      },
      "loss": {
        "text": "你把他的失态当作唯一的勝門，第三激终于奏效，也永远關上了所有下局。琴没有断，聽琴的人先散了。",
        "clue": "史鉴 · 周瑜会等你先出讥讽再反扑；少接他的怒，重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "luofengpo": {
      "cast": [
        "pangtong",
        "liubei",
        "zhangren",
        "liuzhang"
      ],
      "objective": "利用的卢与張任对凤雏的执念，讓伏兵射中一个错误的目标。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "落凤坡前，的卢不肯踏過白石道。龐统翻身下馬，将缰绳递回劉備手里，忽然問張任要杀的究竟是馬，還是人。"
        },
        {
          "speaker": "pangtong",
          "text": "孔明來信只說将帅多凶少吉。他连我也一并算了，却忘了伏兵也要先認人。"
        },
        {
          "speaker": "liuzhang",
          "text": "父兄守了三十年的蜀道,竟真有人打進來……任儿,成都的門,拜托你了。",
          "when": "!seen:liuzhang"
        },
        {
          "speaker": "liubei",
          "text": "士元，换馬本是好意。若這好意正好替你写了死籍呢？"
        },
        {
          "speaker": "zhangren",
          "text": "不見的卢，不许放箭。我要劉備，莫伤错了人。"
        }
      ],
      "intros": {
        "zhangren": [
          {
            "when": "seen:zhangren",
            "bio": "他记得伏兵怎样扑空，这一次把每面旗号都问得更细。",
            "quote": "旗号可以换。守土的心，你换不了。"
          },
          {
            "bio": "西川第一忠勇，谨慎是他守城的墙，也是伏兵的号令。",
            "quote": "白马未现，诸军不得擅发一箭。"
          }
        ]
      },
      "map": [
        {
          "id": "false-phoenix",
          "node": 1,
          "title": "落凤坡 · 反借伏眼",
          "lines": [
            {
              "speaker": "zhangren",
              "text": "林深，馬快。可我伏兵的号令只有一个：白馬入坡，萬箭齐發。"
            },
            {
              "speaker": "pangtong",
              "text": "他要射的是劉備必骑的卢這个成見。地名未必克我，人名却会骗人。"
            },
            {
              "speaker": "liubei",
              "text": "那就讓這成見，最後一次替我们帶路。"
            }
          ],
          "choices": [
            {
              "id": "horse-decoy",
              "text": "空缰牵的卢走前队",
              "detail": "看破伏兵，记住白马诱饵",
              "effects": {
                "keenEye": true,
                "fact": "luofengpo_horse_decoy"
              }
            },
            {
              "id": "banner-decoy",
              "text": "以凤翎旗引偏箭雨",
              "detail": "伏兵起手军资 -200，记住假旗",
              "effects": {
                "raid": true,
                "fact": "luofengpo_banner_decoy"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "luofengpo-open",
          "at": "start",
          "speaker": "zhangren",
          "text": "龐统，你若真懂趋吉避凶，便不该走進這座坡。"
        },
        {
          "id": "luofengpo-horse",
          "at": "hand:2",
          "speaker": "pangtong",
          "when": "fact:luofengpo_horse_decoy",
          "text": "聽，箭都追着的卢去了。張任守的是劉備必骑白馬，不是落凤坡。"
        },
        {
          "id": "luofengpo-banner",
          "at": "hand:2",
          "speaker": "pangtong",
          "when": "fact:luofengpo_banner_decoy",
          "text": "凤旗向東，伏兵便向東。所谓落凤，也可以由我指定落在哪处。"
        },
        {
          "id": "luofengpo-turn",
          "at": "hand:3",
          "speaker": "zhangren",
          "text": "白馬是假，旗号也是假。你们拿我的谨慎，做了自己的弓。"
        },
        {
          "id": "luofengpo-low",
          "at": "low",
          "speaker": "liubei",
          "text": "士元，伏兵已亂。今日不换馬，换一條他们没写過的路。"
        }
      ],
      "win": {
        "text": "箭雨落在空馬与假旗之後，龐统从侧坡踏上高处。他没有庆幸地名失效，只在那封“多凶少吉”的信後添了四字：人心亦然。成都的關門，第一次為凤雏露出缝隙。",
        "hook": "凤雏入蜀，漢中随之成為下一張必争之牌。定軍山上，黃忠正在擦拭一把不肯老的刀。"
      },
      "loss": {
        "text": "你只顾离開的卢，却仍沿張任预设的山道前行。避開了被認出的馬，没有避開被算准的人；第二轮箭雨不再等候号令。",
        "clue": "史鉴 · 張任先認旗号再下令，伏兵齐射前有一次错認；重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "dingjunshan": {
      "cast": [
        "huangzhong",
        "xiahouyuan",
        "zhanghe",
        "fazheng",
        "yanyan"
      ],
      "objective": "借夏侯渊的快与張郃的變互相牵制，讓老将一刀落在兩人换防的半拍。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "定軍山上下各有一面鼓。夏侯渊催人快攻，張郃却按兵测路；兩面鼓總差半拍，黃忠聽了三遍，解下了弓。"
        },
        {
          "speaker": "huangzhong",
          "text": "他们說老将只剩一刀。够是够，只怕有人快得撞上來，有人巧得不肯來。"
        },
        {
          "speaker": "fazheng",
          "text": "漢升,山上兩将不和,便是天給你的第三條路。孝直在旌旗上,只写一个「待」字。",
          "when": "!seen:fazheng"
        },
        {
          "speaker": "yanyan",
          "text": "老哥哥,当年蜀道上一声「断頭将軍」,今日原样奉還。你的侧翼,嚴颜包了。"
        },
        {
          "speaker": "xiahouyuan",
          "text": "年迈還敢居高？天明的鼓未响，我便先上山取你的刀。"
        },
        {
          "speaker": "zhanghe",
          "text": "妙才，居高者故意示弱。你若只会快，便正好替他省去诱敌。"
        }
      ],
      "intros": {
        "xiahouyuan": [
          {
            "bio": "兵贵神速是他的军令，也是别人最容易拨快的那面鼓。",
            "quote": "张郃善变，夏侯善速。你先接哪一个？"
          }
        ],
        "zhanghe": [
          {
            "bio": "巧变名将，最会改阵，却未必改得了同袍的急性。",
            "quote": "兵无常势。可惜妙才只认一种快。"
          }
        ],
        "huangzhong": [
          {
            "bio": "老将不与人争脚力，只争敌人迈入刀势的那一步。",
            "quote": "老的是年岁，不是这一刀。"
          }
        ]
      },
      "map": [
        {
          "id": "half-beat",
          "node": 1,
          "title": "定軍山 · 换防半拍",
          "lines": [
            {
              "speaker": "zhanghe",
              "text": "我若向左补防，妙才必从右路抢功。你站得越高，他越不肯等我的旗。"
            },
            {
              "speaker": "xiahouyuan",
              "text": "等你陣成，黃忠早跑了！速戰便是最稳的陣。"
            },
            {
              "speaker": "huangzhong",
              "text": "不必盼他们和睦。一快一慢，正好替老朽数刀。"
            }
          ],
          "choices": [
            {
              "id": "measure-beats",
              "text": "先测两营更鼓，再布刀阵",
              "detail": "看破提升，记住半拍",
              "effects": {
                "keenEye": true,
                "fact": "dingjunshan_measured_beats"
              }
            },
            {
              "id": "leave-antlers",
              "text": "留一段残破鹿角诱敌抢修",
              "detail": "曹军起手军资 -200，记住假隙",
              "effects": {
                "raid": true,
                "fact": "dingjunshan_repair_bait"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "dingjunshan-open",
          "at": "start",
          "speaker": "xiahouyuan",
          "when": "multi",
          "text": "張郃你看住侧翼。至于你——接得住我三次快攻，再谈年迈不年迈。"
        },
        {
          "id": "dingjunshan-change",
          "at": "hand:2",
          "speaker": "zhanghe",
          "when": "multi",
          "text": "他越催，你越该看我。妙才的刀从正面來，我的陣可从你背後合。"
        },
        {
          "id": "dingjunshan-measured",
          "at": "hand:3",
          "speaker": "huangzhong",
          "when": "fact:dingjunshan_measured_beats",
          "text": "你量的不是山，是妙才聽見快字以後，不肯回頭的那半拍。"
        },
        {
          "id": "dingjunshan-bait",
          "at": "hand:3",
          "speaker": "huangzhong",
          "when": "fact:dingjunshan_repair_bait",
          "text": "你补的不是鹿角，是給妙才一條非快不可的理由。现在，等他冲開門。"
        },
        {
          "id": "dingjunshan-low",
          "at": "low",
          "speaker": "huangzhong",
          "when": "multi",
          "text": "一个要我快，一个要他慢。老朽只需站在兩令之间。"
        }
      ],
      "win": {
        "text": "夏侯渊冲進那半拍時，張郃的新陣尚未轉身。黃忠没有追第二刀，只把刀背在肩上一横，漢中各营便同時改旗。山上的兩面鼓，终于只敲出一个更次。",
        "hook": "漢中的勝利把關羽推上威震華夏的高处。沔水秋雨将至，盛名也会成為最醒目的一面旗。"
      },
      "loss": {
        "text": "夏侯渊的快逼你仓促，張郃的變又封住退路。你等着他们相撞，却先被兩种节奏轮流拖走；老将的刀始终没有出鞘。",
        "clue": "史鉴 · 兩人会交替抢速与變陣，等一方行動後再读另一方；重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "shuiyan": {
      "cast": [
        "guanyu",
        "yujin",
        "pangde"
      ],
      "objective": "蓄水而不恃水，在七軍改营前锁住高地与退路，把天時變成軍令。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "沔水已经漫過旧界石，于禁仍把营垒排得一線不亂。龐德的棺木停在辕門外，漆色比乌云更沉。"
        },
        {
          "speaker": "guanyu",
          "text": "七軍之稳，在令行禁止；七軍之险，也在無人敢先违令移营。"
        },
        {
          "speaker": "yujin",
          "text": "關云長，天時未必助你。营中粮尚可支十日，你若久等，先亂的是樊城外。"
        },
        {
          "speaker": "pangde",
          "text": "于将軍,龐某此來,榇已在营外。你我同守,守的不是魏土,是各自主帅的名字。",
          "when": "!seen:pangde"
        },
        {
          "speaker": "you",
          "text": "他要等雨停。我不必讓雨更早，只要讓他舍不得先動。"
        }
      ],
      "intros": {
        "yujin": [
          {
            "when": "seen:yujin",
            "bio": "他记得低洼怎样吞掉军阵，这次仍不肯让一次擅动毁去严名。",
            "quote": "水涨可测。军心，不可先乱。"
          },
          {
            "bio": "泰山之稳，最信军令，也最晚承认军令已经过时。",
            "quote": "各营听令，无令不得移驻一步。"
          }
        ],
        "pangde": [
          {
            "when": "seen:pangde",
            "bio": "西凉旧部出身的他不信天命,只信手中刀与营外那口棺。",
            "quote": "再战一场。棺未用,人未还。"
          },
          {
            "when": "page:tongguan:yeshi",
            "bio": "他记得西凉的散与聚,如今把不服换成了决死的忠。",
            "quote": "马儿败在西凉。庞某,不会败在这里。"
          },
          {
            "bio": "抬榇而来的降将,每一箭都在替自己的名节还债。",
            "quote": "榇在此。关公,请全力。"
          }
        ]
      },
      "map": [
        {
          "id": "dry-order",
          "node": 1,
          "title": "罾口川 · 水未先攻",
          "lines": [
            {
              "speaker": "yujin",
              "text": "你若决堤，我軍便上高处；你若久围，樊城先求援。雨再大，也不能替我下令。"
            },
            {
              "speaker": "guanyu",
              "text": "他最需要的不只是高地，還有一道仍允许他守住体面的軍令。"
            },
            {
              "speaker": "you",
              "text": "那就給他一條看似不必移营的退路。"
            }
          ],
          "choices": [
            {
              "id": "old-channel",
              "text": "留出旧河道，示弱不封",
              "detail": "看破退路，记住旧河道",
              "effects": {
                "keenEye": true,
                "fact": "shuiyan_old_channel"
              }
            },
            {
              "id": "highland-stakes",
              "text": "暗桩封住高地渡口",
              "detail": "于禁起手军资 -200，记住暗桩",
              "effects": {
                "raid": true,
                "fact": "shuiyan_highland_stakes"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shuiyan-open",
          "at": "start",
          "speaker": "yujin",
          "text": "軍陣未亂，水便只是水。關羽盛名在外，也不過要等天替他交戰。"
        },
        {
          "id": "shuiyan-channel",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:shuiyan_old_channel",
          "text": "旧河道看似能退，其實最浅。于禁不肯弃营，你便把這條稳路走成绝路。"
        },
        {
          "id": "shuiyan-stakes",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:shuiyan_highland_stakes",
          "text": "暗桩已沉。他仍說高地可登，只因還没看見水下那道門已经關了。"
        },
        {
          "id": "shuiyan-no-reply",
          "at": "hand:3",
          "speaker": "yujin",
          "text": "水位過膝，各軍仍不得擅動。等等——传令高地，為何不回报？"
        },
        {
          "id": "shuiyan-low",
          "at": "low",
          "speaker": "guanyu",
          "text": "水不是刀。令他不能退的是軍令如山，水只負责把山淹了。"
        }
      ],
      "win": {
        "text": "七軍旗帜一面面没入浑水，于禁放下劍時，關羽先命人递去一條干舟，而非绳索。威震華夏的呼声到夜里才起；他却獨自回望上游，像已看見盛名之後那條更窄的雪路。",
        "hook": "于禁已擒，许都震動。吕蒙却在江東脱下戰袍、换上白衣，陆逊把一封極恭顺的信送往荆州。"
      },
      "loss": {
        "text": "雨终于來了，你却把涨水当成已经获勝。于禁依令退上高地，七軍虽湿未亂；關羽的楼船反而被堵在自己准備的河道里。",
        "clue": "史鉴 · 水势只壓低陣型，不等于封死退路；先夺高地，重開時看破提升。",
        "clueFx": "keenEye"
      }
    },
    "maicheng": {
      "cast": [
        "guanyu",
        "lvmeng",
        "luxun",
        "guanping",
        "zhoucang",
        "panzhang"
      ],
      "objective": "拆穿白衣与卑辞共同织成的旧我之局，讓關羽不以華容的旧账决定麦城的活路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "麦城的雪盖住烽火台，吕蒙的白衣与陆逊的绶帶一前一後入帳。關羽案上，摆着当年華容留下的一截刀穗。"
        },
        {
          "speaker": "guanyu",
          "when": "choice:huarong:yeshiB",
          "text": "那日刀未落，曹軍今日在北按兵。關某放下的義，原來会沿地圖回來要账。"
        },
        {
          "speaker": "guanyu",
          "when": "choice:huarong:yeshi",
          "text": "那日刀落，北方诸侯各怀心思，求援的信到临沮便没了下文。恩義清了，路却未宽。"
        },
        {
          "speaker": "guanping",
          "text": "父亲,平儿探過路了:北面小道可走,唯临沮一帶林密,恐有吴人设网。"
        },
        {
          "speaker": "zhoucang",
          "text": "俺的腿快過他们的馬!将軍上馬,俺扛刀開路——誰挡,俺踩誰!"
        },
        {
          "speaker": "lvmeng",
          "text": "云長，你最盛時水淹七軍；可盟友与旧敌，都从那場水里学会了怎样对付你。"
        }
      ],
      "intros": {
        "panzhang": [
          {
            "when": "seen:panzhang",
            "bio": "他惦记的从来不只是城,还有城里那口八十二斤的刀。",
            "quote": "青龙刀……这次,该换个主人了。"
          },
          {
            "bio": "设网的人先算的不是兵,是走投无路者的习惯。",
            "quote": "雪夜赶路的人,总爱挑最近的那条。"
          }
        ],
        "lvmeng": [
          {
            "when": "choice:huarong:yeshiB",
            "bio": "他知道你曾放曹操北归，便把这段旧义也算进了求援路。",
            "quote": "你能纵虎，能否走过我留给义气的路？"
          },
          {
            "when": "choice:huarong:yeshi",
            "bio": "他记得华容刀落，不再指望旧恩能拖住你的刀。",
            "quote": "你既杀过曹操，便该知道我无旧恩可还。"
          },
          {
            "bio": "白衣之下不是商贾，是一个把关羽读得太熟的人。",
            "quote": "士别三日。云长，可还认得吕蒙？"
          }
        ],
        "luxun": [
          {
            "when": "page:sanqi:yeshi",
            "bio": "公瑾因你而活，他却要证明救命之恩改变不了荆州之争。",
            "quote": "你救得公瑾，未必救得荆州。"
          },
          {
            "bio": "他把恭顺写得越低，麦城四周的网便收得越慢、越紧。",
            "quote": "后生陆逊，特来向威震华夏者请教。"
          }
        ]
      },
      "map": [
        {
          "id": "old-self-road",
          "node": 1,
          "title": "临沮 · 雪路旧账",
          "lines": [
            {
              "speaker": "lvmeng",
              "text": "我们不必猜關羽会不会降。只要算出他還相信誰，麦城便没有第二扇門。"
            },
            {
              "speaker": "guanyu",
              "text": "荆州之失，不在一城一将。是每个人都把旧日的我，当成了今日的路标。"
            },
            {
              "speaker": "lvmeng",
              "when": "choice:huarong:yeshiB",
              "text": "華容刀未落，曹操便欠你一命。可他按兵，是要還情，還是要等吴蜀兩伤？"
            },
            {
              "speaker": "luxun",
              "when": "choice:huarong:yeshi",
              "text": "華容刀落，北方自顾不暇。你烧掉一條外援，也烧掉了敌人对你的旧判断。"
            }
          ],
          "choices": [
            {
              "id": "split-letters",
              "text": "把求援信分送北、西两路",
              "detail": "军资 +150，吕蒙军资 +100，记住分信",
              "effects": {
                "chips": 150,
                "oppChips": 100,
                "fact": "maicheng_split_letters"
              }
            },
            {
              "id": "burn-letters",
              "text": "烧掉旧信，只带精锐突围",
              "detail": "看破提升，记住焚信",
              "effects": {
                "keenEye": true,
                "fact": "maicheng_burn_letters"
              }
            },
            {
              "id": "false-beacons",
              "text": "重燃烽燧，假作仍在坚守",
              "detail": "吴军起手军资 -200，记住空烽",
              "effects": {
                "raid": true,
                "fact": "maicheng_false_beacons"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "maicheng-open",
          "at": "start",
          "speaker": "lvmeng",
          "when": "multi",
          "text": "陆逊讓你以為還有時间，我負责讓時间走完。云長，该换一种看法了。"
        },
        {
          "id": "maicheng-letters",
          "at": "hand:2",
          "speaker": "luxun",
          "when": "multi",
          "text": "你每次求援，我都先替收信人想一遍。等你想通，路已成了我的陣。"
        },
        {
          "id": "maicheng-spared",
          "at": "hand:3",
          "speaker": "guanyu",
          "when": "choice:huarong:yeshiB",
          "text": "華容那一放，不是叫曹操今日替我活。關某的義，从不向北國收利。"
        },
        {
          "id": "maicheng-slain",
          "at": "hand:3",
          "speaker": "guanyu",
          "when": "choice:huarong:yeshi",
          "text": "華容那一落，關某未曾後悔。今日才懂，杀一人不能杀盡天下的算計。"
        },
        {
          "id": "maicheng-zhouyu",
          "at": "hand:4",
          "speaker": "lvmeng",
          "when": "page:sanqi:yeshi",
          "text": "你讓公瑾多活十年，却没讓江東忘掉荆州。他欠你一命，我不能替他還一城。"
        },
        {
          "id": "maicheng-low-split",
          "at": "low",
          "speaker": "you",
          "when": "fact:maicheng_split_letters",
          "text": "分信不是等誰來救，是讓吴軍不知该堵哪路。援書未至，疑兵已经出城。"
        },
        {
          "id": "maicheng-low-burn",
          "at": "low",
          "speaker": "you",
          "when": "fact:maicheng_burn_letters",
          "text": "旧信烧盡，吕蒙只能猜今日的關羽。突围，也要先讓旧我消失。"
        },
        {
          "id": "maicheng-low-beacon",
          "at": "low",
          "speaker": "you",
          "when": "fact:maicheng_false_beacons",
          "text": "烽火仍亮，吕蒙回頭望城的一瞬，雪下小路才不是他算好的那頁。"
        }
      ],
      "win": {
        "text": "麦城西門在雪停前打開，關羽帶殘軍突出临沮。華容那一刀，無论落過或未落，都没有替今日開門；他把旧刀穗留在雪中，活着的人不再拿旧账抵新命。荆州尚有來路，季漢也尚有一局。",
        "hook": "荆州未失，复仇之名却未必会散。夷陵的营火与白帝城的托孤，都在下一卷等你改写。"
      },
      "loss": {
        "text": "吕蒙算你的旧義，陆逊算你的新断。一个封住求援，一个等你犹豫；雪停時，麦城仍只记住了那个不肯改變的關羽。",
        "clue": "史鉴 · 吕蒙与陆逊会分别利用旧恩与退路；重開時看破提升，華容的選择仍会留下不同劝谏。",
        "clueFx": "keenEye"
      }
    },
    "nanjun": {
      "cast": [
        "zhouyu",
        "caoren",
        "chengpu",
        "ganning",
        "lusu"
      ],
      "objective": "在江陵城下与曹仁对读,讓周瑜的箭疮不必第二次裂開。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "赤壁的火光才熄,南郡的旗還在曹仁手里。周瑜披甲临江,箭疮尚未收口,曹仁却在城頭摆開了嘲讽的鼓。"
        },
        {
          "speaker": "zhouyu",
          "text": "曹子孝守城,十年不倦。要取南郡,先要赢他不肯出城的那颗心。"
        },
        {
          "speaker": "caoren",
          "text": "都督箭疮未愈吧?本将這面鼓,专為你擂。你若動氣,城門便為你開。",
          "when": "!seen:caoren"
        },
        {
          "speaker": "ganning",
          "text": "都督,把夷陵交給兴霸。铃响之处,便是吴軍又進一步。"
        },
        {
          "speaker": "chengpu",
          "text": "公瑾,老夫陪你壓陣。箭疮這東西,最怕的不是箭,是氣。"
        }
      ],
      "intros": {
        "caoren": [
          {
            "when": "seen:caoren",
            "bio": "他记得你怎样替周瑜挡下怒气,这次连鼓都懒得擂了。",
            "quote": "又来?这次我连激你的兴致都省了。"
          },
          {
            "bio": "他把守城写成一门手艺:不赌气,不侥幸,不心疼一砖一瓦。",
            "quote": "江陵的砖,一块一块都数过。来。"
          }
        ],
        "caohong": [
          {
            "bio": "他替兄长守夷陵道,信奉的道理只有一条:主公的退路比自己的命长。",
            "quote": "这道口,姓曹。想过?留下买路的东西。"
          }
        ]
      },
      "map": [
        {
          "id": "outside-mock",
          "node": 1,
          "title": "江陵 · 城下之鼓",
          "lines": [
            {
              "speaker": "zhouyu",
              "text": "他每日擂鼓骂我箭疮,要我拔营决戰。我若應戰,疮裂;我若不應,軍心馁。"
            },
            {
              "speaker": "lusu",
              "text": "都督不如把他擂給你的每一面鼓,都记成他出城的日子。"
            },
            {
              "speaker": "you",
              "text": "鼓声是他的表,不是你的。讓鼓替你数他的换防。"
            }
          ],
          "choices": [
            {
              "id": "count-drums",
              "text": "记录鼓点与垛口换防",
              "detail": "本回看破提升,记住换防之隙",
              "effects": {
                "keenEye": true,
                "fact": "nanjun_count"
              }
            },
            {
              "id": "yiling-feint",
              "text": "佯攻夷陵,分其兵势",
              "detail": "曹军起手军资 -200,记住分兵",
              "effects": {
                "raid": true,
                "fact": "nanjun_feint"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "nanjun-open",
          "at": "start",
          "speaker": "caoren",
          "text": "周郎!箭疮好些了吗?本将的鼓,今日擂得更响!"
        },
        {
          "id": "nanjun-anger",
          "at": "hand:2",
          "speaker": "zhouyu",
          "text": "他把鼓擂給我,我便把怒氣记在他账上。等他换了第三班守軍——"
        },
        {
          "id": "nanjun-gap",
          "at": "hand:3",
          "speaker": "ganning",
          "text": "夷陵铃响了!曹洪分兵了,江陵的墙薄了一层!",
          "when": "fact:nanjun_feint"
        },
        {
          "id": "nanjun-low",
          "at": "low",
          "speaker": "chengpu",
          "text": "都督的脸白了。老夫替你壓住陣脚——這一陣,赢了再养伤!"
        }
      ],
      "win": {
        "text": "曹仁弃城西走的那夜,周瑜按着箭伤登上了江陵城頭。他没有接受欢呼,只讓人把城頭那面嘲弄過他的鼓抬來,亲手敲了三下,又送還曹仁:\"替我谢谢它,守住了我的耐心。\"南郡,终于姓孫。",
        "hook": "南郡到手,荆州的账才翻開了第一頁。而北方的馬蹄声,已帶着一腔仇恨碾向潼關。"
      },
      "loss": {
        "text": "鼓声第三次响起時,周瑜提枪上馬,箭疮在甲缝里裂開。你扶住他的一瞬,江陵城門轰然大開——曹仁等的正是這一刻。",
        "clue": "史鉴 · 曹仁的鼓是給你情绪上的枷。重開後他的假破绽减少;数他的换防,别数他的挑衅。",
        "clueFx": "keenEye"
      }
    },
    "tongguan": {
      "cast": [
        "machao",
        "xuchu",
        "caocao",
        "jiaxu",
        "xuhuang"
      ],
      "objective": "在西凉铁骑的怒火里护住曹操,也讓馬超的仇有一个說得出口的去处。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "潼關的風卷着沙,馬超的白袍在陣前來回,像一杆不肯倒的旗。曹操的中軍帳里,賈诩慢慢研着墨。"
        },
        {
          "speaker": "machao",
          "text": "曹瞒!杀父之仇,欺天之恨!今日不把你剁在潼關,馬超誓不為人!"
        },
        {
          "speaker": "caocao",
          "text": "馬儿不死,孤無葬地也。诸公,誰替孤挡住這陣風?"
        },
        {
          "speaker": "xuchu",
          "text": "主公下帳,退後!虎痴在此——馬儿,過來!"
        },
        {
          "speaker": "jiaxu",
          "text": "明公莫慌。西凉人多,心却不齐。文和的墨,比虎痴的刀慢,却更毒。",
          "when": "!seen:jiaxu"
        }
      ],
      "intros": {
        "machao": [
          {
            "when": "seen:machao",
            "bio": "他记得渭水那夜的冰与火,恨意未减,枪却更沉了。",
            "quote": "又来挡我?先问过我手里的枪!"
          },
          {
            "when": "page:jiameng:yeshi",
            "bio": "葭萌的火盆边他曾放下过枪,此刻枪尖却在微微发抖。",
            "quote": "你见过我放下枪的样子……别再提!"
          },
          {
            "bio": "锦袍银枪,半生都在替死去的父叔讨一个说法。",
            "quote": "父债子偿,天经地义。让开!"
          }
        ],
        "xuchu": [
          {
            "when": "seen:xuchu",
            "bio": "渭水之战让他记住了你,这次把腰间的绳又紧了三圈。",
            "quote": "再来!俺的力气还没用完!"
          },
          {
            "bio": "他不懂什么离间计,只认一个理:主公在身后,就不能退。",
            "quote": "马儿的枪快?俺的命更硬!"
          }
        ]
      },
      "map": [
        {
          "id": "weishui-ice",
          "node": 1,
          "title": "渭南 · 冰城疑云",
          "lines": [
            {
              "speaker": "xuhuang",
              "text": "一夜寒風,渭水结出了冰沙。若连夜筑城,天明便有一座冰营——馬超的骑兵,冲不動冰。"
            },
            {
              "speaker": "jiaxu",
              "text": "冰城只能挡馬,挡不住恨。要拆西凉,须先拆韩遂与馬超的情分——一封信,够了。"
            },
            {
              "speaker": "you",
              "text": "讓他先把怒氣全押上來,再讓他看見信上的墨點。"
            }
          ],
          "choices": [
            {
              "id": "ice-wall",
              "text": "连夜筑冰城,以静制动",
              "detail": "本回看破提升,记住冰城之利",
              "effects": {
                "keenEye": true,
                "fact": "tongguan_ice"
              }
            },
            {
              "id": "letter-smudge",
              "text": "在离间信上留下涂改的墨点",
              "detail": "西凉军起手士气 -1,记住墨点之疑",
              "effects": {
                "sow": 1,
                "fact": "tongguan_smudge"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "tongguan-open",
          "at": "start",
          "speaker": "machao",
          "text": "曹瞒!你修的冰城,挡得住馬,挡不住仇!"
        },
        {
          "id": "tongguan-bare",
          "at": "hand:2",
          "speaker": "xuchu",
          "text": "馬儿,認得俺吗?虎侯今天,就站你面前!",
          "when": "multi"
        },
        {
          "id": "tongguan-letter",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "韩遂捧着那封信,手指停在墨點上。馬超瞥見的那一眼,比曹操的千軍更冷。",
          "when": "fact:tongguan_smudge"
        },
        {
          "id": "tongguan-low",
          "at": "low",
          "speaker": "caocao",
          "text": "馬儿,孤知你不服。可你父之死——你真敢把账全算在孤一人身上吗?"
        }
      ],
      "win": {
        "text": "渭南的風停時,西凉的营自己烧了起來——不是曹操的火,是那封信上的墨點。馬超单骑立在殘陣之前,枪指曹操,久久没有落下,最终调頭向西。曹操抚着胡须輕声說:\"孤赢的不是他,是他终于開始想,那笔账到底该找誰算。\"",
        "hook": "西凉散了,仇恨却還在寻找一个骑手。它会在葭萌關的火盆邊,再等馬超三年。"
      },
      "loss": {
        "text": "馬超的怒火没有等你的离间計生效。铁骑三冲,冰城四裂,曹操割须弃袍的那一刻,你在亂軍中只看見了虎痴的背影。",
        "clue": "史鉴 · 馬超的强在于怒氣换籌碼。重開後他的假破绽减少;先用冰城耗,再用墨點疑。",
        "clueFx": "keenEye"
      }
    },
    "ruxu": {
      "cast": [
        "ganning",
        "zhoutai",
        "sunquan",
        "lingtong",
        "caocao"
      ],
      "objective": "护住百骑劫营的每一声铃响,讓曹操的四十萬大軍自亂一夜。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曹操四十萬大軍壓向濡须,孫權帳中鸦雀無声。甘宁把一百枚铜铃摆上案,一枚一枚,摆成一條線。"
        },
        {
          "speaker": "sunquan",
          "text": "孟德有張辽,孤有兴霸。可一百骑進四十萬人的营,兴霸,孤要你活着回來。"
        },
        {
          "speaker": "ganning",
          "text": "主公放心。铃响则進,铃停则回——兴霸帶的不是一百个送死的,是一百个來记账的!"
        },
        {
          "speaker": "lingtong",
          "text": "甘宁!你又抢頭陣!我父亲的旧部,還没死绝!",
          "when": "!seen:ganning"
        },
        {
          "speaker": "zhoutai",
          "text": "都尉少說一句。這一百骑里,有公绩你父亲的老兄弟。"
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:caochuan:yeshi",
            "bio": "草船的雾与今夜的铃,让他把江东的胆量重新记了一账。",
            "quote": "借了孤的箭,又来借孤的营。好胆!"
          },
          {
            "when": "seen:caocao",
            "bio": "他记得你每次都借他的多疑,这次索性把疑心布满四十万营。",
            "quote": "孤的营,今夜谁碰谁死——问题是谁来碰?"
          },
          {
            "bio": "四十万人的营火,把江面照成了白昼,也把每一条影子都放大成敌。",
            "quote": "江东鼠辈,只会借雾借火。正面,孤等他们。"
          }
        ],
        "xuhuang": [
          {
            "bio": "他布的阵讲究一个「整」字,连劫营者都会被整阵逼回原路。",
            "quote": "来劫营?先过我这排整齐的拒马。"
          }
        ],
        "lejin": [
          {
            "bio": "文谦的名字取「进」,人也一样——前锋永远比军令快一步。",
            "quote": "先锋营,先登!江东人,尝尝乐进的刀!"
          }
        ]
      },
      "map": [
        {
          "id": "hundred-bells",
          "node": 1,
          "title": "横江 · 铃响為号",
          "lines": [
            {
              "speaker": "ganning",
              "text": "每人一根白鹅翎,衔在嘴里。進营不杀人,只砍旗、放火、擂他们的鼓。"
            },
            {
              "speaker": "zhoutai",
              "text": "幼平守坞門。铃响第二遍,無论回來几个,坞門都開。"
            },
            {
              "speaker": "you",
              "text": "四十萬人的营,最怕的不是一百骑,是「不知來了多少骑」。"
            }
          ],
          "choices": [
            {
              "id": "feather-quiet",
              "text": "衔枚裹铃,先静后炸",
              "detail": "本回看破提升,记住静默之利",
              "effects": {
                "keenEye": true,
                "fact": "ruxu_quiet"
              }
            },
            {
              "id": "three-fires",
              "text": "三处举火,令其自相惊扰",
              "detail": "曹军起手军资 -200,记住火号",
              "effects": {
                "raid": true,
                "fact": "ruxu_fires"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "ruxu-open",
          "at": "start",
          "speaker": "caocao",
          "text": "江上静得反常。传令各营:今夜有警,先守,後動,别中了疑兵!"
        },
        {
          "id": "ruxu-bells",
          "at": "hand:2",
          "speaker": "ganning",
          "text": "铃——响!兄弟们,讓曹营自己踩自己!"
        },
        {
          "id": "ruxu-chaos",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "三处火起,四十萬营帳的鼓互相擂响了。没有一支箭知道该射向哪里。",
          "when": "fact:ruxu_fires"
        },
        {
          "id": "ruxu-low",
          "at": "low",
          "speaker": "sunquan",
          "text": "铃停了……数一数,回來几个?一个、兩个……都在。都在就好。"
        }
      ],
      "win": {
        "text": "天明時清點,一百骑连人帶铃,一枚不少。曹操望着一夜自相踩踏的营盘,对左右說:\"孫權治軍如此,孤不可急圖也。\"遂班师。孫權亲自替甘宁斟酒:\"孟德有張辽,孤有兴霸——足矣。\"",
        "hook": "濡须的铃声讓合肥的名字更加滚烫。張辽在那里等着,把「吴」字写成江東儿郎的梦魇。"
      },
      "loss": {
        "text": "铃响得太早,四十萬营从慌亂里醒過來。回來的铃,只有七十枚。甘宁把缺了三十枚的铃串收進怀里,从此再没提過這一夜。",
        "clue": "史鉴 · 百骑劫营赢在「亂其耳目」而非「戰其兵锋」。重開時先静後炸;曹操的多疑是你唯一的内應。",
        "clueFx": "keenEye"
      }
    },
    "jiameng": {
      "cast": [
        "zhangfei",
        "machao",
        "zhuge",
        "weiyan"
      ],
      "objective": "在葭萌關的火盆邊,讓兩杆天下最烈的枪打完,再谈誰跟誰走。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "渭南的败兵投了張鲁,馬超领兵來到葭萌關下。關上的張飞聽說來的是他,先大笑三声,再讓人把戒酒的誓書壓在案下。"
        },
        {
          "speaker": "zhangfei",
          "text": "馬超!聽說你在潼關追得曹操割须?好!俺老張遇强则喜——來來來,大戰三百回合!"
        },
        {
          "speaker": "machao",
          "text": "燕人張飞?潼關之後,人人都說天下只有你的三弟配和我一戰。放馬過來!"
        },
        {
          "speaker": "zhuge",
          "text": "翼德,此人恨極而勇,不可力取。亮只要你记住:打满,别打死。",
          "when": "!fact:jiameng_done"
        },
        {
          "speaker": "weiyan",
          "text": "軍师,文長愿领一軍绕後。若張将軍有个闪失——",
          "when": "seen:weiyan"
        }
      ],
      "intros": {
        "machao": [
          {
            "when": "page:tongguan:yeshi",
            "bio": "渭南的墨点他至今没想透,这份恨意使他的枪少了三分方向。",
            "quote": "离间计赢不了两次。这次,只论枪!"
          },
          {
            "when": "seen:machao",
            "bio": "他与张飞一战之后,枪里多了些说不清的东西。",
            "quote": "又见面了。这次,先打完,再说话。"
          },
          {
            "bio": "败军之将,把最后的体面都押在了这杆枪上。",
            "quote": "西凉已失,家已无。我只有这场仗。"
          }
        ],
        "madai": [
          {
            "when": "seen:madai",
            "bio": "他护着堂兄的侧翼,也护着马家最后的人丁。",
            "quote": "我兄长的事,便是我马岱的事。"
          },
          {
            "bio": "话不多的西凉刀客,刀法与心事一样沉。",
            "quote": "先过我这一关。"
          }
        ]
      },
      "map": [
        {
          "id": "lamp-duel",
          "node": 1,
          "title": "葭萌關 · 挑灯夜戰",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "天黑了打不痛快!來人,點起火把,兩百盏!俺们夜戰!"
            },
            {
              "speaker": "machao",
              "text": "好氣魄!張飞,你比我聽闻的更像條漢子!"
            },
            {
              "speaker": "you",
              "text": "火把照得亮枪,也照得亮人心。打到後來,枪会說話。"
            }
          ],
          "choices": [
            {
              "id": "keep-count",
              "text": "替张飞数回合,严控体力",
              "detail": "本回看破提升,记住二百回合",
              "effects": {
                "keenEye": true,
                "fact": "jiameng_count"
              }
            },
            {
              "id": "warm-wine",
              "text": "温两碗酒候在场边",
              "detail": "军资 +120,二人愈战愈敬",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "jiameng_wine"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jiameng-open",
          "at": "start",
          "speaker": "zhangfei",
          "text": "馬超!接矛!今日不喝倒你,俺老張不姓張!"
        },
        {
          "id": "jiameng-fire",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "兩百盏火把把戰場照成了白昼。兩杆枪在光里绞了又绞,看台上的人渐渐忘了喝彩。"
        },
        {
          "id": "jiameng-madai",
          "at": "hand:3",
          "speaker": "madai",
          "text": "兄長,退吧!張鲁的援兵到不了,西凉的人也剩不多了!",
          "when": "!fact:jiameng_wine"
        },
        {
          "id": "jiameng-wine",
          "at": "hand:3",
          "speaker": "machao",
          "text": "……場邊那兩碗酒,是給誰的?",
          "when": "fact:jiameng_wine"
        },
        {
          "id": "jiameng-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "翼德,收三分力。此人心中有事,枪再烈,也撑到頭了。"
        }
      ],
      "win": {
        "text": "兩百余合之後,火把烧短了半截。張飞把矛往地上一拄:\"馬超,歇一夜,明日再打!\"馬超在馬上沉默良久,忽然問:\"張将軍,劉皇叔……真能容下我這身仇?\"場邊那兩碗溫酒,最终三个人分了——你,翼德,和一杆放平的枪。",
        "hook": "葭萌的火盆邊,西凉的枪找到了新的方向。而在荆州,鲁肃正為一張借据,请云長過江。"
      },
      "loss": {
        "text": "你急着替張飞找勝機,反而打断了那杆枪想說的話。馬超勒馬回陣,从此闭門不出,誰也请不動。",
        "clue": "史鉴 · 這一頁的勝負在枪外。重開時讓兩人打满:数回合者得全局,溫酒者得人心。",
        "clueFx": "sow"
      }
    },
    "daodan": {
      "cast": [
        "guanyu",
        "lusu",
        "guanping",
        "zhoucang",
        "zhuge"
      ],
      "objective": "在陆口的酒宴上,讓鲁肃讨不到荆州,也讓關羽不必拔刀。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "鲁肃的请帖写了三遍,措辞一遍比一遍客氣。江心的船已備好,舱里坐着刀斧手,帖上却只写了一个「叙旧」。"
        },
        {
          "speaker": "lusu",
          "text": "云長,肃别無他意,只求把荆州的账,当面算清。"
        },
        {
          "speaker": "guanyu",
          "text": "子敬相邀,關某岂敢不來。平儿,随我赴宴;周仓,扛刀。"
        },
        {
          "speaker": "guanping",
          "text": "父亲,临行前軍师嘱托:此宴在酒,不在荆州;在信,不在刀。"
        },
        {
          "speaker": "zhoucang",
          "text": "俺就把刀立在船頭,讓江東人看看分量!"
        }
      ],
      "intros": {
        "lusu": [
          {
            "when": "seen:lusu",
            "bio": "他上次没能讨回荆州,这一次把道理磨得更圆,刀斧手埋得更深。",
            "quote": "云长,这次肃要的仍不是降,是一个「还」字。"
          },
          {
            "bio": "江东最厚道的人,也终于学会了在酒里设局。",
            "quote": "借据在此。云长,请过目。"
          }
        ],
        "dingfeng": [
          {
            "when": "seen:dingfeng",
            "bio": "他埋伏的位置换了三次,却始终没等到那声摔杯。",
            "quote": "再等等……主将的杯子,怎么还不落地?"
          },
          {
            "bio": "雪中奋短兵的老将,此刻把短兵藏在了案几之下。",
            "quote": "酒过三巡,听杯为号。"
          }
        ]
      },
      "map": [
        {
          "id": "river-feast",
          "node": 1,
          "title": "陆口 · 江心一宴",
          "lines": [
            {
              "speaker": "lusu",
              "text": "云長,席间只有你我旧谊,别無他事——肃先干為敬。"
            },
            {
              "speaker": "guanyu",
              "text": "子敬的酒,關某喝。荆州的账,醉後再說。"
            },
            {
              "speaker": "you",
              "text": "借据壓在他袖底,刀斧手壓在船板下。誰先急,誰先输。"
            }
          ],
          "choices": [
            {
              "id": "count-cups",
              "text": "数鲁肃斟酒的节奏与眼神",
              "detail": "本回看破提升,记住斟酒之律",
              "effects": {
                "keenEye": true,
                "fact": "daodan_count"
              }
            },
            {
              "id": "hold-scabbard",
              "text": "按住周仓的刀鞘,先礼后兵",
              "detail": "东吴伏兵起手士气 -1,记住按刀之义",
              "effects": {
                "sow": 1,
                "fact": "daodan_hold"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "daodan-open",
          "at": "start",
          "speaker": "lusu",
          "text": "云長,今日只谈旧谊。來,满飲此杯——"
        },
        {
          "id": "daodan-deed",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "子敬,酒是好酒。只是這借据上的墨,關某记得比你清楚。"
        },
        {
          "id": "daodan-blade",
          "at": "hand:3",
          "speaker": "zhoucang",
          "text": "船板底下有脚步声!将軍,俺的刀——",
          "when": "!fact:daodan_hold"
        },
        {
          "id": "daodan-hold",
          "at": "hand:3",
          "speaker": "guanyu",
          "text": "周仓,退後。今日這把刀,只陪關某喝酒。",
          "when": "fact:daodan_hold"
        },
        {
          "id": "daodan-low",
          "at": "low",
          "speaker": "guanping",
          "text": "父亲,鲁肃亲自送我们到船頭了。他的手,一直在袖子里攥着那份借据。"
        }
      ],
      "win": {
        "text": "船离江心,鲁肃立在渡口,久久望着那口八十二斤的刀远去。他没有摔杯,因為關羽临走時說:\"子敬,荆州之约,關某记下了。你保的不是借据,是兩家還没破裂的信。\"回营的船上汽笛無声,只有你知道,這杯酒替荆州又买了几年。",
        "hook": "单刀会散,兩家的账却没散。合肥的方向,一声更比一声紧的戰鼓,正在等孫權。"
      },
      "loss": {
        "text": "刀出鞘的那一瞬,宴席就输了。你没能按住那八十二斤的火氣,也没能按住船板下的短兵。江水把「单刀赴会」冲成了「兩败俱伤」。",
        "clue": "史鉴 · 鲁肃要的是「信」不是「城」,伏兵等的是「刀」不是「理」。重開後看破提升,先按刀,再算账。",
        "clueFx": "keenEye"
      }
    },
    "xiaoyaojin": {
      "cast": [
        "sunquan",
        "zhangliao",
        "lingtong",
        "ganning",
        "zhoutai"
      ],
      "objective": "在逍遥津的窄桥邊,讓張辽的八百冲不散十萬,也护住凌统的断後。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "合肥城頭,張辽把八百死士列在門前,甲叶上一滴水都没有——他们已等了一夜。城外,吴軍十萬,刚拔完营。"
        },
        {
          "speaker": "zhangliao",
          "text": "吴人新至,营垒未立。此刻冲陣,八百人能当八萬。随我——冲!"
        },
        {
          "speaker": "sunquan",
          "text": "張辽?!他怎么敢出城!各营勿慌,先稳住——甘宁,凌统,护住侧翼!"
        },
        {
          "speaker": "lingtong",
          "text": "主公先走!凌家三百亲兵,還够挡一陣!"
        },
        {
          "speaker": "ganning",
          "text": "公绩!别逞英雄!你的三百人,不是拿來换主公一程的!"
        }
      ],
      "intros": {
        "zhangliao": [
          {
            "when": "seen:zhangliao",
            "bio": "他记得你的阵怎样在半渡时稳住,这次把冲锋的时机又提前了半刻。",
            "quote": "又想稳住阵脚?我的刀,不给你列阵的时间。"
          },
          {
            "bio": "八百人的胆,是他一夜一夜喂出来的。",
            "quote": "辽来十年,只为今日这一冲!"
          }
        ],
        "lejin": [
          {
            "bio": "他与张辽、李典共守合肥,三人面和心齐,刀却各自藏锋。",
            "quote": "张将军冲前,乐某守后——合肥的门,进得来出不去。"
          }
        ],
        "lidian": [
          {
            "bio": "他劝张辽「先折其盛气」时不带私怨,布阵最重「余地」二字。",
            "quote": "李曼成不与你斗狠。我只封你要退的路。"
          }
        ]
      },
      "map": [
        {
          "id": "half-ford",
          "node": 1,
          "title": "逍遥津 · 半渡之桥",
          "lines": [
            {
              "speaker": "zhoutai",
              "text": "主公,津桥的板朽了兩块,馬不能疾驰。幼平先背主公過桥!"
            },
            {
              "speaker": "lingtong",
              "text": "幼平帶主公走!我挡張辽!"
            },
            {
              "speaker": "you",
              "text": "張辽要的不是杀孫權,是「吴軍自亂」四个字。别把十萬人的心,输給八百人的胆。"
            }
          ],
          "choices": [
            {
              "id": "hold-line",
              "text": "教十万军先结阵,再渡桥",
              "detail": "本回看破提升,记住结阵渡桥",
              "effects": {
                "keenEye": true,
                "fact": "xiaoyaojin_line"
              }
            },
            {
              "id": "rear-guard",
              "text": "亲领断后,换主公先渡",
              "detail": "军资 +100,张辽军起手士气 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "xiaoyaojin_rear"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "xiaoyaojin-open",
          "at": "start",
          "speaker": "zhangliao",
          "text": "張辽在此!吴軍聽着——今日,只取你们陣中最亂的一处!"
        },
        {
          "id": "xiaoyaojin-charge",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "八百人凿進吴陣,像一柄锥子。所過之处,十萬人的旗自己在倒。"
        },
        {
          "id": "xiaoyaojin-ling",
          "at": "hand:3",
          "speaker": "lingtong",
          "text": "主公過了桥!三百亲兵……還剩几十。够了,够再挡一陣!"
        },
        {
          "id": "xiaoyaojin-low",
          "at": "low",
          "speaker": "sunquan",
          "text": "公绩回來!凌统——回來!孤的江東,不能靠你们一个个用命换!"
        }
      ],
      "win": {
        "text": "津桥修复的那一瞬,吴軍十萬终于列成了陣。張辽在城頭望見,收刀入鞘:\"吴人能稳住了,此城不可再出。\"凌统浑身是血地踏上桥板,孫權亲自下馬扶住他。回建业的路上再無笑声,只有孫權的一句:\"孤记住了合肥,记住了張文远。\"",
        "hook": "逍遥津的教训,讓江東把目光彻底收回荆州。而劉備的漢中鼓声,已经敲到了定軍山下。"
      },
      "loss": {
        "text": "十萬人的陣,终究没能挡住八百人的胆。津桥一断,凌统的三百亲兵留在了对岸,張辽的名字从此壓在江東六岁孩童的哭声里。",
        "clue": "史鉴 · 張辽赢在「趁亂」不在「兵多」。重開時先结陣再渡桥;他冲不亂你,就轮到他不敢单獨出城。",
        "clueFx": "keenEye"
      }
    }
  },
  "4": {
    "yiling": {
      "cast": [
        "liubei",
        "luxun",
        "guanyu",
        "zhuge",
        "huangquan",
        "maliang",
        "shamoke"
      ],
      "objective": "拆開七百里连营，在陆逊點火之前，讓劉備看見复仇之外還有多少條命。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "猇亭的林叶密得透不過風。每一座营盘都挨着下一座，像有人把七百里怨氣铺成了一根火绳。"
        },
        {
          "speaker": "guanyu",
          "text": "麦城那條命，是你替我夺回來的。今日若還要東征，便别再拿我当报仇的理由。",
          "when": "page:maicheng:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "云長的首级送到洛阳時，朕没有哭。如今每一座营里都有人喊他，朕便不能再退。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "huangquan",
          "text": "陛下,水軍当為前锋,沿江直下;若舍船就陆,连营林木之间,是把七百里的命交給天時。",
          "when": "!seen:huangquan"
        },
        {
          "speaker": "maliang",
          "text": "五溪番王沙摩柯已到,夷陵道上的圖,馬良又核了一遍。陛下,只差您一句「移营」。"
        },
        {
          "speaker": "shamoke",
          "text": "漢家皇帝替俺们撑腰,這一仗,番王的骨朵不認吴人的水!"
        },
        {
          "speaker": "luxun",
          "text": "我不怕劉使君怒。他越怒，越会把山林、连营和人心，亲手摆成一堆柴。"
        }
      ],
      "intros": {
        "luxun": [
          {
            "when": "page:maicheng:yeshi",
            "bio": "荆州无恙，他仍守着江东；这一战不再只是复仇，却仍可能毁于意气。",
            "quote": "关将军尚在，这仗便不该只为一口气。"
          },
          {
            "bio": "他把少年意气藏进儒生衣袖，等刘备自己把胜机连成火路。",
            "quote": "你家主公要仇，我要江东。火该落在何处？"
          }
        ]
      },
      "map": [
        {
          "id": "move-camps",
          "node": 1,
          "title": "猇亭 · 火未到先移营",
          "lines": [
            {
              "speaker": "liubei",
              "text": "将士避暑入林，是朕的令。今日移营，便是叫他们以為朕怕了陆逊。"
            },
            {
              "speaker": "zhuge",
              "text": "陛下，陆逊固守不是怯，是在等我们自己把营盘摆成柴。可退一座孤营，不可退七百里人心。"
            }
          ],
          "choices": [
            {
              "id": "high-ground",
              "text": "弃林就高，拆开相连营垒",
              "detail": "本回看破提升，记住移营之策",
              "effects": {
                "keenEye": true,
                "fact": "yiling_high_camp"
              }
            },
            {
              "id": "fire-oil",
              "text": "夜袭吴军火油队",
              "detail": "陆逊军资 -200，记住火油所在",
              "effects": {
                "raid": true,
                "fact": "yiling_fireoil"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yiling-open",
          "at": "start",
          "speaker": "luxun",
          "text": "你催得越急，我越不必急。你押上的不是軍資，是蜀营還能忍几日。"
        },
        {
          "id": "yiling-anguish",
          "at": "hand:2",
          "speaker": "liubei",
          "text": "我若在此退一步，是否便对不起那些随我入蜀、又随我東征的人？"
        },
        {
          "id": "yiling-brother",
          "at": "hand:3",
          "speaker": "guanyu",
          "text": "大哥，我的命尚在。别再拿别人的命祭我。",
          "when": "page:maicheng:yeshi"
        },
        {
          "id": "yiling-counsel",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "亡者不会因多死几人便歸來。先看火油，再看你的仇。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "id": "yiling-low",
          "at": "low",
          "speaker": "luxun",
          "text": "你终于肯看营外了。可惜火烧起來以後，再清醒的将令也会慢一步。"
        }
      ],
      "win": {
        "text": "第一支火箭落下時，旧营已经空了。陆逊隔江望着分散的高垒，终于收起那柄始终未點的火折。劉備没有乘勝追杀，只命人逐营清點歸乡的姓名。",
        "hook": "夷陵没有烧成灰烬，劉備却倒在了永安宫。下一頁，对手连姓名也没有。",
        "choiceFact": "yiling_fire_avoided"
      },
      "loss": {
        "text": "火沿营盘奔去，比任何一道軍令都快。你护着劉備退向白帝，才懂陆逊等的从來不是東風，而是你因愤怒而不肯改變的那一夜。",
        "clue": "史鉴 · 陆逊以固守拖高盲注，再赌你急于求成；重開時假破绽减少，先拆连营之势。",
        "clueFx": "keenEye"
      }
    },
    "baidicheng": {
      "cast": [
        "liubei",
        "zhuge",
        "guanyu",
        "caopi"
      ],
      "objective": "同沉疴争回劉備的時间，也讓那句托孤从试探与重担，變回真正的信任。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "永安宫的药香壓不住江潮。劉備枕邊放着写了一半的遗诏，最後几个字迟迟不肯落下。"
        },
        {
          "speaker": "narrator",
          "text": "兩年前，曹丕在受禅台上接過漢家玉玺。消息传到成都，满朝劝進——先主登基，為的是续漢，也為了一句「漢可不亡」。"
        },
        {
          "speaker": "caopi",
          "text": "舜禹之事,朕知之矣。漢四百年,终须有人替它合上書頁——玄德,你不肯吗?",
          "when": "!seen:caopi"
        },
        {
          "speaker": "liubei",
          "text": "云長還活着，夷陵也没烧起來。可我為何還是躺到了這里？原來人躲過自己的错，也躲不過岁月。",
          "when": [
            "page:maicheng:yeshi",
            "page:yiling:yeshi"
          ]
        },
        {
          "speaker": "liubei",
          "text": "云長還活着，夷陵的火却仍旧烧過。原來救下一个名字，并不会替我们免去下一場错。",
          "when": [
            "page:maicheng:yeshi",
            "!page:yiling:yeshi"
          ]
        },
        {
          "speaker": "liubei",
          "text": "二弟走後，我總觉得每一天都是借來的。今日连借也没处借了，只得把阿鬥和孔明都叫來。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "陛下，病可医，話不可反着留。您今日想見的是臣，還是一个能替您背完蜀漢的人？"
        }
      ],
      "intros": {
        "天命 · 沉疴": [
          {
            "when": "page:yiling:yeshi",
            "bio": "夷陵的火没能烧尽季汉，它便换作药碗与更漏，慢慢收走刘备。",
            "quote": "人可躲过战火，未必躲得过岁月。"
          },
          {
            "bio": "它不用兵，也不出千，只把每一天都从病榻前拿走一点。",
            "quote": "你能赢群雄，可能赢一场病？"
          }
        ]
      },
      "map": [
        {
          "id": "last-words",
          "node": 1,
          "title": "永安宫 · 遗诏未落笔",
          "lines": [
            {
              "speaker": "liubei",
              "text": "我若說“君可自取”，是信你，還是把我不敢放下的江山壓給你？孔明，你猜我写這句話時怕不怕？"
            },
            {
              "speaker": "zhuge",
              "text": "主公若真信亮，便别把信任写成一道不许拒绝的命。臣要的不是自取，是您把阿鬥该担的也留給他。"
            }
          ],
          "choices": [
            {
              "id": "plain-words",
              "text": "请他当面说尽未言之语",
              "detail": "本回看破提升，记住病榻真言",
              "effects": {
                "keenEye": true,
                "fact": "baidi_plain_words"
              }
            },
            {
              "id": "adou-duty",
              "text": "让阿斗先自己读完奏章",
              "detail": "天命起手士气 -1，记住少主亲政",
              "effects": {
                "sow": 1,
                "fact": "baidi_adou_duty"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "baidi-open",
          "at": "start",
          "speaker": "unknown",
          "text": "你改得了人的命，改得了日出日落吗？"
        },
        {
          "id": "baidi-trust",
          "at": "hand:2",
          "speaker": "liubei",
          "text": "我這一生卖過草鞋，也坐過皇位。临到最後，最怕的竟是阿鬥离了人便站不住。"
        },
        {
          "id": "baidi-answer",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "那便讓他今日自己站起來。臣能辅他，不能替他活。"
        },
        {
          "id": "baidi-brother",
          "at": "low",
          "speaker": "guanyu",
          "text": "大哥，麦城你没丢下我。今日也不许先丢下自己。",
          "when": "page:maicheng:yeshi"
        },
        {
          "id": "baidi-memory",
          "at": "low",
          "speaker": "liubei",
          "text": "云長，若你還在，会不会又骂我只会哭？",
          "when": "!page:maicheng:yeshi"
        }
      ],
      "win": {
        "text": "天光透進永安宫時，劉備推開药碗，自己坐了起來。他把“君可自取”四字从遗诏上划去，只写阿鬥当亲政、孔明当盡言。那句沉重得無人敢接的托付，终于没有說出口。",
        "hook": "病榻之後，南中又來急报。孟获不服王化，孔明却說要先擒住他的心。",
        "choiceFact": "liubei_survives"
      },
      "loss": {
        "text": "遗诏還是写完了。诸葛亮俯身接诏，劉備终于安心，却也把一座江山从此壓在了他一个人的晨起与夜寐上。",
        "clue": "史鉴 · 沉疴靠長久消耗取勝；重開時軍資 +150，先保住自己的底池，再谈托孤之外的可能。",
        "clueFx": "supply"
      }
    },
    "qiqin": {
      "cast": [
        "zhuge",
        "menghuo"
      ],
      "objective": "七戰不只擒人，更要讓孟获从恼怒、猜疑到自省，亲口决定南中的明天。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "泸水瘴氣未散，第一根绊馬索已经備好。诸葛亮却命人连孟获的酒碗也一并洗净。"
        },
        {
          "speaker": "menghuo",
          "text": "你帶多少兵，我借多少山。南中不是你地圖上一块空着的地方！"
        },
        {
          "speaker": "zhuge",
          "text": "我若只要你的降表，擒一次便够。我要的是你回去以後，不必再靠造反证明自己。"
        }
      ],
      "intros": {
        "menghuo": [
          {
            "when": "page:qiqin:yeshi",
            "bio": "南中已经心服，他却仍愿回到泸水，看看那次服气是不是偶然。",
            "quote": "服过一回，不等于让你再赢七回！"
          },
          {
            "when": "seen:menghuo",
            "bio": "他记得上次未被擒满的七局，也记得你每一次把他放到何处。",
            "quote": "上次没打完。南王说话算数，从头来！"
          },
          {
            "bio": "他有山的硬、酒的直，也有一句宁死不肯先说出口的“服”。",
            "quote": "先赢我，再跟我讲什么攻心！"
          }
        ]
      },
      "map": [
        {
          "id": "heart-of-nanzhong",
          "node": 1,
          "title": "泸水 · 放人与收心",
          "lines": [
            {
              "speaker": "menghuo",
              "text": "你们漢人擒了王，不斬便囚。你若真放我，不怕我帶更多人回來？"
            },
            {
              "speaker": "zhuge",
              "text": "怕。所以我不只放你，還要讓你的族人看清：回去以後，盐粮歸誰，山路歸誰，明日歸誰。"
            }
          ],
          "choices": [
            {
              "id": "listen-elders",
              "text": "先听南中长者说完旧俗",
              "detail": "本回看破提升，记住南中之约",
              "effects": {
                "keenEye": true,
                "fact": "qiqin_listen"
              }
            },
            {
              "id": "return-salt",
              "text": "分出军粮盐巴，送俘虏回乡",
              "detail": "军资 -100，孟获士气 -1",
              "effects": {
                "chips": -100,
                "sow": 1,
                "fact": "qiqin_hearts"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "qiqin-r1",
          "at": "start",
          "speaker": "menghuo",
          "text": "一場便想讓我低頭？南中的山都不答應！",
          "when": "round:1"
        },
        {
          "id": "qiqin-r2",
          "at": "start",
          "speaker": "menghuo",
          "text": "上次是绊馬索，不是真本事。有胆再擒我一次！",
          "when": "round:2"
        },
        {
          "id": "qiqin-r3",
          "at": "start",
          "speaker": "menghuo",
          "text": "我输在自己輕敌，不输你。下次我把藤甲、毒泉和旧友都帶來。",
          "when": "round:3"
        },
        {
          "id": "qiqin-r4",
          "at": "start",
          "speaker": "menghuo",
          "text": "你烧的是藤甲，不是南中人的心。我還是不服！",
          "when": "round:4"
        },
        {
          "id": "qiqin-r5",
          "at": "start",
          "speaker": "menghuo",
          "text": "為何每次擒了都放？你到底要我服你，還是服你的漢律？",
          "when": "round:5"
        },
        {
          "id": "qiqin-r6",
          "at": "start",
          "speaker": "menghuo",
          "text": "我若再回去起兵，倒显得南中只识刀枪。且坐下，把這一局打完。",
          "when": "round:6"
        },
        {
          "id": "qiqin-r7",
          "at": "start",
          "speaker": "menghuo",
          "text": "不必再放。今日我若输，替南中認你；我若赢，你也留下喝我一碗酒。",
          "when": "round:7"
        },
        {
          "id": "qiqin-answer",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "他每怒一次，便多問一次為何。别堵住他的問题，攻心才有門。"
        },
        {
          "id": "qiqin-low",
          "at": "low",
          "speaker": "menghuo",
          "text": "你赢的是底池，我還没输南中。再來！",
          "when": "!round:7"
        },
        {
          "id": "qiqin-low-seven",
          "at": "low",
          "speaker": "menghuo",
          "text": "我若此刻翻脸，先对不起的是那六次回去的路。",
          "when": "round:7"
        }
      ],
      "win": {
        "text": "第七次，孟获没有等兵士解绳，自己把王冠放在案上：“丞相，七次不是我的耻辱，是你七次肯信我還能明理。”他轉身向族人挥手，南中的鼓声第一次不為迎戰而响。",
        "hook": "南中既安，漢中灯亮。诸葛亮展開《出师表》，祁山在紙背等一條新路。",
        "choiceFact": "nanzhong_at_peace"
      },
      "loss": {
        "text": "孟获又一次走出营門，這次却没有回頭。不是他不服，是你只记住了要放六次，忘了每一次都该讓他多明白一點。",
        "clue": "史鉴 · 七場连戰会耗盡底池，擒人之前先留退路；重開時軍資 +150，别為一時痛快孤注一掷。",
        "clueFx": "supply"
      }
    },
    "qishan": {
      "cast": [
        "zhuge",
        "zhaoyun",
        "caozhen"
      ],
      "objective": "把《出师表》从遗言写成開端，在祁山打通一條粮道与人心都能久行的北伐路。",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "隆中那一日，我說天下可分。如今先主把未盡之言交給我，我才懂三分不是答案，只是讓人少流血的起點。",
          "when": "page:sangu:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "草堂門開了多少次，我便欠門外人多少句答复。今日出师，不為证明卧龍多智，只為不再只写“來日”。",
          "when": "!page:sangu:yeshi"
        },
        {
          "speaker": "zhaoyun",
          "text": "丞相，常山赵子龍還能请先登。别因我白了頭，便把我写成一面只供人回望的旧旗。"
        },
        {
          "speaker": "caozhen",
          "text": "诸葛亮，你把國事写成一表，我把祁山写成一堵墙。看誰先被自己的字困住。"
        }
      ],
      "intros": {
        "caozhen": [
          {
            "when": "page:qishan:yeshi",
            "bio": "祁山曾被走通过一次，他不再只守关隘，而要找出那条重新续上的粮路。",
            "quote": "同样的山路，我不会让你走通第二次。"
          },
          {
            "bio": "他守住的不是一座祁山，而是魏国以逸待劳、耗空季汉的老办法。",
            "quote": "表写得再好，粮车也不会自己过山。"
          }
        ]
      },
      "map": [
        {
          "id": "road-beyond-fire",
          "node": 1,
          "title": "祁山 · 不用火的進軍",
          "lines": [
            {
              "speaker": "zhaoyun",
              "text": "曹真把我的旗号都画在册上，却把我白發的数目画多了。他以為老将只能做疑兵。"
            },
            {
              "speaker": "zhuge",
              "text": "博望初用火時，诸将只問我何時再烧。今日偏不烧——祁山要争的是一條明年還能走的道。"
            }
          ],
          "choices": [
            {
              "id": "zhaoyun-feint",
              "text": "让子龙以旧旗佯攻斜谷",
              "detail": "曹真起手士气 -1，记住常山疑兵",
              "effects": {
                "sow": 1,
                "fact": "qishan_zhaoyun_feint"
              }
            },
            {
              "id": "grain-road",
              "text": "先修粮站，再谈进兵",
              "detail": "军资 +200，记住祁山粮道",
              "effects": {
                "chips": 200,
                "fact": "qishan_grain_road"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "qishan-open",
          "at": "start",
          "speaker": "caozhen",
          "text": "六出祁山？你若能出六次，我便能守六次。季漢耗得起几个六年？"
        },
        {
          "id": "qishan-patience",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "他以為持久便是原地不動。非也。能讓粮与人持续向前，才叫持久。"
        },
        {
          "id": "qishan-veteran",
          "at": "hand:3",
          "speaker": "zhaoyun",
          "text": "長坂坡我七進七出，不是為了讓後人只记住一个“勇”字。今日看我怎样回來。"
        },
        {
          "id": "qishan-low",
          "at": "low",
          "speaker": "caozhen",
          "text": "你不火攻，不奇袭，竟真把一步一营走成了攻势？"
        }
      ],
      "win": {
        "text": "祁山關門未破，山路却先活了：粮站一站接一站，赵云的旧旗从斜谷安然折返。曹真這才發现，诸葛亮要的不是一次入關，而是以後每次都能再來。",
        "hook": "路既通，下一道門叫街亭。馬谡已在帳中铺開地圖，把山上圈得極重。",
        "choiceFact": "qishan_road_open"
      },
      "loss": {
        "text": "《出师表》被風掀回案上。你不是败在曹真那一堵墙，而是把北伐当成一局必须立刻赢下的豪赌，忘了山路要留給下一年。",
        "clue": "史鉴 · 曹真借祁山消耗你的耐心；重開時假破绽减少，辨清他何時真守、何時等你抢進。",
        "clueFx": "keenEye"
      }
    },
    "jieting": {
      "cast": [
        "zhuge",
        "masuo",
        "wangping",
        "zhanghe"
      ],
      "objective": "讓馬谡把“高处必勝”改写成当道与水源，在張郃抵达前守住街亭，也守住他的命。",
      "coldOpen": [
        {
          "speaker": "masuo",
          "text": "丞相，置之死地而後生，兵書写得明白。山上俯瞰街亭，張郃來多少，我便破多少。"
        },
        {
          "speaker": "wangping",
          "text": "馬参軍，兵書也写水源。你圈的山頭那么高，可曾看見士兵要下山几日才喝到水？"
        },
        {
          "speaker": "zhuge",
          "text": "幼常，我讓你守的不是一幅好看的陣圖。今日若再無人敢驳你，错便先在我。"
        },
        {
          "speaker": "zhanghe",
          "text": "山上的旗越整齐越好。那样我只需围住山下，等他替我軍渴死。"
        }
      ],
      "intros": {
        "zhanghe": [
          {
            "when": "page:jieting:history",
            "bio": "他已在街亭等到过一次山上的破绽，这一次连水道会从哪里断都知道。",
            "quote": "山与水，你还会把哪一个留给敌人？"
          },
          {
            "bio": "张郃不与你争一处漂亮阵地，只逼你承认地形之外还有时日与渴。",
            "quote": "兵无常势。你却把山当成了常势。"
          }
        ]
      },
      "map": [
        {
          "id": "water-before-height",
          "node": 1,
          "title": "街亭 · 先看水後看山",
          "lines": [
            {
              "speaker": "masuo",
              "text": "若我今日聽王平，是全軍都会說我紙上谈兵，還是我终于敢承認自己也有一頁没读懂？"
            },
            {
              "speaker": "wangping",
              "text": "参軍，肯改軍令不是丢脸。讓弟兄们活着看見明早，才轮得到你我的脸面。"
            }
          ],
          "choices": [
            {
              "id": "joint-order",
              "text": "让马谡与王平共签守寨军令",
              "detail": "张郃起手士气 -1，记住两人共守",
              "effects": {
                "sow": 1,
                "fact": "jieting_joint_order"
              }
            },
            {
              "id": "survey-water",
              "text": "带马谡亲自踏勘山下取水路",
              "detail": "本回看破提升，记住水源军图",
              "effects": {
                "keenEye": true,
                "fact": "jieting_water_survey"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jieting-open",
          "at": "start",
          "speaker": "zhanghe",
          "text": "馬谡在山上？那我不必急着仰攻。先問他营中水囊，還够几局。"
        },
        {
          "id": "jieting-wangping",
          "at": "hand:2",
          "speaker": "wangping",
          "text": "他切粮道是假，试水道是真。别追那一面來回晃的旗。"
        },
        {
          "id": "jieting-masuo",
          "at": "hand:3",
          "speaker": "masuo",
          "text": "传令，下寨当道。不是王平勝了我，是街亭比我的勝負要紧。"
        },
        {
          "id": "jieting-low",
          "at": "low",
          "speaker": "zhanghe",
          "text": "你肯从山上下來，我便少了一半勝算。诸葛亮身邊，竟有人肯認错。"
        }
      ],
      "win": {
        "text": "張郃抵达時，当道营寨已经咬住山口，取水队从後沟安然往返。馬谡亲手划去圖上的山顶大寨，诸葛亮没有挥泪，只讓他与王平同坐，重写那份軍令。",
        "hook": "街亭守住，司馬懿却轉向西城。那里没有馬谡，只有一張琴和敞開的門。",
        "choiceFact": "jieting_held"
      },
      "loss": {
        "text": "山上的喊声先亂，随後才是刀兵。诸葛亮要斬的似乎不只是馬谡，還有那个明知他爱逞才、却仍把街亭交給他的自己。",
        "clue": "史鉴 · 張郃会假攻粮道、實困水源；重開時其起手士氣 -1，先守住底池再圖反击。",
        "clueFx": "sow"
      }
    },
    "kongcheng": {
      "cast": [
        "zhuge",
        "simayi"
      ],
      "objective": "把無兵可守變成司馬懿不敢承受的代价，讓琴声、城門与他的多疑各守一道防線。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "西城的門轴上了油，连一声吱呀也不肯出。城中老弱洒扫，城上只摆一張琴。"
        },
        {
          "speaker": "simayi",
          "text": "博望的火、赤壁的風，我都复盘過。孔明，你今日又替我備了什么？"
        },
        {
          "speaker": "zhuge",
          "text": "街亭未失，他却仍咬住西城。看來他不是來捉馬谡，是來逼我亲手承認無兵。",
          "when": "page:jieting:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "街亭的败报在袖中，城中的老弱在門下。仲达要看我的破绽，便給他一个最像真的。",
          "when": "!page:jieting:yeshi"
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "page:kongcheng:yeshi",
            "bio": "他曾在西城退过一次，此后每一声琴都像在提醒那次不敢输。",
            "quote": "同一座城，我不会再替你退第二次。"
          },
          {
            "when": "page:jieting:yeshi",
            "bio": "街亭没有替他耗空蜀军，他便亲自来读诸葛亮最险的一笔。",
            "quote": "马谡没败，你便以为我也看不穿西城？"
          },
          {
            "when": "seen:simayi",
            "bio": "他记得你的下注，也记得自己曾因算得太深而放走一座城。",
            "quote": "这次我会少算一层，还是多算一层？"
          },
          {
            "bio": "冢虎第一次坐到卧龙对面，最利的武器不是兵，而是肯多想一层。",
            "quote": "城中若无人，你为何敢请我进？"
          }
        ]
      },
      "map": [
        {
          "id": "tune-for-sima",
          "node": 1,
          "title": "城楼 · 琴要弹給誰聽",
          "lines": [
            {
              "speaker": "zhuge",
              "text": "他若進城，我输；他若因不敢输而退，我们便赢。把城門再擦净些，别留半分欲盖弥彰。"
            },
            {
              "speaker": "you",
              "text": "若他這次宁可犯错，也要進來看一看呢？"
            },
            {
              "speaker": "zhuge",
              "text": "所以琴不能只求镇定，要讓他聽見：我已经把他不肯認错的後路，也算進伏兵里。"
            }
          ],
          "choices": [
            {
              "id": "slow-qin",
              "text": "把最后一遍琴弹得更慢",
              "detail": "司马懿起手士气 -1，记住慢琴",
              "effects": {
                "sow": 1,
                "fact": "kongcheng_slow_qin"
              }
            },
            {
              "id": "dust-reinforce",
              "text": "令斜谷尘土佯作援军",
              "detail": "司马懿军资 -200，记住疑兵尘影",
              "effects": {
                "raid": true,
                "fact": "kongcheng_dust"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "kongcheng-open",
          "at": "start",
          "speaker": "simayi",
          "text": "城中無人，你便是虚；城中有伏，你便是险。我只需决定，哪一种错更便宜。"
        },
        {
          "id": "kongcheng-zhuge",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "别看他的手，看他每加注一次便多怕一分的後果。空城卖的是他的顾忌。"
        },
        {
          "id": "kongcheng-you",
          "at": "hand:3",
          "speaker": "you",
          "text": "他怕的不是伏兵，是一旦攻错，天下都会說他输給了空城。"
        },
        {
          "id": "kongcheng-low",
          "at": "low",
          "speaker": "simayi",
          "text": "琴弦若断，我進；琴弦不断，我便還要想。孔明，你连断弦也舍得拿來骗我。"
        }
      ],
      "win": {
        "text": "琴音落到城下，司馬懿终于勒馬。他在三十里外回望空門：“我不是输給伏兵，是输給了不敢输。”诸葛亮掌心全是汗，却只讓書童再添一炉香。",
        "hook": "空城各输一口氣，五丈原再算總账。這一次，司馬懿决定连琴也不聽。",
        "choiceFact": "kongcheng_retreat"
      },
      "loss": {
        "text": "魏軍踏過城門時，琴声還维持着最後一个音。司馬懿没有笑，只說：“你赌我怕错，我這次偏要付一次错的代价。”",
        "clue": "史鉴 · 司馬懿会衡量诈唬的代价，而非只看氣势；重開時假破绽减少，别重复同一條下注線。",
        "clueFx": "keenEye"
      }
    },
    "wuzhangyuan": {
      "cast": [
        "zhuge",
        "simayi",
        "jiangwei"
      ],
      "objective": "在粮盡与秋風之前逼司馬懿作答，并把诸葛亮从既定的星落里帶回人间。",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "博望借火，赤壁借風，我一生都在借天時。此次不借了。你替我争一日，我便把這一日活完。"
        },
        {
          "speaker": "simayi",
          "text": "西城我退得太快，這次我连你的琴也不聽。你粮盡之日，便是我出兵之時。",
          "when": "page:kongcheng:yeshi"
        },
        {
          "speaker": "simayi",
          "text": "我不問你有何伏兵，也不問你有何妙計。五丈原只比一件事：誰先耗盡。",
          "when": "!page:kongcheng:yeshi"
        },
        {
          "speaker": "jiangwei",
          "text": "丞相，药又凉了。您總說看完這道軍报，可軍报永远没有最後一道。"
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "asZhuge",
            "bio": "这一次你亲手执起羽扇，冢虎终于不必隔着蜀营猜测卧龙的神色。",
            "quote": "孔明，你终于肯亲自坐在我对面。"
          },
          {
            "when": "page:wuzhangyuan:yeshi",
            "bio": "东南星明以后，他知道命数也会被赢走，却仍相信自己最懂消耗。",
            "quote": "多活的岁月，也是岁月。我仍耗得起。"
          },
          {
            "when": "page:kongcheng:yeshi",
            "bio": "空城的退兵成了他的旧伤；如今他用坚壁把旧伤磨成耐心。",
            "quote": "上次我算你的城，这次我只算你的粮。"
          },
          {
            "bio": "他把不战当作最长久的一注，等秋风替自己清掉对面的筹码。",
            "quote": "你可以赢每一阵，我只要等到最后一夜。"
          }
        ]
      },
      "map": [
        {
          "id": "one-more-day",
          "node": 1,
          "title": "武功水 · 向人间借一日",
          "lines": [
            {
              "speaker": "jiangwei",
              "text": "他不接戰，軍中便都劝丞相再催。可愈催，愈像替他证明秋風真的站在魏营。"
            },
            {
              "speaker": "zhuge",
              "text": "伯约，屯田不是認输。讓兵士知道明年有粮，讓百姓知道今年不扰，我才不必向夜空多借那几年。"
            }
          ],
          "choices": [
            {
              "id": "tuntian",
              "text": "与民屯田，让粮道自己生长",
              "detail": "军资 +200，记住渭滨屯田",
              "effects": {
                "chips": 200,
                "fact": "wuzhang_tuntian"
              }
            },
            {
              "id": "raid-grain",
              "text": "斜谷出奇兵，反断魏军粮路",
              "detail": "司马懿军资 -200，记住反客为主",
              "effects": {
                "raid": true,
                "fact": "wuzhang_counterraid"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "wuzhang-open",
          "at": "start",
          "speaker": "simayi",
          "text": "你送女装來，我便穿給诸将看。能讓丈夫羞怒的，从來不叫勝負。"
        },
        {
          "id": "wuzhang-zhuge",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "他不是無胆，是把我的命也算作盲注。别陪他等，要讓他每不應一次都付出軍資。"
        },
        {
          "id": "wuzhang-jiangwei",
          "at": "hand:7",
          "speaker": "jiangwei",
          "text": "丞相，東南星還未暗。您先喝药，這一手我陪您看。"
        },
        {
          "id": "wuzhang-tuntian-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "仲达，新粮已经入仓。你等的那陣秋風，今年怕要迟到了。",
          "when": "fact:wuzhang_tuntian"
        },
        {
          "id": "wuzhang-sima-low",
          "at": "low",
          "speaker": "simayi",
          "text": "你要星星再亮十年，我只等它暗一刻。看誰先撑不住。",
          "when": "!fact:wuzhang_tuntian"
        }
      ],
      "win": {
        "text": "五丈原的灯没有灭。司馬懿终于出戰，又在武功水畔折损先手；诸葛亮趁隙讓大軍与粮道一同向前。天亮時，他推開药碗，写下另一篇出师表——不是借來十年，而是不再把每一天交給命数。",
        "hook": "十四年很快。洛阳有人開始装病；這一次，卧龍尚在，旧局未清。",
        "choiceFact": "zhuge_survives"
      },
      "loss": {
        "text": "東南星暗下去時，司馬懿仍没有出戰。他不是赢了某一手，只是讓你把所有“明日再做”都拖成了秋風里的盲注。",
        "clue": "史鉴 · 坚壁把盲注拖成刀；重開時軍資 +150，先手争粮，莫与他比誰更能空耗。",
        "clueFx": "supply"
      }
    },
    "gaopingling": {
      "cast": [
        "simayi",
        "caoshuang",
        "simashi",
        "zhuge"
      ],
      "objective": "拆穿一坛专給曹爽看的病，在司馬懿睁眼之前守住诏書、武库与曹魏最後的選择。",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "五丈原後，我与他又通了许多年的信。今日只寄來四字：勿信其病。他不是等死，是等你先把他当死人。",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "speaker": "writer",
          "text": "五丈原的星已经落過。如今没人替你看冢虎，只剩一碗故意洒在手背上的粥。",
          "when": "!page:wuzhangyuan:yeshi"
        },
        {
          "speaker": "caoshuang",
          "text": "他连粥都喂不進，還能夺我的兵權？我去看過三次，三次都是如此。"
        },
        {
          "speaker": "simashi",
          "text": "父亲病成這样,师儿只能先持家中馈。将軍若疑,何不亲自再探一次?",
          "when": "!seen:simashi"
        },
        {
          "speaker": "simayi",
          "text": "大将軍……老朽只有一事，不放心。來日……還请你多照看我的兩个儿子。"
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "page:gaopingling:yeshi",
            "bio": "高平陵败过一次后，他不再只装病，连你的疑心也可能被他拿来布局。",
            "quote": "同一帖药，我不会再煎第二遍。"
          },
          {
            "when": "page:wuzhangyuan:yeshi",
            "bio": "五丈原没能熬走卧龙，他便把耐心带回洛阳，等另一个轻敌的人。",
            "quote": "孔明尚在，正好。我要让他看看，熬得住不只是命。"
          },
          {
            "bio": "他熬走过太多对手，如今把衰老演成最后一层甲，把曹爽的轻视养成刀。",
            "quote": "老朽病得很重。大将军，你当然可以放心。"
          }
        ]
      },
      "map": [
        {
          "id": "medicine-and-armory",
          "node": 1,
          "title": "高平陵 · 病榻外有刀",
          "lines": [
            {
              "speaker": "caoshuang",
              "text": "他若装病，骗的是我；他若真病，我此時動手，便坐實了欺辱老臣。你要我怎么办？"
            },
            {
              "speaker": "zhuge",
              "text": "五丈原後我只教他一件事：耐心也是下注。你若不看底牌，便会把他的忍耐当成天命。",
              "when": "page:wuzhangyuan:yeshi"
            },
            {
              "speaker": "writer",
              "text": "没有卧龍隔江提醒，你只能自己分辨：那碗粥喂給了病人，還是喂給了你的輕视。",
              "when": "!page:wuzhangyuan:yeshi"
            }
          ],
          "choices": [
            {
              "id": "read-prescription",
              "text": "对照药方、更次与喂粥的人",
              "detail": "本回看破提升，记住病榻伪证",
              "effects": {
                "keenEye": true,
                "fact": "gaoping_medicine"
              }
            },
            {
              "id": "guard-armory",
              "text": "先护太后诏书与洛阳武库",
              "detail": "司马懿军资 -150，记住先手守门",
              "effects": {
                "oppChips": -150,
                "fact": "gaoping_armory"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "gaoping-open-alive",
          "at": "start",
          "speaker": "simayi",
          "text": "孔明還活着，你也還爱多事。看來五丈原那一局，我确實输得不甘心。",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-open-fallen",
          "at": "start",
          "speaker": "simayi",
          "text": "孔明已不在。你们還有誰，肯把一个将死之人当作对手？",
          "when": "!page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-caoshuang",
          "at": "hand:2",
          "speaker": "caoshuang",
          "text": "他是在装？可满朝都看見了……你為何不早說！"
        },
        {
          "id": "gaoping-letter",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "你若只会等他死，便永远看不見他怎样活。",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-low",
          "at": "low",
          "speaker": "simayi",
          "text": "你识破我的病，却识不破百官的怕。刀出鞘以後，他们自会站到我這邊。"
        }
      ],
      "win": {
        "text": "粥碗落地，司馬懿翻身而起，却見武库門已闭、太後诏已读。曹爽没有交出印绶，满朝也没有等來一場只能站队的清洗。冢虎第一次發现，满座聪明人并不都愿意陪他装睡。",
        "hook": "司馬家的刀暂回鞘中，三國却未停手。多年後，阴平小道响起裹毡滚崖之声。",
        "choiceFact": "sima_coup_stopped"
      },
      "loss": {
        "text": "曹爽交印時還相信能做个富家翁。司馬懿没有立刻杀他，只讓他慢慢想明白：那坛病不是骗一个人的眼睛，是喂大一群人的侥幸。",
        "clue": "史鉴 · 他的虚弱多是诱饵，真正的强注藏在病後；重開時假破绽减少，别因摊牌前的示弱松手。",
        "clueFx": "keenEye"
      }
    },
    "yinping": {
      "cast": [
        "dengai",
        "dengzhong",
        "jiangwei",
        "zhugezhan",
        "zhugeshang",
        "zhuge"
      ],
      "objective": "从摩天岭到绵竹设下兩重回答，讓邓艾的孤軍無处落地，诸葛父子不必以死守名。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "阴平没有路，只有被雨冲淡的兽迹。邓艾命人裹毡滚崖，把自己的命也卷進了那层旧毡。"
        },
        {
          "speaker": "dengai",
          "text": "都、都說阴平無路。無路，才没人拦我。"
        },
        {
          "speaker": "dengzhong",
          "text": "父、父亲,忠先下探。绵竹若破,成都不戰自降——這一程,儿替您蹚。",
          "when": "!seen:dengzhong"
        },
        {
          "speaker": "zhugezhan",
          "text": "父相在時,常叹我等生于安樂。今日绵竹在身後,成都岁余,瞻,退無可退。"
        },
        {
          "speaker": "zhugeshang",
          "text": "祖父,父亲,儿孫三代之名,系于今日。尚,愿先登!"
        },
        {
          "speaker": "jiangwei",
          "text": "沓中不能丢，成都也不能丢。最怕的不是兩線作戰，是每一处都以為另一处有人。"
        }
      ],
      "intros": {
        "dengai": [
          {
            "when": "page:yinping:yeshi",
            "bio": "阴平曾让他撞上伏守，他却更相信绝境里总还有第二条兽径。",
            "quote": "这、这次我换一处下山。你还等得到吗？"
          },
          {
            "bio": "他说得结巴，行得决绝；所有人口中的不可能，都是他敢孤注一掷的理由。",
            "quote": "山、山不会让人。可人会绕过山。"
          }
        ],
        "dengzhong": [
          {
            "when": "seen:dengzhong",
            "bio": "初阵绵竹让他尝过血,这次把父亲的险棋又往前推了一格。",
            "quote": "父、父亲教我的,我教给你。"
          },
          {
            "bio": "虎父之下的少年,急于证明「邓」字不只属于上一辈。",
            "quote": "家父面前,休得无礼!"
          }
        ]
      },
      "map": [
        {
          "id": "light-on-cliff",
          "node": 1,
          "title": "阴平 · 無人处先點灯",
          "lines": [
            {
              "speaker": "zhuge",
              "text": "旧札只有一句：阴平非道，守江油者不可撤。当年人人說它多虑，如今紙頁比崖石還重。"
            },
            {
              "speaker": "jiangwei",
              "text": "守住了哨位，還要守哨位之间的回音。否则一盏灯灭，百里仍以為自己看得見。"
            },
            {
              "speaker": "zhugezhan",
              "text": "父相旧札我读了三遍:「阴平非道,守江油者不可撤」。哨位要设在能互相看見的地方。",
              "when": "page:jieting:yeshi"
            }
          ],
          "choices": [
            {
              "id": "three-beacons",
              "text": "依旧札设三处互望烽哨",
              "detail": "本回看破提升，记住绝壁灯火",
              "effects": {
                "keenEye": true,
                "fact": "yinping_beacons"
              }
            },
            {
              "id": "grain-ambush",
              "text": "迁走江油粮道，反设空仓诱敌",
              "detail": "邓艾军资 -200，记住空仓之计",
              "effects": {
                "raid": true,
                "fact": "yinping_empty_granary"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yinping-open",
          "at": "start",
          "speaker": "dengai",
          "text": "我、我身後没有粮，脚下没有路。你猜我除了向前，還能往哪儿退？"
        },
        {
          "id": "yinping-jiangwei",
          "at": "hand:2",
          "speaker": "jiangwei",
          "text": "别追他的将旗。裹着毡的才是他，走得最慢的辎重才藏着全軍活路。"
        },
        {
          "id": "yinping-zhan",
          "at": "hand:3",
          "speaker": "zhugezhan",
          "text": "高处不是勝势,能守住水与退路才是。绵竹的陣,瞻替父相补上這一课。",
          "when": "page:jieting:yeshi"
        },
        {
          "id": "yinping-shang",
          "at": "hand:3",
          "speaker": "zhugeshang",
          "text": "邓忠!我祖我父之名在此——我的枪,比你的快!",
          "when": "multi"
        },
        {
          "id": "yinping-low",
          "at": "low",
          "speaker": "dengai",
          "text": "山都讓我過了，你、你以為几堆石頭便能留住我？"
        }
      ],
      "win": {
        "text": "摩天岭上先有灯，再有滚木。邓艾抬頭時，江油的空仓也已落锁；這條以命换出來的奇路，终于成了绝路。姜维收好旧札，没有庆功，只先給三处烽哨添了灯油。",
        "hook": "蜀地守住，建业的潮声却渐低。旧史只剩最後一句：三分歸晋。",
        "choiceFact": "yinping_held"
      },
      "loss": {
        "text": "邓艾落地時，身後只剩一层磨穿的毡。江油開門不是因為城中無勇，而是所有人都把阴平的那一句“不可能”当成了守備。",
        "clue": "史鉴 · 邓艾以孤軍不断抢進，退守只会替他省粮；重開時敌軍軍資 -200，抢先壓住他的落地之势。",
        "clueFx": "raid"
      }
    },
    "guijin": {
      "cast": [
        "simayan",
        "wangjun",
        "duyu",
        "sunhao",
        "cenhun",
        "writer"
      ],
      "objective": "在“天下歸一”落笔前打完三國最後一局，证明合并不必等于抹掉所有人的名字。",
      "coldOpen": [
        {
          "speaker": "simayan",
          "text": "華容那一刀早落過，北方却照样换了人间。你们總說能改命，最後不還是由我司馬氏收場？",
          "when": [
            "choice:huarong:yeshi",
            "!choice:huarong:yeshiB"
          ]
        },
        {
          "speaker": "simayan",
          "text": "華容你肯放曹操，是給魏续了一口氣。可惜那口氣最後姓了司馬，你的“義”又救了誰？",
          "when": "choice:huarong:yeshiB"
        },
        {
          "speaker": "wangjun",
          "text": "楼船百丈,铁锁千寻。王濬在益州造了七年船,只為這一趟顺流。",
          "when": "!seen:wangjun"
        },
        {
          "speaker": "duyu",
          "text": "羊公临终荐预。荆州的人心他已经收好了,预只欠一場水涨。",
          "when": "!seen:duyu"
        },
        {
          "speaker": "sunhao",
          "text": "铁锁横江,天堑自在。晋人的楼船?讓他们先問過江里的石頭!"
        },
        {
          "speaker": "cenhun",
          "text": "陛下放心,岑昏再加三道锁,火烧不断,水淹不透!"
        },
        {
          "speaker": "writer",
          "text": "這是旧史最後一頁。你若赢，“天下歸一”便不再是唯一能写完的句子。"
        }
      ],
      "intros": {
        "simayan": [
          {
            "when": "page:guijin:yeshi",
            "bio": "他曾被迫承认归并非唯一结局，因此再来时更想把所有可能一并收回。",
            "quote": "上次你留下三面旗。这次朕连旗杆也要收走。"
          },
          {
            "bio": "他继承的不只是三国疆土，还有祖父最懂的那种等待：等所有人都厌倦。",
            "quote": "你们打了一辈子，最后还不是要一个“合”字？"
          }
        ],
        "wangjun": [
          {
            "when": "seen:wangjun",
            "bio": "上一场江风让他记住了你,这次连火炬都备了两份。",
            "quote": "烧、烧不断的是我的船。再来!"
          },
          {
            "bio": "七十岁还想封侯的老将,把半生都押在了这条江上。",
            "quote": "楼船下益州。金陵王气,收在此行。"
          }
        ]
      },
      "map": [
        {
          "id": "names-under-unification",
          "node": 1,
          "title": "石頭城 · 降表外的姓名",
          "lines": [
            {
              "speaker": "simayan",
              "text": "朕給建业留全城性命，給蜀主留安樂封号。你们還要什么？難道割据一生的名字，比太平更要紧？"
            },
            {
              "speaker": "you",
              "text": "太平若只准一个人命名，下一次分裂時，便又只有刀能說話。"
            },
            {
              "speaker": "writer",
              "text": "别只替英雄争座位。看看降表背面，那些没被写進去的人，才真正等了三代。"
            }
          ],
          "choices": [
            {
              "id": "record-people",
              "text": "先记下降表背后的百姓姓名",
              "detail": "本回看破提升，记住万民之史",
              "effects": {
                "keenEye": true,
                "fact": "guijin_people"
              }
            },
            {
              "id": "three-flags",
              "text": "重列三国旧旗，再争最后一局",
              "detail": "司马炎起手士气 -1，记住三分余响",
              "effects": {
                "sow": 1,
                "fact": "guijin_three_flags"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "guijin-open",
          "at": "start",
          "speaker": "simayan",
          "text": "魏熬走了蜀，晋又接過了魏。你看，等待比你们的奇謀都長久。"
        },
        {
          "id": "guijin-writer",
          "at": "hand:2",
          "speaker": "writer",
          "text": "他把“歸一”当作底牌，你便不必比他更像天命。讓他证明，凭什么只能如此。"
        },
        {
          "id": "guijin-you",
          "at": "hand:3",
          "speaker": "you",
          "text": "合不是把三个名字磨成一个，是讓下一个名字出现時，不必先掀起一場亂世。"
        },
        {
          "id": "guijin-low",
          "at": "low",
          "speaker": "simayan",
          "text": "没有朕來收場，你们還要打多少年？你敢把這句話也說給城中百姓聽吗？"
        }
      ],
      "win": {
        "text": "楼船在江心停下，建业没有献出降表。司馬炎看着三分旧旗，第一次問：“若天下不是一件戰利品，朕還能留下什么？”没有人能替他作答，但城中粮市第二天照常開了門。",
        "hook": "卷四写盡，紙背却還有一頁。写卷人已摆好牌：他要与你谈谈這些被改過的命。",
        "choiceFact": "jin_unification_stopped"
      },
      "loss": {
        "text": "石頭城终于挂出晋旗。百姓确實等來了太平，只是旧史把所有人的名字越写越小，最後只留下“歸晋”二字。",
        "clue": "史鉴 · 司馬炎借歸一大势持续施壓；重開時敌軍軍資 -200，别替他提前相信结局。",
        "clueFx": "raid"
      }
    },
    "zuizhong": {
      "cast": [
        "writer"
      ],
      "objective": "讓写卷人承認你不是他的注脚；赢下最後一局，在封卷、還史、撕卷之间决定全書的去处。",
      "coldOpen": [
        {
          "speaker": "writer",
          "text": "白門楼你讓吕布活下，後來每个人都多了一條本不该有的路。你以為我没看見？我每一笔都记着。",
          "when": "fact:lvbu_lives"
        },
        {
          "speaker": "writer",
          "text": "麦城你救下關羽，我便看着夷陵少了理由、白帝城少了遗恨。可你没有救下所有遗憾，对不对？",
          "when": "page:maicheng:yeshi"
        },
        {
          "speaker": "writer",
          "text": "麦城的雪仍在，夷陵的火也曾等着。你救過一些人，也亲手翻過一些來不及救的頁。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "writer",
          "text": "封卷，留住你的野史；還史，歸還原來的命；撕卷，讓往後不再有人预知。赢我，這三件事才轮得到你。"
        }
      ],
      "intros": {
        "写卷人": [
          {
            "when": "page:zuizhong:yeshi",
            "bio": "他记得你曾把结局带出这一页，却仍不肯承认书只能有一种归处。",
            "quote": "又回来改答案？这次连我也不替你记着。"
          },
          {
            "when": "fact:zhuge_survives",
            "bio": "他看见东南星仍亮，也知道你救下孔明之后，历史并没有因此变轻。",
            "quote": "你救过他一次，便真懂怎样救人了吗？"
          },
          {
            "bio": "他知道你翻过的每一页，却第一次坐在只能验牌、不能预设结果的位置。",
            "quote": "我写过你的来路。现在，让我看看你的选择。"
          }
        ]
      },
      "map": [],
      "battle": [
        {
          "id": "zuizhong-open-survivor",
          "at": "start",
          "speaker": "writer",
          "text": "五丈原那颗星還亮着。你以為救下孔明是答案？那只是讓仲达多了一个不能靠等待赢的人。",
          "when": "fact:zhuge_survives"
        },
        {
          "id": "zuizhong-open-fallen",
          "at": "start",
          "speaker": "writer",
          "text": "五丈原的秋風我留着。你可以赢司馬懿，却未必背得動一个非死不可的人。",
          "when": "!fact:zhuge_survives"
        },
        {
          "id": "zuizhong-seal",
          "at": "hand:2",
          "speaker": "writer",
          "text": "封卷，我把這些野史装帧成書。他们会活在你改過的那一頁，却永远到不了下一頁。"
        },
        {
          "id": "zuizhong-return",
          "at": "hand:3",
          "speaker": "writer",
          "text": "還史，我把笔墨收回。麦城的雪、五丈原的風照旧，你只帶走自己見過他们的记忆。"
        },
        {
          "id": "zuizhong-tear",
          "at": "hand:4",
          "speaker": "writer",
          "text": "撕卷，誰都可能再活一次，誰都可能再死一次。没有底稿，也没有我替你兜底。"
        },
        {
          "id": "zuizhong-huarong-spare",
          "at": "hand:5",
          "speaker": "writer",
          "text": "華容你放走曹操，信一个“義”字能抵過後患。今日再問你：敢不敢信未知也能抵過结局？",
          "when": "choice:huarong:yeshiB"
        },
        {
          "id": "zuizhong-huarong-strike",
          "at": "hand:5",
          "speaker": "writer",
          "text": "華容你讓刀落下，改了一个奸雄的命，改不了後人争位。撕卷也不会替你免去選择。",
          "when": [
            "choice:huarong:yeshi",
            "!choice:huarong:yeshiB"
          ]
        },
        {
          "id": "zuizhong-low",
          "at": "low",
          "speaker": "writer",
          "text": "我知你每一張旧牌，却不知下一張。读者，這就是我肯坐下与你赌的原因。"
        }
      ],
      "win": {
        "text": "写卷人推開牌，第一次没有替你写结局。桌上并排放着封绳、旧史与一把無刃的裁紙刀：封卷，留住所改；還史，承担所失；撕卷，交還未知。你伸手時，整本書都在等。",
        "hook": "三个答案都在下一問里。你選择的不是结局，而是誰有權写下结局。"
      },
      "loss": {
        "text": "他提笔在你的名字旁添了一个“又”字，所有改写便退回頁邊。可他没有抹去你坐過的位置——那說明下一次，他仍需要你來。",
        "clue": "史鉴 · 写卷人熟知你的旧策，却只能按牌理下注；重開時假破绽减少，别被他的全知语氣吓退。",
        "clueFx": "keenEye"
      }
    },
    "tianshui": {
      "cast": [
        "zhuge",
        "zhaoyun",
        "jiangwei",
        "weiyan",
        "guanxing",
        "zhangbao"
      ],
      "objective": "识破冀城少年的每一步先手,把北伐最大的意外之得,请進蜀营。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "一出祁山,三郡响應。诸葛亮亲自设伏天水,却見城頭一少年按圖布防,把丞相的疑兵一一识破。"
        },
        {
          "speaker": "zhaoyun",
          "text": "某自長坂以來,未逢敌手。今日天水城下,這少年的枪,竟逼得某拨馬而回。"
        },
        {
          "speaker": "jiangwei",
          "text": "老将軍莫怪。维自幼读丞相兵法,今日不過是,替守城的弟兄们,把它原样還回去。"
        },
        {
          "speaker": "zhuge",
          "text": "子龍一生谨慎,能令他「拨馬而回」的人,亮必亲往会之。"
        },
        {
          "speaker": "guanxing",
          "text": "丞相,兴愿随軍!聽說是同辈人,某這口刀,也想会会他。"
        }
      ],
      "intros": {
        "jiangwei": [
          {
            "when": "seen:jiangwei",
            "bio": "他记得你怎样一步步卸掉他的先手,这次把阵扎在了你要来的路上。",
            "quote": "又来?这次,先手在我。"
          },
          {
            "bio": "冀城天水之间的少年郡吏,兵法是偷学的,忠义是自家的。",
            "quote": "姜维在此。丞相的计,某接得住。"
          }
        ]
      },
      "map": [
        {
          "id": "young-reader",
          "node": 1,
          "title": "天水 · 他在读你",
          "lines": [
            {
              "speaker": "zhuge",
              "text": "亮布疑兵,他识疑兵;亮调粮道,他护粮道。此子用兵,倒像是把亮的旧稿先读了一遍。"
            },
            {
              "speaker": "weiyan",
              "text": "丞相,何须费事?文長领一軍,连夜拿下冀城,人自然到手!"
            },
            {
              "speaker": "zhangbao",
              "text": "魏将軍急什么!丞相要的不是城,是那个人。俺爹說過,抢來的不服,请來的才真。"
            },
            {
              "speaker": "you",
              "text": "他现在守的,是郡守的命令。要赢他,得先讓他發现,自己真正想守的是什么。"
            }
          ],
          "choices": [
            {
              "id": "mirror-plan",
              "text": "以丞相旧稿反设一局",
              "detail": "本回看破提升,记住镜像之局",
              "effects": {
                "keenEye": true,
                "fact": "tianshui_mirror"
              }
            },
            {
              "id": "open-letter",
              "text": "阵前递去丞相手书一封",
              "detail": "军资 +120,姜维起手士气 -1",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "tianshui_letter"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "tianshui-open",
          "at": "start",
          "speaker": "jiangwei",
          "text": "丞相的疑兵,某已拆過一遍。你,是第二遍吗?"
        },
        {
          "id": "tianshui-zhaoyun",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "少年,你的枪是快。可你在守的是馬遵的城,不是你自己的心。"
        },
        {
          "id": "tianshui-mirror",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "他照旧稿布的陣,被你用同一份旧稿反锁。少年盯着陣圖,忽然發现自己烂熟于胸的,竟是蜀营的路数。",
          "when": "fact:tianshui_mirror"
        },
        {
          "id": "tianshui-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "伯约,亮不夺你的城。亮只想問你一句:你的兵法,可愿有个用它的天下?"
        }
      ],
      "win": {
        "text": "冀城開城的那天,姜维单骑出降,甲胄未卸,先向蜀营深深一揖。诸葛亮下车扶住他:\"亮平生所学,今有传人。\"赵云在一旁按枪而笑。此後北伐的每一次點将,名单上多了一个年輕的、读遍丞相旧稿的名字。",
        "hook": "得了姜维,北伐的旗更急。可街亭的名字,已在軍圖上冷冷地亮了起來。"
      },
      "loss": {
        "text": "你急于收服,反被少年将計就計。天水城門合拢的那一刻,他站在城頭輕声說:\"丞相之才,某敬佩。可某的枪,只為守土而出。\"",
        "clue": "史鉴 · 姜维赢在先手,不在兵多。重開時先递信、後设局;讓他自己走過來,别去追他。",
        "clueFx": "sow"
      }
    },
    "chencang": {
      "cast": [
        "zhuge",
        "haozhao",
        "weiyan",
        "jiangwei",
        "guanxing"
      ],
      "objective": "在云梯与火箭之间,找到郝昭守城的理由,再决定陈仓该不该破。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "陈仓城小而坚,守将郝昭,不過千人。蜀軍云梯、冲车、地道轮番上陣,城頭的火箭一一點名。"
        },
        {
          "speaker": "haozhao",
          "text": "诸葛丞相的攻具,昭领教二十日了。城小,好在要守的也少。"
        },
        {
          "speaker": "zhuge",
          "text": "郝伯道守城有法,强攻徒损将士。伯约,你說,困城先困什么?"
        },
        {
          "speaker": "jiangwei",
          "text": "维以為,困城先困心。郝昭同乡靳详在軍中,可先劝降,探他守志。"
        },
        {
          "speaker": "weiyan",
          "text": "二十日了!再劝下去,長安的援軍就到了。丞相,給文長三日益,必破此城!"
        }
      ],
      "intros": {
        "haozhao": [
          {
            "when": "seen:haozhao",
            "bio": "他记得你的每一种攻具,城头又添了三排火箭。",
            "quote": "云梯?冲车?还是地道?我都备好了。"
          },
          {
            "bio": "千人守孤城,守的从来不是城,是一个「信」字。",
            "quote": "昭受魏恩,城在人在。请丞相换法子吧。"
          }
        ],
        "wangshuang": [
          {
            "when": "seen:wangshuang",
            "bio": "他的流星锤记过你的将,也记过自己的轻进。",
            "quote": "这次跟紧大队!锤下不留情!"
          },
          {
            "bio": "陇西大汉,先登的奖赏他背了一路。",
            "quote": "王双在此!谁的头,配我的锤?"
          }
        ]
      },
      "map": [
        {
          "id": "siege-letters",
          "node": 1,
          "title": "散關 · 云梯与書信",
          "lines": [
            {
              "speaker": "haozhao",
              "text": "昭知丞相必得陈仓而後去。只可惜,陛下給的城,昭一寸也不讓。"
            },
            {
              "speaker": "zhuge",
              "text": "他不肯降,是信魏,還是信他身後無人肯守?攻具要继续,信,也要继续。"
            },
            {
              "speaker": "guanxing",
              "text": "丞相,兴押粮時数過:城中炊烟,一日淡過一日。"
            },
            {
              "speaker": "you",
              "text": "那就比誰先到——他的粮盡,還是長安的援軍。"
            }
          ],
          "choices": [
            {
              "id": "count-smoke",
              "text": "以炊烟计城中存粮",
              "detail": "本回看破提升,记住炊烟之数",
              "effects": {
                "keenEye": true,
                "fact": "chencang_smoke"
              }
            },
            {
              "id": "cut-relief",
              "text": "伏兵散关,截长安援军",
              "detail": "魏军起手军资 -200,记住断援",
              "effects": {
                "raid": true,
                "fact": "chencang_cut"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "chencang-open",
          "at": "start",
          "speaker": "haozhao",
          "text": "又是云梯。昭說過了——换法子吧,丞相。"
        },
        {
          "id": "chencang-fire",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "火箭如雨,云梯成排地烧。城頭那个瘦削的身影,二十日來没有离開過一步。"
        },
        {
          "id": "chencang-shuang",
          "at": "hand:3",
          "speaker": "wangshuang",
          "text": "郝昭撑住!王雙的援軍到了——呔!追兵也敢跟這么紧?!"
        },
        {
          "id": "chencang-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "罢。传令:敛兵,回漢中。陈仓虽在,郝伯道之名,亮记下了。"
        }
      ],
      "win": {
        "text": "退軍的路上,王雙追來,却一頭撞進你布在散關的伏兵。斬王雙,退大軍,陈仓的城頭,郝昭扶着垛口望了许久。他守住了城,诸葛亮赢得了整个陇右的从容——這一仗,兩人都没有输。",
        "hook": "陈仓虽退,北伐的心没有退。渭水上游,一場更大的对峙正在蓄水——這一次,对手是司馬。"
      },
      "loss": {
        "text": "攻城的第二十日,云梯烧盡了,長安的援軍也到了。你在陈仓城下学会了同一件事:有些城,强攻不動;有些将,劝降不動。",
        "clue": "史鉴 · 郝昭以「守」待「攻」,你的每一步攻具都在替他點名。重開時先断援軍、再数炊烟,等他的粮替你說話。",
        "clueFx": "keenEye"
      }
    },
    "shangfanggu": {
      "cast": [
        "zhuge",
        "simayi",
        "simazhao",
        "weiyan",
        "yangyi"
      ],
      "objective": "把司馬懿父子诱入葫芦谷,在雨落下之前,讓火替蜀軍說最後一句話。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "渭水南岸,蜀軍屯田,魏軍筑垒。上方谷口堆满干柴,只等司馬懿自己走進來。"
        },
        {
          "speaker": "simayi",
          "text": "孔明屯田,是邀孤决戰;孤偏不戰。他若退,孤追——只追到谷口為止。"
        },
        {
          "speaker": "simazhao",
          "text": "父亲,蜀軍粮车连日向北原移動,孩儿愿领一軍,探他虚實。"
        },
        {
          "speaker": "zhuge",
          "text": "司馬懿不是不肯來,是不肯一个人來。那就給他的儿子,一个非來不可的理由。"
        },
        {
          "speaker": "yangyi",
          "text": "丞相,木牛流馬三十车已備,每车都做了记号——威公保证,一车都不会真丢。"
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "page:kongcheng:yeshi",
            "bio": "西城的琴声之后,他更信「孔明之退皆有伏」,这份疑心,正是你要的锁。",
            "quote": "琴我听过一次。这次,我只信我的眼睛。"
          },
          {
            "when": "seen:simayi",
            "bio": "他仍旧闭目养神,可耳听八方——你在谷口做的每一处记号,他都想知道。",
            "quote": "把你的粮车再往前挪一里。孤,看着。"
          },
          {
            "bio": "冢虎不出洞,除非洞外的人,替他把洞口的石头搬开。",
            "quote": "孔明啊孔明,你的耐心,终究要输给岁数。"
          }
        ],
        "simazhao": [
          {
            "when": "seen:simazhao",
            "bio": "他领教过你的伏笔,这次把父亲的谨慎折了一半,添进自己的果决。",
            "quote": "父亲的谨慎我学一半。另一半,我改。"
          },
          {
            "bio": "随军的次子,眼睛却总盯着帅帐里那把还没坐热的椅子。",
            "quote": "小将军司马昭,代父巡谷。"
          }
        ]
      },
      "map": [
        {
          "id": "granary-carts",
          "node": 1,
          "title": "北原 · 粮车之饵",
          "lines": [
            {
              "speaker": "weiyan",
              "text": "丞相,诱敌的差事,该文長去了!司馬懿若肯入谷,文長愿领五百人,替他關谷門!"
            },
            {
              "speaker": "zhuge",
              "text": "文長守谷門,孤放心。只是记住——火起之後,門要關得快,開得更快。"
            },
            {
              "speaker": "yangyi",
              "text": "粮车、干柴、火油,账目在此。丞相,威公只提醒一句:天,三月無雨了。"
            },
            {
              "speaker": "you",
              "text": "無雨的天,是火的朋友,也是雨的前奏。這一局,要赢得比天氣快。"
            }
          ],
          "choices": [
            {
              "id": "watch-sky",
              "text": "先观云脚,择干燥日纵火",
              "detail": "本回看破提升,记住天时之择",
              "effects": {
                "keenEye": true,
                "fact": "shangfanggu_sky"
              }
            },
            {
              "id": "burn-carts",
              "text": "弃三十车粮,佯败入谷",
              "detail": "魏军起手军资 -200,记住弃粮之饵",
              "effects": {
                "raid": true,
                "fact": "shangfanggu_carts"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shangfanggu-open",
          "at": "start",
          "speaker": "simayi",
          "text": "粮车北移,营垒東倾。孔明,你的每一步,都在请孤入谷。"
        },
        {
          "id": "shangfanggu-zhao",
          "at": "hand:2",
          "speaker": "simazhao",
          "text": "父亲!粮车亂了,蜀軍真的败了——追不追,就在此刻!",
          "when": "multi"
        },
        {
          "id": "shangfanggu-fire",
          "at": "hand:3",
          "speaker": "weiyan",
          "text": "谷門——落!火箭,上!今日便叫魏軍知道,什么叫進得來,出不去!"
        },
        {
          "id": "shangfanggu-low",
          "at": "low",
          "speaker": "simayi",
          "text": "中計了……我父子三人,竟要毕命于此谷?罢了,罢了!"
        }
      ],
      "win": {
        "text": "火起時,谷口的牌局已经收官。司馬懿仰頭看天,乌云正从山後壓過來——可這次,雨落在火烧完之後。他从灰烬里被扶出來,半晌只說了一句:「天意犹在,人事先盡。」渭南的魏軍,从此再不出垒。",
        "hook": "上方谷的火没能烧盡司馬氏,却烧掉了他们的傲氣。渭滨的秋風,就要替這場对峙收尾。"
      },
      "loss": {
        "text": "雨比你的火快了半刻。谷中父子在雨里放声大笑,笑声比火更烫。你终于明白:算盡了人事的人,输給天時,最痛。",
        "clue": "史鉴 · 司馬懿入谷前会反复试探。重開時先观云再纵火,弃粮之饵能减其軍資 200——别讓天氣先亮牌。",
        "clueFx": "raid"
      }
    },
    "tielongshan": {
      "cast": [
        "jiangwei",
        "simazhao",
        "guohuai",
        "xiahouba",
        "zhangyi"
      ],
      "objective": "围住铁笼山的人,先要算赢解围的人——替姜维保住陇右這一手棋。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "姜维背水列陣,大破魏軍于洮水,把司馬昭围在了铁笼山上。山上無水,山下的人却帶來了羌兵的火。"
        },
        {
          "speaker": "jiangwei",
          "text": "司馬昭困守無水之山,三日内必降。维只担心一件事——郭淮的援軍,会借羌人的路。"
        },
        {
          "speaker": "simazhao",
          "text": "山上掘三丈不得泉……父亲常說,困局先算援手。郭伯济,你会來吗?"
        },
        {
          "speaker": "guohuai",
          "text": "羌人反复,魏蜀皆用。老夫此去,不必破姜维,只要讓羌人的火,烧回他自己的营。",
          "when": "!seen:guohuai"
        },
        {
          "speaker": "xiahouba",
          "text": "伯约!夏侯霸降蜀三年,今日方知:陇右的每一寸,都是旧相识。"
        }
      ],
      "intros": {
        "guohuai": [
          {
            "when": "seen:guohuai",
            "bio": "定军山的老对手还记得你的山,这次把援军藏进了羌帐。",
            "quote": "上次你占了高地。这次,我借了风。"
          },
          {
            "bio": "关西三十年,他最懂「借」字——借羌,借水,借你围城的耐心。",
            "quote": "郭淮不与你斗围。我只拆你的围。"
          }
        ],
        "simazhao": [
          {
            "when": "page:shangfanggu:yeshi",
            "bio": "上方谷的雨救过他一次,他从此信「困局自有天意」。",
            "quote": "又困我?上次的雨,这次也会来。"
          },
          {
            "when": "seen:simazhao",
            "bio": "他尝过被围的滋味,这次在山上镇定得反常。",
            "quote": "困我三日?我等得起。你呢?"
          },
          {
            "bio": "被围的次子不慌,因为他的镇定本身就是疑兵。",
            "quote": "姜将军,山高风大,你的粮,吹得散。"
          }
        ]
      },
      "map": [
        {
          "id": "qiang-road",
          "node": 1,
          "title": "洮水 · 羌人的路",
          "lines": [
            {
              "speaker": "xiahouba",
              "text": "伯约,羌人与魏人眉來眼去三日了。雍州的事,仲權看了半辈子——他们只認粮,不認旗。"
            },
            {
              "speaker": "jiangwei",
              "text": "维背水一戰,已無退路。若羌人倒向郭淮,山上山下,就要换一个围法。"
            },
            {
              "speaker": "zhangyi",
              "text": "将軍,張翼愿领一軍扼住羌道。翼位卑,可這一步棋,差不得。"
            },
            {
              "speaker": "you",
              "text": "围山的人最怕兩件事:山上的水,和山外的路。水他没找到,路,還在你手里。"
            }
          ],
          "choices": [
            {
              "id": "hold-qiang",
              "text": "先稳羌部,断郭淮之援",
              "detail": "本回看破提升,记住羌道之要",
              "effects": {
                "keenEye": true,
                "fact": "tielongshan_qiang"
              }
            },
            {
              "id": "rush-hill",
              "text": "趁无水速攻,先取山寨",
              "detail": "军资 +150,山上守军士气 -1",
              "effects": {
                "chips": 150,
                "sow": 1,
                "fact": "tielongshan_rush"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "tielongshan-open",
          "at": "start",
          "speaker": "simazhao",
          "text": "姜维,你围得住山,围不住天。三日後,自有你的败报。"
        },
        {
          "id": "tielongshan-guo",
          "at": "hand:2",
          "speaker": "guohuai",
          "text": "羌帳已應老夫。姜将軍,你的背後,還站得住人吗?"
        },
        {
          "id": "tielongshan-wing",
          "at": "hand:3",
          "speaker": "zhangyi",
          "text": "羌道還在我手里!将軍只管攻山——張翼的陣地,羌人過不來!",
          "when": "fact:tielongshan_qiang"
        },
        {
          "id": "tielongshan-low",
          "at": "low",
          "speaker": "jiangwei",
          "text": "丞相,维又差一步……不,還差的那一步,维自己走!"
        }
      ],
      "win": {
        "text": "羌道未失,郭淮的「借」字落了空。铁笼山上,司馬昭捧着最後一皮囊水解了渴,然後望着山下纹丝不動的蜀軍营垒,第一次主動议和退兵。姜维没有追——洮水大勝,陇右的城一座座開了門,北伐的路,又宽了一程。",
        "hook": "陇右烽烟未熄,淮南的檄文已至洛阳——魏國的土地上,连着三年,燃起了三把同名的火。"
      },
      "loss": {
        "text": "羌人的火从你背後烧起,铁笼山上的司馬昭在雨里大笑。姜维引兵退回劍阁時,回頭看了一眼那座山——围局如牌局,他终于信了這句話。",
        "clue": "史鉴 · 郭淮赢在「借外势」,不在兵锋。重開時先定羌部再攻山;你的围,输給的一定是山外的路。",
        "clueFx": "keenEye"
      }
    },
    "huainan": {
      "cast": [
        "simashi",
        "simazhao",
        "guanqiujian",
        "wenqin",
        "zhugedan",
        "wenyang"
      ],
      "objective": "在淮南三叛的连局里,读出忠義与侥幸的分界,替檄文找到它该送达的人。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "司馬懿死後第二年,淮南第一道讨贼檄文竖起。此後四年,同样的火在這片土地上烧了三次。"
        },
        {
          "speaker": "guanqiujian",
          "text": "司馬师废帝自立,天地不容!淮南六軍,今日只問一句:魏,還是司馬?"
        },
        {
          "speaker": "simashi",
          "text": "淮南又反。父亲留下的局面,师來收。眼疾再痛,也得亲征。"
        },
        {
          "speaker": "wenqin",
          "text": "毌丘将軍,文钦父子三千骑,愿為先锋!冲中軍,擒司馬师!"
        },
        {
          "speaker": "wenyang",
          "text": "爹,夜里劫营,儿的枪先出。樂嘉城的魏旗,一夜就换!"
        }
      ],
      "intros": {
        "guanqiujian": [
          {
            "when": "seen:guanqiujian",
            "bio": "辽东刻石的老将仍在等,等第二封没人敢回的檄文。",
            "quote": "石头再硬,也要刻第二遍。"
          },
          {
            "bio": "他刻过辽东的功勋,如今要刻司马氏的罪。",
            "quote": "此檄一出,成败在天,名义在我。"
          }
        ],
        "wenqin": [
          {
            "bio": "勇而无谋的谯郡男儿,嗓门与胆气一样大。",
            "quote": "怕死的不姓文!冲!"
          }
        ],
        "zhugedan": [
          {
            "when": "seen:zhugedan",
            "bio": "寿春的火他见过一次,这次把城墙又加高了三尺。",
            "quote": "再守一次。反正天下人只记得我反了。"
          },
          {
            "bio": "诸葛家的「狗」,咬得最凶,也最孤独。",
            "quote": "宁作断头鬼,不姓司马!"
          }
        ],
        "wenyang": [
          {
            "bio": "十八岁的枪,追兵的梦。",
            "quote": "谁敢追?文鸯在此!"
          }
        ],
        "leshen": [
          {
            "bio": "他守着父亲留下的淮南,守着乐进家的门楣。",
            "quote": "家父的阵,我一步没改。"
          }
        ]
      },
      "map": [
        {
          "id": "three-fires",
          "node": 1,
          "title": "项城 · 同名的火",
          "lines": [
            {
              "speaker": "simazhao",
              "text": "兄長眼里有瘤,仍要亲征淮南。我留在洛阳——不是怯,是要看着朝堂上每一雙眼睛。"
            },
            {
              "speaker": "guanqiujian",
              "text": "第一叛败于粮,第二叛败于疑,第三叛……老夫等不到了。後來的人,替我把檄文写完。"
            },
            {
              "speaker": "wenyang",
              "text": "寿春城破那日,儿单骑七進七出。爹叫我走,我就走——留這條命,接着反!"
            },
            {
              "speaker": "you",
              "text": "三把火,烧的是同一句話。你要读的是:哪一缕烟,是忠;哪一缕,只是不甘。"
            }
          ],
          "choices": [
            {
              "id": "read-manifesto",
              "text": "细读檄文署名与粮册",
              "detail": "本回看破提升,记住檄文之别",
              "effects": {
                "keenEye": true,
                "fact": "huainan_read"
              }
            },
            {
              "id": "aid-shouchun",
              "text": "护檄文东传,连结东吴",
              "detail": "军资 +150,记住外援之约",
              "effects": {
                "chips": 150,
                "fact": "huainan_wu"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "huainan-open",
          "at": "start",
          "speaker": "guanqiujian",
          "text": "魏的将,司馬的兵——诸位,你们的刀,究竟聽誰的?!"
        },
        {
          "id": "huainan-yang",
          "at": "hand:2",
          "speaker": "wenyang",
          "text": "追兵百骑?文鸯回頭——一枪一个,排好队!",
          "when": "round:2"
        },
        {
          "id": "huainan-dan",
          "at": "hand:3",
          "speaker": "zhugedan",
          "text": "寿春的粮,够守一年。你们司馬家的刀,先钝!先冷!",
          "when": "round:2"
        },
        {
          "id": "huainan-low",
          "at": "low",
          "speaker": "simazhao",
          "text": "杀他们的,不是我。是「等」字——等援軍,等天命,等别人先拼命。"
        }
      ],
      "win": {
        "text": "檄文送到了洛阳,也送進了史官的梦里。三把火没有烧倒司馬氏,却把「魏」字的笔画一根根烫深:连他们的兵都開始记住,自己曾经姓曹。司馬师摘掉眼上的纱布,發现痛的不只是眼疾。",
        "hook": "淮南的火三次燃盡,洛阳的天子坐不住了——他要亲手,把龍旗打出宫門。"
      },
      "loss": {
        "text": "三叛相继败亡,寿春城頭三次换旗。你记住了每一份檄文的抬頭,却没算到:東吴的援兵,每次都晚到一步,而司馬氏的刀,一次比一次快。",
        "clue": "史鉴 · 淮南之败不在寡助,在「各等各的」。重開時先读檄文分清主从;文鸯之勇是最後的門,别把他当成整座城。",
        "clueFx": "keenEye"
      }
    },
    "ganlu": {
      "cast": [
        "caomao",
        "simazhao",
        "jiachong",
        "wangshen"
      ],
      "objective": "在南阙之前替天子留住最後一步退路——或者,一場問心無愧的死戰。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "甘露五年,洛阳。二十岁的天子在陵云台写了最後一首诗,题目叫《潜龍》。诗成,他把笔一折。"
        },
        {
          "speaker": "caomao",
          "text": "司馬昭之心,路人皆知!朕不能坐受废辱——今日,卿等随朕,亲讨此贼!"
        },
        {
          "speaker": "jiachong",
          "text": "殿下勿慌。天子亲自持劍,不過是个孩子的把戏。养兵千日——用在此刻。",
          "when": "!seen:jiachong"
        },
        {
          "speaker": "wangshen",
          "text": "陛下……沈,沈萬死。可這件事,沈只能,只能先走一步了。"
        },
        {
          "speaker": "caomao",
          "text": "朕意已决。纵使今日血溅宫墙,史笔之上,「魏」字仍在!"
        }
      ],
      "intros": {
        "jiachong": [
          {
            "when": "seen:jiachong",
            "bio": "他记得上次那杆停在半空的戟,这次连「停」的口令都不下了。",
            "quote": "这次,不留手。变数,先除。"
          },
          {
            "bio": "他从不亲手拿刀,只负责把刀递到最合适的手里。",
            "quote": "贾充在此。陛下,别让下人为难。"
          }
        ],
        "simazhao": [
          {
            "when": "page:tielongshan:yeshi",
            "bio": "铁笼山的困局让他学会了谦卑的外壳,如今壳更厚,刀更近。",
            "quote": "困过我的人,都得死。天子,也不例外?"
          },
          {
            "when": "seen:simazhao",
            "bio": "他与你交手多次,这次背靠的是整个司马氏的门楣。",
            "quote": "又来。你的「改写」,朕…我,倒要看看能改到哪一页。"
          },
          {
            "bio": "离皇位一步的人,最恨别人提醒他「名不正」。",
            "quote": "天子亲征?好大的阵仗。可惜,兵符在我。"
          }
        ],
        "wangshen": [
          {
            "when": "seen:wangshen",
            "bio": "他的笔上次没能等到天亮,这次蘸墨蘸得更早。",
            "quote": "沈的奏表,已誊了两份。给晋公的那份,先行一步。"
          },
          {
            "bio": "史学世家的笔,在名节与门第之间,落了个干净利落。",
            "quote": "王沈,有一表上奏。"
          }
        ]
      },
      "map": [
        {
          "id": "dragon-poem",
          "node": 1,
          "title": "太極殿 · 潜龍之诗",
          "lines": [
            {
              "speaker": "caomao",
              "text": "「伤哉龍受困,不能越深渊。」……写得再好,也不過是替自己哭丧。"
            },
            {
              "speaker": "you",
              "text": "陛下,诗可以留,路不能只剩一條。宫墙之外,還有人肯聽天子的吗?"
            },
            {
              "speaker": "caomao",
              "text": "有没有,朕都要走這一遭。史官,帶上你的笔——今日每一笔,都直書!"
            },
            {
              "speaker": "jiachong",
              "text": "南阙的甲士,只聽成济的。而成济——只聽我的。"
            }
          ],
          "choices": [
            {
              "id": "rally-old-guard",
              "text": "先聚三千宿卫旧臣",
              "detail": "军资 +150,记住旧臣之心",
              "effects": {
                "chips": 150,
                "fact": "ganlu_rally"
              }
            },
            {
              "id": "read-halberd",
              "text": "盯住成济握戟的手",
              "detail": "本回看破提升,记住那杆戟",
              "effects": {
                "keenEye": true,
                "fact": "ganlu_halberd"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "ganlu-open",
          "at": "start",
          "speaker": "caomao",
          "text": "朕乃天子!誰敢弑君——誰敢?!"
        },
        {
          "id": "ganlu-chee",
          "at": "hand:2",
          "speaker": "jiachong",
          "text": "司馬公养你们,不就是為了今日吗?!動手——",
          "when": "multi"
        },
        {
          "id": "ganlu-halberd",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "成济的戟抬起來了。满街的甲士都在看着——看天子,也看這杆戟,究竟聽誰的。",
          "when": "fact:ganlu_halberd"
        },
        {
          "id": "ganlu-low",
          "at": "low",
          "speaker": "caomao",
          "text": "戟若落,史笔在;朕若死,「魏」字在。來啊——朕在此!"
        }
      ],
      "win": {
        "text": "南阙之下,成济的戟最终没有落下——你当街唤出了他父亲的名字,喊破了那道只認「主公」的軍令。甲士哗然退散,賈充的袖子第一次空了。天子持劍立于宫門,史官蘸墨:「甘露五年,帝亲讨贼,贼党溃。」魏,還剩一口氣;這口氣,姓曹。",
        "hook": "天子的血没有流,司馬氏的耐心却到了頭。魏蜀吴三家最後的名字,都将写進同一部史書。"
      },
      "loss": {
        "text": "戟落了。天子的血溅在南阙的砖上,三日不褪。司馬昭闻讯「大惊」,诛了成济三族——把刀和罪,一起收回了鞘。",
        "clue": "史鉴 · 賈充赢在「先断你的耳目」。重開時盯住那杆戟、聚拢旧臣;勝負之外,這一頁赌的是史笔的下一行。",
        "clueFx": "keenEye"
      }
    },
    "jiange": {
      "cast": [
        "jiangwei",
        "zhonghui",
        "liaohua",
        "zhangyi"
      ],
      "objective": "在劍阁天险挡住钟会的大軍,也要替蜀漢挡住「侧面」兩个字。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "十八萬魏軍壓向劍阁,姜维凭险拒守。钟会的檄書写得漂亮,可惜劍門關只認得箭。"
        },
        {
          "speaker": "zhonghui",
          "text": "姜伯约,孤城之守,守的是忠,還是不甘?献關者,会保你封侯。"
        },
        {
          "speaker": "jiangwei",
          "text": "钟士季的檄文,比你的云梯好看。劍阁的路,却只有一條——你的兵,铺不開。"
        },
        {
          "speaker": "liaohua",
          "text": "老夫从麦城一路退到劍阁,退了四十年。這一關,元俭不退了!"
        },
        {
          "speaker": "zhangyi",
          "text": "将軍,張翼再進一言:阴平小道,不可不防。艾若偷渡,劍阁再险也是空門!"
        }
      ],
      "intros": {
        "zhonghui": [
          {
            "when": "seen:zhonghui",
            "bio": "他记过关前的每一面旗,这次把劝降书又多写了三页。",
            "quote": "这次,孤连你劝降的退路都想好了。"
          },
          {
            "bio": "颍川的贵公子,笔比剑快,野心比两者都快。",
            "quote": "取蜀如摘冠。诸位,竞相摘之。"
          }
        ]
      },
      "map": [
        {
          "id": "pass-and-flank",
          "node": 1,
          "title": "劍阁 · 關与侧翼",
          "lines": [
            {
              "speaker": "zhangyi",
              "text": "将軍,正面交給我。可翼把丑話說完:邓艾在沓中,他若不走大道——"
            },
            {
              "speaker": "jiangwei",
              "text": "伯恭放心。维在阴平留了哨,在江油留了眼。劍阁守的不是門,是整面墙。"
            },
            {
              "speaker": "liaohua",
              "text": "墙再厚,也得有人肯站上來。老夫這把骨頭,先靠上去了。"
            },
            {
              "speaker": "you",
              "text": "钟会要的只是你回頭。你一回頭,正面就薄了——讓他喊,别讓他牵動。"
            }
          ],
          "choices": [
            {
              "id": "hold-wall",
              "text": "死守正面,不受檄文牵动",
              "detail": "本回看破提升,记住墙式守御",
              "effects": {
                "keenEye": true,
                "fact": "jiange_wall"
              }
            },
            {
              "id": "flank-beacons",
              "text": "分兵三哨,盯死阴平道",
              "detail": "钟会起手军资 -200,记住侧翼之眼",
              "effects": {
                "raid": true,
                "fact": "jiange_beacons"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jiange-open",
          "at": "start",
          "speaker": "zhonghui",
          "text": "姜维!劍阁虽险,你的粮,比我的笔先竭!"
        },
        {
          "id": "jiange-lao",
          "at": "hand:2",
          "speaker": "liaohua",
          "text": "老夫守的這段墙,四十年了没讓人過去!小辈,再加把劲!"
        },
        {
          "id": "jiange-flank",
          "at": "hand:3",
          "speaker": "zhangyi",
          "text": "阴平三哨,灯都亮着!将軍,正面放心——墙,是整面!",
          "when": "fact:jiange_beacons"
        },
        {
          "id": "jiange-low",
          "at": "low",
          "speaker": "jiangwei",
          "text": "钟士季,你的檄文写得再好,也翻不過這道山。回去告诉司馬昭:蜀,還有人在。"
        }
      ],
      "win": {
        "text": "钟会围關二十余日,粮草先盡,檄文写盡了最後的修辞。拔营西退那日,他回望劍門,把姜维的名字写進了自己的笔记:「取蜀不難,難在此人。」而劍阁的墙上,老将廖化靠着長刀睡着了——四十年,他第一次在關前睡着。",
        "hook": "劍阁守住了正面,可摩天岭的雪線上,還有一支裹毡而下的孤軍——那是下一頁的風。"
      },
      "loss": {
        "text": "钟会的佯攻牵走了你的哨兵,劍門的正面在一夜之间薄成了一层紙。關破時姜维没有回望,只朝阴平的方向一抱拳:「伯恭,是维負了你。」",
        "clue": "史鉴 · 钟会以「势」壓「险」,劝降与强攻轮番上。重開時先定墙後设哨;他的檄文,是他最便宜的一种云梯。",
        "clueFx": "keenEye"
      }
    },
    "yanglu": {
      "cast": [
        "lukang",
        "yanghu"
      ],
      "objective": "与羊祜对境兩年,赢下「不戰之戰」,替吴國留住最後的将,也留住最後的信。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "荆州邊境,兩軍对垒,却兩年無戰。吴人打猎,猎物逃入晋境,羊祜必遣人送還;陆抗病了,羊祜送药,陆抗当众服下。"
        },
        {
          "speaker": "yanghu",
          "text": "陆将軍,祜不欺丧亂之人,亦不欺有病之将。药在此,信亦在此。"
        },
        {
          "speaker": "lukang",
          "text": "羊公赠药,抗岂疑之?倒是抗有一問:将軍以信猎城,猎的究竟是吴地,還是吴心?"
        },
        {
          "speaker": "lukang",
          "text": "建业來的诏書,比襄阳的兵更急。他们要抗出戰,抗,偏要再守一年。"
        },
        {
          "speaker": "narrator",
          "text": "西陵城下,步阐举城降晋。陆抗的围城,围的已是自家的叛城。"
        }
      ],
      "intros": {
        "yanghu": [
          {
            "when": "seen:yanghu",
            "bio": "他把你的阵图读了两遍,仍只把围猎的网收紧一寸。",
            "quote": "急什么?祜的网,一年只收一寸。"
          },
          {
            "bio": "轻裘缓带的名将,以信为饵,以德为钩。",
            "quote": "祜不与你斗刀兵。祜,只等人心自己过江。"
          }
        ]
      },
      "map": [
        {
          "id": "border-trust",
          "node": 1,
          "title": "襄阳 · 各安其境",
          "lines": [
            {
              "speaker": "yanghu",
              "text": "祜每次会戰,只与你约期而陣,不掩不袭。有人骂祜迂——他们不懂,這才是最快的刀。"
            },
            {
              "speaker": "lukang",
              "text": "羊公以信待我,抗以信還之。可西陵一叛,兩境的信,就要经受火了。"
            },
            {
              "speaker": "you",
              "text": "他赢的方式是「不戰」。你若急着開戰,便替他把人心送過江去。"
            }
          ],
          "choices": [
            {
              "id": "siege-xiling",
              "text": "先克西陵,再论边境",
              "detail": "晋军起手军资 -200,记住先定内",
              "effects": {
                "raid": true,
                "fact": "yanglu_xiling"
              }
            },
            {
              "id": "keep-compact",
              "text": "守与羊公之约,不开边衅",
              "detail": "本回看破提升,记住两年之信",
              "effects": {
                "keenEye": true,
                "fact": "yanglu_pact"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yanglu-open",
          "at": "start",
          "speaker": "yanghu",
          "text": "陆将軍,今日又免一戰。祜備了新茶——江陵的,你尝得出來。"
        },
        {
          "id": "yanglu-city",
          "at": "hand:2",
          "speaker": "lukang",
          "text": "西陵城破了。步阐的人頭,抗亲自送還建业。晋公的算盘,少了一颗關键的子。",
          "when": "fact:yanglu_xiling"
        },
        {
          "id": "yanglu-tea",
          "at": "hand:3",
          "speaker": "yanghu",
          "text": "茶要趁热,城要等熟。将軍,祜等得起——你等得起建业吗?",
          "when": "fact:yanglu_pact"
        },
        {
          "id": "yanglu-low",
          "at": "low",
          "speaker": "lukang",
          "text": "抗常勝于外,而困于内。羊公……你围的从來不是我,是我的朝廷,对吗?"
        }
      ],
      "win": {
        "text": "西陵既定,邊信未破。羊祜临终前上表请伐吴,把一生的准備与一怀的药味一并交給了杜预;陆抗也在同一年病逝,吴人立碑,碑上無「败」字。兩块碑隔江相望——你赢了這一頁:兩个名字,誰也没有输給誰。",
        "hook": "羊陆之後,再無名将可守。益州的楼船已下水,建业的铁锁,正在一寸寸生锈。"
      },
      "loss": {
        "text": "建业催戰的诏書终于壓過了邊境的信。你出兵的那一日,江邊百姓指着晋营說:「羊公之德,不掠我禾。」仗還没打,城外的人心已先過江。",
        "clue": "史鉴 · 羊祜的刀是「信」,急攻正中其怀。重開時先定西陵、再守其约;他输得起時间,你输不起人心。",
        "clueFx": "keenEye"
      }
    }
  }
};
