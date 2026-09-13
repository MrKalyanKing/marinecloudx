/**
 * Route entry for /industries.
 *
 * The page itself lives in the marketing feature. This file exists because
 * Next.js resolves a route from a page.tsx at this path — it carries the
 * route's config and nothing else.
 */

export { generateMetadata } from "@/features/marketing/pages/IndustriesPage";
export { default } from "@/features/marketing/pages/IndustriesPage";
