import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { CONTENT_TAG } from "@/features/content/services/cache";

/**
 * On-demand cache invalidation.
 *
 * The NestJS backend calls this after a successful CMS publish / unpublish /
 * content mutation, presenting the shared `REVALIDATE_SECRET`. It drops the
 * `content` fetch tag, so the next request to any public page pulls fresh data
 * from the API — an admin edit is visible without the visitor refreshing.
 *
 * This is the cross-process replacement for the pre-monorepo in-process
 * `revalidateTag`, which could not reach a separate admin/backend deployment.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;
  const presented = request.headers.get("x-revalidate-secret");

  if (!secret || presented !== secret) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid revalidation secret." } },
      { status: 401 },
    );
  }

  // `{ expire: 0 }` — expire outright rather than serve-stale-while-revalidate,
  // so a withdrawn (unpublished) page is never served once more after the drop.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json({ success: true, data: { revalidated: CONTENT_TAG, at: Date.now() } });
}
