// Structured-data (JSON-LD) builders. Keep all schema shapes here.
import { COMPANY } from "@/lib/company";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const BASE_URL = "https://bebeauty-diy.ee";

// Resolves one of routing.ts's `pathnames` keys to a full, locale-correct
// absolute URL (e.g. "/tooth-gem-kit" + "et" -> ".../et/hambakristalli-komplekt").
// Callers building JSON-LD or breadcrumb paths should go through this
// instead of hand-writing a slug, so schema URLs can never drift from the
// routes next-intl actually serves.
export function localizedUrl(locale: Locale, href: Parameters<typeof getPathname>[0]["href"]): string {
  return `${BASE_URL}${getPathname({ href, locale })}`;
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "beBeauty DIY",
  url: BASE_URL,
  logo: `${BASE_URL}/icon.svg`,
  // Derived from COMPANY.socials so the schema can never claim a profile
  // the shop does not actually have.
  sameAs: COMPANY.socials.map((s) => s.url),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "beBeauty DIY",
  url: BASE_URL,
};

// name/description arrive already resolved to the page's locale — the
// caller (a Server Component) reads them via getTranslations before
// building this object. This function stays a plain, translation-agnostic
// builder so it's usable from anywhere without pulling in next-intl.
export function productSchema({
  locale,
  price,
  currency = "EUR",
  name,
  description,
}: {
  locale: Locale;
  price: number;
  currency?: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [`${BASE_URL}/product%20package%20v3.png`, `${BASE_URL}/home/gallery/4.png`],
    brand: { "@type": "Brand", name: "beBeauty DIY" },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: String(price),
      availability: "https://schema.org/InStock",
      url: localizedUrl(locale, "/tooth-gem-kit"),
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// `items` paths must already be locale-resolved (via localizedUrl or
// next-intl's getPathname) by the caller — this builder just assembles the
// schema shape from whatever paths it's given.
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE_URL}${it.path}`,
    })),
  };
}
