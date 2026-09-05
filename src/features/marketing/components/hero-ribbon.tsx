"use client";

/**
 * Full-bleed hero ribbon — dense vertical plates along a smooth 3D wave.
 * Continuous RAF loop drives wave motion + mouse response (no CSS transform
 * animations that fight the pointer and cause stutter).
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

const PLATE_COUNT = 160;

/** Hot pink / magenta / violet / cyan — matches reference */
const STOPS: [number, number, number][] = [
  [255, 40, 130],
  [255, 70, 190],
  [180, 70, 255],
  [90, 130, 255],
  [30, 210, 255],
  [255, 55, 150],
];

type PlateBase = {
  t: number;
  el: HTMLSpanElement | null;
  color: string;
};

function lerpColor(t: number): [number, number, number] {
  const scaled = (((t % 1) + 1) % 1) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

function plateBackground(t: number): string {
  const [r, g, b] = lerpColor(t);
  const [r2, g2, b2] = lerpColor(t + 0.12);
  return `linear-gradient(180deg, rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},0.92), rgba(${r2},${g2},${b2},0.72))`;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function HeroRibbon() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const rootEl = root.current;
    const stageEl = stage.current;
    if (!rootEl || !stageEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 860px)").matches;

    const plates: PlateBase[] = [];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < PLATE_COUNT; i++) {
      const t = i / (PLATE_COUNT - 1);
      const span = document.createElement("span");
      span.className = "hero-ribbon__plate";
      span.style.left = `${(t * 100).toFixed(4)}%`;
      span.style.backgroundImage = plateBackground(t * 0.95 + 0.02);
      frag.appendChild(span);
      plates.push({ t, el: span, color: "" });
    }
    stageEl.appendChild(frag);

    let raf = 0;
    let running = true;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    const start = performance.now();

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

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);

      const elapsed = (now - start) / 1000;
      // Smooth mouse lerp — never stops the loop so motion stays fluid
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;

      const phase = elapsed * 0.55 + cx * 1.2;
      const ampBoost = 1 + cy * 0.25;
      const height = rootEl.clientHeight || 280;
      const amp = Math.min(72, height * 0.22) * ampBoost;

      // Stage tilt from cursor
      const tiltY = cx * 8;
      const tiltX = 12 + cy * -6;
      stageEl.style.transform = `rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg)`;

      for (let i = 0; i < plates.length; i++) {
        const p = plates[i];
        const el = p.el;
        if (!el) continue;
        const t = p.t;

        // Multi-frequency wave — matches reference undulation
        const y =
          Math.sin(t * Math.PI * 2.15 + phase) * amp +
          Math.sin(t * Math.PI * 0.85 + phase * 0.65) * (amp * 0.28);
        const z = Math.cos(t * Math.PI * 1.4 + phase * 0.4) * 18;
        // Keep plates vertical: no rotateZ; slight rotateY for ribbon depth only
        const rotY = (t - 0.5) * 22 + Math.sin(phase + t * 3) * 4 + cx * 6;
        const scaleY = 1 + Math.sin(t * Math.PI * 2.15 + phase) * 0.06;

        el.style.transform = `translate3d(-50%, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)})`;
      }
    };

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      rootEl.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    } else {
      // Static pose
      for (let i = 0; i < plates.length; i++) {
        const p = plates[i];
        const t = p.t;
        const y = Math.sin(t * Math.PI * 2.15) * 40;
        const rotY = (t - 0.5) * 22;
        if (p.el) {
          p.el.style.transform = `translate3d(-50%, ${y}px, 0) rotateY(${rotY}deg)`;
        }
      }
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      rootEl.removeEventListener("pointerleave", onLeave);
      stageEl.replaceChildren();
    };
  }, [isClient]);

  return (
    <div ref={root} className="hero-ribbon" aria-hidden="true">
      <div className="hero-ribbon__glow" />
      <div className="hero-ribbon__dust" />
      <div ref={stage} className="hero-ribbon__stage">
        {!isClient ? <div className="hero-ribbon__fallback" /> : null}
      </div>
    </div>
  );
}
