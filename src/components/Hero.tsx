"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

/* ── Icons ── */
function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M6 6 5 3H3" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.6-7-9.6A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.4C19 15.4 12 20 12 20Z" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ── Wordmark ── */
function Wordmark() {
  return (
    <div className="bb-wordmark">
      <span className="bb-wordmark__be">beBeauty</span>
      <span className="bb-wordmark__tag">DIY</span>
    </div>
  );
}

/* ── Image Placeholder Slot ── */
function ImageSlot({ label, variant = "default", src, alt }: { label: string; variant?: "default" | "lav"; src?: string; alt?: string }) {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: cartCount, open: openCart } = useCart();

  return (
    <section className="bb-hero">

      {/* NAV */}
      <nav className="bb-nav">
        <Wordmark />

        {/* Desktop links — hidden via CSS when they'd wrap */}
        <div className="bb-nav__links">
          <a href="/" className="bb-nav__link bb-nav__link--active">Pood</a>
          <a href="/shop" className="bb-nav__link">Komplektid</a>
          <a href="/#kuidas" className="bb-nav__link">Kuidas see töötab</a>
          <a href="/juhend" className="bb-nav__link">Juhend</a>
          <a href="/#galerii" className="bb-nav__link">Galerii</a>
        </div>

        <div className="bb-nav__right">
          <Button href="/shop" className="bb-nav__cta" arrow>
            Osta komplekt
          </Button>
          <button className="bb-icon-btn bb-nav__cart" aria-label="Ostukorv" onClick={openCart}>
            <IconCart />
            {cartCount > 0 && <span className="bb-nav__cart-badge">{cartCount}</span>}
          </button>
          {/* Hamburger — shown only when links collapse */}
          <button
            className="bb-icon-btn bb-nav__hamburger"
            aria-label="Menüü"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="bb-nav__mobile-menu">
          <a href="/" className="bb-nav__mobile-link bb-nav__mobile-link--active" onClick={() => setMenuOpen(false)}>Pood</a>
          <a href="/shop" className="bb-nav__mobile-link" onClick={() => setMenuOpen(false)}>Komplektid</a>
          <a href="/#kuidas" className="bb-nav__mobile-link" onClick={() => setMenuOpen(false)}>Kuidas see töötab</a>
          <a href="/juhend" className="bb-nav__mobile-link" onClick={() => setMenuOpen(false)}>Juhend</a>
          <a href="/#galerii" className="bb-nav__mobile-link" onClick={() => setMenuOpen(false)}>Galerii</a>
          <Button href="/shop" className="bb-nav__mobile-cta" arrow onClick={() => setMenuOpen(false)}>
            Osta komplekt
          </Button>
        </div>
      )}

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
          <ImageSlot label="Komplekt" variant="lav" src="/home/product.png" alt="beBeauty DIY hambakristalli komplekt" />
          <div className="bb-cta-card">
            <div className="bb-cta-card__heading">
              Kõik ühes väikeses komplektis.
              <b>20+ kristalli · liimipliiats · aplikaator</b>
            </div>
            <div className="bb-cta-card__buy">
              <span className="bb-cta-card__price">alates 35€</span>
              <Button href="/shop" arrow>
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
