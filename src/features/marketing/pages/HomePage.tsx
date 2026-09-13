import Link from "next/link";

import { CapabilitiesStage } from "@/features/marketing/components/capabilities-stage";
import { FaqAccordion } from "@/features/marketing/components/faq-accordion";
import { Hero } from "@/features/marketing/components/hero";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { FaqJsonLd } from "@/features/marketing/components/structured-data";
import { ProcessStage } from "@/features/marketing/components/process-stage";
import { ScrollNarrative } from "@/features/marketing/components/scroll-narrative";
import { SystemDiagram } from "@/features/marketing/components/system-diagram";
import { IndustryExperienceStage } from "@/features/marketing/components/industry-experience-stage";
import {
  brand,
  homeCapabilities,
  homeEvidence,
  homeFaqs,
  homePhilosophy,
  homeProcess,
  homeProjects,
  trustPillars,
  whyPoints,
} from "@/lib/config/brand";

/**
 * Homepage narrative order:
 * Hero & Stats → Philosophy → Method → Industry Experience & Solutions →
 * Core Capabilities → Selected Work (Proof of Range) → System Architecture →
 * 6-Stage Delivery Process → Engineering Standards & Trust → FAQ → CTA
 */
export default function HomePage() {
  return (
    <>
      <FaqJsonLd faqs={homeFaqs} path="/" />
      <ScrollNarrative>
        <Hero />

        {/* 01 — Philosophy */}
        <section id="about" className="relative px-5 py-[clamp(80px,12vh,150px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="max-w-[840px]">
              <p className="tech-label text-brand">01&nbsp;&nbsp;Philosophy</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">{homePhilosophy.heading}</h2>
              <p className="mt-6 max-w-[640px] text-lead text-ink-muted">{homePhilosophy.body}</p>
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
                Most technology fails because it answered the wrong question. We start earlier — analysing operational workflows, users, and the actual business requirement.
              </p>
            </div>

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

        {/* 03 — Industry Experience */}
        <section id="solutions" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(30px,4vw,52px)] flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[760px]">
                <p className="tech-label text-brand">03&nbsp;&nbsp;Industry Experience</p>
                <h2 className="mt-6 text-h2 font-normal text-ink">Industries we understand, engineering that scales</h2>
                <p className="mt-5 text-lead text-ink-muted">
                  Our current work spans Education, Interiors, and Dental — three distinct domains where we have engineered practical software solutions. These implementations demonstrate our ability to understand complex workflows, multi-role user journeys, and operational requirements, with underlying engineering designed to scale for large, enterprise-grade technology engagements.
                </p>
              </div>
              <Link
                href="/industries"
                className="group inline-flex items-center gap-2 text-sm text-brand"
              >
                All industries
                <Arrow />
              </Link>
            </div>

            <IndustryExperienceStage
              items={homeProjects.slice(0, 3)}
              defaultShow={false}
              allowToggle={true}
            />
          </Container>
        </section>

        {/* 04 — Capabilities */}
        <CapabilitiesStage items={[...homeCapabilities]} />

        {/* Selected Work — commented out as requested to keep focus on engineering breadth and domain capability rather than small past projects */}
        {/* <WorkStage projects={homeProjects} /> */}

        {/* 05 — Architecture */}
        <section id="system" className="relative px-5 pb-[clamp(90px,14vh,170px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(40px,6vw,72px)] max-w-[760px]">
              <p className="tech-label text-brand">05&nbsp;&nbsp;System Architecture</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">
                One architecture. Every layer connected.
              </h2>
              <p className="mt-4 text-lead text-ink-muted">
                From user-facing applications and cloud infrastructure to applied AI and system integrations — designed to operate as a coherent system.
              </p>
            </div>
            <div data-reveal-stage>
              <SystemDiagram />
            </div>
          </Container>
        </section>

        {/* 06 — Process */}
        <ProcessStage stages={[...homeProcess]} />

        {/* 07 — Trust & Standards */}
        <section id="trust" className="relative px-5 py-[clamp(72px,12vh,140px)] sm:px-8">
          <Container className="max-w-[1320px]">
            <div data-reveal-stage className="mb-[clamp(32px,4vw,56px)] max-w-[760px]">
              <p className="tech-label text-brand">07&nbsp;&nbsp;Working with us</p>
              <h2 className="mt-6 text-h2 font-normal text-ink">Engineering discipline you can rely on</h2>
              <p className="mt-5 text-lead text-ink-muted">
                Transparent communication, structured delivery milestones, and verified capabilities — how we run every technical engagement.
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
                  Common Questions
                </h2>
                <p className="mt-5 text-lead text-ink-muted">
                  How we start, define architecture, collaborate with your team, and support systems after deployment.
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
        <FinalCta />
      </ScrollNarrative>
    </>
  );
}
