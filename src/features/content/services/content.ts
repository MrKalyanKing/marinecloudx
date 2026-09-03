import "server-only";

/**
 * Public content data layer — now API-driven.
 *
 * Every reader here calls the NestJS backend over HTTP. The publication filter
 * (`status = PUBLISHED` / `isActive = true`) is enforced by the backend, so a
 * draft can never reach the website: an unpublished slug returns 404, which
 * these readers surface as `null` for the page to turn into `notFound()`.
 *
 * Replaces the pre-monorepo Prisma implementation. `server-only` keeps this out
 * of the client graph; results are cached at the `fetch` layer under the
 * `content` tag, which a CMS publish revalidates (see ./cache.ts and
 * app/api/revalidate).
 */

import { CONTENT_TAG, REVALIDATE_SECONDS } from "@/features/content/services/cache";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = (rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://") ? rawApiUrl : `https://${rawApiUrl}`).replace(/\/+$/, "");

interface Envelope<T> {
  success: boolean;
  data: T;
  pagination?: { page: number; pageSize: number; total: number; totalPages: number };
  error?: { code: string; message: string };
}

async function api<T>(path: string): Promise<Envelope<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { accept: "application/json" },
    next: { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  });
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!body) {
    throw new Error(`content: non-JSON response from ${path} (${res.status})`);
  }
  return body;
}

/** GETs a detail resource, returning `null` on 404 (draft or missing). */
async function detail<T>(path: string): Promise<T | null> {
  const body = await api<T>(path);
  if (body.success) return body.data;
  if (body.error?.code === "NOT_FOUND") return null;
  throw new Error(`content: ${path} -> ${body.error?.code ?? "error"}`);
}

async function ok<T>(path: string): Promise<T> {
  const body = await api<T>(path);
  if (!body.success) throw new Error(`content: ${path} -> ${body.error?.code ?? "error"}`);
  return body.data;
}

async function list<T>(path: string): Promise<{ rows: T[]; total: number }> {
  const body = await api<T[]>(path);
  if (!body.success) throw new Error(`content: ${path} -> ${body.error?.code ?? "error"}`);
  return { rows: body.data, total: body.pagination?.total ?? body.data.length };
}

function qs(params: Record<string, string | number | undefined>): string {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") s.set(k, String(v));
  }
  const out = s.toString();
  return out ? `?${out}` : "";
}

/* ----------------------------- media shape ----------------------------- */

export interface MediaRef {
  id: string;
  url: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
}

/* ------------------------------- services ------------------------------ */

export function getPublishedServices() {
  return ok<{ id: string; name: string; slug: string; shortDescription: string | null }[]>(
    "/services",
  );
}

export function getPublishedServiceBySlug(slug: string) {
  return detail<{
    name: string;
    slug: string;
    shortDescription: string | null;
    fullDescription: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    features: { id: string; name: string; description: string | null }[];
    industries: { name: string; slug: string }[];
    technologies: { name: string; slug: string }[];
    projects: { title: string; slug: string; shortDescription: string | null }[];
  }>(`/services/${encodeURIComponent(slug)}`);
}

/* ------------------------------ industries ---------------------------- */

export function getActiveIndustries() {
  return ok<{ name: string; slug: string; description: string | null }[]>("/industries");
}

export function getActiveIndustryBySlug(slug: string) {
  return detail<{
    name: string;
    slug: string;
    description: string | null;
    updatedAt: string;
    services: { name: string; slug: string; shortDescription: string | null }[];
    projects: { title: string; slug: string; shortDescription: string | null }[];
  }>(`/industries/${encodeURIComponent(slug)}`);
}

/* ------------------------------- projects ----------------------------- */

export async function getPublishedProjects(
  page: number,
  pageSize: number,
  categorySlug?: string,
) {
  return list<{
    title: string;
    slug: string;
    shortDescription: string | null;
    featured: boolean;
    publishedAt: string | null;
    category: { name: string; slug: string } | null;
    coverMedia: MediaRef | null;
    industries: { name: string; slug: string }[];
    technologies: { name: string; slug: string }[];
  }>(`/projects${qs({ page, pageSize, category: categorySlug })}`);
}

export async function getProjectFilterCategories() {
  const rows = await ok<{ name: string; slug: string; count: number }[]>(
    "/projects/filter-categories",
  );
  return rows.map((c) => ({ name: c.name, slug: c.slug, _count: { projects: c.count } }));
}

export interface GalleryItem {
  id: string;
  role: string;
  caption: string | null;
  media: { id: string; url: string | null; altText: string | null; width: number | null; height: number | null };
}

export interface ProjectDetail {
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  liveUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
  category: { name: string; slug: string } | null;
  coverMedia: MediaRef | null;
  services: { name: string; slug: string }[];
  industries: { name: string; slug: string }[];
  technologies: { name: string; slug: string }[];
  media: GalleryItem[];
  caseStudy: { status: string } | null;
  testimonials: {
    authorName: string;
    authorRole: string | null;
    companyName: string | null;
    content: string;
    rating: number | null;
  }[];
}

export function getPublishedProjectBySlug(slug: string) {
  return detail<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`);
}

/* ----------------------------- case studies --------------------------- */

export function getPublishedCaseStudies() {
  return ok<
    {
      publishedAt: string | null;
      project: {
        title: string;
        slug: string;
        shortDescription: string | null;
        coverMedia: MediaRef | null;
      };
    }[]
  >("/case-studies");
}

export interface CaseStudyDetail {
  challenge: string | null;
  approach: string | null;
  solution: string | null;
  implementation: string | null;
  results: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
  project: {
    title: string;
    slug: string;
    shortDescription: string | null;
    liveUrl: string | null;
    coverMedia: MediaRef | null;
    category: { name: string; slug: string } | null;
    industries: { name: string; slug: string }[];
    services: { name: string; slug: string }[];
    technologies: { name: string; slug: string }[];
    media: GalleryItem[];
  };
}

export function getPublishedCaseStudyByProjectSlug(slug: string) {
  return detail<CaseStudyDetail>(`/case-studies/${encodeURIComponent(slug)}`);
}

/* ---------------------------- testimonials --------------------------- */

export function getPublishedTestimonials() {
  return ok<
    {
      id: string;
      authorName: string;
      authorRole: string | null;
      companyName: string | null;
      content: string;
      rating: number | null;
      photoMedia: MediaRef | null;
      project: { title: string; slug: string } | null;
    }[]
  >("/testimonials");
}

/* -------------------------------- faqs ------------------------------- */

export function getPublishedFaqs() {
  return ok<{ id: string; question: string; answer: string; category: string | null }[]>("/faqs");
}

/* -------------------------------- blog ------------------------------- */

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
}

export interface PostCard {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  category: { name: string; slug: string } | null;
  coverMedia: MediaRef | null;
  tags: { name: string; slug: string }[];
}

export function getPublishedPosts(page: number, pageSize: number, filters: BlogFilters = {}) {
  return list<PostCard>(
    `/blog${qs({ page, pageSize, category: filters.category, tag: filters.tag, search: filters.search })}`,
  );
}

export async function getBlogFilterOptions() {
  const data = await ok<{
    categories: { name: string; slug: string; count: number }[];
    tags: { name: string; slug: string }[];
  }>("/blog/filter-options");
  return {
    categories: data.categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      _count: { posts: c.count },
    })),
    tags: data.tags,
  };
}

export function getRelatedPosts(slug: string) {
  return ok<PostCard[]>(`/blog/${encodeURIComponent(slug)}/related`);
}

export function getPublishedPostBySlug(slug: string) {
  return detail<{
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    publishedAt: string | null;
    updatedAt: string;
    category: { name: string; slug: string } | null;
    coverMedia: MediaRef | null;
    tags: { name: string; slug: string }[];
  }>(`/blog/${encodeURIComponent(slug)}`);
}

/* ------------------------------ sitemap ----------------------------- */

export function getSitemapEntries() {
  return ok<{
    services: { slug: string; updatedAt: string }[];
    industries: { slug: string; updatedAt: string }[];
    projects: { slug: string; updatedAt: string }[];
    caseStudies: { slug: string; updatedAt: string }[];
    posts: { slug: string; updatedAt: string }[];
  }>("/public/sitemap-entries");
}
