"use client";

/**
 * Public navigation.
 *
 * A client component because it needs three things the server cannot give it:
 * scroll state, a mobile menu, and focus management. It is the only piece of
 * site chrome that ships JavaScript.
 *
 * Over the hero it is transparent and sits inside the dark composition; once
 * scrolled it settles onto a translucent navy bar with a hairline. One blur,
 * one border — not a glass panel.
 *
 * Accessibility: the menu is a real button with `aria-expanded` and
 * `aria-controls`, Escape closes it, focus returns to the toggle, and the
 * background is inert while it is open.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container, cx } from "@/features/marketing/components/layout";
import { publicNavigation, siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  /**
   * The route the menu was opened on, rather than a boolean.
   *
   * Navigating changes `pathname`, so `open` becomes false during render — the
   * menu closes on navigation without an effect that sets state and triggers a
   * second render pass.
   */
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const open = openedOnPath === pathname;

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => setOpenedOnPath(next ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // Set state directly rather than through `setOpen`, which is recreated
        // each render and would otherwise have to be an effect dependency.
        setOpenedOnPath(null);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel so the next Tab lands on a menu link.
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
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-hairline-dark bg-navy/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-light"
          aria-label={`${siteConfig.name} ${siteConfig.descriptor} — home`}
        >
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
              MarineCloude<span className="text-aurora">X</span>
            </span>
            <span className="tech-label hidden text-light-muted sm:inline">
              {siteConfig.descriptor}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cx(
                "relative py-1 text-sm transition-colors duration-200",
                isActive(item.href) ? "text-light" : "text-light-muted hover:text-light",
              )}
            >
              {item.label}
              {/* Active indicator, not a hover-only affordance. */}
              <span
                aria-hidden="true"
                className={cx(
                  "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand-bright transition-transform duration-200",
                  isActive(item.href) ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-gradient group hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium sm:inline-flex"
          >
            Start a project
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-light ring-1 ring-inset ring-hairline-dark lg:hidden"
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
        </div>
      </Container>

      <div
        id="mobile-navigation"
        ref={panelRef}
        hidden={!open}
        className="border-t border-hairline-dark bg-navy lg:hidden"
      >
        <Container className="py-6">
          <nav aria-label="Primary (mobile)">
            <ul className="flex flex-col">
              {publicNavigation.map((item, index) => (
                <li key={item.href} className="border-b border-hairline-dark last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-baseline gap-4 py-4 text-h3 font-medium text-light"
                  >
                    <span className="tech-label text-brand-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/contact"
            className="btn-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
          >
            Start a project
            <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </div>
    </header>
  );
}
