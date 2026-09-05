"use client";

/**
 * Interactive six-node system diagram — multi-color spider-web connections.
 */

import { useState } from "react";

import { cx } from "@/features/marketing/components/layout";
import { systemNodes } from "@/lib/config/brand";

const R = 40;

/** One accent per node — visible web on white canvas */
const WEB_COLORS = [
  "#6d5cff", // AI
  "#ff4d9a", // Automation
  "#43a7ff", // Apps
  "#ff8a4c", // Devices
  "#12c4b0", // Data
  "#a78bfa", // Cloud
];

function nodePosition(index: number) {
  const a = ((-90 + index * 60) * Math.PI) / 180;
  return {
    x: 50 + Math.cos(a) * R,
    y: 50 + Math.sin(a) * R,
  };
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = Number.parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function SystemDiagram() {
  const [active, setActive] = useState(0);
  const node = systemNodes[active];

  return (
    <div className="grid items-center gap-[clamp(28px,4vw,56px)] lg:grid-cols-2">
      <div className="relative mx-auto aspect-square w-full max-w-[560px]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {WEB_COLORS.map((color, i) => (
              <linearGradient key={color} id={`web-grad-${i}`} x1="50%" y1="50%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={color} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>

          {/* Orbit rings */}
          <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="0.35" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(0,0,0,.04)" strokeWidth="0.3" />

          {/* Adjacent node web (spider mesh) */}
          {systemNodes.map((_, i) => {
            const a = nodePosition(i);
            const b = nodePosition((i + 1) % systemNodes.length);
            const color = WEB_COLORS[i];
            return (
              <line
                key={`mesh-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={hexToRgba(color, 0.22)}
                strokeWidth="0.28"
              />
            );
          })}

          {/* Skip-one chords for denser web */}
          {systemNodes.map((_, i) => {
            const a = nodePosition(i);
            const b = nodePosition((i + 2) % systemNodes.length);
            return (
              <line
                key={`chord-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={hexToRgba(WEB_COLORS[i], 0.1)}
                strokeWidth="0.2"
              />
            );
          })}

          {/* Spokes to center */}
          {systemNodes.map((_, i) => {
            const { x, y } = nodePosition(i);
            const on = i === active;
            const color = WEB_COLORS[i];
            return (
              <g key={`spoke-${i}`}>
                <line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={on ? color : hexToRgba(color, 0.4)}
                  strokeWidth={on ? 1.15 : 0.35}
                  className="transition-[stroke,stroke-width] duration-500"
                  style={{
                    filter: on
                      ? `drop-shadow(0 0 3px ${hexToRgba(color, 0.9)}) drop-shadow(0 0 8px ${hexToRgba(color, 0.5)})`
                      : undefined,
                  }}
                />
                {on ? (
                  <circle cx={x} cy={y} r="1.8" fill={color} opacity="0.95">
                    <animate attributeName="r" values="1.8;2.6;1.8" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                ) : null}
              </g>
            );
          })}
        </svg>

        <div
          className="absolute top-1/2 left-1/2 flex aspect-square w-[33%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center"
          style={{
            borderRadius: "50%",
            border: "1px solid rgb(255 255 255 / 0.7)",
            boxShadow:
              "inset 0 1px 0 rgb(255 255 255 / 0.8), 0 1px 2px rgb(0 0 0 / 0.03), 0 10px 24px -14px rgb(0 0 0 / 0.12), 0 24px 48px -28px rgb(0 0 0 / 0.16)",
            background:
              "radial-gradient(circle at 34% 28%, rgb(255 255 255 / 0.85) 0%, rgb(240 240 250 / 0.6) 55%, rgb(220 210 250 / 0.4) 100%)",
            backdropFilter: "blur(18px) saturate(1.3)",
            WebkitBackdropFilter: "blur(18px) saturate(1.3)",
          }}
        >
          <span className="font-mono text-[clamp(8.5px,1.1vw,11.5px)] leading-[1.5] tracking-[0.14em] text-ink uppercase">
            Marine
            <br />
            CloudX
          </span>
        </div>

        {systemNodes.map((n, i) => {
          const { x, y } = nodePosition(i);
          const on = i === active;
          const color = WEB_COLORS[i];
          return (
            <button
              key={n.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cx(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2.5 font-mono text-[clamp(9.5px,1.05vw,11.5px)] tracking-[0.12em] uppercase transition-all duration-500",
                on ? "scale-110 font-semibold text-ink" : "mcx-card text-ink-muted hover:text-ink",
              )}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                background: on
                  ? `linear-gradient(135deg, ${hexToRgba(color, 0.3)}, ${hexToRgba(color, 0.12)})`
                  : undefined,
                border: on ? `1.5px solid ${hexToRgba(color, 0.7)}` : undefined,
                boxShadow: on
                  ? `0 0 0 4px ${hexToRgba(color, 0.12)}, 0 12px 28px -10px ${hexToRgba(color, 0.55)}`
                  : undefined,
                backdropFilter: on ? "blur(10px) saturate(1.3)" : undefined,
                WebkitBackdropFilter: on ? "blur(10px) saturate(1.3)" : undefined,
              }}
            >
              {n.name}
            </button>
          );
        })}
      </div>

      <div className="max-w-[420px]">
        <div
          className="tech-label inline-flex items-center gap-2 rounded-full px-3 py-1"
          style={{
            color: WEB_COLORS[active],
            background: hexToRgba(WEB_COLORS[active], 0.1),
            border: `1px solid ${hexToRgba(WEB_COLORS[active], 0.3)}`,
          }}
        >
          {node.name}
        </div>
        <h3 className="mt-3.5 text-h3 font-medium text-ink">{node.title}</h3>
        <div className="mt-5 flex flex-col gap-2">
          {node.items.map((item) => (
            <div
              key={item}
              className="list-row-glass flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-ink"
              style={{ borderLeft: `3px solid ${WEB_COLORS[active]}` }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: WEB_COLORS[active] }}
              />
              {item}
            </div>
          ))}
        </div>
        <p className="mt-5 text-[13px] leading-[1.7] text-ink-muted/70">
          Hover a node to trace its path through the system.
        </p>
      </div>
    </div>
  );
}
