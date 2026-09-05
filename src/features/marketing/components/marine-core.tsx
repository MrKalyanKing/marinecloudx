"use client";

/**
 * Marine Cloud Core — hero WebGL orb.
 *
 * Dynamically loads three.js, builds a glass icosahedron + lattice + rings,
 * and falls back to a CSS glass orb if WebGL is unavailable, loading fails,
 * or the visitor prefers reduced motion.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type CoreState = "loading" | "ready" | "fallback";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function MarineCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [glState, setGlState] = useState<"loading" | "ready" | "fallback">("loading");
  const state: CoreState = reduceMotion ? "fallback" : glState;

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let dead = false;
    let raf = 0;
    let cleanupScene: (() => void) | undefined;
    const failTimer = window.setTimeout(() => {
      if (!dead) setGlState((s) => (s === "loading" ? "fallback" : s));
    }, 9000);

    void import("three")
      .then((THREE) => {
        if (dead || !canvas) return;

        const mobile = window.innerWidth < 860;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: !mobile,
            powerPreference: "high-performance",
          });
        } catch {
          if (!dead) setGlState("fallback");
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        const scene = new THREE.Scene();
        scene.environment = envTexture(THREE);
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 4.4);

        const group = new THREE.Group();
        scene.add(group);

        const shell = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.22, mobile ? 1 : 2),
          new THREE.MeshPhysicalMaterial({
            color: 0xbfe6df,
            roughness: 0.05,
            metalness: 0,
            opacity: 0.14,
            ior: 1.52,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.2,
            transparent: true,
            depthWrite: false,
            flatShading: true,
            side: THREE.FrontSide,
          }),
        );
        group.add(shell);

        const lattice = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.66, 1),
          new THREE.MeshBasicMaterial({
            color: 0x27dcc5,
            wireframe: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
          }),
        );
        group.add(lattice);

        const nucleus = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 32, 24),
          new THREE.MeshBasicMaterial({
            color: 0xd7fff7,
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
          }),
        );
        group.add(nucleus);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.95, 0.006, 8, 160),
          new THREE.MeshBasicMaterial({
            color: 0x8cc9ff,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
          }),
        );
        ring.rotation.set(1.15, 0.4, 0);
        group.add(ring);

        const ring2 = new THREE.Mesh(
          new THREE.TorusGeometry(0.82, 0.005, 8, 140),
          new THREE.MeshBasicMaterial({
            color: 0xb0a8ff,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
          }),
        );
        ring2.rotation.set(-0.6, 1.1, 0.3);
        group.add(ring2);

        scene.add(new THREE.AmbientLight(0xbfe6df, 0.7));
        const key = new THREE.DirectionalLight(0xffffff, 2.1);
        key.position.set(3, 4.5, 3);
        scene.add(key);
        const rim = new THREE.PointLight(0x42a5ff, 6, 12);
        rim.position.set(-3.2, -1.2, 2);
        scene.add(rim);
        const fill = new THREE.PointLight(0x27dcc5, 4, 12);
        fill.position.set(2.4, -2, -2.4);
        scene.add(fill);

        const onResize = () => {
          const r = canvas.getBoundingClientRect();
          const w = Math.max(1, r.width);
          const h = Math.max(1, r.height);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        onResize();
        window.addEventListener("resize", onResize);

        const target = { x: 0, y: 0 };
        const cur = { x: 0, y: 0 };
        const onPointer = (e: PointerEvent) => {
          target.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
          target.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
        };
        if (!mobile) window.addEventListener("pointermove", onPointer, { passive: true });

        const clock = new THREE.Clock();
        const loop = () => {
          if (dead) return;
          raf = requestAnimationFrame(loop);
          const t = clock.getElapsedTime();
          const scroll = Math.min(1, (window.scrollY || 0) / Math.max(1, window.innerHeight));
          cur.x += (target.x - cur.x) * 0.04;
          cur.y += (target.y - cur.y) * 0.04;
          group.rotation.y = t * 0.055 + cur.x + scroll * 0.5;
          group.rotation.x = cur.y + scroll * 0.22;
          group.position.y = Math.sin(t * 0.35) * 0.035;
          group.scale.setScalar(1 - scroll * 0.06);
          lattice.rotation.y = -t * 0.11;
          lattice.rotation.z = t * 0.05;
          ring.rotation.z = t * 0.08;
          ring2.rotation.z = -t * 0.06;
          const mat = nucleus.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          mat.opacity = 0.3 + Math.sin(t * 0.9) * 0.12;
          renderer.render(scene, camera);
        };
        loop();

        window.clearTimeout(failTimer);
        window.setTimeout(() => {
          if (!dead) setGlState("ready");
        }, 260);

        cleanupScene = () => {
          window.removeEventListener("resize", onResize);
          if (!mobile) window.removeEventListener("pointermove", onPointer);
          cancelAnimationFrame(raf);
          renderer.dispose();
          shell.geometry.dispose();
          (shell.material as InstanceType<typeof THREE.Material>).dispose();
          lattice.geometry.dispose();
          (lattice.material as InstanceType<typeof THREE.Material>).dispose();
          nucleus.geometry.dispose();
          (nucleus.material as InstanceType<typeof THREE.Material>).dispose();
          ring.geometry.dispose();
          (ring.material as InstanceType<typeof THREE.Material>).dispose();
          ring2.geometry.dispose();
          (ring2.material as InstanceType<typeof THREE.Material>).dispose();
        };
      })
      .catch(() => {
        if (!dead) setGlState("fallback");
      });

    return () => {
      dead = true;
      window.clearTimeout(failTimer);
      cleanupScene?.();
    };
  }, [reduceMotion]);

  const label =
    state === "ready"
      ? "Marine Cloud Core / Live"
      : state === "loading"
        ? "Initializing system"
        : "Marine Cloud Core";

  return (
    <div className="relative mx-auto aspect-square h-full w-full max-w-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_38%_32%,rgb(39_220_197_/_0.18),transparent_62%)] blur-[28px]"
      />

      {!reduceMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          aria-hidden="true"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[14%] rounded-full border border-white/6 transition-opacity duration-[1.2s] ease-out"
        style={{
          opacity: state === "ready" ? 0.4 : 1,
          background:
            "radial-gradient(circle at 34% 26%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0.02) 40%, rgb(6 24 21 / 0.35) 72%), radial-gradient(circle at 66% 78%, rgb(66 165 255 / 0.14), transparent 55%)",
          WebkitBackdropFilter: "blur(6px)",
          backdropFilter: "blur(6px)",
        }}
      />

      <div
        className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[10.5px] tracking-[0.18em] text-light-muted/70 uppercase transition-opacity duration-700"
        style={{ opacity: state === "ready" ? 0 : 1 }}
        aria-live="polite"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-brand-bright"
          style={{ animation: "mcx-pulse 2.2s ease-in-out infinite" }}
        />
        {label}
      </div>
    </div>
  );
}

function envTexture(THREE: typeof import("three")) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;

  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#0e3a34");
  grad.addColorStop(0.42, "#0a201d");
  grad.addColorStop(1, "#04100e");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 256);

  const soft = (x: number, y: number, r: number, col: string) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, col);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  };
  soft(150, 60, 120, "rgba(255,255,255,.95)");
  soft(360, 40, 90, "rgba(39,220,197,.7)");
  soft(430, 170, 110, "rgba(66,165,255,.45)");
  soft(60, 200, 100, "rgba(124,108,255,.32)");

  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  return t;
}
