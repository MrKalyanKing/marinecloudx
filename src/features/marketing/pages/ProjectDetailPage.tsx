import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionLink, Breadcrumbs, Container, PageBody, PageIntro } from "@/features/marketing/components/layout";
import { ProjectGallery, PublicImage } from "@/features/marketing/components/project-gallery";
import { finalCta } from "@/lib/config/brand";
import { PublicationStatus } from "@/contracts";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getPublishedProjectBySlug, getSitemapEntries } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerenders every published slug at build time.
 *
 * With the segment now cached rather than `force-dynamic`, this turns the
 * catalogue into static HTML that is served without touching the API, then
 * refreshed by the revalidation webhook. Slugs published after the build still
 * work: `dynamicParams` defaults to true, so an unknown slug renders on demand
 * and is cached from then on.
 *
 * Failure here is deliberately non-fatal. A build should not break because the
 * API happened to be unreachable — returning no params simply means every page
 * renders on first request instead, which is the behaviour that existed before.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const entries = await getSitemapEntries();
    return entries.projects.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return { title: "Not found", robots: { index: false, follow: false } };

  const title = project.seoTitle ?? project.title;
  const description = project.seoDescription ?? project.shortDescription ?? undefined;

  return pageMetadata({
    title,
    description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  // The case study is only linked when it is itself published.
  const hasCaseStudy = project.caseStudy?.status === PublicationStatus.PUBLISHED;

  return (
    <>
      <PageIntro title={project.title} description={project.shortDescription ?? undefined} />

      <PageBody>
      <Container className="py-8">
        <Breadcrumbs trail={[{ label: "Projects", href: "/projects" }, { label: project.title }]} />

        <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
          {project.category ? (
            // Links back into the filtered listing rather than repeating the
            // category name as inert text.
            <Link
              href={`/projects?category=${encodeURIComponent(project.category.slug)}`}
              className="text-ink hover:text-ink hover:underline"
            >
              {project.category.name}
            </Link>
          ) : null}
          {project.publishedAt ? (
            <time dateTime={toIsoDate(project.publishedAt)}>{formatDate(project.publishedAt)}</time>
          ) : null}
        </div>

        {project.coverMedia?.url ? (
          <div className="media-frame relative mt-6 aspect-[16/9] bg-ice">
            <PublicImage
              url={project.coverMedia.url}
              alt={project.coverMedia.altText ?? project.title}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}

        {project.fullDescription ? (
          <div className="mt-4 max-w-3xl whitespace-pre-wrap text-ink-muted">
            {project.fullDescription}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink hover:text-ink hover:underline"
            >
              Visit the live site
            </a>
          ) : null}
          {hasCaseStudy ? (
            <Link href={`/case-studies/${project.slug}`} className="text-sm text-ink hover:text-ink hover:underline">
              Read the case study
            </Link>
          ) : null}
        </div>

        <ProjectGallery items={project.media} context={project.title} />

        {project.services.length > 0 ||
        project.industries.length > 0 ||
        project.technologies.length > 0 ? (
          <section className="mt-8 grid gap-6 sm:grid-cols-3">
            {project.services.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold text-ink">Services</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="chip-glass px-3 py-1 text-sm text-ink-muted hover:text-brand"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Industry names come from the relation, never re-typed here. */}
            {project.industries.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold text-ink">Industries</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.industries.map((industry) => (
                    <li key={industry.slug}>
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="chip-glass px-3 py-1 text-sm text-ink-muted hover:text-brand"
                      >
                        {industry.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.technologies.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold text-ink">Technologies</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li key={technology.slug} className="chip-glass px-3 py-1 text-sm text-ink-muted">
                      {technology.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {project.testimonials.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink">What the client said</h2>
            <div className="mt-3 flex flex-col gap-3">
              {project.testimonials.map((testimonial, index) => (
                <blockquote key={index} className="quote-card p-4">
                  <p className="text-sm text-ink-muted">{testimonial.content}</p>
                  <footer className="mt-2 text-xs text-ink-muted">
                    {testimonial.authorName}
                    {testimonial.authorRole ? `, ${testimonial.authorRole}` : ""}
                    {testimonial.companyName ? ` · ${testimonial.companyName}` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        ) : null}

        {/* Copy comes from the approved brand narrative — nothing invented here. */}
        <section className="mt-12 border-t border-hairline-light pt-8">
          <h2 className="text-h3 font-semibold text-ink">{finalCta.heading}</h2>
          <p className="mt-3 max-w-2xl text-sm text-ink-muted">{finalCta.supporting}</p>
          <div className="mt-5">
            <ActionLink href="/contact" tone="paper">
              Start a conversation
            </ActionLink>
          </div>
        </section>
      </Container>
      </PageBody>
    </>
  );
}
