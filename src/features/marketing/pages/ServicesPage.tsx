import type { Metadata } from "next";

import {
  CardGrid,
  Container,
  ContentCard,
  PublicEmptyState,
  PageIntro,
} from "@/features/marketing/components/layout";
import { getPublishedServices } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "Services",
  description: "What MarineCloudeX builds and operates for its clients.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <PageIntro title="Services" description="Published capabilities, managed from the CMS." />

      <Container className="py-8">
        {services.length === 0 ? (
          <PublicEmptyState
            title="No published services yet"
            description="Services appear here once they are published in the admin CMS."
          />
        ) : (
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
        )}
      </Container>
    </>
  );
}
