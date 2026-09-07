import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "beBeauty DIY online store terms of service — ordering, payment, delivery, and returns.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">← Back</Link>
        <h1 className="bb-legal__title">Terms of Service</h1>
        <p className="bb-legal__date">Last updated: June 2025</p>

        <h2>1. General</h2>
        <p>By using the beBeauty DIY online store, you agree to these terms. Please read them carefully before making a purchase.</p>

        <h2>2. Products</h2>
        <p>All our products are intended for home use in accordance with the instructions included with the product. Please use our products responsibly.</p>

        <h2>3. Prices and Payment</h2>
        <p>All prices are in euros and include VAT. We reserve the right to change prices without prior notice.</p>

        <h2>4. Ordering</h2>
        <p>An order is considered confirmed once payment has been received. We will send an order confirmation to your email.</p>

        <h2>5. Limitation of Liability</h2>
        <p>beBeauty DIY is not liable for any damage resulting from misuse of the product. Always follow the included instructions.</p>

        <h2>6. Contact</h2>
        <p>If you have any questions: <a href="mailto:iluinfo1@gmail.com">iluinfo1@gmail.com</a></p>
      </div>
    </main>
  );
}
