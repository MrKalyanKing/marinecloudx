import type { Metadata } from "next";

import { Container, PageIntro, Section, TechLabel } from "@/features/marketing/components/layout";
import { ContactForm } from "@/features/marketing/components/contact-form";
import { brand, finalCta, process } from "@/lib/config/brand";
import { getPublishedServices } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell MarineCloudeX what you are trying to build, improve, automate or solve. We understand the problem first.",
  alternates: { canonical: "/start-a-project" },
};

export default async function ContactPage() {
  // Feeds the "what do you need?" select with real CMS services, so the
  // enquiry links to a service record the CRM can filter on.
  const services = await getPublishedServices();

  return (
    <>
      <PageIntro
        eyebrow={brand.philosophy}
        title={finalCta.heading}
        description={finalCta.supporting}
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
            <ContactForm services={services.map((s) => ({ id: s.id, name: s.name }))} />

            <aside className="lg:pt-2">
              <TechLabel tone="paper">What happens next</TechLabel>

              <ol className="mt-6 border-t border-hairline-light">
                {process.slice(0, 3).map((stage, index) => (
                  <li key={stage.title} className="border-b border-hairline-light py-4">
                    <span className="tech-label text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 font-medium text-ink">{stage.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{stage.description}</p>
                  </li>
                ))}
              </ol>

              <p className="mt-8 text-sm text-ink-muted">{finalCta.line}</p>

              {/* No phone number, address or social account is shown: none has
                  been provided, and inventing contact details would put false
                  information on a live site. */}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
