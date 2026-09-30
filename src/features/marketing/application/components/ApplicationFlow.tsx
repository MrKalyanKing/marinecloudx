"use client";

import { useState, useTransition } from "react";

import { ApplicationFormFields } from "@/features/marketing/application/components/ApplicationFormFields";
import { ApplicationJobSummary } from "@/features/marketing/application/components/ApplicationJobSummary";
import { ApplicationMethodSelector } from "@/features/marketing/application/components/ApplicationMethodSelector";
import { ApplicationSuccess } from "@/features/marketing/application/components/ApplicationSuccess";
import { ResumeExtractionStatus } from "@/features/marketing/application/components/ResumeExtractionStatus";
import {
  ResumeUpload,
  type ResumeUploadPhase,
} from "@/features/marketing/application/components/ResumeUpload";
import {
  parseResumeFile,
  submitApplication,
} from "@/features/marketing/application/services/application.service";
import { toApplicantMessage } from "@/features/marketing/application/services/applicant-messages";
import {
  isLikelyUrl,
  isValidEmail,
  isValidPhone,
  validateResumeFile,
} from "@/features/marketing/application/services/resume-upload.client";
import {
  EMPTY_APPLICATION_VALUES,
  type ApplicationFormValues,
  type ApplicationJobInfo,
  type ApplicationMethod,
  type ApplicationStep,
  type ApplicationSubmitResult,
  type ExtractedResumeFields,
} from "@/features/marketing/application/types/application.types";

type FieldErrors = Partial<Record<keyof ApplicationFormValues | "resume" | "form", string>>;

function mapExtracted(extracted: ExtractedResumeFields): ApplicationFormValues {
  return {
    candidateName: extracted.candidateName ?? "",
    email: extracted.email ?? "",
    phone: extracted.phone ?? "",
    location: extracted.location ?? "",
    linkedinUrl: extracted.linkedinUrl ?? "",
    githubUrl: extracted.githubUrl ?? "",
    portfolioUrl: extracted.portfolioUrl ?? "",
    currentJobTitle: extracted.currentJobTitle ?? "",
    yearsOfExperience:
      extracted.yearsOfExperience !== undefined && extracted.yearsOfExperience !== null
        ? String(extracted.yearsOfExperience)
        : "",
    summary: extracted.summary ?? "",
    skills: (extracted.skills ?? []).join(", "),
    coverLetter: "",
  };
}

function validate(values: ApplicationFormValues, resumeFile: File | null, resumeRequired: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.candidateName.trim()) errors.candidateName = "Full name is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.phone.trim()) errors.phone = "Phone is required.";
  else if (!isValidPhone(values.phone)) errors.phone = "Enter a valid phone number.";
  if (!values.location.trim()) errors.location = "Location is required.";
  if (!values.linkedinUrl.trim()) errors.linkedinUrl = "LinkedIn profile is required.";
  else if (!isLikelyUrl(values.linkedinUrl, "linkedin.com")) {
    errors.linkedinUrl = "Enter a valid LinkedIn URL.";
  }
  if (!values.summary.trim()) errors.summary = "Professional summary is required.";
  if (values.githubUrl.trim() && !isLikelyUrl(values.githubUrl, "github.com")) {
    errors.githubUrl = "Enter a valid GitHub URL.";
  }
  if (values.portfolioUrl.trim() && !isLikelyUrl(values.portfolioUrl)) {
    errors.portfolioUrl = "Enter a valid website URL.";
  }
  if (resumeRequired && !resumeFile) errors.resume = "Please attach your resume.";
  if (resumeFile) {
    const resumeError = validateResumeFile(resumeFile);
    if (resumeError) errors.resume = resumeError;
  }
  return errors;
}

export function ApplicationFlow({ job }: { job: ApplicationJobInfo }) {
  const [step, setStep] = useState<ApplicationStep>("choose");
  const [method, setMethod] = useState<ApplicationMethod | null>(null);
  const [values, setValues] = useState<ApplicationFormValues>(EMPTY_APPLICATION_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<ResumeUploadPhase>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractionMessage, setExtractionMessage] = useState<string | null>(null);
  const [education, setEducation] = useState<unknown[]>([]);
  const [workExperience, setWorkExperience] = useState<unknown[]>([]);
  const [result, setResult] = useState<ApplicationSubmitResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorFocusToken, setErrorFocusToken] = useState(0);

  function setField<K extends keyof ApplicationFormValues>(key: K, value: ApplicationFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key] && !prev.form) return prev;
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
  }

  function chooseMethod(next: ApplicationMethod) {
    setMethod(next);
    setErrors({});
    setUploadError(null);
    setExtractionMessage(null);
    if (next === "manual") {
      setResumeFile(null);
      setValues(EMPTY_APPLICATION_VALUES);
      setEducation([]);
      setWorkExperience([]);
      setStep("form");
      return;
    }
    setStep("autofill_upload");
  }

  async function handleResumeSelected(file: File) {
    setResumeFile(file);
    setUploadPhase("extracting");
    setUploadError(null);
    try {
      const extracted = await parseResumeFile(file);
      setValues(mapExtracted(extracted));
      setEducation(extracted.education ?? []);
      setWorkExperience(extracted.workExperience ?? []);
      setExtractionMessage(
        extracted.message ?? "Details extracted from your resume. Please review before submitting.",
      );
      setUploadPhase("ready");
      setStep("form");
    } catch (err) {
      setUploadPhase("error");
      setUploadError(
        toApplicantMessage(err, "We couldn't read that resume. Please try another file, or apply manually."),
      );
    }
  }

  function handleSubmit() {
    if (!method || isPending) return;
    const nextErrors = validate(values, resumeFile, true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setErrorFocusToken((token) => token + 1);
      return;
    }

    startTransition(async () => {
      try {
        const submitted = await submitApplication({
          jobId: job.id,
          values,
          resumeFile,
          method,
          education,
          workExperience,
        });
        setResult(submitted);
        setStep("success");
      } catch (err) {
        setErrors({
          form: toApplicantMessage(
            err,
            "Something went wrong while sending your application. Please wait a moment and try again.",
          ),
        });
        setErrorFocusToken((token) => token + 1);
      }
    });
  }

  if (step === "success" && result) {
    return <ApplicationSuccess result={result} careersHref={`/careers/${job.slug}`} />;
  }

  return (
    <div className="space-y-6">
      <ApplicationJobSummary job={job} />

      <div>
        <h1 className="text-h2 font-semibold text-balance text-ink">Apply for {job.title}</h1>
        {step === "choose" ? (
          <p className="mt-2 text-sm text-ink-muted">
            Choose how you&apos;d like to apply. Upload your resume to save time, or enter your
            details manually.
          </p>
        ) : null}
      </div>

      {step === "choose" ? <ApplicationMethodSelector onSelect={chooseMethod} /> : null}

      {step === "autofill_upload" ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setStep("choose");
              setMethod(null);
              setResumeFile(null);
              setUploadPhase("idle");
              setUploadError(null);
            }}
            className="text-sm font-medium text-ink-muted hover:text-ink"
          >
            ← Change application method
          </button>
          <ResumeUpload
            file={resumeFile}
            phase={uploadPhase}
            error={uploadError}
            onFileSelected={(file) => void handleResumeSelected(file)}
            onClear={() => {
              setResumeFile(null);
              setUploadPhase("idle");
              setUploadError(null);
            }}
          />
        </div>
      ) : null}

      {step === "form" ? (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">
                {method === "resume_autofill" ? "Review your application" : "Application details"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {method === "resume_autofill"
                  ? "Review your details before submitting. You can edit any field."
                  : "Complete the fields below to apply. It only takes a couple of minutes."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("choose");
                setMethod(null);
                setErrors({});
              }}
              className="shrink-0 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              ← Change method
            </button>
          </div>

          {method === "resume_autofill" && extractionMessage ? (
            <ResumeExtractionStatus message={extractionMessage} />
          ) : null}

          <ApplicationFormFields
            values={values}
            errors={errors}
            errorFocusToken={errorFocusToken}
            disabled={isPending}
            resumeRequired
            resumeFileName={resumeFile?.name ?? null}
            onChange={setField}
            onResumeChange={(file) => {
              if (!file) {
                setResumeFile(null);
                return;
              }
              const err = validateResumeFile(file);
              if (err) {
                setErrors((prev) => ({ ...prev, resume: err }));
                setErrorFocusToken((token) => token + 1);
                return;
              }
              setResumeFile(file);
              setErrors((prev) => {
                if (!prev.resume) return prev;
                const next = { ...prev };
                delete next.resume;
                return next;
              });
            }}
            onSubmit={handleSubmit}
            submitLabel={isPending ? "Submitting…" : "Submit application"}
          />
        </div>
      ) : null}
    </div>
  );
}
