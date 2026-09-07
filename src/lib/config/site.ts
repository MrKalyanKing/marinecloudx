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

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normaliseOrigin(explicit);

  // Production must never fall through to a preview host or to localhost.
  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;

  // Preview deployments: the generated host is correct for that deployment and
  // those builds are not meant to be indexed anyway.
  if (process.env.VERCEL_URL) return normaliseOrigin(process.env.VERCEL_URL);

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
