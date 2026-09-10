import type { Metadata } from "next";
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
  const t = await getTranslations({ locale, namespace: "guideMeta" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: getPathname({ href: "/guide", locale: locale as Locale }),
      languages: {
        en: `${BASE_URL}${getPathname({ href: "/guide", locale: "en" })}`,
        et: `${BASE_URL}${getPathname({ href: "/guide", locale: "et" })}`,
      },
    },
    openGraph: {
      title: `${t("ogTitle")} | beBeauty DIY`,
      description: t("ogDescription"),
      url: `${BASE_URL}${getPathname({ href: "/guide", locale: locale as Locale })}`,
      type: "article",
    },
  };
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
