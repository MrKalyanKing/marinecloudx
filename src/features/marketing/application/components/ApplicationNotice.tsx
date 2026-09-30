"use client";

/**
 * Calm, applicant-facing notices — never expose developer/system wording.
 */
export function ApplicationNotice({
  tone = "error",
  title,
  children,
}: {
  tone?: "error" | "info";
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    tone === "error"
      ? "border-rose-200/80 bg-gradient-to-br from-rose-50 to-orange-50/40 text-rose-950"
      : "border-slate-200 bg-gradient-to-br from-slate-50 to-white text-ink";

  const iconStyles =
    tone === "error"
      ? "bg-rose-100 text-rose-700 ring-rose-200/80"
      : "bg-slate-100 text-slate-700 ring-slate-200/80";

  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)] sm:px-5 sm:py-4 ${styles}`}
    >
      <span
        aria-hidden
        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1 ring-inset ${iconStyles}`}
      >
        {tone === "error" ? "!" : "i"}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-semibold tracking-[-0.01em]">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-current/80">{children}</div>
      </div>
    </div>
  );
}
