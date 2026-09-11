"use client";

// Client-side Meta Pixel event helper. Reuses the fbq() global that
// MetaPixel.tsx already initializes (init + PageView) — this file never
// touches that setup, it only fires additional events through it.

export { CURRENCY } from "@/lib/pricing";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMeta(event: string, params: Record<string, unknown> = {}, eventId?: string): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) {
    window.fbq("track", event, params, { eventID: eventId });
  } else {
    window.fbq("track", event, params);
  }
}

// Fires the browser pixel event and a server-side Conversions API mirror
// with the same eventId, so Meta deduplicates them into one event instead of
// double-counting — same pattern the Stripe webhook already uses for
// Purchase, just triggered client-side since AddToCart/InitiateCheckout
// happen before any server round-trip (PaymentIntent) exists to hang a
// webhook off. `keepalive` keeps the request alive through a page
// navigation, since InitiateCheckout in particular fires right before one.
export function trackMetaWithCapi(event: string, params: Record<string, unknown> = {}): void {
  const eventId = crypto.randomUUID();
  trackMeta(event, params, eventId);
  fetch("/api/track/meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, eventId, customData: params }),
    keepalive: true,
  }).catch(() => {
    /* best-effort — the browser pixel event above already fired regardless */
  });
}
