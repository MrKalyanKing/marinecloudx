import { CtaEnquiry } from "@/features/marketing/components/cta-enquiry";
import { Container } from "@/features/marketing/components/layout";
import { getPublishedServices } from "@/features/content/services/content";

/**
 * The closing call to action.
 *
 * Extracted because there were two of these. The homepage had the saturated
 * brand band; every other page had a washed-out pale version with dark text
 * that looked like a different site's component — the About page in particular
 * ended on a near-white panel that read as unfinished rather than as a
 * destination. One component now, used everywhere, so the last thing a visitor
 * sees is the same on every route.
 *
 * ## Why this is async now
 *
 * The card opens into the enquiry form rather than linking away to it (see
 * cta-enquiry.tsx), and that form's "what do you need?" select is populated
 * from the published CMS services so the resulting lead points at a real
 * service record the CRM can filter on. Fetching here keeps every page that
 * renders the CTA a server component: only the open/closed state crosses into
 * the client.
 *
 * The read is cheap and safe to repeat. It goes through the same `fetch` tagged
 * with `CONTENT_TAG` that the contact page already uses, so a page rendering
 * both is served one cached response, and `getPublishedServices` returns `[]`
 * rather than throwing if the API is unreachable — an unavailable backend
 * costs the select its options, not the page.
 */
export async function FinalCta({
  supporting = "Tell us what you're trying to build, improve or automate.",
}: {
  supporting?: string;
}) {
  const services = await getPublishedServices();

  return (
    <section
      id="contact"
      className="relative px-5 py-[clamp(40px,8vh,100px)] pb-[clamp(90px,14vh,160px)] sm:px-8"
    >
      {/* Widens as the form opens: 900px is right for a headline and a button
          and too narrow for a two-column form. The card itself controls the
          growth, so the container only has to stop constraining it. */}
      <Container className="max-w-[980px]">
        <CtaEnquiry
          services={services.map((service) => ({ id: service.id, name: service.name }))}
          supporting={supporting}
        />
      </Container>
    </section>
  );
}
