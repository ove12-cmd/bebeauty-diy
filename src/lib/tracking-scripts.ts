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
 * still has to be added by hand in src/app/layout.tsx (Next.js won't
 * execute inline <script> content injected via dangerouslySetInnerHTML
 * on a plain element, only through next/script). Keep both in sync.
 */
export const TRACKING_SCRIPTS: TrackingScript[] = [];
