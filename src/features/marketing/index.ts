/**
 * Public surface of the marketing feature.
 *
 * Everything here is safe to import from a client component.
 *
 * Two folders are deliberately absent.
 *
 * `services/` is marked `server-only`. Re-exporting it here would pull server
 * code into the client graph the moment a component imported this barrel — a
 * build failure whose error does not point back at this file.
 *
 * `pages/` holds route entry points, not a reusable API. Every page exports
 * `metadata`, so exporting them together collides; and nothing should import a
 * page except the `app/` route file that owns it.
 *
 * Import from either directly:
 *
 *     import { getPublishedServices } from "@/features/content/services/content";
 */

export * from "./components/contact-form";
export * from "./components/faq-accordion";
export * from "./components/hero-motion";
export * from "./components/hero-scene";
export * from "./components/hero";
export * from "./components/layout";
export * from "./components/project-gallery";
export * from "./components/site-footer";
export * from "./components/site-header";
export * from "./components/structured-data";
