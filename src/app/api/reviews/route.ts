import { NextRequest, NextResponse } from "next/server";
import { sendReviewSubmissionEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { name?: string; rating?: number; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 60);
  const text = (body.text ?? "").trim().slice(0, 600);
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));

  if (!name || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await sendReviewSubmissionEmail({ name, rating, text });
  } catch (err) {
    console.error("[reviews] email failed:", err);
    // Still 200 — the popup never surfaces email delivery either way.
  }

  return NextResponse.json({ ok: true });
}
