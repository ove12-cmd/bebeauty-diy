import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendOrderEmails, type OrderEmailItem } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const META_PIXEL_ID = "3246042772233645";
const META_API_VERSION = "v21.0";

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

  return NextResponse.json({ received: true });
}
