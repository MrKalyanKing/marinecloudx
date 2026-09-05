"use client";

/**
 * Hero entrance animation.
 *
 * A thin client wrapper around otherwise-server content: it takes children and
 * animates the `[data-reveal]` elements inside them. The hero's markup and CMS
 * data stay in server components — only the timeline is client-side.
 *
 * GSAP is imported dynamically so it is not in the initial bundle and never
 * loads for a visitor who has reduced motion enabled.
 *
 * The reveal is short and staggered — the page is usable immediately. There is
 * no intro curtain, no scroll hijack, no bounce.
 *
 * Failure modes are all safe: if GSAP fails to load, or motion is reduced, or
 * JavaScript never runs, the elements are shown at full opacity instead of
 * being left invisible.
 */

import { useEffect, useRef } from "react";

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;

    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    const reveal = () => {
      for (const element of targets) {
        element.style.opacity = "1";
        element.style.transform = "none";
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("gsap")
      .then(({ gsap }) => {
        if (cancelled) return;

        const context = gsap.context(() => {
          gsap.fromTo(
            targets,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.08,
              // Small delay so the first paint settles before motion starts.
              delay: 0.1,
            },
          );
        }, root);

        cleanup = () => context.revert();
      })
      .catch(() => {
        // Never leave the hero invisible because a chunk failed to load.
        reveal();
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={scope} data-animate="hero" className="flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}
