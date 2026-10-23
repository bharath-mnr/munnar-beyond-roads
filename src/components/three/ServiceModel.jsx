//src/components/three/ServiceModel.jsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import ScenicArt from "@/components/ScenicArt";

import { buildCamera, buildJeep, buildPlatform, buildStay } from "./models";

const BUILDERS = { jeep: buildJeep, camera: buildCamera, stay: buildStay };
// where each model starts, and its framing (the view auto-fits the card size)
const START_ROTATION = { jeep: 0.7, camera: -0.6, stay: 0.5 };
const DPR_CAP = 1.5;

/**
 * A slowly turning 3D model on a round stage, drawn with three.js.
 * - Only renders while visible on screen (saves battery and keeps scrolling smooth)
 * - Capped pixel ratio, 30 fps on touch phones
 * - Honors "reduce motion" (draws one still frame)
 * - If WebGL isn't available, shows the illustrated scene instead
 */
export default function ServiceModel({ model = "jeep", fallbackScene = "dawn", className = "" }) {
  const wrapRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "default",
      });
    } catch {
      setFailed(true);
      return undefined;
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameGap = coarse ? 1000 / 30 : 0;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.className = "absolute inset-0 h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    wrap.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff0d8, 0x3f7a4c, 1.5));
    const sun = new THREE.DirectionalLight(0xffd9a0, 2.6);
    sun.position.set(5, 8, 6);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x9cc7ff, 0.8);
    rim.position.set(-6, 3, -5);
    scene.add(rim);

    const stage = new THREE.Group();
    stage.add(buildPlatform(3.3));
    const item = (BUILDERS[model] || buildJeep)();
    item.position.y = 0;
    stage.add(item);
    stage.rotation.y = START_ROTATION[model] ?? 0;
    scene.add(stage);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    // keep the whole stage in view whatever shape the card is
    const fit = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const vfov = THREE.MathUtils.degToRad(camera.fov);
      const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
      const radius = 3.9;
      const dist = radius / Math.sin(Math.min(vfov, hfov) / 2);
      const lift = THREE.MathUtils.degToRad(20);
      camera.position.set(0, 1.0 + Math.sin(lift) * dist, Math.cos(lift) * dist);
      camera.lookAt(0, 1.0, 0);
      camera.updateProjectionMatrix();
    };
    fit();

    let raf = 0;
    let visible = false;
    let last = 0;
    let time = 0;
    let hoverX = 0;
    let hoverY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastNow = performance.now();

    const draw = (now) => {
      raf = 0;
      if (!visible) return;
      raf = requestAnimationFrame(draw);
      if (frameGap && now - last < frameGap) return;
      last = now;
      const dt = Math.min((now - lastNow) / 1000, 0.1);
      lastNow = now;
      time += dt;

      hoverX += (targetX - hoverX) * 0.08;
      hoverY += (targetY - hoverY) * 0.08;
      stage.rotation.y += dt * 0.5 + hoverX * dt * 1.2;
      stage.rotation.x = hoverY * 0.18;
      item.position.y = Math.sin(time * 1.4) * 0.05;

      if (item.userData.wheels) item.userData.wheels.forEach((w) => (w.rotation.x -= dt * 2.5));
      if (item.userData.lantern) {
        item.userData.lantern.scale.setScalar(1 + Math.sin(time * 7) * 0.12);
      }
      renderer.render(scene, camera);
    };

    const start = () => {
      if (reduceMotion) {
        renderer.render(scene, camera);
        return;
      }
      if (!raf) {
        lastNow = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      fit();
      if (reduceMotion || !raf) renderer.render(scene, camera);
    });
    ro.observe(wrap);

    // desktop mouse: gently steer the spin and tilt (touch is left alone so
    // swiping the card row still scrolls)
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [model]);

  if (failed) return <ScenicArt scene={fallbackScene} />;
  return <div ref={wrapRef} className={`absolute inset-0 ${className}`} />;
}
