import "server-only";

/**
 * Caching for the public content data layer.
 *
 * Content reads go through `fetch` with `next: { tags: [CONTENT_TAG],
 * revalidate: REVALIDATE_SECONDS }`. A CMS publish in the admin triggers the
 * backend to call `POST /api/revalidate` on this app, which runs
 * `revalidateTag(CONTENT_TAG)` — so an edit is visible on the next request
 * (Phase 13). `REVALIDATE_SECONDS` is the safety-net expiry for the case where
 * that call does not arrive.
 *
 * This replaces the pre-monorepo `unstable_cache` + in-process `revalidateTag`
 * mechanism, which could not cross the new process boundary between admin and
 * site.
 */

export const CONTENT_TAG = "content";

/** Longest a stale read can survive if the revalidation webhook never fires. */
export const REVALIDATE_SECONDS = 60;
