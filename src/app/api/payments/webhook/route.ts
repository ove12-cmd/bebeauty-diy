import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendOrderEmails, type OrderEmailItem } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  return NextResponse.json({ received: true });
}
