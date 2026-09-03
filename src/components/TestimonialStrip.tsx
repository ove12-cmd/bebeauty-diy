import Stars from "@/components/ui/Stars";
import { STRIP_REVIEWS } from "@/lib/reviews";

/**
 * Compact quote row for high on the page, directly under the stats bar. The
 * full, paginated reviews section still lives further down at #arvustused —
 * this is the short version a skimmer reads on the way to the buy button.
 */
export default function TestimonialStrip() {
  return (
    <ul className="mx-auto grid w-full max-w-[1100px] list-none grid-cols-1 gap-3 px-5 py-6 sm:grid-cols-3">
      {STRIP_REVIEWS.map((r) => (
        <li
          key={r.name}
          className="rounded-xl border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] p-4"
        >
          <Stars rating={r.rating} label={`Hinnang ${r.rating} / 5`} />
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--bb-ink-2)]">
            {r.text}
          </p>
          <p className="mt-1.5 text-[11px] text-[var(--bb-ink-3)]">
            {r.name} · {r.date}
          </p>
        </li>
      ))}
    </ul>
  );
}
