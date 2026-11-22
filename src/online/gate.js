// gate.js —— 目录屏「联机对战」入口卡:与「沙场点兵」同款样式,随机四将立绘。
// 入口原先在目录页眉的小按钮(#onlineBtn),手机端还被语言栏遮挡——并入正文列表后统一观感。
import { GENERALS } from '../generals.js';
import { portraitImage } from '../portrait.js';

export function renderOnlineGate(mount, onEnter) {
  const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
  const en = currentLang === 'en', ja = currentLang === 'ja', tw = currentLang === 'zh-TW';
  const seal = en ? 'VS' : tw || ja ? '聯' : '联';
  const head = en ? 'Online · War of Heroes' : ja ? '天下 · オンライン対戦' : tw ? '天下 · 聯機對戰' : '天下 · 联机对战';
  const title = en ? 'Join by Code · Sit with the Realm' : ja ? '合言葉で入局 · 天下と同卓' : tw ? '憑碼入局 · 與天下同席' : '凭码入局 · 与天下同席';
  const sub = en ? '2–6 seats · Advisor covers disconnects · No chronicle impact'
    : ja ? '二〜六人卓 · 回線切れは軍師代打 · 正巻を動かさず'
    : tw ? '二至六人桌 · 斷線軍師代打 · 不動正卷'
    : '二至六人桌 · 断线军师代打 · 不动正卷';
  const go = en ? 'JOIN' : ja ? '入 局' : tw ? '入 局' : '入 局';
  const goSub = en ? 'Lobby' : ja ? '網戦' : tw ? '網戰大廳' : '网战大厅';

  // 随机四将:每次展开目录都换一批面孔,呼应「天下英雄,同席为注」
  const picks = Object.keys(GENERALS).sort(() => Math.random() - 0.5).slice(0, 4);

  const gate = document.createElement('div');
  gate.className = 'practiceGate onlineGate';
  gate.innerHTML = `
    <h3 class="practiceGate-head"><span class="title-seal">${seal}</span>${head}</h3>
    <button type="button" class="practiceGate-btn" data-online-gate>
      <span class="pg-art">${picks.map(s => portraitImage(s)).join('')}</span>
      <span class="pg-main">
        <b>${title}</b>
        <small>${sub}</small>
      </span>
      <span class="pg-go">${go}<small>${goSub}</small></span>
    </button>`;
  gate.querySelector('[data-online-gate]').addEventListener('click', onEnter);
  mount.appendChild(gate);
}
