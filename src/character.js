// character.js —— 牌桌武将席位:头像、军资、情绪、台词与详情归属于同一座位。
// 当前一对一只使用主席位;setPlayers 可为多人局复用同一组件,无需改动牌桌布局。
import { portraitImage } from './portrait.js';
export { PORTRAITS as SKINS } from './portrait.js';

export const POSE = { NEUTRAL: '', STRONG: 'pose-strong', BLUFF: 'pose-bluff', THINKING: 'pose-thinking' };

const POSE_TEXT = {
  [POSE.NEUTRAL]: '静观牌局',
  [POSE.STRONG]: '按牌逼视',
  [POSE.BLUFF]: '敛锋藏拙',
  [POSE.THINKING]: '思量中',
};

export function renderSeatRoles(mount, roles = []) {
  mount.replaceChildren();
  mount.classList.toggle('hidden', !roles.length);
  mount.setAttribute('aria-label', roles.length ? roles.map(role => role.label).join(' · ') : '无席位角色');
  for (const role of roles) {
    const chip = document.createElement('span');
    chip.className = 'seat-role';
    chip.dataset.role = role.kind;
    chip.textContent = role.label;
    mount.appendChild(chip);
  }
}

export function createOpponent(mount) {
  const seats = new Map();
  let primaryId = 'opponent';

  function centerSeat(seat, behavior = 'smooth') {
    if (!seat || seats.size < 2) return;
    const left = seat.el.offsetLeft - (mount.clientWidth - seat.el.offsetWidth) / 2;
    mount.scrollTo({ left: Math.max(0, left), behavior });
  }

  const resizeObserver = new ResizeObserver(() => {
    const active = [...seats.values()].find(seat => seat.card.classList.contains('is-active'));
    if (active) requestAnimationFrame(() => centerSeat(active, 'auto'));
  });
  resizeObserver.observe(mount);

  function makeSeat(player, index) {
    const id = String(player.id ?? `opponent-${index}`);
    const el = document.createElement('div');
    el.className = 'opponent-seat';
    el.dataset.seatId = id;
    el.innerHTML = `
      <section class="seat-card"${index === 0 ? ' id="oppPlate"' : ''}>
        <div class="seat-art">
          ${portraitImage(player.skin || 'default', 'seat-portrait-img')}
          <span class="seat-rank">敌</span>
          <span class="seat-turn">行动</span>
          <span class="seat-showdown" hidden></span>
        </div>
        <span class="seat-roles hidden" aria-label="席位角色"></span>
        <span class="seat-fold-status" hidden>已弃牌</span>
        <div class="seat-body">
          <div class="seat-heading">
            <span class="seat-name"${index === 0 ? ' id="oppName"' : ''}></span>
            <span class="seat-stack"><small>军资</small><strong${index === 0 ? ' id="oppStack"' : ''}>0</strong></span>
          </div>
          <div class="seat-status">
            <span class="seat-pose">静观牌局</span>
            <span class="seat-tilt"${index === 0 ? ' id="tiltDots"' : ''} title="情绪" aria-label="情绪"><i></i><i></i><i></i></span>
          </div>
        </div>
        <button class="seat-profile" type="button" title="武将详情" aria-label="查看武将详情">谱</button>
        <span class="seat-record" hidden></span>
      </section>
      <div class="seat-bubble hidden"${index === 0 ? ' id="bubble"' : ''} aria-live="polite"></div>`;
    const seat = {
      el,
      card: el.querySelector('.seat-card'),
      bubble: el.querySelector('.seat-bubble'),
      profile: el.querySelector('.seat-profile'),
      data: { ...player },
      timer: null,
    };
    seat.profile.addEventListener('click', () => {
      mount.dispatchEvent(new CustomEvent('seatinspect', { detail: { ...seat.data } }));
    });
    seat.card.addEventListener('click', event => {
      if (event.target.closest('.seat-profile')) return;
      mount.dispatchEvent(new CustomEvent('seatselect', { detail: { id } }));
    });
    seats.set(id, seat);
    mount.appendChild(el);
    updateSeat(id, player);
    return seat;
  }

  function updateSeat(id, player) {
    const seat = seats.get(id);
    if (!seat) return;
    Object.assign(seat.data, player);
    if (player.name !== undefined) seat.el.querySelector('.seat-name').textContent = player.name;
    if (player.stack !== undefined) seat.el.querySelector('.seat-stack strong').textContent = player.stack;
    if (player.tilt !== undefined) {
      [...seat.el.querySelectorAll('.seat-tilt i')].forEach((dot, i) => dot.classList.toggle('on', i < player.tilt));
    }
    if (player.boss !== undefined) {
      seat.card.classList.toggle('boss', !!player.boss);
      seat.el.querySelector('.seat-rank').textContent = player.boss ? '关' : '敌';
    }
    if (player.eliminated !== undefined) {
      seat.el.classList.toggle('is-eliminated', !!player.eliminated);
      seat.el.querySelector('.seat-rank').textContent = player.eliminated ? '出' : (seat.card.classList.contains('boss') ? '关' : '敌');
    }
    if (player.folded !== undefined) {
      seat.card.classList.toggle('is-folded', !!player.folded);
      seat.card.querySelector('.seat-fold-status').hidden = !player.folded;
    }
    if (player.selected !== undefined) seat.card.classList.toggle('is-selected', !!player.selected);
  }

  function setPlayers(players = []) {
    for (const seat of seats.values()) clearTimeout(seat.timer);
    seats.clear();
    mount.replaceChildren();
    const list = players.length ? players : [{ id: 'opponent' }];
    primaryId = String(list[0].id ?? 'opponent');
    mount.dataset.seatCount = String(list.length);
    mount.classList.toggle('is-multi', list.length > 1);
    list.forEach((player, i) => makeSeat(player, i));
  }

  function getSeat(id = primaryId) {
    if (!seats.size) setPlayers();
    return seats.get(id);
  }

  function setSkin(key = 'default', id = primaryId) {
    const seat = getSeat(id);
    seat.el.querySelector('.seat-art').innerHTML = `
      ${portraitImage(key, 'seat-portrait-img')}
      <span class="seat-rank">${seat.card.classList.contains('boss') ? '关' : '敌'}</span>
      <span class="seat-turn">行动</span>`;
    seat.card.dataset.skin = key;
    seat.data.skin = key;
  }

  function setPose(poseClass = POSE.NEUTRAL, id = primaryId) {
    const seat = getSeat(id);
    seat.card.classList.remove(POSE.STRONG, POSE.BLUFF, POSE.THINKING);
    if (poseClass) seat.card.classList.add(poseClass);
    seat.card.dataset.pose = poseClass || 'neutral';
    seat.el.querySelector('.seat-pose').textContent = POSE_TEXT[poseClass] || POSE_TEXT[POSE.NEUTRAL];
  }

  return {
    setPlayers,
    setSkin,
    setPose,
    setName(name, id = primaryId) { updateSeat(getSeat(id).el.dataset.seatId, { name }); },
    setStack(stack, id = primaryId) { updateSeat(getSeat(id).el.dataset.seatId, { stack }); },
    setProfile(profile, id = primaryId) { updateSeat(getSeat(id).el.dataset.seatId, profile); },
    setTilt(tilt, id = primaryId) { updateSeat(getSeat(id).el.dataset.seatId, { tilt }); },
    setBoss(boss, id = primaryId) { updateSeat(getSeat(id).el.dataset.seatId, { boss }); },
    setTilted(on, id = primaryId) { getSeat(id).card.classList.toggle('tilted', !!on); },
    setEliminated(on, id = primaryId) { updateSeat(id, { eliminated: !!on }); },
    setFolded(on, id = primaryId) { updateSeat(id, { folded: !!on }); },
    setRoles(roles, id = primaryId) { renderSeatRoles(getSeat(id).card.querySelector('.seat-roles'), roles); },
    setSelected(on, id = primaryId) { updateSeat(id, { selected: !!on }); },
    setTell(text, id = primaryId) {
      const seat = getSeat(id);
      const el = seat.el.querySelector('.seat-pose');
      el.textContent = text || POSE_TEXT[seat.card.dataset.pose] || POSE_TEXT[POSE.NEUTRAL];
      el.title = text || '';
    },
    // 立绘角标:此人生平破绩履历(识破命中/总数,诓骗次数)。数据来自观阵录存档,
    // 让"谁可信"在决策瞬间可见,而不是埋在图鉴深处。
    setTellRecord(record, id = primaryId) {
      const seat = getSeat(id);
      if (!seat) return;
      const el = seat.el.querySelector('.seat-record');
      if (!record || !record.n) { el.hidden = true; el.textContent = ''; return; }
      el.hidden = false;
      el.dataset.lies = String(record.lies || 0);
      el.textContent = `识破${record.hit}/${record.n}${record.lies ? ` 诓${record.lies}` : ''}`;
    },
    // 摊牌判印:亮牌后压在立绘上的牌型章。tone:'' 亮牌 / 'win' 赢 / 'lose' 输。
    setShowdown(text, tone = '', id = primaryId) {
      const seat = getSeat(id);
      if (!seat) return;
      const el = seat.el.querySelector('.seat-showdown');
      el.hidden = !text;
      el.textContent = text || '';
      el.dataset.tone = tone;
    },
    clearShowdown(id = primaryId) {
      const seat = seats.get(id);
      if (!seat) return;
      const el = seat.el.querySelector('.seat-showdown');
      el.hidden = true;
      el.textContent = '';
      delete el.dataset.tone;
    },
    setActive(on, id = primaryId) {
      const seat = getSeat(id);
      seat.card.classList.toggle('is-active', !!on);
      if (on && seats.size > 1) centerSeat(seat, matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
    },
    say(text, dur = 2.6, id = primaryId) {
      const seat = getSeat(id);
      clearTimeout(seat.timer);
      seat.bubble.textContent = text;
      seat.bubble.classList.remove('hidden', 'is-intent', 'is-verdict', 'is-lie');
      seat.bubble.style.opacity = 1;
      seat.el.classList.add('speaking');
      seat.timer = setTimeout(() => {
        seat.bubble.style.opacity = 0;
        seat.el.classList.remove('speaking');
      }, dur * 1000);
    },
    // 破绽气泡:台词层(他说漏嘴的话)+注解层(动作文案/判词/识破履历)。
    // tone:'equity' 牌力破绽(朱) / 'intent' 意图泄露(金,恒真) / 'verdict-hit'|'verdict-lie' 摊牌验真。
    tell({ line, note, dur = 3, id = primaryId, tone = 'equity' }) {
      const seat = getSeat(id);
      if (!seat) return;
      clearTimeout(seat.timer);
      seat.bubble.replaceChildren();
      const quote = document.createElement('b');
      quote.textContent = line || '……';
      seat.bubble.append(quote);
      if (note) {
        const meta = document.createElement('i');
        meta.textContent = note;
        seat.bubble.append(meta);
      }
      seat.bubble.classList.remove('hidden', 'is-intent', 'is-verdict', 'is-lie');
      if (tone === 'intent') seat.bubble.classList.add('is-intent');
      if (tone === 'verdict-hit') seat.bubble.classList.add('is-verdict');
      if (tone === 'verdict-lie') seat.bubble.classList.add('is-verdict', 'is-lie');
      seat.bubble.style.opacity = 1;
      seat.el.classList.add('speaking');
      seat.timer = setTimeout(() => {
        seat.bubble.style.opacity = 0;
        seat.el.classList.remove('speaking');
      }, dur * 1000);
    },
  };
}
