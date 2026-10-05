import type { Metadata } from "next";
import Link from "next/link";

import {
  CandidateScheduler,
  type ScheduleDetailsPayload,
} from "@/features/marketing/interview/CandidateScheduler";
import { Container, PageBody, Section } from "@/features/marketing/components/layout";
import { pageMetadata } from "@/lib/config/metadata";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Schedule Your Interview — MarineCloudX",
    description: "Choose a suitable date and time for your interview with MarineCloudX.",
    path: "/careers/interview/schedule",
    indexable: false,
  });
}

export default async function CandidateSchedulePage({ params }: PageProps) {
  const { token } = await params;

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const apiUrl = (
    rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
      ? rawApiUrl
      : `https://${rawApiUrl}`
  ).replace(/\/+$/, "");

  let payload: ScheduleDetailsPayload | null = null;
  let errorMessage: string | null = null;

  try {
    const res = await fetch(
      `${apiUrl}/public/careers/interview-scheduling/${encodeURIComponent(token)}`,
      {
        headers: { accept: "application/json" },
        cache: "no-store",
      },
    );

    const json = await res.json().catch(() => null);

    if (res.ok && json) {
      payload = (json.data ?? json) as ScheduleDetailsPayload;
    } else {
      errorMessage =
        json?.error?.message ||
        json?.message ||
        "This scheduling link is invalid, expired, or no longer available.";
    }
  } catch {
    errorMessage = "Could not reach the scheduling service. Please check your connection.";
  }

  return (
    <PageBody>
      <Section size="none" className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <Container className="max-w-5xl">
          {errorMessage || !payload ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-hairline-light bg-white p-8 text-center shadow-xl sm:p-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700">
                !
              </div>
              <p className="tech-label text-ink-muted">Scheduling Notice</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Unable to Open Scheduling Link
              </h1>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                {errorMessage}
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                If you believe this is in error, please contact the MarineCloudX recruitment team for assistance.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
                >
                  Back to Careers
                </Link>
              </div>
            </div>
          ) : (
            <CandidateScheduler token={token} initialData={payload} />
          )}
        </Container>
      </Section>
    </PageBody>
  );
}
