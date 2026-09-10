import { useLocale, useTranslations } from "next-intl";
import Stars from "@/components/ui/Stars";
import { COMPANY } from "@/lib/company";
import { AVERAGE_RATING, REVIEW_COUNT, formatRating } from "@/lib/reviews";
import { Link } from "@/i18n/navigation";

/**
 * Rating + volume pill for above a hero heading. Both numbers come from the
 * shared sources — the rating is computed from the reviews on display, so it
 * can't contradict what the reviews section shows. Stays a plain (non-async)
 * component — Hero.tsx, its only caller, is a Client Component, and a
 * Client Component can't directly render an async Server Component.
 * useLocale()/useTranslations() from the root "next-intl" package work in
 * both worlds.
 */
export default function TrustBadge({ className = "" }: { className?: string }) {
  const locale = useLocale() as "en" | "et";
  const t = useTranslations("trustBadge");
  const rating = formatRating(AVERAGE_RATING, locale);
  return (
    <Link
      href={{ pathname: "/tooth-gem-kit", hash: "reviews" }}
      className={`inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl sm:rounded-full border border-[var(--bb-chip-border)] bg-[var(--bb-chip-bg)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--bb-ink-2)] no-underline transition-colors hover:border-[var(--bb-gold)] ${className}`}
    >
      <Stars rating={AVERAGE_RATING} label={t("averageRating", { rating })} />
      <span>
        {t("reviews", { rating, count: REVIEW_COUNT })}{" "}
        <span className="text-[var(--bb-gold-deep)] underline">{t("see")}</span>
      </span>
      <span aria-hidden="true" className="text-[var(--bb-chip-border)]">
        |
      </span>
      <span>{t("kitsSold", { count: COMPANY.kitsSoldCount })}</span>
    </Link>
  );
}
