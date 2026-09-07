"use client";

import "./crystals.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/ui/Button";
import { EXTRA_GEM_TYPES, FREE_SHIPPING_GEM_THRESHOLD, GEM_SIZES, MIN_STANDALONE_GEMS, STANDALONE_GEM_PRICE, gemSizeId } from "@/lib/pricing";
import { useCart } from "@/hooks/useCart";

function priceStr(n: number) {
  return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + "€";
}

function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 3H3" />
    </svg>
  );
}

function IconPlus() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
}

function IconMinus() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>;
}

export default function CrystalsPage() {
  const { add } = useCart();
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  function bump(id: string, delta: number) {
    setQtys(prev => ({ ...prev, [id]: Math.max(0, Math.min(50, (prev[id] ?? 0) + delta)) }));
  }

  const total = Object.values(qtys).reduce((sum, n) => sum + n, 0);
  const cost = total * STANDALONE_GEM_PRICE;

  const belowMin = total > 0 && total < MIN_STANDALONE_GEMS;

  function addToCart() {
    if (total < MIN_STANDALONE_GEMS) return;
    EXTRA_GEM_TYPES.forEach(g => {
      GEM_SIZES.forEach(s => {
        const key = gemSizeId(g.id, s.id);
        const n = qtys[key] ?? 0;
        if (n > 0) add({ id: key, label: `${g.label} · ${s.label}`, price: STANDALONE_GEM_PRICE }, n);
      });
    });
    setQtys({});
  }

  return (
    <main className="bb-crystals">
      <SiteNav active="kristallid" />

      <div className="bb-crystals__intro">
        <h1 className="bb-crystals__title">Shop Crystals Separately</h1>
        <p className="bb-crystals__sub">
          Add more of your favorite crystals — perfect for topping up your existing kit or creating a new design. No need to order a new kit.
        </p>
        <p className="bb-crystals__note">
          Minimum order {MIN_STANDALONE_GEMS} crystals.
        </p>
      </div>

      <Link href="/tooth-gem-kit" className="bb-crystals__back-cta">
        Don't have a kit yet? Shop the DIY Tooth Gem Kit →
      </Link>

      <div className="bb-crystals__grid">
        {EXTRA_GEM_TYPES.map(g => (
          <div key={g.id} className="bb-crystals__card">
            <button
              type="button"
              className="bb-crystals__thumb"
              aria-label={`Zoom in on ${g.label}`}
              onClick={() => setLightbox({ src: g.img, alt: g.label })}
            >
              <Image src={g.img} alt={g.label} width={72} height={72} style={{ objectFit: "contain" }} />
            </button>
            <span className="bb-crystals__name">{g.label}</span>
            <span className="bb-crystals__price">{priceStr(STANDALONE_GEM_PRICE)}/pc</span>
            <div className="bb-crystals__sizes">
              {GEM_SIZES.map(s => {
                const key = gemSizeId(g.id, s.id);
                return (
                  <div key={key} className="bb-crystals__size-row">
                    <span className="bb-crystals__size-label">{s.label}</span>
                    <div className="bb-qty__ctrl bb-qty__ctrl--sm">
                      <button className="bb-qty__btn" onClick={() => bump(key, -1)} aria-label={`Decrease ${g.label} ${s.label}`}>
                        <IconMinus />
                      </button>
                      <span className="bb-qty__num">{qtys[key] ?? 0}</span>
                      <button className="bb-qty__btn" onClick={() => bump(key, 1)} aria-label={`Increase ${g.label} ${s.label}`}>
                        <IconPlus />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className={`bb-crystals__shipping-note ${total >= FREE_SHIPPING_GEM_THRESHOLD ? "bb-crystals__shipping-note--met" : ""}`}>
        {total >= FREE_SHIPPING_GEM_THRESHOLD
          ? "🎉 Free shipping applied!"
          : `📦 Free shipping from ${FREE_SHIPPING_GEM_THRESHOLD} crystals${total > 0 ? ` — add ${FREE_SHIPPING_GEM_THRESHOLD - total} more` : ""}.`}
      </p>

      <div className="bb-crystals__bar">
        <div className="bb-crystals__bar-info">
          <span className={`bb-crystals__bar-count ${belowMin ? "bb-crystals__bar-count--warn" : ""}`}>
            {total === 0
              ? `At least ${MIN_STANDALONE_GEMS} crystals`
              : belowMin
                ? `You need ${MIN_STANDALONE_GEMS - total} more crystals (min. ${MIN_STANDALONE_GEMS})`
                : `${total} crystals`}
          </span>
          <span className="bb-crystals__bar-price">{priceStr(cost)}</span>
        </div>
        <Button className="bb-crystals__cta" onClick={addToCart} disabled={total < MIN_STANDALONE_GEMS}>
          <IconCart />Add to cart
        </Button>
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}
