import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderItem = { name: string; quantity: number; finalPrice: number };

// Looks up a PaymentIntent by id to render the order confirmation. The id is
// an unguessable Stripe identifier (not sequential), so this is safe to expose
// without further auth — same trust model as a Stripe client_secret.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id?.startsWith("pi_")) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const pi = await stripe().paymentIntents.retrieve(id);
    if (pi.status !== "succeeded") {
      return NextResponse.json({ error: "Order not paid" }, { status: 404 });
    }

    const md = pi.metadata ?? {};
    let items: OrderItem[] = [];
    try {
      items = md.itemsJson ? JSON.parse(md.itemsJson) : [];
    } catch {
      /* ignore malformed metadata */
    }

    return NextResponse.json({
      reference: md.reference || pi.id,
      currency: (pi.currency ?? "eur").toUpperCase(),
      items,
      subtotal: Number(md.subtotal) || 0,
      discountPct: Number(md.discountPct) || 0,
      deliveryMethod: md.deliveryMethod || "",
      deliveryTarget: md.delivery || "",
      deliveryPrice: Number(md.deliveryPrice) || 0,
      grandTotal: (pi.amount_received ?? pi.amount ?? 0) / 100,
      customerName: md.customerName || "",
    });
  } catch (err) {
    console.error("[orders] retrieve failed:", err);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
