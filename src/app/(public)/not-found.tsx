import Link from "next/link";

import { Container } from "@/features/marketing/components/layout";

/**
 * Public 404.
 *
 * Reached both by genuinely unknown URLs and by slugs whose content is not
 * published. The wording is identical in both cases on purpose — the page must
 * not reveal that a draft exists.
 */
export default function PublicNotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        The page you are looking for does not exist or is no longer available.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        Back to home
      </Link>
    </Container>
  );
}
