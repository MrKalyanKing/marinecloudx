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

import { useId, useState } from "react";

import { cx } from "@/features/marketing/components/layout";
import { BUDGET_CURRENCY, budgetOptions, timelineOptions } from "@/lib/config/brand";

interface FieldErrors {
  [path: string]: string;
}

/**
 * Which environment the form is sitting in.
 *
 * `paper` is the contact page — ink on a near-white canvas. `brand` is the same
 * form opened inside the closing CTA, where the surface underneath is the
 * saturated violet gradient and every colour has to invert.
 *
 * A variant rather than a second component, because the half worth getting
 * right — the payload shape, the budget mapping, the error paths, the guard
 * against double submission — is identical in both places and must not be
 * maintained twice.
 */
export type ContactFormVariant = "paper" | "brand";

/*
 * No `sourceSlug` is sent. Attribution is pinned server-side to the website
 * form, so a crafted request cannot claim the enquiry arrived through a paid
 * campaign or a referral partner.
 */
export function ContactForm({
  services,
  variant = "paper",
  compact = false,
  onSubmitted,
}: {
  services: { id: string; name: string }[];
  variant?: ContactFormVariant;
  /**
   * Drops the row that is nice to have but not needed to start a conversation.
   *
   * The inline CTA form is read in the flow of a page rather than arrived at
   * deliberately, and a nine-field form appearing under a button is a wall.
   * Nothing is lost: the omitted fields are optional server-side, and the
   * contact page still asks for all of them.
   */
  compact?: boolean;
  /** Lets a host panel react to a successful send — resizing, scrolling. */
  onSubmitted?: () => void;
}) {
  const onBrand = variant === "brand";

  /**
   * Namespaces every `id` to this instance.
   *
   * The ids used to be bare (`name`, `email`, `budget`). That was safe while
   * the form existed on exactly one route, and stops being safe the moment the
   * closing CTA can open a second copy — duplicate ids make `htmlFor` bind to
   * whichever element the browser finds first, so clicking a label in the
   * second form focuses a field in the first. `useId` is stable across the
   * server render and hydration, which `Math.random()` would not be.
   */
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

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
      onSubmitted?.();
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
        className={cx(
          "max-w-xl p-8",
          onBrand ? "rounded-[22px] border border-white/25 bg-white/12 backdrop-blur-xl" : "glass-strong",
        )}
      >
        <p className={cx("tech-label", onBrand ? "text-white/70" : "text-brand")}>Received</p>
        <p className={cx("mt-4 text-h2 font-semibold", onBrand ? "text-white" : "text-ink")}>
          We&rsquo;ve got it.
        </p>
        <p className={cx("mt-4", onBrand ? "text-white/75" : "text-ink-muted")}>
          Thanks for reaching out to MarineCloudX. We&rsquo;ve received your requirement and will review
          it before getting back to you.
        </p>
      </div>
    );
  }

  const field = onBrand
    ? "field-liquid px-4 py-3"
    : "field-glass px-4 py-3 text-ink placeholder:text-ink-muted/60";

  const label = cx("block text-sm font-medium", onBrand ? "text-white/85" : "text-ink");

  const required = onBrand ? "text-white/60" : "text-brand";

  const hint = cx("mt-2 text-sm", onBrand ? "text-white/60" : "text-ink-muted");

  // Field-level validation text has to clear contrast on whichever surface it
  // lands on. `text-red-700` is unreadable on the violet gradient, so the brand
  // variant uses a light rose that holds up over it.
  const errorText = cx("mt-1.5 text-sm", onBrand ? "text-rose-100" : "text-red-700");

  return (
    <form onSubmit={handleSubmit} noValidate className={onBrand ? "w-full" : "max-w-2xl"}>
      {formError ? (
        <p
          role="alert"
          className={cx(
            "mb-6 rounded-2xl px-4 py-3 text-sm backdrop-blur-sm",
            onBrand
              ? "border border-rose-200/40 bg-rose-500/20 text-rose-50"
              : "border border-red-300/60 bg-red-50/80 text-red-800",
          )}
        >
          {formError}
        </p>
      ) : null}

      <fieldset disabled={isPending} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>

        <div className={compact ? undefined : "sm:col-span-2"}>
          <label htmlFor={fid("name")} className={label}>
            Name <span className={required}>*</span>
          </label>
          <input
            id={fid("name")}
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={errors["contact.firstName"] ? true : undefined}
            aria-describedby={errors["contact.firstName"] ? fid("name-error") : undefined}
            className={"mt-2 " + field}
          />
          {errors["contact.firstName"] ? (
            <p id={fid("name-error")} className={errorText}>
              {errors["contact.firstName"]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fid("email")} className={label}>
            Email <span className={required}>*</span>
          </label>
          <input
            id={fid("email")}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={errors["contact.email"] ? true : undefined}
            aria-describedby={errors["contact.email"] ? fid("email-error") : undefined}
            className={"mt-2 " + field}
          />
          {errors["contact.email"] ? (
            <p id={fid("email-error")} className={errorText}>
              {errors["contact.email"]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fid("phone")} className={label}>
            Phone / WhatsApp
          </label>
          <input
            id={fid("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
            aria-invalid={errors["contact.phone"] ? true : undefined}
            aria-describedby={errors["contact.phone"] ? fid("phone-error") : undefined}
            className={"mt-2 " + field}
          />
          {errors["contact.phone"] ? (
            <p id={fid("phone-error")} className={errorText}>
              {errors["contact.phone"]}
            </p>
          ) : null}
        </div>

        {/* Company and budget are the first things to go in the compact form:
            both are optional, and neither changes how a first reply is written. */}
        {compact ? null : (
          <>
            <div className="sm:col-span-2">
              <label htmlFor={fid("company")} className={label}>
                Company / business name
              </label>
              <input
                id={fid("company")}
                name="company"
                autoComplete="organization"
                className={"mt-2 " + field}
              />
            </div>

            <div>
              <label htmlFor={fid("budget")} className={label}>
                Budget
              </label>
              <select id={fid("budget")} name="budget" defaultValue="" className={"mt-2 " + field}>
                {budgetOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor={fid("serviceId")} className={label}>
            What do you need?
          </label>
          {/* Options come from the published CMS services, so the enquiry links
              to a real service record the CRM can filter on. */}
          <select id={fid("serviceId")} name="serviceId" defaultValue="" className={"mt-2 " + field}>
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className={compact ? undefined : "sm:col-span-2"}>
          <label htmlFor={fid("timeline")} className={label}>
            Timeline
          </label>
          <select id={fid("timeline")} name="timeline" defaultValue="" className={"mt-2 " + field}>
            <option value="">Not sure yet</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fid("requirement")} className={label}>
            Tell us about the problem
          </label>
          <textarea
            id={fid("requirement")}
            name="requirement"
            rows={compact ? 4 : 6}
            placeholder="What are you trying to build, improve, automate or solve?"
            aria-invalid={errors.requirement ? true : undefined}
            className={"mt-2 " + field}
          />
          <p className={hint}>
            You don&rsquo;t need to know the technology. Describe the situation and we&rsquo;ll work
            out what fits.
          </p>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className={cx(
          "group mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium disabled:opacity-60",
          onBrand ? "cta-band__btn" : "btn-gradient",
        )}
      >
        {isPending ? "Sending…" : "Start the conversation"}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
