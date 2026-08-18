"use client";

// Client-side GA4 event helper + gtag client_id/session_id reader. Reuses
// the gtag() global that GoogleAnalytics.tsx already initializes (loaded
// only post-consent) — this file never touches that setup, it only fires
// additional events and reads ids through it. Mirrors lib/meta-pixel.ts.

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Z8Z9HJGYVW";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// GoogleAnalytics.tsx's <Script strategy="afterInteractive"> isn't
// guaranteed to run before other components' effects on the same page, so
// a plain `typeof window.gtag === "function"` check at call time can miss
// gtag entirely and silently drop the event. Poll briefly instead of
// checking once.
function waitForGtag(timeoutMs = 2000, intervalMs = 100): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (typeof window.gtag === "function") {
      resolve(true);
      return;
    }
    const start = Date.now();
    const check = () => {
      if (typeof window.gtag === "function") {
        resolve(true);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve(false);
        return;
      }
      setTimeout(check, intervalMs);
    };
    check();
  });
}

export function trackGA4(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  waitForGtag().then((ready) => {
    if (ready && window.gtag) window.gtag("event", eventName, params);
  });
}

export type GaIds = { clientId: string | null; sessionId: string | null };

/**
 * Reads GA4's own client_id/session_id via gtag's `get` API, so the
 * server-side purchase hit (sent later from the Stripe webhook, once the
 * buyer has left the browser entirely) attributes to the same user/session
 * as the client-side view_item/begin_checkout events. Resolves with nulls
 * — never a fabricated id — if gtag isn't loaded or doesn't answer in time
 * (ad blockers, consent not yet granted, script still loading).
 */
export async function getGaIds(timeoutMs = 1500): Promise<GaIds> {
  const ready = await waitForGtag(timeoutMs);
  if (!ready || typeof window === "undefined" || !window.gtag) {
    return { clientId: null, sessionId: null };
  }

  return new Promise((resolve) => {
    const result: GaIds = { clientId: null, sessionId: null };
    let settled = false;
    let pending = 2;

    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const timer = setTimeout(finish, 500);
    const done = () => {
      pending -= 1;
      if (pending === 0) {
        clearTimeout(timer);
        finish();
      }
    };

    window.gtag!("get", GA_MEASUREMENT_ID, "client_id", (id: string) => {
      result.clientId = id ?? null;
      done();
    });
    window.gtag!("get", GA_MEASUREMENT_ID, "session_id", (id: string) => {
      result.sessionId = id ?? null;
      done();
    });
  });
}
