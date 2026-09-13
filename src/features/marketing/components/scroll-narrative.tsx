"use client";

/**
 * Homepage wrapper — no scroll-triggered hide/reveal.
 * Content is visible immediately for a smooth page experience.
 */

import type { ReactNode } from "react";

export function ScrollNarrative({ children }: { children: ReactNode }) {
  return <div className="scroll-narrative">{children}</div>;
}
