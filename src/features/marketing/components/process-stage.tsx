/**
 * Engineering process — all stages visible at once.
 */

import type { homeProcess } from "@/lib/config/brand";

type Stage = (typeof homeProcess)[number];

export function ProcessStage({ stages }: { stages: readonly Stage[] | Stage[] }) {
  return (
    <section id="process" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 max-w-[760px] sm:mb-12">
          <p className="tech-label text-brand-bright/85">06&nbsp;&nbsp;How we build</p>
          <h2 className="mt-6 text-h2 font-normal text-ink">
            We don&apos;t just write code. We engineer systems.
          </h2>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-5">
          {stages.map((stage, index) => (
            <li key={stage.title} className="mcx-card p-5 sm:p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/30 bg-brand/10 font-mono text-[12px] tracking-[0.1em] text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em] text-ink">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
