import Image from "next/image";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

const TRUST_ITEMS = [
  { icon: "🛡", title: "Ohutu ja tõhus", sub: "Ohutu emailile" },
  { icon: "⏱", title: "Kiire tulemus", sub: "Paigaldus vaid 10 minutiga" },
  { icon: "💎", title: "Premium kristallid", sub: "Preciosa & Primero" },
  { icon: "✨", title: "Püsiv sära", sub: "Püsib kuni 2–4 nädalat" },
];

export default function Footer() {
  return (
    <footer className="bb-footer">
      <div className="bb-footer__top">

        {/* Left — brand block */}
        <div className="bb-footer__brand">
          <div className="bb-logo-badge" aria-label="beBeauty DIY">
            <Logo className="bb-logo-badge__img" />
          </div>
          <h2 className="bb-footer__headline">
            SALONGIVÄÄRILINE <em className="bb-footer__headline-em">TULEMUS</em>,<br />
            ILMA SALONGITA.
          </h2>
          <div className="bb-footer__trust">
            {TRUST_ITEMS.map((t, i) => (
              <div key={i} className="bb-footer__trust-item">
                <span className="bb-footer__trust-icon">{t.icon}</span>
                <div>
                  <span className="bb-footer__trust-title">{t.title}</span>
                  <span className="bb-footer__trust-sub">{t.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle — link columns */}
        <div className="bb-footer__cols">
          <div className="bb-footer__col">
            <span className="bb-footer__col-title">Pood</span>
            <Link href="/hambakristalli-komplekt" className="bb-footer__link">Komplektid</Link>
            <Link href="/hambakristalli-komplekt" className="bb-footer__link">Kristallid</Link>
            <Link href="/hambakristalli-komplekt" className="bb-footer__link">Tarvikud</Link>
            <Link href="/hambakristalli-komplekt" className="bb-footer__link">Kinkekaardid</Link>
          </div>
          <div className="bb-footer__col">
            <span className="bb-footer__col-title">Info</span>
            <Link href="/#kuidas" className="bb-footer__link">Kuidas see töötab</Link>
            <Link href="/juhend" className="bb-footer__link">Paigaldusjuhend</Link>
            <Link href="/hambakristalli-komplekt#arvustused" className="bb-footer__link">KKK</Link>
            <Link href="/kontakt" className="bb-footer__link">Kontakt</Link>
            <Link href="/tarne" className="bb-footer__link">Tarne ja tagastus</Link>
            <Link href="/privaatsus" className="bb-footer__link">Privaatsuspoliitika</Link>
            <Link href="/tingimused" className="bb-footer__link">Tingimused</Link>
          </div>
        </div>

        {/* Right — product card */}
        <div className="bb-footer__card">
          <div className="bb-footer__card-inner">
            <span className="bb-footer__card-pill">DIY KOMPLEKT</span>
            <p className="bb-footer__card-text">Kõik vajalik ühes komplektis.</p>
            <Button href="/hambakristalli-komplekt" className="bb-footer__card-btn">
              Osta komplekt →
            </Button>
          </div>
          <div className="bb-footer__card-img">
          <Image src="/popupo.jpg" alt="beBeauty DIY komplekt" fill sizes="(max-width: 1024px) 200px, 220px" style={{ objectFit: "cover" }} />
        </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="bb-footer__bottom">
        <span className="bb-footer__copy">© {new Date().getFullYear()} beBeauty DIY. Kõik õigused kaitstud.</span>
        <div className="bb-footer__payments">
          <span className="bb-footer__pay-badge">Apple Pay</span>
          <span className="bb-footer__pay-badge">G Pay</span>
          <span className="bb-footer__pay-badge">VISA</span>
          <span className="bb-footer__pay-badge">Mastercard</span>
          <span className="bb-footer__pay-badge">Klarna</span>
        </div>
        <span className="bb-footer__made">♡ Disainitud Eestis · Made with care</span>
      </div>
    </footer>
  );
}
