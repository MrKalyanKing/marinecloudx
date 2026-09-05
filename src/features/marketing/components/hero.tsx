/**
 * Landing hero — UI-version-1 content + full-bleed multi-color ribbon.
 * Content is visible immediately (no scroll-gated reveals).
 */

import Link from "next/link";

import { HeroRibbon } from "@/features/marketing/components/hero-ribbon";
import { HeroStatsBand } from "@/features/marketing/components/hero-stats-band";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { hero as heroContent } from "@/lib/config/brand";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-x-clip pt-24 sm:pt-32">
      {/* Full-size background layer — the text overlays it via z-index below
          rather than sharing vertical space with it, so neither has to shrink. */}
      <div className="absolute inset-x-0 bottom-0 z-0 w-full">
        <HeroRibbon />
      </div>

      <Container className="relative z-10 w-full max-w-[1200px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium text-ink-muted">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #ff2d8c, #6d5cff, #28d4ff)",
                boxShadow: "0 0 10px rgb(109 92 255 / 0.55)",
              }}
            />
            {heroContent.eyebrow}
          </span>

          <h1 className="mt-6 text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink text-balance">
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

          <p className="mt-5 font-semibold max-w-[48ch] text-[15.5px] leading-relaxed text-ink sm:text-[17px]">
            {heroContent.supporting}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
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

        <div className="mt-10 sm:mt-12">
          <HeroStatsBand />
        </div>
      </Container>
    </section>
  );
}
