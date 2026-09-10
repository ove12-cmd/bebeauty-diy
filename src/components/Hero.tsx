"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SiteNav from "@/components/SiteNav";
import TrustBadge from "@/components/ui/TrustBadge";

/* ── Image Placeholder Slot ── */
function ImageSlot({ label, variant = "default", src, alt, priority = false }: { label: string; variant?: "default" | "lav"; src?: string; alt?: string; priority?: boolean }) {
  return (
    <div className="bb-slot">
      <div className={`bb-slot__pill ${variant === "lav" ? "bb-slot__pill--lav" : ""}`}>
        <span className="bb-slot__dot" />
        {label}
      </div>
      {src ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{ objectFit: "cover", borderRadius: 26 }}
        />
      ) : (
        <div className="bb-slot__img" />
      )}
    </div>
  );
}

/* ── Hero ── */
export default function Hero() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  return (
    <section className="bb-hero">

      <SiteNav active="pood" />

      <div className="bb-hero__badge flex justify-center px-4 pt-8">
        <TrustBadge className="mb-5" />
      </div>

      {/* HEADLINE */}
      <h1 className="bb-bigtype">
        {t("headlineLine1")}<br />
        {t("headlinePrefix")} <em className="bb-bigtype__em">{t("headlineEm")}</em>
      </h1>

      <p className="bb-subline">
        {t("subline")}
      </p>

      {/* SHOWCASE */}
      <div className="bb-showcase">
        <div className="bb-showcase__main">
          <ImageSlot label={t("resultLabel")} src="/home/hero.jpg" alt={t("resultAlt")} priority />
        </div>
        <div className="bb-showcase__side">
          <ImageSlot
            label={t("kitLabel")}
            variant="lav"
            src="/home/product.png"
            alt={t("kitAlt")}
          />
          <div className="bb-cta-card">
            <div className="bb-cta-card__heading">
              {t("ctaHeading")}
              <b>{t("ctaHeadingBold")}</b>
            </div>
            <div className="bb-cta-card__buy">
              <span className="bb-cta-card__price">{t("price")}</span>
              <Button href="/tooth-gem-kit">
                {tNav("shopTheKit")}
              </Button>
            </div>
            <div className="bb-cta-card__rating">
              <span className="bb-cta-card__meta">{t("meta")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
