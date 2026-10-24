// table.js —— 牌桌、扑克牌、筹码(纹理全部程序化生成,无外部素材)
import * as THREE from 'three';
import { SUITS, SUIT_RED, RANKS, rankOf, suitOf } from './poker.js';

export const CARD_W = 0.13, CARD_H = 0.182, CHIP_R = 0.052, CHIP_H = 0.013;

const SERIF = 'Georgia, "Songti SC", "STSong", serif';
const RED = '#a8253a', BLK = '#1d2432', GOLD = '#c9a45c';

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function roundedPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------------- 牌面 ----------------

const faceCache = new Map();

function drawFace(id) {
  const r = rankOf(id), s = suitOf(id);
  const color = SUIT_RED[s] ? RED : BLK;
  return canvasTex(240, 336, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // 牌底:象牙白带一点做旧
    roundedPath(ctx, 2, 2, w - 4, h - 4, 20);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#f4eedd'); g.addColorStop(1, '#e6dcc2');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(120,100,60,0.35)'; ctx.lineWidth = 3; ctx.stroke();

    ctx.fillStyle = color;
    const rank = RANKS[r];
    if (r >= 9) { // J Q K A:大字 + 花押金框
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(201,164,92,0.8)'; ctx.lineWidth = 2;
      roundedPath(ctx, 42, 88, w - 84, h - 176, 10); ctx.stroke();
      ctx.font = `700 ${r === 12 ? 120 : 104}px ${SERIF}`;
      ctx.fillText(rank, w / 2, h / 2 - 12);
      ctx.font = `52px ${SERIF}`;
      ctx.fillText(SUITS[s], w / 2, h / 2 + 66);
    } else { // 数字牌:中央大花色 + 点数阵
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `110px ${SERIF}`;
      ctx.fillText(SUITS[s], w / 2, h / 2 + 6);
      ctx.font = `700 44px ${SERIF}`;
      ctx.fillText(rank, w / 2, 72);
    }
    // 角标
    ctx.textAlign = 'center';
    ctx.font = `700 34px ${SERIF}`;
    ctx.fillText(rank, 28, 34);
    ctx.font = `30px ${SERIF}`;
    ctx.fillText(SUITS[s], 28, 66);
    ctx.save();
    ctx.translate(w - 28, h - 34); ctx.rotate(Math.PI);
    ctx.font = `700 34px ${SERIF}`;
    ctx.fillText(rank, 0, 0);
    ctx.font = `30px ${SERIF}`;
    ctx.fillText(SUITS[s], 0, 32);
    ctx.restore();
  });
}

let backTex = null;
function drawBack() {
  return canvasTex(240, 336, (ctx, w, h) => {
    roundedPath(ctx, 2, 2, w - 4, h - 4, 20);
    ctx.fillStyle = '#16213d'; ctx.fill();
    ctx.save();
    roundedPath(ctx, 10, 10, w - 20, h - 20, 14);
    ctx.clip();
    // 金色菱格纹
    ctx.strokeStyle = 'rgba(201,164,92,0.4)'; ctx.lineWidth = 1.5;
    for (let i = -h; i < w + h; i += 26) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i + h, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    ctx.restore();
    // 中央徽记
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3;
    roundedPath(ctx, 10, 10, w - 20, h - 20, 14); ctx.stroke();
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 46, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `64px ${SERIF}`;
    ctx.fillText('♠', w / 2, h / 2 + 2);
  });
}

// 双面牌组:front +Y 面朝上,back 朝下;翻面即绕局部 Z 轴转 π
export function makeCard(id) {
  if (!backTex) backTex = drawBack();
  if (!faceCache.has(id)) faceCache.set(id, drawFace(id));
  const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const matOpts = t => ({
    map: t, transparent: true, alphaTest: 0.4, roughness: 0.5, metalness: 0,
    color: 0xc8c4b8, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.1,
    side: THREE.FrontSide,
  });
  const front = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(matOpts(faceCache.get(id))));
  front.rotation.x = -Math.PI / 2;
  front.position.y = 0.0008;
  const back = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(matOpts(backTex)));
  back.rotation.x = Math.PI / 2;
  back.position.y = -0.0002;

  const group = new THREE.Group();
  group.add(front, back);
  group.userData.cardId = id;
  // 默认正面朝上(faceUp=true);发牌时背面朝上则 group.rotation.z = π
  group.userData.faceUp = true;
  group.userData.front = front;
  return group;
}

// ---------------- 筹码 ----------------

const chipTexCache = new Map();

function chipTextures(tone) {
  if (chipTexCache.has(tone)) return chipTexCache.get(tone);
  const ivory = tone === 'ivory';
  const body = ivory ? '#e8dfc8' : '#262b3a';
  const stripe = ivory ? '#1d5c50' : '#a8253a';
  const side = canvasTex(128, 32, (ctx, w, h) => {
    ctx.fillStyle = body; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = stripe;
    for (let i = 0; i < 6; i++) ctx.fillRect(i * (w / 6) + 4, 0, 8, h);
  });
  const top = canvasTex(128, 128, (ctx, w, h) => {
    ctx.fillStyle = body; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = stripe; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 46, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `44px ${SERIF}`;
    ctx.fillText('♠', w / 2, h / 2 + 2);
  });
  const pair = { side, top };
  chipTexCache.set(tone, pair);
  return pair;
}

export function makeChip(tone) {
  const { side, top } = chipTextures(tone);
  const geo = new THREE.CylinderGeometry(CHIP_R, CHIP_R, CHIP_H, 26);
  const mats = [
    new THREE.MeshStandardMaterial({ map: side, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ map: top, roughness: 0.45, emissive: 0xffffff, emissiveMap: top, emissiveIntensity: 0.12 }),
    new THREE.MeshStandardMaterial({ color: 0x222222 }),
  ];
  const m = new THREE.Mesh(geo, mats);
  m.castShadow = true;
  return m;
}

// 在 parent 里重建一摞筹码(数量变化时整体重建,简单可靠;视觉上限一摞 16 枚)
export function renderChipStack(parent, n, tone, rng = Math.random) {
  while (parent.children.length) parent.remove(parent.children[0]);
  const count = Math.min(Math.max(0, Math.round(n)), 16);
  for (let i = 0; i < count; i++) {
    const c = makeChip(tone);
    c.position.set((rng() - 0.5) * 0.008, i * CHIP_H + CHIP_H / 2, (rng() - 0.5) * 0.008);
    c.rotation.y = rng() * Math.PI;
    parent.add(c);
  }
  return count * CHIP_H;
}

// ---------------- 牌桌 ----------------

function feltTexture() {
  return canvasTex(1024, 1024, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#14544b');
    g.addColorStop(0.7, '#0e3f39');
    g.addColorStop(1, '#082825');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // 绒面噪点
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.028})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
    }
    // 金色圈线与中央徽记
    ctx.strokeStyle = 'rgba(201,164,92,0.5)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 356, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 336, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(201,164,92,0.28)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `150px ${SERIF}`;
    ctx.fillText('♠', w / 2, h / 2 - 20);
    ctx.font = `700 30px ${SERIF}`;
    ctx.fillText('THE  HOUSE  ALWAYS  DEALS', w / 2, h / 2 + 66);
  });
}

export function buildTable(scene) {
  const group = new THREE.Group();
  const feltY = 0.78;

  // 绒面
  const felt = new THREE.Mesh(
    new THREE.CircleGeometry(1.3, 72),
    new THREE.MeshStandardMaterial({ map: feltTexture(), roughness: 0.94, metalness: 0 })
  );
  felt.rotation.x = -Math.PI / 2;
  felt.position.y = feltY;
  felt.receiveShadow = true;
  group.add(felt);

  // 木沿
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(1.46, 1.5, 0.1, 72),
    new THREE.MeshStandardMaterial({ color: 0x2e1d12, roughness: 0.55, metalness: 0.08 })
  );
  rim.position.y = feltY - 0.052;
  rim.castShadow = true; rim.receiveShadow = true;
  group.add(rim);

  // 黄铜圈
  const brass = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.014, 10, 90),
    new THREE.MeshStandardMaterial({ color: 0xc9a45c, roughness: 0.25, metalness: 0.95 })
  );
  brass.rotation.x = Math.PI / 2;
  brass.position.y = feltY + 0.002;
  group.add(brass);

  // 桌腿与底座
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.52, feltY - 0.1, 32),
    new THREE.MeshStandardMaterial({ color: 0x241610, roughness: 0.7 })
  );
  leg.position.y = (feltY - 0.1) / 2;
  leg.castShadow = true;
  group.add(leg);
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.78, 0.06, 40),
    new THREE.MeshStandardMaterial({ color: 0x1c120c, roughness: 0.75 })
  );
  base.position.y = 0.03;
  group.add(base);

  scene.add(group);
  return { group, feltY };
}
