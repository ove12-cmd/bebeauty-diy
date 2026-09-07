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

      <div className="bb-hero__badge flex justify-center px-4 pt-8">
        <TrustBadge className="mb-5" />
      </div>

      {/* HEADLINE */}
      <h1 className="bb-bigtype">
        Salon results,<br />
        at home in <em className="bb-bigtype__em">10 minutes</em>
      </h1>

      <p className="bb-subline">
        Apply salon-quality tooth gems yourself – no salon required.
      </p>

      {/* SHOWCASE */}
      <div className="bb-showcase">
        <div className="bb-showcase__main">
          <ImageSlot label="Result" src="/home/hero.jpg" alt="Bright smile with a tooth gem" priority />
        </div>
        <div className="bb-showcase__side">
          <ImageSlot
            label="Kit"
            variant="lav"
            src="/home/product.png"
            alt="beBeauty DIY tooth gem kit"
          />
          <div className="bb-cta-card">
            <div className="bb-cta-card__heading">
              Everything in one small kit.
              <b>Apply at home, no salon needed.</b>
            </div>
            <div className="bb-cta-card__buy">
              <span className="bb-cta-card__price">Price: 35€</span>
              <Button href="/tooth-gem-kit">
                Shop the kit
              </Button>
            </div>
            <div className="bb-cta-card__rating">
              <span className="bb-cta-card__meta">Order today – your kit will soon be at your nearest parcel locker.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
