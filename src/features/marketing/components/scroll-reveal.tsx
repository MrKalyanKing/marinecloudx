"use client";

/**
 * Passthrough wrapper — content is always visible (no scroll-gated fade-in).
 */

import type { ReactNode } from "react";

export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
