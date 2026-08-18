"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { GA_MEASUREMENT_ID } from "@/lib/ga4";

/**
 * Only loads gtag.js once the cookie banner has been accepted — this site's
 * CookieBanner records the choice in localStorage but nothing previously
 * read it, so analytics would otherwise fire regardless of Accept/Decline.
 * Also skipped on /dashboard — that's the internal orders admin, not a page
 * that should ever show up in customer-traffic analytics.
 */
export default function GoogleAnalytics() {
  const consented = useCookieConsent();
  const pathname = usePathname();

  if (!consented || pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
