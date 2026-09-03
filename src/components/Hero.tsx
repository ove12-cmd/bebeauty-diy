"use client";

import Image from "next/image";
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
  return (
    <section className="bb-hero">

      <SiteNav active="pood" />

      <div className="bb-hero__badge flex justify-center px-4">
        <TrustBadge className="mb-5" />
      </div>

      {/* HEADLINE */}
      <h1 className="bb-bigtype">
        Salongi tulemus,<br />
        kodus <em className="bb-bigtype__em">10 minutiga</em>
      </h1>

      <p className="bb-subline">
        Paigalda ise professionaalse tulemusega hambakristallid – ilma salongita.
      </p>

      {/* SHOWCASE */}
      <div className="bb-showcase">
        <div className="bb-showcase__main">
          <ImageSlot label="Tulemus" src="/home/hero.jpg" alt="Särav naeratus hambakristalliga" priority />
        </div>
        <div className="bb-showcase__side">
          <ImageSlot
            label="Komplekt"
            variant="lav"
            src="/home/product.png"
            alt="beBeauty DIY hambakristalli komplekt"
          />
          <div className="bb-cta-card">
            <div className="bb-cta-card__heading">
              Kõik ühes väikeses komplektis.
              <b>Paigalda kodus, ilma salongita.</b>
            </div>
            <div className="bb-cta-card__buy">
              <span className="bb-cta-card__price">Hind: 35€</span>
              <Button href="/hambakristalli-komplekt" arrow>
                Osta komplekt
              </Button>
            </div>
            <div className="bb-cta-card__rating">
              <span className="bb-cta-card__meta">Telli täna – komplekt on peagi sinu lähimas pakiautomaadis.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
