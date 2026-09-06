/**
 * Landing hero.
 *
 * ## The layout problem this fixes
 *
 * The section used to be `min-h-[100svh]` with the ribbon pinned
 * `absolute bottom-0`. On any viewport taller than the content — which is most
 * desktops — that left a screen-height band of empty page between the stats
 * panel and the artwork, and the hero read as two unrelated pieces separated by
 * a void.
 *
 * The section is now sized by its content. The ribbon sits in normal flow
 * directly beneath the copy and is pulled up under the glass panel with a
 * negative margin, so the panel floats over the artwork. That overlap is the
 * point: glass only looks like glass when there is something worth refracting
 * behind it, and the ribbon is the most colourful thing on the page.
 */

import Link from "next/link";

import { HeroRibbon } from "@/features/marketing/components/hero-ribbon";
import { HeroStatsBand } from "@/features/marketing/components/hero-stats-band";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { hero as heroContent } from "@/lib/config/brand";

export function Hero() {
  return (
    // The bottom padding is what leaves the ribbon visible *below* the glass
    // panel. Without it the panel covers the middle of the wave and only two
    // slivers show at the edges — which is exactly how it looked on a phone.
    <section className="relative isolate overflow-x-clip pt-28 pb-[clamp(150px,34vw,240px)] sm:pt-36 sm:pb-[clamp(140px,16vw,220px)]">
      {/* The ribbon is a sibling behind the content rather than a background of
          it, so its height is its own and the copy never has to fit inside it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
      >
        <HeroRibbon />
      </div>

      <Container className="relative z-10 w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-[660px]">
          <span className="glass glass-rim inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium text-ink-muted">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #ff5ca8, #6d5cff, #43a7ff)",
                boxShadow: "0 0 10px rgb(109 92 255 / 0.55)",
              }}
            />
            {heroContent.eyebrow}
          </span>

          <h1 className="mt-7 text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-ink">
            {heroContent.headingLines.map((line, index) => (
              <span key={line} className="block">
                {index === heroContent.headingLines.length - 1 ? (
                  <span className="text-aurora">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed font-medium text-ink-muted sm:text-[17.5px]">
            {heroContent.supporting}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/start-a-project"
              className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium"
            >
              Start a project
              <span aria-hidden="true" className="opacity-80">
                <Arrow />
              </span>
            </Link>
            <Link
              href="/projects"
              className="btn-light-ghost group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px]"
            >
              Explore our work
              <span aria-hidden="true" className="opacity-55">
                <Arrow />
              </span>
            </Link>
          </div>
        </div>

        {/* Overlaps the ribbon below it. `relative` keeps it above the artwork
            without a z-index race, since it comes later in the same stacking
            context. */}
        <div className="relative mt-12 sm:mt-16">
          <HeroStatsBand />
        </div>
      </Container>
    </section>
  );
}
