/**
 * Google Analytics 4 (GA4) integration utilities.
 *
 * Privacy & Security Guarantees:
 * - NO Personally Identifiable Information (PII) is ever dispatched to GA4.
 * - Names, email addresses, phone numbers, addresses, messages, and tokens are strictly excluded.
 * - Safe no-op on SSR and when NEXT_PUBLIC_GA_MEASUREMENT_ID is absent.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Returns true if GA4 is active and running in the browser.
 */
export function isGaEnabled(): boolean {
  return typeof window !== "undefined" && Boolean(GA_MEASUREMENT_ID);
}

/**
 * Record a page view in Google Analytics 4.
 */
export function pageview(url: string, title?: string): void {
  if (!isGaEnabled() || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: url,
    page_title: title || (typeof document !== "undefined" ? document.title : undefined),
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * Track a custom Google Analytics 4 event safely.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
): void {
  if (!isGaEnabled() || typeof window.gtag !== "function") return;

  // Filter out undefined or null values to keep payloads clean
  const cleanParams: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      cleanParams[key] = value;
    }
  }

  window.gtag("event", eventName, cleanParams);
}

/**
 * Track when an enquiry / contact form is viewed by a user.
 */
export function trackViewEnquiryForm(variant = "paper"): void {
  trackEvent("view_enquiry_form", {
    form_name: "start_a_project",
    form_variant: variant,
  });
}

/**
 * Track successful enquiry conversion (generate_lead).
 *
 * CRITICAL PRIVACY NOTE:
 * Do NOT include any customer PII (e.g. name, email, phone, message content).
 */
export function trackGenerateLead(details: {
  form_type?: string;
  service_id?: string;
} = {}): void {
  trackEvent("generate_lead", {
    form_type: details.form_type || "website_enquiry",
    service_id: details.service_id || "unspecified",
  });
}

/**
 * Track high-intent CTA button clicks.
 */
export function trackCtaClick(ctaName: string, location?: string): void {
  trackEvent("cta_click", {
    cta_name: ctaName,
    location: location || "unknown",
  });
}

/**
 * Track phone link (tel:) interactions.
 */
export function trackPhoneClick(phoneLink?: string): void {
  trackEvent("phone_click", {
    interaction_type: "tel_link",
    has_value: Boolean(phoneLink),
  });
}

/**
 * Track WhatsApp interaction clicks.
 */
export function trackWhatsAppClick(source?: string): void {
  trackEvent("whatsapp_click", {
    interaction_type: "whatsapp_link",
    source: source || "website",
  });
}
