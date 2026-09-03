import Stars from "@/components/ui/Stars";
import { COMPANY } from "@/lib/company";
import { AVERAGE_RATING, REVIEW_COUNT, formatRating } from "@/lib/reviews";

/**
 * Rating + volume pill for above a hero heading. Both numbers come from the
 * shared sources — the rating is computed from the reviews on display, so it
 * can't contradict what the reviews section shows.
 */
export default function TrustBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href="/hambakristalli-komplekt#arvustused"
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--bb-chip-border)] bg-[var(--bb-chip-bg)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--bb-ink-2)] no-underline transition-colors hover:border-[var(--bb-gold)] ${className}`}
    >
      <Stars rating={AVERAGE_RATING} label={`Keskmine hinnang ${formatRating(AVERAGE_RATING)} viiest`} />
      <span>
        {formatRating(AVERAGE_RATING)} · {REVIEW_COUNT} arvustust
      </span>
      <span aria-hidden="true" className="text-[var(--bb-chip-border)]">
        |
      </span>
      <span>{COMPANY.kitsSoldLabel}</span>
    </a>
  );
}
