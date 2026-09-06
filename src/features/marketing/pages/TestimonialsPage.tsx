import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";
import Link from "next/link";

import {
  Container,
  PageBody,
  PageIntro,
  PublicEmptyState,
} from "@/features/marketing/components/layout";
import { getPublishedTestimonials } from "@/features/content/services/content";

/**
 * Marked noindex while the listing is empty.
 *
 * A page that answers 200 with "nothing published yet" is a soft 404 — thin
 * content that consumes crawl budget and lowers the quality of the indexed set.
 * `follow` stays on so the surrounding navigation is still crawled. Publishing
 * anything flips it back, because the revalidation webhook rebuilds this along
 * with the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const rows = await getPublishedTestimonials();

  return pageMetadata({
  title: "Client Reviews of Our Development Work",
  description:
    "What clients say about working with MarineCloudX across custom software, cloud platform, AI and connected system projects. In their own words.",
  path: "/testimonials",
    indexable: rows.length > 0,
  });
}

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <PageIntro title="Testimonials" />

      <PageBody>
        <Container className="py-8">
          {testimonials.length === 0 ? (
            <PublicEmptyState
              title="No published testimonials yet"
              description="Testimonials appear here once they are published in the admin CMS."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.id} className="quote-card p-6">

                  <p className="text-ink-muted">{testimonial.content}</p>
                  <footer className="mt-3 text-sm text-ink-muted">
                    <span className="font-medium text-ink">{testimonial.authorName}</span>
                    {testimonial.authorRole ? `, ${testimonial.authorRole}` : ""}
                    {testimonial.companyName ? ` · ${testimonial.companyName}` : ""}
                    {testimonial.project ? (
                      <>
                        {" · "}
                        <Link
                          href={`/projects/${testimonial.project.slug}`}
                          className="text-brand hover:underline"
                        >
                          {testimonial.project.title}
                        </Link>
                      </>
                    ) : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </Container>
      </PageBody>
    </>
  );
}
