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
import { getActiveIndustries } from "@/features/content/services/content";

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
  const rows = await getActiveIndustries();

  return pageMetadata({
  title: "Software Development Across 8 Industries",
  description:
    "Technology that understands your sector. See how MarineCloudX applies software, cloud, AI and IoT engineering to the industries we build for worldwide.",
  path: "/industries",
    indexable: rows.length > 0,
  });
}

export default async function IndustriesPage() {
  const industries = await getActiveIndustries();

  return (
    <>
      <ItemListJsonLd
        name="Industries"
        path="/industries"
        items={industries.map((i) => ({ name: i.name, href: `/industries/${i.slug}` }))}
      />
      <PageIntro title="Industries" />

      <PageBody>
        <Container className="py-8">
          {industries.length === 0 ? (
            <PublicEmptyState
              title="No active industries yet"
              description="Industries appear here once they are made active in the admin CMS."
            />
          ) : (
            <CardGrid>
              {industries.map((industry) => (
                <ContentCard
                  headingLevel={2}
                  key={industry.slug}
                  title={industry.name}
                  href={`/industries/${industry.slug}`}
                  description={industry.description}
                />
              ))}
            </CardGrid>
          )}
        </Container>
      </PageBody>
    </>
  );
}
