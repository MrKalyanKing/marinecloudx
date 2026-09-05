"use client";

/**
 * Capabilities stage — progressive reveal on polished cards.
 */

import Link from "next/link";
import { useState } from "react";

import { Arrow, cx } from "@/features/marketing/components/layout";
import type { homeCapabilities } from "@/lib/config/brand";

type Capability = (typeof homeCapabilities)[number];

export function CapabilitiesStage({
  items,
}: {
  items: readonly Capability[] | Capability[];
}) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <section id="capabilities" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div data-reveal-stage className="mb-10 max-w-[720px] sm:mb-12">
          <p className="tech-label text-brand-bright/85">04&nbsp;&nbsp;Capabilities</p>
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
                  return (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        onMouseEnter={() => setActive(index)}
                        className={cx(
                          "group flex w-full items-baseline gap-4 rounded-xl px-3 py-3.5 text-left transition-colors duration-300",
                          isActive ? "bg-black/[0.04]" : "hover:bg-black/[0.025]",
                        )}
                      >
                        <span
                          className={cx(
                            "tech-label shrink-0",
                            isActive ? "text-brand" : "text-ink-muted/50",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cx(
                            "text-[17px] tracking-[-0.02em] transition-colors",
                            isActive ? "text-ink" : "text-ink-muted",
                          )}
                        >
                          {item.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/services"
                className="group mt-6 inline-flex items-center gap-2 px-3 text-sm text-brand"
              >
                All services
                <Arrow />
              </Link>
            </div>

            <div className="flex min-h-[260px] flex-col justify-between p-6 sm:p-8 lg:min-h-[340px] lg:p-10">
              <div>
                <p className="tech-label text-brand/80">Focus</p>
                <h3 className="mt-4 text-[clamp(1.35rem,2.4vw,1.85rem)] font-medium tracking-[-0.025em] text-ink">
                  {current.name}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink-muted">
                  {current.shortDescription}
                </p>
              </div>

              <ul className="mt-10 flex flex-wrap gap-2">
                {current.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-black/10 bg-black/[0.02] px-3.5 py-1.5 text-[12px] tracking-wide text-ink-muted"
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
