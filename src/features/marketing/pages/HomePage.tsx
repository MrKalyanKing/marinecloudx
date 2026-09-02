import Link from "next/link";

import { FaqAccordion } from "@/features/marketing/components/faq-accordion";
import { OrganizationJsonLd } from "@/features/marketing/components/structured-data";
import { Hero } from "@/features/marketing/components/hero";
import {
  ActionLink,
  Arrow,
  Container,
  ContentCard,
  PublicEmptyState,
  Section,
  SectionHeader,
  TechLabel,
} from "@/features/marketing/components/layout";
import {
  about,
  brand,
  coreValues,
  finalCta,
  process,
  solutions,
  trustPillars,
  whyPoints,
} from "@/lib/config/brand";
import { formatDate } from "@/shared/utils/format";
import {
  getActiveIndustries,
  getPublishedCaseStudies,
  getPublishedFaqs,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
} from "@/features/content/services/content";

/**
 * MarineCloudeX homepage.
 *
 * A server component. The only client JavaScript on the route is the hero
 * entrance timeline, the FAQ accordion and the navbar.
 *
 * Services, industries, projects, case studies, testimonials and FAQs are read
 * from the CMS through the publication-filtered public data layer. The
 * narrative sections that have no CMS model — about, values, why, solutions,
 * process, trust — come from the approved brand config.
 *
 * Nothing on this page asserts a client count, a metric, an award or a
 * certification, because none has been provided.
 */
export default async function HomePage() {
  const [services, industries, projectPage, caseStudies, testimonials, faqs] = await Promise.all([
    getPublishedServices(),
    getActiveIndustries(),
    getPublishedProjects(1, 4),
    getPublishedCaseStudies(),
    getPublishedTestimonials(),
    getPublishedFaqs(),
  ]);

  const [featuredCase, ...otherCases] = caseStudies;

  return (
    <>
      <OrganizationJsonLd />
      <Hero />

      {/* 01 — About */}
      <Section tone="aqua" id="about">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <TechLabel tone="aqua">
                <span aria-hidden="true">01</span>
                <span aria-hidden="true" className="opacity-40">/</span>
                About
              </TechLabel>
              <p className="tech-label mt-6 text-brand">{brand.philosophy}</p>
            </div>

            <div>
              <p className="text-h2 font-semibold text-balance text-ink">{about.lead}</p>
              {about.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-5 max-w-2xl text-lead text-ink-muted">
                  {paragraph}
                </p>
              ))}
              <div className="mt-8">
                <ActionLink href="/about" variant="ghost" tone="aqua">
                  More about MarineCloudeX
                </ActionLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 02 — Core values */}
      <Section tone="dark" grid aurora id="values">
        <Container>
          <SectionHeader
            index="02"
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

      {/* 03 — Why MarineCloudeX: the reasoning, not a claim */}
      <Section tone="paper" id="why">
        <Container>
          <SectionHeader
            index="03"
            eyebrow="Why MarineCloudeX"
            tone="paper"
            title="We understand why you need it"
            description="Most technology fails because it answered the wrong question. We start earlier than the build."
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

      {/* 04 — Capabilities, from the CMS */}
      <Section tone="dark" grid aurora id="capabilities">
        <Container>
          <SectionHeader
            index="04"
            eyebrow="Capabilities"
            tone="dark"
            title="What we build"
            description="Eight capability groups. The detail behind each one lives on its service page."
            action={
              services.length > 0 ? (
                <ActionLink href="/services" variant="secondary" tone="dark">
                  All services
                </ActionLink>
              ) : null
            }
          />

          <div className="mt-14">
            {services.length === 0 ? (
              <PublicEmptyState
                tone="dark"
                title="No published services yet"
                description="Publish a service in the admin CMS and it will appear here."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((service, index) => (
                  <ContentCard
                    key={service.slug}
                    tone="dark"
                    index={`/${String(index + 1).padStart(2, "0")}`}
                    title={service.name}
                    href={`/services/${service.slug}`}
                    description={service.shortDescription}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 05 — Solutions: problems, distinct from services */}
      <Section tone="ice" id="solutions">
        <Container>
          <SectionHeader
            index="05"
            eyebrow="Solutions"
            tone="ice"
            title="Problems we help solve"
            description="Services are what we build. Solutions are the business problems behind them — usually solved with several capabilities together."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {solutions.map((solution) => (
              <article key={solution.title} className="glass-light rounded-2xl p-8">
                <h3 className="text-h3 font-semibold text-ink">{solution.title}</h3>
                <p className="mt-2 text-ink-muted">{solution.problem}</p>

                {/* The flow reads as a sequence without relying on colour alone. */}
                <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {solution.flow.map((step, stepIndex) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="tech-label text-ink">{step}</span>
                      {stepIndex < solution.flow.length - 1 ? (
                        <span aria-hidden="true" className="text-brand">→</span>
                      ) : null}
                    </li>
                  ))}
                </ol>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {solution.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-full border border-hairline-light px-3 py-1 text-xs text-ink-muted"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* 06 — Industries, from the CMS */}
      <Section tone="paper" id="industries">
        <Container>
          <SectionHeader
            index="06"
            eyebrow="Industries"
            tone="paper"
            title={brand.industriesLine}
            action={
              industries.length > 0 ? (
                <ActionLink href="/industries" variant="ghost" tone="paper">
                  All industries
                </ActionLink>
              ) : null
            }
          />

          <div className="mt-12">
            {industries.length === 0 ? (
              <PublicEmptyState title="No active industries yet" />
            ) : (
              <ul className="border-t border-hairline-light">
                {industries.map((industry, index) => (
                  <li key={industry.slug} className="border-b border-hairline-light">
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                    >
                      <span className="tech-label w-8 shrink-0 text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-h3 font-medium text-ink transition-colors group-hover:text-brand sm:w-80 sm:shrink-0">
                        {industry.name}
                      </span>
                      {industry.description ? (
                        <span className="flex-1 text-sm text-ink-muted">{industry.description}</span>
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
        </Container>
      </Section>

      {/* 07 — Process */}
      <Section tone="dark" grid aurora id="process">
        <Container>
          <SectionHeader
            index="07"
            eyebrow="Process"
            tone="dark"
            title="How a project runs"
            description="Six stages, so you always know where the work stands."
          />

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((stage, index) => (
              <li key={stage.title} className="glass rounded-2xl p-8">
                <span className="tech-label text-brand-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-h3 font-semibold text-light">{stage.title}</h3>
                <p className="mt-3 text-light-muted">{stage.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 08 — Selected work */}
      <Section tone="paper" id="work">
        <Container>
          <SectionHeader
            index="08"
            eyebrow="Selected work"
            tone="paper"
            title="What we build"
            action={
              projectPage.rows.length > 0 ? (
                <ActionLink href="/projects" variant="secondary" tone="paper">
                  All work
                </ActionLink>
              ) : null
            }
          />

          <div className="mt-14">
            {projectPage.rows.length === 0 ? (
              <PublicEmptyState
                title="Work is being prepared"
                description="Projects appear here as they are published. We do not show placeholder work."
              />
            ) : (
              <div className="grid gap-10 md:grid-cols-2">
                {projectPage.rows.map((project, index) => (
                  <article key={project.slug} className="group relative">
                    <div className="relative aspect-16/10 overflow-hidden border border-hairline-light bg-aqua">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines-light" />
                      <span className="tech-label absolute top-4 left-4 text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {project.coverMedia?.url ? (
                        /* CMS media is an arbitrary external URL; next/image would
                           need remotePatterns configured per deployment. See
                           docs/media.md. */
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.coverMedia.url}
                          alt={project.coverMedia.altText ?? ""}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>

                    <div className="mt-5">
                      {project.category ? (
                        <span className="tech-label text-ink-muted">{project.category.name}</span>
                      ) : null}
                      <h3 className="mt-2 text-h3 font-semibold text-ink">
                        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 hover:text-brand">
                          {project.title}
                        </Link>
                      </h3>
                      {project.shortDescription ? (
                        <p className="mt-2 max-w-lg text-ink-muted">{project.shortDescription}</p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 09 — Case studies */}
      <Section tone="ice" id="case-studies">
        <Container>
          <SectionHeader
            index="09"
            eyebrow="Case studies"
            tone="ice"
            title="What problem did we solve?"
            description="How the problem was understood, what was built, and what happened next."
            action={
              caseStudies.length > 0 ? (
                <ActionLink href="/case-studies" variant="secondary" tone="ice">
                  All case studies
                </ActionLink>
              ) : null
            }
          />

          <div className="mt-14">
            {caseStudies.length === 0 ? (
              <PublicEmptyState
                title="Case studies are being written"
                description="Each one covers a real problem and a real solution, so they are published only when the work is complete."
              />
            ) : (
              <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
                <article className="group relative rounded-2xl glass-light p-8 sm:p-10">
                  <TechLabel tone="ice">Featured</TechLabel>
                  <h3 className="mt-6 text-h2 font-semibold text-ink">
                    <Link href={`/case-studies/${featuredCase.project.slug}`} className="after:absolute after:inset-0">
                      {featuredCase.project.title}
                    </Link>
                  </h3>
                  {featuredCase.project.shortDescription ? (
                    <p className="mt-4 max-w-xl text-lead text-ink-muted">
                      {featuredCase.project.shortDescription}
                    </p>
                  ) : null}
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand">
                    Read the case study
                    <Arrow />
                  </span>
                </article>

                {otherCases.length > 0 ? (
                  <ul className="border-t border-hairline-light">
                    {otherCases.slice(0, 4).map((entry) => (
                      <li key={entry.project.slug} className="border-b border-hairline-light">
                        <Link href={`/case-studies/${entry.project.slug}`} className="group flex items-center justify-between gap-4 py-5">
                          <span className="text-h3 font-medium text-ink transition-colors group-hover:text-brand">
                            {entry.project.title}
                          </span>
                          <span className="text-brand"><Arrow /></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 10 — Trust, built on how we operate rather than social proof */}
      <Section tone="dark" grid aurora id="trust">
        <Container>
          <SectionHeader
            index="10"
            eyebrow="Working with us"
            tone="dark"
            title="What you can expect"
            description="No logos, no awards, no statistics — just how we run the work."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="glass rounded-2xl p-7">
                <h3 className="text-h3 font-semibold text-light">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-light-muted">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 11 — Testimonials. Rendered only when real records exist. */}
      {testimonials.length > 0 ? (
        <Section tone="paper" id="testimonials">
          <Container>
            <SectionHeader index="11" eyebrow="Testimonials" tone="paper" title="In their words" />

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {testimonials.slice(0, 4).map((testimonial) => (
                <figure key={testimonial.id} className="glass-light rounded-2xl p-8">
                  <blockquote className="text-h3 leading-snug font-medium text-balance text-ink">
                    “{testimonial.content}”
                  </blockquote>
                  <figcaption className="mt-6 flex flex-wrap items-baseline gap-2">
                    <span className="font-medium text-ink">{testimonial.authorName}</span>
                    <span className="tech-label text-ink-muted">
                      {[testimonial.authorRole, testimonial.companyName].filter(Boolean).join(" · ")}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* 12 — FAQ */}
      <Section tone="ice" id="faq">
        <Container>
          <SectionHeader
            index="12"
            eyebrow="FAQ"
            tone="ice"
            title="You don't need to know the technology"
            description="Tell us the problem. These are the questions we are asked most."
            action={
              faqs.length > 0 ? (
                <ActionLink href="/faq" variant="ghost" tone="ice">
                  All questions
                </ActionLink>
              ) : null
            }
          />

          <div className="mt-12">
            {faqs.length === 0 ? (
              <PublicEmptyState title="No published questions yet" />
            ) : (
              <FaqAccordion
                items={faqs.slice(0, 8).map((faq) => ({
                  id: faq.id,
                  question: faq.question,
                  answer: faq.answer,
                }))}
              />
            )}
          </div>
        </Container>
      </Section>

      {/* 13 — Final CTA */}
      <Section tone="dark" size="tall" grid aurora id="start">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <TechLabel tone="dark">{brand.philosophy}</TechLabel>

            <h2 className="mt-6 text-h1 font-semibold text-balance text-light">
              {finalCta.heading}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lead text-light-muted">
              {finalCta.supporting}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ActionLink href="/contact" variant="primary" tone="dark">
                Start a project
              </ActionLink>
              <ActionLink href="/services" variant="secondary" tone="dark">
                Explore services
              </ActionLink>
            </div>

            <p className="tech-label mt-12 text-brand-soft">{finalCta.line}</p>

            {projectPage.total > 0 ? (
              <p className="sr-only">
                Latest work published {formatDate(projectPage.rows[0]?.publishedAt)}
              </p>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
