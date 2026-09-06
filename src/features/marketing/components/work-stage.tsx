/**
 * Selected work — each project as a large floating product surface.
 */

import type { CSSProperties } from "react";
import Link from "next/link";

import { FloatingSurface } from "@/features/marketing/components/floating-surface";
import { Arrow } from "@/features/marketing/components/layout";
import type { homeProjects } from "@/lib/config/brand";

type Project = (typeof homeProjects)[number];

function ProjectVisual({ name, tags }: { name: string; tags: readonly string[] }) {
  return (
    <div className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] p-5 sm:min-h-[280px] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 70% 20%, rgb(255 255 255 / 0.12), transparent 70%), radial-gradient(40% 35% at 20% 80%, rgb(255 255 255 / 0.06), transparent 70%)",
        }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <span className="tech-label text-[10px] text-light-muted">Interface</span>
        <span className="tech-label text-[10px] text-light-muted/50">{tags[0]}</span>
      </div>
      <div className="relative mt-8 space-y-2">
        <div className="h-2 w-[42%] rounded-full bg-black/10" />
        <div className="h-2 w-[68%] rounded-full bg-black/8" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="aspect-[4/3] rounded-lg border border-black/10 bg-black/5" />
          <div className="aspect-[4/3] rounded-lg border border-black/20 bg-black/10" />
          <div className="aspect-[4/3] rounded-lg border border-black/10 bg-[linear-gradient(145deg,rgb(255_255_255_/_0.14),rgb(255_255_255_/_0.04))]" />
        </div>
      </div>
      <p className="relative mt-6 text-[13px] tracking-[-0.01em] text-light/70">{name}</p>
    </div>
  );
}

export function WorkStage({ projects }: { projects: readonly Project[] | Project[] }) {
  return (
    <section id="work" className="relative px-5 py-[clamp(72px,12vh,150px)] sm:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div data-reveal-stage className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <div className="max-w-[560px]">
            <p className="tech-label text-brand-bright/80">Selected work</p>
            <h2 className="mt-5 text-[clamp(1.75rem,3.6vw,3rem)] font-semibold tracking-[-0.03em] text-light">
              Systems in the field
            </h2>
            <p className="mt-4 text-lead text-light-muted">
              Real projects, presented as product surfaces — not thumbnail cards.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-brand-soft"
          >
            All projects
            <Arrow />
          </Link>
        </div>

        <div className="flex flex-col gap-[clamp(64px,10vh,120px)]">
          {projects.map((project, index) => {
            const reverse = index % 2 === 1;
            return (
              <article
                key={project.name}
                data-reveal-stage
                data-work-surface
                className="studio-object studio-object--stage w-full"
                style={
                  {
                    "--ry": reverse ? "12deg" : "-12deg",
                    "--rx": "6deg",
                    "--scale": "0.9",
                  } as CSSProperties
                }
              >
                <div className="studio-object__inner">
                  <FloatingSurface tone="light" className="w-full">
                    <div
                      className={`grid gap-0 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
                    >
                      <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-11">
                        <span className="tech-label text-[10.5px] text-ink-muted">
                          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                        </span>
                        <h3 className="mt-4 text-[clamp(1.5rem,2.8vw,2.15rem)] font-semibold tracking-[-0.03em] text-ink">
                          {project.name}
                        </h3>
                        <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-ink-muted">
                          {project.line}
                        </p>
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-ink/10 px-3 py-1 text-[11px] tracking-wide text-ink-muted"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <dl className="mt-8 space-y-4 border-t border-ink/8 pt-6">
                          {project.beats.map((beat) => (
                            <div key={beat.k}>
                              <dt className="tech-label text-[10px] text-ink-muted">{beat.k}</dt>
                              <dd className="mt-1.5 text-[14px] leading-relaxed text-ink/80">
                                {beat.v}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div className="border-t border-ink/8 p-5 sm:p-6 lg:border-t-0 lg:border-l">
                        <ProjectVisual name={project.name} tags={project.tags} />
                      </div>
                    </div>
                  </FloatingSurface>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
