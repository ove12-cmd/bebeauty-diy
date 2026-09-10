"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type FaqAccordionItem = {
  id: string | number;
  question: string;
  answer: string;
  /** Small decorative avatar shown beside the answer bubble. Optional. */
  icon?: ReactNode;
  /** Which side of the answer bubble the icon sits on. Defaults to "left". */
  iconPosition?: "left" | "right";
};

type FaqAccordionProps = {
  data: FaqAccordionItem[];
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
  /** Small caption shown under an open answer, e.g. a "last updated" note. */
  timestamp?: string;
};

/**
 * A chat-style FAQ list: each question is a tappable bubble, and its answer
 * opens beneath it as a reply bubble (dark, right-aligned) — mirrors the
 * site's own black-and-gold nav/CTA identity instead of a generic light
 * secondary tone, so it reads as this site's chat, not a stock template's.
 */
export function FaqAccordion({
  data,
  className = "",
  questionClassName = "",
  answerClassName = "",
  timestamp,
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<FaqAccordionItem["id"] | null>(() => data[0]?.id ?? null);

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {data.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className={cx(
                "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-[14.5px] font-semibold tracking-[-0.01em] transition-colors duration-150",
                isOpen
                  ? "border-[var(--bb-gold-line)] bg-[var(--bb-gold-tint)] text-[var(--bb-gold-deep)]"
                  : "border-[var(--bb-chip-border)] bg-[var(--bb-chip-bg)] text-[var(--bb-ink)] hover:border-[var(--bb-gold-line)]",
                questionClassName,
              )}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cx(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen ? "rotate-180 text-[var(--bb-gold-deep)]" : "text-[var(--bb-ink-3)]",
                )}
              />
            </button>

            {isOpen && (
              <div className="flex items-end justify-end gap-2 pr-1 animate-[bbFaqReplyIn_0.2s_ease-out_both]">
                {item.icon && item.iconPosition === "left" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bb-gold-tint)] text-[14px]">
                    {item.icon}
                  </span>
                )}
                <div className="flex max-w-[85%] flex-col items-end gap-1">
                  <div
                    className={cx(
                      "rounded-2xl rounded-tr-md bg-[var(--bb-ink)] px-4 py-3 text-[13.5px] leading-relaxed text-white",
                      answerClassName,
                    )}
                  >
                    {item.answer}
                  </div>
                  {timestamp && (
                    <span className="pr-1 text-[10.5px] text-[var(--bb-ink-3)]">{timestamp}</span>
                  )}
                </div>
                {item.icon && item.iconPosition !== "left" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bb-gold-tint)] text-[14px]">
                    {item.icon}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
