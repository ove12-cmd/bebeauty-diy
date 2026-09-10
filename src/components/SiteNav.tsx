"use client";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

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

function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const other: Locale = locale === "en" ? "et" : "en";

  return (
    <button
      className={className}
      aria-label={t("switchLanguage")}
      onClick={() => router.replace(pathname, { locale: other })}
    >
      {other.toUpperCase()}
    </button>
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
          <LanguageSwitcher className="bb-icon-btn bb-nav__lang" />
          <Button href="/tooth-gem-kit" className="bb-nav__cta">
            {t("shopTheKit")}
          </Button>
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
          <LanguageSwitcher className="bb-nav__mobile-link bb-nav__lang" />
          <Button href="/tooth-gem-kit" className="bb-nav__mobile-cta" onClick={() => setMenuOpen(false)}>
            {t("shopTheKit")}
          </Button>
        </div>
      )}
    </>
  );
}
