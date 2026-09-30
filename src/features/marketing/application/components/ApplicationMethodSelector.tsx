"use client";

import type { ApplicationMethod } from "@/features/marketing/application/types/application.types";

export function ApplicationMethodSelector({
  onSelect,
}: {
  onSelect: (method: ApplicationMethod) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">How would you like to apply?</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Choose how you&apos;d like to apply. Upload your resume to save time, or enter your details
        manually.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("resume_autofill")}
          className="group flex flex-col items-start rounded-2xl border border-hairline-light bg-white p-5 text-left shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-22px_rgba(15,23,42,0.4)]"
        >
          <span className="tech-label text-ink-muted">Faster</span>
          <span className="mt-2 text-base font-semibold text-ink">Auto-fill with Resume</span>
          <span className="mt-2 text-sm leading-relaxed text-ink-muted">
            Upload your resume and we&apos;ll use it to pre-fill your application details.
          </span>
          <span className="mt-5 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-ink/90">
            Upload Resume
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("manual")}
          className="group flex flex-col items-start rounded-2xl border border-hairline-light bg-white p-5 text-left shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-22px_rgba(15,23,42,0.4)]"
        >
          <span className="tech-label text-ink-muted">Full control</span>
          <span className="mt-2 text-base font-semibold text-ink">Apply Manually</span>
          <span className="mt-2 text-sm leading-relaxed text-ink-muted">
            Enter the application details yourself in a short, focused form.
          </span>
          <span className="mt-5 inline-flex rounded-xl border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors group-hover:bg-ink/[0.03]">
            Continue
          </span>
        </button>
      </div>
    </div>
  );
}
