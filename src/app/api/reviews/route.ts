import { NextRequest, NextResponse } from "next/server";
import { sendReviewSubmissionEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim().slice(0, 60);
  const text = String(form.get("text") ?? "").trim().slice(0, 600);
  const rating = Math.min(5, Math.max(1, Math.round(Number(form.get("rating")) || 5)));

  if (!name || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let photo: { filename: string; content: string } | undefined;
  const file = form.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Invalid photo" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    photo = { filename: file.name || "photo.jpg", content: buffer.toString("base64") };
  }

  try {
    await sendReviewSubmissionEmail({ name, rating, text, photo });
  } catch (err) {
    console.error("[reviews] email failed:", err);
    // Still 200 — the popup never surfaces email delivery either way.
  }

  return NextResponse.json({ ok: true });
}
