import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";
import Link from "next/link";

import {
  Container,
  PageBody,
  PublicEmptyState,
  PublicPagination,
  cx,
} from "@/features/marketing/components/layout";
import { BlogCard } from "@/features/marketing/components/blog-card";
import { getBlogFilterOptions, getPublishedPosts } from "@/features/content/services/content";

const DEFAULT_PAGE_SIZE = 12;
/** Matches the admin API convention. A caller cannot ask for more. */
const MAX_PAGE_SIZE = 100;

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
  const rows = await getPublishedPosts(1, 1);

  return pageMetadata({
  title: "Insights on AI, Cloud & Software Engineering",
  description:
    "Practical writing on building production AI, cloud architecture, IoT data pipelines and software delivery, from the engineers who build these systems daily.",
  path: "/blog",
    indexable: rows.total > 0,
  });
}

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
        "tech-label inline-flex rounded-full px-3 py-1.5 transition-colors",
        active
          ? "border border-brand bg-brand/10 text-brand"
          : "chip-glass text-ink-muted hover:text-brand",
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
      {/* 01 — Unified Header Section with Search & Categories */}
      <section className="relative overflow-hidden px-5 pt-32 pb-12 text-ink sm:px-8 sm:pt-36 sm:pb-16">
        <Container className="relative max-w-[1320px]">
          <div className="max-w-[840px]">
            <p className="tech-label text-brand">Insights</p>
            <h1 className="mt-4 text-[clamp(2.4rem,5vw,3.8rem)] font-semibold tracking-[-0.035em] text-ink">
              Technical thinking
            </h1>
            <p className="mt-4 text-lead text-ink-muted">
              Writing from the MarineCloudX team — editorial, not a blog grid first.
            </p>

            {/* Search Input Bar inside Header */}
            <div className="mt-8 max-w-[640px]">
              <form method="get" className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="blog-search"
                    name="q"
                    type="search"
                    defaultValue={search ?? ""}
                    placeholder="Search articles by title, topic or keyword..."
                    className="w-full rounded-full border border-black/15 bg-white/90 px-5 py-3 text-[14.5px] text-ink placeholder:text-ink-muted/70 shadow-sm backdrop-blur-md focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                {category ? <input type="hidden" name="category" value={category} /> : null}
                {tag ? <input type="hidden" name="tag" value={tag} /> : null}
                <button
                  type="submit"
                  className="btn-solid rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap"
                >
                  Search
                </button>
                {isFiltered ? (
                  <Link href="/blog" className="whitespace-nowrap text-sm text-brand hover:underline ml-2">
                    Clear
                  </Link>
                ) : null}
              </form>
            </div>

            {/* Category Filter Pills inside Header */}
            {filterOptions.categories.length > 0 ? (
              <div className="mt-7">
                <p className="tech-label text-[11px] text-ink-muted mb-2.5">Filter by Service</p>
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
              </div>
            ) : null}

            {/* Tag Pills inside Header */}
            {filterOptions.tags.length > 0 ? (
              <div className="mt-4">
                <ul className="flex flex-wrap gap-1.5">
                  {tag ? (
                    <li>
                      <FilterPill href={filterHref({ tag: undefined })} active={false}>
                        ✕ Clear tag
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
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* 02 — Articles Listing */}
      <PageBody>
        <Container className="max-w-[1320px] py-12">
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((post, index) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    priority={index === 0}
                  />
                ))}
              </div>

              <div className="mt-12">
                <PublicPagination
                  page={page}
                  totalPages={totalPages}
                  basePath="/blog"
                  params={{
                    ...carried,
                    pageSize: pageSize === DEFAULT_PAGE_SIZE ? undefined : String(pageSize),
                  }}
                />
              </div>
            </>
          )}
        </Container>
      </PageBody>
    </>
  );
}
