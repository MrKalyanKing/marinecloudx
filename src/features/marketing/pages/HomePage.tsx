import type { Metadata } from "next";

import { CapabilitiesAccordion } from "@/features/marketing/components/capabilities-accordion";
import { ContactForm } from "@/features/marketing/components/contact-form";
import { FaqAccordion } from "@/features/marketing/components/faq-accordion";
import { Hero } from "@/features/marketing/components/hero";
import { ActionLink, Container } from "@/features/marketing/components/layout";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { OrganizationJsonLd } from "@/features/marketing/components/structured-data";
import { SystemDiagram } from "@/features/marketing/components/system-diagram";
import { getPublishedServices } from "@/features/content/services/content";
import { siteConfig } from "@/lib/config/site";
import {
  brand,
  finalCta,
  hero,
  homeCapabilities,
  homeFaqs,
  homePhilosophy,
  homeProcess,
  process,
  solutions,
  trustPillars,
  whyPoints,
} from "@/lib/config/brand";

// Only the fields that differ from the root layout. openGraph / twitter /
// the file-convention OG image are inherited — redeclaring them here would
// drop the shared image and the large summary card.
export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description: hero.supporting,
  alternates: { canonical: "/" },
};

/**
 * Homepage narrative order (problem-first):
 * Belief → Method → Problems → Capabilities → Architecture → Delivery → Trust → FAQ → Contact
 *
 * The Contact form is embedded directly in this last section (rather than
 * just linking to /contact) so a visitor can start a project without
 * leaving the page — it sits immediately above the footer.
 */
export default async function HomePage() {
  const services = await getPublishedServices();
  return (
    <>
      <OrganizationJsonLd />
      <Hero />

      {/* 01 — Philosophy: belief */}
      <section id="about" className="relative px-5 py-[clamp(80px,12vh,150px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="max-w-[840px]">
              <div className="tech-label text-brand-bright/85">01&nbsp;&nbsp;Philosophy</div>
              <h2 className="mt-6 text-h2 font-normal">
                {homePhilosophy.heading}
              </h2>
              <p className="mt-6 max-w-[600px] text-lead text-light-muted">{homePhilosophy.body}</p>
              <p className="tech-label mt-8 text-brand-bright/70">{brand.philosophy}</p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* 02 — Why: method before product */}
      <section id="why" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(36px,5vw,64px)] max-w-[760px]">
              <div className="tech-label text-brand-bright/85">02&nbsp;&nbsp;Why MarineCloudX</div>
              <h2 className="mt-6 text-h2 font-normal">We understand why you need it</h2>
              <p className="mt-5 text-lead text-light-muted">
                Most technology fails because it answered the wrong question. We start earlier than
                the build.
              </p>
            </div>

            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {whyPoints.map((point, index) => (
                <li key={point.title} className="border-t border-white/10 pt-5">
                  <span className="tech-label text-brand-bright">
                    /{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-h3 font-medium tracking-[-0.02em] text-light">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-light-muted">
                    {point.description}
                  </p>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </Container>
      </section>

      {/* 03 — Solutions: business problems first */}
      <section id="solutions" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(30px,4vw,52px)] max-w-[720px]">
              <div className="tech-label text-brand-bright/85">03&nbsp;&nbsp;Solutions</div>
              <h2 className="mt-6 text-h2 font-normal">Problems we help solve</h2>
              <p className="mt-5 text-lead text-light-muted">
                Services are what we build. Solutions are the business problems behind them — usually
                solved with several capabilities together.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {solutions.map((solution) => (
                <article
                  key={solution.title}
                  className="glass-strong flex flex-col rounded-2xl p-7 sm:p-8"
                >
                  <h3 className="text-h3 font-medium tracking-[-0.02em] text-light">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-light-muted">
                    {solution.problem}
                  </p>

                  <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {solution.flow.map((step, stepIndex) => (
                      <li key={step} className="flex items-center gap-2">
                        <span className="tech-label text-light">{step}</span>
                        {stepIndex < solution.flow.length - 1 ? (
                          <span aria-hidden="true" className="text-brand-bright">
                            →
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {solution.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-light-muted"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* 04 — Capabilities: how we answer those problems */}
      <section id="capabilities" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(30px,4vw,48px)] max-w-[720px]">
              <div className="tech-label text-brand-bright/85">04&nbsp;&nbsp;Capabilities</div>
              <h2 className="mt-6 text-h2 font-normal">What we engineer</h2>
              <p className="mt-5 text-lead text-light-muted">
                Hover a capability to see the stack behind it — problem first, tools second.
              </p>
            </div>

            <CapabilitiesAccordion items={[...homeCapabilities]} />
            <p className="mt-6 max-w-[560px] text-sm leading-[1.7] text-light-muted/78">
              Blockchain and cybersecurity are engineered into the systems that need them, not sold
              as separate line items.
            </p>
            <div className="mt-6">
              <ActionLink href="/services" variant="ghost" tone="dark">
                All services
              </ActionLink>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* 05 — System: architecture for technical buyers */}
      <section
        id="system"
        className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8"
      >
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(40px,6vw,72px)] max-w-[760px]">
              <div className="tech-label text-brand-bright/85">05&nbsp;&nbsp;The system</div>
              <h2 className="mt-6 text-h2 font-normal">One architecture, six moving parts.</h2>
            </div>
          </ScrollReveal>
          <SystemDiagram />
        </Container>
      </section>

      {/* 06 — How we build */}
      <section id="process" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(36px,5vw,60px)] max-w-[760px]">
              <div className="tech-label text-brand-bright/85">06&nbsp;&nbsp;How we build</div>
              <h2 className="mt-6 text-h2 font-normal">
                We don&apos;t just write code. We engineer systems.
              </h2>
            </div>

            <ol className="grid gap-8 sm:grid-cols-5 sm:gap-0">
              {homeProcess.map((stage, index) => (
                <li
                  key={stage.title}
                  className="relative border-t border-white/10 pt-6 sm:border-t-0 sm:border-l sm:border-white/10 sm:pt-0 sm:pl-5 first:sm:border-l-0 first:sm:pl-0"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-bright/35 bg-brand-bright/10 font-mono text-[11px] tracking-[0.08em] text-brand-bright">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {index < homeProcess.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="hidden h-px flex-1 bg-gradient-to-r from-brand-bright/40 to-transparent sm:block"
                      />
                    ) : null}
                  </div>
                  <h3 className="text-[18px] tracking-[-0.02em] font-medium text-light">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.6] text-light-muted sm:max-w-[200px]">
                    {stage.description}
                  </p>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </Container>
      </section>

      {/* 07 — Working with us */}
      <section id="trust" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(32px,4vw,56px)] max-w-[700px]">
              <div className="tech-label text-brand-bright/85">07&nbsp;&nbsp;Working with us</div>
              <h2 className="mt-6 text-h2 font-normal">What you can expect</h2>
              <p className="mt-5 text-lead text-light-muted">
                No logos, no awards, no statistics — just how we run the work.
              </p>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {trustPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="glass-strong flex min-h-[160px] flex-col gap-3 rounded-2xl p-6 sm:p-7"
                >
                  <h3 className="text-h3 font-medium tracking-[-0.02em] text-light">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-light-muted">{pillar.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* 08 — FAQ */}
      <section id="faq" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(26px,3vw,44px)] flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[700px]">
                <div className="tech-label text-brand-bright/85">08&nbsp;&nbsp;FAQ</div>
                <h2 className="mt-6 text-h2 font-normal">
                  You don&apos;t need to know the technology
                </h2>
                <p className="mt-5 text-lead text-light-muted">
                  Tell us the problem. These are the questions we are asked most.
                </p>
              </div>
              <ActionLink href="/faq" variant="ghost" tone="dark">
                All questions
              </ActionLink>
            </div>

            <FaqAccordion tone="dark" items={[...homeFaqs]} />
          </ScrollReveal>
        </Container>
      </section>

      {/* Contact — embedded directly above the footer */}
      <section
        id="contact"
        className="relative px-5 py-[clamp(40px,8vh,100px)] pb-[clamp(90px,14vh,160px)] sm:px-8"
      >
        <Container className="max-w-[1320px]">
          <ScrollReveal>
            <div className="mb-[clamp(36px,5vw,56px)] max-w-[760px]">
              <div className="tech-label text-brand-bright/85">09&nbsp;&nbsp;Contact</div>
              <h2 className="mt-6 text-h2 font-normal text-balance">{finalCta.heading}</h2>
              <p className="mt-5 text-lead text-light-muted">{finalCta.supporting}</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <div className="glass-strong rounded-3xl p-6 sm:p-10">
                <ContactForm onDark services={services.map((s) => ({ id: s.id, name: s.name }))} />
              </div>

              <aside className="lg:pt-2">
                <div className="tech-label text-brand-bright/85">What happens next</div>

                <ol className="mt-6 border-t border-white/10">
                  {process.slice(0, 3).map((stage, index) => (
                    <li key={stage.title} className="border-b border-white/10 py-4">
                      <span className="tech-label text-brand-bright">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 font-medium text-light">{stage.title}</p>
                      <p className="mt-1 text-sm text-light-muted">{stage.description}</p>
                    </li>
                  ))}
                </ol>

                <p className="mt-8 text-sm text-light-muted">{finalCta.line}</p>
              </aside>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
