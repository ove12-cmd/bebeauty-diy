// Server-only order emails via Resend (https://resend.com).
// Sends an owner notification and a customer confirmation on a paid order.
// No-ops (with a warning) if RESEND_API_KEY is unset, so the checkout still
// works before email is configured.

import { Resend } from "resend";
import { formatDeliveryTarget, type DeliveryDetails } from "@/lib/pricing";

export type OrderEmailItem = { name: string; quantity: number; finalPrice: number };

export type OrderEmailData = {
  reference: string;
  grandTotal: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  /** Buyer's browsing locale at checkout — only the *customer* confirmation
   *  is sent in this language; the owner notification stays in English
   *  regardless, matching the dashboard's own fixed working language. */
  locale?: "en" | "et";
  delivery?: DeliveryDetails;
  items?: OrderEmailItem[];
};

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

// Plain string tables, not next-intl: this runs from a webhook with no
// request-scoped locale context to hang next-intl's server APIs off of, and
// two languages of transactional email copy don't need a full message
// catalog for what's a handful of short lines.
const CUSTOMER_EMAIL_STRINGS = {
  en: {
    subject: (ref: string) => `Order confirmation — ${ref}`,
    heading: "Thank you for your order! ✨",
    confirmed: (ref: string) => `Your order <strong>${esc(ref)}</strong> has been confirmed and payment received.`,
    total: "Total:",
    delivery: "Delivery:",
    ordered: "Ordered:",
    closing: "We'll get your package on its way soon. If you have any questions, just reply to this email.",
    signoff: "— beBeauty DIY",
  },
  et: {
    subject: (ref: string) => `Tellimuse kinnitus — ${ref}`,
    heading: "Aitäh tellimuse eest! ✨",
    confirmed: (ref: string) => `Sinu tellimus <strong>${esc(ref)}</strong> on kinnitatud ja makse on laekunud.`,
    total: "Kokku:",
    delivery: "Tarne:",
    ordered: "Tellitud:",
    closing: "Saadame Sinu paki peagi teele. Kui tekib küsimusi, vasta lihtsalt sellele kirjale.",
    signoff: "— beBeauty DIY",
  },
} as const;

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

  // Owner notification is always in English, matching the dashboard's own
  // fixed working language — it doesn't follow the buyer's browsing locale.
  const ownerDeliveryText = order.delivery ? formatDeliveryTarget("en", order.delivery) : "";
  const detailRows = [
    order.customerName && `<p><strong>Customer:</strong> ${esc(order.customerName)}</p>`,
    order.customerEmail && `<p><strong>Email:</strong> ${esc(order.customerEmail)}</p>`,
    order.customerPhone && `<p><strong>Phone:</strong> ${esc(order.customerPhone)}</p>`,
    ownerDeliveryText && `<p><strong>Delivery:</strong> ${esc(ownerDeliveryText)}</p>`,
  ]
    .filter(Boolean)
    .join("");

  const locale = order.locale === "et" ? "et" : "en";
  const s = CUSTOMER_EMAIL_STRINGS[locale];
  const customerDeliveryText = order.delivery ? formatDeliveryTarget(locale, order.delivery) : "";

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

  // Customer confirmation — sent in the buyer's own browsing locale.
  if (order.customerEmail) {
    try {
      await resend.emails.send({
        from,
        to: order.customerEmail,
        subject: s.subject(order.reference),
        html: `
          <h2>${s.heading}</h2>
          <p>${s.confirmed(order.reference)}</p>
          <p><strong>${s.total}</strong> ${total}</p>
          ${customerDeliveryText ? `<p><strong>${s.delivery}</strong> ${esc(customerDeliveryText)}</p>` : ""}
          ${itemsHtml ? `<p><strong>${s.ordered}</strong></p><ul>${itemsHtml}</ul>` : ""}
          <p>${s.closing}</p>
          <p>${s.signoff}</p>
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
