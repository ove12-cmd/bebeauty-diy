"use client";

import Script from "next/script";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const GA_MEASUREMENT_ID = "G-Z8Z9HJGYVW";

/**
 * Only loads gtag.js once the cookie banner has been accepted — this site's
 * CookieBanner records the choice in localStorage but nothing previously
 * read it, so analytics would otherwise fire regardless of Accept/Decline.
 */
export default function GoogleAnalytics() {
  const consented = useCookieConsent();

  if (!consented) return null;

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
