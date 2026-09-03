"use client";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

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

const LINKS = [
  { key: "pood", href: "/", label: "Pood" },
  { key: "komplektid", href: "/hambakristalli-komplekt", label: "Komplektid" },
  { key: "kuidas", href: "/#kuidas", label: "Kuidas see töötab" },
  { key: "juhend", href: "/juhend", label: "Juhend" },
  { key: "galerii", href: "/#galerii", label: "Galerii" },
];

export default function SiteNav({ active = "pood" }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: cartCount, open: openCart } = useCart();

  return (
    <>
      <nav className="bb-nav">
        <a href="/" className="bb-logo-badge" aria-label="beBeauty DIY">
          <Logo className="bb-logo-badge__img" priority />
        </a>

        {/* Desktop links — hidden via CSS when they'd wrap */}
        <div className="bb-nav__links">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className={`bb-nav__link ${active === l.key ? "bb-nav__link--active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="bb-nav__right">
          <Button href="/hambakristalli-komplekt" className="bb-nav__cta">
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
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className={`bb-nav__mobile-link ${active === l.key ? "bb-nav__mobile-link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Button href="/hambakristalli-komplekt" className="bb-nav__mobile-cta" onClick={() => setMenuOpen(false)}>
            Osta komplekt
          </Button>
        </div>
      )}
    </>
  );
}
