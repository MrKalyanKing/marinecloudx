import type { Metadata } from "next";

import {
  Container,
  PageBody,
  PageIntro,
  PublicEmptyState,
} from "@/features/marketing/components/layout";
import { FaqJsonLd } from "@/features/marketing/components/structured-data";
import { getPublishedFaqs } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about working with MarineCloudeX.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

  // Grouped by the lightweight category label the schema provides. Uncategorised
  // entries fall into a single unnamed group rather than being hidden.
  const groups = new Map<string, typeof faqs>();

  for (const faq of faqs) {
    const key = faq.category ?? "";
    groups.set(key, [...(groups.get(key) ?? []), faq]);
  }

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <PageIntro title="Frequently asked questions" />

      <PageBody>
        <Container className="py-8">
          {faqs.length === 0 ? (
            <PublicEmptyState
              title="No published questions yet"
              description="Questions appear here once they are published in the admin CMS."
            />
          ) : (
            [...groups.entries()].map(([category, items]) => (
              <section key={category || "general"} className="mb-8">
                {category ? (
                  <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted uppercase">
                    {category}
                  </h2>
                ) : null}

                <dl className="divide-y divide-hairline-light border-y border-hairline-light">
                  {items.map((faq) => (
                    <div key={faq.id} className="py-4">
                      <dt className="font-medium text-ink">{faq.question}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-ink-muted">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))
          )}
        </Container>
      </PageBody>
    </>
  );
}
