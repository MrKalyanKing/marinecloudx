"use client";

/**
 * Public navigation — same links and labels; light chrome on white canvas.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cx } from "@/features/marketing/components/layout";
import { publicNavigation, siteConfig } from "@/lib/config/site";

/**
 * The circular mark, sized to the cap height of the wordmark beside it.
 *
 * 26px is deliberate and small: the lockup has to read as one unit with
 * "MarineCloudX", and anything taller than the text turns the bar into a logo
 * with a caption. `priority` because this sits in the fixed header on every
 * route, so it is in the first viewport of every page load; without it the mark
 * pops in after the rest of the bar has painted.
 *
 * The asset is the mark alone rather than `/brand/logo.png`, which carries the
 * wordmark too — using the full lockup here would print the company name twice.
 */
function BrandMark() {
  return (
    <Image
      src="/brand/mark.png"
      alt=""
      width={26}
      height={26}
      priority
      className="brand-mark block h-[26px] w-[26px] shrink-0"
    />
  );
}

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
          className="brand-lockup flex shrink-0 items-center gap-2.5 text-ink"
          aria-label={`${siteConfig.name} ${siteConfig.descriptor} — home`}
        >
          <BrandMark />
          <span className="text-[15.5px] font-semibold tracking-[-0.01em]">
            {siteConfig.name}
          </span>
        </Link>

        {/* `gap` is tighter than it was, because each link now carries its own
            horizontal padding for the capsule to sit in. Keeping the old gap on
            top of that padding pushed the row past the CTA on a 1024px screen. */}
        <div className="ml-auto hidden items-center justify-end gap-0.5 text-[14px] text-ink-muted lg:flex xl:gap-1.5">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="nav-item whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/start-a-project"
          className="btn-solid ml-auto hidden items-center gap-2 rounded-full px-4.5 py-2.5 text-[13.5px] font-medium whitespace-nowrap sm:inline-flex lg:ml-0"
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
          className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-hairline-light sm:ml-0 lg:hidden"
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

      {/* Backdrop — dims and blurs the page behind the drawer */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cx(
          "fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Glass drawer, slides in from the left edge — sized to its content
          rather than stretched to the full screen height. */}
      <div
        id="mobile-navigation"
        ref={panelRef}
        aria-hidden={!open}
        className={cx(
          "glass-drawer fixed top-0 left-0 z-50 max-h-[calc(100vh-2rem)] w-[84%] max-w-[340px] overflow-y-auto rounded-br-[28px] transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "pointer-events-none -translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          {/* Was a plain <span>, so on a phone — the only place this drawer
              exists — the company name was the one piece of branding on the
              site that did not go home when tapped. It is a link now, and it
              closes the drawer on the way, otherwise tapping it on the homepage
              navigates nowhere and leaves the panel open over the page. */}
          <Link
            href="/"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            aria-label={`${siteConfig.name} ${siteConfig.descriptor} — home`}
            className="brand-lockup flex items-center gap-2.5 text-ink"
          >
            <BrandMark />
            <span className="text-[15.5px] font-semibold tracking-[-0.01em]">
              {siteConfig.name}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-hairline-light"
          >
            <span className="sr-only">Close menu</span>
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <ul className="mt-7 flex flex-col justify-around gap-1 px-6">
          {publicNavigation.map((item, index) => (
            <li key={item.href} className="border-b border-hairline-light last:border-b-0">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline gap-4 py-4 text-h3 font-medium text-ink"
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

        <div className="px-6 pt-6 pb-8">
          <Link
            href="/start-a-project"
            tabIndex={open ? 0 : -1}
            className="btn-solid inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
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
