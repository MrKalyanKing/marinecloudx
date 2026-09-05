"use client";

/**
 * Full-bleed hero ribbon — GPU-instanced plates rendered with Three.js.
 *
 * Previously this was ~200 real DOM nodes with their transforms rewritten on
 * every animation frame (plus a per-frame `clientHeight` read forcing layout).
 * That was the main source of scroll jank. A single InstancedMesh moves all
 * plates in one draw call and never touches the DOM or triggers layout —
 * the animation loop only writes to a WebGL buffer.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PLATE_COUNT = 200;

/** Plum / wine / navy spectrum, matching the reference palette — pushed to
 * higher saturation and a wider light/dark range for more visible contrast. */
const STOPS: [number, number, number][] = [
  [178, 60, 124],
  [140, 32, 82],
  [200, 44, 192],
  [20, 24, 54],
  [92, 86, 132],
  [216, 46, 56],
  [30, 10, 22],
  [96, 26, 100],
  [236, 150, 204],
];

function lerpColor(t: number): THREE.Color {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  return new THREE.Color(
    (a[0] + (b[0] - a[0]) * f) / 255,
    (a[1] + (b[1] - a[1]) * f) / 255,
    (a[2] + (b[2] - a[2]) * f) / 255,
  );
}

export function HeroRibbon() {
  const root = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = root.current;
    const hostEl = canvasHost.current;
    if (!rootEl || !hostEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 860px)").matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    hostEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    group.rotation.x = -0.16;
    scene.add(group);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // Bake a static top-lit gradient from the box's own normals (brighter top
    // face, darker bottom) so plates keep a glossy look with zero per-frame
    // lighting cost — the instance color multiplies this at render time.
    const normals = geometry.getAttribute("normal");
    const shade = new Float32Array(normals.count * 3);
    for (let v = 0; v < normals.count; v++) {
      const ny = normals.getY(v);
      const brightness = 0.58 + 0.52 * ((ny + 1) / 2);
      shade[v * 3] = brightness;
      shade[v * 3 + 1] = brightness;
      shade[v * 3 + 2] = brightness;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(shade, 3));

    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const mesh = new THREE.InstancedMesh(geometry, material, PLATE_COUNT);
    group.add(mesh);

    const xAt = (i: number) => -1 + ((i + 0.5) / PLATE_COUNT) * 2;
    for (let i = 0; i < PLATE_COUNT; i++) {
      const t = i / (PLATE_COUNT - 1);
      mesh.setColorAt(i, lerpColor(t));
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    let halfH = 1;
    let plateW = 1;
    let plateD = 0.06;

    const resize = () => {
      const w = hostEl.clientWidth || 1;
      const h = hostEl.clientHeight || 1;
      renderer.setSize(w, h, false);
      halfH = h / w;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.updateProjectionMatrix();
      plateW = (2 / PLATE_COUNT) * 0.72;
      plateD = plateW * 0.9;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(hostEl);

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (event: PointerEvent) => {
      if (mobile || reduce) return;
      const r = rootEl.getBoundingClientRect();
      mx = (event.clientX - r.left) / r.width - 0.5;
      my = (event.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
    };

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      rootEl.addEventListener("pointerleave", onLeave);
    }

    const dummy = new THREE.Object3D();
    let raf = 0;
    let running = true;
    const start = performance.now();

    const renderFrame = (phase: number, tiltX: number, tiltY: number) => {
      const amp = halfH * 0.4;
      group.rotation.x = -0.16 + tiltX;
      group.rotation.y = tiltY;

      for (let i = 0; i < PLATE_COUNT; i++) {
        const t = i / (PLATE_COUNT - 1);
        const x = xAt(i);
        const base = Math.sin(t * Math.PI * 2 + phase);
        const shaped = Math.sign(base) * Math.abs(base) ** 0.72;
        const ripple = Math.sin(t * Math.PI * 5.5 + phase * 1.4) * amp * 0.05;
        const y = shaped * amp + ripple;
        const z = Math.cos(t * Math.PI * 2 + phase * 0.5) * 0.35;
        const rotY = (t - 0.5) * 0.42 + Math.sin(phase + t * 3) * 0.06;
        const scaleY = halfH * 0.62 * (1 + shaped * 0.08);

        dummy.position.set(x, y, z);
        dummy.rotation.set(0, rotY, 0);
        dummy.scale.set(plateW, Math.max(0.02, scaleY), plateD);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    if (reduce) {
      renderFrame(0, 0, 0);
    } else {
      const frame = (now: number) => {
        if (!running) return;
        raf = requestAnimationFrame(frame);
        const elapsed = (now - start) / 1000;
        cx += (mx - cx) * 0.08;
        cy += (my - cy) * 0.08;
        const phase = elapsed * 0.55 + cx * 1.2;
        renderFrame(phase, cy * -0.1, cx * 0.14);
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      rootEl.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      hostEl.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={root} className="hero-ribbon" aria-hidden="true">
      <div className="hero-ribbon__glow" />
      <div className="hero-ribbon__dust" />
      <div ref={canvasHost} className="hero-ribbon__canvas" />
    </div>
  );
}
