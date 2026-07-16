// Structured-data (JSON-LD) builders. Keep all schema shapes here.
export const BASE_URL = "https://bebeauty-diy.ee";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "beBeauty DIY",
  url: BASE_URL,
  logo: `${BASE_URL}/icon.svg`,
  sameAs: ["https://instagram.com/bebeauty.diy", "https://tiktok.com"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "beBeauty DIY",
  url: BASE_URL,
};

export function productSchema({ price, currency = "EUR" }: { price: number; currency?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "DIY Hambakristalli komplekt",
    description:
      "Kõik vajalik ühes komplektis, et paigaldada hambakristalle ise kodus. Preciosa & Primero kristallid, tugev sära ja hea püsivus.",
    image: [`${BASE_URL}/product%20package.jpg`, `${BASE_URL}/home/gallery/4.png`],
    brand: { "@type": "Brand", name: "beBeauty DIY" },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: String(price),
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/shop`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2400",
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
