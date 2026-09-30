"use client";

import { useEffect } from "react";

import type { ApplicationFormValues } from "@/features/marketing/application/types/application.types";
import { ApplicationNotice } from "@/features/marketing/application/components/ApplicationNotice";

type ErrorKey = keyof ApplicationFormValues | "resume" | "form";

/** Visual field order — first error in this list is scrolled into view. */
const FIELD_FOCUS_ORDER: ErrorKey[] = [
  "form",
  "resume",
  "candidateName",
  "email",
  "phone",
  "location",
  "linkedinUrl",
  "currentJobTitle",
  "yearsOfExperience",
  "githubUrl",
  "portfolioUrl",
  "skills",
  "summary",
  "coverLetter",
];

const inputBase =
  "box-border w-full rounded-xl border bg-white px-4 py-3 text-[15px] leading-normal text-ink shadow-sm placeholder:text-slate-400 transition-[border-color,box-shadow] focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const inputOk =
  "border-slate-300 focus:border-slate-500 focus:ring-slate-200/80";
const inputError =
  "border-rose-400 focus:border-rose-500 focus:ring-rose-200/70";

const textareaBase =
  "box-border w-full min-h-[140px] resize-y rounded-xl border bg-white p-4 text-[15px] leading-relaxed text-ink shadow-sm placeholder:text-slate-400 transition-[border-color,box-shadow] focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const fileOk =
  "box-border w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-3.5 text-sm text-ink file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";
const fileError =
  "box-border w-full cursor-pointer rounded-xl border border-dashed border-rose-400 bg-rose-50/40 px-4 py-3.5 text-sm text-ink file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500";
const errorClass = "mt-2 text-xs font-medium text-rose-600";

function firstErrorKey(errors: Partial<Record<ErrorKey, string>>): ErrorKey | null {
  for (const key of FIELD_FOCUS_ORDER) {
    if (errors[key]) return key;
  }
  return null;
}

function scrollToErrorField(key: ErrorKey) {
  const target =
    document.getElementById(`application-field-${key}`) ??
    document.getElementById(key);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusable =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
      ? target
      : target.querySelector<HTMLElement>("input, textarea, select, button");

  window.setTimeout(() => {
    focusable?.focus({ preventScroll: true });
  }, 280);
}

function Field({
  id,
  label,
  required,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={`application-field-${id}`} className="min-w-0 scroll-mt-28">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className={errorClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ApplicationFormFields({
  values,
  errors,
  errorFocusToken = 0,
  disabled,
  resumeRequired,
  resumeFileName,
  onChange,
  onResumeChange,
  onSubmit,
  submitLabel,
}: {
  values: ApplicationFormValues;
  errors: Partial<Record<ErrorKey, string>>;
  /** Bumped on submit/server failure so we scroll only then, not while typing. */
  errorFocusToken?: number;
  disabled: boolean;
  resumeRequired: boolean;
  resumeFileName: string | null;
  onChange: <K extends keyof ApplicationFormValues>(key: K, value: ApplicationFormValues[K]) => void;
  onResumeChange: (file: File | null) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  useEffect(() => {
    if (!errorFocusToken) return;
    const key = firstErrorKey(errors);
    if (!key) return;
    const frame = window.requestAnimationFrame(() => scrollToErrorField(key));
    return () => window.cancelAnimationFrame(frame);
  }, [errorFocusToken, errors]);

  function controlClass(hasError: boolean, kind: "input" | "textarea" | "file") {
    if (kind === "textarea") {
      return `${textareaBase} ${hasError ? inputError : inputOk}`;
    }
    if (kind === "file") {
      return hasError ? fileError : fileOk;
    }
    return `${inputBase} ${hasError ? inputError : inputOk}`;
  }

  return (
    <form
      className="space-y-7"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {errors.form ? (
        <div id="application-field-form" className="scroll-mt-28">
          <ApplicationNotice title="We couldn't submit your application">
            {errors.form}
          </ApplicationNotice>
        </div>
      ) : null}

      <section className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-ink">Resume</h3>
          <p className="mt-1 text-sm text-ink-muted">PDF or DOCX, up to 5 MB.</p>
        </div>
        <Field id="resume" label="Resume file" required={resumeRequired} error={errors.resume}>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={disabled}
            className={controlClass(Boolean(errors.resume), "file")}
            aria-invalid={Boolean(errors.resume)}
            aria-describedby={errors.resume ? "resume-error" : undefined}
            onChange={(e) => onResumeChange(e.target.files?.[0] ?? null)}
          />
          {resumeFileName ? (
            <p className="mt-2 text-xs font-medium text-slate-600">Attached: {resumeFileName}</p>
          ) : null}
        </Field>
      </section>

      <div className="border-t border-slate-200/80" />

      <section className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-ink">Contact details</h3>
          <p className="mt-1 text-sm text-ink-muted">How we can reach you about this role.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="candidateName" label="Full Name" required error={errors.candidateName}>
            <input
              id="candidateName"
              className={controlClass(Boolean(errors.candidateName), "input")}
              disabled={disabled}
              placeholder="Jane Doe"
              value={values.candidateName}
              aria-invalid={Boolean(errors.candidateName)}
              aria-describedby={errors.candidateName ? "candidateName-error" : undefined}
              onChange={(e) => onChange("candidateName", e.target.value)}
            />
          </Field>
          <Field id="email" label="Email" required error={errors.email}>
            <input
              id="email"
              type="email"
              className={controlClass(Boolean(errors.email), "input")}
              disabled={disabled}
              placeholder="jane@example.com"
              value={values.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </Field>
          <Field id="phone" label="Phone" required error={errors.phone}>
            <input
              id="phone"
              className={controlClass(Boolean(errors.phone), "input")}
              disabled={disabled}
              placeholder="+91 98765 43210"
              value={values.phone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </Field>
          <Field id="location" label="Location" required error={errors.location}>
            <input
              id="location"
              className={controlClass(Boolean(errors.location), "input")}
              disabled={disabled}
              placeholder="Hyderabad, India"
              value={values.location}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-slate-200/80" />

      <section className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-ink">Profile & experience</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Optional links and background that help us review you faster.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="linkedinUrl" label="LinkedIn Profile" required error={errors.linkedinUrl}>
            <input
              id="linkedinUrl"
              className={controlClass(Boolean(errors.linkedinUrl), "input")}
              disabled={disabled}
              placeholder="https://linkedin.com/in/…"
              value={values.linkedinUrl}
              aria-invalid={Boolean(errors.linkedinUrl)}
              aria-describedby={errors.linkedinUrl ? "linkedinUrl-error" : undefined}
              onChange={(e) => onChange("linkedinUrl", e.target.value)}
            />
          </Field>
          <Field id="currentJobTitle" label="Current Role" error={errors.currentJobTitle}>
            <input
              id="currentJobTitle"
              className={controlClass(Boolean(errors.currentJobTitle), "input")}
              disabled={disabled}
              placeholder="Student / Intern"
              value={values.currentJobTitle}
              onChange={(e) => onChange("currentJobTitle", e.target.value)}
            />
          </Field>
          <Field id="yearsOfExperience" label="Years of Experience" error={errors.yearsOfExperience}>
            <input
              id="yearsOfExperience"
              type="number"
              min={0}
              step={0.5}
              className={controlClass(Boolean(errors.yearsOfExperience), "input")}
              disabled={disabled}
              placeholder="0"
              value={values.yearsOfExperience}
              onChange={(e) => onChange("yearsOfExperience", e.target.value)}
            />
          </Field>
          <Field id="githubUrl" label="GitHub" error={errors.githubUrl}>
            <input
              id="githubUrl"
              className={controlClass(Boolean(errors.githubUrl), "input")}
              disabled={disabled}
              placeholder="https://github.com/…"
              value={values.githubUrl}
              aria-invalid={Boolean(errors.githubUrl)}
              aria-describedby={errors.githubUrl ? "githubUrl-error" : undefined}
              onChange={(e) => onChange("githubUrl", e.target.value)}
            />
          </Field>
          <Field id="portfolioUrl" label="Portfolio / Website" error={errors.portfolioUrl}>
            <input
              id="portfolioUrl"
              className={controlClass(Boolean(errors.portfolioUrl), "input")}
              disabled={disabled}
              placeholder="https://…"
              value={values.portfolioUrl}
              aria-invalid={Boolean(errors.portfolioUrl)}
              aria-describedby={errors.portfolioUrl ? "portfolioUrl-error" : undefined}
              onChange={(e) => onChange("portfolioUrl", e.target.value)}
            />
          </Field>
          <Field
            id="skills"
            label="Relevant Skills"
            error={errors.skills}
            hint="Separate skills with commas."
          >
            <input
              id="skills"
              className={controlClass(Boolean(errors.skills), "input")}
              disabled={disabled}
              placeholder="SEO, Content, Analytics"
              value={values.skills}
              onChange={(e) => onChange("skills", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <div className="border-t border-slate-200/80" />

      <section className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-ink">About you</h3>
          <p className="mt-1 text-sm text-ink-muted">
            A short summary helps us understand your fit for the role.
          </p>
        </div>

        <Field id="summary" label="Professional Summary" required error={errors.summary}>
          <textarea
            id="summary"
            rows={5}
            className={controlClass(Boolean(errors.summary), "textarea")}
            style={{ padding: "1rem" }}
            disabled={disabled}
            placeholder="A short summary of your background and interest in this role."
            value={values.summary}
            aria-invalid={Boolean(errors.summary)}
            aria-describedby={errors.summary ? "summary-error" : undefined}
            onChange={(e) => onChange("summary", e.target.value)}
          />
        </Field>

        <Field id="coverLetter" label="Additional Information" error={errors.coverLetter}>
          <textarea
            id="coverLetter"
            rows={4}
            className={controlClass(Boolean(errors.coverLetter), "textarea")}
            style={{ padding: "1rem" }}
            disabled={disabled}
            placeholder="Anything else we should know?"
            value={values.coverLetter}
            onChange={(e) => onChange("coverLetter", e.target.value)}
          />
        </Field>
      </section>

      <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Required fields are marked with *</p>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
