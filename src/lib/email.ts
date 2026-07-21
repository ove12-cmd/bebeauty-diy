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
    order.customerName && `<p><strong>Klient:</strong> ${esc(order.customerName)}</p>`,
    order.customerEmail && `<p><strong>E-post:</strong> ${esc(order.customerEmail)}</p>`,
    order.customerPhone && `<p><strong>Telefon:</strong> ${esc(order.customerPhone)}</p>`,
    order.delivery && `<p><strong>Kohaletoimetamine:</strong> ${esc(order.delivery)}</p>`,
  ]
    .filter(Boolean)
    .join("");

  // Owner notification — one separate email per owner address. Sending each
  // individually (rather than one email with several recipients) keeps every
  // inbox out of the others' spam heuristics and gives per-recipient delivery
  // tracking in Resend.
  if (ownerTo && ownerTo.length > 0) {
    const ownerHtml = `
      <h2>Uus makstud tellimus</h2>
      <p><strong>Number:</strong> ${esc(order.reference)}</p>
      <p><strong>Summa:</strong> ${total}</p>
      ${detailRows}
      ${itemsHtml ? `<p><strong>Tooted:</strong></p><ul>${itemsHtml}</ul>` : ""}
    `;
    await Promise.allSettled(
      ownerTo.map((to) =>
        resend.emails
          .send({
            from,
            to,
            subject: `🟢 Uus tellimus ${order.reference} — ${total}`,
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
        subject: `Tellimuse kinnitus — ${order.reference}`,
        html: `
          <h2>Aitäh tellimuse eest! ✨</h2>
          <p>Sinu tellimus <strong>${esc(order.reference)}</strong> on kinnitatud ja makse laekunud.</p>
          <p><strong>Summa:</strong> ${total}</p>
          ${order.delivery ? `<p><strong>Kohaletoimetamine:</strong> ${esc(order.delivery)}</p>` : ""}
          ${itemsHtml ? `<p><strong>Tellitud:</strong></p><ul>${itemsHtml}</ul>` : ""}
          <p>Paneme paki peagi teele. Küsimuste korral vasta sellele kirjale.</p>
          <p>— beBeauty DIY</p>
        `,
      });
    } catch (err) {
      console.error("[email] customer confirmation failed:", err);
    }
  }
}
