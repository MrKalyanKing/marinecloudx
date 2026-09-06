import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

/**
 * Web app manifest.
 *
 * Names and colours come from `siteConfig` and the design tokens already in
 * `globals.css`; icons reuse the file-convention icons in `src/app`. Nothing
 * here is invented.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#061815",
    theme_color: "#061815",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
