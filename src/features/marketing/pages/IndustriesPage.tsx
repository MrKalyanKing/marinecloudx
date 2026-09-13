import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";

import {
  Container,
  PageBody,
  PageIntro,
} from "@/features/marketing/components/layout";
import { ItemListJsonLd } from "@/features/marketing/components/structured-data";
import { IndustryExperienceCard } from "@/features/marketing/components/industry-experience-card";
import { getActiveIndustries } from "@/features/content/services/content";
import { homeProjects } from "@/lib/config/brand";

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
  const rows = await getActiveIndustries().catch(() => []);

  return pageMetadata({
    title: "Industry Experience: Education, Interiors & Dental",
    description:
      "Our current engineering work spans Education, Interiors, and Dental. We design and build practical digital products, applications, and workflows with capabilities transferable across industries.",
    path: "/industries",
    indexable: true,
  });
}

export default async function IndustriesPage() {
  const industries = await getActiveIndustries().catch(() => []);
  const displayItems = industries.length > 0 ? industries : homeProjects.slice(0, 3);

  return (
    <>
      <ItemListJsonLd
        name="Industries"
        path="/industries"
        items={displayItems.map((i) => ({
          name: i.name,
          href: "slug" in i && i.slug ? `/industries/${i.slug}` : "/industries",
        }))}
      />
      {/* Compact, elegant header matching projects & services page */}
      <section className="relative px-5 pt-28 pb-6 sm:px-8 sm:pt-32 sm:pb-8 text-ink">
        <Container className="max-w-[1320px]">
          <span className="tech-label text-brand uppercase tracking-wider text-xs font-semibold">
            Domain Understanding
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink max-w-4xl text-balance">
            Industry Experience &amp; Delivered Platforms
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-muted max-w-3xl leading-relaxed">
            Our active engineering work spans Architecture &amp; Interiors, Education &amp; EdTech, and Gourmet Agritech Produce. Each domain is backed by production software solving real operational challenges.
          </p>
        </Container>
      </section>

      <PageBody>
        <Container className="py-8">
          <div className="flex flex-col gap-[clamp(48px,8vh,96px)]">
            {displayItems.map((item, index) => (
              <IndustryExperienceCard
                key={"slug" in item && item.slug ? item.slug : item.name}
                item={item}
                index={index}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </Container>
      </PageBody>
    </>
  );
}
