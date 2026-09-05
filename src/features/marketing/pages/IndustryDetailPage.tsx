import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, Container, PageBody, PageIntro } from "@/features/marketing/components/layout";
import { getActiveIndustryBySlug } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Industry has no SEO columns in the schema, so metadata is derived from the
 * name and description it does have. No speculative SEO fields were added.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getActiveIndustryBySlug(slug);

  if (!industry) return { title: "Not found", robots: { index: false, follow: false } };

  return {
    title: industry.name,
    description: industry.description ?? undefined,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: industry.name,
      description: industry.description ?? undefined,
      url: `/industries/${industry.slug}`,
    },
  };
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = await getActiveIndustryBySlug(slug);

  // Inactive industries are treated exactly like missing ones.
  if (!industry) notFound();

  return (
    <>
      <PageIntro title={industry.name} description={industry.description ?? undefined} />

      <PageBody>
      <Container className="py-8">
        <Breadcrumbs trail={[{ label: "Industries", href: "/industries" }, { label: industry.name }]} />

        {industry.services.length > 0 ? (
          <section className="mt-4">
            <h2 className="text-lg font-semibold text-ink">Relevant services</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {industry.services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-sm text-ink hover:text-ink hover:underline">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {industry.projects.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink">Work in this sector</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {industry.projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="text-sm text-ink hover:text-ink hover:underline">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {industry.services.length === 0 && industry.projects.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            No published services or projects are linked to this industry yet.
          </p>
        ) : null}
      </Container>
      </PageBody>
    </>
  );
}
