import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ActionLink,
  Breadcrumbs,
  CardGrid,
  Container,
  ContentCard,
  PageIntro,
} from "@/features/marketing/components/layout";
import { PublicImage } from "@/features/marketing/components/project-gallery";
import { finalCta } from "@/lib/config/brand";
import { absoluteUrl } from "@/lib/config/site";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getPublishedPostBySlug, getRelatedPosts } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Metadata is derived from the same publication-filtered query the page uses,
 * so a draft cannot reach a title, description, canonical URL or Open Graph
 * tag — an unpublished slug is indistinguishable from one that never existed.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) return { title: "Not found", robots: { index: false, follow: false } };

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      images: post.coverMedia?.url ? [post.coverMedia.url] : undefined,
    },
    twitter: {
      card: post.coverMedia?.url ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverMedia?.url ? [post.coverMedia.url] : undefined,
    },
  };
}

/**
 * Renders stored content as paragraphs.
 *
 * The content column holds plain text. It is rendered as React children, so any
 * markup an editor types is escaped and displayed literally — there is no
 * `dangerouslySetInnerHTML` anywhere in this pipeline and no sanitiser to get
 * wrong. Blank lines separate paragraphs; single newlines are preserved within
 * one. See docs/blog.md for why no rich-text editor was introduced.
 */
function PostContent({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="mt-8 max-w-[46rem]">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-5 whitespace-pre-wrap text-lg leading-relaxed text-ink-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  // The backend computes "same category, then shared tag" itself from the slug.
  const related = await getRelatedPosts(post.slug);

  /**
   * BlogPosting structured data.
   *
   * Only columns that actually exist are emitted. `author` is deliberately
   * absent: `BlogPost.authorId` points at an internal admin user, and there is
   * no approved public author identity — inventing one to satisfy a schema
   * validator would be fabricating a credential. No publisher, rating or review
   * data is claimed either.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.seoDescription ?? post.excerpt
      ? { description: post.seoDescription ?? post.excerpt }
      : {}),
    ...(post.publishedAt ? { datePublished: new Date(post.publishedAt).toISOString() } : {}),
    dateModified: new Date(post.updatedAt).toISOString(),
    ...(post.coverMedia?.url ? { image: [post.coverMedia.url] } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  };

  return (
    <>
      <PageIntro eyebrow="Insights" title={post.title} description={post.excerpt ?? undefined} />

      {/*
        Escaping `<` prevents a `</script>` sequence inside any article field
        from closing this block early and turning stored text into markup.
        JSON.stringify handles quoting; this handles the one character that
        matters inside a script element.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Container className="py-8">
        <Breadcrumbs trail={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          {post.category ? (
            <Link
              href={`/blog?category=${encodeURIComponent(post.category.slug)}`}
              className="text-brand hover:underline"
            >
              {post.category.name}
            </Link>
          ) : null}
          {post.publishedAt ? (
            <time dateTime={toIsoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
          ) : null}
          {/* No author is shown: the author relation is an internal admin user
              and there is no approved public author identity. See docs/blog.md. */}
        </div>

        {post.coverMedia?.url ? (
          <figure className="mt-6">
            <div className="aspect-16/9 overflow-hidden border border-hairline-light bg-ice">
              <PublicImage
                url={post.coverMedia.url}
                /* Empty alt when the CMS has none: a decorative image is better
                   than an invented description of something unseen. */
                altText={post.coverMedia.altText}
                width={post.coverMedia.width}
                height={post.coverMedia.height}
              />
            </div>
          </figure>
        ) : null}

        {post.content ? <PostContent content={post.content} /> : null}

        {post.tags.length > 0 ? (
          <nav aria-label="Post tags" className="mt-10">
            <h2 className="tech-label text-ink-muted">Tags</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                    className="border border-hairline-light px-3 py-1 text-sm text-ink-muted transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    #{tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {/* Only published posts reach this list, and the current post is
            excluded at the query level. Fewer than three is shown as fewer. */}
        {related.length > 0 ? (
          <section className="mt-14 border-t border-hairline-light pt-10">
            <h2 className="text-h3 font-semibold text-ink">Related reading</h2>
            <div className="mt-6">
              <CardGrid>
                {related.map((entry) => (
                  <ContentCard
                    key={entry.slug}
                    title={entry.title}
                    href={`/blog/${entry.slug}`}
                    description={entry.excerpt}
                    image={entry.coverMedia}
                    meta={
                      entry.publishedAt ? (
                        <time dateTime={toIsoDate(entry.publishedAt)}>
                          {formatDate(entry.publishedAt)}
                        </time>
                      ) : undefined
                    }
                  />
                ))}
              </CardGrid>
            </div>
          </section>
        ) : null}

        <section className="mt-14 border-t border-hairline-light pt-8">
          <h2 className="text-h3 font-semibold text-ink">{finalCta.heading}</h2>
          <p className="mt-3 max-w-2xl text-sm text-ink-muted">{finalCta.supporting}</p>
          <div className="mt-5">
            <ActionLink href="/contact" tone="paper">
              Start a conversation
            </ActionLink>
          </div>
        </section>
      </Container>
    </>
  );
}
