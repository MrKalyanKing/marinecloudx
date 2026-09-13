"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Makes a hover-to-preview control comprehensible on a touch screen.
 *
 * ## The problem this exists for
 *
 * Two components on the homepage — the capabilities stage and the system
 * diagram — are built as "pick one on the left, read about it on the right".
 * With a mouse that works: the pointer is on the selector and the detail panel
 * is beside it, both in view at once, and the hover *is* the explanation.
 *
 * On a phone the same layout stacks. The selector is on top and the detail
 * panel is roughly a screen-and-a-half below it, so tapping an item updates
 * something the person cannot see. The state changed, the tap "worked", and
 * nothing appeared to happen — which is indistinguishable from a broken button.
 *
 * ## What it does
 *
 * After a selection, it brings the panel that answers the tap into view. Only
 * where it is needed, and only when it is needed:
 *
 * - **Hover-capable pointers are left alone.** `(hover: hover)` is the honest
 *   test — not a width breakpoint, which gets a touchscreen laptop wrong in
 *   both directions. On a mouse the panel is already beside the cursor and
 *   yanking the page would be worse than doing nothing.
 * - **A panel already on screen is left alone.** Scrolling when the answer is
 *   visible is disorienting, and it would fire again on every subsequent tap as
 *   the reader works down the list.
 * - **`prefers-reduced-motion` gets an instant jump** rather than a smooth
 *   scroll, since a scroll animation is exactly the kind of motion that setting
 *   asks to be spared.
 *
 * The target needs a `scroll-margin-top` that clears the fixed header, or it
 * lands underneath it.
 */
export function useRevealOnSelect<T extends HTMLElement>() {
  const targetRef = useRef<T>(null);
  const pulseTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(pulseTimer.current), []);

  const reveal = useCallback(() => {
    const element = targetRef.current;
    if (typeof window === "undefined" || !element) return;

    // A device that can hover already shows the panel next to the pointer.
    if (window.matchMedia("(hover: hover)").matches) return;

    // Flash a ring around the panel, so a tap is acknowledged even when the
    // panel is already on screen and the scroll below is skipped.
    //
    // The attribute is written straight to the DOM rather than held in state:
    // it is a transient visual acknowledgement, not something any render output
    // should depend on, and routing it through React would re-render both this
    // component and its children twice for a decoration.
    window.clearTimeout(pulseTimer.current);
    element.removeAttribute("data-pulse");
    // Reading a layout property forces the style change to flush, which is what
    // lets the animation restart when the same panel is tapped twice. Without
    // it the browser coalesces the remove and the re-add into no change at all.
    void element.offsetWidth;
    element.setAttribute("data-pulse", "true");
    pulseTimer.current = window.setTimeout(
      () => element.removeAttribute("data-pulse"),
      800,
    );

    const rect = element.getBoundingClientRect();

    // Roughly the height of the floating header, so "visible" never counts the
    // strip of page hidden behind it.
    const headerClearance = 88;
    const viewportTop = headerClearance;
    const viewportBottom = window.innerHeight;

    const visibleHeight = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop);
    const couldBeVisible = Math.min(rect.height, viewportBottom - viewportTop);

    // Two conditions, and both have to hold to skip the scroll.
    //
    // Enough of it is on screen — three fifths, because requiring all of it
    // would scroll on every tap for a panel taller than the viewport, which is
    // the common case on a small phone.
    const mostlyVisible = visibleHeight >= couldBeVisible * 0.6;

    // *And* it starts in the top half. Area alone is not enough: a panel whose
    // top edge sits three fifths of the way down the screen is technically
    // visible and still reads as "nothing happened", because the part that
    // changed — the heading naming what you picked — is below the fold with
    // only its tail showing. This is the case the diagram hit.
    const readablyPlaced = rect.top <= viewportTop + (viewportBottom - viewportTop) * 0.45;

    if (mostlyVisible && readablyPlaced) return;

    element.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, []);

  return { targetRef, reveal };
}
