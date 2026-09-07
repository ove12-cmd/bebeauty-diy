import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "beBeauty DIY privacy policy — how we collect, use, and protect your personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">← Back</Link>
        <h1 className="bb-legal__title">Privacy Policy</h1>
        <p className="bb-legal__date">Last updated: June 2025</p>

        <h2>1. Data Collection</h2>
        <p>We collect personal data that you provide to us when placing an order (name, email, address) and when visiting our website (cookies, IP address).</p>

        <h2>2. Use of Data</h2>
        <p>We use your data to process orders, provide customer service, and (with your consent) send marketing emails.</p>

        <h2>3. Data Sharing</h2>
        <p>We do not sell or share your personal data with third parties, except partners necessary to fulfill your order (delivery, payment).</p>

        <h2>4. Cookies</h2>
        <p>We use cookies to ensure the website functions properly and to improve your user experience. You can disable cookies in your browser at any time.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. Contact us: <a href="mailto:iluinfo1@gmail.com">iluinfo1@gmail.com</a></p>

        <h2>6. Contact</h2>
        <p>If you have any questions, please email: <a href="mailto:iluinfo1@gmail.com">iluinfo1@gmail.com</a></p>
      </div>
    </main>
  );
}
