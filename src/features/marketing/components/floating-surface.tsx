/**
 * Physical floating design surface — the reference video's primary object.
 *
 * A thick, rounded glass/acrylic panel with depth, soft shadow, and optional
 * perspective. Used for hero, product showcases, and editorial stages.
 */

import type { CSSProperties, ReactNode } from "react";

import { cx } from "@/features/marketing/components/layout";

export type SurfaceTone = "glass" | "light" | "dark";

const TONE: Record<SurfaceTone, string> = {
  glass: "fs-tone-glass",
  light: "fs-tone-light",
  dark: "fs-tone-dark",
};

export function FloatingSurface({
  children,
  tone = "glass",
  className,
  style,
  glow = true,
  frame = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  tone?: SurfaceTone;
  className?: string;
  style?: CSSProperties;
  /** Soft accent glow under the panel */
  glow?: boolean;
  /** Visible physical bezel */
  frame?: boolean;
  as?: "div" | "article" | "section";
}) {
  return (
    <Tag
      className={cx("floating-surface", TONE[tone], frame && "floating-surface--framed", className)}
      style={style}
      data-glow={glow ? "true" : "false"}
    >
      {glow ? <span aria-hidden="true" className="floating-surface__glow" /> : null}
      <div className="floating-surface__face">{children}</div>
    </Tag>
  );
}
