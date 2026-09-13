import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/config/metadata";
import {
  Arrow,
  Container,
  Section,
  SectionHeader,
  TechLabel,
} from "@/features/marketing/components/layout";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { coreValues, process } from "@/lib/config/brand";
import { getActiveIndustries, getPublishedServices } from "@/features/content/services/content";

export const metadata: Metadata = pageMetadata({
  title: "About Us: Technology Solutions & Engineering Partner",
  description:
    "MarineCloudX is a technology solutions and engineering partner designing, building, and maintaining bespoke digital products, web platforms, and intelligent cloud systems around real business requirements.",
  path: "/about",
});

const METRICS = [
  {
    value: "100%",
    label: "Production Cloud Reliability",
    detail: "Serverless AWS Lambda & containerized edge architecture engineered for high availability and low latency.",
  },
  {
    value: "3",
    label: "Active Industry Domains",
    detail: "Production platforms across Architecture & Interiors, Education & EdTech, and Gourmet Agritech Produce.",
  },
  {
    value: "Full-Cycle",
    label: "End-to-End Ownership",
    detail: "Direct accountability across discovery, system design, full-stack engineering, and proactive DevOps SLA care.",
  },
  {
    value: "Zero-Bloat",
    label: "Direct Technical Squad",
    detail: "Work directly with senior technical architects and full-stack engineers without layers of agency account management.",
  },
];

const PROVEN_SYSTEMS = [
  {
    title: "SM Interiors — High-End Studio & Architectural Platform",
    shortTitle: "SM Interiors",
    domain: "Architecture & Interiors",
    slug: "sm-interiors",
    statusBadge: "Delivered & Actively Maintained",
    statusColor: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-400",
    dotColor: "bg-teal-500",
    description:
      "Full-stack architectural platform featuring AWS Lambda serverless hosting, WhatsApp customer automation, interactive Bhimavaram live studio maps, and an AI-driven admin panel for business recommendations.",
    technologies: ["AWS Lambda", "Next.js", "WhatsApp API", "Interactive Maps", "PostgreSQL"],
    href: "/projects/sm-interiors",
  },
  {
    title: "Apex School Management & AI Fee Recovery CRM",
    shortTitle: "Apex School CRM",
    domain: "Education & EdTech",
    slug: "apex-school-management-crm",
    statusBadge: "Development In-Progress",
    statusColor: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    dotColor: "bg-sky-500",
    description:
      "Comprehensive educational CRM with standard-wise student categorization, annual fee lifecycle management, and predictive AI payment recommendations with automated WhatsApp and email reminders.",
    technologies: ["React", "TypeScript", "Next.js", "AI Notifications", "PostgreSQL"],
    href: "/projects/apex-school-management-crm",
  },
  {
    title: "Vijaya — Premium Dry Fruits & B2B Wholesale Portal",
    shortTitle: "Vijaya Dry Fruits",
    domain: "Agritech & Fresh Produce",
    slug: "vijaya-dry-fruits",
    statusBadge: "Committed — In Development",
    statusColor: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dotColor: "bg-amber-500",
    description:
      "Direct-from-orchard luxury dry fruits storefront and wholesale administrative portal with dynamic B2B volume-tier pricing, batch freshness provenance, and cold-storage inventory controls.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Cold Storage Telemetry", "Tailwind CSS"],
    href: "/projects/vijaya-dry-fruits",
  },
];

export default async function AboutPage() {
  const [services, industries] = await Promise.all([
    getPublishedServices().catch(() => []),
    getActiveIndustries().catch(() => []),
  ]);

  return (
    <>
      {/* 01 — Compact, Consistent Header (Matches Projects, Services & Industries) */}
      <section className="relative px-5 pt-28 pb-6 sm:px-8 sm:pt-32 sm:pb-8 text-ink">
        <Container className="max-w-[1320px]">
          <span className="tech-label text-brand uppercase tracking-wider text-xs font-semibold">
            About MarineCloudX
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink max-w-4xl text-balance">
            Engineering digital platforms around real business requirements
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-muted max-w-3xl leading-relaxed">
            We are a technology solutions and engineering partner designing, building, and operating high-performance digital products, bespoke enterprise applications, and intelligent cloud systems.
          </p>
        </Container>
      </section>

      {/* 02 — Metrics & Impact Band */}
      <section className="relative px-5 py-6 sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="mcx-card flex flex-col justify-between p-6 transition-transform hover:-translate-y-0.5 duration-200"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-brand">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">
                    {metric.label}
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 03 — Who We Are & Our Philosophy (Aligned Headers & Paragraphs) */}
      <section className="relative px-5 py-16 sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="mb-10 max-w-[760px]">
            <p className="tech-label text-brand">Our Mission &amp; DNA</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Built for businesses that require real engineering, not generic templates
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed">
              We reject technical bloat, off-the-shelf compromises, and disconnected agency hand-offs. We take end-to-end technical responsibility for the platforms we build.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Card 1: Engineering Philosophy */}
            <div className="mcx-card flex flex-col justify-between p-7 sm:p-9">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="tech-label text-brand text-xs">/01 ARCHITECTURE &amp; FOCUS</span>
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-0.5 text-[11px] font-medium text-ink-muted">
                    Problem-First
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-ink">
                  Understanding the problem before writing a line of code
                </h3>

                <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-ink-muted">
                  <p>
                    Every system we build starts by analyzing how data and work actually flow through your organization. We map the operational workflows, isolate manual friction points, and identify where custom software and automation will generate durable leverage.
                  </p>
                  <p>
                    Technology choices follow the requirements, not industry fashion. We select battle-tested relational models in PostgreSQL, type-safe Next.js frontend interfaces, and serverless or containerized cloud backends configured for long-term maintainability.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-hairline-light pt-5">
                <p className="tech-label text-[11px] text-brand">Core Principles</p>
                <ul className="mt-3 space-y-2 text-xs font-medium text-ink">
                  <li className="flex items-center gap-2">
                    <span className="text-brand font-bold">✓</span> Strict type-safety, modular APIs, and relational integrity
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand font-bold">✓</span> Cloud-native serverless architecture with zero redundant overhead
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand font-bold">✓</span> Event-driven WhatsApp, voice AI, and multi-channel automations
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Where We Are Going */}
            <div className="mcx-card flex flex-col justify-between p-7 sm:p-9">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="tech-label text-brand text-xs">/02 LONG-TERM PARTNERSHIP</span>
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-0.5 text-[11px] font-medium text-ink-muted">
                    Continuous Care
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-ink">
                  Building compounding, high-reliability technology relationships
                </h3>

                <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-ink-muted">
                  <p>
                    MarineCloudX is intentionally built for long-term technology engagements. We partner with ambitious organizations as their dedicated digital engineering team, modernizing legacy bottlenecks and advancing digital products as customer demands grow.
                  </p>
                  <p>
                    To us, deployment is day one. We stay embedded to monitor production telemetry, harden infrastructure against security vulnerabilities, tune database performance, and release continuous feature updates through disciplined sprints.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-hairline-light pt-5">
                <p className="tech-label text-[11px] text-brand">Long-Term Commitment</p>
                <ul className="mt-3 space-y-2 text-xs font-medium text-ink">
                  <li className="flex items-center gap-2">
                    <span className="text-brand font-bold">✓</span> Proactive 24/7 telemetry, error logging, and health checks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand font-bold">✓</span> Continuous feature engineering aligned to business milestones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand font-bold">✓</span> Provider-agnostic AI integration gateways and custom connectors
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 04 — Proven Systems in the Field (Showcasing Real Domains) */}
      <section className="relative px-5 py-16 bg-black/[0.015] sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="mb-10 max-w-[760px]">
            <p className="tech-label text-brand">Production Systems</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Verified domain platforms engineered for production
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed">
              We validate our engineering through real platforms operating in the field — solving distinct operational, administrative, and commercial challenges.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PROVEN_SYSTEMS.map((system) => (
              <div
                key={system.slug}
                className="mcx-card flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="tech-label text-[11px] uppercase tracking-wider text-ink-muted">
                      {system.domain}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold ${system.statusColor}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${system.dotColor}`} />
                      {system.statusBadge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-ink leading-snug">
                    {system.shortTitle}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-ink-muted line-clamp-4">
                    {system.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {system.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[10.5px] font-medium text-ink-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-hairline-light pt-4">
                  <Link
                    href={system.href}
                    className="group inline-flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                  >
                    <span>View Project Architecture</span>
                    <Arrow />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 05 — Core Engineering Values (Dark Aurora Section) */}
      <Section tone="dark" grid aurora size="compact">
        <Container className="max-w-[1320px]">
          <SectionHeader
            index="01"
            eyebrow="Core Values &amp; Standards"
            tone="dark"
            title="How we work and engineer"
            description="Our engineering culture is grounded in discipline, architectural integrity, and clear accountability."
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <li key={value.title} className="glass rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <span className="tech-label text-brand-soft text-xs">
                    /{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-light">{value.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-light-muted">{value.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 06 — 6-Stage Delivery Pipeline */}
      <section className="relative px-5 py-16 sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="mb-10 max-w-[760px]">
            <p className="tech-label text-brand">Delivery Methodology</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Structured 6-stage engineering cadence
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed">
              Every project follows an inspectable, transparent progression from discovery to continuous production evolution.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((stage, index) => (
              <div
                key={stage.title}
                className="mcx-card p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="tech-label text-brand text-xs font-semibold">
                    STAGE {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 07 — Capabilities & Industry Directory */}
      <section className="relative px-5 py-14 bg-black/[0.015] sm:px-8">
        <Container className="max-w-[1320px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="tech-label text-brand">Our Capabilities</p>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-ink">
                Full-spectrum technical capabilities
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              <span>Explore all services</span>
              <Arrow />
            </Link>
          </div>

          {services.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="mcx-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 group block"
                >
                  <p className="text-xs font-semibold text-ink group-hover:text-brand transition-colors">
                    {service.name}
                  </p>
                  {service.shortDescription && (
                    <p className="mt-1.5 text-[11px] text-ink-muted line-clamp-2">
                      {service.shortDescription}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {industries.length > 0 && (
            <div className="mt-10 border-t border-hairline-light pt-6">
              <p className="tech-label text-[11px] text-brand">Industry Experience</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <li key={industry.slug}>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
                    >
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {/* 08 — Final CTA */}
      <FinalCta />
    </>
  );
}
