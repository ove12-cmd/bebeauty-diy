import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export default function Product() {
  const t = useTranslations("productSection");
  const tNav = useTranslations("nav");

  const FEATURES = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
    t("feature6"),
  ];

  return (
    <section className="bb-product">
      <div className="bb-product__img-wrap">
        <Image
          src="/product package v3.png"
          alt={t("imgAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="bb-product__content">
        <span className="bb-product__eyebrow">{t("eyebrow")}</span>
        <h2 className="bb-product__name">{t("headingLine1")}<br />{t("headingLine2")}</h2>
        <p className="bb-product__price">
          <span className="bb-product__price-from">{t("priceLabel")}</span>
          <span className="bb-product__price-value">{t("priceValue")}</span>
        </p>
        <p className="bb-product__desc">
          {t("desc")}
        </p>
        <ul className="bb-product__features">
          {FEATURES.map((f) => (
            <li key={f}>
              <span className="bb-product__check">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Button href="/tooth-gem-kit" className="bb-product__cta">
          {tNav("shopTheKit")}
        </Button>
      </div>
    </section>
  );
}
