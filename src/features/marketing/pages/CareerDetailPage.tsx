import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Container,
  PageBody,
  Section,
  cx,
} from "@/features/marketing/components/layout";
import { getPublishedJobBySlug } from "@/features/content/services/content";
import { pageMetadata } from "@/lib/config/metadata";

const EMPLOYMENT_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let job = null;
  try {
    job = await getPublishedJobBySlug(slug);
  } catch {
    job = null;
  }
  if (!job) {
    return pageMetadata({
      title: "Role not found",
      description: "This position is no longer available.",
      path: `/careers/${slug}`,
      indexable: false,
    });
  }
  return pageMetadata({
    title: `${job.title} — Careers`,
    description: job.description.slice(0, 160),
    path: `/careers/${job.slug}`,
  });
}

const CAREERS_CTA =
  "inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90";

function stripLeadingHeading(body: string, heading: string): string {
  const trimmed = body.trim();
  const pattern = new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[:\\-–—]?\\s*\\n+`, "i");
  return trimmed.replace(pattern, "").trim();
}

/** Split CMS text into readable paragraphs or a bullet list. */
function JobProse({ body }: { body: string }) {
  const lines = body
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  const looksLikeList =
    lines.length >= 3 &&
    lines.every((line) => line.length < 220) &&
    lines.filter((line) => !/[.!?]$/.test(line) || line.length < 120).length >=
      Math.ceil(lines.length * 0.6);

  if (looksLikeList) {
    return (
      <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-ink-muted marker:text-ink/40">
        {lines.map((line) => (
          <li key={line} className="pl-1">
            {line.replace(/^[-•*]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  }

  const paragraphs = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .filter(Boolean);

  return (
    <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-muted">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function JobSection({ title, body }: { title: string; body: string | null }) {
  if (!body?.trim()) return null;
  return (
    <section className="border-t border-hairline-light pt-8">
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      <JobProse body={body} />
    </section>
  );
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let job = null;
  try {
    job = await getPublishedJobBySlug(slug);
  } catch {
    job = null;
  }
  if (!job) notFound();

  const meta = [
    job.department,
    job.location,
    EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType,
    job.experience,
  ].filter(Boolean);

  return (
    <PageBody>
      <Section size="none" className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        <Container className="max-w-3xl">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            ← All open roles
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="tech-label text-brand">Careers</p>
              <h1 className="mt-3 text-h2 font-semibold text-balance text-ink">{job.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {meta.map((item) => (
                  <span
                    key={item}
                    className="tech-label inline-flex rounded-full border border-hairline-light bg-white/70 px-2.5 py-1 text-ink-muted"
                  >
                    {item}
                  </span>
                ))}
                {job.salaryRange ? (
                  <span className="tech-label inline-flex rounded-full border border-hairline-light bg-white/70 px-2.5 py-1 text-ink-muted">
                    {job.salaryRange}
                  </span>
                ) : null}
              </div>
            </div>

            <Link href={`/careers/${job.slug}/apply`} className={cx(CAREERS_CTA, "shrink-0 self-start")}>
              Apply now →
            </Link>
          </div>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink">About the role</h2>
              <JobProse body={stripLeadingHeading(job.description, "About the Role")} />
            </section>

            <JobSection title="Responsibilities" body={job.responsibilities} />
            <JobSection title="Requirements" body={job.requirements} />
            <JobSection title="Nice to have" body={job.niceToHave} />
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 border-t border-hairline-light pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              Ready to apply for <span className="font-medium text-ink">{job.title}</span>?
            </p>
            <Link href={`/careers/${job.slug}/apply`} className={CAREERS_CTA}>
              Apply now →
            </Link>
          </div>
        </Container>
      </Section>
    </PageBody>
  );
}
