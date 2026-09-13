/**
 * Public layout primitives.
 *
 * Server-safe by design — no hooks, no handlers — so pages stay server
 * components and only genuinely interactive pieces ship JavaScript.
 *
 * `Section` carries the light/dark rhythm. Each major band declares its own
 * environment rather than every page re-deriving colours, which is what keeps
 * the alternation consistent and the CSS from duplicating.
 */

import Link from "next/link";
import type { ReactNode } from "react";

import { PublicImage } from "@/features/marketing/components/public-image";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { BreadcrumbJsonLd } from "@/features/marketing/components/structured-data";

/** The four surfaces the site alternates between. */
export type Tone = "dark" | "ice" | "aqua" | "paper";

export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}

const TONE_SURFACE: Record<Tone, string> = {
  dark: "bg-navy text-light",
  ice: "bg-ice text-ink",
  aqua: "bg-aqua text-ink",
  paper: "bg-paper text-ink",
};

const TONE_MUTED: Record<Tone, string> = {
  dark: "text-light-muted",
  ice: "text-ink-muted",
  aqua: "text-ink-muted",
  paper: "text-ink-muted",
};

const TONE_HAIRLINE: Record<Tone, string> = {
  dark: "border-hairline-dark",
  ice: "border-hairline-light",
  aqua: "border-hairline-light",
  paper: "border-hairline-light",
};

export function isDark(tone: Tone): boolean {
  return tone === "dark";
}

export function mutedText(tone: Tone): string {
  return TONE_MUTED[tone];
}

export function hairline(tone: Tone): string {
  return TONE_HAIRLINE[tone];
}

export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  /** `wide` for editorial galleries, `narrow` for reading-width prose. */
  width?: "default" | "wide" | "narrow";
}) {
  const max = {
    default: "max-w-[80rem]",
    wide: "max-w-[88rem]",
    narrow: "max-w-[46rem]",
  }[width];

  return <div className={cx("mx-auto w-full px-5 sm:px-8", max, className)}>{children}</div>;
}

/** Small monospace caps — section numbers, categories, status labels. */
export function TechLabel({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "tech-label inline-flex items-center gap-2",
        isDark(tone) ? "text-brand-soft" : "text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A major page band. Owns its own background, rhythm and optional grid. */
export function Section({
  children,
  tone = "paper",
  className,
  id,
  grid = false,
  aurora = false,
  size = "default",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  /** Draws the faint engineering rule behind the band. */
  grid?: boolean;
  /** Mounts the slow aurora colour field behind the band. Dark tones only. */
  aurora?: boolean;
  size?: "default" | "compact" | "tall";
}) {
  const padding = {
    compact: "py-14 sm:py-16",
    default: "py-20 sm:py-28",
    tall: "py-24 sm:py-36",
  }[size];

  return (
    <section
      id={id}
      className={cx("relative overflow-hidden", TONE_SURFACE[tone], padding, className)}
    >
      {aurora && isDark(tone) ? <div aria-hidden="true" className="aurora" /> : null}
      {grid ? (
        <div
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute inset-0",
            isDark(tone) ? "grid-lines" : "grid-lines-light",
          )}
        />
      ) : null}
      <ScrollReveal className="relative">{children}</ScrollReveal>
    </section>
  );
}

/**
 * Section heading block: number, eyebrow, title, optional description and
 * action. Kept as one component so every band shares the same rhythm.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  action,
  tone = "paper",
  align = "left",
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: Tone;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
      )}
    >
      <div className={cx("max-w-3xl", align === "center" && "mx-auto")}>
        {index || eyebrow ? (
          <TechLabel tone={tone}>
            {index ? <span aria-hidden="true">{index}</span> : null}
            {index && eyebrow ? (
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
            ) : null}
            {eyebrow}
          </TechLabel>
        ) : null}

        <h2 className={cx("mt-4 text-h2 font-semibold text-balance", isDark(tone) ? "text-light" : "text-ink")}>
          {title}
        </h2>

        {description ? (
          <p className={cx("mt-4 text-lead max-w-2xl", mutedText(tone))}>{description}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost";

function buttonClass(variant: ButtonVariant, tone: Tone): string {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200";

  if (variant === "primary") {
    return cx(base, "btn-gradient");
  }

  if (variant === "secondary") {
    return cx(base, isDark(tone) ? "chip-glass-dark text-light" : "btn-light-ghost text-ink");
  }

  return cx(base, "px-0", isDark(tone) ? "text-brand-soft" : "text-brand");
}

/** Arrow that nudges on hover — the site's one repeated micro-interaction. */
export function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-200 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export function ActionLink({
  href,
  children,
  variant = "primary",
  tone = "dark",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link href={href} className={cx(buttonClass(variant, tone), className)}>
      {children}
      <Arrow />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Page furniture                                                              */
/* -------------------------------------------------------------------------- */

/** Page masthead — black type on white canvas. */
export function PageIntro({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden px-5 pt-32 pb-16 text-ink sm:px-8 sm:pt-40 sm:pb-20">
      <Container className="relative max-w-[920px]">
        {eyebrow ? <TechLabel tone="paper">{eyebrow}</TechLabel> : null}
        <h1 className="mt-5 max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.035em] text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-[42ch] text-lead text-ink-muted">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}

/**
 * Light content surface for inner listing/detail pages.
 *
 * The public shell is the continuous dark studio. Listing and form pages still
 * use ink-on-paper for long CMS content and forms — without this wrapper,
 * labels and empty states render dark-on-dark.
 */
export function PageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // Translucent rather than solid, so the ambient trails behind the page
    // read faintly through inner pages too. At 72% over a near-white canvas
    // the effective background is still ~#fcfcff, so body-text contrast is
    // unchanged.
    <div className={cx("relative flex-1 bg-paper/72 text-ink", className)}>
      {children}
    </div>
  );
}

/**
 * Breadcrumb trail, visible and machine-readable from one input.
 *
 * The JSON-LD is emitted here rather than in each of the five detail pages on
 * purpose. Google withdraws breadcrumb rich results when the markup describes a
 * path different from the one on the page, and the surest way to produce that
 * mismatch is to maintain the two separately. Both now read the same `trail`,
 * so they cannot drift.
 */
export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <BreadcrumbJsonLd trail={trail} />
      <ol className="tech-label flex flex-wrap items-center gap-2 text-ink-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-brand">
            Home
          </Link>
        </li>
        {trail.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Editorial card. Thin hairline, generous space, numbered — deliberately not a
 * shadowed SaaS tile.
 */
/**
 * Renders the requested heading element.
 *
 * The visual size is carried by a class, so changing the level for document
 * structure never changes how the card looks.
 */
function Heading({
  level,
  className,
  children,
}: {
  level: 2 | 3;
  className?: string;
  children: ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";

  return <Tag className={className}>{children}</Tag>;
}

export interface CardImage {
  url: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

/**
 * Palette for card accents. The text-safe stops, because these colour a chip
 * label and a monogram, not just a background wash.
 */
const CARD_ACCENTS = ["#5b4ae8", "#d92668", "#1272d6", "#0f9488", "#c2410c", "#7c3aed"];

/**
 * Small stable hash of the title.
 *
 * Deterministic on purpose: a card must keep the same accent between the server
 * render and the client, and between visits. Anything random would hydrate
 * mismatched and would also change colour every time the page rebuilt.
 */
function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ContentCard({
  title,
  href,
  description,
  meta,
  index,
  tone = "paper",
  image,
  tags,
  headingLevel = 3,
  priority = false,
}: {
  title: string;
  href: string;
  description?: string | null;
  meta?: ReactNode;
  index?: string;
  tone?: Tone;
  /**
   * Heading level for the card title.
   *
   * Defaults to 3, which is right on the homepage where cards sit beneath an
   * h2 section header. A listing page puts cards directly under its h1, so it
   * passes 2 — otherwise the document skips from h1 to h3, which screen-reader
   * users navigating by heading experience as a missing level.
   */
  headingLevel?: 2 | 3;
  /**
   * Eager-load this card's cover. Set on the first card of a grid, which is the
   * LCP candidate on a listing page; everything below stays lazy.
   */
  priority?: boolean;
  /** Optional cover. Omitted entirely when the record has no image — no placeholder is invented. */
  image?: CardImage | null;
  /** Short factual labels (industry, technology) drawn from real relations. */
  tags?: string[];
}) {
  return (
    <article
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-[20px] p-6",
        "transition-[transform,box-shadow] duration-300 hover:-translate-y-1",
        isDark(tone)
          ? "mcx-card"
          : "mcx-card",
      )}
    >
      {image?.url ? (
        <div
          className={cx(
            "relative -mx-6 -mt-6 mb-6 aspect-[16/10] overflow-hidden border-b",
            hairline(tone),
            isDark(tone) ? "bg-surface-dark" : "bg-ice",
          )}
        >
          <PublicImage
            url={image.url}
            // Falls back to the card's own title rather than to `""`. A cover
            // image labelled by the thing it is a cover for is accurate; an
            // empty alt would tell assistive technology to skip a content image.
            alt={image.altText ?? title}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      {index ? (
        <span className={cx("tech-label mb-5 block", isDark(tone) ? "text-brand-soft" : "text-brand")}>
          {index}
        </span>
      ) : null}

      <Heading
        level={headingLevel}
        className={cx("text-h3 font-semibold", isDark(tone) ? "text-light" : "text-ink")}
      >
        <Link href={href} className="after:absolute after:inset-0">
          {title}
        </Link>
      </Heading>

      {description ? (
        <p className={cx("mt-3 line-clamp-3 text-sm leading-relaxed", mutedText(tone))}>
          {description}
        </p>
      ) : null}

      {tags && tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className={cx(
                "rounded-full px-2.5 py-0.5 text-[0.7rem] tracking-wide",
                isDark(tone) ? "chip-glass-dark" : "chip-glass",
                mutedText(tone),
              )}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-6">
        {meta ? <div className={cx("tech-label mb-3", mutedText(tone))}>{meta}</div> : null}
        <span
          className={cx(
            "inline-flex items-center gap-2 text-sm font-medium",
            isDark(tone) ? "text-brand-soft" : "text-brand",
          )}
        >
          Explore
          <Arrow />
        </span>
      </div>
    </article>
  );
}

export function CardGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 }) {
  return (
    <div
      className={cx(
        "grid gap-4",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

/**
 * Empty state.
 *
 * Public pages say plainly when nothing is published rather than rendering
 * invented placeholder records.
 */
export function PublicEmptyState({
  title,
  description,
  tone = "paper",
}: {
  title: string;
  description?: string;
  tone?: Tone;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-dashed px-6 py-16 text-center",
        hairline(tone),
        !isDark(tone) && "bg-white/40 backdrop-blur-sm",
      )}
    >
      <p className={cx("text-h3 font-medium", isDark(tone) ? "text-light" : "text-ink")}>{title}</p>
      {description ? (
        <p className={cx("mx-auto mt-3 max-w-md text-sm", mutedText(tone))}>{description}</p>
      ) : null}
    </div>
  );
}

export function PublicPagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  /** Extra query values (e.g. an active filter) carried across page links. */
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  // Filters must survive paging, otherwise page 2 silently drops the filter and
  // shows a different result set than page 1 promised.
  const href = (target: number) => {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params ?? {})) {
      if (value) query.set(key, value);
    }

    if (target > 1) query.set("page", String(target));

    const suffix = query.toString();

    return suffix ? `${basePath}?${suffix}` : basePath;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-between gap-4 border-t border-hairline-light pt-6"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className="group inline-flex items-center gap-2 text-sm text-brand">
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="tech-label text-ink-muted">
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={href(page + 1)} className="group inline-flex items-center gap-2 text-sm text-brand">
          Next
          <Arrow />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
