import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/config/metadata";

import {
  Arrow,
  Container,
  PageIntro,
} from "@/features/marketing/components/layout";
import { ItemListJsonLd } from "@/features/marketing/components/structured-data";
import { homeCapabilities } from "@/lib/config/brand";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Technology Capabilities: Strategy to Continuous Engineering",
    description:
      "End-to-end technology engineering across 8 core capability areas: discovery, UX design, web platforms, custom applications, cloud infrastructure, AI integrations, and continuous engineering.",
    path: "/services",
    indexable: true,
  });
}

const DELIVERY_STEPS = [
  {
    step: "01",
    title: "Discovery & Architecture Scoping",
    desc: "We analyze operational bottlenecks, map user journeys, and define data models and API contracts before any code is written.",
  },
  {
    step: "02",
    title: "System Design & Prototyping",
    desc: "Interactive wireframes, user experience flows, and responsive design systems engineered for functional clarity and speed.",
  },
  {
    step: "03",
    title: "Sprint-Based Engineering",
    desc: "Modular TypeScript, full-stack architectures, relational database integrity, and high-frequency code reviews.",
  },
  {
    step: "04",
    title: "Verification & Automated QA",
    desc: "Strict automated linting, type-safety guarantees, integration tests, and security hardening against OWASP guidelines.",
  },
  {
    step: "05",
    title: "Deployment & Proactive Care",
    desc: "Automated zero-downtime releases, real-time uptime monitoring, application telemetry, and ongoing feature evolution.",
  },
];

const ENGAGEMENT_MODELS = [
  {
    title: "Full-Cycle Product Engineering",
    badge: "Turnkey Execution",
    desc: "From problem scoping and system architecture through UX design, backend engineering, cloud deployment, and post-launch maintenance.",
    points: [
      "Fixed milestone deliverables with clear roadmaps",
      "End-to-end responsibility across design, code, and infra",
      "Direct communication with technical leads",
    ],
  },
  {
    title: "Dedicated Engineering Squad",
    badge: "Scale Your Team",
    desc: "Senior engineering capacity embedded into your technical roadmap, delivering continuous feature development and architectural acceleration.",
    points: [
      "Full-stack, cloud, and AI engineering expertise",
      "Clean integration into your sprint and deployment cadence",
      "Transparent progress tracking and code reviews",
    ],
  },
  {
    title: "Architecture & System Modernization",
    badge: "Technical Advisory",
    desc: "Modernize legacy systems, unblock database bottlenecks, integrate automated workflows, and build resilient cloud infrastructure.",
    points: [
      "Codebase and infrastructure security audits",
      "Microservices and API decoupling strategies",
      "Cloud migration, containerization, and cost optimization",
    ],
  },
];

export default async function ServicesPage() {
  return (
    <>
      <ItemListJsonLd
        name="Services"
        path="/services"
        items={homeCapabilities.map((s) => ({ name: s.name, href: `/services#${s.slug}` }))}
      />
      {/* Compact, elegant header matching projects page */}
      <section className="relative px-5 pt-28 pb-6 sm:px-8 sm:pt-32 sm:pb-8 text-ink">
        <Container className="max-w-[1320px]">
          <span className="tech-label text-brand uppercase tracking-wider text-xs font-semibold">
            Capabilities & Solutions
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink max-w-4xl text-balance">
            Engineering digital systems with discipline and precision
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-muted max-w-3xl leading-relaxed">
            We design and build bespoke software, web platforms, cloud architecture, and applied AI systems — engineered around real-world business requirements with structured delivery and long-term commitment.
          </p>
        </Container>
      </section>

      {/* 01 — Comprehensive Services Breakdown */}
      <section className="relative px-5 pb-20 sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="mb-10 max-w-[760px]">
            <p className="tech-label text-brand">Core Services</p>
            <h2 className="mt-4 text-h2 font-normal text-ink">
              End-to-end technical capabilities across the digital lifecycle
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              Every service is delivered with engineering rigour — focusing on maintainability, performance, security, and measurable business outcomes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {homeCapabilities.map((group, index) => (
              <div
                key={group.slug}
                id={group.slug}
                className="mcx-card flex flex-col justify-between p-7 sm:p-9"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="tech-label text-brand">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[11px] font-medium text-ink-muted">
                      Capability
                    </span>
                  </div>

                  <h3 className="mt-4 text-h3 font-medium tracking-[-0.02em] text-ink">
                    {group.name}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-muted">
                    {group.shortDescription}
                  </p>

                  {/* Highlights deep dive */}
                  <div className="mt-6 space-y-3.5 border-t border-hairline-light pt-6">
                    {group.highlights.map((highlight) => (
                      <div key={highlight.title} className="text-sm">
                        <span className="font-semibold text-ink">{highlight.title}: </span>
                        <span className="leading-relaxed text-ink-muted">{highlight.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-hairline-light pt-5">
                  <p className="tech-label text-[11px] text-brand">Core Technologies & Methods</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-brand/15 bg-brand/[0.04] px-3 py-1 text-[12px] font-medium text-ink"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 02 — Delivery Model */}
      <section className="relative px-5 py-20 bg-black/[0.015] sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="mb-12 max-w-[760px]">
            <p className="tech-label text-brand">How We Work</p>
            <h2 className="mt-4 text-h2 font-normal text-ink">
              Structured delivery from problem discovery to continuous care
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              We do not believe in opaque development cycles. Our engagements follow an iterative, transparent engineering process with tangible milestones at every phase.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {DELIVERY_STEPS.map((step) => (
              <div key={step.step} className="mcx-card flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <span className="tech-label text-brand text-[13px]">
                    Phase {step.step}
                  </span>
                  <h3 className="mt-3 text-[17px] font-medium tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 03 — Engagement Models */}
      <section className="relative px-5 py-20 sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="mb-12 max-w-[760px]">
            <p className="tech-label text-brand">Engagement Options</p>
            <h2 className="mt-4 text-h2 font-normal text-ink">
              Flexible collaboration tailored to your organization
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              Whether you need end-to-end execution of a greenfield platform or specialized engineering reinforcements for existing infrastructure.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ENGAGEMENT_MODELS.map((model) => (
              <div key={model.title} className="mcx-card flex flex-col justify-between p-7 sm:p-8">
                <div>
                  <span className="tech-label text-brand text-[11px]">
                    {model.badge}
                  </span>
                  <h3 className="mt-3 text-[20px] font-medium tracking-[-0.02em] text-ink">
                    {model.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">
                    {model.desc}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-hairline-light pt-5 text-[13.5px] text-ink-muted">
                    {model.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="text-brand font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-hairline-light pt-6">
                  <Link
                    href="/start-a-project"
                    className="btn-solid inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-[13.5px] font-medium"
                  >
                    Start a conversation
                    <Arrow />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CMS services listing commented out for now as requested
      <PageBody>
        <Container className="py-10">
          <h2 className="text-h3 font-semibold text-ink">All services</h2>
          <p className="mt-2 max-w-[42ch] text-sm text-ink-muted">
            Individual capabilities from the CMS. Open any service for detail.
          </p>
          <div className="mt-8">
            <PublicEmptyState
              title="No published services yet"
              description="Services appear here once they are published in the admin CMS."
            />
          </div>
        </Container>
      </PageBody>
      */}
    </>
  );
}
