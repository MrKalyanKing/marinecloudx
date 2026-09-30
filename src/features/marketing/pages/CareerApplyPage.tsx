import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationFlow } from "@/features/marketing/application/components/ApplicationFlow";
import { Container, PageBody, Section } from "@/features/marketing/components/layout";
import { getPublishedJobBySlug } from "@/features/content/services/content";
import { pageMetadata } from "@/lib/config/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) {
    return pageMetadata({
      title: "Apply — role not found",
      description: "This position is no longer available.",
      path: `/careers/${slug}/apply`,
      indexable: false,
    });
  }
  return pageMetadata({
    title: `Apply — ${job.title}`,
    description: `Submit your application for ${job.title} at MarineCloudX.`,
    path: `/careers/${job.slug}/apply`,
    indexable: false,
  });
}

export default async function CareerApplyPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  return (
    <PageBody>
      <Section size="none" className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container className="max-w-3xl">
          <Link
            href={`/careers/${job.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            ← Back to role details
          </Link>

          <div className="mt-8">
            <ApplicationFlow
              job={{
                id: job.id,
                jobCode: job.jobCode ?? "",
                title: job.title,
                slug: job.slug,
                department: job.department,
                location: job.location,
                employmentType: job.employmentType,
              }}
            />
          </div>
        </Container>
      </Section>
    </PageBody>
  );
}
