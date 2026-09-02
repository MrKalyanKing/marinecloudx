"use client";

/**
 * Fades its content up the first time it scrolls into view.
 *
 * A thin client wrapper: the children stay server-rendered and are handed in as
 * a prop. One IntersectionObserver per instance, disconnected after it fires
 * once. With no JavaScript — or reduced motion — the `.reveal-up` rule in
 * globals.css leaves the content fully visible, so nothing is ever hidden.
 */

import { useEffect, useRef } from "react";

export function ScrollReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at load (e.g. the first band): don't hide it at all,
    // just let it show — arming it here would cause a visible flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    // Arm the hidden state only now that JS is running; if it never runs, the
    // content stays visible.
    el.classList.add("armed");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("in");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className ? `reveal-up ${className}` : "reveal-up"}>
      {children}
    </div>
  );
}
