"use client";

import { useId, useRef, useState } from "react";

import {
  ACCEPTED_RESUME_ACCEPT,
} from "@/features/marketing/application/types/application.types";
import { ApplicationNotice } from "@/features/marketing/application/components/ApplicationNotice";
import {
  formatFileSize,
  validateResumeFile,
} from "@/features/marketing/application/services/resume-upload.client";

export type ResumeUploadPhase = "idle" | "selected" | "extracting" | "ready" | "error";

export function ResumeUpload({
  file,
  phase,
  error,
  onFileSelected,
  onClear,
}: {
  file: File | null;
  phase: ResumeUploadPhase;
  error: string | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleChange(next: File | null) {
    setLocalError(null);
    if (!next) return;
    const validation = validateResumeFile(next);
    if (validation) {
      setLocalError(validation);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    onFileSelected(next);
  }

  const displayError = localError || error;

  return (
    <div className="rounded-2xl border border-hairline-light bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-ink">Auto-fill with Resume</h3>
      <p className="mt-2 text-sm text-ink-muted">
        Upload your resume and we&apos;ll use it to pre-fill your application details.
      </p>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_RESUME_ACCEPT}
        className="sr-only"
        onChange={(e) => handleChange(e.target.files?.[0] ?? null)}
      />

      {!file ? (
        <label
          htmlFor={inputId}
          className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-ink/[0.02] px-4 py-10 text-center transition-colors hover:border-ink/35 hover:bg-ink/[0.04]"
        >
          <span className="inline-flex rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
            Upload Resume
          </span>
          <span className="mt-3 text-xs text-ink-muted">
            Supported formats: <strong className="font-medium text-ink">PDF, DOC, DOCX</strong> · Max
            5 MB
          </span>
        </label>
      ) : (
        <div className="mt-5 rounded-xl border border-hairline-light bg-ink/[0.02] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{formatFileSize(file.size)}</p>
              <p className="mt-2 text-xs font-medium text-ink-muted">
                {phase === "extracting"
                  ? "Extracting details…"
                  : phase === "ready"
                    ? "Ready for review"
                    : phase === "error"
                      ? "Couldn't process this file"
                      : "Selected"}
              </p>
              {phase === "extracting" ? (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-ink/50" />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                onClear();
              }}
              className="shrink-0 text-sm font-medium text-ink-muted hover:text-ink"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {displayError ? (
        <div className="mt-4">
          <ApplicationNotice title="We couldn't use this resume">
            {displayError}
          </ApplicationNotice>
        </div>
      ) : null}
    </div>
  );
}
