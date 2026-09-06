"use client";

/**
 * Previously this wrote a `--scroll-y` custom property onto
 * `document.documentElement` on every scroll frame, so the background layers
 * could parallax against it.
 *
 * That was the single most expensive thing on the page during a scroll. Setting
 * a custom property on the root element invalidates style for **every element
 * in the document**, because any descendant could inherit it — so each frame of
 * every scroll triggered a full-document style recalculation, on a page with a
 * couple of thousand nodes. The parallax it bought was a six-pixel drift on a
 * decorative line pattern that almost nobody would notice.
 *
 * The pattern now drifts on its own CSS animation instead, which the compositor
 * runs without involving style or layout at all.
 *
 * The component is kept as a no-op rather than deleted so the layout does not
 * need restructuring, and so this note stays attached to the decision.
 */
export function ScrollAmbient() {
  return null;
}
