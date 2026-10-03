import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isVacationActive } from "@/lib/vacation";

/**
 * Site-wide pre-order notice for the holiday window. Deliberately not
 * dismissible — the dispatch date is material to the purchase, so it stays
 * visible right up to checkout.
 */
export default function VacationBanner() {
  const t = useTranslations("vacation");
  if (!isVacationActive()) return null;

  return (
    <div className="bg-[var(--bb-ink)] px-4 py-2.5 text-center text-[13px] leading-snug text-[#faf7f0]">
      {t.rich("banner", {
        link: (chunks) => (
          <Link href="/tooth-gem-kit" className="font-semibold text-[var(--bb-gold-2)] underline underline-offset-2">
            {chunks}
          </Link>
        ),
      })}
    </div>
  );
}
