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
 * Public site shell.
 *
 * A route group, so `/admin` keeps its own chrome and never inherits the public
 * header or footer.
 *
 * The background and text colours are set explicitly rather than inherited: the
 * scaffold stylesheet flips with `prefers-color-scheme`, and a half-dark public
 * site would be an accident rather than a design decision. A real dark mode
 * belongs to the UI step.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* The header is fixed and overlays the hero, so pages own their own top
          spacing rather than the layout adding a gap the hero does not want. */}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
