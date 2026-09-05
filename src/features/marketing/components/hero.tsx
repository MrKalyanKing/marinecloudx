/**
 * Homepage hero — fills the full viewport (no empty bands).
 *
 * Stretch layout: copy + Marine Core share the height under the nav.
 */

import Link from "next/link";

import { HeroMotion } from "@/features/marketing/components/hero-motion";
import { MarineCore } from "@/features/marketing/components/marine-core";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { hero as heroContent } from "@/lib/config/brand";

export function Hero() {
  return (
    <section className="relative isolate flex h-[100svh] max-h-[100svh] flex-col overflow-hidden px-5 pt-16 pb-4 sm:px-8 sm:pt-[4.25rem] sm:pb-5">
      <Container className="relative flex min-h-0 w-full max-w-[1320px] flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <HeroMotion>
            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,auto)_minmax(0,1fr)] items-stretch gap-3 lg:grid-cols-2 lg:grid-rows-1 lg:gap-10 xl:gap-12">
              <div className="flex max-w-[640px] flex-col justify-center gap-7 py-2 lg:h-full lg:justify-between lg:gap-10 lg:py-8 xl:max-w-[680px] xl:py-12">
                <div className="space-y-6 sm:space-y-7">
                  <div data-reveal>
                    <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium text-light-muted sm:text-sm">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-brand-bright shadow-[0_0_8px_rgb(39_220_197_/_0.7)]"
                      />
                      {heroContent.eyebrow}
                    </span>
                  </div>

                  <h1 className="text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
                    {heroContent.headingLines.map((line, index) => (
                      <span key={line} data-reveal className="block">
                        {index === heroContent.headingLines.length - 1 ? (
                          <span className="text-aurora">{line}</span>
                        ) : (
                          line
                        )}
                      </span>
                    ))}
                  </h1>

                  <p data-reveal className="max-w-[520px] text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-relaxed text-light-muted">
                    {heroContent.supporting}
                  </p>
                </div>

                <div data-reveal className="flex flex-wrap gap-3.5">
                  <Link
                    href="/contact"
                    className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium"
                  >
                    Start a project
                    <span aria-hidden="true" className="opacity-70">
                      <Arrow />
                    </span>
                  </Link>
                  <Link
                    href="/projects"
                    className="btn-glass group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px]"
                  >
                    Explore our work
                    <span aria-hidden="true" className="opacity-55">
                      <Arrow />
                    </span>
                  </Link>
                </div>
              </div>

              <div
                data-reveal
                className="relative flex min-h-[220px] items-center justify-center lg:min-h-0 lg:h-full"
              >
                <div className="aspect-square w-full max-w-[min(100%,70vw)] lg:absolute lg:inset-y-2 lg:left-1/2 lg:w-auto lg:max-w-none lg:-translate-x-1/2 lg:aspect-square">
                  <div className="h-full w-full">
                    <MarineCore />
                  </div>
                </div>
              </div>
            </div>
          </HeroMotion>
        </div>
      </Container>
    </section>
  );
}
