// opponent.js —— 收债人:庄家的提线木偶发牌员。
// 球关节手臂 + 瓷面 + 破绽动画。破绽(tell):强牌护筹码、弱牌摸面具、上头喘粗气捶桌。
import * as THREE from 'three';
import { makeFlame } from './world.js';

// 姿态表:手部目标点为 group 局部坐标
const POSES = {
  neutral: {
    head: [0.02, 0, 0], lean: 0,
    handR: [-0.36, 0.83, 0.60], handL: [0.36, 0.83, 0.60],
    breathe: 0.012, tap: 0,
  },
  strong: { // 破绽 A:右手护住筹码堆,身体微前倾,静下来
    head: [0.14, 0.04, 0], lean: 0.07,
    handR: [-0.62, 0.86, 0.80], handL: [0.36, 0.83, 0.60],
    breathe: 0.004, tap: 0,
  },
  bluff: { // 破绽 B:左手抬到面具边,视线飘开,右手指尖焦躁点桌
    head: [-0.06, 0.38, 0.06], lean: -0.05,
    handR: [-0.36, 0.83, 0.60], handL: [0.02, 1.42, 0.42],
    breathe: 0.02, tap: 1,
  },
  thinking: {
    head: [0.18, -0.08, 0], lean: 0.03,
    handR: [-0.08, 1.36, 0.40], handL: [0.36, 0.83, 0.60],
    breathe: 0.006, tap: 0,
  },
  defeat: {
    head: [0.5, 0, 0.1], lean: 0.12,
    handR: [-0.42, 0.83, 0.5], handL: [0.42, 0.83, 0.5],
    breathe: 0.003, tap: 0,
  },
};

const BRASS = new THREE.MeshStandardMaterial({ color: 0xa8874a, metalness: 1, roughness: 0.3 });
const VELVET = new THREE.MeshPhysicalMaterial({
  color: 0x2a2040, roughness: 0.85, metalness: 0,
  sheen: 0.9, sheenColor: 0x5a4f8a, sheenRoughness: 0.5,
});
const VELVET_DARK = new THREE.MeshPhysicalMaterial({
  color: 0x191228, roughness: 0.9, metalness: 0,
  sheen: 0.6, sheenColor: 0x3a3260, sheenRoughness: 0.6,
});
const LACE = new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.85 });
const GLOVE = new THREE.MeshStandardMaterial({ color: 0x2c241c, roughness: 0.45, metalness: 0.08 });
const WOOD = new THREE.MeshStandardMaterial({ color: 0x241610, roughness: 0.6 });

function maskTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#f2ebdc'); g.addColorStop(1, '#d9d0bd');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  // 额心金印
  ctx.fillStyle = '#c9a45c';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '34px Georgia, serif';
  ctx.fillText('♠', 128, 56);
  // 眉
  ctx.strokeStyle = 'rgba(58,52,48,0.85)';
  ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(84, 96); ctx.quadraticCurveTo(100, 88, 114, 94); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(172, 96); ctx.quadraticCurveTo(156, 88, 142, 94); ctx.stroke();
  // 一道金泪
  ctx.strokeStyle = 'rgba(201,164,92,0.9)';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(96, 116); ctx.quadraticCurveTo(92, 158, 100, 194); ctx.stroke();
  // 唇
  ctx.strokeStyle = 'rgba(120,40,40,0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(108, 172); ctx.quadraticCurveTo(128, 180, 148, 170); ctx.stroke();
  // 裂纹
  ctx.strokeStyle = 'rgba(90,80,70,0.5)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(172, 28); ctx.lineTo(184, 72); ctx.lineTo(174, 106); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(58, 208); ctx.lineTo(84, 188); ctx.stroke();
  // 腮红
  const rg = ctx.createRadialGradient(80, 148, 2, 80, 148, 26);
  rg.addColorStop(0, 'rgba(168,37,58,0.15)'); rg.addColorStop(1, 'rgba(168,37,58,0)');
  ctx.fillStyle = rg; ctx.fillRect(40, 118, 80, 60);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// 沿任意方向的一截肢体
function limbSegment(from, to, r, mat) {
  const dir = to.clone().sub(from);
  const len = dir.length();
  const geo = new THREE.CapsuleGeometry(r, len, 4, 10);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  return mesh;
}

// 沿 +Z 的前臂(供 lookAt 追踪)
function forearmMesh(len, r) {
  const g = new THREE.Group();
  const geo = new THREE.CapsuleGeometry(r, len, 4, 10);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, 0, len / 2);
  const m = new THREE.Mesh(geo, VELVET);
  m.castShadow = true;
  g.add(m);
  // 袖口金环
  const cuff = new THREE.Mesh(new THREE.TorusGeometry(r + 0.012, 0.008, 8, 20), BRASS);
  cuff.position.z = len * 0.82;
  g.add(cuff);
  const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 10), BRASS);
  wrist.position.z = len + 0.01;
  g.add(wrist);
  return g;
}

function makeHand() {
  const h = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), GLOVE);
  palm.scale.set(1, 0.5, 1.25);
  palm.castShadow = true;
  h.add(palm);
  // 四指
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.055, 4, 8), GLOVE);
    f.position.set((i - 1.5) * 0.032, -0.01, 0.1);
    f.rotation.x = Math.PI / 2 - 0.35;
    f.rotation.z = (i - 1.5) * 0.08;
    f.castShadow = true;
    h.add(f);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), BRASS);
    tip.position.set((i - 1.5) * 0.034, -0.032, 0.128);
    h.add(tip);
  }
  // 拇指
  const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.045, 4, 8), GLOVE);
  th.position.set(0.07, 0, 0.04);
  th.rotation.set(Math.PI / 2 - 0.2, 0, -0.7);
  h.add(th);
  return h;
}

export function createOpponent(scene) {
  const group = new THREE.Group();
  group.position.set(0, 0, -1.66);

  // ---------------- 高背椅 ----------------
  {
    const chair = new THREE.Group();
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 1.55, 10), WOOD);
      post.position.set(sx * 0.33, 0.78, 0);
      chair.add(post);
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), BRASS);
      finial.position.set(sx * 0.33, 1.6, 0);
      chair.add(finial);
    }
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.66, 1.05, 0.05), WOOD);
    panel.position.set(0, 1.05, 0.01);
    chair.add(panel);
    const inset = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.9, 0.055),
      new THREE.MeshStandardMaterial({ color: 0x401525, roughness: 0.9 })
    );
    inset.position.set(0, 1.05, 0.02);
    chair.add(inset);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.08, 0.07), WOOD);
    rail.position.set(0, 1.55, 0.01);
    chair.add(rail);
    chair.position.set(0, 0, -0.52);
    chair.traverse(m => { if (m.isMesh) m.castShadow = true; });
    group.add(chair);
  }

  // ---------------- 躯干 ----------------
  const torso = new THREE.Group();
  group.add(torso);

  // 下摆长袍(多半藏在桌后)
  const robeProfile = [
    new THREE.Vector2(0.03, 0.0), new THREE.Vector2(0.52, 0.02),
    new THREE.Vector2(0.44, 0.4), new THREE.Vector2(0.30, 0.78),
    new THREE.Vector2(0.26, 0.94),
  ];
  const robe = new THREE.Mesh(new THREE.LatheGeometry(robeProfile, 26), VELVET_DARK);
  robe.castShadow = true;
  torso.add(robe);

  // 胸(马甲)
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 18), VELVET);
  chest.scale.set(0.95, 1.05, 0.72);
  chest.position.set(0, 1.12, 0);
  chest.castShadow = true;
  torso.add(chest);
  // 金扣
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), BRASS);
    b.position.set(0, 0.97 + i * 0.11, 0.205 - i * 0.008);
    torso.add(b);
  }
  // 翻领
  for (const sx of [-1, 1]) {
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.24, 0.03), VELVET_DARK);
    lapel.position.set(sx * 0.075, 1.24, 0.185);
    lapel.rotation.z = sx * 0.45;
    lapel.rotation.x = -0.12;
    torso.add(lapel);
  }
  // 肩斗篷(短披肩,遮肩关节)
  const capeProfile = [
    new THREE.Vector2(0.16, 0.0), new THREE.Vector2(0.35, -0.09),
    new THREE.Vector2(0.38, -0.17),
  ];
  const cape = new THREE.Mesh(new THREE.LatheGeometry(capeProfile, 26), VELVET_DARK);
  cape.position.y = 1.34;
  cape.castShadow = true;
  torso.add(cape);
  const capeTrim = new THREE.Mesh(new THREE.TorusGeometry(0.365, 0.008, 8, 40), BRASS);
  capeTrim.rotation.x = Math.PI / 2;
  capeTrim.position.y = 1.34 - 0.155;
  torso.add(capeTrim);

  // 蕾丝颈圈 + 领结
  const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.045, 10, 24), LACE);
  ruff.rotation.x = Math.PI / 2 - 0.25;
  ruff.position.set(0, 1.44, 0.02);
  torso.add(ruff);
  for (const sx of [-1, 1]) {
    const bow = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.08, 8), LACE);
    bow.position.set(sx * 0.045, 1.4, 0.15);
    bow.rotation.z = sx * Math.PI / 2;
    torso.add(bow);
  }
  // 脖子
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12), VELVET_DARK);
  neck.position.set(0, 1.47, 0.02);
  torso.add(neck);

  // ---------------- 头:兜帽 + 瓷面 + 眼 ----------------
  const head = new THREE.Group();
  head.position.set(0, 1.52, 0.03);
  group.add(head);

  const hoodProfile = [
    new THREE.Vector2(0.13, -0.1), new THREE.Vector2(0.24, -0.02),
    new THREE.Vector2(0.285, 0.1), new THREE.Vector2(0.25, 0.21),
    new THREE.Vector2(0.13, 0.31), new THREE.Vector2(0.015, 0.36),
  ];
  const hood = new THREE.Mesh(new THREE.LatheGeometry(hoodProfile, 24), VELVET_DARK);
  hood.rotation.x = -0.12;
  hood.position.set(0, 0, -0.03);
  hood.castShadow = true;
  head.add(hood);
  // 兜帽内的黑暗
  const void_ = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x05050a })
  );
  void_.position.set(0, 0.06, 0.05);
  head.add(void_);

  const maskTex = maskTexture();
  const mask = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 24),
    new THREE.MeshPhysicalMaterial({
      map: maskTex, roughness: 0.16, metalness: 0,
      clearcoat: 1, clearcoatRoughness: 0.12,
      emissive: 0xffffff, emissiveMap: maskTex, emissiveIntensity: 0.38,
    })
  );
  mask.scale.set(0.8, 1.08, 0.54);
  mask.position.set(0, 0.04, 0.17);
  mask.castShadow = true;
  head.add(mask);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffc06a });
  const eyes = [];
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), eyeMat.clone());
    eye.position.set(sx * 0.058, 0.075, 0.27);
    head.add(eye);
    eyes.push(eye);
  }

  // ---------------- 球关节手臂 ----------------
  const FORE_LEN = 0.45;
  const arms = {};
  for (const side of ['R', 'L']) {
    const sx = side === 'R' ? -1 : 1;
    const shoulderPos = new THREE.Vector3(sx * 0.32, 1.36, 0.06);
    const elbowOff = new THREE.Vector3(sx * 0.16, -0.28, 0.20);

    const arm = new THREE.Group();
    arm.position.copy(shoulderPos);
    const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 12), BRASS);
    shoulderBall.castShadow = true;
    arm.add(shoulderBall);
    arm.add(limbSegment(new THREE.Vector3(0, 0, 0), elbowOff, 0.06, VELVET));
    const elbowBall = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), BRASS);
    elbowBall.position.copy(elbowOff);
    elbowBall.castShadow = true;
    arm.add(elbowBall);

    const fore = new THREE.Group();
    fore.position.copy(elbowOff);
    fore.add(forearmMesh(FORE_LEN, 0.05));
    const hand = makeHand();
    hand.position.set(0, 0, FORE_LEN + 0.04);
    if (side === 'L') hand.rotation.y = Math.PI; // 拇指朝内
    fore.add(hand);
    arm.add(fore);
    group.add(arm);
    arms[side] = { arm, fore, hand, elbowOff };
  }

  // 上头的蒸汽(领口喷出)
  const steam = makeFlame({ colA: 0xaab4c8, colB: 0x8a94b8, height: 0.5, radius: 2.2, size: 0.8, count: 40 });
  steam.pts.position.set(0, 1.44, 0.1);
  steam.uniforms.uOn.value = 0;
  group.add(steam.pts);

  // 说话气泡锚点
  const anchor = new THREE.Object3D();
  anchor.position.set(0, 1.92, 0.1);
  group.add(anchor);

  scene.add(group);

  // ---------------- 动画状态 ----------------
  const mkCur = () => ({
    head: new THREE.Euler(...POSES.neutral.head),
    handR: new THREE.Vector3(...POSES.neutral.handR),
    handL: new THREE.Vector3(...POSES.neutral.handL),
    lean: 0, breathe: POSES.neutral.breathe, tap: 0,
  });
  const cur = mkCur();
  const target = mkCur();
  let tilt = 0, t = 0, slamCd = 0;
  let onSlam = null;
  const slamOffset = { R: 0, L: 0 };

  function setState(name) {
    const p = POSES[name] || POSES.neutral;
    target.head.set(...p.head);
    target.handR.set(...p.handR);
    target.handL.set(...p.handL);
    target.lean = p.lean;
    target.breathe = p.breathe;
    target.tap = p.tap;
  }

  const vTip = new THREE.Vector3();
  const vElbow = new THREE.Vector3();

  function trackArm(side, tipLocal, extraY, dt) {
    const A = arms[side];
    // 手部目标(group 局部 → 世界;group 只有平移)
    vTip.copy(tipLocal);
    vTip.y += extraY;
    vTip.add(group.position);
    A.fore.lookAt(vTip);
    // 木偶手臂允许轻微伸缩
    A.fore.getWorldPosition(vElbow);
    const dist = vElbow.distanceTo(vTip);
    A.fore.scale.z = THREE.MathUtils.clamp(dist / (FORE_LEN + 0.04), 0.8, 1.4);
  }

  return {
    group, head, mask, eyes, anchor,
    handR: arms.R.hand,
    setState,
    setTilt(n) {
      tilt = n;
      steam.uniforms.uOn.value = tilt >= 2 ? 0.9 : 0;
    },
    onSlam(fn) { onSlam = fn; },
    // 面具落到桌上(被清台)
    maskFall() {
      const world = new THREE.Vector3();
      mask.getWorldPosition(world);
      head.remove(mask);
      mask.position.copy(world);
      scene.add(mask);
      eyes.forEach(e => { e.material.color.set(0x1a1a1a); });
      return { mesh: mask, from: world.clone() };
    },
    update(dt) {
      t += dt;
      const k = Math.min(1, dt * 3.2);
      head.rotation.x += (target.head.x - head.rotation.x) * k;
      head.rotation.y += (target.head.y - head.rotation.y) * k;
      head.rotation.z += (target.head.z - head.rotation.z) * k;
      cur.handR.lerp(target.handR, k);
      cur.handL.lerp(target.handL, k);
      cur.lean += (target.lean - cur.lean) * k;
      cur.breathe += ((target.breathe + tilt * 0.014) - cur.breathe) * k;
      cur.tap += (target.tap - cur.tap) * k;

      const b = Math.sin(t * Math.PI * 2 * 0.22) * cur.breathe;
      torso.scale.y = 1 + b;
      torso.rotation.x = cur.lean + b * 0.4;
      head.position.y = 1.52 + b * 2.0;

      // 焦躁点桌
      const tapY = Math.max(0, Math.sin(t * 11)) * 0.014 * cur.tap;
      // 上头捶桌(随机触发)
      if (tilt >= 2) {
        slamCd -= dt;
        if (slamCd <= 0 && Math.random() < dt * 0.25) {
          slamCd = 4.5;
          slamOffset.R = 0.001; // 启动
        }
      }
      let slamY = 0;
      if (slamOffset.R > 0) {
        slamOffset.R += dt * 5;
        const sk = slamOffset.R;
        if (sk < 0.5) slamY = sk * 0.2;
        else if (sk < 1) {
          slamY = (1 - sk) * 0.2;
          if (!slamOffset.hit) { slamOffset.hit = true; onSlam && onSlam(); }
        } else { slamOffset.R = 0; slamOffset.hit = false; }
      }

      trackArm('R', cur.handR, tapY + slamY, dt);
      trackArm('L', cur.handL, 0, dt);
      steam.uniforms.uTime.value += dt;
    },
  };
}
