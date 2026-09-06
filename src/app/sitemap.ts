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

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/industries"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/case-studies"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/testimonials"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
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
