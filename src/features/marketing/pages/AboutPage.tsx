import type { Metadata } from "next";
import Link from "next/link";

import {
  ActionLink,
  Arrow,
  Container,
  PageIntro,
  Section,
  SectionHeader,
  TechLabel,
} from "@/features/marketing/components/layout";
import { about, brand, coreValues, process, whyPoints } from "@/lib/config/brand";
import { siteConfig } from "@/lib/config/site";
import { getActiveIndustries, getPublishedServices } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "MarineCloudeX helps businesses move from manual processes to useful digital systems. Problem first, technology second.",
  alternates: { canonical: "/about" },
};

/**
 * About page.
 *
 * The narrative is the company's own approved copy. Deliberately absent, since
 * none has been provided: founder names, office locations, headcount, years in
 * business, client counts, revenue, awards and certifications.
 */
export default async function AboutPage() {
  const [services, industries] = await Promise.all([
    getPublishedServices(),
    getActiveIndustries(),
  ]);

  return (
    <>
      <PageIntro
        eyebrow={brand.philosophy}
        title="We start with the problem"
        description={siteConfig.description}
      />

      <Section tone="aqua">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <TechLabel tone="aqua">Why we exist</TechLabel>
            </div>
            <div>
              <p className="text-h2 font-semibold text-balance text-ink">{about.lead}</p>
              {about.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-5 max-w-2xl text-lead text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container width="narrow">
          <TechLabel tone="paper">Where we are going</TechLabel>
          <p className="mt-6 text-h2 font-semibold text-balance text-ink">{about.vision}</p>
          <p className="mt-6 text-ink-muted">
            MarineCloudeX means smile — the experience a customer is left with matters as much as the
            system we hand over.
          </p>
        </Container>
      </Section>

      <Section tone="dark" grid aurora>
        <Container>
          <SectionHeader
            index="01"
            eyebrow="Core values"
            tone="dark"
            title="How we work"
            description={brand.positioning}
          />

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <li key={value.title} className="glass rounded-2xl p-8">
                <span className="tech-label text-brand-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-h3 font-semibold text-light">{value.title}</h3>
                <p className="mt-3 text-light-muted">{value.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="ice">
        <Container>
          <SectionHeader
            index="02"
            eyebrow="Approach"
            tone="ice"
            title="We understand why you need it"
          />

          <ol className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {whyPoints.map((point, index) => (
              <li key={point.title} className="border-t border-hairline-light pt-5">
                <span className="tech-label text-brand">/{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-h3 font-semibold text-ink">{point.title}</h3>
                <p className="mt-2 text-ink-muted">{point.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeader index="03" eyebrow="Process" tone="paper" title="How a project runs" />

          <ol className="mt-12 border-t border-hairline-light">
            {process.map((stage, index) => (
              <li
                key={stage.title}
                className="flex flex-col gap-1 border-b border-hairline-light py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="tech-label w-8 shrink-0 text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-h3 font-medium text-ink sm:w-48 sm:shrink-0">
                  {stage.title}
                </span>
                <span className="flex-1 text-ink-muted">{stage.description}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="ice">
        <Container>
          <SectionHeader index="04" eyebrow="Capabilities" tone="ice" title="What we build" />

          <div className="mt-12">
            {services.length === 0 ? (
              <p className="text-ink-muted">No services are published yet.</p>
            ) : (
              <ul className="border-t border-hairline-light">
                {services.map((service, index) => (
                  <li key={service.slug} className="border-b border-hairline-light">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                    >
                      <span className="tech-label w-8 shrink-0 text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-h3 font-medium text-ink transition-colors group-hover:text-brand sm:w-80 sm:shrink-0">
                        {service.name}
                      </span>
                      {service.shortDescription ? (
                        <span className="flex-1 text-sm text-ink-muted">
                          {service.shortDescription}
                        </span>
                      ) : null}
                      <span className="hidden text-brand sm:block">
                        <Arrow />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {industries.length > 0 ? (
            <div className="mt-14">
              <TechLabel tone="ice">Industries</TechLabel>
              <ul className="mt-5 flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <li key={industry.slug}>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="inline-flex rounded-full border border-hairline-light px-4 py-2 text-sm text-ink transition-colors hover:border-brand hover:text-brand"
                    >
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section tone="dark" size="tall" grid aurora>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h1 font-semibold text-balance text-light">
              Have a problem worth solving?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ActionLink href="/contact" tone="dark">
                Start a project
              </ActionLink>
              <ActionLink href="/services" variant="secondary" tone="dark">
                Explore services
              </ActionLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
