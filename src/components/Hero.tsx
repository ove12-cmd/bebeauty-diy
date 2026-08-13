"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import SiteNav from "@/components/SiteNav";
import { useEffect, useState } from "react";

/* ── Image Placeholder Slot ── */
function ImageSlot({ label, variant = "default", src, alt, badge }: { label: string; variant?: "default" | "lav"; src?: string; alt?: string; badge?: React.ReactNode }) {
  return (
    <div className="bb-slot">
      <div className={`bb-slot__pill ${variant === "lav" ? "bb-slot__pill--lav" : ""}`}>
        <span className="bb-slot__dot" />
        {label}
      </div>
      {badge}
      {src ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          priority
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
  const [viewers, setViewers] = useState<number | null>(null);

  useEffect(() => {
    setViewers(7);
    function scheduleNext(current: number) {
      const delay = Math.floor(Math.random() * (240000 - 30000) + 30000);
      return setTimeout(() => {
        const change = Math.floor(Math.random() * 3) + 1;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const next = Math.min(25, Math.max(4, current + change * direction));
        setViewers(next);
        scheduleNext(next);
      }, delay);
    }
    const t = scheduleNext(7);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bb-hero">

      <SiteNav active="pood" />

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
          <ImageSlot label="Tulemus" src="/home/hero.jpg" alt="Särav naeratus hambakristalliga" />
        </div>
        <div className="bb-showcase__side">
          <ImageSlot
            label="Komplekt"
            variant="lav"
            src="/home/product.png"
            alt="beBeauty DIY hambakristalli komplekt"
            badge={
              <div className="bb-slot__viewers">
                🔥 <strong>{viewers ?? "–"}</strong> vaatab seda praegu
              </div>
            }
          />
          <div className="bb-cta-card">
            <div className="bb-cta-card__heading">
              Kõik ühes väikeses komplektis.
              <b>10 kristalli · liimipliiats · aplikaator</b>
            </div>
            <div className="bb-cta-card__buy">
              <span className="bb-cta-card__price">Hind: 35€</span>
              <Button href="/hambakristalli-komplekt" arrow>
                Osta komplekt
              </Button>
            </div>
            <div className="bb-hero-urgency">
              <span className="bb-hero-urgency__stock">⚠ Ainult 3 komplekti laos</span>
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
