import { NextRequest, NextResponse } from "next/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only funnel-step events without a natural server-side trigger of their own
// (no PaymentIntent exists yet) go through here — Purchase is sent straight
// from the Stripe webhook instead. Allowlisted so this can't be used as an
// open relay to post arbitrary event names (e.g. a fake Purchase) to Meta.
const ALLOWED_EVENTS = new Set(["AddToCart", "InitiateCheckout"]);

export async function POST(req: NextRequest) {
  let body: { event?: string; eventId?: string; customData?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, eventId, customData } = body;
  if (!event || !ALLOWED_EVENTS.has(event) || !eventId) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const clientUa = (req.headers.get("user-agent") || "").slice(0, 250);
  const fbp = req.cookies.get("_fbp")?.value || "";
  const fbc = req.cookies.get("_fbc")?.value || "";
  const eventSourceUrl = (req.headers.get("referer") || "").slice(0, 490);

  try {
    await sendMetaCapiEvent({
      eventName: event,
      eventId,
      eventTime: Math.floor(Date.now() / 1000),
      userData: {
        ...(clientIp && { client_ip_address: clientIp }),
        ...(clientUa && { client_user_agent: clientUa }),
        ...(fbp && { fbp }),
        ...(fbc && { fbc }),
      },
      customData: customData ?? {},
      eventSourceUrl,
    });
  } catch (err) {
    console.error("[track/meta] failed:", err);
    // Still 200 — this is a best-effort signal-quality mirror, not something
    // the browser pixel event (which already fired) should ever depend on.
  }

  return NextResponse.json({ ok: true });
}
