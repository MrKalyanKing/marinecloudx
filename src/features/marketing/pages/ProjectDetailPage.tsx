import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/config/metadata";
import { Breadcrumbs, Container, PageBody } from "@/features/marketing/components/layout";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { ProjectGallery, PublicImage } from "@/features/marketing/components/project-gallery";
import { PublicationStatus } from "@/contracts";
import { formatDate, toIsoDate } from "@/shared/utils/format";
import { getPublishedProjectBySlug, getSitemapEntries } from "@/features/content/services/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const entries = await getSitemapEntries();
    return entries.projects.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return { title: "Not found", robots: { index: false, follow: false } };

  const title = project.seoTitle ?? project.title;
  const description = project.seoDescription ?? project.shortDescription ?? undefined;

  return pageMetadata({
    title,
    description,
    path: `/projects/${project.slug}`,
  });
}

/** Parses markdown description with headers, bold keys, and feature lists */
function renderMarkdownContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { title: string; desc: string; text: string }[] = [];

  function flushList() {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-5 grid gap-3 sm:grid-cols-1">
          {currentList.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3.5 rounded-xl border border-hairline-light/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-brand/40"
            >
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm">
                {item.title ? (
                  <strong className="block font-semibold text-ink text-base mb-1">
                    {item.title}
                  </strong>
                ) : null}
                <span className="text-ink-muted leading-relaxed">{item.desc || item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) {
      flushList();
      continue;
    }

    // Heading: ### or ##
    if (rawLine.startsWith("### ") || rawLine.startsWith("## ")) {
      flushList();
      const heading = rawLine.replace(/^#{2,3}\s+/, "");
      elements.push(
        <div key={`h-${i}`} className="mt-8 mb-3 pt-4 border-t border-hairline-light/60 first:border-t-0 first:pt-0">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-brand" />
            {heading}
          </h3>
        </div>
      );
      continue;
    }

    // Bullet item: - **Title**: Description or - Text
    if (rawLine.startsWith("- ") || rawLine.startsWith("* ")) {
      const itemText = rawLine.slice(2).trim();
      const boldMatch = itemText.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
      if (boldMatch) {
        currentList.push({ title: boldMatch[1], desc: boldMatch[2], text: "" });
      } else {
        const plainBold = itemText.match(/^\*\*([^*]+)\*\*(.*)$/);
        if (plainBold) {
          currentList.push({ title: plainBold[1], desc: plainBold[2].replace(/^:\s*/, ""), text: "" });
        } else {
          currentList.push({ title: "", desc: "", text: itemText });
        }
      }
      continue;
    }

    // Normal paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-base text-ink-muted leading-relaxed mb-4">
        {rawLine}
      </p>
    );
  }

  flushList();
  return elements;
}

/** Project Delivery Status badge with custom live indicators */
function getProjectStatusBadge(project: { slug: string; status?: string }) {
  if (project.slug === "sm-interiors" || project.status === "COMPLETED") {
    return {
      label: "Delivered & Actively Maintained by MarineCloudX DevOps Team",
      shortLabel: "Delivered & Maintained",
      pillClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      dotClass: "bg-emerald-500",
      pingClass: "bg-emerald-400",
    };
  }
  if (project.slug === "apex-school-management-crm") {
    return {
      label: "Development In-Progress — Academic CRM Platform",
      shortLabel: "Development In-Progress",
      pillClass: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
      dotClass: "bg-sky-500",
      pingClass: "bg-sky-400",
    };
  }
  if (project.slug === "vijaya-dry-fruits" || project.slug === "royal-harvest-dry-fruits") {
    return {
      label: "Committed — Under Active Development (Web & Admin Panel)",
      shortLabel: "Committed & In Development",
      pillClass: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      dotClass: "bg-amber-500",
      pingClass: "bg-amber-400",
    };
  }
  return {
    label: "Active Production System",
    shortLabel: "Production Active",
    pillClass: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-400",
    dotClass: "bg-teal-500",
    pingClass: "bg-teal-400",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  const hasCaseStudy = project.caseStudy?.status === PublicationStatus.PUBLISHED;
  const statusBadge = getProjectStatusBadge(project);

  return (
    <>
      <PageBody>
        <Container className="pt-28 pb-16 sm:pt-36 sm:pb-20">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            trail={[
              { label: "Projects", href: "/projects" },
              { label: project.title },
            ]}
          />

          {/* Project Masthead Header */}
          <div className="mt-2 mb-8">
            {/* Top Meta Strip: Status Badge + Category + Date */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Badge with Live Pulsing Indicator */}
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold backdrop-blur-sm shadow-sm ${statusBadge.pillClass}`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusBadge.pingClass}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusBadge.dotClass}`}
                  />
                </span>
                <span>{statusBadge.label}</span>
              </div>

              {project.category ? (
                <Link
                  href={`/projects?category=${encodeURIComponent(project.category.slug)}`}
                  className="tech-label chip-glass rounded-full px-3 py-1 text-xs font-medium text-ink-muted hover:text-brand transition-colors"
                >
                  {project.category.name}
                </Link>
              ) : null}

              {project.publishedAt ? (
                <span className="text-xs text-ink-muted">
                  Published {formatDate(project.publishedAt)}
                </span>
              ) : null}
            </div>

            {/* Proportional, Compact Title */}
            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink max-w-4xl text-balance">
              {project.title}
            </h1>

            {/* Subtitle / Short Description */}
            {project.shortDescription ? (
              <p className="mt-3 text-base sm:text-lg text-ink-muted max-w-3xl leading-relaxed">
                {project.shortDescription}
              </p>
            ) : null}

            {/* Highlighted Actions Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Visit Live Website</span>
                  <span className="text-white/80 text-xs font-mono">
                    ({new URL(project.liveUrl).hostname})
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
              ) : null}

              {hasCaseStudy ? (
                <Link
                  href={`/case-studies/${project.slug}`}
                  className="chip-glass rounded-full px-5 py-2.5 text-sm font-medium text-ink hover:text-brand hover:border-brand/40 transition-colors"
                >
                  Read the case study →
                </Link>
              ) : null}
            </div>
          </div>

          {/* Cover Snapshot Frame */}
          {project.coverMedia?.url ? (
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-hairline-light bg-ice shadow-xl">
              <div className="aspect-[16/9] w-full relative">
                <PublicImage
                  url={project.coverMedia.url}
                  alt={project.coverMedia.altText ?? project.title}
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            </div>
          ) : null}

          {/* Main Content & Sidebar Grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column (8 cols): Structured Description & Details */}
            <div className="lg:col-span-8">
              {project.fullDescription ? (
                <div className="project-prose">
                  {renderMarkdownContent(project.fullDescription)}
                </div>
              ) : null}

              {/* Gallery Section */}
              {project.media && project.media.length > 0 ? (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Interface Gallery
                  </h3>
                  <ProjectGallery items={project.media} context={project.title} />
                </div>
              ) : null}

              {/* Testimonials */}
              {project.testimonials.length > 0 ? (
                <section className="mt-12 pt-8 border-t border-hairline-light">
                  <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Client Feedback
                  </h3>
                  <div className="flex flex-col gap-4">
                    {project.testimonials.map((testimonial, index) => (
                      <blockquote
                        key={index}
                        className="rounded-2xl border border-hairline-light bg-white/70 p-6 shadow-sm"
                      >
                        <p className="text-base text-ink italic leading-relaxed">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        <footer className="mt-3 text-sm font-semibold text-brand">
                          {testimonial.authorName}
                          {testimonial.authorRole ? ` · ${testimonial.authorRole}` : ""}
                          {testimonial.companyName ? ` (${testimonial.companyName})` : ""}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            {/* Right Column (4 cols): Project Meta Specs Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Project Specs Card */}
              <div className="rounded-2xl border border-hairline-light bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">
                  Project Specifications
                </h4>

                <dl className="divide-y divide-hairline-light text-sm">
                  <div className="py-3 flex justify-between items-center gap-2">
                    <dt className="text-ink-muted">Delivery Status</dt>
                    <dd className="font-semibold text-ink text-right">
                      {statusBadge.shortLabel}
                    </dd>
                  </div>

                  {project.liveUrl ? (
                    <div className="py-3 flex justify-between items-center gap-2">
                      <dt className="text-ink-muted">Live Website</dt>
                      <dd>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                        >
                          Visit Site ↗
                        </a>
                      </dd>
                    </div>
                  ) : null}

                  {project.category ? (
                    <div className="py-3 flex justify-between items-center gap-2">
                      <dt className="text-ink-muted">Category</dt>
                      <dd className="font-semibold text-ink text-right">
                        {project.category.name}
                      </dd>
                    </div>
                  ) : null}

                  {project.industries.length > 0 ? (
                    <div className="py-3 flex justify-between items-center gap-2">
                      <dt className="text-ink-muted">Industry</dt>
                      <dd className="font-semibold text-ink text-right">
                        {project.industries.map((i) => i.name).join(", ")}
                      </dd>
                    </div>
                  ) : null}

                  <div className="py-3 flex justify-between items-center gap-2">
                    <dt className="text-ink-muted">DevOps SLA</dt>
                    <dd className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                      Active Monitoring
                    </dd>
                  </div>
                </dl>

                {project.liveUrl ? (
                  <div className="mt-5 pt-4 border-t border-hairline-light">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink text-white dark:bg-white dark:text-ink px-4 py-2.5 text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                    >
                      Open Live Site ({new URL(project.liveUrl).hostname}) ↗
                    </a>
                  </div>
                ) : null}
              </div>

              {/* Services Rendered */}
              {project.services.length > 0 ? (
                <div className="rounded-2xl border border-hairline-light bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                    Services Provided
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="chip-glass rounded-lg px-3 py-1.5 text-xs font-medium text-ink hover:text-brand transition-colors"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Technologies Deployed */}
              {project.technologies.length > 0 ? (
                <div className="rounded-2xl border border-hairline-light bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                    Technologies Deployed
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech.slug}
                        className="rounded-lg bg-hairline-light/60 px-2.5 py-1 text-xs font-medium text-ink-muted"
                      >
                        {tech.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Consultation Card */}
              <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-teal-500/10 p-6 shadow-sm">
                <h4 className="text-base font-bold text-ink">
                  Need a similar system engineered?
                </h4>
                <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                  MarineCloudX designs, builds, and maintains cloud platforms, AI automations, and enterprise CRM solutions with zero server overhead.
                </p>
                <div className="mt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Start a Project Consultation →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageBody>

      <FinalCta />
    </>
  );
}
