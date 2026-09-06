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
 * No address, no telephone, no `sameAs` social profiles, no founding date, no
 * employee count, no aggregate rating — none of those have been provided, and
 * structured data is exactly the wrong place to invent them, because it states
 * them as facts to a machine that will repeat them. Every field below is either
 * `siteConfig` (which already ships to the browser) or CMS content that is
 * already rendered on the page in question.
 *
 * Blog articles are not handled here. `blog/[slug]/page.tsx` already emits its
 * own `BlogPosting` block, with a deliberate decision recorded there to claim
 * no author and no publisher. Adding a second builder for the same page would
 * create two sources of truth for one tag, so this module covers only what was
 * genuinely missing: the homepage, the FAQ page and service pages.
 */

import { siteConfig, absoluteUrl } from "@/lib/config/site";

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

/** The publisher every other block points back at. */
const organization = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  // A real, published asset (public/brand/logo.png). Google uses this for the
  // knowledge panel; it is not an invented fact.
  logo: {
    "@type": "ImageObject",
    "@id": absoluteUrl("/#logo"),
    url: absoluteUrl("/brand/logo.png"),
    contentUrl: absoluteUrl("/brand/logo.png"),
    width: 1254,
    height: 1254,
    caption: siteConfig.legalName,
  },
  image: { "@id": absoluteUrl("/#logo") },
} as const;

/** Organization + WebSite. Belongs on the homepage only. */
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
 * FAQPage, built from the published FAQs the page is already displaying.
 *
 * Rendered only when there is at least one — an empty `mainEntity` describes a
 * page that does not exist.
 */
export function FaqJsonLd({
  faqs,
}: {
  faqs: readonly { question: string; answer: string }[];
}) {
  if (faqs.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": absoluteUrl("/faq#faqpage"),
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
