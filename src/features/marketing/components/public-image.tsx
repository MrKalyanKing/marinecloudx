import Image from "next/image";

/**
 * The single image primitive for CMS media.
 *
 * Lives in its own module rather than beside the gallery or the card because
 * both need it, and importing either from the other would make `layout.tsx` and
 * `project-gallery.tsx` mutually dependent.
 *
 * ## Why `next/image`, and why `fill`
 *
 * This was a raw `<img>` with an ESLint suppression, on the reasoning that
 * object-storage hosts differ per deployment and `remotePatterns` would have to
 * be configured per environment. That is true, and it is now done — see
 * `mediaHostnames()` in next.config.ts — so the site gets AVIF and WebP
 * negotiation, a responsive `srcset` and correctly sized downloads instead of
 * shipping whatever the CMS happened to store.
 *
 * `fill` rather than intrinsic width and height because the CMS records those
 * as nullable. Passing `undefined` to `next/image` is an error, and passing a
 * guessed number is worse. Every caller already wraps this in an aspect-ratio
 * box, which reserves the space and makes layout shift impossible whether or
 * not the dimensions were ever recorded. That wrapper must be `position:
 * relative`.
 *
 * ## Why `alt` is required
 *
 * It used to be `altText ?? ""`, which silently reclassified any content image
 * with no recorded alt text as decorative — the one value that tells assistive
 * technology to skip it entirely. Making the prop required moves that decision
 * to the caller, which is the only place that knows what the image depicts.
 * Pass `""` deliberately for genuinely decorative media.
 */
export function PublicImage({
  url,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
}: {
  url: string;
  /** Required on purpose. `""` is a valid, deliberate "this is decorative". */
  alt: string;
  /**
   * Eager-load and raise fetch priority. Set on the one image most likely to be
   * the LCP element — the first in a gallery, the first card in a grid. Every
   * other image stays lazy, which is `next/image`'s default.
   */
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={["object-cover", className].filter(Boolean).join(" ")}
    />
  );
}
