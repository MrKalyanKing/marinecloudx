import { SiteFooter } from "@/features/marketing/components/site-footer";
import { SiteHeader } from "@/features/marketing/components/site-header";

/**
 * Public pages render per request.
 *
 * Segment config declared on the layout applies to every child route, so this
 * is the single place the public site's rendering mode is decided.
 *
 * Why dynamic rather than ISR: the CMS is the source of truth and an unpublish
 * must take content down immediately. Tag-based caching was built first and
 * removed after `revalidateTag` failed to reliably invalidate `unstable_cache`
 * entries under test — see docs/public-site.md. Caching is a deliberate
 * follow-up once there is traffic to justify tuning it.
 */
export const dynamic = "force-dynamic";

/**
 * Public site shell — white canvas, black content, multi-color accents.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-navy text-ink">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-wash" />
        <div className="ambient-glow" />
        <div className="absolute inset-0 grid-lines" />
        <div className="ambient-noise opacity-10" />
      </div>

      <SiteHeader />
      <main className="relative z-[1] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
