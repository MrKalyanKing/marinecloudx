"use client";

/**
 * The closing CTA, which opens into the enquiry form in place.
 *
 * ## What changed and why
 *
 * "Start a project" used to be a link to `/start-a-project`. Every visitor who
 * reached the bottom of a page and was interested had to pay a full navigation
 * — a new document, a scroll to the top, a form they had not seen yet — before
 * typing a single character. The form now arrives inside the card they are
 * already looking at.
 *
 * ## The link is still a link
 *
 * The button renders as a real `<Link href="/start-a-project">` and only calls
 * `preventDefault()` once the click handler runs. That matters in three
 * situations that a `<button>` would have broken: before hydration, with
 * JavaScript disabled, and on a middle-click or ⌘-click, all of which still get
 * the real page. The route is not going away — the header CTA, the footer and
 * the sitemap all still point at it, and it is the only version of this form a
 * crawler ever sees.
 *
 * ## Why this component holds the state and not `FinalCta`
 *
 * `FinalCta` is a server component that fetches the CMS services list. Keeping
 * the fetch there and the state here is what lets every page that renders the
 * closing CTA get a form populated with real services without any of them
 * becoming client components.
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { CtaGlobe } from "@/features/marketing/components/cta-globe";
import { LiquidBubbles } from "@/features/marketing/components/liquid-bubbles";
import { cx } from "@/features/marketing/components/layout";
import { finalCta } from "@/lib/config/brand";

export function CtaEnquiry({
  services,
  supporting,
}: {
  services: { id: string; name: string }[];
  supporting: string;
}) {
  const [open, setOpen] = useState(false);

  /**
   * Whether the decorative bubble field is mounted.
   *
   * Kept separate from `open` so the two happen at different times: the panel
   * opens immediately, and the bubbles arrive once the transition has finished.
   * Mounting sixteen animated elements on the frame the animation starts is the
   * kind of cost that shows up as a stutter exactly where it is most visible.
   */
  const [showBubbles, setShowBubbles] = useState(false);

  /**
   * The panel's animating height.
   *
   * `"0px"` closed, an explicit pixel height while opening, and `"auto"` once
   * the transition has settled. See the note on `.cta-reveal` in globals.css
   * for why this is measured here rather than left to a content-sized grid row:
   * telling the browser the number removes the per-frame intrinsic-size work
   * that made this animation drop three frames in five.
   *
   * Handing back to `"auto"` at the end is what keeps it honest. A pixel height
   * frozen at open time would clip a validation message, and would leave a tall
   * empty panel behind the short confirmation that replaces the form on a
   * successful send.
   */
  const [panelHeight, setPanelHeight] = useState("0px");
  const settled = panelHeight === "auto";

  /** The pitch block's height, animated the same way and in the other direction. */
  const [collapseHeight, setCollapseHeight] = useState("auto");

  const cardRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInnerRef = useRef<HTMLDivElement>(null);
  const collapseInnerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const everOpened = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const inner = panelInnerRef.current;
    if (!inner) return;

    if (open) {
      everOpened.current = true;
      setPanelHeight(`${inner.offsetHeight}px`);

      // Slightly past the 0.7s height transition, so `auto` lands on a panel
      // that has stopped moving and the swap is invisible.
      const settle = window.setTimeout(() => setPanelHeight("auto"), 760);
      return () => window.clearTimeout(settle);
    }

    // Nothing to collapse on the first render — without this guard the panel
    // would measure and re-zero itself on every page load.
    if (!everOpened.current) return;

    // `auto` is not an interpolable value, so going straight to `0px` from it
    // would snap shut. Pin the real height first, let that commit, then
    // animate. The rAF is what separates the two into different frames.
    setPanelHeight(`${inner.offsetHeight}px`);
    const frame = requestAnimationFrame(() => setPanelHeight("0px"));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  /**
   * The same treatment for the block folding the other way.
   *
   * It matters more than it looks: this collapses at the exact moment the panel
   * expands, so while both were content-sized grid rows every frame of the swap
   * resolved two intrinsic heights instead of applying two numbers. It sits at
   * `auto` whenever it is at rest, so the pitch reflows normally if the copy
   * changes or the text wraps differently at another width.
   */
  useEffect(() => {
    const inner = collapseInnerRef.current;
    if (!inner) return;

    if (open) {
      setCollapseHeight(`${inner.offsetHeight}px`);
      const frame = requestAnimationFrame(() => setCollapseHeight("0px"));
      return () => cancelAnimationFrame(frame);
    }

    if (!everOpened.current) return;

    setCollapseHeight(`${inner.offsetHeight}px`);
    const settle = window.setTimeout(() => setCollapseHeight("auto"), 760);
    return () => window.clearTimeout(settle);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  /**
   * Brings the bubble field in once the panel has finished opening, and drops
   * it the instant it closes.
   *
   * 760ms is the row transition (`--dur-slow`, 0.7s) plus a little air, so the
   * mount lands on a card that has stopped moving. On close it unmounts at once
   * rather than on a timer: sixteen infinite animations should not keep running
   * behind a collapsed panel on every page that carries this CTA.
   */
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => setShowBubbles(true), 760);

    // The reset lives in the cleanup rather than in an `if (!open)` branch at
    // the top of the effect. Both close the panel's bubbles; only this one
    // keeps the setState out of the effect body, where it would schedule a
    // second render pass on the frame the panel closes.
    return () => {
      window.clearTimeout(timer);
      setShowBubbles(false);
    };
  }, [open]);

  /**
   * Returns focus to the trigger after the panel closes.
   *
   * This cannot be done inside `close()`. The trigger lives in the block that
   * carries `inert` while the panel is open, and at the moment the handler runs
   * React has not yet re-rendered — the attribute is still on the element, so
   * `focus()` is silently ignored and focus falls to `<body>`. A keyboard user
   * then restarts their traversal from the top of the document. Running it in
   * an effect puts it after the commit that removes `inert`.
   *
   * The `hasOpened` guard keeps the first render from stealing focus: `open`
   * is already false then, and without it every page load would scroll to and
   * focus the closing CTA.
   */
  const hasOpened = useRef(false);

  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      return;
    }

    if (!hasOpened.current) return;
    hasOpened.current = false;
    triggerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Deferred by one frame: at the moment `open` flips, the panel is still at
    // height 0 and the card has not grown, so anything measured now describes
    // the old geometry.
    const frame = requestAnimationFrame(() => {
      const card = cardRef.current;

      if (card) {
        // The card grows downward, so on a short viewport the form can open
        // below the fold and nothing appears to have happened. Scrolling it
        // back into view is the feedback for the interaction.
        //
        // But only when it is actually needed. A smooth scroll is a main-thread
        // animation, and running one on top of the height transition means the
        // page is scrolling *and* relaying out on the same frames — which is
        // exactly where the dropped frames were. On a desktop viewport the card
        // is usually already sitting in a perfectly good position when it is
        // clicked, and the scroll was pure cost for no movement anyone asked
        // for.
        //
        // "Good position" is: below the fixed header, and high enough that the
        // panel has somewhere to grow into.
        const top = card.getBoundingClientRect().top;
        const headerClearance = 96;
        const comfortable = top >= headerClearance && top <= window.innerHeight * 0.4;

        if (!comfortable) {
          card.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
            block: "start",
          });
        }
      }

      // Focus the first field, but only for a keyboard user. Calling focus()
      // on a phone raises the on-screen keyboard over the form the moment it
      // opens, which hides the thing the visitor just asked to see.
      if (window.matchMedia("(pointer: fine)").matches) {
        panelRef.current?.querySelector<HTMLInputElement>("input, textarea, select")?.focus({
          preventScroll: true,
        });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div
      ref={cardRef}
      data-reveal-stage
      data-open={open ? "true" : undefined}
      className={cx(
        "cta-band relative z-0 flex flex-col items-center px-6 text-center sm:px-12",
        // One padding value for both states rather than a transition between
        // two. Padding is a layout property, so animating it recalculated the
        // card on every frame alongside the row that is already doing exactly
        // that — two layout animations for a change of sixteen pixels that the
        // growth itself hides anyway.
        "py-12 sm:py-16",
        // Clears the fixed header when the open panel is scrolled into view.
        "scroll-mt-24",
      )}
    >
      {/* Behind the content, above the gradient — the card's own `overflow:
          hidden` keeps the field inside the rounded corners.

          Mounted a beat *after* the open begins, not with it. Sixteen elements
          appearing on the first frame of the transition put their style,
          layout and first paint directly in the way of the frames that had to
          be smooth; deferring them moves that work to after the card has
          settled, where nobody can see it cost anything. */}
      {open && showBubbles ? <LiquidBubbles count={12} onBrand /> : null}

      <button
        type="button"
        onClick={close}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        className="cta-dismiss"
      >
        <span className="sr-only">Close the enquiry form</span>
        <svg width="15" height="15" viewBox="0 0 18 18" aria-hidden="true" fill="none">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      <CtaGlobe />

      {/* The button's own label becomes the panel's title. Carrying the words
          across the transition is what makes the card read as the button having
          opened rather than as the card having been replaced — and it avoids
          repeating "Tell us about the problem", which is already the label on
          the textarea below. */}
      <h2 className="relative z-[1] text-h1 font-normal text-balance text-white">
        {open ? "Start a project." : finalCta.heading}
      </h2>

      {/* The pitch and its button fold away together. `inert` rather than
          `hidden`: the block is still on screen for the length of the
          transition, and a focusable control mid-collapse is a tab stop that
          points at something the visitor can no longer see. */}
      <div
        className="cta-collapse relative z-[1]"
        data-open={open ? "true" : undefined}
        style={{ height: collapseHeight }}
        inert={open}
      >
        <div ref={collapseInnerRef}>
          <p className="mx-auto mt-6 max-w-[480px] text-lead text-white/75">{supporting}</p>

          <Link
            ref={triggerRef}
            href="/start-a-project"
            onClick={(event) => {
              // Leave the modified clicks alone — ⌘/ctrl-click, middle-click and
              // shift-click all mean "open the route", and hijacking them is the
              // most common way an in-place expander breaks for power users.
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              setOpen(true);
            }}
            className="cta-band__btn mt-[clamp(30px,4vw,44px)]"
          >
            Start a project
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div
        ref={panelRef}
        className="cta-reveal relative z-[1]"
        data-open={open ? "true" : undefined}
        data-settled={settled ? "true" : undefined}
        style={{ height: panelHeight }}
        inert={!open}
      >
        {/* The measured element. It must be the panel's only child and must not
            carry a margin of its own — `offsetHeight` is read from here, and a
            collapsing margin would put the animation a few pixels out. */}
        <div ref={panelInnerRef}>
          <div className="mx-auto w-full max-w-[620px] pt-8 text-left">
            <p className="mx-auto mb-8 max-w-[440px] text-center text-lead text-white/70">
              A few details and we will come back to you. No technology decisions
              required yet.
            </p>

            <ContactForm services={services} variant="brand" compact />
          </div>
        </div>
      </div>
    </div>
  );
}
