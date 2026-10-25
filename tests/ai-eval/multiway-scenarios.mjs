import { createHand, beginRound, applyAction, actionView, settleHand, closeRound, nextButton, liveSeats } from '../../src/table.js';
import * as PK from '../../src/poker.js';

const seat = (id, stack, committed = 0) => ({ id, stack, committed, bet: 0, folded: false });
const result = (pass, actual) => ({ pass, actual });

export const multiwayScenarios = [
  {
    id: 'multiway_side_pots_and_uncalled_refund', group: '多人规则',
    desc: '三种全压额度形成主池/边池,最高未跟注额只退一次且筹码守恒',
    run() {
      const seats = [seat('A', 0, 100), seat('B', 0, 200), seat('C', 0, 300)];
      const H = { seats, button: 0 };
      const settled = settleHand(H, { A: [8], B: [7], C: [6] });
      const pass = settled.awards.A === 300 && settled.awards.B === 200 && settled.awards.C === 100
        && settled.after === 600 && settled.pots.filter(p => p.refund).length === 1;
      return result(pass, JSON.stringify(settled.awards) + ` / 总筹码 ${settled.after}`);
    },
  },
  {
    id: 'multiway_folded_contribution_stays_dead', group: '多人规则',
    desc: '弃牌者贡献留在池中但不能赢池',
    run() {
      const seats = [seat('A', 0, 50), seat('B', 0, 100), seat('C', 0, 100)];
      seats[0].folded = true;
      const settled = settleHand({ seats, button: 0 }, { B: [5], C: [4] });
      const pass = settled.awards.A === 0 && settled.awards.B === 250 && settled.awards.C === 0 && settled.after === 250;
      return result(pass, JSON.stringify(settled.awards));
    },
  },
  {
    id: 'multiway_fold_does_not_end_remaining_action', group: '多人规则',
    desc: '三人局一人弃牌后剩余两人继续行动,不会提前收池',
    run() {
      const seats = [seat('A', 1000), seat('B', 1000), seat('C', 1000)];
      const H = createHand(seats, { button: 0, blinds: [10, 20] });
      applyAction(H, 'A', { type: 'call' });
      applyAction(H, 'B', { type: 'call' });
      applyAction(H, 'C', { type: 'check' });
      closeRound(H);
      beginRound(H, 1);
      const first = H.actor;
      applyAction(H, first, { type: 'raise', amount: 50 });
      const folder = H.actor;
      applyAction(H, folder, { type: 'fold' });
      const continued = !H.roundComplete && H.actor;
      applyAction(H, H.actor, { type: 'call' });
      return result(first === 'B' && folder === 'C' && continued === 'A' && H.roundComplete && H.seats.find(s => s.id === 'C').folded,
        `首位 ${first} / 弃牌 ${folder} / 继续 ${continued}`);
    },
  },
  {
    id: 'multiway_allin_others_keep_betting', group: '多人规则',
    desc: '一名玩家全压后,其他两家仍能再加注并形成边池',
    run() {
      const seats = [seat('A', 50), seat('B', 200), seat('C', 500)];
      const H = createHand(seats, { button: 0, blinds: [10, 20] });
      applyAction(H, 'A', { type: 'allin' });
      const afterAllin = H.actor === 'B' && !H.roundComplete;
      applyAction(H, 'B', { type: 'raise', amount: 100 });
      applyAction(H, 'C', { type: 'call' });
      const settled = settleHand(H, { A: [6], B: [5], C: [4] });
      const pass = afterAllin && H.roundComplete && settled.awards.A === 150 && settled.awards.B === 120 && settled.after === 750;
      return result(pass, `全压后继续=${afterAllin} / ${JSON.stringify(settled.awards)}`);
    },
  },
  {
    id: 'multiway_tie_odd_chips_and_button_rotation', group: '多人规则',
    desc: '多人平分零头按座位顺序分配,淘汰后庄位继续轮换',
    run() {
      const seats = [seat('A', 0, 101), seat('B', 0, 101), seat('C', 0, 101)];
      seats[2].folded = true;
      const settled = settleHand({ seats, button: 0 }, { A: [4], B: [4] });
      const oddTotal = settled.awards.A + settled.awards.B;
      const next = nextButton(seats.map((s, i) => ({ ...s, stack: i === 1 ? 0 : 100 })), 0);
      const pass = oddTotal === 303 && settled.awards.C === 0 && settled.after === 303 && next === 2;
      return result(pass, `${JSON.stringify(settled.awards)} / 下一庄 ${next}`);
    },
  },
  {
    id: 'multiway_blind_allin_allin_button_becomes_call', group: '多人规则',
    desc: '对手盲注全压后,全压按钮只能跟注,不能多加也无响应者的注',
    run() {
      const seats = [seat('A', 1000), seat('B', 20)];
      const H = createHand(seats, { button: 0, blinds: [10, 20] });
      const before = actionView(H, 'A');
      const applied = applyAction(H, 'A', { type: 'allin' });
      const pass = !before.canRaise && before.raisesLeft === 0 && applied.type === 'call'
        && H.seats[0].committed === 20 && H.seats[0].stack === 980 && H.roundComplete;
      return result(pass, `动作 ${applied.type} / 玩家贡献 ${H.seats[0].committed} / 余额 ${H.seats[0].stack}`);
    },
  },
  {
    id: 'multiway_random_histories_chip_conservation', group: '多人规则',
    desc: '多种子随机三人牌局:混合弃牌/加注/全压/摊牌,逐手筹码守恒',
    run() {
      let checked = 0;
      for (let seed = 1; seed <= 80; seed++) {
        const rng = PK.mulberry32(seed * 7919);
        const seats = [seat('A', 300), seat('B', 300), seat('C', 300)];
        const deck = PK.shuffle(PK.makeDeck(), rng);
        const H = createHand(seats, { button: seed % 3, blinds: [10, 20] });
        H.board = [];
        for (const [index, player] of H.seats.entries()) player.hole = [deck[index * 2], deck[index * 2 + 1]];
        let ptr = 6;
        for (let street = 0; street < 4 && liveSeats(H.seats).length > 1; street++) {
          if (street > 0) {
            ptr += 1;
            H.board.push(...(street === 1 ? deck.slice(ptr, ptr + 3) : [deck[ptr]]));
            ptr += street === 1 ? 3 : 1;
          }
          beginRound(H, street);
          let guard = 0;
          while (!H.roundComplete) {
            if (++guard > 100) throw new Error('行动轮未收敛');
            const id = H.actor;
            const view = actionView(H, id);
            let decision;
            const roll = rng();
            if (view.toCall > 0 && roll < 0.16) decision = { type: 'fold' };
            else if (view.canRaise && roll > 0.78) decision = { type: roll > 0.94 ? 'allin' : 'raise', amount: view.toCall + view.minRaise };
            else if (view.toCall > 0) decision = { type: 'call' };
            else decision = { type: 'check' };
            applyAction(H, id, decision);
          }
          closeRound(H);
        }
        const live = H.seats.filter(player => !player.folded);
        const scores = {};
        if (live.length > 1) for (const player of live) scores[player.id] = PK.evaluate7([...player.hole, ...H.board]).score;
        const settled = settleHand(H, scores);
        if (settled.after !== 900) return result(false, `种子 ${seed}: ${settled.after}`);
        checked++;
      }
      return result(true, `${checked} 手随机三人牌局均守恒`);
    },
  },
];
