//src/components/three/HeroScene.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { buildJeep } from "./models";

const { clamp, lerp, smoothstep } = THREE.MathUtils;

/* ───────────────────────── quality tiers ─────────────────────────
   0 = low (weak phones, 30fps cap), 1 = medium (phones/tablets),
   2 = high (desktop). The scene also steps itself down at runtime if it
   measures slow frames, so a weak device never stays laggy. */
const PIXEL_CAP = [1, 1.25, 1.5];
const MIST_COUNT = [0, 22, 60];
const TREE_COUNT = [150, 260, 420];
const TERRAIN_SEGMENTS = [
  [100, 110],
  [130, 144],
  [180, 196],
];

function detectQuality() {
  const nav = navigator;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;
  const weak =
    (nav.hardwareConcurrency || 8) <= 4 ||
    (nav.deviceMemory || 8) <= 4 ||
    Boolean(nav.connection && nav.connection.saveData);
  if (weak && (coarse || narrow)) return 0;
  if (coarse || narrow || weak) return 1;
  return 2;
}

/* ───────────────────────── terrain math ─────────────────────────
   One deterministic height function is shared by the mesh, the trees
   and the jeep so everything sits exactly on the ground. */

const roadRaw = (z) => Math.sin(z * 0.05) * 6 + Math.sin(z * 0.013 + 0.6) * 9;
const ROAD_OFFSET = roadRaw(28);
const roadX = (z) => roadRaw(z) - ROAD_OFFSET;
const roadH = (z) => Math.sin(z * 0.04) * 1.2 - 0.4;

function terrainHeight(x, z) {
  const d = Math.abs(x - roadX(z));
  const rolling =
    Math.sin(x * 0.085 + 1.3) * Math.cos(z * 0.07) * 4.5 +
    Math.sin(x * 0.045 + z * 0.038) * 6 +
    Math.sin(x * 0.21) * Math.cos(z * 0.17) * 1.3 +
    Math.sin(x * 0.52 + z * 0.37) * 0.28;

  const tf = clamp((-z - 30) / 160, 0, 1);
  const far = tf * tf * (3 - 2 * tf);
  const mountains =
    far * 34 * (0.65 + 0.35 * Math.sin(x * 0.035 + 2) + 0.15 * Math.sin(x * 0.11));

  const side = smoothstep(d, 2.4, 11);
  return roadH(z) * (1 - side) + (rolling + 4 + mountains) * side;
}

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

/* ───────────────────────── builders ───────────────────────── */

function buildTerrain(segments) {
  const rand = mulberry32(7);
  const geo = new THREE.PlaneGeometry(220, 240, segments[0], segments[1]);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -80);

  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  const cLow = new THREE.Color(0x2a6b3a);
  const cMid = new THREE.Color(0x62b24f);
  const cHigh = new THREE.Color(0xb4d46a);
  const cRoad = new THREE.Color(0xb98d58);
  const cRock = new THREE.Color(0x6b7c6a);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = terrainHeight(x, z);
    pos.setY(i, h);

    const d = Math.abs(x - roadX(z));
    const hn = clamp((h + 2) / 14, 0, 1);

    c.copy(cLow)
      .lerp(cMid, smoothstep(hn, 0, 0.55))
      .lerp(cHigh, smoothstep(hn, 0.5, 1));
    // contour banding reads like terraced tea slopes
    c.offsetHSL(0, 0, Math.sin(h * 2.6) * 0.045 + (rand() - 0.5) * 0.03);
    c.lerp(cRock, smoothstep(h, 18, 30) * 0.7);
    c.lerp(cRoad, 1 - smoothstep(d, 1.4, 2.6));

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshLambertMaterial({
    vertexColors: true,
    flatShading: true,
  });
  return new THREE.Mesh(geo, mat);
}

function buildTrees(MAX) {
  const rand = mulberry32(21);
  const geo = new THREE.ConeGeometry(0.9, 3.4, 6);
  geo.translate(0, 1.7, 0);
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, MAX);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const col = new THREE.Color();
  let n = 0;

  for (let tries = 0; tries < 6000 && n < MAX; tries++) {
    const x = (rand() - 0.5) * 170;
    const z = 10 - rand() * 130; // keep clear of the camera
    const d = Math.abs(x - roadX(z));
    if (d < 6) continue;
    const h = terrainHeight(x, z);
    if (h < 1 || h > 15) continue;
    if (rand() > 0.5) continue;

    const k = 0.45 + rand() * 0.6;
    p.set(x, h - 0.1, z);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI);
    s.set(k, k * (0.9 + rand() * 0.5), k);
    m.compose(p, q, s);
    mesh.setMatrixAt(n, m);
    col.setHSL(0.36 + rand() * 0.05, 0.5, 0.2 + rand() * 0.08);
    mesh.setColorAt(n, col);
    n++;
  }
  mesh.count = n;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

function makeGlowTexture(stops) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#16324a");
  grad.addColorStop(0.14, "#5f8497");
  grad.addColorStop(0.3, "#f0cfa0");
  grad.addColorStop(1, "#f0cfa0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ───────────────────────── component ───────────────────────── */

export default function HeroScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let level = detectQuality();

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: level === 2, // MSAA is the costly part on phone GPUs
        alpha: false,
        powerPreference: level === 2 ? "high-performance" : "default",
      });
    } catch {
      return undefined; // no WebGL → CSS gradient fallback stays visible
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = renderer.domElement;
    canvas.className = "block h-full w-full";
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.4s ease";
    canvas.setAttribute("aria-hidden", "true");
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const skyTex = makeSkyTexture();
    scene.background = skyTex;
    scene.fog = new THREE.Fog(0xf0cfa0, 22, 170);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 400);
    const base = { x: -3.5, y: 9.5, z: 30 };
    camera.position.set(base.x, base.y, base.z);
    const lookAtTarget = new THREE.Vector3(roadX(-45) * 0.6, 5, -45);

    // lights
    const hemi = new THREE.HemisphereLight(0xfff0d8, 0x3f7a4c, 1.55);
    const sun = new THREE.DirectionalLight(0xffc98a, 2.8);
    sun.position.set(45, 28, 10);
    scene.add(hemi, sun);

    // world
    const terrain = buildTerrain(TERRAIN_SEGMENTS[level]);
    const trees = buildTrees(TREE_COUNT[level]);
    scene.add(terrain, trees);

    // sun glow, placed behind the far ridge so terrain occludes it
    const sunTex = makeGlowTexture([
      [0, "rgba(255,248,220,1)"],
      [0.12, "rgba(255,226,160,0.95)"],
      [0.35, "rgba(255,190,110,0.35)"],
      [1, "rgba(255,170,90,0)"],
    ]);
    const sunMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshBasicMaterial({
        map: sunTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    );
    sunMesh.position.set(34, 36, -196);
    scene.add(sunMesh);

    // drifting mist
    const mistTex = makeGlowTexture([
      [0, "rgba(255,255,255,0.9)"],
      [0.5, "rgba(255,255,255,0.35)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    const MIST = MIST_COUNT[2]; // allocate the max; drawRange limits it per tier
    const mistGeo = new THREE.BufferGeometry();
    const mistPos = new Float32Array(MIST * 3);
    const mistSpeed = new Float32Array(MIST);
    const rnd = mulberry32(99);
    for (let i = 0; i < MIST; i++) {
      mistPos[i * 3] = (rnd() - 0.5) * 150;
      mistPos[i * 3 + 1] = 2 + rnd() * 14;
      mistPos[i * 3 + 2] = 20 - rnd() * 140;
      mistSpeed[i] = 0.4 + rnd() * 0.9;
    }
    mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      map: mistTex,
      size: 26,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      color: 0xfff1dc,
    });
    const mist = new THREE.Points(mistGeo, mistMat);
    scene.add(mist);

    // quality can step down at runtime; this applies a level to everything tunable
    const applyLevel = () => {
      mist.visible = MIST_COUNT[level] > 0;
      mistGeo.setDrawRange(0, MIST_COUNT[level]);
      resize();
    };

    // jeep
    const jeep = buildJeep();
    jeep.rotation.order = "YXZ";
    scene.add(jeep);
    const JEEP_START = 8;
    const JEEP_END = -104;
    let jz = reduceMotion ? -6 : JEEP_START;

    const placeJeep = (t) => {
      const ahead = jz - 1.8;
      const behind = jz + 1.8;
      const yC = terrainHeight(roadX(jz), jz);
      const yF = terrainHeight(roadX(ahead), ahead);
      const yB = terrainHeight(roadX(behind), behind);
      const dx = roadX(ahead) - roadX(behind);
      const dz = ahead - behind; // negative: moving toward -z
      jeep.position.set(roadX(jz), yC + 0.05, jz);
      jeep.rotation.y = Math.atan2(-dx, -dz);
      jeep.rotation.x = Math.atan2(yF - yB, 3.6);
      jeep.rotation.z = Math.sin(t * 5.3) * 0.015;
      jeep.position.y += Math.abs(Math.sin(t * 9)) * 0.03;

      const travelled = JEEP_START - jz;
      const sIn = smoothstep(travelled, 0, 5);
      const sOut = 1 - smoothstep(travelled, 92, 110);
      jeep.scale.setScalar(Math.max(0.0001, 1.25 * sIn * sOut));
    };
    placeJeep(0);

    // sizing
    let shiftX = 0; // on wide screens push the road to the right, away from the headline
    let lookY = lookAtTarget.y; // on tall phones tilt down so the scene sits above the text
    let lastW = 0;
    let lastH = 0;
    let lastPR = 0;
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const pr = Math.min(window.devicePixelRatio || 1, PIXEL_CAP[level]);
      // phone browsers resize the hero every time the URL bar slides; skip no-op resizes
      if (w !== lastW || h !== lastH || pr !== lastPR) {
        lastW = w;
        lastH = h;
        lastPR = pr;
        renderer.setPixelRatio(pr);
        renderer.setSize(w, h, false);
      }
      const aspect = w / h;
      camera.aspect = aspect;
      camera.fov = aspect < 0.9 ? 74 : aspect < 1.4 ? 58 : 48;
      camera.updateProjectionMatrix();
      shiftX = aspect > 1.3 ? 20 : 0;
      lookY = aspect < 0.9 ? -14 : lookAtTarget.y;
    };
    applyLevel();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) {
        camera.lookAt(lookAtTarget.x - shiftX, lookY, lookAtTarget.z);
        renderer.render(scene, camera);
      }
    });
    ro.observe(mount);

    // pointer parallax
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // only render while visible
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    const timer = new THREE.Timer();
    let t = 0;
    let raf = 0;
    let revealed = false;

    const reveal = () => {
      if (!revealed) {
        revealed = true;
        canvas.style.opacity = "1";
      }
    };

    // runtime frame-time monitor: if the device can't keep up, drop a quality tier
    let warmup = 30; // ignore shader-compile / first-upload frames
    let sampleSum = 0;
    let sampleCount = 0;
    let skipFrame = false;
    const SLOW_MS = 24; // average above this ≈ under 42fps
    const SAMPLE_FRAMES = 40;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        warmup = Math.max(warmup, 8); // re-measure after coming back
        sampleSum = 0;
        sampleCount = 0;
        return;
      }
      if (level === 0) {
        skipFrame = !skipFrame; // lowest tier renders at half rate
        if (skipFrame) return;
      }
      timer.update();
      const rawDt = timer.getDelta();
      const dt = Math.min(rawDt, 0.05);
      t += dt;

      if (warmup > 0) {
        warmup -= 1;
      } else if (level > 0 && rawDt < 0.5) {
        sampleSum += rawDt * 1000;
        sampleCount += 1;
        if (sampleCount >= SAMPLE_FRAMES) {
          if (sampleSum / sampleCount > SLOW_MS) {
            level -= 1;
            applyLevel();
            warmup = 10;
          }
          sampleSum = 0;
          sampleCount = 0;
        }
      }

      pointer.sx = lerp(pointer.sx, pointer.x, 0.04);
      pointer.sy = lerp(pointer.sy, pointer.y, 0.04);
      const scroll = Math.min(window.scrollY, 900);

      camera.position.x = base.x + Math.sin(t * 0.12) * 1.6 + pointer.sx * 2.4;
      camera.position.y = base.y + Math.sin(t * 0.09) * 0.45 - pointer.sy * 0.7;
      camera.position.z = base.z - scroll * 0.014;
      camera.lookAt(lookAtTarget.x - shiftX + pointer.sx * 2.2, lookY, lookAtTarget.z);

      jz -= 2.9 * dt;
      if (jz < JEEP_END) jz = JEEP_START;
      placeJeep(t);
      const spin = dt * 7;
      jeep.userData.wheels.forEach((w) => (w.rotation.x -= spin));

      const mistN = MIST_COUNT[level];
      if (mistN > 0) {
        const arr = mistGeo.attributes.position.array;
        for (let i = 0; i < mistN; i++) {
          arr[i * 3] += mistSpeed[i] * dt;
          if (arr[i * 3] > 80) arr[i * 3] = -80;
        }
        mistGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      reveal();
    };

    if (reduceMotion) {
      camera.lookAt(lookAtTarget.x - shiftX, lookY, lookAtTarget.z);
      renderer.render(scene, camera);
      reveal();
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      skyTex.dispose();
      sunTex.dispose();
      mistTex.dispose();
      renderer.dispose();
      renderer.forceContextLoss(); // release the GPU context (matters with React StrictMode / route changes)
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        // fallback if WebGL is unavailable or still loading
        background:
          "linear-gradient(to bottom, #16324a 0%, #5f8497 14%, #f0cfa0 34%, #3f8a3f 62%, #1a4d2e 100%)",
      }}
    />
  );
}
