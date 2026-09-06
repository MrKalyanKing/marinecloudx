import Link from "next/link";

import { CapabilitiesStage } from "@/features/marketing/components/capabilities-stage";
import { CtaGlobe } from "@/features/marketing/components/cta-globe";
import { FaqAccordion } from "@/features/marketing/components/faq-accordion";
import { Hero } from "@/features/marketing/components/hero";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { FaqJsonLd } from "@/features/marketing/components/structured-data";
import { ProcessStage } from "@/features/marketing/components/process-stage";
import { ScrollNarrative } from "@/features/marketing/components/scroll-narrative";
import { SystemDiagram } from "@/features/marketing/components/system-diagram";
import {
  brand,
  finalCta,
  homeCapabilities,
  homeEvidence,
  homeFaqs,
  homePhilosophy,
  homeProcess,
  solutions,
  trustPillars,
  whyPoints,
} from "@/lib/config/brand";

/**
 * Homepage narrative order (from feature/UI-version-1):
 * Belief → Method → Problems → Capabilities → Architecture → Delivery → Trust → FAQ → CTA
 */
export default function HomePage() {
  return (
    <>
      {/* Organization and WebSite now come from the public layout, so they are
          on every route rather than this one. What is specific to this page is
          the FAQ section below: five real published answers that were rendered
          as plain text and described to search engines as nothing at all. */}
      <FaqJsonLd faqs={homeFaqs} path="/" />
      <ScrollNarrative>
        <Hero />

        {/* 01 — Philosophy */}
        <section id="about" className="relative px-5 py-[clamp(80px,12vh,150px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="max-w-[840px]">
              <p className="tech-label text-brand">01&nbsp;&nbsp;Philosophy</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">{homePhilosophy.heading}</h2>
              <p className="mt-6 max-w-[600px] text-lead text-ink-muted">{homePhilosophy.body}</p>
              <p className="tech-label mt-8 text-brand">{brand.philosophy}</p>
            </div>
          </Container>
        </section>

        {/* 02 — Why */}
        <section id="why" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(36px,5vw,64px)] max-w-[760px]">
              <p className="tech-label text-brand">02&nbsp;&nbsp;Why MarineCloudX</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">We understand why you need it</h2>
              <p className="mt-5 text-lead text-ink-muted">
                Most technology fails because it answered the wrong question. We start earlier than
                the build.
              </p>
            </div>

            {/* These six were plain text separated by hairline rules, which read
                as an unstyled list next to the card grids above and below them.
                They are the same card surface as the rest of the page now, so
                the section has the same weight as its neighbours. */}
            <ol data-reveal-stage className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyPoints.map((point, index) => (
                <li key={point.title} className="mcx-card flex flex-col p-6 sm:p-7">
                  <span className="tech-label text-brand">
                    /{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-h3 font-medium tracking-[-0.02em] text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    {point.description}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* 03 — Solutions */}
        <section id="solutions" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(30px,4vw,52px)] max-w-[720px]">
              <p className="tech-label text-brand">03&nbsp;&nbsp;Solutions</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">Problems we help solve</h2>
              <p className="mt-5 text-lead text-ink-muted">
                Services are what we build. Solutions are the business problems behind them — usually
                solved with several capabilities together.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {solutions.map((solution) => (
                <article key={solution.title} data-reveal-stage className="mcx-card flex flex-col p-7 sm:p-8">
                  <h3 className="text-h3 font-medium tracking-[-0.02em] text-ink">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{solution.problem}</p>
                  <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {solution.flow.map((step, stepIndex) => (
                      <li key={step} className="flex items-center gap-2">
                        <span className="tech-label text-ink">{step}</span>
                        {stepIndex < solution.flow.length - 1 ? (
                          <span aria-hidden="true" className="text-brand">
                            →
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                    {solution.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-xs text-ink-muted"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* 04 — Capabilities */}
        <CapabilitiesStage items={[...homeCapabilities]} />

        {/* 05 — Architecture */}
        <section id="system" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(40px,6vw,72px)] max-w-[760px]">
              <p className="tech-label text-brand">05&nbsp;&nbsp;The system</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">
                One architecture, six moving parts.
              </h2>
            </div>
            <div data-reveal-stage>
              <SystemDiagram />
            </div>
          </Container>
        </section>

        {/* 06 — Process */}
        <ProcessStage stages={[...homeProcess]} />

        {/* 07 — Trust */}
        <section id="trust" className="relative px-5 py-[clamp(72px,12vh,140px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(32px,4vw,56px)] max-w-[700px]">
              <p className="tech-label text-brand">07&nbsp;&nbsp;Working with us</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">What you can expect</h2>
              <p className="mt-5 text-lead text-ink-muted">
                No logos, no awards, no statistics — just how we run the work.
              </p>
            </div>

            <div data-reveal-stage className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustPillars.map((pillar) => (
                <div key={pillar.title} className="mcx-card flex min-h-[160px] flex-col gap-3 p-6 sm:p-7">
                  <h3 className="text-h3 font-medium tracking-[-0.02em] text-ink">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{pillar.description}</p>
                </div>
              ))}
            </div>

            <div data-reveal-stage className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {homeEvidence.map((item) => (
                <div key={item.title} className="mcx-card p-5 sm:p-6">
                  <p className="tech-label text-[10px] text-brand">{item.label}</p>
                  <h3 className="mt-3 text-[16px] font-medium tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 08 — FAQ */}
        <section id="faq" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
          <Container className="max-w-[920px]">
            <div data-reveal-stage className="mb-[clamp(26px,3vw,44px)] flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[700px]">
                <p className="tech-label text-brand">08&nbsp;&nbsp;FAQ</p>
                <h2 className="mt-6 text-h2 font-normal text-ink">
                  You don&apos;t need to know the technology
                </h2>
                <p className="mt-5 text-lead text-ink-muted">
                  Tell us the problem. These are the questions we are asked most.
                </p>
              </div>
              <Link href="/faq" className="group inline-flex items-center gap-2 text-sm text-brand">
                All questions
                <Arrow />
              </Link>
            </div>
            <div data-reveal-stage className="mcx-card px-5 sm:px-7">
              <FaqAccordion tone="paper" items={[...homeFaqs]} />
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="relative px-5 py-[clamp(40px,8vh,100px)] pb-[clamp(90px,14vh,160px)] sm:px-8"
        >
          <Container className="max-w-[900px]">
            <div
              data-reveal-stage
              className="cta-band relative z-0 flex flex-col items-center px-8 py-14 text-center sm:px-12 sm:py-20"
            >
              <CtaGlobe />
              <h2 className="relative z-[1] text-h1 font-normal text-balance text-white">
                {finalCta.heading}
              </h2>
              <p className="relative z-[1] mt-6 max-w-[480px] text-lead text-white/65">
                Tell us what you&apos;re trying to build, improve or automate.
              </p>
              <Link
                href="/start-a-project"
                className="cta-band__btn relative z-[1] mt-[clamp(30px,4vw,44px)]"
              >
                Start a project
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Container>
        </section>
      </ScrollNarrative>
    </>
  );
}
