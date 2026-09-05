import type { Metadata } from "next";
import Link from "next/link";

import {
  Container,
  PageBody,
  PageIntro,
  PublicEmptyState,
} from "@/features/marketing/components/layout";
import { getPublishedTestimonials } from "@/features/content/services/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients have said about working with MarineCloudeX.",
  alternates: { canonical: "/testimonials" },
};

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
                <blockquote
                  key={testimonial.id}
                  className="rounded-lg border border-hairline-light p-4"
                >
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
