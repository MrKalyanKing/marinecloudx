/**
 * A field of glass bubbles rising behind a translucent panel.
 *
 * Decoration, and deliberately so: it is `aria-hidden`, it never receives
 * pointer events, and it is removed entirely under `prefers-reduced-motion`
 * (see `.bubble-field` in globals.css — an infinite animation cannot simply be
 * shortened, or it freezes as a static dot field).
 *
 * ## Why the geometry is generated rather than written out
 *
 * Twenty hand-placed bubbles is twenty magic numbers to keep in sync with the
 * card they sit in. The positions here come from one formula, so the density,
 * the size range and the drift all retune from the props.
 *
 * ## Why there is no randomness
 *
 * `Math.random()` in a component that renders on the server produces one set of
 * positions in the HTML and a different set at hydration, which React reports
 * as a mismatch and repaints. The multipliers below are irrational-ish on
 * purpose: multiplying the index by 0.618 (the golden ratio's fractional part)
 * and taking the remainder spreads values across the range without clustering
 * or repeating, which is what randomness was wanted for in the first place —
 * and it is identical on both sides of hydration.
 */

/** Fractional part, i.e. a deterministic value in [0, 1). */
function fract(value: number): number {
  return value - Math.floor(value);
}

export function LiquidBubbles({
  count = 14,
  onBrand = false,
  className,
}: {
  /**
   * How many bubbles are in flight. Each one is an independently animating
   * composited layer, so this is the cost dial: keep it low on small surfaces.
   */
  count?: number;
  /** Lightens the bubbles for the saturated violet band. */
  onBrand?: boolean;
  className?: string;
}) {
  const bubbles = Array.from({ length: count }, (_, index) => {
    // Three different multipliers, so size, horizontal position and timing do
    // not correlate — with a single sequence the bubbles would visibly march
    // across the panel getting steadily bigger.
    const across = fract(index * 0.618);
    const scale = fract(index * 0.379);
    const timing = fract(index * 0.271);

    const size = 8 + scale * 30;

    return {
      key: index,
      // Capped below 100% because `left` positions the track's left edge and the
      // bubble fills its width — at 96% a 38px bubble would hang off the right
      // side and be sliced in half by the field's clip.
      left: `${3 + across * 87}%`,
      size,
      // Small bubbles rise faster, which is backwards in real fluid and right
      // on screen: the large ones then read as nearer and slower, and the field
      // gains a sense of depth it would not have if everything moved together.
      duration: `${20 - scale * 8}s`,
      // Negative delays start the loop mid-flight, so the panel opens with a
      // field already in motion instead of an empty box that fills over the
      // next twenty seconds.
      delay: `${-timing * 20}s`,
      opacity: 0.5 + scale * 0.4,
    };
  });

  return (
    <div
      aria-hidden="true"
      className={["bubble-field", onBrand && "bubble-field--on-brand", className]
        .filter(Boolean)
        .join(" ")}
    >
      {bubbles.map((bubble) => (
        // The track is a full-height, bubble-wide column that carries the climb;
        // the bubble inside it carries the appearance. See `.bubble-track` in
        // globals.css for why the rise cannot live on the bubble itself.
        <span
          key={bubble.key}
          className="bubble-track"
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            ["--bubble-duration" as string]: bubble.duration,
            ["--bubble-delay" as string]: bubble.delay,
            ["--bubble-opacity" as string]: String(bubble.opacity),
          }}
        >
          <span className="bubble" />
        </span>
      ))}
    </div>
  );
}
