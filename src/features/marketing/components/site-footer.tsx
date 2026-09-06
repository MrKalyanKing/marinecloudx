/**
 * Public footer — minimal Glass UI chrome.
 *
 * Keeps essential navigation in a quiet secondary row so inner pages stay
 * reachable, while the primary row matches the design reference rhythm.
 */

import Link from "next/link";

import { Container } from "@/features/marketing/components/layout";
import { footerNavigation, siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="relative z-[1] border-t border-hairline-light">
      <Container className="max-w-[1320px] py-10 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.14em] text-ink-muted uppercase">
          <span>MarineCloudX Technologies</span>
          <span>Engineering what comes next</span>
        </div>

        <div className="mt-10 grid gap-8 border-t border-hairline-light pt-8 sm:grid-cols-3">
          {footerNavigation.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="tech-label text-brand">{group.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="tech-label mt-10 text-ink-muted">
          © {new Date().getFullYear()} {siteConfig.legalName}
        </p>
      </Container>
    </footer>
  );
}
