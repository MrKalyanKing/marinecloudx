import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";

import { FloatingSurface } from "@/features/marketing/components/floating-surface";
import { Arrow } from "@/features/marketing/components/layout";

export interface BeatItem {
  k: string;
  v: string;
}

export interface IndustryExperienceItem {
  name: string;
  industry?: string;
  slug?: string;
  line?: string;
  description?: string | null;
  tags?: readonly string[] | string[];
  beats?: readonly BeatItem[] | BeatItem[];
  services?: readonly { name: string; slug: string; shortDescription?: string | null }[];
  projects?: readonly { title: string; slug: string; shortDescription?: string | null }[];
}

interface MappedProject {
  projectTitle: string;
  shortTitle: string;
  projectSlug: string;
  targetUrl: string;
  imageUrl: string;
  statusLabel: string;
  statusType: "completed" | "progress" | "committed";
  category: string;
}

function resolveMappedProject(industryRaw: string): MappedProject {
  const key = industryRaw.toLowerCase().trim();

  if (key.includes("interior")) {
    return {
      projectTitle: "SM Interiors — High-End Studio & Architectural Platform",
      shortTitle: "SM Interiors",
      projectSlug: "sm-interiors",
      targetUrl: "/projects/sm-interiors",
      imageUrl: "/images/projects/sm-interiors.png",
      statusLabel: "Delivered & Actively Maintained",
      statusType: "completed",
      category: "Architectural Platform",
    };
  }

  if (key.includes("education") || key.includes("school") || key.includes("edtech")) {
    return {
      projectTitle: "Apex School Management & AI Fee Recovery CRM",
      shortTitle: "Apex School CRM",
      projectSlug: "apex-school-management-crm",
      targetUrl: "/projects/apex-school-management-crm",
      imageUrl: "/images/projects/edusmart-school-crm.jpg",
      statusLabel: "Development In-Progress",
      statusType: "progress",
      category: "Enterprise SaaS CRM",
    };
  }

  // Agritech, Fresh Produce, Gourmet Dry Fruits, or default
  return {
    projectTitle: "Vijaya — Premium Dry Fruits & B2B Wholesale Portal",
    shortTitle: "Vijaya Dry Fruits",
    projectSlug: "vijaya-dry-fruits",
    targetUrl: "/projects/vijaya-dry-fruits",
    imageUrl: "/images/projects/vijaya-dry-fruits.jpg",
    statusLabel: "Committed — Under Active Development",
    statusType: "committed",
    category: "B2B Supply Chain & E-Com",
  };
}

/** Pre-populated domain templates for known sectors when uploaded from admin or displayed on home */
const KNOWN_INDUSTRY_DEFAULTS: Record<
  string,
  {
    name: string;
    line: string;
    tags: string[];
    beats: BeatItem[];
  }
> = {
  education: {
    name: "Apex School Management & Academic CRM",
    line: "Standard-wise student management, annual fee recovery, and predictive AI communication workflows.",
    tags: ["Academic CRM", "Fee Automation", "AI WhatsApp Reminders", "PostgreSQL"],
    beats: [
      {
        k: "Challenge",
        v: "Standard-wise student distinction, manual fee due follow-ups across grades, and fragmented parent communications.",
      },
      {
        k: "What We Built",
        v: "A multi-role academic administrative CRM with automatic fee due tracking, installment scheduling, and AI-triggered WhatsApp/email alerts.",
      },
      {
        k: "Technology / Capabilities",
        v: "Next.js, React, TypeScript, PostgreSQL database, WhatsApp Business API automation, and predictive fee analytics.",
      },
      {
        k: "What This Demonstrates",
        v: "End-to-end web application engineering, relational academic modeling, and automated multi-channel messaging pipelines.",
      },
      {
        k: "Outcome",
        v: "Automated due collection workflows, eliminating manual accounts follow-up overhead and improving on-time fee recovery.",
      },
    ],
  },
  interiors: {
    name: "SM Interiors Architectural & Studio Platform",
    line: "Turnkey luxury residential living spaces and commercial architectural digital platform.",
    tags: ["AWS Lambda Cloud", "WhatsApp Automation", "Live Maps", "AI Business Recommendations"],
    beats: [
      {
        k: "Challenge",
        v: "Streamlining client consultation bookings, coordinating project approvals, and delivering zero-maintenance cloud reliability.",
      },
      {
        k: "What We Built",
        v: "A high-performance architectural studio web ecosystem with AWS Lambda serverless hosting, WhatsApp integration, live maps, and an AI-driven admin panel.",
      },
      {
        k: "Technology / Capabilities",
        v: "Modern Next.js edge frontend, AWS Lambda serverless infrastructure, WhatsApp Business API, and automated email templates.",
      },
      {
        k: "What This Demonstrates",
        v: "High-end UI design, serverless cloud architecture, and ongoing DevOps SLA maintenance.",
      },
      {
        k: "Outcome",
        v: "Live in production with 100% cloud uptime, automated client inquiries, and direct designer consultation scheduling.",
      },
    ],
  },
  agritech: {
    name: "Vijaya Dry Fruits Wholesale & D2C Portal",
    line: "Direct-from-orchard gourmet dry fruits e-commerce storefront and wholesale administrative portal.",
    tags: ["E-Commerce Storefront", "B2B Wholesale Portal", "Cold Storage Telemetry", "Inventory CRM"],
    beats: [
      {
        k: "Challenge",
        v: "Managing dual-channel operations: high-end consumer gifting storefront alongside high-volume wholesale B2B pricing and inventory dispatches.",
      },
      {
        k: "What We Built",
        v: "A bespoke consumer storefront and backend operations hub featuring wholesale bulk quoting, batch freshness tracking, and courier syncing.",
      },
      {
        k: "Technology / Capabilities",
        v: "Next.js, React, TypeScript, Node.js backend, PostgreSQL, and scalable cold-storage inventory workflows.",
      },
      {
        k: "What This Demonstrates",
        v: "B2B supply chain architecture, wholesale pricing logic, and high-conversion e-commerce user experiences.",
      },
      {
        k: "Outcome",
        v: "Committed for full development with structured milestones, delivering unified retail and bulk wholesale commerce in one platform.",
      },
    ],
  },
};

/**
 * Visual card representing the real project snapshot and live status on the right side of the card template.
 */
function ProjectVisualCard({
  mapped,
  tags,
}: {
  mapped: MappedProject;
  tags: readonly string[];
}) {
  const statusColors = {
    completed: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      dot: "bg-emerald-500",
      ping: "bg-emerald-400",
    },
    progress: {
      border: "border-sky-500/30",
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      dot: "bg-sky-500",
      ping: "bg-sky-400",
    },
    committed: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      dot: "bg-amber-500",
      ping: "bg-amber-400",
    },
  }[mapped.statusType];

  return (
    <div className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1e] via-[#141416] to-[#0d0d0f] p-5 sm:min-h-[420px] sm:p-6 shadow-xl border border-white/10">
      {/* Top Bar: Category + Status Badge */}
      <div className="relative flex items-center justify-between gap-2 z-10">
        <span className="tech-label text-[11px] uppercase tracking-wider text-white/70">
          {mapped.category}
        </span>

        {/* Live Status Badge */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold backdrop-blur-sm ${statusColors.border} ${statusColors.bg} ${statusColors.text}`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColors.ping}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${statusColors.dot}`}
            />
          </span>
          <span>{mapped.statusLabel}</span>
        </div>
      </div>

      {/* Snapshot Preview with Hover Zoom */}
      <Link
        href={mapped.targetUrl}
        className="group relative my-4 overflow-hidden rounded-xl border border-white/15 bg-black/40 aspect-[16/9] w-full block shadow-lg"
      >
        <Image
          src={mapped.imageUrl}
          alt={mapped.projectTitle}
          fill
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <p className="text-xs font-semibold text-white truncate drop-shadow-sm">
            {mapped.shortTitle}
          </p>
          <span className="shrink-0 text-[11px] font-medium text-teal-300 group-hover:translate-x-0.5 transition-transform">
            View details ↗
          </span>
        </div>
      </Link>

      {/* Bottom Info & Action */}
      <div className="relative z-10 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button to Project */}
        <Link
          href={mapped.targetUrl}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-500/20 hover:shadow-teal-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <span>Explore {mapped.shortTitle} Project</span>
          <Arrow />
        </Link>
      </div>
    </div>
  );
}

export function IndustryExperienceCard({
  item,
  index,
  reverse = false,
}: {
  item: IndustryExperienceItem;
  index: number;
  reverse?: boolean;
}) {
  const industryKey = (item.industry || item.name || "").toLowerCase().trim();
  const matchedDefaults =
    KNOWN_INDUSTRY_DEFAULTS[industryKey] ||
    (industryKey.includes("education") ? KNOWN_INDUSTRY_DEFAULTS.education : null) ||
    (industryKey.includes("interior") ? KNOWN_INDUSTRY_DEFAULTS.interiors : null) ||
    (industryKey.includes("agri") || industryKey.includes("fruit")
      ? KNOWN_INDUSTRY_DEFAULTS.agritech
      : null);

  const mappedProject = resolveMappedProject(item.industry || item.name);

  const industryName = item.industry || item.name;
  const title =
    item.name && item.name !== item.industry
      ? item.name
      : matchedDefaults?.name ?? `${item.name} Platform & Operations`;
  const subtitle =
    item.line ||
    item.description ||
    matchedDefaults?.line ||
    "Custom web application and digital system architecture engineered for operational workflows.";

  const rawTags =
    item.tags && item.tags.length > 0
      ? item.tags
      : matchedDefaults?.tags || ["Web Application", "Cloud Systems", "REST APIs", "Workflow Automation"];

  const beats: readonly BeatItem[] =
    item.beats && item.beats.length > 0
      ? item.beats
      : matchedDefaults?.beats || [
          {
            k: "Challenge",
            v: item.description
              ? `Managing fragmented workflows and multi-step operational tasks: ${item.description}`
              : "High operational friction, disconnected communication tools, and unlinked manual tracking.",
          },
          {
            k: "What We Built",
            v: "A dedicated digital platform featuring automated task pipelines, role-based administration consoles, and real-time coordination.",
          },
          {
            k: "Technology / Capabilities",
            v: "Modern full-stack web applications, relational data structures, secure cloud architecture, and integrated third-party APIs.",
          },
          {
            k: "What This Demonstrates",
            v: "End-to-end software engineering, domain-specific workflow automation, and enterprise system reliability.",
          },
          {
            k: "Outcome",
            v: "Streamlined operational efficiency, zero reliance on manual tracking, and high-uptime production performance.",
          },
        ];

  return (
    <article
      data-reveal-stage
      data-work-surface
      className="studio-object studio-object--stage w-full"
      style={
        {
          "--ry": reverse ? "6deg" : "-6deg",
          "--rx": "3deg",
          "--scale": "0.96",
        } as CSSProperties
      }
    >
      <div className="studio-object__inner">
        <FloatingSurface tone="light" className="w-full">
          <div
            className={`grid gap-0 lg:grid-cols-12 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            {/* Left Content Side */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="tech-label text-[10.5px] text-brand">
                  /{String(index + 1).padStart(2, "0")}
                </span>
                <span className="tech-label rounded-full bg-brand/10 px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider text-brand font-semibold">
                  {industryName}
                </span>
              </div>

              <h3 className="mt-4 text-[clamp(1.3rem,2.2vw,1.8rem)] font-bold tracking-[-0.03em] text-ink">
                {title}
              </h3>
              <p className="mt-2.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">
                {subtitle}
              </p>

              {/* Tag Pills */}
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {rawTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-ink/10 bg-ink/[0.02] px-2.5 py-0.5 text-[11px] text-ink-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {/* Structured Beats: Challenge, What We Built, Tech, Demonstrates, Outcome */}
              <dl className="mt-7 grid gap-3 border-t border-ink/8 pt-6">
                {beats.map((beat) => (
                  <div key={beat.k} className="rounded-xl bg-black/[0.02] p-3.5 border border-ink/5">
                    <dt className="tech-label text-[10.5px] font-bold tracking-wider uppercase text-brand">
                      {beat.k}
                    </dt>
                    <dd className="mt-1 text-[13.5px] leading-relaxed text-ink/85 font-normal">
                      {beat.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Mapped Project Direct Action Link */}
              <div className="mt-7 pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={mappedProject.targetUrl}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand/10 hover:bg-brand text-brand hover:text-white px-5 py-2.5 text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Explore {mappedProject.shortTitle} Project &amp; Case Study</span>
                  <Arrow />
                </Link>

                {item.slug ? (
                  <Link
                    href={`/industries/${item.slug}`}
                    className="text-xs text-ink-muted hover:text-ink transition-colors"
                  >
                    View domain details →
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Right Visual Side: Rich Real Project Preview */}
            <div className="border-t border-ink/8 p-5 sm:p-6 lg:col-span-5 lg:border-t-0 lg:border-l flex flex-col justify-center">
              <ProjectVisualCard mapped={mappedProject} tags={rawTags} />
            </div>
          </div>
        </FloatingSurface>
      </div>
    </article>
  );
}
