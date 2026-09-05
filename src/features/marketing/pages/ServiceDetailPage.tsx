import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, Container, PageBody, PageIntro } from "@/features/marketing/components/layout";
import { ServiceJsonLd } from "@/features/marketing/components/structured-data";
import { getPublishedServiceBySlug } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Metadata is derived from the published record only.
 *
 * `getPublishedServiceBySlug` filters on status, so a draft produces no
 * metadata — its title and description can never leak through a <head> tag.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) return { title: "Not found", robots: { index: false, follow: false } };

  const title = service.seoTitle ?? service.name;
  const description = service.seoDescription ?? service.shortDescription ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title, description, url: `/services/${service.slug}`, type: "article" },
    twitter: { title, description },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  // Unpublished and non-existent behave identically — a 404 either way, so a
  // direct URL cannot confirm that a draft exists.
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd
        name={service.name}
        slug={service.slug}
        description={service.shortDescription}
      />
      <PageIntro title={service.name} description={service.shortDescription ?? undefined} />

      <PageBody>
      <Container className="py-8">
        <Breadcrumbs trail={[{ label: "Services", href: "/services" }, { label: service.name }]} />

        {service.fullDescription ? (
          <div className="max-w-3xl whitespace-pre-wrap text-slate-700">
            {service.fullDescription}
          </div>
        ) : null}

        {service.features.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">What&rsquo;s included</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-900">{feature.name}</p>
                  {feature.description ? (
                    <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {service.industries.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Industries</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {service.industries.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-teal-300 hover:text-teal-700"
                  >
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {service.technologies.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Technologies</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {service.technologies.map((technology) => (
                <li
                  key={technology.slug}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {technology.name}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {service.projects.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Related work</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {service.projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="text-sm text-teal-700 hover:underline">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
      </PageBody>
    </>
  );
}
