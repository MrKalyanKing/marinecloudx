import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  Container,
  PageBody,
  Section,
  SectionHeader,
  cx,
} from "@/features/marketing/components/layout";
import {
  getPublishedJobs,
  type PublicJobCard,
} from "@/features/content/services/content";
import { pageMetadata } from "@/lib/config/metadata";

const EMPLOYMENT_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

export async function generateMetadata(): Promise<Metadata> {
  const { total } = await getPublishedJobs(1, 1);
  return pageMetadata({
    title: "Careers at MarineCloudX",
    description:
      "Join MarineCloudX — explore open roles in engineering, product, and design. Apply with your resume in minutes.",
    path: "/careers",
    indexable: total > 0,
  });
}

function roleGlance(description: string, max = 180): string {
  const cleaned = description.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function JobRoleCard({ job }: { job: PublicJobCard }) {
  const typeLabel = EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType;
  const meta = [job.department, job.location, typeLabel, job.experience].filter(Boolean);

  return (
    <li>
      <Link
        href={`/careers/${job.slug}`}
        className={cx(
          "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-hairline-light",
          "bg-white/70 px-5 py-6 shadow-[0_12px_36px_-24px_rgba(15,23,42,0.35)]",
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white",
          "hover:shadow-[0_20px_48px_-24px_rgba(15,23,42,0.4)] sm:px-7 sm:py-7",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-ink/80 transition-opacity group-hover:bg-ink"
        />

        <div className="flex flex-wrap items-center gap-2">
          {meta.map((item) => (
            <span
              key={item}
              className="tech-label inline-flex rounded-full border border-hairline-light bg-ink/[0.04] px-2.5 py-1 text-ink-muted"
            >
              {item}
            </span>
          ))}
          {job.salaryRange ? (
            <span className="tech-label inline-flex rounded-full border border-hairline-light bg-white/80 px-2.5 py-1 text-ink-muted">
              {job.salaryRange}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 max-w-3xl">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-ink/80 sm:text-2xl">
              {job.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              {roleGlance(job.description)}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center justify-center self-start rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-ink/90 sm:self-end">
            View role →
          </span>
        </div>
      </Link>
    </li>
  );
}

function CareersEmptyState() {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-hairline-light bg-white/50 shadow-[0_24px_60px_-28px_rgba(91,74,232,0.28)]">
      <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
        <Image
          src="/images/careers-no-positions.png"
          alt="No open positions right now — we're preparing our next roles, check back soon."
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 1120px"
        />
      </div>
      <div className="flex flex-col items-start justify-between gap-4 border-t border-hairline-light px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="max-w-xl text-sm text-ink-muted">
          Nothing published at the moment. Prefer to introduce yourself anyway?{" "}
          <Link href="/contact" className="font-medium text-brand hover:underline">
            Reach out via Contact
          </Link>
          .
        </p>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        >
          Contact us →
        </Link>
      </div>
    </div>
  );
}

export default async function CareersPage() {
  const { rows, total } = await getPublishedJobs(1, 50);

  return (
    <PageBody>
      <Section size="none" className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        <Container>
          <SectionHeader
            eyebrow="Careers"
            title="Build with us"
            description="We're hiring people who care about craft, clarity, and shipping real systems. Browse open roles and apply directly."
          />

          {total === 0 ? (
            <CareersEmptyState />
          ) : (
            <ul className="mt-10 flex flex-col gap-5">
              {rows.map((job) => (
                <JobRoleCard key={job.id} job={job} />
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </PageBody>
  );
}
