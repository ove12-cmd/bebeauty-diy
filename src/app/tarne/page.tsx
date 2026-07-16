import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tarne ja tagastus",
  alternates: { canonical: "/tarne" },
};

export default function ShippingPage() {
  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">← Tagasi</Link>
        <h1 className="bb-legal__title">Tarne ja tagastus</h1>
        <p className="bb-legal__date">Viimati uuendatud: juuni 2025</p>

        <h2>Tarne</h2>
        <div className="bb-legal__table">
          <div className="bb-legal__row">
            <span>Eesti (Omniva, Itella)</span>
            <span><strong>Tasuta</strong> · 1–2 tööpäeva</span>
          </div>
          <div className="bb-legal__row">
            <span>Läti, Leedu</span>
            <span>3,90€ · 2–4 tööpäeva</span>
          </div>
          <div className="bb-legal__row">
            <span>Soome</span>
            <span>5,90€ · 3–5 tööpäeva</span>
          </div>
          <div className="bb-legal__row">
            <span>Muu Euroopa</span>
            <span>alates 8,90€ · 5–10 tööpäeva</span>
          </div>
        </div>
        <p>Tellimustel esitatud tööpäevaks kl 14:00 paneme paki teele <strong>samal päeval</strong>.</p>

        <h2>Tagastus</h2>
        <p>Tagastamisõigus 30 päeva jooksul alates pakk kättesaamisest. Toode peab olema avamata ja originaalpakendis.</p>
        <p>Tagastuse algatamiseks kirjutage: <a href="mailto:info@bebeauty-diy.ee">info@bebeauty-diy.ee</a></p>

        <h2>Tagasimakse</h2>
        <p>Tagasimakse tehakse 5–10 tööpäeva jooksul pärast tagastuse kättesaamist, samale makseviisile.</p>

        <h2>Küsimused</h2>
        <p>Kirjutage meile: <a href="mailto:info@bebeauty-diy.ee">info@bebeauty-diy.ee</a></p>
      </div>
    </main>
  );
}
