import { NextRequest, NextResponse } from "next/server";
import { priceOrder, type IncomingItem } from "@/lib/pricing";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  items: IncomingItem[];
  discountPct?: number;
  delivery: string;
  contact: { name: string; email: string; phone: string };
  locker?: string | null;
  address?: { street: string; city: string; zip: string } | null;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { contact } = body;
  if (!contact?.name || !contact?.email) {
    return NextResponse.json({ error: "Missing contact details" }, { status: 400 });
  }

  // Recompute every total server-side from canonical prices.
  let priced;
  try {
    priced = priceOrder({ items: body.items, discountPct: body.discountPct, delivery: body.delivery });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  if (body.delivery === "omniva" && !body.locker) {
    return NextResponse.json({ error: "Missing parcel locker" }, { status: 400 });
  }
  if (body.delivery === "courier" && !body.address?.street) {
    return NextResponse.json({ error: "Missing delivery address" }, { status: 400 });
  }

  const deliveryText =
    body.delivery === "omniva"
      ? `Pakiautomaat: ${body.locker}`
      : `Kuller: ${[body.address?.street, body.address?.city, body.address?.zip].filter(Boolean).join(", ")}`;

  const reference = "BB-" + Date.now().toString().slice(-8);
  const itemsJson = JSON.stringify(
    priced.lines.map((l) => ({ name: l.name, quantity: l.qty, finalPrice: l.unitPrice }))
  ).slice(0, 490);

  try {
    const intent = await stripe().paymentIntents.create({
      amount: Math.round(priced.grandTotal * 100),
      currency: "eur",
      payment_method_types: ["card"],
      receipt_email: contact.email,
      description: `beBeauty DIY ${reference}`,
      metadata: {
        reference,
        customerName: contact.name,
        customerEmail: contact.email,
        customerPhone: contact.phone,
        delivery: deliveryText,
        discountPct: String(priced.discountPct),
        itemsJson,
      },
    });

    if (!intent.client_secret) throw new Error("PaymentIntent missing client_secret");
    return NextResponse.json({
      clientSecret: intent.client_secret,
      reference,
      amount: priced.grandTotal,
    });
  } catch (err) {
    console.error("[checkout] Stripe PaymentIntent failed:", err);
    return NextResponse.json({ error: "Payment provider error" }, { status: 502 });
  }
}
