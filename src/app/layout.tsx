import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/lib/config/site";

import "./globals.css";

/**
 * `preload` is explicit rather than left to the default.
 *
 * The rendered HTML previously contained no `<link rel="preload" as="font">` at
 * all, so both families were discovered only after the stylesheet parsed. That
 * delays the swap and pushes the first text paint later on every route.
 *
 * Only the sans family is preloaded. The mono family is used for small labels
 * and breadcrumbs well below the fold, so preloading it would compete with the
 * font that actually renders the LCP element.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/**
 * Site-wide metadata defaults.
 *
 * `metadataBase` makes every relative Open Graph and canonical URL resolve
 * against the site origin, so pages declare paths rather than repeating the
 * domain. The title template applies the company name to every page.
 *
 * These defaults describe the homepage. Every other route builds its own block
 * through `pageMetadata()` in src/lib/config/metadata.ts — including its own
 * Open Graph, because an omitted `openGraph` key inherits this one wholesale.
 *
 * Copy here is intentionally neutral. No claims about the company's size,
 * clients or results appear anywhere, because none have been provided.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Custom Software, Cloud & AI Development | MarineCloudX",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Custom Software, Cloud & AI Development | MarineCloudX",
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software, Cloud & AI Development | MarineCloudX",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

/**
 * `themeColor` tints the browser chrome on mobile. It belongs in `viewport`
 * rather than `metadata` — Next moved it there and warns at build time if it is
 * declared in the wrong export. The value matches `--color-brand` and the
 * manifest's `theme_color`; all three must agree or the chrome flickers between
 * them.
 */
export const viewport: Viewport = {
  themeColor: "#5b4dff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
