import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "beBeauty DIY shipping and return terms — delivery within Estonia, delivery times, and the return process.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">← Back</Link>
        <h1 className="bb-legal__title">Shipping & Returns</h1>
        <p className="bb-legal__date">Last updated: June 2025</p>

        <h2>Shipping</h2>
        <div className="bb-legal__table">
          <div className="bb-legal__row">
            <span>Estonia (Omniva, Itella)</span>
            <span><strong>Free</strong> · 1–2 business days</span>
          </div>
          <div className="bb-legal__row">
            <span>Latvia, Lithuania</span>
            <span>3,90€ · 2–4 business days</span>
          </div>
          <div className="bb-legal__row">
            <span>Finland</span>
            <span>5,90€ · 3–5 business days</span>
          </div>
          <div className="bb-legal__row">
            <span>Rest of Europe</span>
            <span>from 8,90€ · 5–10 business days</span>
          </div>
        </div>
        <p>For orders placed on a business day before 2:00 PM, we ship the package out <strong>the same day</strong>.</p>

        <h2>Returns</h2>
        <p>You have the right to return the product within 30 days of receiving the package. The product must be unopened and in its original packaging.</p>
        <p>To start a return, please email: <a href="mailto:iluinfo1@gmail.com">iluinfo1@gmail.com</a></p>

        <h2>Refunds</h2>
        <p>Refunds are issued within 5–10 business days of us receiving the return, to the original payment method.</p>

        <h2>Questions</h2>
        <p>Email us: <a href="mailto:iluinfo1@gmail.com">iluinfo1@gmail.com</a></p>
      </div>
    </main>
  );
}
