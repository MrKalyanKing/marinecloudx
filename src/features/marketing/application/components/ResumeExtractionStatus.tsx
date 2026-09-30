"use client";

export function ResumeExtractionStatus({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3 text-sm text-ink">
      <p className="font-medium">Review your details before submitting.</p>
      <p className="mt-1 text-ink-muted">{message}</p>
    </div>
  );
}
