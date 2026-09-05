import type { Metadata } from "next";

import {
  CardGrid,
  Container,
  ContentCard,
  PageBody,
  PageIntro,
  PublicEmptyState,
} from "@/features/marketing/components/layout";
import { formatDate } from "@/shared/utils/format";
import { getPublishedCaseStudies } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How MarineCloudeX approached specific pieces of work.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
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
              {caseStudies.map((entry) => (
                <ContentCard
                  headingLevel={2}
                  key={entry.project.slug}
                  title={entry.project.title}
                  href={`/case-studies/${entry.project.slug}`}
                  description={entry.project.shortDescription}
                  image={entry.project.coverMedia}
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
