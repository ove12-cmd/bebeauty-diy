import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/hooks/useCart";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Everything that used to live directly in the root layout's <body> — moved
// here (not the root) because it needs the resolved locale, and because
// /dashboard and /api (siblings outside this segment) must never render any
// of it: the public Footer/cart UI, or the GA4/Meta/Clarity trackers, which
// already carried a `pathname.startsWith("/dashboard")` guard for exactly
// this reason before this restructure made it structural instead.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <GoogleAnalytics />
      <MetaPixel />
      <Script id="ms-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xx71xy0xth");
        `}
      </Script>
      <CartProvider>
        {children}
        <Footer />
        <CartDrawer />
        <CookieBanner />
      </CartProvider>
    </NextIntlClientProvider>
  );
}
