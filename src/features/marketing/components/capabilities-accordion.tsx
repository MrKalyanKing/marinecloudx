"use client";

/**
 * Capabilities accordion — engineered expand.
 *
 * On activate:
 * 1. Sibling rows dim (focus tunnel)
 * 2. Teal hairline draws under the active row
 * 3. Panel opens via CSS grid 0fr→1fr
 * 4. Chips stagger in (GSAP) with a short mechanical rise + deblur
 *
 * Reduced motion: instant open, no stagger.
 */

import { useEffect, useRef, useState } from "react";

import { cx } from "@/features/marketing/components/layout";

export interface CapabilityItem {
  name: string;
  slug: string;
  shortDescription: string | null;
  technologies?: readonly string[] | string[];
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function CapabilitiesAccordion({
  items,
}: {
  items: readonly CapabilityItem[] | CapabilityItem[];
}) {
  const [open, setOpen] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const row = rowRefs.current[open];
    if (!row) return;

    const chips = Array.from(row.querySelectorAll<HTMLElement>("[data-chip]"));
    if (chips.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      chips.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          chips,
          { opacity: 0, y: 12, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out",
            clearProps: "filter",
          },
        );
      }, row);

      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [open]);

  return (
    <div className="border-t border-white/9" role="list">
      {items.map((cap, i) => {
        const active = i === open;
        const chips = cap.technologies?.length ? [...cap.technologies] : [];

        return (
          <div
            key={cap.slug}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            role="listitem"
            tabIndex={0}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(i);
              }
            }}
            className={cx(
              "relative border-b border-white/9 py-[clamp(26px,3.4vw,44px)] outline-none transition-[background,opacity] duration-500",
              active ? "bg-white/[0.028]" : "opacity-[0.48] hover:opacity-75",
            )}
            style={{ transitionTimingFunction: EASE }}
            aria-expanded={active}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-brand-bright/75 via-brand-bright/30 to-transparent transition-transform duration-700"
              style={{
                transform: active ? "scaleX(1)" : "scaleX(0)",
                transitionTimingFunction: EASE,
              }}
            />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-baseline lg:gap-12">
              <div className="flex min-w-0 items-baseline gap-[clamp(14px,2.5vw,28px)]">
                <span
                  className={cx(
                    "tech-label min-w-7 shrink-0 transition-colors duration-500",
                    active ? "text-brand-bright" : "text-light-muted/45",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className={cx(
                    "text-h2 font-normal transition-colors duration-500",
                    active ? "text-light" : "text-light/60",
                  )}
                >
                  {cap.name}
                </h3>
              </div>

              {cap.shortDescription ? (
                <p
                  className={cx(
                    "max-w-[340px] text-[14.5px] leading-[1.55] transition-opacity duration-500 lg:justify-self-end lg:text-right",
                    active ? "text-light-muted opacity-100" : "text-light-muted opacity-70",
                  )}
                >
                  {cap.shortDescription}
                </p>
              ) : null}
            </div>

            <div
              className="grid transition-[grid-template-rows] duration-700"
              style={{
                gridTemplateRows: active ? "1fr" : "0fr",
                transitionTimingFunction: EASE,
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex flex-wrap gap-2 pt-5 pl-[clamp(0px,2.5vw,52px)]">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      data-chip
                      className="inline-flex rounded-[4px] border border-white/12 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[11.5px] tracking-[0.06em] text-light"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
