import type { NextConfig } from "next";

/**
 * Baseline security headers for the public website. Carried over from the legacy
 * single-app config (see docs/security.md for the rationale and the documented
 * CSP gap). HSTS is production-only.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const hstsHeader = { key: "Strict-Transport-Security", value: "max-age=31536000" };

/**
 * Hostnames that may serve CMS media.
 *
 * Media lives on object storage whose host differs per environment, which is
 * why the site rendered raw `<img>` tags for so long — `next/image` refuses any
 * remote host it has not been told about. Reading the list from the environment
 * keeps that per-environment truth out of the code while still letting the
 * optimiser run: set `NEXT_PUBLIC_MEDIA_HOSTS` to a comma-separated list.
 *
 * The API host is always included, since media URLs are commonly served from
 * the same origin that returns the records referencing them.
 */
function mediaHostnames(): string[] {
  const hosts = new Set<string>();

  for (const raw of (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "").split(",")) {
    const value = raw.trim();
    if (value) hosts.add(value.replace(/^https?:\/\//, "").replace(/\/.*$/, ""));
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) {
    try {
      hosts.add(new URL(api.startsWith("http") ? api : `https://${api}`).hostname);
    } catch {
      // A malformed API URL is the API client's problem to report, not this file's.
    }
  }

  return [...hosts];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // AVIF first, WebP second, original as the final fallback. Next negotiates
    // per request from the Accept header, so no markup has to know about it.
    formats: ["image/avif", "image/webp"],
    remotePatterns: mediaHostnames().flatMap((hostname) => [
      { protocol: "https" as const, hostname },
      // http only for local object storage during development.
      ...(process.env.NODE_ENV === "production"
        ? []
        : [{ protocol: "http" as const, hostname }]),
    ]),
  },

  async headers() {
    const headers =
      process.env.NODE_ENV === "production" ? [...securityHeaders, hstsHeader] : securityHeaders;

    return [{ source: "/:path*", headers }];
  },

  /**
   * `www` to apex, permanently.
   *
   * Serving the same pages on two hostnames splits every signal they earn.
   * Doing it here rather than only at the CDN means the rule travels with the
   * application and is testable — `curl -H "Host: www.marinecloudx.in"` shows
   * the 308 — instead of living in a dashboard nobody reviews. A CDN-level
   * redirect is still worth having in front of this, because it saves the
   * request ever reaching the origin.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.(?<domain>.*)" }],
        destination: "https://:domain/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
