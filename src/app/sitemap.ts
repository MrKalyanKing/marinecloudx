import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/config/site";
import { getSitemapEntries } from "@/features/content/services/content";

/** Generated per request so newly published content is listed immediately. */
export const dynamic = "force-dynamic";

/**
 * Sitemap.
 *
 * Built from the same publication-filtered data layer the pages use, so a draft
 * cannot be listed here even though the sitemap is generated separately. Admin,
 * CMS, CRM and API routes are absent by construction — only public content is
 * enumerated.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, industries, projects, caseStudies, posts } = await getSitemapEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/services"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/industries"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/case-studies"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/testimonials"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/blog"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
  ];

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
