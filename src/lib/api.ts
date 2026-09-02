/**
 * The public site's single entry point to the backend API.
 *
 * Feature services import `api` from here — never call `fetch` directly and
 * never import from `@/contracts/client` elsewhere.
 */

import { createApiClient } from "@/contracts";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const api = createApiClient({
  baseUrl,
  // Public reads: no auth. Cache tags are passed per-call from feature services
  // (Phase 12) so a CMS publish can revalidate them (Phase 13).
  timeoutMs: 10_000,
});
