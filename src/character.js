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
        </div>
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
    return seats.get(id) || seats.get(primaryId);
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
    setActive(on, id = primaryId) {
      const seat = getSeat(id);
      seat.card.classList.toggle('is-active', !!on);
      if (on && seats.size > 1) centerSeat(seat, matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
    },
    say(text, dur = 2.6, id = primaryId) {
      const seat = getSeat(id);
      clearTimeout(seat.timer);
      seat.bubble.textContent = text;
      seat.bubble.classList.remove('hidden');
      seat.bubble.style.opacity = 1;
      seat.el.classList.add('speaking');
      seat.timer = setTimeout(() => {
        seat.bubble.style.opacity = 0;
        seat.el.classList.remove('speaking');
      }, dur * 1000);
    },
  };
}
