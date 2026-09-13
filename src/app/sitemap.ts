import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/config/site";
import { getSitemapEntries } from "@/features/content/services/content";

/** Generated per request so newly published content is listed immediately. */
export const dynamic = "force-dynamic";

/** Static routes share one timestamp: the moment the sitemap was generated. */
const generatedAt = () => new Date();

/**
 * Sitemap.
 *
 * Built from the same publication-filtered data layer the pages use, so a draft
 * cannot be listed here even though the sitemap is generated separately. Admin,
 * CMS, CRM and API routes are absent by construction — only public content is
 * enumerated.
 *
 * Two corrections from the SEO audit:
 *
 * 1. `/contact` was listed while its own metadata canonicalises it to
 *    `/start-a-project`. Advertising a URL that points somewhere else wastes
 *    crawl budget and sends contradictory signals, so the canonical target is
 *    listed instead.
 * 2. Static routes carried no `lastModified` at all. Only CMS rows had one.
 *
 * Unlike the pages, this route degrades rather than failing when the API is
 * unreachable. A sitemap is a hint: omitting a URL never removes it from the
 * index, so a static-only sitemap during an outage is harmless, whereas serving
 * nothing loses the ten static routes as well.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = generatedAt();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/services"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/industries"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/projects"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/case-studies"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/testimonials"), lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/faq"), lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/blog"), lastModified, changeFrequency: "daily", priority: 0.8 },
    {
      url: absoluteUrl("/start-a-project"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  let entries;
  try {
    entries = await getSitemapEntries();
  } catch {
    return staticRoutes;
  }

  const { services, industries, projects, caseStudies, posts } = entries;

  return [
    ...staticRoutes,
    ...services.map((row) => ({
      url: absoluteUrl(`/services/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...industries.map((row) => ({
      url: absoluteUrl(`/industries/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((row) => ({
      url: absoluteUrl(`/projects/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseStudies.map((row) => ({
      url: absoluteUrl(`/case-studies/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((row) => ({
      url: absoluteUrl(`/blog/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
