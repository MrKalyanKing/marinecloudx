import Link from "next/link";

import { CtaGlobe } from "@/features/marketing/components/cta-globe";
import { Container } from "@/features/marketing/components/layout";
import { finalCta } from "@/lib/config/brand";

/**
 * The closing call to action.
 *
 * Extracted because there were two of these. The homepage had the saturated
 * brand band; every other page had a washed-out pale version with dark text
 * that looked like a different site's component — the About page in particular
 * ended on a near-white panel that read as unfinished rather than as a
 * destination. One component now, used everywhere, so the last thing a visitor
 * sees is the same on every route.
 */
export function FinalCta({
  supporting = "Tell us what you're trying to build, improve or automate.",
}: {
  supporting?: string;
}) {
  return (
    <section
      id="contact"
      className="relative px-5 py-[clamp(40px,8vh,100px)] pb-[clamp(90px,14vh,160px)] sm:px-8"
    >
      <Container className="max-w-[900px]">
        <div
          data-reveal-stage
          className="cta-band relative z-0 flex flex-col items-center px-8 py-14 text-center sm:px-12 sm:py-20"
        >
          <CtaGlobe />
          <h2 className="relative z-[1] text-h1 font-normal text-balance text-white">
            {finalCta.heading}
          </h2>
          <p className="relative z-[1] mt-6 max-w-[480px] text-lead text-white/75">{supporting}</p>
          <Link
            href="/start-a-project"
            className="cta-band__btn relative z-[1] mt-[clamp(30px,4vw,44px)]"
          >
            Start a project
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
