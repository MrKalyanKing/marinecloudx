import {
  ACCEPTED_RESUME_EXTENSIONS,
  MAX_RESUME_BYTES,
} from "@/features/marketing/application/types/application.types";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateResumeFile(file: File): string | null {
  const lower = file.name.toLowerCase();
  const okExt = ACCEPTED_RESUME_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!okExt) {
    return "Please upload your resume as a PDF or DOCX file.";
  }
  if (file.size <= 0) {
    return "This file looks empty. Please choose another resume.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "Your resume is a bit too large. Please upload a file under 5 MB.";
  }
  return null;
}

export function isLikelyUrl(value: string, hostHint?: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (hostHint && !url.hostname.includes(hostHint)) return false;
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
