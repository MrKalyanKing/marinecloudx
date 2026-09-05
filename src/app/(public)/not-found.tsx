import Link from "next/link";

import { Container, PageBody } from "@/features/marketing/components/layout";

/**
 * Public 404.
 *
 * Reached both by genuinely unknown URLs and by slugs whose content is not
 * published. The wording is identical in both cases on purpose — the page must
 * not reveal that a draft exists.
 */
export default function PublicNotFound() {
  return (
    <PageBody>
      <Container className="py-32 text-center sm:py-40">
        <p className="tech-label text-brand">404</p>
        <h1 className="mt-2 text-h2 font-semibold text-ink">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          The page you are looking for does not exist or is no longer available.
        </p>
        <Link href="/" className="btn-solid mt-8 inline-flex rounded-full px-5 py-2.5 text-sm font-medium">
          Back to home
        </Link>
      </Container>
    </PageBody>
  );
}
