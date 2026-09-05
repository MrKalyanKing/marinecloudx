import type { Metadata } from "next";
import Link from "next/link";

import {
  CardGrid,
  Container,
  ContentCard,
  PageBody,
  PageIntro,
  PublicEmptyState,
  PublicPagination,
  cx,
} from "@/features/marketing/components/layout";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getBlogFilterOptions, getPublishedPosts } from "@/features/content/services/content";

const DEFAULT_PAGE_SIZE = 12;
/** Matches the admin API convention. A caller cannot ask for more. */
const MAX_PAGE_SIZE = 100;

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing from the MarineCloudeX team.",
  alternates: { canonical: "/blog" },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    category?: string;
    tag?: string;
    q?: string;
  }>;
}

/** Pill link used for both category and tag filters. */
function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "tech-label inline-flex border px-3 py-1.5 transition-colors",
        active
          ? "border-brand bg-brand/5 text-brand"
          : "border-hairline-light text-ink-muted hover:border-brand/50 hover:text-brand",
      )}
    >
      {children}
    </Link>
  );
}

export default async function BlogPage({ searchParams }: PageProps) {
  const query = await searchParams;

  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(query.pageSize) || DEFAULT_PAGE_SIZE));

  const category = query.category?.trim() || undefined;
  const tag = query.tag?.trim() || undefined;
  const search = query.q?.trim().slice(0, 200) || undefined;

  // Filtering and paging both happen in the database. The archive is never sent
  // to the browser and then narrowed there.
  const [{ rows, total }, filterOptions] = await Promise.all([
    getPublishedPosts(page, pageSize, { category, tag, search }),
    getBlogFilterOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeCategory = filterOptions.categories.find((entry) => entry.slug === category);
  const activeTag = filterOptions.tags.find((entry) => entry.slug === tag);
  const isFiltered = Boolean(category ?? tag ?? search);

  // Carried across every filter link and page link so a filter is never
  // silently dropped when the reader pages or narrows further.
  const carried = { category, tag, q: search };

  function filterHref(next: { category?: string; tag?: string }) {
    const params = new URLSearchParams();
    const merged = { ...carried, ...next };

    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
    }

    const suffix = params.toString();

    return suffix ? `/blog?${suffix}` : "/blog";
  }

  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Technical thinking"
        description="Writing from the MarineCloudeX team — editorial, not a blog grid first."
      />

      <PageBody>
      <Container className="py-8">
        <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <label htmlFor="blog-search" className="tech-label text-ink-muted">
              Search posts
            </label>
            <input
              id="blog-search"
              name="q"
              type="search"
              defaultValue={search ?? ""}
              placeholder="Title or summary"
              className="mt-2 w-full border border-hairline-light bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            />
          </div>

          {/* Filters already applied stay applied when a search is submitted. */}
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {tag ? <input type="hidden" name="tag" value={tag} /> : null}

          <button
            type="submit"
            className="border border-hairline-light px-4 py-2 text-sm text-ink transition-colors hover:border-brand hover:text-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            Search
          </button>

          {isFiltered ? (
            <Link href="/blog" className="text-sm text-brand hover:underline">
              Clear filters
            </Link>
          ) : null}
        </form>

        {filterOptions.categories.length > 0 ? (
          <nav aria-label="Filter posts by category" className="mb-4">
            <ul className="flex flex-wrap gap-2">
              <li>
                <FilterPill href={filterHref({ category: undefined })} active={!category}>
                  All categories
                </FilterPill>
              </li>
              {filterOptions.categories.map((entry) => (
                <li key={entry.slug}>
                  <FilterPill
                    href={filterHref({ category: entry.slug })}
                    active={entry.slug === category}
                  >
                    {entry.name} ({entry._count.posts})
                  </FilterPill>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {filterOptions.tags.length > 0 ? (
          <nav aria-label="Filter posts by tag" className="mb-8">
            <ul className="flex flex-wrap gap-2">
              {tag ? (
                <li>
                  <FilterPill href={filterHref({ tag: undefined })} active={false}>
                    Clear tag
                  </FilterPill>
                </li>
              ) : null}
              {filterOptions.tags.map((entry) => (
                <li key={entry.slug}>
                  <FilterPill href={filterHref({ tag: entry.slug })} active={entry.slug === tag}>
                    #{entry.name}
                  </FilterPill>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {rows.length === 0 ? (
          <PublicEmptyState
            title={isFiltered ? "No posts match those filters" : "No published posts yet"}
            description={
              isFiltered
                ? [
                    activeCategory ? `Category: ${activeCategory.name}.` : null,
                    activeTag ? `Tag: ${activeTag.name}.` : null,
                    "Try clearing the filters.",
                  ]
                    .filter(Boolean)
                    .join(" ")
                : "Posts appear here once they are published in the admin CMS."
            }
          />
        ) : (
          <>
            <CardGrid>
              {rows.map((post) => (
                <ContentCard
                  headingLevel={2}
                  key={post.slug}
                  title={post.title}
                  href={`/blog/${post.slug}`}
                  description={post.excerpt}
                  image={post.coverMedia}
                  tags={post.tags.map((entry) => entry.name)}
                  meta={
                    <>
                      {post.category ? <span>{post.category.name} · </span> : null}
                      {post.publishedAt ? (
                        <time dateTime={toIsoDate(post.publishedAt)}>
                          {formatDate(post.publishedAt)}
                        </time>
                      ) : null}
                    </>
                  }
                />
              ))}
            </CardGrid>

            <PublicPagination
              page={page}
              totalPages={totalPages}
              basePath="/blog"
              params={{
                ...carried,
                pageSize: pageSize === DEFAULT_PAGE_SIZE ? undefined : String(pageSize),
              }}
            />
          </>
        )}
      </Container>
      </PageBody>
    </>
  );
}
