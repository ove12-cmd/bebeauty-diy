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
  const t = await getTranslations({ locale, namespace: "shopMeta" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: getPathname({ href: "/tooth-gem-kit", locale: locale as Locale }),
      languages: {
        en: `${BASE_URL}${getPathname({ href: "/tooth-gem-kit", locale: "en" })}`,
        et: `${BASE_URL}${getPathname({ href: "/tooth-gem-kit", locale: "et" })}`,
      },
    },
    openGraph: {
      title: `${title} | beBeauty DIY`,
      description,
      url: `${BASE_URL}${getPathname({ href: "/tooth-gem-kit", locale: locale as Locale })}`,
      type: "website",
    },
  };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
