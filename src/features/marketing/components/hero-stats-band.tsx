/**
 * Hero stats band — the `heroFeatures` / `stats` copy from brand.ts, which was
 * written as "the three supporting points under the hero copy" and "hero
 * stats bar" but never rendered anywhere. Sits directly under the hero's CTA
 * row, inside the same overlay layer as the rest of the hero text.
 *
 * The panel used to be an opaque near-black slab, chosen so text stayed
 * legible over the ribbon. That solved legibility by hiding the artwork and
 * introduced the one genuinely off-brand surface on the site.
 *
 * It is now the thickest glass on the page, deliberately overlapping the
 * ribbon so the colour reads through it. Legibility comes from the blur and
 * saturation instead of from opacity — that is what the material is for — and
 * the accent colours are the darkened text-safe stops, so every label clears
 * 4.5:1 against the panel rather than relying on white-on-black.
 *
 * Server-safe: no hooks, no handlers.
 */

import { heroFeatures, stats } from "@/lib/config/brand";

type IconName = (typeof heroFeatures)[number]["icon"];

/**
 * One brand accent per feature and stat.
 *
 * These are the text-safe stops, not the decorative ones. The previous values
 * (#8b7cff, #5ec8ff) were picked to glow on black and fall to roughly 2:1 on a
 * light panel; each of these clears 4.5:1, so the numbers stay readable now
 * that the panel is glass.
 */
const ACCENTS = ["#5b4ae8", "#d92668", "#1272d6", "#7c3aed"];

function FeatureIcon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "compass") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z" />
      </svg>
    );
  }

  if (name === "code") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="m9 8-4 4 4 4" />
        <path d="m15 8 4 4-4 4" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true">
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6l-7-2.5Z" />
      <path d="m9 12 2 2 4-4.2" />
    </svg>
  );
}

export function HeroStatsBand() {
  return (
    <div className="hero-stats-card max-w-[960px] rounded-[30px] px-6 py-7 sm:px-10 sm:py-9">
      <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-3">
        {heroFeatures.map((feature, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <li key={feature.title} className="flex items-start gap-3.5 sm:block">
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  color: accent,
                  background: `${accent}22`,
                  borderColor: `${accent}55`,
                }}
              >
                <FeatureIcon name={feature.icon} />
              </span>
              <div className="sm:mt-4">
                {/* Deliberately a <p>, not a heading. These are three feature
                    labels inside a card, not sections of the document — as
                    <h3> they appeared before the page's first <h2>, giving the
                    homepage an h1 → h3 jump. Styling is unchanged. */}
                <p className="text-[15px] font-semibold text-ink">{feature.title}</p>
                <p className="mt-1.5 max-w-[30ch] text-[13.5px] leading-relaxed text-ink-muted">
                  {feature.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 border-t border-ink/10 pt-6 sm:mt-8 sm:pt-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[20ch] text-[15px] font-medium text-ink">
            What the engagement actually looks like
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:gap-9">
            {stats.map((stat, index) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd
                  className="text-[26px] leading-none font-semibold"
                  style={{ color: ACCENTS[index % ACCENTS.length] }}
                >
                  {stat.value}
                </dd>
                <p className="mt-1.5 text-[12.5px] text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
