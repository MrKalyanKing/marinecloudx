import type { Metadata } from "next";

import {
  CardGrid,
  Container,
  ContentCard,
  PageBody,
  PageIntro,
  PublicEmptyState,
} from "@/features/marketing/components/layout";
import { getActiveIndustries } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "Industries",
  description: "Sectors MarineCloudeX works in.",
  alternates: { canonical: "/industries" },
};

export default async function IndustriesPage() {
  const industries = await getActiveIndustries();

  return (
    <>
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
