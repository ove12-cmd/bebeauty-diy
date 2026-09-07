import Image from "next/image";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import PaymentMethods from "@/components/ui/PaymentMethods";
import Link from "next/link";

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
            SALON-WORTHY <em className="bb-footer__headline-em">RESULTS</em>,<br />
            NO SALON NEEDED.
          </h2>
        </div>

        {/* Middle — link columns */}
        <div className="bb-footer__cols">
          {/* Pood column hidden for now */}
          <div className="bb-footer__col">
            <span className="bb-footer__col-title">Info</span>
            <Link href="/#kuidas" className="bb-footer__link">How it works</Link>
            <Link href="/guide" className="bb-footer__link">Application Guide</Link>
            <Link href="/tooth-gem-kit#reviews" className="bb-footer__link">FAQ</Link>
            {/* Kontakt hidden for now */}
            <Link href="/shipping" className="bb-footer__link">Shipping & Returns</Link>
            <Link href="/privacy" className="bb-footer__link">Privacy Policy</Link>
            <Link href="/terms" className="bb-footer__link">Terms</Link>
          </div>
        </div>

        {/* Right — product card */}
        <div className="bb-footer__card">
          <div className="bb-footer__card-inner">
            <span className="bb-footer__card-pill">DIY KIT</span>
            <p className="bb-footer__card-text">Everything you need in one kit.</p>
            <Button href="/tooth-gem-kit" className="bb-footer__card-btn">
              Shop the kit →
            </Button>
          </div>
          <div className="bb-footer__card-img">
          <Image src="/popupo.jpg" alt="beBeauty DIY tooth gem kit" fill sizes="(max-width: 1024px) 200px, 220px" style={{ objectFit: "cover" }} />
        </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="bb-footer__bottom">
        <span className="bb-footer__copy">© {new Date().getFullYear()} beBeauty DIY. All rights reserved.</span>
        <PaymentMethods tone="inverse" />
        <span className="bb-footer__made">♡ Designed in Estonia · Made with care</span>
      </div>
    </footer>
  );
}
