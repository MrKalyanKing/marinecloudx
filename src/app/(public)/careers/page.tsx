/**
 * Careers listings change when admin publishes a job. Bypass the public
 * layout's 300s full-route cache so a newly published role appears immediately.
 */
export const dynamic = "force-dynamic";

export { generateMetadata } from "@/features/marketing/pages/CareersPage";
export { default } from "@/features/marketing/pages/CareersPage";
