export type TrackingScriptLocation = "head" | "body-start" | "body-end";

export type TrackingScript = {
  id: string;
  name: string;
  location: TrackingScriptLocation;
  code: string;
  source: string;
  /** ISO date this was last manually confirmed to actually fire on the live site. */
  verifiedAt?: string;
};

/**
 * Reference list only — shown read-only on /dashboard/tracking-codes.
 * Adding a script here does NOT make it run: the actual <Script> tag
 * still has to be added by hand in src/app/[locale]/layout.tsx (Next.js
 * won't execute inline <script> content injected via dangerouslySetInnerHTML
 * on a plain element, only through next/script). Keep both in sync.
 */
export const TRACKING_SCRIPTS: TrackingScript[] = [
  {
    id: "ga4",
    name: "Google Analytics (GA4) — G-Z8Z9HJGYVW",
    location: "head",
    source: "src/components/GoogleAnalytics.tsx — gated behind cookie consent, skipped on /dashboard.",
    code: `<script src="https://www.googletagmanager.com/gtag/js?id=G-Z8Z9HJGYVW"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-Z8Z9HJGYVW');
</script>`,
    verifiedAt: "2026-09-11",
  },
  {
    id: "meta-pixel",
    name: "Meta Pixel — 3246042772233645",
    location: "head",
    source: "src/components/MetaPixel.tsx — gated behind cookie consent, skipped on /dashboard, includes SPA PageView tracking on route change.",
    code: `<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '3246042772233645');
  fbq('track', 'PageView');
</script>`,
    verifiedAt: "2026-09-11",
  },
  {
    id: "ms-clarity",
    name: "Microsoft Clarity — xx71xy0xth",
    location: "head",
    source: "src/app/[locale]/layout.tsx:44 — NOT gated behind cookie consent (unlike GA4/Meta Pixel above).",
    code: `<script>
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "xx71xy0xth");
</script>`,
    verifiedAt: "2026-09-11",
  },
];
