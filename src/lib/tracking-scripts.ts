export type TrackingScriptLocation = "head" | "body-start" | "body-end";

export type TrackingScript = {
  id: string;
  name: string;
  location: TrackingScriptLocation;
  code: string;
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
    code: "src/components/GoogleAnalytics.tsx — gtag.js, gated behind cookie consent, skipped on /dashboard.",
  },
  {
    id: "meta-pixel",
    name: "Meta Pixel — 3246042772233645",
    location: "head",
    code: "src/components/MetaPixel.tsx — fbevents.js + SPA PageView tracking, gated behind cookie consent, skipped on /dashboard.",
  },
  {
    id: "ms-clarity",
    name: "Microsoft Clarity — xx71xy0xth",
    location: "head",
    code: "src/app/[locale]/layout.tsx:44 — inline clarity.ms loader. NOT gated behind cookie consent (unlike GA4/Meta Pixel above).",
  },
];
