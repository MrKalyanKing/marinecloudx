"use client";

/**
 * Soft hero entrance — one short fade-in, content never stays hidden on scroll.
 */

import { useEffect, useRef } from "react";

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    const show = () => {
      for (const element of targets) {
        element.style.opacity = "1";
        element.style.transform = "none";
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
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
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.06,
              delay: 0.05,
            },
          );
        }, root);
        cleanup = () => context.revert();
      })
      .catch(show);

    // Safety: never leave hero invisible
    const failSafe = window.setTimeout(show, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={scope} data-animate="hero" className="flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}
