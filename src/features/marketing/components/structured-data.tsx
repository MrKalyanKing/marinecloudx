/**
 * JSON-LD structured data.
 *
 * ## Why this exists
 *
 * The site shipped with complete `<head>` metadata everywhere — title,
 * description, canonical, Open Graph, Twitter — but machine-readable structured
 * data on blog articles only. That is what search engines read to understand
 * *what a page is* rather than merely what it says, and its absence from the
 * homepage meant nothing on the site identified the organisation itself.
 *
 * ## The rule every builder here follows
 *
 * **Nothing is asserted that is not already true and already published.**
 *
 * No telephone, no founding date, no employee count, no aggregate rating —
 * none of those have been provided, and structured data is exactly the wrong
 * place to invent them, because it states them as facts to a machine that will
 * repeat them. Every field below is either `siteConfig` (which already ships to
 * the browser) or CMS content that is already rendered on the page in question.
 *
 * The postal address is the one thing that has since been supplied, and it is
 * included because it is independently verifiable: the business operates a
 * Google Business Profile at that address. `telephone` stays absent — the
 * profile itself still has no number published, and a wrong number in
 * structured data is worse than no number at all. `sameAs` reads from
 * `siteProfiles`, which is empty until real accounts exist.
 *
 * Blog articles are not handled here. `blog/[slug]/page.tsx` already emits its
 * own `BlogPosting` block, with a deliberate decision recorded there to claim
 * no author and no publisher. Adding a second builder for the same page would
 * create two sources of truth for one tag, so this module covers only what was
 * genuinely missing: the homepage, the FAQ page and service pages.
 */

import { siteConfig, siteAddress, siteProfiles, absoluteUrl } from "@/lib/config/site";

/**
 * Serialises to a `<script type="application/ld+json">`.
 *
 * `<` is escaped to `<` before the payload reaches the DOM. Without it a
 * CMS value containing `</script>` would close the tag early and everything
 * after it would be parsed as markup — the one injection route a JSON-LD block
 * actually has. The escape is invisible to JSON parsers, so consumers are
 * unaffected.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * The publisher every other block points back at.
 *
 * The dual `@type` is deliberate. `Organization` is the entity the whole site
 * refers to; `ProfessionalService` is the `LocalBusiness` subtype that makes
 * the postal address meaningful to local search, and it fits a software
 * consultancy better than the generic `LocalBusiness`. One node serving both
 * keeps a single `@id` for everything else to reference.
 *
 * `areaServed` matters more than it looks. Without it, a street address in
 * Hyderabad is the strongest geographic signal on the site, and it quietly
 * narrows a business that sells worldwide to one Indian city. Stating the
 * served area explicitly is what keeps the local listing from becoming the
 * ceiling.
 */
const organization = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": absoluteUrl("/#organization"),
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  // The full lockup, not the favicon. `/icon.png` is the mark alone, cropped to
  // stay legible at 16px; what Google surfaces beside the organisation is the
  // logo as the company actually writes it, wordmark included.
  logo: absoluteUrl("/brand/logo.png"),
  image: absoluteUrl("/opengraph-image.png"),
  address: {
    "@type": "PostalAddress",
    streetAddress: siteAddress.streetAddress,
    addressLocality: siteAddress.addressLocality,
    addressRegion: siteAddress.addressRegion,
    postalCode: siteAddress.postalCode,
    addressCountry: siteAddress.addressCountry,
  },
  areaServed: { "@type": "Place", name: "Worldwide" },
  ...(siteProfiles.length > 0 ? { sameAs: [...siteProfiles] } : {}),
} as const;

/**
 * Organization + WebSite.
 *
 * Emitted from the public layout, so every page carries the entity rather than
 * the homepage alone — an inner page arrived at directly from search otherwise
 * identified no organisation at all.
 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            name: siteConfig.legalName,
            url: siteConfig.url,
            description: siteConfig.description,
            inLanguage: siteConfig.locale,
            publisher: { "@id": absoluteUrl("/#organization") },
          },
        ],
      }}
    />
  );
}

/**
 * BreadcrumbList, built from the same trail the visible `Breadcrumbs` component
 * renders.
 *
 * Both take the identical array, so the markup cannot describe a path different
 * from the one on screen — which is the failure mode that gets breadcrumb rich
 * results withdrawn. "Home" is prepended here exactly as the visual component
 * prepends it.
 */
export function BreadcrumbJsonLd({
  trail,
}: {
  trail: readonly { label: string; href?: string }[];
}) {
  const items = [{ label: "Home", href: "/" }, ...trail];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          // The final crumb is the current page and carries no `item`, per
          // Google's guidance: it is where the user already is.
          ...(item.href ? { item: absoluteUrl(item.href) } : {}),
        })),
      }}
    />
  );
}

/**
 * FAQPage, built from the published FAQs the page is already displaying.
 *
 * Rendered only when there is at least one — an empty `mainEntity` describes a
 * page that does not exist.
 */
export function FaqJsonLd({
  faqs,
  path = "/faq",
}: {
  faqs: readonly { question: string; answer: string }[];
  /**
   * Page the block belongs to. Explicit because this now renders on two routes
   * — `/faq` and the homepage's FAQ section — and two blocks sharing one `@id`
   * would describe them as the same document.
   */
  path?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": absoluteUrl(`${path}#faqpage`),
        inLanguage: siteConfig.locale,
        publisher: { "@id": absoluteUrl("/#organization") },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}

/**
 * ItemList for a listing page.
 *
 * Describes what the page is a list *of*, and in what order, which a grid of
 * links does not communicate on its own. Only `url` is emitted per entry —
 * `ItemList` is a table of contents, and duplicating each item's description
 * here would create a second, drifting copy of what the detail page already
 * states properly.
 *
 * Rendered only when the list has entries. An empty `itemListElement`
 * describes a page with nothing on it, which is exactly what those pages are
 * already marked `noindex` for.
 */
export function ItemListJsonLd({
  name,
  path,
  items,
}: {
  name: string;
  path: string;
  items: readonly { name: string; href: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": absoluteUrl(`${path}#itemlist`),
        name,
        numberOfItems: items.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: absoluteUrl(item.href),
        })),
      }}
    />
  );
}

/**
 * Service for a single service page.
 *
 * `provider` points at the Organization rather than repeating its details, and
 * no price, area served or availability is claimed — none is recorded.
 */
export function ServiceJsonLd({
  name,
  slug,
  description,
}: {
  name: string;
  slug: string;
  description?: string | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": absoluteUrl(`/services/${slug}#service`),
        name,
        ...(description ? { description } : {}),
        url: absoluteUrl(`/services/${slug}`),
        provider: { "@id": absoluteUrl("/#organization") },
      }}
    />
  );
}
