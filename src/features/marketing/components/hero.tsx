/**
 * Homepage hero.
 *
 * A server component. Only the entrance timeline (`HeroMotion`) and the device
 * scene's pointer parallax (`HeroScene`) are client-side — the heading, copy and
 * links are plain server-rendered HTML, so the page is meaningful before any
 * JavaScript arrives.
 *
 * Copy is approved brand content from src/lib/config/brand.ts.
 */

import Link from "next/link";

import { HeroMotion } from "@/features/marketing/components/hero-motion";
import { HeroScene } from "@/features/marketing/components/hero-scene";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { hero as heroContent, heroFeatures, stats } from "@/lib/config/brand";

const FEATURE_ICON: Record<string, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" strokeLinejoin="round" />
    </>
  ),
  code: (
    <>
      <path d="m9 8-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15 8 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-28 pb-16 text-light sm:pt-36 sm:pb-20">
      <div aria-hidden="true" className="aurora" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines" />
      {/* Hairline seam into the section below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
      />

      <Container className="relative">
        <HeroMotion>
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              <div data-reveal>
                <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-light-muted">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-bright" />
                  {heroContent.eyebrow}
                </span>
              </div>

              {/* Line-by-line reveal: each line is its own element so the
                  timeline staggers them without splitting text at runtime. */}
              <h1 className="mt-7 text-display font-semibold text-balance">
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

              <p data-reveal className="mt-8 max-w-xl text-lead text-light-muted">
                {heroContent.supporting}
              </p>

              <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
                >
                  Start a project
                  <Arrow />
                </Link>
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-light ring-1 ring-inset ring-hairline-dark transition-colors hover:bg-white/5"
                >
                  Explore our work
                  <Arrow />
                </Link>
              </div>

              <ul data-reveal className="mt-12 grid gap-6 sm:grid-cols-3">
                {heroFeatures.map((feature) => (
                  <li key={feature.title}>
                    <span className="glass inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-bright">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        aria-hidden="true"
                      >
                        {FEATURE_ICON[feature.icon]}
                      </svg>
                    </span>
                    <h2 className="mt-3 text-sm font-semibold text-light">{feature.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-light-muted">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="flex justify-center lg:justify-end">
              <HeroScene />
            </div>
          </div>

          {/* Stats bar — honest, non-metric figures (see brand.ts). */}
          <div
            data-reveal
            className="glass-strong mt-16 grid grid-cols-2 gap-8 rounded-3xl px-8 py-8 sm:mt-20 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:items-center lg:gap-6"
          >
            <p className="text-sm font-medium text-light-muted lg:max-w-[10rem]">
              What the engagement actually looks like
            </p>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-semibold text-aurora">{stat.value}</div>
                <div className="mt-1 text-xs leading-snug text-light-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </HeroMotion>
      </Container>
    </section>
  );
}
