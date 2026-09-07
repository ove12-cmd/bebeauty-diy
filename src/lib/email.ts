// Server-only order emails via Resend (https://resend.com).
// Sends an owner notification and a customer confirmation on a paid order.
// No-ops (with a warning) if RESEND_API_KEY is unset, so the checkout still
// works before email is configured.

import { Resend } from "resend";

export type OrderEmailItem = { name: string; quantity: number; finalPrice: number };

export type OrderEmailData = {
  reference: string;
  grandTotal: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  delivery?: string; // human-readable: locker name or courier address
  items?: OrderEmailItem[];
};

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — skipping order emails for", order.reference);
    return;
  }

  const from = process.env.ORDER_EMAIL_FROM || "beBeauty DIY <onboarding@resend.dev>";
  const ownerTo = process.env.ORDER_EMAIL_TO?.split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const resend = new Resend(apiKey);

  const money = (n: number) => `${n.toFixed(2).replace(".", ",")} ${order.currency}`;
  const total = money(order.grandTotal);
  const itemsHtml = (order.items ?? [])
    .map((i) => `<li>${esc(i.name)} × ${i.quantity} — ${money(i.finalPrice * i.quantity)}</li>`)
    .join("");

  const detailRows = [
    order.customerName && `<p><strong>Customer:</strong> ${esc(order.customerName)}</p>`,
    order.customerEmail && `<p><strong>Email:</strong> ${esc(order.customerEmail)}</p>`,
    order.customerPhone && `<p><strong>Phone:</strong> ${esc(order.customerPhone)}</p>`,
    order.delivery && `<p><strong>Delivery:</strong> ${esc(order.delivery)}</p>`,
  ]
    .filter(Boolean)
    .join("");

  // Owner notification — one separate email per owner address. Sending each
  // individually (rather than one email with several recipients) keeps every
  // inbox out of the others' spam heuristics and gives per-recipient delivery
  // tracking in Resend.
  if (ownerTo && ownerTo.length > 0) {
    const ownerHtml = `
      <h2>New paid order</h2>
      <p><strong>Order number:</strong> ${esc(order.reference)}</p>
      <p><strong>Total:</strong> ${total}</p>
      ${detailRows}
      ${itemsHtml ? `<p><strong>Items:</strong></p><ul>${itemsHtml}</ul>` : ""}
    `;
    await Promise.allSettled(
      ownerTo.map((to) =>
        resend.emails
          .send({
            from,
            to,
            subject: `🟢 New order ${order.reference} — ${total}`,
            html: ownerHtml,
          })
          .catch((err) => {
            console.error(`[email] owner notification to ${to} failed:`, err);
          }),
      ),
    );
  }

  // Customer confirmation
  if (order.customerEmail) {
    try {
      await resend.emails.send({
        from,
        to: order.customerEmail,
        subject: `Order confirmation — ${order.reference}`,
        html: `
          <h2>Thank you for your order! ✨</h2>
          <p>Your order <strong>${esc(order.reference)}</strong> has been confirmed and payment received.</p>
          <p><strong>Total:</strong> ${total}</p>
          ${order.delivery ? `<p><strong>Delivery:</strong> ${esc(order.delivery)}</p>` : ""}
          ${itemsHtml ? `<p><strong>Ordered:</strong></p><ul>${itemsHtml}</ul>` : ""}
          <p>We'll get your package on its way soon. If you have any questions, just reply to this email.</p>
          <p>— beBeauty DIY</p>
        `,
      });
    } catch (err) {
      console.error("[email] customer confirmation failed:", err);
    }
  }
}

export type ReviewSubmission = {
  name: string;
  rating: number;
  text: string;
  photo?: { filename: string; content: string }; // content is base64
};

// Owner-only notification for a review a visitor submitted through the
// "Submit your review" popup — nothing is published automatically, this
// just lands in the inbox for manual review before it's added to the site.
export async function sendReviewSubmissionEmail(review: ReviewSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — skipping review submission email");
    return;
  }

  const from = process.env.ORDER_EMAIL_FROM || "beBeauty DIY <onboarding@resend.dev>";
  const ownerTo = process.env.ORDER_EMAIL_TO?.split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (!ownerTo || ownerTo.length === 0) return;

  const resend = new Resend(apiKey);
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const html = `
    <h2>New review from the website</h2>
    <p><strong>Name:</strong> ${esc(review.name)}</p>
    <p><strong>Rating:</strong> ${stars}</p>
    <p><strong>Text:</strong></p>
    <p>${esc(review.text).replace(/\n/g, "<br>")}</p>
  `;

  const attachments = review.photo ? [{ filename: review.photo.filename, content: review.photo.content }] : undefined;

  await Promise.allSettled(
    ownerTo.map((to) =>
      resend.emails
        .send({ from, to, subject: `📝 New review — ${review.name}`, html, attachments })
        .catch((err) => {
          console.error(`[email] review notification to ${to} failed:`, err);
        }),
    ),
  );
}
