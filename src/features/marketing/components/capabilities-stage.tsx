"use client";

/**
 * Capabilities stage — progressive reveal on polished cards.
 */

import Link from "next/link";
import { useState } from "react";

import { Arrow, cx } from "@/features/marketing/components/layout";
import type { homeCapabilities } from "@/lib/config/brand";

type Capability = (typeof homeCapabilities)[number];

/** One accent per capability — ties this stage to the system diagram's palette. */
const ACCENTS = ["#6d5cff", "#ff4d9a", "#43a7ff", "#ff8a4c", "#12c4b0", "#a78bfa"];

export function CapabilitiesStage({
  items,
}: {
  items: readonly Capability[] | Capability[];
}) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  const accent = ACCENTS[active % ACCENTS.length];

  return (
    <section id="capabilities" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div data-reveal-stage className="mb-10 max-w-[720px] sm:mb-12">
          <p className="tech-label text-brand">04&nbsp;&nbsp;Capabilities</p>
          <h2 className="mt-6 text-h2 font-normal text-ink">What we engineer</h2>
          <p className="mt-5 text-lead text-ink-muted">
            Hover a capability to see the stack behind it — problem first, tools second.
          </p>
        </div>

        <div data-reveal-stage className="mcx-card overflow-hidden">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-black/8 p-6 sm:p-8 lg:border-r lg:border-b-0">
              <ul className="flex flex-col gap-1">
                {items.map((item, index) => {
                  const isActive = index === active;
                  const itemAccent = ACCENTS[index % ACCENTS.length];
                  return (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        onMouseEnter={() => setActive(index)}
                        /* `transition-all` used to be here. It animated every
                           animatable property, including the ones that change
                           layout, which is half of why hovering this list made
                           the whole panel jump. Only colour, border, shadow and
                           transform are transitioned now — none of them can
                           move anything else on the page. */
                        className={cx(
                          "group flex w-full items-start gap-4 rounded-xl border-y border-r px-3.5 py-3.5 text-left",
                          "transition-[background-color,border-color,box-shadow,color] duration-300 ease-out",
                          isActive
                            ? "border-y-black/[0.03] border-r-black/[0.03] shadow-[0_10px_24px_-16px_rgb(0_0_0_/_0.25)]"
                            : "border-transparent hover:border-black/8 hover:bg-black/[0.025]",
                        )}
                        style={{
                          borderLeft: `3px solid ${isActive ? itemAccent : "transparent"}`,
                          background: isActive
                            ? `linear-gradient(90deg, ${itemAccent}1f, ${itemAccent}08 60%, transparent)`
                            : undefined,
                        }}
                      >
                        <span
                          className={cx("tech-label shrink-0 pt-0.5", !isActive && "text-ink-muted")}
                          style={{ color: isActive ? itemAccent : undefined }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex flex-col gap-1">
                          <span
                            className={cx(
                              "text-[17px] tracking-[-0.02em] transition-colors",
                              isActive ? "font-semibold text-ink" : "text-ink-muted",
                            )}
                          >
                            {item.name}
                          </span>
                          {/* Always rendered at full height.
                              This used to animate max-height from 0 to 5rem on
                              hover and on becoming active. Height is a layout
                              property: growing this row pushed every row below
                              it down and reflowed the entire panel, on every
                              mouse move between items. That was the jerk.

                              Reserving the space permanently means hovering
                              changes only colour. Nothing moves, so there is
                              nothing to reflow — and the descriptions are
                              useful enough to be worth showing anyway. */}
                          <span
                            className={cx(
                              "text-[13px] leading-snug transition-colors duration-300",
                              isActive ? "text-ink-muted" : "text-ink-muted/70",
                            )}
                          >
                            {item.shortDescription}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/services"
                className="chip-glass group mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand"
              >
                All services
                <Arrow />
              </Link>
            </div>

            <div
              className="relative flex min-h-[260px] flex-col justify-between overflow-hidden p-6 sm:p-8 lg:min-h-[340px] lg:p-10"
              style={{
                background: `radial-gradient(120% 100% at 100% 0%, ${accent}14, transparent 60%)`,
              }}
            >
              <div>
                <p className="tech-label" style={{ color: accent }}>
                  Focus
                </p>
                <h3 className="mt-4 text-[clamp(1.35rem,2.4vw,1.85rem)] font-medium tracking-[-0.025em] text-ink">
                  {current.name}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink-muted">
                  {current.shortDescription}
                </p>
              </div>

              <ul className="relative mt-10 flex flex-wrap gap-2">
                {current.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="chip-glass px-3.5 py-1.5 text-[12px] font-medium tracking-wide"
                    style={{
                      color: accent,
                      background: `${accent}14`,
                      borderColor: `${accent}40`,
                    }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-[520px] text-sm leading-relaxed text-ink-muted/80">
          Blockchain and cybersecurity are engineered into the systems that need them, not sold as
          separate line items.
        </p>
      </div>
    </section>
  );
}
