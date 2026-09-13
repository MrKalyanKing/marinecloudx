/**
 * Public footer.
 *
 * Deliberately a *panel*, not a full-bleed band. Every section above it is
 * transparent over the ambient background, so a footer built the same way had
 * no edge of its own — the legal line simply appeared after the last section
 * and read as more page content. Sitting it inside a glass box with its own rim
 * and shadow is what tells a visitor the page has ended.
 *
 * It carries no call to action: that is the closing band's job (see
 * final-cta.tsx), and repeating the same heading and button twice in a row
 * halved the weight of both.
 *
 * The brand orbit occupies the fourth column rather than a row of its own, so
 * it sits level with the link lists and costs the panel no extra height. The
 * office details moved up into the identity column to make room — which is
 * where a visitor looks for them anyway.
 *
 * Everything stated here is already true elsewhere on the site. There is no
 * phone number and no social row because neither has been published — the same
 * rule the structured data follows — and no newsletter field, because nothing
 * would receive the address.
 */

import Image from "next/image";
import Link from "next/link";

import { BrandOrbit } from "@/features/marketing/components/brand-orbit";
import { Arrow, Container } from "@/features/marketing/components/layout";
import { footerNavigation, siteAddress, siteConfig } from "@/lib/config/site";
import { brand } from "@/lib/config/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] px-5 pb-6 sm:px-8 sm:pb-8">
      <Container className="max-w-[1180px] px-0 sm:px-0">
        <div className="glass-light glass-rim rounded-[clamp(18px,2.4vw,26px)] px-6 pt-8 pb-6 sm:px-9 sm:pt-9 sm:pb-7">
          {/* Two columns from the narrowest width up: the link lists are short
              labels, and one per row turned the mobile footer into a screen and
              a half of scrolling. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-x-10 sm:gap-y-8 lg:grid-cols-[1.25fr_repeat(2,minmax(0,0.85fr))_1fr] lg:gap-x-8">
            <div className="col-span-2 lg:col-span-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-80"
              >
                <Image
                  src="/brand/mark.png"
                  alt=""
                  width={44}
                  height={44}
                  sizes="22px"
                  className="h-[22px] w-[22px] rounded-full"
                />
                <span className="text-[15px] font-semibold tracking-[-0.01em]">
                  {siteConfig.name}
                </span>
                <span className="text-[15px] font-normal text-ink-muted">
                  {siteConfig.descriptor}
                </span>
              </Link>

              <p className="tech-label mt-3.5 text-brand">{brand.philosophy}</p>

              {/* Matches the PostalAddress in the Organization JSON-LD exactly.
                  Name, address and phone consistency across the site, the markup
                  and the Google Business Profile is a direct local ranking
                  input, so these two must not drift apart. */}
              <address className="mt-4 text-[14px] leading-relaxed text-ink-muted not-italic">
                {siteAddress.streetAddress}
                <br />
                {siteAddress.addressLocality}, {siteAddress.addressRegion}{" "}
                {siteAddress.postalCode}
              </address>

              <Link
                href="/contact"
                className="group mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-brand transition-colors hover:text-brand-deep"
              >
                Contact us
                <Arrow />
              </Link>
            </div>

            {footerNavigation.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <p className="tech-label text-ink-muted">{group.heading}</p>
                <ul className="mt-3.5 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-[14px] text-ink-muted transition-colors hover:text-ink"
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

            <BrandOrbit className="brand-orbit--compact col-span-2 justify-self-center lg:col-span-1 lg:justify-self-end" />
          </div>

          <div className="mt-7 flex flex-col gap-2 border-t border-hairline-light pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="tech-label text-ink-muted">
              © {year} {siteConfig.legalName} · All rights reserved
            </p>
            <p className="tech-label text-ink-muted">{brand.positioning}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
