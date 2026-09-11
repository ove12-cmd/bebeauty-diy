import { Link } from "@/i18n/navigation";
import SocialIcon from "@/components/ui/SocialIcon";
import { COMPANY } from "@/lib/company";
import { useTranslations } from "next-intl";

/**
 * Reassurance footer for the checkout: who the buyer is paying, how to reach
 * a human, and the policies they may want to read before committing.
 */
export default function CheckoutTrustFooter() {
  const t = useTranslations("checkoutTrustFooter");
  const LINKS = [
    { key: "terms", href: "/terms" as const, label: t("terms") },
    { key: "faq", href: { pathname: "/tooth-gem-kit" as const, hash: "faq" }, label: t("faq") },
  ];

  return (
    <div className="mt-5 flex flex-wrap items-start justify-between gap-x-5 gap-y-2 border-t border-[var(--bb-line)] py-3.5 text-[10px] leading-relaxed">
      <div className="text-[var(--bb-ink-3)]">
        <div className="font-medium text-[var(--bb-ink-2)]">{COMPANY.name}</div>
        <a className="underline hover:no-underline" href={`mailto:${COMPANY.orderEmail}`}>
          {COMPANY.orderEmail}
        </a>
        <div className="mt-0.5 flex flex-wrap gap-x-3">
          {COMPANY.socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline hover:no-underline"
            >
              <SocialIcon network={s.network} />
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <ul className="list-none p-0 text-right leading-loose text-[var(--bb-gold-deep)]">
        {LINKS.map((l) => (
          <li key={l.key}>
            <Link href={l.href} className="underline hover:no-underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
