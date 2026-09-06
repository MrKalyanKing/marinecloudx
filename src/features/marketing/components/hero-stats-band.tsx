/**
 * Hero stats band — the `heroFeatures` / `stats` copy from brand.ts, which was
 * written as "the three supporting points under the hero copy" and "hero
 * stats bar" but never rendered anywhere. Sits directly under the hero's CTA
 * row, inside the same overlay layer as the rest of the hero text.
 *
 * Wrapped in one solid, fully-opaque card rather than floating the text
 * directly over the ribbon — the ribbon is meant to sit large and full-size
 * behind the hero at every screen width, so whatever overlays it needs its
 * own opaque backing to stay legible instead of relying on the ribbon being
 * small enough to avoid it (server-safe, no hooks).
 */

import { heroFeatures, stats } from "@/lib/config/brand";

type IconName = (typeof heroFeatures)[number]["icon"];

/** One brand accent per feature/stat — violet, pink, blue, cycling. */
const ACCENTS = ["#8b7cff", "#ff5ca8", "#5ec8ff", "#a78bfa"];

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
    <div className="hero-stats-card max-w-[920px] rounded-[28px] px-6 py-7 sm:px-10 sm:py-9">
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
                <p className="text-[15px] font-semibold text-white">{feature.title}</p>
                <p className="mt-1.5 max-w-[30ch] text-[13.5px] leading-relaxed text-white/75">
                  {feature.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 border-t border-white/10 pt-6 sm:mt-8 sm:pt-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[20ch] text-[15px] font-medium text-white">
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
                <p className="mt-1.5 text-[12.5px] text-white/70">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
