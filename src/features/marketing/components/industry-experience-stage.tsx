"use client";

import { useState } from "react";
import Link from "next/link";

import { Arrow, cx } from "@/features/marketing/components/layout";
import {
  IndustryExperienceCard,
  type IndustryExperienceItem,
} from "@/features/marketing/components/industry-experience-card";

interface IndustryExperienceStageProps {
  items: readonly IndustryExperienceItem[] | IndustryExperienceItem[];
  defaultShow?: boolean;
  allowToggle?: boolean;
}

const DOMAIN_SUMMARIES = [
  {
    name: "Education",
    role: "Admissions & Student Portal",
    capability: "Relational data modeling, multi-step application workflow, document verification.",
  },
  {
    name: "Interiors",
    role: "Project Lifecycle & Client Portal",
    capability: "Visual asset revisions, milestone sign-offs, and multi-party stakeholder coordination.",
  },
  {
    name: "Dental",
    role: "Practice Operations & Patient System",
    capability: "Automated booking pipelines, communication APIs, and secure clinical scheduling.",
  },
];

export function IndustryExperienceStage({
  items,
  defaultShow = false,
  allowToggle = true,
}: IndustryExperienceStageProps) {
  const [showCards, setShowCards] = useState(defaultShow);

  return (
    <div className="space-y-8">
      {/* Interactive Toggle Bar for Homepage */}
      {allowToggle && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/8 bg-black/[0.02] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span
              className={cx(
                "h-2.5 w-2.5 rounded-full transition-colors",
                showCards ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" : "bg-ink-muted/40",
              )}
            />
            <span className="text-[13.5px] font-medium text-ink">
              Industry Experience:{" "}
              <span className={showCards ? "font-semibold text-brand" : "text-ink-muted"}>
                {showCards ? "Visible on page" : ""}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={() => setShowCards((prev) => !prev)}
              aria-expanded={showCards}
              className={cx(
                "group inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all",
                showCards
                  ? "border-brand/30 bg-brand/10 text-brand hover:bg-brand/20"
                  : "border-black/15 bg-white text-ink shadow-sm hover:border-black/30 hover:bg-black/[0.02]",
              )}
            >
              {showCards ? (
                <>
                  <span>Hide Experience Cards</span>
                  <span aria-hidden="true" className="text-brand">✕</span>
                </>
              ) : (
                <>
                  <span>Toggle Experience Cards</span>
                  <span aria-hidden="true" className="text-brand font-bold">＋</span>
                </>
              )}
            </button> */}

            <Link
              href="/industries"
              className="chip-glass inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-brand"
            >
              Go to Industries page
              <Arrow />
            </Link>
          </div>
        </div>
      )}

      {/* When toggled OFF: Display a compact summary banner pointing to /industries */}
      {!showCards && allowToggle && (
        <div className="mcx-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[700px]">
              <p className="tech-label text-brand">Transferable Engineering</p>
              <h3 className="mt-2 text-h3 font-medium tracking-[-0.02em] text-ink">
                3 Domain Experience Areas
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">
                Our active implementations span Education, Interiors, and Dental. Rather than cluttering the homepage with past project templates, you can inspect each domain architecture directly on the dedicated Industries page or toggle the preview above.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                View Full Industry Experiences
                <Arrow />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-black/8 pt-6 sm:grid-cols-3">
            {DOMAIN_SUMMARIES.map((domain) => (
              <div
                key={domain.name}
                className="rounded-xl border border-black/[0.06] bg-white/70 p-4 transition-colors hover:border-brand/30 hover:bg-white"
              >
                <span className="tech-label text-[10.5px] text-brand">{domain.name}</span>
                <p className="mt-1 text-[13.5px] font-semibold text-ink">{domain.role}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                  {domain.capability}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* When toggled ON (or on /industries where defaultShow is true and allowToggle is false): Render the exact 100% clone cards */}
      {showCards && (
        <div className="flex flex-col gap-[clamp(40px,6vh,72px)] animate-in fade-in duration-300">
          {items.map((project, index) => (
            <IndustryExperienceCard
              key={"slug" in project && project.slug ? project.slug : project.name}
              item={project}
              index={index}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
