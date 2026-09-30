"use client";

import type { ApplicationJobInfo } from "@/features/marketing/application/types/application.types";

const EMPLOYMENT_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

export function ApplicationJobSummary({ job }: { job: ApplicationJobInfo }) {
  const meta = [
    job.department,
    job.location,
    EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-2xl border border-hairline-light bg-white/80 px-5 py-4">
      <p className="tech-label text-ink-muted">Applying for</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">{job.title}</h2>
      {meta ? <p className="mt-1 text-sm text-ink-muted">{meta}</p> : null}
      {job.jobCode ? (
        <p className="mt-2 font-mono text-xs text-ink-muted">Job ID: {job.jobCode}</p>
      ) : null}
    </div>
  );
}
