import type { Metadata } from "next";

import { siteConfig } from "@/lib/config/site";

/**
 * Builds a complete `Metadata` object for a public page.
 *
 * ## Why this exists
 *
 * Next merges page metadata into the root defaults one key at a time. A page
 * that declares `title` and `description` but omits `openGraph` inherits the
 * parent's `openGraph` block *whole* — so before this helper, eight of the
 * eleven public routes emitted the homepage's `og:title`, `og:description` and
 * `og:url`. Sharing any inner page previewed the homepage.
 *
 * Declaring the Open Graph block by hand on every page would work and would
 * drift within a month. Deriving it from the same three values the page already
 * supplies cannot drift: there is one source for the title, one for the
 * description, and one for the URL.
 *
 * `og:image` is deliberately not set here. The file convention at
 * `src/app/opengraph-image.png` applies it to every route already, complete
 * with `og:image:width` and `og:image:height`, and repeating it would create a
 * second source of truth for one tag.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  indexable = true,
}: {
  /** Page title *without* the site-name suffix; the root template adds it. */
  title: string;
  /**
   * Optional because CMS-driven detail pages may have no description recorded.
   * When absent the key is omitted rather than emitted empty, so the page
   * simply has no description instead of an empty one.
   */
  description?: string;
  /** Root-relative canonical path, e.g. `/services`. */
  path: string;
  /** `article` only for genuinely article-shaped pages — posts, case studies. */
  type?: "website" | "article";
  /**
   * Set `false` on a listing page that currently has nothing to list.
   *
   * A page that answers 200 with "No published services yet" is a soft 404: it
   * spends crawl budget, gets indexed as thin content, and drags the average
   * quality of the indexed set down. `follow` deliberately stays on, so the
   * navigation and footer links are still crawled — only this page is held
   * back. It becomes indexable again the moment content is published, because
   * the revalidation webhook rebuilds the metadata along with the page.
   */
  indexable?: boolean;
}): Metadata {
  // The template in app/layout.tsx applies the suffix to `<title>`, but Open
  // Graph consumers get no template, so the suffix is applied explicitly here.
  const socialTitle = `${title} | ${siteConfig.name}`;
  const withDescription = description ? { description } : {};

  return {
    title,
    ...withDescription,
    alternates: { canonical: path },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type,
      siteName: siteConfig.name,
      locale: "en_US",
      title: socialTitle,
      url: path,
      ...withDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      ...withDescription,
    },
  };
}
