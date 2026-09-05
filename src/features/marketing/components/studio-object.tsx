"use client";

/**
 * Perspective + pointer response for floating studio objects.
 *
 * Applies a base cinematic pose and subtle cursor parallax. Scrub-friendly
 * CSS variables (`--rx`, `--ry`, `--scale`) can also be driven by ScrollTrigger.
 */

import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "@/features/marketing/components/layout";

type StudioObjectProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  pose?: "hero" | "stage" | "near" | "flat";
  interactive?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className" | "style">;

export function StudioObject({
  children,
  className,
  style,
  pose = "hero",
  interactive = true,
  ...rest
}: StudioObjectProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !interactive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let dx = 0;
    let dy = 0;

    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      dx = (event.clientX - r.left) / r.width - 0.5;
      dy = (event.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      dx = 0;
      dy = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      tx += (dx - tx) * 0.06;
      ty += (dy - ty) * 0.06;
      el.style.setProperty("--px", `${(tx * 10).toFixed(2)}deg`);
      el.style.setProperty("--py", `${(ty * -8).toFixed(2)}deg`);
      if (Math.abs(dx - tx) > 0.001 || Math.abs(dy - ty) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive]);

  return (
    <div
      ref={ref}
      className={cx("studio-object", `studio-object--${pose}`, className)}
      style={style}
      {...rest}
    >
      <div className="studio-object__inner">{children}</div>
    </div>
  );
}
