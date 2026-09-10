import Image from "next/image";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import PaymentMethods from "@/components/ui/PaymentMethods";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bb-footer">
      <div className="bb-footer__top">

        {/* Left — brand block */}
        <div className="bb-footer__brand">
          <div className="bb-logo-badge" aria-label="beBeauty DIY">
            <Logo className="bb-logo-badge__img" />
          </div>
          <h2 className="bb-footer__headline">
            {t("headlineLine1")} <em className="bb-footer__headline-em">{t("headlineEm")}</em>,<br />
            {t("headlineLine2")}
          </h2>
        </div>

        {/* Middle — link columns */}
        <div className="bb-footer__cols">
          {/* Pood column hidden for now */}
          <div className="bb-footer__col">
            <span className="bb-footer__col-title">{t("infoTitle")}</span>
            <Link href={{ pathname: "/", hash: "kuidas" }} className="bb-footer__link">{t("howItWorks")}</Link>
            <Link href="/guide" className="bb-footer__link">{t("guide")}</Link>
            <Link href={{ pathname: "/tooth-gem-kit", hash: "reviews" }} className="bb-footer__link">{t("faq")}</Link>
            {/* Kontakt hidden for now */}
            <Link href="/shipping" className="bb-footer__link">{t("shipping")}</Link>
            <Link href="/privacy" className="bb-footer__link">{t("privacy")}</Link>
            <Link href="/terms" className="bb-footer__link">{t("terms")}</Link>
          </div>
        </div>

        {/* Right — product card */}
        <div className="bb-footer__card">
          <div className="bb-footer__card-inner">
            <span className="bb-footer__card-pill">{t("cardPill")}</span>
            <p className="bb-footer__card-text">{t("cardText")}</p>
            <Button href="/tooth-gem-kit" className="bb-footer__card-btn bb-btn--on-dark">
              {t("cardCta")}
            </Button>
          </div>
          <div className="bb-footer__card-img">
          <Image src="/popupo.jpg" alt={t("cardImgAlt")} fill sizes="(max-width: 1024px) 200px, 220px" style={{ objectFit: "cover" }} />
        </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="bb-footer__bottom">
        <span className="bb-footer__copy">{t("copyright", { year: new Date().getFullYear() })}</span>
        <PaymentMethods tone="inverse" />
        <span className="bb-footer__made">{t("made")}</span>
      </div>
    </footer>
  );
}
