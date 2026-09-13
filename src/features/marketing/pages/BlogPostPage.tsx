import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  Container,
  PageBody,
} from "@/features/marketing/components/layout";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { BlogCard, SERVICE_BLOG_IMAGES } from "@/features/marketing/components/blog-card";
import { absoluteUrl, siteConfig } from "@/lib/config/site";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getPublishedPostBySlug, getRelatedPosts, getSitemapEntries } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const entries = await getSitemapEntries();
    return entries.posts.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) return { title: "Not found", robots: { index: false, follow: false } };

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? undefined;
  const imageUrl = post.coverMedia?.url || SERVICE_BLOG_IMAGES[post.slug] || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      siteName: siteConfig.name,
      locale: "en_US",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

function PostContent({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto mt-10 max-w-[50rem] space-y-6 text-[17px] leading-[1.8] text-ink/85">
      {paragraphs.map((paragraph, index) => {
        // Check if paragraph is a subheader
        if (paragraph.length < 80 && !paragraph.endsWith(".") && !paragraph.includes("\n")) {
          return (
            <h2 key={index} className="pt-4 text-2xl font-bold tracking-tight text-ink">
              {paragraph}
            </h2>
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(post.slug);
  const imageUrl = post.coverMedia?.url || SERVICE_BLOG_IMAGES[post.slug] || "/images/blog/strategy-discovery.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.seoDescription ?? post.excerpt
      ? { description: post.seoDescription ?? post.excerpt }
      : {}),
    ...(post.publishedAt ? { datePublished: new Date(post.publishedAt).toISOString() } : {}),
    dateModified: new Date(post.updatedAt).toISOString(),
    image: [imageUrl],
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="relative overflow-hidden px-5 pt-32 pb-8 text-ink sm:px-8 sm:pt-36">
        <Container className="relative max-w-[1020px]">
          <div className="mb-6">
            <Breadcrumbs trail={[{ label: "Insights", href: "/blog" }, { label: post.title }]} />
          </div>

          {/* Category Badge & Date Header matching Image 3 */}
          <div className="text-center">
            {post.category ? (
              <div className="inline-flex">
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category.slug)}`}
                  className="chip-glass rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wider text-brand uppercase hover:bg-brand/10 transition-colors"
                >
                  {post.category.name}
                </Link>
              </div>
            ) : null}

            <h1 className="mt-5 text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-tight tracking-[-0.03em] text-ink">
              {post.title}
            </h1>

            {post.publishedAt ? (
              <div className="mt-4 text-sm font-medium text-ink-muted">
                <time dateTime={toIsoDate(post.publishedAt)}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            ) : null}
          </div>

          {/* Featured Hero Illustration matching Image 3 */}
          <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-[940px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md">
            <Image
              src={imageUrl}
              alt={post.coverMedia?.altText || post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 940px"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <PageBody>
        <Container className="max-w-[1020px] py-10">
          {/* Article Body Content */}
          {post.content ? <PostContent content={post.content} /> : null}

          {/* Tags */}
          {post.tags.length > 0 ? (
            <div className="mx-auto mt-12 max-w-[50rem] border-t border-hairline-light pt-8">
              <p className="tech-label text-ink-muted mb-3">Tagged With</p>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                      className="chip-glass px-3.5 py-1.5 text-xs font-medium text-ink-muted hover:text-brand transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Related Blog Articles matching Image 3 and Point 3 */}
          {related.length > 0 ? (
            <section className="mt-20 border-t border-hairline-light pt-12">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="tech-label text-brand">Related Insights</p>
                  <h2 className="mt-2 text-h2 font-semibold text-ink">Related Articles</h2>
                </div>
                <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
                  All articles →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((entry) => (
                  <BlogCard key={entry.slug} post={entry} />
                ))}
              </div>
            </section>
          ) : null}
        </Container>
      </PageBody>

      <FinalCta />
    </>
  );
}
