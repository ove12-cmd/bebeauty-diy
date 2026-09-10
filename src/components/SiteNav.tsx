"use client";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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

export default function SiteNav({ active = "pood" }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: cartCount, open: openCart } = useCart();
  const t = useTranslations("nav");

  const LINKS = [
    { key: "pood", href: "/", label: t("shop") },
    { key: "komplektid", href: "/tooth-gem-kit", label: t("kits") },
    { key: "kuidas", href: { pathname: "/", hash: "kuidas" }, label: t("howItWorks") },
    { key: "juhend", href: "/guide", label: t("guide") },
    { key: "galerii", href: { pathname: "/", hash: "galerii" }, label: t("gallery") },
  ] as const;

  return (
    <>
      <nav className="bb-nav">
        <Link href="/" className="bb-logo-badge" aria-label="beBeauty DIY">
          <Logo className="bb-logo-badge__img" priority />
        </Link>

        {/* Desktop links — hidden via CSS when they'd wrap */}
        <div className="bb-nav__links">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={`bb-nav__link ${active === l.key ? "bb-nav__link--active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="bb-nav__right">
          <Button href="/tooth-gem-kit" className="bb-nav__cta bb-btn--on-dark">
            {t("shopTheKit")}
          </Button>
          <LanguageSwitcher />
          <button className="bb-icon-btn bb-nav__cart" aria-label={t("cart")} onClick={openCart}>
            <IconCart />
            {cartCount > 0 && <span className="bb-nav__cart-badge">{cartCount}</span>}
          </button>
          {/* Hamburger — shown only when links collapse */}
          <button
            className="bb-icon-btn bb-nav__hamburger"
            aria-label={t("menu")}
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
            <Link
              key={l.key}
              href={l.href}
              className={`bb-nav__mobile-link ${active === l.key ? "bb-nav__mobile-link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Button href="/tooth-gem-kit" className="bb-nav__mobile-cta bb-btn--on-dark" onClick={() => setMenuOpen(false)}>
            {t("shopTheKit")}
          </Button>
          <LanguageSwitcher variant="inline" />
        </div>
      )}
    </>
  );
}
