/**
 * Maps API / runtime failures to short, applicant-friendly copy.
 * Never surfaces stack traces, S3, AWS, HTTP codes, or developer jargon.
 */

const FRIENDLY_FALLBACK =
  "Something went wrong on our side. Please wait a moment and try again.";

const KNOWN: Array<{ match: RegExp; message: string }> = [
  {
    match: /store your resume|upload.*resume|resume uploads? are temporarily|file storage|s3|aws/i,
    message:
      "We couldn't upload your resume just now. Please wait a few seconds and try again.",
  },
  {
    match: /already applied/i,
    message:
      "You've already applied for this role with this email. We'll be in touch if there's an update.",
  },
  {
    match: /deadline/i,
    message: "Applications for this role are closed. Please explore other open positions.",
  },
  {
    match: /no longer accepting|no longer available/i,
    message: "This role is no longer open for applications. Please browse other careers.",
  },
  {
    match: /could not read|could not be parsed|unsupported resume|legacy \.doc|empty/i,
    message:
      "We couldn't read that resume. Please try a clear PDF or DOCX, or apply manually instead.",
  },
  {
    match: /5\s*mb|too large|file size/i,
    message: "Your resume is a bit too large. Please upload a file under 5 MB.",
  },
  {
    match: /pdf or docx|attach a resume|choose a resume/i,
    message: "Please upload your resume as a PDF or DOCX file.",
  },
  {
    match: /check the highlighted|invalid structured|validation/i,
    message: "Please check the highlighted fields and try again.",
  },
  {
    match: /network|failed to fetch|timeout|502|503|504/i,
    message: "We couldn't reach the server. Please check your connection and try again.",
  },
];

export function toApplicantMessage(raw: unknown, fallback = FRIENDLY_FALLBACK): string {
  const text = extractMessage(raw);
  if (!text) return fallback;

  for (const entry of KNOWN) {
    if (entry.match.test(text)) return entry.message;
  }

  // Already sounds human (short, no jargon) — keep it.
  if (
    text.length <= 180 &&
    !/[A-Z]{3,}_[A-Z]|Exception|Error:|at\s+\w+|ECONN|ENOENT|TypeError|stack/i.test(text)
  ) {
    return text;
  }

  return fallback;
}

function extractMessage(raw: unknown): string {
  if (typeof raw === "string") return raw.trim();
  if (raw instanceof Error) return raw.message.trim();
  if (!raw || typeof raw !== "object") return "";

  const obj = raw as Record<string, unknown>;

  if (typeof obj.message === "string") return obj.message.trim();
  if (Array.isArray(obj.message)) {
    return obj.message.filter((m) => typeof m === "string").join(" ").trim();
  }

  if (obj.error && typeof obj.error === "object") {
    const err = obj.error as Record<string, unknown>;
    if (typeof err.message === "string") return err.message.trim();
    if (Array.isArray(err.message)) {
      return err.message.filter((m) => typeof m === "string").join(" ").trim();
    }
  }

  return "";
}
