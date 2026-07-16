import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privaatsuspoliitika",
  alternates: { canonical: "/privaatsus" },
};

export default function PrivacyPage() {
  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">← Tagasi</Link>
        <h1 className="bb-legal__title">Privaatsuspoliitika</h1>
        <p className="bb-legal__date">Viimati uuendatud: juuni 2025</p>

        <h2>1. Andmete kogumine</h2>
        <p>Kogume isikuandmeid, mida esitate meile tellimuse sooritamisel (nimi, e-post, aadress) ja meie veebilehte külastades (küpsised, IP-aadress).</p>

        <h2>2. Andmete kasutamine</h2>
        <p>Kasutame teie andmeid tellimuste töötlemiseks, klienditeeninduseks ja (teie nõusolekul) turunduskirjade saatmiseks.</p>

        <h2>3. Andmete jagamine</h2>
        <p>Me ei müü ega jaga teie isikuandmeid kolmandate osapooltega, välja arvatud tellimuste täitmiseks vajalike partneritega (tarne, makse).</p>

        <h2>4. Küpsised</h2>
        <p>Kasutame küpsiseid veebilehe funktsionaalsuse tagamiseks ja kasutuskogemuse parandamiseks. Võite küpsised igal ajal brauseris keelata.</p>

        <h2>5. Teie õigused</h2>
        <p>Teil on õigus pääseda juurde oma isikuandmetele, neid parandada või kustutada. Võtke meiega ühendust: <a href="mailto:info@bebeauty-diy.ee">info@bebeauty-diy.ee</a></p>

        <h2>6. Kontakt</h2>
        <p>Küsimuste korral kirjutage: <a href="mailto:info@bebeauty-diy.ee">info@bebeauty-diy.ee</a></p>
      </div>
    </main>
  );
}
