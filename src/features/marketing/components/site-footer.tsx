/**
 * Public footer.
 *
 * The previous version was three link columns between two thin rules — correct,
 * and completely anonymous. A footer is the last thing a prospective client
 * reads, and on a services site it is where they look for who you are and how
 * to reach you, so it now leads with the company rather than with navigation:
 * the mark, the positioning line, the office, and a direct call to action, with
 * the link columns supporting that rather than being the whole thing.
 *
 * Everything stated here is already true elsewhere on the site. There is no
 * phone number and no social row because neither has been published — the same
 * rule the structured data follows.
 */

import Link from "next/link";

import { Arrow, Container } from "@/features/marketing/components/layout";
import { footerNavigation, siteAddress, siteConfig } from "@/lib/config/site";
import { brand } from "@/lib/config/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-8 border-t border-hairline-light">
      <Container className="max-w-[1320px] py-14 sm:py-20">
        {/* Lead block: identity on the left, the call to action on the right. */}
        <div className="flex flex-col gap-10 border-b border-hairline-light pb-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[420px]">
            <span className="flex items-center gap-2.5 text-ink">
              <span
                aria-hidden="true"
                className="block h-3.5 w-3.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #ff5ca8, #6d5cff 50%, #43a7ff)",
                  boxShadow: "0 0 14px rgb(109 92 255 / 0.45)",
                }}
              />
              <span className="text-[17px] font-semibold tracking-[-0.01em]">
                {siteConfig.name}
              </span>
              <span className="text-[17px] font-normal text-ink-muted">
                {siteConfig.descriptor}
              </span>
            </span>

            <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
              {siteConfig.description}
            </p>

            <p className="tech-label mt-6 text-brand">{brand.philosophy}</p>
          </div>

          <div className="mcx-card w-full max-w-[380px] p-6 sm:p-7">
            <p className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
              Have a problem worth solving?
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
              Tell us what you are trying to build, improve or automate.
            </p>
            <Link
              href="/start-a-project"
              className="btn-solid group mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              Start a project
              <Arrow />
            </Link>
          </div>
        </div>

        {/* Navigation and location. */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerNavigation.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="tech-label text-ink-muted">{group.heading}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-[15px] text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="tech-label text-ink-muted">Office</p>
            {/* Matches the PostalAddress in the Organization JSON-LD exactly.
                Name, address and phone consistency across the site, the markup
                and the Google Business Profile is a direct local ranking input,
                so these two must not drift apart. */}
            <address className="mt-5 text-[15px] leading-relaxed text-ink-muted not-italic">
              {siteAddress.streetAddress}
              <br />
              {siteAddress.addressLocality}, {siteAddress.addressRegion}{" "}
              {siteAddress.postalCode}
            </address>
          </div>
        </div>

        {/* Legal row. */}
        <div className="mt-14 flex flex-col gap-3 border-t border-hairline-light pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="tech-label text-ink-muted">
            © {year} {siteConfig.legalName}
          </p>
          <p className="tech-label text-ink-muted">Engineering what comes next</p>
        </div>
      </Container>
    </footer>
  );
}
