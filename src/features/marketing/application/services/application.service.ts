import type {
  ApplicationFormValues,
  ApplicationSubmitResult,
  ExtractedResumeFields,
} from "@/features/marketing/application/types/application.types";

import { toApplicantMessage } from "@/features/marketing/application/services/applicant-messages";

function envelopeError(data: unknown, fallback: string): string {
  return toApplicantMessage(data, fallback);
}

export async function parseResumeFile(file: File): Promise<ExtractedResumeFields> {
  const body = new FormData();
  body.append("resume", file);

  const res = await fetch("/api/public/careers/parse-resume", {
    method: "POST",
    body,
  });
  const data = (await res.json().catch(() => null)) as
    | { success: true; data: ExtractedResumeFields }
    | { success: false; error?: { message?: string } }
    | null;

  if (!res.ok || !data || data.success !== true) {
    throw new Error(
      envelopeError(
        data,
        "We couldn't read that resume. Please try another file, or apply manually.",
      ),
    );
  }
  return data.data;
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function submitApplication(input: {
  jobId: string;
  values: ApplicationFormValues;
  resumeFile: File | null;
  method: "resume_autofill" | "manual";
  education?: unknown[];
  workExperience?: unknown[];
}): Promise<ApplicationSubmitResult> {
  const body = new FormData();
  body.append("candidateName", input.values.candidateName.trim());
  body.append("email", input.values.email.trim());
  if (input.values.phone.trim()) body.append("phone", input.values.phone.trim());
  if (input.values.location.trim()) body.append("location", input.values.location.trim());
  if (input.values.linkedinUrl.trim()) {
    body.append("linkedinUrl", normalizeUrl(input.values.linkedinUrl));
  }
  if (input.values.githubUrl.trim()) {
    body.append("githubUrl", normalizeUrl(input.values.githubUrl));
  }
  if (input.values.portfolioUrl.trim()) {
    body.append("portfolioUrl", normalizeUrl(input.values.portfolioUrl));
  }
  if (input.values.currentJobTitle.trim()) {
    body.append("currentJobTitle", input.values.currentJobTitle.trim());
  }
  if (input.values.yearsOfExperience.trim()) {
    body.append("yearsOfExperience", input.values.yearsOfExperience.trim());
  }
  if (input.values.summary.trim()) body.append("summary", input.values.summary.trim());
  if (input.values.coverLetter.trim()) body.append("coverLetter", input.values.coverLetter.trim());

  const skills = input.values.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (skills.length > 0) body.append("skills", JSON.stringify(skills));
  if (input.education?.length) body.append("education", JSON.stringify(input.education));
  if (input.workExperience?.length) {
    body.append("workExperience", JSON.stringify(input.workExperience));
  }

  body.append(
    "applicationSource",
    input.method === "resume_autofill" ? "RESUME_UPLOAD" : "MANUAL_APPLICATION",
  );

  if (input.resumeFile) body.append("resume", input.resumeFile);

  const res = await fetch(
    `/api/public/careers/jobs/${encodeURIComponent(input.jobId)}/applications`,
    { method: "POST", body },
  );
  const data = (await res.json().catch(() => null)) as
    | { success: true; data: ApplicationSubmitResult }
    | { success: false; error?: { message?: string } }
    | null;

  if (!res.ok || !data || data.success !== true) {
    throw new Error(
      envelopeError(
        data,
        "Something went wrong while sending your application. Please wait a moment and try again.",
      ),
    );
  }
  return data.data;
}
