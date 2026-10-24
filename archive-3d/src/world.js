// world.js —— 永恒黄昏:天空、运势极光、遗迹、巨牌图腾、火盆、雾与尘埃
import * as THREE from 'three';

const NOISE_GLSL = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}`;

// ---------------- 天空 ----------------

function buildSky(scene) {
  const uniforms = {
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(-0.18, 0.045, -1).normalize() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 vDir;
      void main(){
        vDir = position;
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww; // 永远贴远平面
      }`,
    fragmentShader: `
      varying vec3 vDir;
      uniform float uTime;
      uniform vec3 uSunDir;
      ${NOISE_GLSL}
      void main(){
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 horizon = vec3(0.98, 0.42, 0.16);
        vec3 mid     = vec3(0.23, 0.17, 0.35);
        vec3 zenith  = vec3(0.030, 0.036, 0.085);
        vec3 col = mix(horizon, mid, smoothstep(-0.02, 0.22, h));
        col = mix(col, zenith, smoothstep(0.16, 0.62, h));
        // 落日
        float s = max(dot(d, uSunDir), 0.0);
        col += vec3(1.0, 0.55, 0.22) * pow(s, 900.0) * 4.0;
        col += vec3(1.0, 0.45, 0.15) * pow(s, 10.0) * 0.38;
        // 地平线云带
        float band = smoothstep(0.30, 0.02, h) * smoothstep(-0.08, 0.02, h);
        float cl = noise(vec2(atan(d.x, d.z) * 6.0, h * 26.0 + uTime * 0.01));
        col = mix(col, vec3(0.75, 0.30, 0.20), band * cl * 0.35);
        // 星星(高处)
        vec3 cell = floor(d * 240.0);
        float star = step(0.9982, hash(cell.xy + cell.z));
        float tw = 0.55 + 0.45 * sin(uTime * 2.4 + hash(cell.xz) * 40.0);
        col += vec3(0.9, 0.95, 1.0) * star * tw * smoothstep(0.18, 0.55, h) * 0.75;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(380, 40, 24), mat);
  scene.add(sky);
  return { mesh: sky, uniforms };
}

// ---------------- 运势极光 ----------------

function buildAurora(scene) {
  const group = new THREE.Group();
  const uniformsList = [];

  const mkRibbon = (y, z, rotY, rotZ, hueShift, len) => {
    const uniforms = {
      uTime: { value: 0 },
      uHue: { value: hueShift },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main(){
          vUv = uv;
          vec3 p = position;
          float x = uv.x * 6.2831;
          p.y += sin(x * 2.0 + uTime * 0.22) * 9.0 + sin(x * 5.0 - uTime * 0.35) * 4.0;
          p.z += cos(x * 1.5 + uTime * 0.18) * 10.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uHue;
        ${NOISE_GLSL}
        void main(){
          float n = noise(vec2(vUv.x * 22.0 + uTime * 0.12, vUv.y * 2.0 + uHue * 9.0));
          float stripes = 0.55 + 0.45 * sin(vUv.x * 90.0 + n * 9.0 + uTime * 0.6);
          float vert = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
          float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
          vec3 teal = vec3(0.15, 0.95, 0.65);
          vec3 gold = vec3(0.95, 0.75, 0.30);
          vec3 violet = vec3(0.45, 0.35, 0.9);
          vec3 col = mix(teal, gold, uHue);
          col = mix(col, violet, pow(vUv.y, 2.0) * 0.6);
          float a = vert * edge * stripes * (0.16 + n * 0.22);
          gl_FragColor = vec4(col * 1.6, a);
        }`,
    });
    const geo = new THREE.PlaneGeometry(len, 26, 140, 1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, y, z);
    mesh.rotation.set(-0.5, rotY, rotZ);
    group.add(mesh);
    uniformsList.push(uniforms);
  };

  mkRibbon(24, -48, 0.15, 0.10, 0.0, 300);
  mkRibbon(32, -30, -0.5, -0.14, 0.55, 260);
  mkRibbon(18, -85, 0.7, 0.06, 0.25, 360);
  scene.add(group);
  return { group, uniformsList };
}

// ---------------- 地面 ----------------

function groundTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#221e27'; ctx.fillRect(0, 0, 1024, 1024);
  // 石板环
  for (let r = 80; r < 520; r += 56) {
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(512, 512, r, 0, Math.PI * 2); ctx.stroke();
    const n = Math.floor(r / 7);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      ctx.beginPath();
      ctx.moveTo(512 + Math.cos(a) * r, 512 + Math.sin(a) * r);
      ctx.lineTo(512 + Math.cos(a) * (r + 56), 512 + Math.sin(a) * (r + 56));
      ctx.stroke();
    }
  }
  // 裂纹
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.6;
  for (let i = 0; i < 14; i++) {
    let x = Math.random() * 1024, y = Math.random() * 1024;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) {
      x += (Math.random() - 0.5) * 120; y += (Math.random() - 0.5) * 120;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // 金色法环 + 四花色
  ctx.strokeStyle = 'rgba(201,164,92,0.55)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(512, 512, 452, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(512, 512, 430, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(201,164,92,0.4)';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const suits = ['♠', '♥', '♦', '♣'];
  suits.forEach((s, i) => {
    const a = i * Math.PI / 2 + Math.PI / 4;
    ctx.save();
    ctx.translate(512 + Math.cos(a) * 441, 512 + Math.sin(a) * 441);
    ctx.rotate(a + Math.PI / 2);
    ctx.font = '44px Georgia, serif';
    ctx.fillText(s, 0, 0);
    ctx.restore();
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildGround(scene) {
  const stone = new THREE.Mesh(
    new THREE.CircleGeometry(9.5, 64),
    new THREE.MeshStandardMaterial({ map: groundTexture(), roughness: 0.92, metalness: 0.04 })
  );
  stone.rotation.x = -Math.PI / 2;
  stone.receiveShadow = true;
  scene.add(stone);

  const desert = new THREE.Mesh(
    new THREE.CircleGeometry(320, 40),
    new THREE.MeshStandardMaterial({ color: 0x191521, roughness: 1 })
  );
  desert.rotation.x = -Math.PI / 2;
  desert.position.y = -0.04;
  scene.add(desert);
}

// ---------------- 遗迹与图腾 ----------------

const stoneMat = new THREE.MeshStandardMaterial({ color: 0x565060, roughness: 0.9 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x232030, roughness: 0.95 });

function buildRuins(scene) {
  const g = new THREE.Group();
  // 立柱环(部分断裂、倾斜)
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.22;
    const r = 6.4 + (i % 2) * 1.4;
    const broken = i % 3 === 0;
    const h = broken ? 2.2 + (i % 2) : 7 + (i % 2) * 1.6;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, h, 12), stoneMat);
    col.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
    col.rotation.z = broken ? (Math.random() - 0.5) * 0.22 : (Math.random() - 0.5) * 0.05;
    col.castShadow = true;
    g.add(col);
    if (!broken) {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.34, 1.2), stoneMat);
      cap.position.set(Math.cos(a) * r, h + 0.17, Math.sin(a) * r);
      cap.rotation.y = a;
      g.add(cap);
    }
  }
  // 倒柱
  const fallen = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 5.2, 12), stoneMat);
  fallen.position.set(4.6, 0.45, 3.4);
  fallen.rotation.set(Math.PI / 2, 0, 0.8);
  fallen.castShadow = true;
  g.add(fallen);

  // 远处残城剪影
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.1 * i;
    const r = 70 + (i % 5) * 14;
    const h = 10 + ((i * 37) % 26);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(6 + (i % 3) * 3, h, 6), darkMat);
    tower.position.set(Math.cos(a) * r, h / 2 - 0.5, Math.sin(a) * r);
    tower.rotation.y = a;
    g.add(tower);
  }
  // 断裂的轮盘剪影
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(16, 1.6, 8, 40, Math.PI * 1.35), darkMat);
  wheel.position.set(-60, 4, -80);
  wheel.rotation.set(0.3, 0.5, 1.2);
  g.add(wheel);

  scene.add(g);
}

// 巨牌图腾:半埋的巨型扑克,花色发光
function glyphTexture(suit, color) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 360;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 256, 360);
  ctx.shadowColor = color; ctx.shadowBlur = 34;
  ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '230px Georgia, serif';
  ctx.fillText(suit, 128, 190);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildMonoliths(scene) {
  const defs = [
    { suit: '♠', color: '#7fd8c0', a: -0.5, r: 26, h: 13, tilt: 0.12 },
    { suit: '♥', color: '#e06a80', a: -1.6, r: 34, h: 16, tilt: -0.1 },
    { suit: '♦', color: '#e8b46a', a: 1.2, r: 30, h: 12, tilt: 0.2 },
    { suit: '♣', color: '#8fa8e8', a: 2.4, r: 40, h: 18, tilt: -0.16 },
    { suit: '♠', color: '#7fd8c0', a: 3.4, r: 48, h: 22, tilt: 0.06 },
  ];
  for (const d of defs) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(d.h * 0.7, d.h, 0.7), darkMat);
    const x = Math.cos(d.a) * d.r, z = Math.sin(d.a) * d.r;
    slab.position.set(x, d.h / 2 - d.h * 0.12, z);
    slab.rotation.set(0, -d.a + Math.PI / 2 + (Math.random() - 0.5) * 0.4, d.tilt);
    slab.castShadow = true;
    scene.add(slab);

    const glyph = new THREE.Mesh(
      new THREE.PlaneGeometry(d.h * 0.5, d.h * 0.7),
      new THREE.MeshBasicMaterial({
        map: glyphTexture(d.suit, d.color), transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      })
    );
    glyph.position.copy(slab.position);
    glyph.rotation.copy(slab.rotation);
    glyph.translateZ(0.42);
    scene.add(glyph);
  }
}

// ---------------- 火焰粒子(着色器驱动) ----------------

export function makeFlame({ colA, colB, height = 1, radius = 1, size = 1, dir = 1, count = 70 }) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) seed[i] = Math.random();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const uniforms = {
    uTime: { value: 0 },
    uOn: { value: 1 },
    uColA: { value: new THREE.Color(colA) },
    uColB: { value: new THREE.Color(colB) },
    uH: { value: height }, uR: { value: radius }, uS: { value: size }, uDir: { value: dir },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSeed;
      uniform float uTime, uH, uR, uS, uDir;
      varying float vLife;
      void main(){
        float sp = 0.30 + fract(aSeed * 7.13) * 0.35;
        float life = fract(uTime * sp + aSeed * 9.0);
        vLife = life;
        vec3 p = position;
        float rr = (1.0 - life) * 0.20 * uR;
        p.x += sin(uTime * 2.2 + aSeed * 40.0) * rr;
        p.z += cos(uTime * 1.8 + aSeed * 31.0) * rr;
        p.y += life * uH * uDir;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.0 - life * 0.75) * uS * (8.0 + fract(aSeed * 3.7) * 8.0) * (2.2 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColA, uColB;
      uniform float uOn;
      varying float vLife;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d) * (1.0 - vLife) * smoothstep(0.0, 0.10, vLife) * uOn;
        gl_FragColor = vec4(mix(uColA, uColB, vLife) * 1.7, a * 0.8);
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return { pts, uniforms };
}

function buildBraziers(scene, flameUniforms) {
  const iron = new THREE.MeshStandardMaterial({ color: 0x1c1a22, roughness: 0.6, metalness: 0.7 });
  for (const sx of [-1, 1]) {
    const g = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.22, 0.4, 14), iron);
    bowl.position.y = 1.05;
    g.add(bowl);
    for (let i = 0; i < 3; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.15, 6), iron);
      const a = i / 3 * Math.PI * 2;
      leg.position.set(Math.cos(a) * 0.3, 0.55, Math.sin(a) * 0.3);
      leg.rotation.z = Math.cos(a) * 0.25;
      leg.rotation.x = -Math.sin(a) * 0.25;
      g.add(leg);
    }
    const coals = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 14),
      new THREE.MeshBasicMaterial({ color: 0xff5a1a })
    );
    coals.rotation.x = -Math.PI / 2;
    coals.position.y = 1.22;
    g.add(coals);

    const flame = makeFlame({ colA: 0xffb03a, colB: 0xff3a08, height: 1.5, radius: 1.6, size: 1.5, count: 80 });
    flame.pts.position.y = 1.22;
    g.add(flame.pts);
    flameUniforms.push(flame.uniforms);

    const light = new THREE.PointLight(0xff8046, 6, 14, 2);
    light.position.y = 1.5;
    g.add(light);
    g.userData.light = light;

    g.position.set(sx * 2.7, 0, -3.4);
    g.traverse(m => { if (m.isMesh) m.castShadow = false; });
    scene.add(g);
  }
}

// ---------------- 总装 ----------------

export function buildWorld(scene) {
  scene.fog = new THREE.FogExp2(0x1c1830, 0.013);

  const sky = buildSky(scene);
  const aurora = buildAurora(scene);
  buildGround(scene);
  buildRuins(scene);
  buildMonoliths(scene);

  // 灯光
  const hemi = new THREE.HemisphereLight(0x35406e, 0x0f0b12, 0.5);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xff8a5c, 0.9);
  sun.position.set(-5, 2.2, -26);
  scene.add(sun);

  const spot = new THREE.SpotLight(0xffc285, 30, 0, 0.62, 0.75, 2);
  spot.position.set(0, 4.8, 1.2);
  spot.target.position.set(0, 0.78, -0.1);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0006;
  spot.shadow.camera.near = 1;
  spot.shadow.camera.far = 12;
  scene.add(spot, spot.target);

  // 傀儡的轮廓光:冷色,从玩家肩后打向对面
  const rim = new THREE.SpotLight(0x8fa8d8, 18, 0, 0.34, 0.7, 2);
  rim.position.set(0, 3.1, 2.6);
  rim.target.position.set(0, 1.35, -1.66);
  scene.add(rim, rim.target);

  const flameUniforms = [];
  buildBraziers(scene, flameUniforms);

  // 桌面上光的尘埃(缓慢下落)
  const dust = makeFlame({ colA: 0x8f9fd8, colB: 0x8f9fd8, height: 3.2, radius: 5.5, size: 1.1, dir: -1, count: 160 });
  dust.pts.position.set(0, 4.0, 0.2);
  dust.uniforms.uOn.value = 0.35;
  scene.add(dust.pts);

  // 地面雾团
  const mistTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, 'rgba(150,160,210,0.16)');
    g.addColorStop(1, 'rgba(150,160,210,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const mists = [];
  for (let i = 0; i < 9; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: mistTex, transparent: true, depthWrite: false, opacity: 0.55,
    }));
    const a = Math.random() * Math.PI * 2, r = 2.5 + Math.random() * 6;
    sp.position.set(Math.cos(a) * r, 0.35 + Math.random() * 0.4, Math.sin(a) * r);
    const s = 5 + Math.random() * 6;
    sp.scale.set(s, s * 0.4, 1);
    sp.userData = { a, r, sp: 0.02 + Math.random() * 0.03 };
    scene.add(sp);
    mists.push(sp);
  }

  let t = 0;
  return {
    update(dt) {
      t += dt;
      sky.uniforms.uTime.value = t;
      for (const u of aurora.uniformsList) u.uTime.value = t;
      for (const u of flameUniforms) u.uTime.value = t;
      dust.uniforms.uTime.value = t;
      for (const m of mists) {
        m.userData.a += m.userData.sp * dt;
        m.position.x = Math.cos(m.userData.a) * m.userData.r;
        m.position.z = Math.sin(m.userData.a) * m.userData.r;
      }
    },
  };
}
