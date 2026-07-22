import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kasutustingimused",
  description: "beBeauty DIY e-poe kasutustingimused — tellimine, maksmine, tarne ja tagastus.",
  alternates: { canonical: "/tingimused" },
};

export default function TermsPage() {
  return (
    <main className="bb-legal">
      <div className="bb-legal__inner">
        <Link href="/" className="bb-legal__back">← Tagasi</Link>
        <h1 className="bb-legal__title">Kasutustingimused</h1>
        <p className="bb-legal__date">Viimati uuendatud: juuni 2025</p>

        <h2>1. Üldine</h2>
        <p>beBeauty DIY veebipoe kasutamisega nõustute käesolevate tingimustega. Palume neid hoolikalt lugeda enne ostu sooritamist.</p>

        <h2>2. Tooted</h2>
        <p>Kõik meie tooted on mõeldud koduseks kasutamiseks vastavalt tootega kaasasolevale juhendile. Kasutage tooteid vastutustundlikult.</p>

        <h2>3. Hinnad ja maksmine</h2>
        <p>Kõik hinnad on eurodes ja sisaldavad käibemaksu. Jätame endale õiguse hindu muuta ilma eelneva teatamiseta.</p>

        <h2>4. Tellimine</h2>
        <p>Tellimus loetakse kinnitatuks pärast makse laekumist. Saadame tellimuse kinnituse e-postile.</p>

        <h2>5. Vastutuse piirang</h2>
        <p>beBeauty DIY ei vastuta toote väärkasutusest tulenevate kahjude eest. Järgige alati kaasasolevat juhendit.</p>

        <h2>6. Kontakt</h2>
        <p>Küsimuste korral: <a href="mailto:info@bebeauty-diy.ee">info@bebeauty-diy.ee</a></p>
      </div>
    </main>
  );
}
