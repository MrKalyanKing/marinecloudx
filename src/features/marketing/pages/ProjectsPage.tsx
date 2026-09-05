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
import { getProjectFilterCategories, getPublishedProjects } from "@/features/content/services/content";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work delivered by MarineCloudeX.",
  alternates: { canonical: "/projects" },
};

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { page: rawPage, category: rawCategory } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);

  // A slug, not an id: the filter is shareable and readable in the URL. An
  // unknown slug matches nothing rather than erroring, and cannot reveal drafts.
  const category = rawCategory?.trim() || undefined;

  // Both queries are filtered and paginated in the database — the full
  // catalogue is never sent to the browser and never filtered client-side.
  const [{ rows, total }, categories] = await Promise.all([
    getPublishedProjects(page, PAGE_SIZE, category),
    getProjectFilterCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCategory = categories.find((entry) => entry.slug === category);

  return (
    <>
      <PageIntro
        eyebrow="Selected work"
        title="Systems in the field"
        description="Published projects from the CMS — real work, not invented case studies."
      />

      <PageBody>
      <Container className="py-8">
        {/* Filtering is a plain set of links, so it works without JavaScript
            and every filtered view has its own shareable URL. */}
        {categories.length > 0 ? (
          <nav aria-label="Filter projects by category" className="mb-8">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/projects"
                  aria-current={category ? undefined : "page"}
                  className={cx(
                    "tech-label inline-flex rounded-full px-3 py-1.5 transition-colors",
                    category
                      ? "chip-glass text-ink-muted hover:text-brand"
                      : "border border-brand bg-brand/10 text-brand",
                  )}
                >
                  All
                </Link>
              </li>
              {categories.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/projects?category=${encodeURIComponent(entry.slug)}`}
                    aria-current={entry.slug === category ? "page" : undefined}
                    className={cx(
                      "tech-label inline-flex rounded-full px-3 py-1.5 transition-colors",
                      entry.slug === category
                        ? "border border-brand bg-brand/10 text-brand"
                        : "chip-glass text-ink-muted hover:text-brand",
                    )}
                  >
                    {entry.name} ({entry._count.projects})
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {rows.length === 0 ? (
          <PublicEmptyState
            title={activeCategory ? `No published projects in ${activeCategory.name}` : "No published projects yet"}
            description={
              activeCategory
                ? "Try another category, or view all projects."
                : "Projects appear here once they are published in the admin CMS."
            }
          />
        ) : (
          <>
            <CardGrid>
              {rows.map((project) => (
                <ContentCard
                  headingLevel={2}
                  key={project.slug}
                  title={project.title}
                  href={`/projects/${project.slug}`}
                  description={project.shortDescription}
                  image={project.coverMedia}
                  meta={project.category?.name}
                  tags={[
                    ...project.industries.map((industry) => industry.name),
                    ...project.technologies.map((technology) => technology.name),
                  ]}
                />
              ))}
            </CardGrid>

            <PublicPagination
              page={page}
              totalPages={totalPages}
              basePath="/projects"
              params={{ category }}
            />
          </>
        )}
      </Container>
      </PageBody>
    </>
  );
}
