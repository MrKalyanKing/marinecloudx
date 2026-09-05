"use client";

/**
 * Drives the `--scroll-y` custom property so background layers (see
 * `.scroll-lines` / `.grid-lines` in globals.css) can parallax against
 * scroll position without every consumer wiring its own listener.
 */

import { useEffect } from "react";

export function ScrollAmbient() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const commit = () => {
      root.style.setProperty("--scroll-y", String(window.scrollY));
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(commit);
    };

    commit();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
