"use client";

/**
 * Interactive six-node system diagram.
 *
 * ## Two things were wrong with the previous version
 *
 * **The nodes were misaligned.** Only "AI" landed on its vertex; the other five
 * drifted rightward and two of them overlapped. The cause was not the maths —
 * it was that the inactive nodes carried the `mcx-card` class for their
 * styling, and `mcx-card` declares `position: relative`. This file's CSS is
 * unlayered while Tailwind's utilities live in the `utilities` layer, and
 * unlayered author styles win over layered ones regardless of specificity, so
 * `relative` beat the `absolute` utility on the same element. Five buttons
 * dropped into normal flow and their `left`/`top` percentages then read as
 * offsets from wherever the flow had put them. The nodes style themselves now
 * and never borrow a class that carries positioning.
 *
 * **The web was straight lines.** A hexagon of chords and spokes read as a
 * wireframe rather than as a system. Connections are circular arcs now, drawn
 * along the same ring the nodes sit on, so every line in the diagram is part of
 * a circle and the whole thing reads as orbits rather than as a net.
 */

import { useId, useState } from "react";

import { useRevealOnSelect } from "@/features/marketing/hooks/use-reveal-on-select";
import { systemNodes } from "@/lib/config/brand";

/**
 * Node ring radius, in viewBox units.
 *
 * 32 rather than 40 so the widest label ("Automation", about 117px) still sits
 * inside the square at the narrowest layout the diagram is used at. Labels are
 * centred on their node, so the ring has to leave room for half a label on each
 * side.
 */
const R = 32;

/** One accent per node, in the order `systemNodes` declares them. */
const WEB_COLORS = [
  "#6d5cff", // AI
  "#a78bfa", // Cloud
  "#12a594", // Data
  "#ff8a4c", // Devices
  "#2f8fe0", // Apps
  "#e0428a", // Automation
];

function nodePosition(index: number, radius = R) {
  const a = ((-90 + index * 60) * Math.PI) / 180;
  return { x: 50 + Math.cos(a) * radius, y: 50 + Math.sin(a) * radius };
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = Number.parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/**
 * An arc of the node ring from one node to the next.
 *
 * `A R R 0 0 1 …` sweeps the short way round a circle of the ring's own radius,
 * so the segment lies exactly on the ring rather than bulging off it.
 */
function ringArc(from: number, to: number) {
  const a = nodePosition(from);
  const b = nodePosition(to);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
}

/**
 * A curve from a node to the centre that bows rather than running straight.
 *
 * The control point sits perpendicular to the midpoint, which gives the trace a
 * consistent handedness — every active path curves the same way round.
 */
function inwardCurve(index: number) {
  const p = nodePosition(index);
  const mx = (p.x + 50) / 2;
  const my = (p.y + 50) / 2;
  const dx = p.x - 50;
  const dy = p.y - 50;
  const bow = 0.22;
  return `M 50 50 Q ${mx - dy * bow} ${my + dx * bow} ${p.x} ${p.y}`;
}

export function SystemDiagram() {
  const [active, setActive] = useState(0);
  const node = systemNodes[active];
  const accent = WEB_COLORS[active];

  // The diagram is a full-width square, so on a phone the panel describing the
  // selected node starts below the fold. Tapping a node updated text nobody
  // could see. See the hook for the whole reasoning.
  const { targetRef, reveal } = useRevealOnSelect<HTMLDivElement>();

  const panelId = useId();

  // Only a real activation reveals. Pointer entry is a preview, and on touch it
  // fires from a finger passing over a node on the way to somewhere else.
  const select = (index: number, activate: boolean) => {
    setActive(index);
    if (activate) reveal();
  };

  return (
    <div className="grid items-center gap-[clamp(28px,4vw,56px)] lg:grid-cols-2">
      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {/* Concentric orbits. Every line in this diagram belongs to a circle. */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(18 18 42 / 0.05)" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgb(18 18 42 / 0.09)" strokeWidth="0.4" />
          <circle
            cx="50"
            cy="50"
            r="23"
            fill="none"
            stroke="rgb(18 18 42 / 0.06)"
            strokeWidth="0.3"
            strokeDasharray="1.6 2.4"
            strokeLinecap="round"
          />

          {/* Ring segments between neighbouring nodes, tinted per node. */}
          {systemNodes.map((_, i) => (
            <path
              key={`arc-${i}`}
              d={ringArc(i, (i + 1) % systemNodes.length)}
              fill="none"
              stroke={hexToRgba(WEB_COLORS[i], i === active ? 0.75 : 0.28)}
              strokeWidth={i === active ? 0.9 : 0.5}
              strokeLinecap="round"
              className="transition-[stroke,stroke-width] duration-500"
            />
          ))}

          {/* The active node's trace to the centre — a bowed curve, not a spoke. */}
          <path
            d={inwardCurve(active)}
            fill="none"
            stroke={accent}
            strokeWidth="0.9"
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{ filter: `drop-shadow(0 0 2.5px ${hexToRgba(accent, 0.7)})` }}
          />

          {/* Node markers. */}
          {systemNodes.map((_, i) => {
            const { x, y } = nodePosition(i);
            const on = i === active;
            return (
              <circle
                key={`dot-${i}`}
                cx={x}
                cy={y}
                r={on ? 2.1 : 1.1}
                fill={on ? WEB_COLORS[i] : hexToRgba(WEB_COLORS[i], 0.45)}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Centre. */}
        <div
          className="absolute top-1/2 left-1/2 flex aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center"
          style={{
            border: "1px solid rgb(255 255 255 / 0.75)",
            boxShadow:
              "inset 0 1px 0 rgb(255 255 255 / 0.9), 0 1px 2px rgb(20 16 56 / 0.04), 0 12px 28px -14px rgb(20 16 56 / 0.18)",
            background:
              "radial-gradient(circle at 34% 28%, rgb(255 255 255 / 0.95) 0%, rgb(246 245 255 / 0.8) 55%, rgb(232 226 255 / 0.7) 100%)",
          }}
        >
          <span className="font-mono text-[clamp(8.5px,1.1vw,11px)] leading-[1.5] tracking-[0.14em] text-ink uppercase">
            Marine
            <br />
            CloudX
          </span>
        </div>

        {/* Labels.
            Styled inline rather than with a shared card class, so nothing can
            reintroduce a `position` that fights the `absolute` utility.

            Wrapped in a tablist rather than marking the square itself as one:
            a tablist may only contain tabs, and the square also holds the SVG
            and the centre lockup. The wrapper is `inset-0` so the labels keep
            positioning against the same box, and `pointer-events-none` so
            covering the diagram costs nothing — the buttons re-enable it for
            themselves. */}
        <div
          role="tablist"
          aria-label="System areas"
          className="pointer-events-none absolute inset-0"
        >
        {systemNodes.map((n, i) => {
          const { x, y } = nodePosition(i);
          const on = i === active;
          const color = WEB_COLORS[i];
          return (
            <button
              key={n.name}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={panelId}
              onMouseEnter={() => select(i, false)}
              onFocus={() => select(i, false)}
              onClick={() => select(i, true)}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 font-mono text-[clamp(9px,1vw,11px)] tracking-[0.12em] whitespace-nowrap uppercase transition-[background,border-color,box-shadow,color] duration-300 ease-out"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                color: on ? "#12122a" : "#5c5c78",
                fontWeight: on ? 600 : 400,
                background: on
                  ? `linear-gradient(135deg, ${hexToRgba(color, 0.26)}, ${hexToRgba(color, 0.1)})`
                  : "rgb(255 255 255 / 0.82)",
                border: `1px solid ${on ? hexToRgba(color, 0.55) : "rgb(255 255 255 / 0.8)"}`,
                boxShadow: on
                  ? `0 0 0 4px ${hexToRgba(color, 0.1)}, 0 12px 26px -12px ${hexToRgba(color, 0.5)}`
                  : "0 1px 2px rgb(20 16 56 / 0.04), 0 8px 20px -12px rgb(20 16 56 / 0.2)",
              }}
            >
              {n.name}
            </button>
          );
        })}
        </div>
      </div>

      <div
        ref={targetRef}
        id={panelId}
        role="tabpanel"
        tabIndex={-1}
        aria-live="polite"
        className="reveal-target max-w-[420px] scroll-mt-24 rounded-[18px]"
        style={{ ["--reveal-accent" as string]: accent }}
      >
        <div
          className="tech-label inline-flex items-center gap-2 rounded-full px-3 py-1"
          style={{
            color: accent,
            background: hexToRgba(accent, 0.1),
            border: `1px solid ${hexToRgba(accent, 0.3)}`,
          }}
        >
          {node.name}
        </div>
        <h3 className="mt-3.5 text-h3 font-medium text-ink">{node.title}</h3>
        {/* Height reserved for the longest list.
            "AI" has five items and every other node has four, so without a
            floor the panel shrank by one row as the pointer moved between
            nodes and everything below it jumped. */}
        <div className="mt-5 flex min-h-[17rem] flex-col gap-2">
          {node.items.map((item) => (
            <div
              key={item}
              className="list-row-glass flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-ink"
              style={{ borderLeft: `3px solid ${accent}` }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              {item}
            </div>
          ))}
        </div>
        <p className="mt-5 text-[13px] leading-[1.7] text-ink-muted">
          <span className="on-hover">Hover</span>
          <span className="on-tap">Tap</span> a node to trace its path through the system.
        </p>
      </div>
    </div>
  );
}
