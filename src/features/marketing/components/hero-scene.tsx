"use client";

/**
 * Hero device scene.
 *
 * A laptop and phone built entirely from CSS 3D transforms — no image, no WebGL,
 * no dependency. The whole rig tilts toward the pointer (a few degrees, damped),
 * the glass cards drift on an idle float, and everything settles on scroll-in.
 *
 * Client-side only for the pointer parallax. Everything is decorative, so it is
 * hidden from assistive technology and it renders fine with zero JavaScript —
 * you just lose the tilt. Under `prefers-reduced-motion` the pointer listener is
 * never attached and the float animations are collapsed by the global rule.
 */

import { useEffect, useRef } from "react";

export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0; // current
    let dx = 0;
    let dy = 0; // target

    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (event.clientX - r.left) / r.width - 0.5;
      const py = (event.clientY - r.top) / r.height - 0.5;
      dx = px;
      dy = py;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      dx = 0;
      dy = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      tx += (dx - tx) * 0.08;
      ty += (dy - ty) * 0.08;
      // Base pose plus pointer influence.
      el.style.setProperty("--ry", `${(-18 + tx * 16).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(8 + ty * -10).toFixed(2)}deg`);
      el.style.setProperty("--px", `${(tx * 22).toFixed(2)}px`);
      el.style.setProperty("--py", `${(ty * 22).toFixed(2)}px`);

      if (Math.abs(dx - tx) > 0.001 || Math.abs(dy - ty) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const parent = el.parentElement ?? el;
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className="hero-scene" aria-hidden="true">
      <style>{sceneCss}</style>

      <div className="hs-stage">
        {/* Laptop */}
        <div className="hs-laptop">
          <div className="hs-screen">
            <div className="hs-ui">
              <div className="hs-ui-top">
                <span className="hs-dot" />
                <span className="hs-dot" />
                <span className="hs-dot" />
                <span className="hs-ui-title">MarineCloudeX · Console</span>
              </div>
              <div className="hs-ui-body">
                <div className="hs-metric">
                  <span className="hs-metric-k">Active systems</span>
                  <span className="hs-metric-v">128</span>
                  <span className="hs-metric-d">+12.5%</span>
                </div>
                <svg className="hs-chart" viewBox="0 0 260 96" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-aurora-1)" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="var(--color-aurora-1)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="hsLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--color-aurora-1)" />
                      <stop offset="100%" stopColor="var(--color-aurora-3)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 78 L26 66 L52 70 L78 48 L104 54 L130 34 L156 40 L182 22 L208 30 L234 14 L260 20 L260 96 L0 96 Z"
                    fill="url(#hsFill)"
                  />
                  <path
                    d="M0 78 L26 66 L52 70 L78 48 L104 54 L130 34 L156 40 L182 22 L208 30 L234 14 L260 20"
                    fill="none"
                    stroke="url(#hsLine)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="hs-bars">
                  <span style={{ height: "44%" }} />
                  <span style={{ height: "68%" }} />
                  <span style={{ height: "52%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "60%" }} />
                  <span style={{ height: "90%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="hs-base" />
        </div>

        {/* Phone */}
        <div className="hs-phone">
          <div className="hs-phone-notch" />
          <div className="hs-phone-ui">
            <span className="hs-phone-k">Deploys today</span>
            <span className="hs-phone-v">24</span>
            <div className="hs-phone-ring">
              <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="7" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="var(--color-aurora-1)"
                  strokeWidth="7"
                  strokeDasharray="163"
                  strokeDashoffset="46"
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <span>72%</span>
            </div>
          </div>
        </div>

        {/* Floating glass cards */}
        <div className="hs-card hs-card-a glass-strong">
          <span className="hs-card-k">Uptime</span>
          <span className="hs-card-v">99.98%</span>
        </div>
        <div className="hs-card hs-card-b glass-strong">
          <span className="hs-card-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hs-card-k">Build passed</span>
        </div>
      </div>
    </div>
  );
}

const sceneCss = `
.hero-scene {
  position: relative;
  width: 100%;
  max-width: 34rem;
  aspect-ratio: 5 / 4;
  perspective: 1400px;
  perspective-origin: 55% 40%;
}
.hero-scene .hs-stage {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 8deg)) rotateY(var(--ry, -18deg));
  transition: transform 0.2s var(--ease-out-soft);
}
.hero-scene .hs-laptop {
  position: absolute;
  left: 6%;
  top: 12%;
  width: 78%;
  transform-style: preserve-3d;
  animation: float-y 7s var(--ease-out-soft) infinite alternate;
}
.hero-scene .hs-screen {
  position: relative;
  border-radius: 14px;
  padding: 10px;
  background: linear-gradient(160deg, #0e2a24, #06171300);
  background-color: #0b201b;
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 40px 80px -40px rgb(2 12 10 / 0.9), inset 0 1px 0 rgb(255 255 255 / 0.08);
  transform: translateZ(38px);
}
.hero-scene .hs-base {
  height: 14px;
  margin: 0 -7%;
  border-radius: 0 0 16px 16px;
  background: linear-gradient(180deg, #16332b, #0a1f1a);
  border: 1px solid rgb(255 255 255 / 0.08);
  border-top: none;
  transform: rotateX(72deg) translateY(6px);
  transform-origin: top;
  box-shadow: 0 30px 40px -20px rgb(2 12 10 / 0.7);
}
.hero-scene .hs-ui {
  border-radius: 8px;
  overflow: hidden;
  background: #071a16;
  border: 1px solid rgb(255 255 255 / 0.06);
}
.hero-scene .hs-ui-top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgb(255 255 255 / 0.03);
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
}
.hero-scene .hs-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.18);
}
.hero-scene .hs-ui-title {
  margin-left: 8px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-light-muted, #a2c6bd);
}
.hero-scene .hs-ui-body { padding: 14px; }
.hero-scene .hs-metric {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.hero-scene .hs-metric-k {
  font-size: 10px;
  color: var(--color-light-muted, #a2c6bd);
  flex: 1;
}
.hero-scene .hs-metric-v {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-light, #f1fbf8);
}
.hero-scene .hs-metric-d {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-aurora-1, #21e0b5);
}
.hero-scene .hs-chart {
  width: 100%;
  height: 64px;
  margin-top: 8px;
  display: block;
}
.hero-scene .hs-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 34px;
  margin-top: 10px;
}
.hero-scene .hs-bars span {
  flex: 1;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(180deg, var(--color-aurora-1, #21e0b5), rgb(33 224 181 / 0.15));
}
.hero-scene .hs-phone {
  position: absolute;
  right: 2%;
  bottom: 2%;
  width: 23%;
  aspect-ratio: 1 / 2;
  border-radius: 20px;
  padding: 10px;
  background: linear-gradient(160deg, #12332b, #081c17);
  border: 1px solid rgb(255 255 255 / 0.12);
  box-shadow: 0 50px 90px -40px rgb(2 12 10 / 0.95), inset 0 1px 0 rgb(255 255 255 / 0.1);
  transform: translateZ(96px) rotateY(-6deg);
  animation: float-y 5.5s var(--ease-out-soft) infinite alternate-reverse;
}
.hero-scene .hs-phone-notch {
  width: 34%;
  height: 8px;
  margin: 0 auto 8px;
  border-radius: 0 0 8px 8px;
  background: rgb(0 0 0 / 0.4);
}
.hero-scene .hs-phone-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.06);
}
.hero-scene .hs-phone-k {
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-light-muted, #a2c6bd);
}
.hero-scene .hs-phone-v {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-light, #f1fbf8);
}
.hero-scene .hs-phone-ring {
  position: relative;
  width: 54px;
  height: 54px;
  margin-top: 6px;
}
.hero-scene .hs-phone-ring svg { width: 100%; height: 100%; }
.hero-scene .hs-phone-ring span {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-light, #f1fbf8);
}
.hero-scene .hs-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border-radius: 14px;
  color: var(--color-light, #f1fbf8);
}
.hero-scene .hs-card-k {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-light-muted, #a2c6bd);
}
.hero-scene .hs-card-v { font-size: 16px; font-weight: 700; }
.hero-scene .hs-card-a {
  left: -6%;
  top: 30%;
  transform: translateZ(120px);
  animation: float-y 6s var(--ease-out-soft) infinite alternate;
}
.hero-scene .hs-card-b {
  right: 20%;
  top: 4%;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  transform: translateZ(140px);
  animation: float-y 4.6s var(--ease-out-soft) infinite alternate-reverse;
}
.hero-scene .hs-card-b .hs-card-k { color: var(--color-light, #f1fbf8); }
.hero-scene .hs-card-icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--color-aurora-1), var(--color-aurora-3));
  color: #04120f;
}
@media (max-width: 1023px) {
  .hero-scene { max-width: 26rem; margin-inline: auto; }
}
`;
