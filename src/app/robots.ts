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
 *
 * There is no `host` field. It previously emitted `absoluteUrl("/")`, which
 * produces a full URL with a scheme and a trailing slash — not a valid value
 * for a directive that takes a bare hostname. The directive is also honoured
 * only by Yandex, and the canonical host is already declared by the canonical
 * tag on every page plus the `www` → apex redirect at the CDN, so removing it
 * loses nothing.
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
  };
}
