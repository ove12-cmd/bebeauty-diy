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
