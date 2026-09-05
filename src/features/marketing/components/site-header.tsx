"use client";

/**
 * Public navigation — floating glass pill.
 *
 * Client component for scroll state, mobile menu, and focus management.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cx } from "@/features/marketing/components/layout";
import { publicNavigation, siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const open = openedOnPath === pathname;

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => setOpenedOnPath(next ? pathname : null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedOnPath(null);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-5 pt-3.5 sm:px-8 sm:pt-3.5">
      <nav
        aria-label="Primary"
        className="glass-pill flex w-full max-w-[1320px] items-center gap-3 rounded-full py-3 pr-3.5 pl-5 sm:gap-6 sm:pr-4 sm:pl-6"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-light"
          aria-label={`${siteConfig.name} ${siteConfig.descriptor} — home`}
        >
          <span
            aria-hidden="true"
            className="block h-3 w-3 rounded-full shadow-[0_0_14px_rgb(39_220_197_/_0.7)]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #ffffff, var(--color-brand-bright) 46%, #0c6d61 100%)",
            }}
          />
          <span className="text-[15.5px] font-semibold tracking-[-0.01em]">MarineCloudX</span>
        </Link>

        <div className="ml-auto hidden items-center justify-end gap-5 text-[14px] text-light/80 lg:flex xl:gap-7">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cx(
                "whitespace-nowrap transition-colors duration-200 hover:text-light",
                isActive(item.href) && "text-light",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="btn-gradient ml-auto hidden items-center gap-2 rounded-full px-4.5 py-2.5 text-[13.5px] font-medium whitespace-nowrap sm:inline-flex lg:ml-0"
        >
          Start a project
          <span aria-hidden="true" className="opacity-60">
            →
          </span>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-light ring-1 ring-inset ring-hairline-dark lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <>
                <path d="M2 5.5h14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 12.5h14" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-navigation"
        ref={panelRef}
        hidden={!open}
        className="glass-strong absolute inset-x-5 top-[calc(100%+8px)] rounded-2xl sm:inset-x-8 lg:hidden"
      >
        <div className="px-5 py-6">
          <ul className="flex flex-col">
            {publicNavigation.map((item, index) => (
              <li key={item.href} className="border-b border-hairline-dark last:border-b-0">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-4 text-h3 font-medium text-light"
                  onClick={() => setOpen(false)}
                >
                  <span className="tech-label text-brand-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="btn-solid mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Start a project
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
