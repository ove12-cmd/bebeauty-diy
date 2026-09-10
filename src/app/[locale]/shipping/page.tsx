import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { BASE_URL } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shippingPage" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: getPathname({ href: "/shipping", locale: locale as Locale }),
      languages: {
        en: `${BASE_URL}${getPathname({ href: "/shipping", locale: "en" })}`,
        et: `${BASE_URL}${getPathname({ href: "/shipping", locale: "et" })}`,
      },
    },
  };
}

export default async function ShippingPage() {
  const t = await getTranslations("shippingPage");
  const mail = (chunks: React.ReactNode) => <a href="mailto:iluinfo1@gmail.com">{chunks}</a>;
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">{t("backLabel")}</Link>
        <h1 className="bb-legal__title">{t("title")}</h1>
        <p className="bb-legal__date">{t("lastUpdated")}</p>

        <h2>{t("shippingHeading")}</h2>
        <div className="bb-legal__table">
          <div className="bb-legal__row">
            <span>{t("rowEstoniaLabel")}</span>
            <span>{t.rich("rowEstoniaValue", { strong })}</span>
          </div>
          <div className="bb-legal__row">
            <span>{t("rowBalticLabel")}</span>
            <span>{t("rowBalticValue")}</span>
          </div>
          <div className="bb-legal__row">
            <span>{t("rowFinlandLabel")}</span>
            <span>{t("rowFinlandValue")}</span>
          </div>
          <div className="bb-legal__row">
            <span>{t("rowRestLabel")}</span>
            <span>{t("rowRestValue")}</span>
          </div>
        </div>
        <p>{t.rich("sameDayNote", { strong })}</p>

        <h2>{t("returnsHeading")}</h2>
        <p>{t("returnsText")}</p>
        <p>{t.rich("returnsCta", { mail })}</p>

        <h2>{t("refundsHeading")}</h2>
        <p>{t("refundsText")}</p>

        <h2>{t("questionsHeading")}</h2>
        <p>{t.rich("questionsCta", { mail })}</p>
      </div>
    </main>
  );
}
