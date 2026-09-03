import { PAYMENT_METHODS } from "@/lib/payment-methods";

type Props = {
  /**
   * `default` reads on the site's paper surfaces; `inverse` is the
   * translucent treatment for dark surfaces like the footer.
   */
  tone?: "default" | "inverse";
  /**
   * `spread` pushes the badges to the far end of the row (the checkout's
   * pay-step layout); `group` keeps them next to the note.
   */
  layout?: "group" | "spread";
  /** Reassurance text shown beside the badges. Omit for badges only. */
  note?: string;
  /** Padlock before the note. Only meaningful with a note. */
  showLock?: boolean;
  className?: string;
};

const TONE = {
  default: {
    root: "text-[var(--bb-ink-2)]",
    badge:
      "border border-[var(--bb-chip-border)] bg-[var(--bb-chip-bg)] px-2 py-[3px] text-[10.5px]",
  },
  inverse: {
    root: "text-white/50",
    badge: "bg-white/[0.07] px-2.5 py-1 text-[11px]",
  },
} as const;

/**
 * The accepted-payment-method badges. One source of truth for every place
 * that reassures a buyer about payment — the checkout pay step, the product
 * page buy box and the footer — so the list can never drift between them.
 */
export default function PaymentMethods({
  tone = "default",
  layout = "group",
  note,
  showLock = true,
  className = "",
}: Props) {
  const styles = TONE[tone];

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-[12.5px] font-semibold ${styles.root} ${className}`}
    >
      {note && (
        <span className="inline-flex items-center gap-1.5">
          {showLock && (
            <svg
              aria-hidden="true"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          {note}
        </span>
      )}
      <ul
        aria-label="Aktsepteeritud makseviisid"
        className={`flex list-none flex-wrap items-center gap-1.5 p-0 ${
          layout === "spread" ? "ms-auto" : ""
        }`}
      >
        {PAYMENT_METHODS.map((method) => (
          <li
            key={method.id}
            className={`rounded-md font-bold tracking-[0.02em] ${styles.badge}`}
          >
            {method.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
