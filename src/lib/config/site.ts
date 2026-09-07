/**
 * Public site configuration.
 *
 * Company identity and navigation live here rather than being scattered through
 * components. Everything in this file is public by definition — it ships to the
 * browser, so no secret, key or internal identifier belongs here.
 *
 * Marketing copy is deliberately minimal: nothing about the company's history,
 * size, clients or results is invented. Narrative copy lives in
 * src/config/brand.ts; everything with a CMS model lives in the database.
 */

import { brand } from "@/lib/config/brand";

/**
 * The canonical production origin.
 *
 * Hardcoded rather than left to an environment variable alone because every
 * canonical URL, `og:url`, sitemap `<loc>` and robots `Sitemap:` line resolves
 * through `resolveSiteUrl()`. If the variable is ever missing in production the
 * old fallback published `http://localhost:3000` to Google, which is worse than
 * a build failure — the URLs are unreachable and the whole site drops out of the
 * index. `NEXT_PUBLIC_SITE_URL` still wins when it is set, so nothing about
 * staging or a rename requires a code change.
 *
 * `www.marinecloudx.in` must 301 to this apex at the host or CDN. Next cannot
 * perform host-level redirects, so that rule lives outside this repository.
 */
const PRODUCTION_URL = "https://marinecloudx.in";

function normaliseOrigin(value: string): string {
  const withScheme =
    value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

/**
 * The host this particular deployment is actually served from, when the
 * platform publishes one.
 *
 * Vercel exposes `VERCEL_BRANCH_URL` (stable for the branch) and `VERCEL_URL`
 * (unique per deployment); Render exposes `RENDER_EXTERNAL_URL`. The branch URL
 * is preferred because it survives a redeploy, which matters for a link someone
 * has already shared.
 */
function deploymentOrigin(): string | null {
  const host =
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() ||
    process.env.RENDER_EXTERNAL_URL?.trim() ||
    process.env.VERCEL_BRANCH_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  return host ? normaliseOrigin(host) : null;
}

/**
 * Resolves the origin that every canonical URL, `og:url`, `og:image`, sitemap
 * `<loc>` and `robots.txt` `Sitemap:` line is built against.
 *
 * ## Why the ordering changed
 *
 * The previous version returned `PRODUCTION_URL` for *any* build with
 * `NODE_ENV === "production"` — which is every built deployment, not only the
 * one serving the apex. The `VERCEL_URL` branch beneath it was therefore
 * unreachable in practice.
 *
 * That is what broke link previews on the staging host. `dev-frontend.marinecloudx.in`
 * emitted `og:image = https://marinecloudx.in/opengraph-image.png`, so WhatsApp,
 * Slack and Twitter fetched the image from the *old* site still answering on the
 * apex and rendered its SMIVORA artwork beside this site's title and
 * description. Nothing about the image file in this repository was wrong — the
 * URL simply pointed at a different website.
 *
 * A deployment now describes itself unless it has been told it is the canonical
 * one. `VERCEL_ENV === "production"` is that signal on Vercel; setting
 * `NEXT_PUBLIC_SITE_URL` is the explicit signal anywhere else, and it still wins
 * over everything. Self-description is also the safer failure mode: a preview
 * that names itself is merely un-indexed, whereas a preview that claims the apex
 * hands Google duplicate canonicals for the whole site.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normaliseOrigin(explicit);

  // The platform states this deployment *is* production, so it may claim the
  // canonical origin even though nobody configured one.
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;

  // Staging, preview and branch deployments: the generated host is the origin
  // the visitor is actually on, so every absolute URL — the social image above
  // all — has to resolve there rather than to the apex.
  const deployment = deploymentOrigin();
  if (deployment) return deployment;

  // A production build with no platform host at all (a container behind a
  // proxy, a self-hosted `next start`). The apex is the only sane answer and is
  // almost always right — but set NEXT_PUBLIC_SITE_URL and remove the doubt.
  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;

  return "http://localhost:3000";
}

export const siteConfig = {
  /**
   * One spelling, everywhere. This string appears in every `<title>`, every
   * JSON-LD block and the visible header and footer, and it must match the
   * verified Google Business Profile exactly — name consistency across the
   * profile, the markup and the page is a direct local ranking input.
   */
  name: "MarineCloudX",
  descriptor: "Technologies",
  legalName: "MarineCloudX Technologies",
  /** Approved positioning line. Single source: src/config/brand.ts. */
  tagline: brand.positioning,
  description:
    "MarineCloudX designs and builds custom software, cloud platforms, AI systems and connected products around real business problems. Worldwide delivery.",
  url: resolveSiteUrl(),
  locale: "en",
} as const;

/**
 * Registered office.
 *
 * Present because the business operates a verified Google Business Profile at
 * this address; it is not invented. It feeds the `PostalAddress` in the
 * Organization JSON-LD and nothing else. `telephone` is deliberately absent —
 * no public number has been published, and a wrong one in structured data is
 * worse than none.
 */
export const siteAddress = {
  streetAddress: "11th Floor, Building Number 9, SEZ, Hitech City Rd, Madhapur",
  addressLocality: "Hyderabad",
  addressRegion: "Telangana",
  postalCode: "500081",
  addressCountry: "IN",
} as const;

/**
 * Profiles the business actually controls, for JSON-LD `sameAs`.
 *
 * Empty until real accounts are provided. An invented profile URL asserts a
 * false identity to a machine that will repeat it.
 */
export const siteProfiles: readonly string[] = [];

/**
 * Primary navigation. Every entry points at a route that exists.
 *
 * Contact details and social accounts are intentionally absent — none have been
 * provided, and inventing them would put false information on the website.
 */
export const publicNavigation = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/projects" },
  { label: "Insights", href: "/blog" },
] as const;

/**
 * Footer columns.
 *
 * Two groups rather than three. The footer sits under a call-to-action card and
 * the whole block has to stay short enough to read as a footer; three narrow
 * columns of two or three links each pushed it to the height of a page section
 * and left the last column with a single orphaned entry at most breakpoints.
 */
export const footerNavigation = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "What we do",
    links: [
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Projects", href: "/projects" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Insights", href: "/blog" },
    ],
  },
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export type SiteConfig = typeof siteConfig;
