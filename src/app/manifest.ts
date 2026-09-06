import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

/**
 * Web app manifest.
 *
 * The site already shipped a favicon and an Apple touch icon through the file
 * conventions, but no manifest at all, so nothing described the site to a
 * browser asked to install or pin it — no name, no theme colour, no icon set.
 *
 * `display: "browser"` is deliberate. This is a marketing site, not an app;
 * claiming `standalone` would strip the address bar and the back button from
 * anyone who added it to a home screen, which is worse for them, not better.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} ${siteConfig.descriptor}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    // Matches --color-brand in globals.css.
    theme_color: "#5b4dff",
    lang: siteConfig.locale,
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
