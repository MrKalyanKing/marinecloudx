/**
 * Selected work — real projects demonstrating technical range and execution depth.
 */

import type { CSSProperties } from "react";
import Link from "next/link";

import { FloatingSurface } from "@/features/marketing/components/floating-surface";
import { Arrow } from "@/features/marketing/components/layout";
import type { homeProjects } from "@/lib/config/brand";

type Project = (typeof homeProjects)[number];

function ProjectVisual({ name, tags, industry }: { name: string; tags: readonly string[]; industry?: string }) {
  return (
    <div className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1e] via-[#141416] to-[#0d0d0f] p-6 sm:min-h-[320px] sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 75% 20%, rgb(180 200 255 / 0.15), transparent 70%), radial-gradient(40% 40% at 20% 80%, rgb(100 150 255 / 0.08), transparent 70%)",
        }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <span className="tech-label text-[11px] text-white/70">{industry || "Engineering"}</span>
        <span className="tech-label rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">{tags[0]}</span>
      </div>

      <div className="relative my-auto space-y-3 py-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[12px] font-medium text-white/80">Production Verified</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
          <div className="h-2 w-[60%] rounded-full bg-white/20" />
          <div className="mt-2.5 h-2 w-[40%] rounded-full bg-white/10" />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(1, 4).map((tag) => (
              <span key={tag} className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="relative text-[13.5px] font-medium tracking-tight text-white/90">{name}</p>
    </div>
  );
}

export function WorkStage({ projects }: { projects: readonly Project[] | Project[] }) {
  return (
    <section id="work" className="relative px-5 py-[clamp(80px,12vh,150px)] sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div data-reveal-stage className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <div className="max-w-[760px]">
            <p className="tech-label text-brand">05&nbsp;&nbsp;Selected Work</p>
            <h2 className="mt-6 text-h2 font-normal text-ink">
              Proof of capability across real environments
            </h2>
            <p className="mt-5 text-lead text-ink-muted">
              Real projects demonstrating how we solve domain requirements across Education, Interiors, and Dental — engineered with custom web applications, cloud infrastructure, automation, and applied AI.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-brand"
          >
            All projects
            <Arrow />
          </Link>
        </div>

        <div className="flex flex-col gap-[clamp(48px,8vh,96px)]">
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
                    "--ry": reverse ? "8deg" : "-8deg",
                    "--rx": "4deg",
                    "--scale": "0.95",
                  } as CSSProperties
                }
              >
                <div className="studio-object__inner">
                  <FloatingSurface tone="light" className="w-full">
                    <div
                      className={`grid gap-0 lg:grid-cols-12 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
                    >
                      <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-10">
                        <div className="flex items-center gap-3">
                          <span className="tech-label text-[10.5px] text-brand">
                            /{String(index + 1).padStart(2, "0")}
                          </span>
                          {"industry" in project && project.industry ? (
                            <span className="tech-label rounded-full bg-brand/10 px-2.5 py-0.5 text-[10.5px] text-brand">
                              {project.industry}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-4 text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em] text-ink">
                          {project.name}
                        </h3>
                        <p className="mt-2.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">
                          {project.line}
                        </p>

                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-ink/10 bg-ink/[0.02] px-2.5 py-0.5 text-[11px] text-ink-muted"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>

                        <dl className="mt-7 grid gap-3.5 border-t border-ink/8 pt-6">
                          {project.beats.map((beat) => (
                            <div key={beat.k} className="rounded-lg bg-black/[0.02] p-3">
                              <dt className="tech-label text-[10px] font-semibold text-brand">
                                {beat.k}
                              </dt>
                              <dd className="mt-1 text-[13.5px] leading-relaxed text-ink/85">
                                {beat.v}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <div className="border-t border-ink/8 p-5 sm:p-6 lg:col-span-5 lg:border-t-0 lg:border-l">
                        <ProjectVisual
                          name={project.name}
                          tags={project.tags}
                          industry={"industry" in project ? (project.industry as string) : undefined}
                        />
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
