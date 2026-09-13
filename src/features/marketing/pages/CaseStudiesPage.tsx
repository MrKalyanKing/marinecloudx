import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";

import {
  CardGrid,
  Container,
  ContentCard,
  PageBody,
  PageIntro,
  PublicEmptyState,
} from "@/features/marketing/components/layout";
import { ItemListJsonLd } from "@/features/marketing/components/structured-data";
import { formatDate } from "@/shared/utils/format";
import { getPublishedCaseStudies } from "@/features/content/services/content";

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
  const rows = await getPublishedCaseStudies();

  return pageMetadata({
  title: "Software Engineering Case Studies & Outcomes",
  description:
    "How we approached specific engagements end to end: the business problem, the architecture we chose, the trade-offs we made and what shipped to production.",
  path: "/case-studies",
    indexable: rows.length > 0,
  });
}

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
      <ItemListJsonLd
        name="Case studies"
        path="/case-studies"
        items={caseStudies.map((c) => ({
          name: c.project.title,
          href: `/case-studies/${c.project.slug}`,
        }))}
      />
      <PageIntro title="Case studies" />

      <PageBody>
        <Container className="py-8">
          {caseStudies.length === 0 ? (
            <PublicEmptyState
              title="No published case studies yet"
              description="A case study appears here once both it and its project are published."
            />
          ) : (
            <CardGrid>
              {caseStudies.map((entry, index) => (
                <ContentCard
                  headingLevel={2}
                  key={entry.project.slug}
                  title={entry.project.title}
                  href={`/case-studies/${entry.project.slug}`}
                  description={entry.project.shortDescription}
                  image={entry.project.coverMedia}
                  priority={index === 0}
                  meta={entry.publishedAt ? formatDate(entry.publishedAt) : undefined}
                />
              ))}
            </CardGrid>
          )}
        </Container>
      </PageBody>
    </>
  );
}
