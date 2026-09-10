import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

const BG_IMGS = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3];

export default function FinalCTA() {
  const t = useTranslations("finalCta");
  const tNav = useTranslations("nav");

  return (
    <section className="bb-cta">
      {/* Rotated image grid background */}
      <div className="bb-cta__bg-grid" aria-hidden="true">
        {BG_IMGS.map((n, i) => (
          <div key={i} className="bb-cta__bg-cell">
            <Image
              src={`/home/gallery/${n}.png`}
              alt=""
              fill
              sizes="(max-width: 768px) 60vw, 30vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div className="bb-cta__overlay" aria-hidden="true" />

      {/* Content */}
      <h2 className="bb-cta__title">{t("title")}</h2>
      <p className="bb-cta__sub">
        {t("subLine1")}<br />
        {t("subLine2")}
      </p>
      <Button href="/tooth-gem-kit" className="bb-cta__btn bb-btn--on-dark">
        {tNav("shopTheKit")}
      </Button>
    </section>
  );
}
