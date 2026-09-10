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
  const t = await getTranslations({ locale, namespace: "termsPage" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: getPathname({ href: "/terms", locale: locale as Locale }),
      languages: {
        en: `${BASE_URL}${getPathname({ href: "/terms", locale: "en" })}`,
        et: `${BASE_URL}${getPathname({ href: "/terms", locale: "et" })}`,
      },
    },
  };
}

export default async function TermsPage() {
  const t = await getTranslations("termsPage");
  const mail = (chunks: React.ReactNode) => <a href="mailto:iluinfo1@gmail.com">{chunks}</a>;

  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">{t("backLabel")}</Link>
        <h1 className="bb-legal__title">{t("title")}</h1>
        <p className="bb-legal__date">{t("lastUpdated")}</p>

        <h2>{t("section1Heading")}</h2>
        <p>{t("section1Text")}</p>

        <h2>{t("section2Heading")}</h2>
        <p>{t("section2Text")}</p>

        <h2>{t("section3Heading")}</h2>
        <p>{t("section3Text")}</p>

        <h2>{t("section4Heading")}</h2>
        <p>{t("section4Text")}</p>

        <h2>{t("section5Heading")}</h2>
        <p>{t("section5Text")}</p>

        <h2>{t("section6Heading")}</h2>
        <p>{t.rich("section6Text", { mail })}</p>
      </div>
    </main>
  );
}
