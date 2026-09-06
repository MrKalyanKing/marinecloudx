import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, Container, PageBody, PageIntro } from "@/features/marketing/components/layout";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { ProjectGallery, PublicImage } from "@/features/marketing/components/project-gallery";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getPublishedCaseStudyByProjectSlug, getSitemapEntries } from "@/features/content/services/content";

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
    return entries.caseStudies.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

/**
 * CaseStudy has no slug column — it is one-to-one with Project, so the public
 * URL uses the project's slug. Both records must be published for the page to
 * exist; that rule lives in the data layer, so metadata generation inherits it
 * and a draft can never leak into a title, description or canonical URL.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getPublishedCaseStudyByProjectSlug(slug);

  if (!caseStudy) return { title: "Not found", robots: { index: false, follow: false } };

  const title = caseStudy.seoTitle ?? `${caseStudy.project.title} — case study`;
  const description = caseStudy.seoDescription ?? caseStudy.project.shortDescription ?? undefined;

  return pageMetadata({
    title,
    description,
    path: `/case-studies/${caseStudy.project.slug}`,
    type: "article",
  });
}

const SECTIONS = [
  { key: "challenge", heading: "Challenge" },
  { key: "approach", heading: "Approach" },
  { key: "solution", heading: "Solution" },
  { key: "implementation", heading: "Implementation" },
  { key: "results", heading: "Results" },
] as const;

/** Small factual row: label plus linked relation values. */
function FactRow({
  label,
  items,
  href,
}: {
  label: string;
  items: { name: string; slug: string }[];
  /** Omitted for values that have no page of their own, e.g. technologies. */
  href?: (slug: string) => string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <dt className="tech-label text-ink-muted">{label}</dt>
      <dd className="mt-2 flex flex-wrap gap-2">
        {items.map((item) =>
          href ? (
            <Link
              key={item.slug}
              href={href(item.slug)}
              className="chip-glass px-3 py-1 text-sm text-ink hover:text-brand"
            >
              {item.name}
            </Link>
          ) : (
            <span
              key={item.slug}
              className="chip-glass px-3 py-1 text-sm text-ink-muted"
            >
              {item.name}
            </span>
          ),
        )}
      </dd>
    </div>
  );
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getPublishedCaseStudyByProjectSlug(slug);

  if (!caseStudy) notFound();

  const { project } = caseStudy;
  const sections = SECTIONS.filter((section) => caseStudy[section.key]);

  return (
    <>
      {/* The eyebrow is what tells a reader this is the long-form narrative
          rather than the portfolio entry it belongs to. */}
      <PageIntro
        eyebrow="Case study"
        title={project.title}
        description={project.shortDescription ?? undefined}
      />

      <PageBody>
      <Container className="py-8">
        <Breadcrumbs
          trail={[{ label: "Case studies", href: "/case-studies" }, { label: project.title }]}
        />

        {project.coverMedia?.url ? (
          <div className="media-frame relative mb-8 aspect-[16/9] bg-ice">
            <PublicImage
              url={project.coverMedia.url}
              alt={project.coverMedia.altText ?? project.title}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}

        {/* Every value below is a real relation or column. Sections with no data
            are omitted rather than filled with placeholder outcomes. */}
        <dl className="mb-10 grid gap-6 border-y border-hairline-light py-6 sm:grid-cols-2 lg:grid-cols-4">
          {project.category ? (
            <FactRow
              label="Category"
              items={[project.category]}
              href={(slug) => `/projects?category=${encodeURIComponent(slug)}`}
            />
          ) : null}
          <FactRow label="Industries" items={project.industries} href={(slug) => `/industries/${slug}`} />
          <FactRow label="Services" items={project.services} href={(slug) => `/services/${slug}`} />
          <FactRow label="Technologies" items={project.technologies} />
        </dl>

        {sections.length > 0 ? (
          <div className="max-w-3xl">
            {sections.map((section) => (
              <section key={section.key} className="mb-8">
                <h2 className="text-h3 font-semibold text-ink">{section.heading}</h2>
                <p className="mt-3 whitespace-pre-wrap text-ink-muted">{caseStudy[section.key]}</p>
              </section>
            ))}
          </div>
        ) : null}

        <ProjectGallery items={project.media} heading="Project media" context={project.title} />

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-hairline-light pt-6 text-sm">
          <Link href={`/projects/${project.slug}`} className="text-brand hover:underline">
            View the project
          </Link>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Visit the live site
            </a>
          ) : null}
          {caseStudy.publishedAt ? (
            <time dateTime={toIsoDate(caseStudy.publishedAt)} className="text-ink-muted">
              Published {formatDate(caseStudy.publishedAt)}
            </time>
          ) : null}
        </div>

      </Container>
      </PageBody>

      <FinalCta />
    </>
  );
}
