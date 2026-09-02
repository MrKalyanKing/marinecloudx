import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/config/site";

/**
 * robots.txt
 *
 * The public site is fully crawlable; only internal surfaces are excluded.
 * Admin pages also carry `robots: noindex` in their own metadata, so they are
 * covered even if a crawler ignores this file.
 *
 * Note the deliberate ordering: `Allow: /` comes first, and only the internal
 * prefixes are disallowed — a blanket disallow would deindex the whole site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
