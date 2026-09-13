"use client";

/**
 * Public error boundary.
 *
 * Shows a neutral message only. The `error` object reaching the browser is
 * already redacted by Next in production, and nothing here renders its message,
 * stack or digest — a database failure must never surface SQL, Prisma detail or
 * internal identifiers to a visitor.
 */

import Link from "next/link";

import { Container, PageBody } from "@/features/marketing/components/layout";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageBody>
      <Container className="py-32 text-center sm:py-40">
        <h1 className="text-h2 font-semibold text-ink">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          We could not load this page. Please try again in a moment.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-solid rounded-full px-5 py-2.5 text-sm font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-hairline-light hover:bg-ink/5"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </PageBody>
  );
}
