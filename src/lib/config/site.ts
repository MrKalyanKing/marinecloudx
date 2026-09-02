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

export const siteConfig = {
  name: "MarineCloudeX",
  descriptor: "Technologies",
  legalName: "MarineCloudeX",
  /** Approved positioning line. Single source: src/config/brand.ts. */
  tagline: brand.positioning,
  description:
    "MarineCloudeX designs and builds software, digital products and intelligent systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
} as const;

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

export const footerNavigation = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Projects", href: "/projects" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
  {
    heading: "More",
    links: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog", href: "/blog" },
    ],
  },
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export type SiteConfig = typeof siteConfig;
