//src/components/three/dioramas.js
import * as THREE from "three";

import { buildJeep } from "./models";

/* Three tiny floating "worlds" for the home page photo frames, built only from
   primitives (no model files). Each builder returns:
     root   – THREE.Group sitting on y = 0 (island top)
     update – (time, dt) animation callback
     light  – lighting mood
   plus framing (radius / centerY), the CSS sky and the starting camera angle. */

const lam = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const { smoothstep } = THREE.MathUtils;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, "0.45)"));
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* floating chunk of land: grass cap, soil, rock point */
function island(R, { grass = 0x5fa653, soil = 0x7a5a3a, rock = 0x5d6560 } = {}) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.98, 0.4, 44), lam(grass));
  top.position.y = -0.2;
  const dirt = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.98, R * 0.62, 0.9, 16), lam(soil));
  dirt.position.y = -0.85;
  const stone = new THREE.Mesh(new THREE.ConeGeometry(R * 0.62, 1.9, 9), lam(rock));
  stone.rotation.x = Math.PI;
  stone.position.y = -2.25;
  g.add(top, dirt, stone);
  return g;
}

function limb(a, b, r, mat) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

function pine(s = 1) {
  const p = new THREE.Group();
  const add = (geo, mat, y) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y;
    p.add(m);
  };
  add(new THREE.CylinderGeometry(0.08, 0.12, 0.45, 6), lam(0x5a3a24), 0.22);
  add(new THREE.ConeGeometry(0.62, 1.1, 7), lam(0x2f7a4f), 0.95);
  add(new THREE.ConeGeometry(0.48, 0.9, 7), lam(0x1d5a3a), 1.5);
  add(new THREE.ConeGeometry(0.33, 0.7, 7), lam(0x2f7a4f), 1.98);
  p.scale.setScalar(s);
  return p;
}

const placeAt = (obj, x, y, z) => {
  obj.position.set(x, y, z);
  return obj;
};

function person({ skin, hair, top, bottom, dress = false, longHair = false }) {
  const g = new THREE.Group();
  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  if (dress) add(new THREE.ConeGeometry(0.42, 1.0, 10), lam(bottom), 0, 0.5, 0);
  else {
    add(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 8), lam(bottom), -0.1, 0.43, 0);
    add(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 8), lam(bottom), 0.1, 0.43, 0);
  }
  add(new THREE.CylinderGeometry(0.2, 0.25, 0.55, 8), lam(top), 0, 1.22, 0);
  add(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 6), lam(skin), 0, 1.54, 0);
  add(new THREE.SphereGeometry(0.2, 12, 10), lam(skin), 0, 1.78, 0);
  add(new THREE.SphereGeometry(0.215, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.58), lam(hair), 0, 1.8, -0.02);
  if (longHair) add(new THREE.SphereGeometry(0.22, 10, 8), lam(hair), 0, 1.66, -0.09).scale.set(1, 1.35, 0.8);
  const eye = basic(0x1a1a1a);
  [-0.07, 0.07].forEach((x) => add(new THREE.SphereGeometry(0.026, 6, 6), eye, x, 1.8, 0.185));
  return g;
}

function heartGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0.25, 0.25);
  s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
  s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
  s.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
  s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
  s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
  s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 2,
  });
  geo.translate(-0.25, -0.47, -0.09);
  return geo;
}

/* ─────────────────────── 1. couple at golden hour ─────────────────────── */
function buildCouple() {
  const R = 3.3;
  const root = new THREE.Group();
  root.add(island(R, { grass: 0x68a84f }));

  // tea rows
  const rows = [];
  for (let r = 0; r < 5; r++) {
    const z = -0.95 - r * 0.5;
    for (let x = -2.8; x <= 2.8; x += 0.42) {
      if (Math.hypot(x, z) < R - 0.4) rows.push([x, z, r]);
    }
  }
  const tea = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.24, 7, 5),
    new THREE.MeshLambertMaterial({ flatShading: true }),
    rows.length,
  );
  const m4 = new THREE.Matrix4();
  const col = new THREE.Color();
  rows.forEach(([x, z, r], i) => {
    m4.compose(
      new THREE.Vector3(x, 0.08, z),
      new THREE.Quaternion(),
      new THREE.Vector3(1.1, 0.62, 1.1),
    );
    tea.setMatrixAt(i, m4);
    tea.setColorAt(i, col.set(r % 2 ? 0x2f7a3f : 0x3f9a4a));
  });
  root.add(tea);

  // the couple
  const man = person({ skin: 0xc58c5e, hair: 0x241a14, top: 0x2f6fa5, bottom: 0x2b3340 });
  const woman = person({ skin: 0xd09a70, hair: 0x2a1a14, top: 0xe8c9a0, bottom: 0xb3382c, dress: true, longHair: true });
  man.position.set(-0.42, 0, 0.3);
  man.scale.setScalar(1.08);
  woman.position.set(0.42, 0, 0.3);
  root.add(man, woman);

  const sleeveM = lam(0x2f6fa5);
  const sleeveW = lam(0xe8c9a0);
  const hand = new THREE.Vector3(0, 1.0, 0.44);
  root.add(limb(new THREE.Vector3(-0.2, 1.42, 0.3), hand, 0.055, sleeveM));
  root.add(limb(new THREE.Vector3(0.2, 1.38, 0.3), hand, 0.05, sleeveW));
  root.add(limb(new THREE.Vector3(-0.68, 1.42, 0.3), new THREE.Vector3(-0.78, 0.82, 0.33), 0.055, sleeveM));
  root.add(limb(new THREE.Vector3(0.66, 1.38, 0.3), new THREE.Vector3(0.74, 0.86, 0.33), 0.05, sleeveW));
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), lam(0xc58c5e));
  knot.position.copy(hand);
  root.add(knot);

  // floating heart
  const heart = new THREE.Mesh(
    heartGeometry(),
    new THREE.MeshLambertMaterial({ color: 0xff5c8a, emissive: 0x7a1d3a, flatShading: true }),
  );
  heart.scale.setScalar(0.85);
  root.add(heart);

  // photographer's tripod + camera, with a little flash
  const tri = new THREE.Group();
  const legMat = lam(0x1a1d1c);
  const top = new THREE.Vector3(0, 1.15, 0);
  [0, 2.1, 4.2].forEach((a) =>
    tri.add(limb(top, new THREE.Vector3(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4), 0.025, legMat)),
  );
  const cam = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.28), lam(0x262a28));
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.26, 12).rotateX(Math.PI / 2), lam(0x161918));
  lens.position.z = 0.22;
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.075, 12), basic(0x2e5f9a));
  glass.position.z = 0.355;
  const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.28), lam(0xcfd3d0));
  topPlate.position.y = 0.17;
  cam.add(body, lens, glass, topPlate);
  cam.position.y = 1.3;
  tri.add(cam);
  tri.position.set(2.0, 0, 1.35);
  tri.lookAt(0, 0, 0.3);
  root.add(tri);
  const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), basic(0xffffff, { transparent: true, opacity: 0.9 }));
  flash.position.set(0, 1.5, 0.35);
  cam.add(flash);

  // wildflowers
  const rnd = mulberry32(7);
  const flowerMat = [0xff8fb1, 0xffd166, 0xffffff].map((c) => lam(c));
  for (let i = 0; i < 16; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 1.1 + rnd() * 1.8;
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    if (z < -0.6 || Math.hypot(x, z) > R - 0.3) continue;
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), flowerMat[i % 3]);
    f.position.set(x, 0.07, z);
    root.add(f);
  }
  root.add(placeAt(pine(0.85), -2.3, 0, 0.7));
  root.add(placeAt(pine(0.65), -1.7, 0, 1.9));

  // glowing sun + bokeh sparkles
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), basic(0xffd08a));
  sun.position.set(-1.7, 3.5, -1.8);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture("rgba(255,200,130,1)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
  );
  halo.scale.setScalar(3.4);
  halo.position.copy(sun.position);
  root.add(sun, halo);

  const N = 26;
  const base = [];
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 0.8 + rnd() * 2.4;
    base.push([Math.cos(a) * d, 0.4 + rnd() * 2.8, Math.sin(a) * d, rnd() * 6]);
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const sparks = new THREE.Points(
    sparkGeo,
    new THREE.PointsMaterial({
      size: 0.28,
      map: glowTexture("rgba(255,225,170,1)"),
      color: 0xffe2aa,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  sparks.frustumCulled = false;
  root.add(sparks);

  const update = (t) => {
    heart.position.set(0, 2.85 + Math.sin(t * 1.8) * 0.1, 0.3);
    heart.rotation.y = t * 0.9;
    heart.scale.setScalar(0.85 + Math.sin(t * 3.2) * 0.04);
    man.rotation.z = Math.sin(t * 1.3) * 0.015;
    woman.rotation.z = Math.sin(t * 1.3 + 1) * 0.015;
    const f = (t % 4.6) / 4.6;
    flash.scale.setScalar(f < 0.04 ? 0.32 * (1 - f / 0.04) : 0.0001);
    for (let i = 0; i < N; i++) {
      const [bx, by, bz, ph] = base[i];
      pos[i * 3] = bx + Math.sin(t * 0.5 + ph) * 0.18;
      pos[i * 3 + 1] = 0.3 + ((by + t * 0.18 + ph) % 3.2);
      pos[i * 3 + 2] = bz + Math.cos(t * 0.45 + ph) * 0.18;
    }
    sparkGeo.attributes.position.needsUpdate = true;
  };

  return {
    root,
    update,
    light: { sky: 0xffe2c0, ground: 0x7a5a3a, hemi: 1.25, sun: 0xffb36b, sunI: 2.7, pos: [-4, 5, 4] },
  };
}

/* ─────────────────────── 2. tea-terrace hill view ─────────────────────── */
function buildHills() {
  const R = 3.3;
  const root = new THREE.Group();
  root.add(island(R, { grass: 0x78b560 }));

  const terraces = (x, z, bottom, steps, h, c1, c2) => {
    const g = new THREE.Group();
    for (let i = 0; i < steps; i++) {
      const r = bottom - i * (bottom / (steps + 0.7));
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r, h, 30), lam(i % 2 ? c1 : c2));
      m.position.y = h / 2 + i * h;
      g.add(m);
    }
    g.position.set(x, 0, z);
    return g;
  };
  const main = terraces(-0.3, -0.25, 2.1, 6, 0.3, 0x3f9a4a, 0x57b055);
  root.add(main);
  root.add(terraces(1.85, 0.9, 1.05, 3, 0.28, 0x2f7a4f, 0x45955e));
  root.add(terraces(-1.9, 1.15, 0.95, 3, 0.26, 0x3f9a4a, 0x57b055));
  const topY = 6 * 0.3;

  // viewpoint deck + flag on the summit
  const wood = lam(0x8a5a34);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.7), wood);
  deck.position.set(-0.3, topY + 0.04, -0.25);
  root.add(deck);
  [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach(([dx, dz]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 5), wood);
    p.position.set(-0.3 + dx, topY + 0.2, -0.25 + dz);
    root.add(p);
  });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.025, 0.025), wood);
  rail.position.set(-0.3, topY + 0.33, 0.05);
  root.add(rail);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 5), lam(0xf1e7d0));
  pole.position.set(-0.3, topY + 0.5, -0.45);
  root.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2, 4, 1), lam(0xf4a63a, { side: THREE.DoubleSide }));
  flag.geometry.translate(0.17, 0, 0);
  flag.position.set(-0.3, topY + 0.82, -0.45);
  root.add(flag);

  // rainbow
  [0xff6b6b, 0xffb84d, 0xf5e663, 0x7bd88f, 0x6bb8ff].forEach((c, i) => {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(1.95 + i * 0.075, 0.035, 6, 40, Math.PI),
      basic(c, { transparent: true, opacity: 0.6 }),
    );
    arc.position.set(0.15, 0, -2.1);
    root.add(arc);
  });

  // pines + sun
  const rnd = mulberry32(11);
  [[2.35, -0.9, 0.7], [-2.5, -0.7, 0.8], [2.55, 0.1, 0.55], [-2.55, 0.5, 0.6], [0.9, 2.45, 0.6], [-0.9, 2.6, 0.5]].forEach(
    ([x, z, s]) => root.add(placeAt(pine(s), x, 0, z)),
  );
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), basic(0xfff0c0));
  sun.position.set(2.2, 3.7, -1.2);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture("rgba(255,240,190,1)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
  );
  halo.scale.setScalar(3.2);
  halo.position.copy(sun.position);
  root.add(sun, halo);

  // clouds + low mist drifting around the hills
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x9aa7b0, flatShading: true });
  const makeCloud = (scale) => {
    const c = new THREE.Group();
    [[0, 0, 0, 0.5], [0.5, -0.05, 0.1, 0.38], [-0.5, -0.08, -0.05, 0.36], [0.15, 0.2, 0, 0.34]].forEach(([x, y, z, r]) => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), cloudMat);
      m.position.set(x, y, z);
      m.scale.y = 0.8;
      c.add(m);
    });
    c.scale.setScalar(scale);
    return c;
  };
  const clouds = [0, 2.1, 4.2].map((phase, i) => {
    const c = makeCloud(0.8 + i * 0.15);
    root.add(c);
    return { c, phase, r: 3.0 + (i % 2) * 0.35, y: 2.6 + i * 0.35 };
  });
  const mistMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, emissive: 0xcfdde0 });
  const mists = [0, 1.6, 3.2, 4.8].map((phase) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.8, 10, 8), mistMat);
    m.scale.set(1.5, 0.28, 1.1);
    root.add(m);
    return { m, phase };
  });

  const update = (t) => {
    clouds.forEach(({ c, phase, r, y }) => {
      const a = t * 0.12 + phase;
      c.position.set(Math.cos(a) * r, y + Math.sin(t * 0.6 + phase) * 0.08, Math.sin(a) * r);
    });
    mists.forEach(({ m, phase }) => {
      const a = -t * 0.07 + phase;
      m.position.set(Math.cos(a) * 2.5, 0.18, Math.sin(a) * 2.5);
    });
    const pos = flag.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(t * 5 + x * 9) * 0.04 * (x / 0.34));
    }
    pos.needsUpdate = true;
  };

  return {
    root,
    update,
    light: { sky: 0xdff0ff, ground: 0x4f8a5a, hemi: 1.5, sun: 0xfff4dd, sunI: 2.3, pos: [4, 7, 3] },
  };
}

/* ─────────────────────── 3. winding hill road ─────────────────────── */
function ribbon(curve, width, y, n, material) {
  const pos = [];
  const idx = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = curve.getPointAt(t);
    const d = curve.getTangentAt(t);
    const len = Math.hypot(d.x, d.z) || 1;
    const nx = (-d.z / len) * (width / 2);
    const nz = (d.x / len) * (width / 2);
    pos.push(p.x + nx, y, p.z + nz, p.x - nx, y, p.z - nz);
    if (i < n) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function signTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 112;
  const x = c.getContext("2d");
  x.fillStyle = "#f1e7d0";
  x.fillRect(0, 0, 256, 112);
  x.strokeStyle = "#5a3a24";
  x.lineWidth = 8;
  x.strokeRect(4, 4, 248, 104);
  x.fillStyle = "#1d3a2a";
  x.font = "700 46px system-ui, sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText("MUNNAR", 118, 56);
  x.beginPath();
  x.moveTo(206, 36);
  x.lineTo(238, 56);
  x.lineTo(206, 76);
  x.closePath();
  x.fillStyle = "#d9402a";
  x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildRoad() {
  const R = 3.3;
  const root = new THREE.Group();
  root.add(island(R, { grass: 0x62a653, soil: 0x7a5a3a }));

  const curve = new THREE.CatmullRomCurve3(
    [[2.4, 2.1], [1.0, 1.65], [-0.4, 1.15], [-0.95, 0.25], [0.05, -0.5], [1.0, -1.0], [0.3, -1.7], [-0.6, -2.1]].map(
      ([x, z]) => new THREE.Vector3(x, 0, z),
    ),
    false,
    "catmullrom",
    0.5,
  );
  root.add(ribbon(curve, 0.9, 0.02, 90, lam(0xc9a26a)));
  root.add(ribbon(curve, 0.62, 0.04, 90, lam(0x3a3d3c)));

  // dashed centre line
  const length = curve.getLength();
  const dashes = Math.floor(length / 0.4);
  const dash = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.012, 0.18), basic(0xf1e7d0), dashes);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < dashes; i++) {
    const u = (i + 0.5) / dashes;
    const p = curve.getPointAt(u);
    const d = curve.getTangentAt(u);
    dummy.position.set(p.x, 0.055, p.z);
    dummy.rotation.set(0, Math.atan2(d.x, d.z), 0);
    dummy.updateMatrix();
    dash.setMatrixAt(i, dummy.matrix);
  }
  root.add(dash);

  // scenery, kept clear of the road
  const samples = Array.from({ length: 80 }, (_, i) => curve.getPointAt(i / 79));
  const clearOfRoad = (x, z, gap) => samples.every((p) => Math.hypot(p.x - x, p.z - z) > gap);
  const rnd = mulberry32(23);
  let placed = 0;
  for (let tries = 0; tries < 200 && placed < 16; tries++) {
    const a = rnd() * Math.PI * 2;
    const d = 0.6 + rnd() * 2.5;
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    if (Math.hypot(x, z) > R - 0.35 || z < -2.0 || !clearOfRoad(x, z, 0.85)) continue;
    const p = pine(0.42 + rnd() * 0.3);
    p.position.set(x, 0, z);
    root.add(p);
    placed++;
  }
  // back mountains the road leads to
  const rock = [0x4f7d78, 0x3d6a5c, 0x5b8a80];
  [[-1.0, -2.2, 0.9, 2.4], [0.5, -2.3, 0.8, 1.9], [-2.1, -1.2, 0.7, 1.5], [1.9, -1.5, 0.75, 1.7]].forEach(([x, z, r, h], i) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), lam(rock[i % 3]));
    m.position.set(x, h / 2, z);
    root.add(m);
    const snow = new THREE.Mesh(new THREE.ConeGeometry(r * 0.34, h * 0.26, 6), lam(0xf4f1ea));
    snow.position.set(x, h - h * 0.13, z);
    root.add(snow);
  });

  // signpost
  const sign = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.0, 6), lam(0x5a3a24));
  post.position.y = 0.5;
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.34),
    new THREE.MeshBasicMaterial({ map: signTexture(), side: THREE.DoubleSide }),
  );
  board.position.y = 0.92;
  sign.add(post, board);
  sign.position.set(0.1, 0, 2.15);
  sign.rotation.y = -0.35;
  root.add(sign);

  // the jeep
  const jeep = buildJeep();
  jeep.scale.setScalar(0.2);
  jeep.rotation.order = "YXZ";
  root.add(jeep);

  const update = (t, dt) => {
    const u = (((t * 0.055) % 1) + 1) % 1;
    const p = curve.getPointAt(u);
    const d = curve.getTangentAt(u);
    const fade = smoothstep(u, 0, 0.05) * (1 - smoothstep(u, 0.94, 1));
    jeep.position.set(p.x, 0.05 + Math.abs(Math.sin(t * 9)) * 0.008, p.z);
    jeep.rotation.y = Math.atan2(-d.x, -d.z);
    jeep.rotation.z = Math.sin(t * 5) * 0.02;
    jeep.scale.setScalar(Math.max(0.0001, 0.2 * fade));
    jeep.userData.wheels.forEach((w) => (w.rotation.x -= dt * 7));
  };

  return {
    root,
    update,
    light: { sky: 0xe9f3ff, ground: 0x4a7a4a, hemi: 1.4, sun: 0xffe2b0, sunI: 2.6, pos: [3, 6, 5] },
  };
}

export const DIORAMAS = {
  couple: {
    build: buildCouple,
    caption: "Couple portraits",
    aria: "Interactive 3D scene of a couple holding hands at golden hour, with a photographer's tripod nearby",
    sky: "linear-gradient(180deg,#5b3a6e 0%,#e8795a 58%,#ffc78a 100%)",
    radius: 4.5,
    centerY: 0.3,
    yaw: 0.35,
    pitch: 0.34,
  },
  hills: {
    build: buildHills,
    caption: "Hill views",
    aria: "Interactive 3D scene of a terraced tea hill with a viewpoint, clouds and a rainbow",
    sky: "linear-gradient(180deg,#86c1e3 0%,#d5ebe4 60%,#f3f1d8 100%)",
    radius: 4.5,
    centerY: 0.35,
    yaw: -0.5,
    pitch: 0.4,
  },
  road: {
    build: buildRoad,
    caption: "Winding roads",
    aria: "Interactive 3D scene of a jeep driving along a winding mountain road",
    sky: "linear-gradient(180deg,#27486a 0%,#7fa7a0 58%,#f4d9a0 100%)",
    radius: 4.3,
    centerY: 0.1,
    yaw: 0.6,
    pitch: 0.5,
  },
};
