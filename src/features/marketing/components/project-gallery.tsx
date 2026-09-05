/**
 * Project gallery.
 *
 * Shared by the project page and its case study so the two render identical
 * media rather than drifting apart.
 *
 * A `ProjectMedia` row can point at a `Media` record that has no public URL —
 * metadata registered before object storage was configured, for instance. Those
 * entries are listed by caption rather than rendered as a broken image, and no
 * placeholder graphic is substituted for them.
 *
 * Server-safe: no hooks, no handlers.
 */

import { cx } from "@/features/marketing/components/layout";

export interface GalleryItem {
  id: string;
  role: string;
  caption: string | null;
  media: {
    id: string;
    url: string | null;
    altText: string | null;
    width: number | null;
    height: number | null;
  };
}

export function PublicImage({
  url,
  altText,
  width,
  height,
  className,
}: {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  className?: string;
}) {
  return (
    // Object-storage URLs vary per deployment, so next/image would need
    // remotePatterns configured per environment. See docs/media.md.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={altText ?? ""}
      width={width ?? undefined}
      height={height ?? undefined}
      loading="lazy"
      className={cx("h-full w-full object-cover", className)}
    />
  );
}

/** Turns GALLERY / SCREENSHOT / DIAGRAM into a readable label. */
function roleLabel(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase().replace(/_/g, " ");
}

export function ProjectGallery({
  items,
  heading = "Gallery",
}: {
  items: GalleryItem[];
  heading?: string;
}) {
  if (items.length === 0) return null;

  const renderable = items.filter((item) => item.media.url);
  const unrenderable = items.filter((item) => !item.media.url);

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-ink">{heading}</h2>

      {renderable.length > 0 ? (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {renderable.map((item) => (
            <li key={item.id}>
              <figure>
                <div className="media-frame aspect-[16/10] bg-ice">
                  <PublicImage
                    url={item.media.url as string}
                    altText={item.media.altText ?? item.caption}
                    width={item.media.width}
                    height={item.media.height}
                  />
                </div>
                {item.caption ? (
                  <figcaption className="mt-2 text-sm text-ink-muted">{item.caption}</figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      ) : null}

      {unrenderable.length > 0 ? (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {unrenderable.map((item) => (
            <li key={item.id} className="rounded-2xl border border-dashed border-hairline-light p-3">
              <p className="text-sm text-ink-muted">
                {item.caption ?? item.media.altText ?? "Media"}
              </p>
              <p className="mt-1 text-xs text-ink-muted/70">{roleLabel(item.role)}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
