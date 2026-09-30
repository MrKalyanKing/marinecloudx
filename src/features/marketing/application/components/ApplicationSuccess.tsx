"use client";

import Link from "next/link";

import type { ApplicationSubmitResult } from "@/features/marketing/application/types/application.types";

export function ApplicationSuccess({
  result,
  careersHref,
}: {
  result: ApplicationSubmitResult;
  careersHref: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline-light bg-white p-6 text-center sm:p-8">
      <p className="tech-label text-ink-muted">Confirmation</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink">
        Application Submitted Successfully
      </h2>
      <p className="mt-3 text-sm text-ink-muted">Thank you for applying to MarineCloudX.</p>

      <dl className="mx-auto mt-8 max-w-md space-y-3 rounded-2xl border border-hairline-light bg-ink/[0.02] px-5 py-4 text-left">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">Position</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{result.jobTitle}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">Job ID</dt>
          <dd className="mt-1 font-mono text-sm text-ink">{result.jobCode}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Application ID
          </dt>
          <dd className="mt-1 font-mono text-sm text-ink">{result.applicationCode}</dd>
        </div>
      </dl>

      <p className="mt-5 text-sm text-ink-muted">
        Please keep your Application ID for future reference.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={careersHref}
          className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        >
          Back to Careers
        </Link>
        <Link
          href="/careers"
          className="inline-flex items-center justify-center rounded-xl border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/[0.03]"
        >
          View Other Opportunities
        </Link>
      </div>
    </div>
  );
}
