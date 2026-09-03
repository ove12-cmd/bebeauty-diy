const MAX = 5;
const GLYPHS = "★★★★★";

type Props = {
  /** 0-5, fractional allowed — 4.8 renders as 4.8 stars, not 5. */
  rating: number;
  /** Font size of the star glyphs. */
  size?: "sm" | "md";
  /**
   * Screen-reader text. Pass one whenever the rating isn't already stated in
   * adjacent text, so the stars aren't silent to assistive tech.
   */
  label?: string;
  className?: string;
};

/**
 * Star rating with a proportional fill: the gold layer is clipped to
 * rating/5 of the width, so an average of 4.8 shows as four full stars plus
 * most of a fifth rather than being rounded up to five. Whole ratings land
 * on exact star boundaries, so per-review stars stay crisp.
 */
export default function Stars({ rating, size = "sm", label, className = "" }: Props) {
  const pct = (Math.max(0, Math.min(MAX, rating)) / MAX) * 100;

  return (
    <span
      className={`inline-flex items-center leading-none ${
        size === "md" ? "text-sm" : "text-xs"
      } ${className}`}
    >
      {label ? <span className="sr-only">{label}</span> : null}
      <span aria-hidden="true" className="relative inline-block whitespace-nowrap">
        <span className="text-[var(--bb-gold-line)]">{GLYPHS}</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-[var(--bb-gold)]"
          style={{ width: `${pct}%` }}
        >
          {GLYPHS}
        </span>
      </span>
    </span>
  );
}
