"use client";

/**
 * FAQ accordion.
 *
 * Uses real `<button>` elements with `aria-expanded` and `aria-controls`, and
 * panels labelled back by `aria-labelledby` — so it is operable by keyboard and
 * announced correctly, rather than being a clickable div.
 *
 * Multiple panels may be open at once: these are reference answers people scan,
 * not a wizard, and forcing one closed to read another is friction.
 *
 * The only animation is the chevron rotating. Height animation on arbitrary
 * content is janky and buys nothing here.
 */

import { useId, useState } from "react";

import { cx } from "@/features/marketing/components/layout";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function FaqAccordion({
  items,
  tone = "paper",
}: {
  items: FaqItem[];
  tone?: "paper" | "dark";
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const baseId = useId();
  const dark = tone === "dark";

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <div
      className={cx(
        "divide-y border-y",
        dark ? "divide-white/10 border-white/10" : "divide-hairline-light border-hairline-light",
      )}
    >
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const buttonId = `${baseId}-button-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-start gap-5 py-6 text-left"
              >
                <span
                  className={cx(
                    "tech-label mt-1.5 shrink-0",
                    dark ? "text-brand-bright" : "text-brand",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={cx(
                    "flex-1 text-h3 font-medium transition-colors",
                    dark
                      ? "text-light group-hover:text-brand-bright"
                      : "text-ink group-hover:text-brand",
                  )}
                >
                  {item.question}
                </span>

                <span
                  aria-hidden="true"
                  className={cx(
                    "mt-1 shrink-0 transition-transform duration-200",
                    dark ? "text-light-muted" : "text-ink-muted",
                    isOpen && "rotate-45",
                  )}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-7 pl-[3.25rem]"
            >
              <p
                className={cx(
                  "max-w-2xl whitespace-pre-wrap",
                  dark ? "text-light-muted" : "text-ink-muted",
                )}
              >
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
