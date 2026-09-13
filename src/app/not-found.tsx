import type { Metadata } from "next";
import Link from "next/link";

import { Container, PageBody } from "@/features/marketing/components/layout";
import { SiteFooter } from "@/features/marketing/components/site-footer";
import { SiteHeader } from "@/features/marketing/components/site-header";

/**
 * Root 404 — the page unmatched URLs actually reach.
 *
 * ## Why this file exists separately from (public)/not-found.tsx
 *
 * A route group does not create a URL segment, so `app/(public)/not-found.tsx`
 * only catches `notFound()` calls raised *inside* that segment. A URL matching
 * no route at all falls through to the application root, and with no
 * `app/not-found.tsx` present Next served its own built-in page: the bare
 * "404 — This page could not be found" screen, with no header, no navigation,
 * no footer and no link back into the site. Every crawl of a dead URL ended
 * there.
 *
 * This renders inside the root layout rather than the public one, so the shell
 * is assembled here. The wording matches the in-segment 404 deliberately: an
 * unpublished slug and a URL that never existed must be indistinguishable, or
 * the 404 page becomes a way to enumerate drafts.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-navy text-ink">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="relative z-[1] flex-1">
        <PageBody>
          <Container className="py-32 text-center sm:py-40">
            <p className="tech-label text-brand">404</p>
            <h1 className="mt-2 text-h2 font-semibold text-ink">Page not found</h1>
            <p className="mx-auto mt-3 max-w-md text-ink-muted">
              The page you are looking for does not exist or is no longer available.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="btn-solid inline-flex rounded-full px-5 py-2.5 text-sm font-medium"
              >
                Back to home
              </Link>
              <Link
                href="/services"
                className="rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-hairline-light hover:bg-ink/5"
              >
                Browse services
              </Link>
            </div>
          </Container>
        </PageBody>
      </main>

      <SiteFooter />
    </div>
  );
}
