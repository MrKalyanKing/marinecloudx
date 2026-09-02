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

import { Container } from "@/features/marketing/components/layout";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        We could not load this page. Please try again in a moment.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}
