import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionLink, Breadcrumbs, Container, PageBody, PageIntro } from "@/features/marketing/components/layout";
import { ProjectGallery, PublicImage } from "@/features/marketing/components/project-gallery";
import { finalCta } from "@/lib/config/brand";
import { PublicationStatus } from "@/contracts";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getPublishedProjectBySlug } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return { title: "Not found", robots: { index: false, follow: false } };

  const title = project.seoTitle ?? project.title;
  const description = project.seoDescription ?? project.shortDescription ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description, url: `/projects/${project.slug}`, type: "article" },
    twitter: { title, description },
  };
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

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {project.category ? (
            // Links back into the filtered listing rather than repeating the
            // category name as inert text.
            <Link
              href={`/projects?category=${encodeURIComponent(project.category.slug)}`}
              className="text-teal-700 hover:underline"
            >
              {project.category.name}
            </Link>
          ) : null}
          {project.publishedAt ? (
            <time dateTime={toIsoDate(project.publishedAt)}>{formatDate(project.publishedAt)}</time>
          ) : null}
        </div>

        {project.coverMedia?.url ? (
          <div className="mt-6 aspect-[16/9] overflow-hidden border border-hairline-light bg-ice">
            <PublicImage
              url={project.coverMedia.url}
              altText={project.coverMedia.altText}
              width={project.coverMedia.width}
              height={project.coverMedia.height}
            />
          </div>
        ) : null}

        {project.fullDescription ? (
          <div className="mt-4 max-w-3xl whitespace-pre-wrap text-slate-700">
            {project.fullDescription}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-700 hover:underline"
            >
              Visit the live site
            </a>
          ) : null}
          {hasCaseStudy ? (
            <Link href={`/case-studies/${project.slug}`} className="text-sm text-teal-700 hover:underline">
              Read the case study
            </Link>
          ) : null}
        </div>

        <ProjectGallery items={project.media} />

        {project.services.length > 0 ||
        project.industries.length > 0 ||
        project.technologies.length > 0 ? (
          <section className="mt-8 grid gap-6 sm:grid-cols-3">
            {project.services.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Services</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-teal-300"
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
                <h2 className="text-sm font-semibold text-slate-900">Industries</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.industries.map((industry) => (
                    <li key={industry.slug}>
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-teal-300"
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
                <h2 className="text-sm font-semibold text-slate-900">Technologies</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li key={technology.slug} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
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
            <h2 className="text-lg font-semibold text-slate-900">What the client said</h2>
            <div className="mt-3 flex flex-col gap-3">
              {project.testimonials.map((testimonial, index) => (
                <blockquote key={index} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-700">{testimonial.content}</p>
                  <footer className="mt-2 text-xs text-slate-500">
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
