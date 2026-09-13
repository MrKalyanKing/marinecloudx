import type { Metadata } from "next";

import { pageMetadata } from "@/lib/config/metadata";

import { Container, Section, TechLabel } from "@/features/marketing/components/layout";
import { ContactForm } from "@/features/marketing/components/contact-form";
import { LiquidBubbles } from "@/features/marketing/components/liquid-bubbles";
import { brand, finalCta, process } from "@/lib/config/brand";
import { getPublishedServices } from "@/features/content/services/content";

export const metadata: Metadata = pageMetadata({
  title: "Start a Software, Cloud or AI Project",
  description:
    "Tell us what you are trying to build, improve, automate or solve. We understand the problem first, then recommend the technology that fits. Global clients.",
  path: "/start-a-project",
});

/**
 * The enquiry page.
 *
 * ## Why the form sits in a floating card rather than on the page
 *
 * This was a form laid directly on the paper band — correct, legible, and the
 * one page on a site built entirely from glass panels where nothing was made of
 * glass. It is now the single most physical object on the site: a slab held
 * above the canvas, lit from below, with bubbles rising inside the material.
 *
 * That is not decoration for its own sake. This page is the end of every path
 * through the site, and the card is what says so — everything else on a route is
 * a surface you read past, and this is the one you stop at.
 *
 * The bubble field is `aria-hidden`, never takes pointer events, and disappears
 * entirely under `prefers-reduced-motion` (see `.bubble-field`). Nothing about
 * whether the form works depends on any of it.
 */
export default async function ContactPage() {
  // Feeds the "what do you need?" select with real CMS services, so the
  // enquiry links to a service record the CRM can filter on.
  const services = await getPublishedServices();

  return (
    <>
      {/* Not the shared `PageIntro`: this page's masthead has to sit closer to
          the card beneath it than a listing page's does, or the floating object
          reads as belonging to the next section rather than to this heading. */}
      <section className="relative px-5 pt-32 pb-10 text-center text-ink sm:px-8 sm:pt-40 sm:pb-12">
        <Container className="relative max-w-[760px]">
          <TechLabel tone="paper">{brand.philosophy}</TechLabel>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance">
            {finalCta.heading}
          </h1>
          <p className="mx-auto mt-5 max-w-[46ch] text-lead text-ink-muted">
            {finalCta.supporting}
          </p>
        </Container>
      </section>

      {/* Transparent rather than the paper fill. The card is the subject here,
          and a pane of glass on an opaque near-white band has nothing to
          refract — the blur reads as milk. Dropping the fill lets the sitewide
          ambient colour field (see the public layout) sit behind it, which is
          the same environment every other glass panel on the site works
          against. */}
      <Section tone="paper" className="!bg-transparent !pt-0">
        <Container className="relative max-w-[1120px]">
          <div aria-hidden="true" className="liquid-aura" />

          <div className="relative z-[1] grid items-start gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
            <div className="liquid-card p-6 sm:p-10">
              {/* Inside the card and behind its content: the card's own
                  backdrop-filter blurs each bubble, which is what makes them
                  read as suspended in the glass rather than drawn on it. */}
              <LiquidBubbles count={12} />

              <div className="relative z-[1]">
                <TechLabel tone="paper">Tell us about the problem</TechLabel>
                <p className="mt-4 mb-8 max-w-[46ch] text-ink-muted">
                  You don&rsquo;t need a specification, a budget or a technology in
                  mind. A description of what is going wrong is enough to start.
                </p>

                <ContactForm services={services.map((s) => ({ id: s.id, name: s.name }))} />
              </div>
            </div>

            <aside className="liquid-card liquid-card--still p-6 sm:p-8 lg:sticky lg:top-24">
              <div className="relative z-[1]">
                <TechLabel tone="paper">What happens next</TechLabel>

                <ol className="mt-6 border-t border-hairline-light">
                  {process.slice(0, 3).map((stage, index) => (
                    <li key={stage.title} className="border-b border-hairline-light py-4">
                      <span className="tech-label text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 font-medium text-ink">{stage.title}</p>
                      <p className="mt-1 text-sm text-ink-muted">{stage.description}</p>
                    </li>
                  ))}
                </ol>

                <p className="mt-8 text-sm text-ink-muted">{finalCta.line}</p>

                {/* No phone number, address or social account is shown: none has
                    been provided, and inventing contact details would put false
                    information on a live site. */}
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
