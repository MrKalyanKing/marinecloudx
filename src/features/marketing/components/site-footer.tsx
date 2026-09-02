/**
 * Public footer.
 *
 * Server component — no interactivity.
 *
 * Deliberately omits contact details, social accounts and legal links: none
 * have been supplied, no such routes exist, and inventing a phone number,
 * address or social profile would put false information on a live site. The
 * structure supports them the moment real values arrive in site config.
 */

import Link from "next/link";

import { Container, TechLabel } from "@/features/marketing/components/layout";
import { footerNavigation, siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline-dark bg-midnight text-light">
      <div aria-hidden="true" className="aurora" data-variant="wide" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines" />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <span className="text-xl font-semibold tracking-[-0.02em]">
              <span className="text-light">MarineCloude</span><span className="text-aurora">X</span>
            </span>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-light-muted">
              {siteConfig.description}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNavigation.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <TechLabel tone="dark">{group.heading}</TechLabel>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-light-muted transition-colors hover:text-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="tech-label text-light-muted">
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <p className="tech-label text-light-muted opacity-60">
            <span aria-hidden="true">●</span> All systems nominal
          </p>
        </div>
      </Container>
    </footer>
  );
}
