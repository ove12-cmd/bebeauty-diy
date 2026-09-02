"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { trackMeta } from "@/lib/meta-pixel";

const PIXEL_ID = "3246042772233645";

/**
 * Only loads fbevents.js once the cookie banner has been accepted. No
 * <noscript> fallback pixel — that's plain HTML and would fire unconditionally,
 * bypassing the consent gate entirely for no-JS visitors.
 * Also skipped on /dashboard — the internal orders admin shouldn't feed
 * PageView hits into the ad account's conversion/audience data.
 */
export default function MetaPixel() {
  const consented = useCookieConsent();
  const pathname = usePathname();

  // next/script runs the snippet below exactly once, so its inline PageView
  // only covers the route the pixel loaded on. Without this, a client-side
  // navigation is invisible to Meta and URL-based retargeting audiences only
  // ever see landing pages.
  const loadedOn = useRef<string | null>(null);
  useEffect(() => {
    if (!consented || !pathname || pathname.startsWith("/dashboard")) return;
    if (loadedOn.current === null) {
      loadedOn.current = pathname; // the inline snippet already counted this one
      return;
    }
    if (loadedOn.current === pathname) return;
    trackMeta("PageView");
  }, [consented, pathname]);

  if (!consented || pathname?.startsWith("/dashboard")) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
