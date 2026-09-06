/**
 * Route entry for /projects.
 *
 * The page itself lives in the marketing feature. This file exists because
 * Next.js resolves a route from a page.tsx at this path — it carries the
 * route's config and nothing else.
 */

export { generateMetadata } from "@/features/marketing/pages/ProjectsPage";
export { default } from "@/features/marketing/pages/ProjectsPage";
