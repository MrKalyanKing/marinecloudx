"use client";

/**
 * Interactive six-node system diagram — Glass UI homepage.
 */

import { useState } from "react";

import { cx } from "@/features/marketing/components/layout";
import { systemNodes } from "@/lib/config/brand";

const R = 40;

function nodePosition(index: number) {
  const a = ((-90 + index * 60) * Math.PI) / 180;
  return {
    x: 50 + Math.cos(a) * R,
    y: 50 + Math.sin(a) * R,
  };
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
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="rgba(255,255,255,.06)"
            strokeWidth="0.3"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="none"
            stroke="rgba(255,255,255,.04)"
            strokeWidth="0.3"
          />
          {systemNodes.map((_, i) => {
            const { x, y } = nodePosition(i);
            const on = i === active;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke={on ? "rgba(39,220,197,.85)" : "rgba(255,255,255,.10)"}
                strokeWidth={on ? 0.5 : 0.25}
                className="transition-[stroke] duration-500"
              />
            );
          })}
        </svg>

        <div
          className="glass absolute top-1/2 left-1/2 flex aspect-square w-[33%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-bright/22 text-center shadow-[0_0_60px_-20px_rgb(39_220_197_/_0.5)]"
          style={{
            background:
              "radial-gradient(circle at 36% 30%, rgb(255 255 255 / 0.10), rgb(6 24 21 / 0.55))",
          }}
        >
          <span className="font-mono text-[clamp(8.5px,1.1vw,11.5px)] leading-[1.5] tracking-[0.14em] uppercase">
            Marine
            <br />
            CloudX
          </span>
        </div>

        {systemNodes.map((n, i) => {
          const { x, y } = nodePosition(i);
          const on = i === active;
          return (
            <button
              key={n.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cx(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3.5 py-2 font-mono text-[clamp(9.5px,1.05vw,11.5px)] tracking-[0.12em] uppercase transition-all duration-500",
                on
                  ? "border border-brand-bright/55 bg-brand-bright/14 text-light"
                  : "glass text-light",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {n.name}
            </button>
          );
        })}
      </div>

      <div className="max-w-[420px]">
        <div className="tech-label text-light-muted">{node.name}</div>
        <h3 className="mt-3.5 text-h3 font-normal">
          {node.title}
        </h3>
        <div className="mt-5 grid gap-px border-t border-white/8">
          {node.items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 border-b border-white/8 py-3.5 text-[15px] text-light-muted"
            >
              <span
                aria-hidden="true"
                className="h-1 w-1 shrink-0 rounded-full bg-brand-bright opacity-80"
              />
              {item}
            </div>
          ))}
        </div>
        <p className="mt-5 text-[13px] leading-[1.7] text-light-muted/60">
          Hover a node to trace its path through the system.
        </p>
      </div>
    </div>
  );
}
