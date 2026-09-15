"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import {
  GA_MEASUREMENT_ID,
  pageview,
  trackCtaClick,
  trackPhoneClick,
  trackWhatsAppClick,
} from "@/lib/analytics/gtag";

/**
 * Tracks route changes in Next.js App Router (SPA navigation).
 * Prevents duplicate page_view events under React 19 Strict Mode.
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !GA_MEASUREMENT_ID) return;

    const queryString = searchParams?.toString();
    const fullUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Prevent duplicate pageview triggers for the same route / query
    if (lastTrackedUrlRef.current === fullUrl) return;

    lastTrackedUrlRef.current = fullUrl;
    pageview(fullUrl);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Global passive listener for phone (tel:), WhatsApp, and key CTA links across the entire DOM.
 * Ensures complete tracking without requiring visual or code changes to individual links.
 */
function GlobalInteractionTracker() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        trackPhoneClick(href);
      } else if (
        href.includes("wa.me") ||
        href.includes("whatsapp.com") ||
        href.startsWith("whatsapp:")
      ) {
        trackWhatsAppClick(href);
      } else if (href === "/contact" || href.startsWith("/contact#") || href.startsWith("/contact?")) {
        trackCtaClick("contact_us", "link");
      }
    }

    document.addEventListener("click", handleClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}

/**
 * Google Analytics 4 integration component for MarineCloudX frontend.
 *
 * Characteristics:
 * - Non-blocking script loading via `next/script` with `strategy="afterInteractive"`
 * - SPA navigation tracking without duplicate page_view emissions
 * - Global phone/WhatsApp interaction tracking
 * - Safely disables itself if GA_MEASUREMENT_ID is missing or not configured
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      <GlobalInteractionTracker />
    </>
  );
}
