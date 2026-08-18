import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendOrderEmails, type OrderEmailItem } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const META_PIXEL_ID = "3246042772233645";
const META_API_VERSION = "v21.0";

// Stripe amounts are in the smallest unit for the currency — a cent for
// EUR, but these currencies have no minor unit at all (already major units).
const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF",
  "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
]);

function stripeAmountToMajorUnits(amount: number, currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? amount : amount / 100;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

// Fires the server-side half of the Purchase event. event_id matches the
// eventID the browser used (paymentIntent.id), so Meta dedups the two into
// a single conversion instead of double-counting. No-ops (with a warning)
// if META_CAPI_TOKEN isn't set — same "degrade gracefully" pattern as the
// order-email helper.
async function sendMetaPurchaseCapi(pi: Stripe.PaymentIntent, reference: string): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.warn("[webhook] META_CAPI_TOKEN missing — skipping Meta CAPI Purchase for", reference);
    return;
  }

  const md = pi.metadata ?? {};
  const value = (pi.amount_received ?? pi.amount ?? 0) / 100;
  const contentIds = md.contentIds ? md.contentIds.split(",").filter(Boolean) : [];
  const email = (pi.receipt_email ?? md.customerEmail ?? "").trim().toLowerCase();
  const phoneDigits = (md.customerPhone ?? "").replace(/\D/g, "");

  const userData: Record<string, string> = {};
  if (email) userData.em = sha256(email);
  if (phoneDigits) userData.ph = sha256(phoneDigits);
  if (md.clientIp) userData.client_ip_address = md.clientIp;
  if (md.clientUa) userData.client_user_agent = md.clientUa;
  if (md.fbp) userData.fbp = md.fbp;
  if (md.fbc) userData.fbc = md.fbc;

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: pi.created,
            event_id: pi.id,
            action_source: "website",
            user_data: userData,
            custom_data: {
              value,
              currency: "EUR",
              content_ids: contentIds,
              content_type: "product",
              order_id: reference || pi.id,
            },
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    console.error("[webhook] Meta CAPI request failed:", res.status, await res.text());
  }
}

type GA4Item = { item_id: string; item_name: string; price: number; quantity: number };

// Fires the "purchase" event via GA4's Measurement Protocol. This — not the
// browser — is the only place Purchase fires, since a card requiring 3-D
// Secure/SCA takes the buyer off-site and a browser-only event would miss
// them. transaction_id = the PaymentIntent id, so a Stripe webhook retry
// re-sends the identical id and GA4's own dedup keeps it a single purchase.
// No-ops (with a warning) if GA4_API_SECRET isn't set, or if there's no
// ga_client_id on the PaymentIntent — never invent a fallback client_id,
// an unattributed hit is worse than no hit.
async function sendGA4Purchase(pi: Stripe.PaymentIntent, reference: string): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;
  const measurementId = process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!apiSecret || !measurementId) {
    console.warn("[webhook] GA4_API_SECRET/measurement id missing — skipping GA4 purchase for", reference);
    return;
  }

  const md = pi.metadata ?? {};
  const clientId = md.gaClientId;
  if (!clientId) {
    console.warn("[webhook] no ga_client_id on PaymentIntent — skipping GA4 purchase for", reference);
    return;
  }

  const currency = (pi.currency || "eur").toUpperCase();
  const value = stripeAmountToMajorUnits(pi.amount_received ?? pi.amount ?? 0, currency);

  // Rebuilt from the same itemsJson/contentIds the order email already
  // uses — no separate ga_items metadata field to keep under the 500-char cap.
  let items: GA4Item[] = [];
  try {
    const parsedItems = md.itemsJson
      ? (JSON.parse(md.itemsJson) as { name: string; quantity: number; finalPrice: number }[])
      : [];
    const ids = md.contentIds ? md.contentIds.split(",").filter(Boolean) : [];
    items = parsedItems.map((it, i) => ({
      item_id: ids[i] || `item_${i}`,
      item_name: it.name,
      price: it.finalPrice,
      quantity: it.quantity,
    }));
  } catch {
    /* ignore malformed metadata — purchase still fires without item detail */
  }

  const params: Record<string, unknown> = { currency, value, transaction_id: pi.id, items };
  if (md.gaSessionId) params.session_id = md.gaSessionId;

  // The /debug/mp/collect endpoint only validates a payload, it never
  // records real data — GA4_DEBUG must not be left on in production or
  // purchases will silently stop showing up in reports.
  const debug = process.env.GA4_DEBUG === "1";
  const base = debug
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect";

  const res = await fetch(`${base}?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      events: [{ name: "purchase", params }],
    }),
  });

  if (!res.ok) {
    console.error("[webhook] GA4 Measurement Protocol request failed:", res.status, await res.text());
  } else if (debug) {
    console.log("[webhook] GA4 debug validation:", await res.text());
  }
}

// Stripe calls this server-to-server. This — not the browser — is the
// trustworthy signal that the card was actually charged.
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const raw = await req.text(); // raw body required for signature verification

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true });
  }

  const pi = event.data.object as Stripe.PaymentIntent;
  const md = pi.metadata ?? {};

  try {
    let items: OrderEmailItem[] | undefined;
    try {
      items = md.itemsJson ? (JSON.parse(md.itemsJson) as OrderEmailItem[]) : undefined;
    } catch {
      /* ignore malformed metadata */
    }

    await sendOrderEmails({
      reference: md.reference || pi.id,
      grandTotal: (pi.amount_received ?? pi.amount ?? 0) / 100,
      currency: (pi.currency ?? "eur").toUpperCase(),
      customerName: md.customerName,
      customerEmail: pi.receipt_email ?? md.customerEmail ?? undefined,
      customerPhone: md.customerPhone,
      delivery: md.delivery,
      items,
    });
  } catch (err) {
    console.error("[webhook] email step failed:", err);
    // Still 200 — payment is valid; don't trigger endless Stripe retries.
  }

  try {
    await sendMetaPurchaseCapi(pi, md.reference || pi.id);
  } catch (err) {
    console.error("[webhook] Meta CAPI step failed:", err);
    // Still 200 — same reasoning as the email step above.
  }

  try {
    await sendGA4Purchase(pi, md.reference || pi.id);
  } catch (err) {
    console.error("[webhook] GA4 step failed:", err);
    // Still 200 — same reasoning as the email step above.
  }

  return NextResponse.json({ received: true });
}
