//src/components/three/PhotoDiorama.jsx
import { useEffect, useRef, useState } from "react";
import { Hand } from "lucide-react";
import * as THREE from "three";

import ScenicArt from "@/components/ScenicArt";

import { DIORAMAS } from "./dioramas";

/**
 * A small floating 3D world you can turn with your finger or mouse
 * (drag to orbit; arrow keys also work). Drawn only while on screen and
 * fully released when scrolled away, so several of them stay light on phones.
 */
export default function PhotoDiorama({ scene = "couple", fallbackScene = "tea" }) {
  const cfg = DIORAMAS[scene] || DIORAMAS.couple;
  const wrapRef = useRef(null);
  const mountRef = useRef(null);
  const touchedRef = useRef(false);
  const [touched, setTouched] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mount = mountRef.current;
    if (!wrap || !mount) return undefined;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameGap = coarse ? 1000 / 30 : 0;

    const ctl = { yaw: cfg.yaw, pitch: cfg.pitch, vyaw: 0, dragging: false, idle: 0, lx: 0, ly: 0 };
    let live = null; // everything that owns GPU memory
    let raf = 0;
    let visible = false;
    let time = 0;
    let lastNow = 0;
    let lastDraw = 0;

    const place = () => {
      const { camera, dist } = live;
      const cp = Math.cos(ctl.pitch);
      camera.position.set(
        Math.sin(ctl.yaw) * cp * dist,
        cfg.centerY + Math.sin(ctl.pitch) * dist,
        Math.cos(ctl.yaw) * cp * dist,
      );
      camera.lookAt(0, cfg.centerY, 0);
    };

    const fit = () => {
      if (!live) return;
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      live.renderer.setSize(w, h, false);
      const { camera } = live;
      camera.aspect = w / h;
      const vfov = THREE.MathUtils.degToRad(camera.fov);
      const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
      live.dist = cfg.radius / Math.sin(Math.min(vfov, hfov) / 2);
      camera.updateProjectionMatrix();
      place();
    };

    const create = () => {
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return false;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.className = "absolute inset-0 block h-full w-full";
      canvas.style.touchAction = "pan-y";
      canvas.setAttribute("aria-hidden", "true");
      mount.appendChild(canvas);

      const scn = new THREE.Scene();
      const built = cfg.build();
      const L = built.light;
      scn.add(new THREE.HemisphereLight(L.sky, L.ground, L.hemi));
      const sun = new THREE.DirectionalLight(L.sun, L.sunI);
      sun.position.set(...L.pos);
      scn.add(sun);
      const rim = new THREE.DirectionalLight(0xa9c8ff, 0.55);
      rim.position.set(-L.pos[0], 3, -L.pos[2]);
      scn.add(rim);

      // soft ground shadow under the floating island
      const sc = document.createElement("canvas");
      sc.width = sc.height = 64;
      const sx = sc.getContext("2d");
      const grad = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(0,0,0,0.55)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sx.fillStyle = grad;
      sx.fillRect(0, 0, 64, 64);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(7, 7).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }),
      );
      shadow.position.y = -3.7;

      const floatGroup = new THREE.Group();
      floatGroup.add(built.root);
      scn.add(floatGroup, shadow);

      live = { renderer, canvas, scn, built, floatGroup, shadow, camera: new THREE.PerspectiveCamera(32, 1, 0.1, 120), dist: 20 };
      fit();
      return true;
    };

    const destroy = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!live) return;
      live.scn.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      live.renderer.dispose();
      live.renderer.forceContextLoss();
      live.canvas.remove();
      live = null;
    };

    const draw = (now) => {
      raf = 0;
      if (!live || !visible) return;
      const keepGoing = !reduceMotion || ctl.dragging || Math.abs(ctl.vyaw) > 0.03;
      if (keepGoing) raf = requestAnimationFrame(draw);
      if (frameGap && now - lastDraw < frameGap) return;
      lastDraw = now;
      const dt = THREE.MathUtils.clamp((now - lastNow) / 1000 || 0.016, 0, 0.1);
      lastNow = now;
      if (!reduceMotion) time += dt;

      if (!ctl.dragging) {
        if (ctl.idle > 2 && !reduceMotion) ctl.yaw += dt * 0.3;
        else {
          ctl.yaw += ctl.vyaw * dt;
          ctl.vyaw *= Math.pow(0.05, dt);
        }
        ctl.idle += dt;
      }

      const bob = Math.sin(time * 1.2) * 0.1;
      live.floatGroup.position.y = bob;
      live.shadow.scale.setScalar(1 - bob * 0.25);
      live.built.update(time, dt);
      place();
      live.renderer.render(live.scn, live.camera);
    };

    const kick = () => {
      if (!raf && live && visible) {
        lastNow = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (!live && !create()) return;
          kick();
        } else {
          destroy();
        }
      },
      { rootMargin: "160px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      if (!live) return;
      fit();
      live.renderer.render(live.scn, live.camera);
    });
    ro.observe(mount);

    const markTouched = () => {
      if (!touchedRef.current) {
        touchedRef.current = true;
        setTouched(true);
      }
    };
    const down = (e) => {
      ctl.dragging = true;
      ctl.idle = 0;
      ctl.vyaw = 0;
      ctl.lx = e.clientX;
      ctl.ly = e.clientY;
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      markTouched();
      kick();
    };
    const move = (e) => {
      if (!ctl.dragging) return;
      const dx = e.clientX - ctl.lx;
      const dy = e.clientY - ctl.ly;
      ctl.lx = e.clientX;
      ctl.ly = e.clientY;
      ctl.yaw -= dx * 0.011;
      ctl.vyaw = THREE.MathUtils.clamp(-dx * 0.011 * 60, -6, 6);
      ctl.pitch = THREE.MathUtils.clamp(ctl.pitch + dy * 0.006, 0.08, 1.05);
      kick();
    };
    const up = () => {
      ctl.dragging = false;
      ctl.idle = 0;
      kick();
    };
    const key = (e) => {
      const step = { ArrowLeft: 0.25, ArrowRight: -0.25 }[e.key];
      const tilt = { ArrowUp: -0.1, ArrowDown: 0.1 }[e.key];
      if (step === undefined && tilt === undefined) return;
      e.preventDefault();
      if (step !== undefined) ctl.yaw += step;
      if (tilt !== undefined) ctl.pitch = THREE.MathUtils.clamp(ctl.pitch + tilt, 0.08, 1.05);
      ctl.idle = 0;
      markTouched();
      kick();
    };
    wrap.addEventListener("pointerdown", down);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerup", up);
    wrap.addEventListener("pointercancel", up);
    wrap.addEventListener("keydown", key);

    return () => {
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointerdown", down);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerup", up);
      wrap.removeEventListener("pointercancel", up);
      wrap.removeEventListener("keydown", key);
      destroy();
    };
  }, [scene, cfg]);

  if (failed) return <ScenicArt scene={fallbackScene} />;

  return (
    <div
      ref={wrapRef}
      role="group"
      tabIndex={0}
      aria-label={`${cfg.aria}. Drag or use the arrow keys to rotate.`}
      className="absolute inset-0 cursor-grab touch-pan-y select-none outline-none focus-visible:ring-4 focus-visible:ring-accent/80 focus-visible:ring-inset active:cursor-grabbing"
      style={{ background: cfg.sky }}
    >
      <div ref={mountRef} className="absolute inset-0" />
      <span className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-forest/75 px-2.5 py-1 text-[0.68rem] font-bold text-white sm:text-xs">
        <Hand
          className={`size-3 transition-all duration-500 ${touched ? "w-0 opacity-0" : "opacity-100"}`}
          aria-hidden="true"
        />
        {cfg.caption}
      </span>
    </div>
  );
}
