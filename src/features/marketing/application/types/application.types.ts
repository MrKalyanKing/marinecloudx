export type ApplicationMethod = "resume_autofill" | "manual";

export type ApplicationStep =
  | "choose"
  | "autofill_upload"
  | "form"
  | "success";

export interface ApplicationFormValues {
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  currentJobTitle: string;
  yearsOfExperience: string;
  summary: string;
  skills: string;
  coverLetter: string;
}

export interface ExtractedResumeFields {
  candidateName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  currentJobTitle?: string;
  yearsOfExperience?: number;
  summary?: string;
  skills?: string[];
  education?: unknown[];
  workExperience?: unknown[];
  method?: "document" | "ai" | "partial";
  reliable?: boolean;
  message?: string;
}

export interface ApplicationSubmitResult {
  id: string;
  applicationCode: string;
  jobCode: string;
  jobTitle: string;
}

export interface ApplicationJobInfo {
  id: string;
  jobCode: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employmentType: string;
}

export const EMPTY_APPLICATION_VALUES: ApplicationFormValues = {
  candidateName: "",
  email: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  currentJobTitle: "",
  yearsOfExperience: "",
  summary: "",
  skills: "",
  coverLetter: "",
};

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".docx", ".doc"] as const;
export const ACCEPTED_RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
