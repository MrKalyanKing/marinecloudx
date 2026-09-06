import { AmbientTrails } from "@/features/marketing/components/ambient-trails";
import { OrganizationJsonLd } from "@/features/marketing/components/structured-data";
import { ScrollAmbient } from "@/features/marketing/components/scroll-ambient";
import { SiteFooter } from "@/features/marketing/components/site-footer";
import { SiteHeader } from "@/features/marketing/components/site-header";

/**
 * Public pages are cached and revalidated, not rendered per request.
 *
 * Segment config declared on the layout applies to every child route, so this
 * is the single place the public site's rendering mode is decided.
 *
 * ## Why this changed from `force-dynamic`
 *
 * The original note here explained the choice as: the CMS is the source of
 * truth, an unpublish must take content down immediately, and tag-based caching
 * had been removed after `revalidateTag` failed to invalidate `unstable_cache`
 * entries reliably.
 *
 * That reasoning was sound and is now obsolete. The `unstable_cache` mechanism
 * it refers to is gone. Content reads go through `fetch` tagged with
 * `CONTENT_TAG` (see features/content/services/content.ts), and the backend
 * calls `POST /api/revalidate` on publish, unpublish and every other mutation,
 * which runs `revalidateTag(CONTENT_TAG, { expire: 0 })`. That drops both the
 * data cache and the cached HTML of every route that read the tag.
 *
 * So immediacy is preserved by the webhook, not by re-rendering on every hit.
 * `revalidate` below is only the safety net for the case where the webhook does
 * not arrive — the same role `REVALIDATE_SECONDS` already plays for the data
 * layer. Rendering every request instead meant every crawler visit paid for a
 * full render plus an API round trip, with nothing cached in between.
 *
 * If an unpublish ever appears to lag, the webhook is the thing to check, not
 * this number.
 */
export const revalidate = 300;

/**
 * Public site shell — white canvas, black content, multi-color accents.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-navy text-ink">
      {/* Sitewide, not homepage-only. A visitor arriving on a service page from
          search previously landed on a document that identified no organisation
          at all — nine of eleven routes emitted no structured data whatsoever. */}
      <OrganizationJsonLd />
      <ScrollAmbient />
      {/* `overflow-hidden` matters: the colour field inside is deliberately
          oversized (inset -25%) so its edges never show, and without clipping
          here that overhang reaches the document and produces a horizontal
          scrollbar on narrow screens. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-wash" />
        <div className="ambient-glow" />
        <div className="absolute inset-0 grid-lines" />
        <div className="scroll-lines" />
        {/* Two ribbons that follow the section you are reading. Inside this
            fixed, z-0 layer, so they sit behind all page content — `main` is
            z-1 — and behind the noise that sits on top of everything. */}
        <AmbientTrails />
        <div className="ambient-noise opacity-10" />
      </div>

      {/* First focusable element on every page. A fixed header with a primary
          nav and three footer navs sits ahead of the content, so without this
          a keyboard user tabs the whole menu before reaching anything. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteHeader />
      <main id="main" tabIndex={-1} className="relative z-[1] flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
