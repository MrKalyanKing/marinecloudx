import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";

import {
  CardGrid,
  Container,
  ContentCard,
  PublicEmptyState,
  PageBody,
  PageIntro,
} from "@/features/marketing/components/layout";
import { ItemListJsonLd } from "@/features/marketing/components/structured-data";
import { getPublishedServices } from "@/features/content/services/content";
import { homeCapabilities } from "@/lib/config/brand";

/**
 * Marked noindex while the listing is empty.
 *
 * A page that answers 200 with "nothing published yet" is a soft 404 — thin
 * content that consumes crawl budget and lowers the quality of the indexed set.
 * `follow` stays on so the surrounding navigation is still crawled. Publishing
 * anything flips it back, because the revalidation webhook rebuilds this along
 * with the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const rows = await getPublishedServices();

  return pageMetadata({
  title: "Software, Cloud, AI & IoT Development",
  description:
    "Custom software development, cloud platform engineering, AI and intelligent systems, and IoT products. Four capability areas, one delivery team, global clients.",
  path: "/services",
    indexable: rows.length > 0,
  });
}

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <ItemListJsonLd
        name="Services"
        path="/services"
        items={services.map((s) => ({ name: s.name, href: `/services/${s.slug}` }))}
      />
      <PageIntro
        eyebrow="Capabilities"
        title="What we engineer"
        description="Published capabilities, managed from the CMS — presented as systems, not a wall of tiles."
      />

      <section className="relative px-5 pb-16 sm:px-8">
        <Container className="max-w-[1100px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {homeCapabilities.map((group, index) => (
              <div key={group.slug} className="mcx-card p-6 sm:p-7">
                <span className="tech-label text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-[20px] font-medium tracking-[-0.02em] text-ink">
                  {group.name}
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">
                  {group.shortDescription}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[11px] text-ink-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <PageBody>
        <Container className="py-10">
          <h2 className="text-h3 font-semibold text-ink">All services</h2>
          <p className="mt-2 max-w-[42ch] text-sm text-ink-muted">
            Individual capabilities from the CMS. Open any service for detail.
          </p>
          {services.length === 0 ? (
            <div className="mt-8">
              <PublicEmptyState
                title="No published services yet"
                description="Services appear here once they are published in the admin CMS."
              />
            </div>
          ) : (
            <div className="mt-8">
              <CardGrid>
                {services.map((service) => (
                  <ContentCard
                    headingLevel={2}
                    key={service.slug}
                    title={service.name}
                    href={`/services/${service.slug}`}
                    description={service.shortDescription}
                  />
                ))}
              </CardGrid>
            </div>
          )}
        </Container>
      </PageBody>
    </>
  );
}
