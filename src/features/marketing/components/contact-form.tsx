"use client";

/**
 * Start a project — the public enquiry form.
 *
 * Posts to the existing `POST /api/public/leads`. There is no second lead
 * endpoint, no direct database access from the browser, and no admin API is
 * touched.
 *
 * What the visitor cannot send, by construction: `assignedUserId`, `status`,
 * `pipelineStageId`, `qualificationScore` or any actor id. None of those exist
 * in the public schema, so the server discards them — the resulting lead is
 * always OPEN, unassigned, unscored, at the earliest pipeline stage, with a
 * LEAD_CREATED activity attributed to the system rather than a person.
 *
 * Entered values survive a failed submission: the form is uncontrolled and is
 * never reset on error, so nobody has to retype anything.
 */

import { useState } from "react";

import { BUDGET_CURRENCY, budgetOptions, timelineOptions } from "@/lib/config/brand";

interface FieldErrors {
  [path: string]: string;
}

/*
 * No `sourceSlug` is sent. Attribution is pinned server-side to the website
 * form, so a crafted request cannot claim the enquiry arrived through a paid
 * campaign or a referral partner.
 */
export function ContactForm({ services }: { services: { id: string; name: string }[] }) {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Guards against a double submission while a request is in flight.
    if (isPending) return;

    setIsPending(true);
    setErrors({});
    setFormError(null);

    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();

    const budget = budgetOptions.find((option) => option.value === value("budget"));
    const serviceId = value("serviceId");

    const payload = {
      contact: {
        // One "Name" field, sent whole rather than split on whitespace —
        // guessing where a given name ends gets names wrong.
        firstName: value("name"),
        email: value("email") || undefined,
        phone: value("phone") || undefined,
        company: value("company") || undefined,
      },
      companyName: value("company") || undefined,
      requirement: value("requirement") || undefined,
      timeline: value("timeline") || undefined,
      ...(serviceId ? { serviceId } : {}),
      ...(budget && (budget.min !== null || budget.max !== null)
        ? {
            ...(budget.min !== null ? { budgetMin: budget.min } : {}),
            ...(budget.max !== null ? { budgetMax: budget.max } : {}),
            budgetCurrency: BUDGET_CURRENCY,
          }
        : {}),
    };

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: { message?: string; details?: { path: string; message: string }[] };
      } | null;

      if (!response.ok || !body?.success) {
        const details = body?.error?.details ?? [];

        setErrors(Object.fromEntries(details.map((d) => [d.path, d.message])));
        // Never surface the raw server message for a server fault — it could
        // carry internal detail. Field-level validation text is safe.
        setFormError(
          details.length > 0
            ? "Please check the highlighted fields."
            : "We couldn't send that yet. Please try again.",
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError("We couldn't send that yet. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="glass-strong max-w-xl p-8"
      >
        <p className="tech-label text-brand">Received</p>
        <p className="mt-4 text-h2 font-semibold text-ink">We&rsquo;ve got it.</p>
        <p className="mt-4 text-ink-muted">
          Thanks for reaching out to MarineCloudeX. We&rsquo;ve received your requirement and will review
          it before getting back to you.
        </p>
      </div>
    );
  }

  const field = "field-glass px-4 py-3 text-ink placeholder:text-ink-muted/60";

  const label = "block text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      {formError ? (
        <p
          role="alert"
          className="mb-6 rounded-2xl border border-red-300/60 bg-red-50/80 px-4 py-3 text-sm text-red-800 backdrop-blur-sm"
        >
          {formError}
        </p>
      ) : null}

      <fieldset disabled={isPending} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>

        <div className="sm:col-span-2">
          <label htmlFor="name" className={label}>
            Name <span className="text-brand">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={errors["contact.firstName"] ? true : undefined}
            aria-describedby={errors["contact.firstName"] ? "name-error" : undefined}
            className={`mt-2 ${field}`}
          />
          {errors["contact.firstName"] ? (
            <p id="name-error" className="mt-1.5 text-sm text-red-700">
              {errors["contact.firstName"]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={label}>
            Email <span className="text-brand">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors["contact.email"] ? true : undefined}
            aria-describedby={errors["contact.email"] ? "email-error" : undefined}
            className={`mt-2 ${field}`}
          />
          {errors["contact.email"] ? (
            <p id="email-error" className="mt-1.5 text-sm text-red-700">
              {errors["contact.email"]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={label}>
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors["contact.phone"] ? true : undefined}
            aria-describedby={errors["contact.phone"] ? "phone-error" : undefined}
            className={`mt-2 ${field}`}
          />
          {errors["contact.phone"] ? (
            <p id="phone-error" className="mt-1.5 text-sm text-red-700">
              {errors["contact.phone"]}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className={label}>
            Company / business name
          </label>
          <input id="company" name="company" autoComplete="organization" className={`mt-2 ${field}`} />
        </div>

        <div>
          <label htmlFor="serviceId" className={label}>
            What do you need?
          </label>
          {/* Options come from the published CMS services, so the enquiry links
              to a real service record the CRM can filter on. */}
          <select id="serviceId" name="serviceId" defaultValue="" className={`mt-2 ${field}`}>
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className={label}>
            Budget
          </label>
          <select id="budget" name="budget" defaultValue="" className={`mt-2 ${field}`}>
            {budgetOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="timeline" className={label}>
            Timeline
          </label>
          <select id="timeline" name="timeline" defaultValue="" className={`mt-2 ${field}`}>
            <option value="">Not sure yet</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="requirement" className={label}>
            Tell us about the problem
          </label>
          <textarea
            id="requirement"
            name="requirement"
            rows={6}
            placeholder="What are you trying to build, improve, automate or solve?"
            aria-invalid={errors.requirement ? true : undefined}
            className={`mt-2 ${field}`}
          />
          <p className="mt-2 text-sm text-ink-muted">
            You don&rsquo;t need to know the technology. Describe the situation and we&rsquo;ll work
            out what fits.
          </p>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="btn-gradient group mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Start the conversation"}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
