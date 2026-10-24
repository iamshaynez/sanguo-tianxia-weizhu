// fx2d.js —— 2D 三国水墨氛围:群山、江雾、军旗、落叶与微工具
const SPEED = new URLSearchParams(location.search).has('fast') ? 0.3 : 1;
export const wait = sec => new Promise(r => setTimeout(r, sec * 1000 * SPEED));

export function startBackdrop(canvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, far = null, near = null, vignette = null;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const noise = n => (Math.sin(n * 91.733) * 43758.5453) % 1;
  addEventListener('pointermove', e => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / innerHeight) * 2 - 1;
  });

  function ridge(c, base, amp, color, seed) {
    c.beginPath(); c.moveTo(-60, H + 20);
    const step = Math.max(55, W / 18);
    for (let x = -60, i = 0; x <= W + step; x += step, i++) {
      const peak = Math.abs(noise(seed + i * 1.7));
      const y = base - amp * (.28 + peak * .72) - Math.sin(i * 1.9 + seed) * amp * .16;
      c.lineTo(x, y);
      c.lineTo(x + step * .46, y + amp * (.18 + Math.abs(noise(seed + i)) * .22));
    }
    c.lineTo(W + 60, H + 20); c.closePath(); c.fillStyle = color; c.fill();
  }

  function paintStatic() {
    W = canvas.width = Math.floor(innerWidth * Math.min(devicePixelRatio, 2));
    H = canvas.height = Math.floor(innerHeight * Math.min(devicePixelRatio, 2));
    far = document.createElement('canvas'); far.width = W; far.height = H;
    const f = far.getContext('2d');
    const sky = f.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#182119'); sky.addColorStop(.55, '#38402d'); sky.addColorStop(1, '#6b5a3b');
    f.fillStyle = sky; f.fillRect(0, 0, W, H);

    const sx = W * .76, sy = H * .22, sr = Math.min(W, H) * .085;
    const halo = f.createRadialGradient(sx, sy, 2, sx, sy, sr * 2.8);
    halo.addColorStop(0, '#d8c28b55'); halo.addColorStop(1, '#d8c28b00');
    f.fillStyle = halo; f.fillRect(sx - sr * 3, sy - sr * 3, sr * 6, sr * 6);
    f.fillStyle = '#d8c28b36'; f.beginPath(); f.arc(sx, sy, sr, 0, Math.PI * 2); f.fill();

    ridge(f, H * .55, H * .22, '#333d2dcc', 3);
    ridge(f, H * .65, H * .25, '#263022dd', 7);
    ridge(f, H * .73, H * .18, '#1c271cee', 13);

    // 远岸军旗:只做剪影,让画面有汉末行军感
    f.strokeStyle = '#171d16aa'; f.fillStyle = '#632f26aa'; f.lineWidth = Math.max(2, H * .004);
    for (const [x, y, s] of [[.1, .57, .8], [.88, .54, 1], [.93, .6, .65]]) {
      const px = W * x, py = H * y, size = H * .09 * s;
      f.beginPath(); f.moveTo(px, py); f.lineTo(px, py + size * 1.8); f.stroke();
      f.beginPath(); f.moveTo(px, py); f.lineTo(px + size * .72, py + size * .13); f.lineTo(px + size * .55, py + size * .48); f.lineTo(px, py + size * .37); f.closePath(); f.fill();
    }

    near = document.createElement('canvas'); near.width = W; near.height = H;
    const n = near.getContext('2d');
    ridge(n, H * .92, H * .23, '#101910', 19);
    const ground = n.createLinearGradient(0, H * .76, 0, H);
    ground.addColorStop(0, '#141d1400'); ground.addColorStop(.35, '#111910cc'); ground.addColorStop(1, '#090e09');
    n.fillStyle = ground; n.fillRect(0, H * .72, W, H * .28);
    n.strokeStyle = '#b6a77a12'; n.lineWidth = 1;
    for (let i = 0; i < 90; i++) {
      const y = Math.abs(noise(i + 40)) * H;
      const x = Math.abs(noise(i + 80)) * W;
      n.beginPath(); n.moveTo(x, y); n.lineTo(x + 30 + Math.abs(noise(i)) * 130, y + noise(i + 3) * 2); n.stroke();
    }

    vignette = document.createElement('canvas'); vignette.width = W; vignette.height = H;
    const v = vignette.getContext('2d');
    const vg = v.createRadialGradient(W * .52, H * .42, Math.min(W, H) * .2, W * .5, H * .5, Math.max(W, H) * .72);
    vg.addColorStop(0, '#080c0800'); vg.addColorStop(1, '#070b07aa');
    v.fillStyle = vg; v.fillRect(0, 0, W, H);
  }

  const mistSprite = document.createElement('canvas'); mistSprite.width = 512; mistSprite.height = 128;
  const m = mistSprite.getContext('2d');
  const mg = m.createRadialGradient(256, 64, 8, 256, 64, 250);
  mg.addColorStop(0, '#d4ceb02b'); mg.addColorStop(.55, '#c5c3a615'); mg.addColorStop(1, '#c5c3a600');
  m.fillStyle = mg; m.fillRect(0, 0, 512, 128);
  const mists = Array.from({ length: 7 }, (_, i) => ({
    x: Math.abs(noise(i + 3)) * 1.2 - .1, y: .47 + Math.abs(noise(i + 12)) * .35,
    s: .6 + Math.abs(noise(i + 23)) * .9, speed: .006 + Math.abs(noise(i + 30)) * .008,
  }));
  const leaves = Array.from({ length: 28 }, (_, i) => ({
    x: Math.abs(noise(i + 51)), y: Math.abs(noise(i + 73)),
    speed: .025 + Math.abs(noise(i + 91)) * .035, drift: noise(i + 17) * .05,
    size: 1 + Math.abs(noise(i + 33)) * 2.2, spin: Math.abs(noise(i + 61)) * 6,
  }));

  let last = performance.now(), lastTick = last, t = 0;
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
    mouse.x += (mouse.tx - mouse.x) * .035; mouse.y += (mouse.ty - mouse.y) * .035;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(far, mouse.x * -7, mouse.y * -4);
    for (const fog of mists) {
      fog.x += fog.speed * dt; if (fog.x > 1.3) fog.x = -.35;
      const fw = W * .48 * fog.s, fh = fw * .25;
      ctx.drawImage(mistSprite, fog.x * W - fw / 2, fog.y * H - fh / 2 + mouse.y * -5, fw, fh);
    }
    ctx.drawImage(near, mouse.x * -13, mouse.y * -7);
    for (const leaf of leaves) {
      leaf.y += leaf.speed * dt; leaf.x += leaf.drift * dt;
      if (leaf.y > 1.05 || leaf.x > 1.05) { leaf.y = -.05; leaf.x = Math.abs(noise(t + leaf.spin)); }
      const a = .12 + .16 * Math.sin(t * 2 + leaf.spin) ** 2;
      ctx.fillStyle = `rgba(194,163,99,${a})`;
      ctx.save(); ctx.translate(leaf.x * W, leaf.y * H); ctx.rotate(t + leaf.spin);
      ctx.fillRect(-leaf.size, -leaf.size / 2, leaf.size * 2.8, leaf.size); ctx.restore();
    }
    ctx.drawImage(vignette, 0, 0);
  }

  paintStatic();
  addEventListener('resize', paintStatic);
  let raf = 0;
  const loop = now => { lastTick = now; frame(now); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  setInterval(() => { if (performance.now() - lastTick > 400) { lastTick = performance.now(); last = lastTick; frame(lastTick); } }, 350);
  return () => cancelAnimationFrame(raf);
}

export function shake(el, power = 1) {
  let k = 0;
  const id = setInterval(() => {
    k += 1;
    const d = Math.max(0, 1 - k / 16) * 7 * power;
    el.style.transform = `translate(${(Math.random() - .5) * d}px, ${(Math.random() - .5) * d}px)`;
    if (k >= 16) { clearInterval(id); el.style.transform = ''; }
  }, 30);
}
