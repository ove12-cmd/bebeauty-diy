"use client";

import "./shop.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import UrgencyPopup from "@/components/UrgencyPopup";
import JsonLd from "@/components/JsonLd";
import ImageLightbox from "@/components/ImageLightbox";
import ReviewsSlider from "@/components/ReviewsSlider";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/ui/Button";
import PaymentMethods from "@/components/ui/PaymentMethods";
import Stars from "@/components/ui/Stars";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { AVERAGE_RATING, REVIEW_COUNT, formatRating } from "@/lib/reviews";
import { FAQ_CATEGORIES, FAQ_ITEMS, resolveFaqCategory, resolveFaqItem } from "@/lib/faq";
import { productSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { discountPctForCode, EXTRA_GEM_TYPES, GEM_PRICE } from "@/lib/pricing";
import { trackMeta, CURRENCY } from "@/lib/meta-pixel";
import { trackGA4 } from "@/lib/ga4";
import { useCart } from "@/hooks/useCart";

// Toggle off to pause the extra-gems add-on without deleting it.
const SHOW_EXTRA_GEMS = true;

const VARIANTS = [
  { id: "s17", label: "1.7mm", descKey: "variantDescS17", price: 35, original: 45 },
  { id: "s20", label: "2.0mm", descKey: "variantDescS20", price: 35, original: 45 },
  { id: "s23", label: "2.3mm", descKey: "variantDescS23", price: 35, original: 45 },
];

// Product gallery — main image first, then alternate shots (click to swap)
const GALLERY_IMAGES = [
  "/product package v3.png",
  "/home/gallery/4.png",
  "/home/gallery/3.png",
  "/home/gallery/5.png",
];

// Results / before-after — video is the second item
const RESULTS: { type: "image" | "video"; src: string }[] = [
  { type: "image", src: "/results/result-1.jpg" },
  { type: "video", src: "/results/result-video.mp4" },
  { type: "image", src: "/results/result-2.jpg" },
  { type: "image", src: "/results/result-3.jpg" },
];

function priceStr(n: number) {
  return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + "€";
}

// `img` reuses the same tool shots as /guide, so the thing you read about
// here is the thing you see in the instructions. The last row is a claim
// rather than an object, so it has no photo — the thumbnail is optional.
// name/desc are message keys into the "shopBox" namespace — resolved at
// render time so this data stays locale-agnostic.
const BOX_ITEMS: { nameKey: string; descKey: string; img?: string }[] = [
  { nameKey: "item1Name", descKey: "item1Desc", img: "/tools/uv.png" },
  { nameKey: "item2Name", descKey: "item2Desc", img: "/crystals/gem-ab.jpg" },
  { nameKey: "item3Name", descKey: "item3Desc", img: "/tools/liim.png" },
  { nameKey: "item4Name", descKey: "item4Desc", img: "/tools/aplikaator.png" },
  { nameKey: "item5Name", descKey: "item5Desc", img: "/tools/põsehoidja.png" },
  { nameKey: "item6Name", descKey: "item6Desc" },
];

// title/desc are message keys into the "shopSteps" namespace.
const STEPS = [
  { n: "01", titleKey: "step1Title", descKey: "step1Desc", src: "/howto/vali.jpg" },
  { n: "02", titleKey: "step2Title", descKey: "step2Desc", src: "/howto/paigalda.jpg" },
  { n: "03", titleKey: "step3Title", descKey: "step3Desc", src: "/howto/tulemus.jpg" },
];


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

function IconChevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>;
}

function FAQ() {
  const locale = useLocale() as "en" | "et";
  const tFaqSection = useTranslations("shopFaqSection");
  const categories = FAQ_CATEGORIES.map((c) => resolveFaqCategory(c, locale));
  const [cat, setCat] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = categories[cat];

  // Roving-focus keyboard handling, which role="tab" implies: arrows move
  // between tabs (wrapping), Home/End jump to the ends.
  function handleTabKey(e: React.KeyboardEvent) {
    const last = categories.length - 1;
    let next = cat;
    if (e.key === "ArrowRight") next = cat === last ? 0 : cat + 1;
    else if (e.key === "ArrowLeft") next = cat === 0 ? last : cat - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setCat(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="bb-faq">
      <div
        role="tablist"
        aria-label={tFaqSection("sectionTitle")}
        className="mb-4 flex flex-wrap gap-1.5"
      >
        {categories.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`faq-tab-${c.id}`}
            aria-controls={`faq-panel-${c.id}`}
            aria-selected={i === cat}
            tabIndex={i === cat ? 0 : -1}
            onClick={() => setCat(i)}
            onKeyDown={handleTabKey}
            className={
              i === cat
                ? "rounded-full border border-[var(--bb-gold)] bg-[var(--bb-gold-tint)] px-4 py-2 text-[13px] font-semibold text-[var(--bb-gold-deep)] shadow-[2px_2px_0_0_var(--bb-gold)] transition-[box-shadow,transform] duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_0_var(--bb-gold)]"
                : "rounded-full border border-[var(--bb-ink)] px-4 py-2 text-[13px] font-semibold text-[var(--bb-ink-2)] shadow-[2px_2px_0_0_var(--bb-ink)] transition-[box-shadow,transform,border-color] duration-150 hover:border-[var(--bb-gold-line)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_0_var(--bb-ink)]"
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`faq-panel-${active.id}`}
        aria-labelledby={`faq-tab-${active.id}`}
      >
        <FaqAccordion
          key={active.id}
          data={active.items.map((faq, i) => ({
            id: `${active.id}-${i}`,
            question: faq.q,
            answer: faq.a,
          }))}
        />
      </div>
    </div>
  );
}

// icon/label pairs — label is a message key into the "shopTrust" namespace.
const TRUST = [
  { icon: "🦷", labelKey: "item1" },
  { icon: "🇪🇺", labelKey: "item2" },
  { icon: "🔒", labelKey: "item3" },
];

// num/label are message keys into the "shopStats" namespace.
const STATS = [
  { numKey: "item1Num", labelKey: "item1Label" },
  { numKey: "item2Num", labelKey: "item2Label" },
  { numKey: "item3Num", labelKey: "item3Label" },
  { numKey: "item4Num", labelKey: "item4Label" },
];

// label is a message key into the "shopSizeGuide" namespace.
const SIZE_GUIDE = [
  { size: "1.7mm", dot: 10, labelKey: "item1Label" },
  { size: "2.0mm", dot: 13, labelKey: "item2Label" },
  { size: "2.3mm", dot: 16, labelKey: "item3Label" },
];

/* ── Sticky nav ── */
function StickyNav() {
  const t = useTranslations("shopStickyNav");
  const [active, setActive] = useState("kirjeldus");
  const TABS = [
    { id: "kirjeldus", label: t("descriptionTab") },
    { id: "komplekt", label: t("kitTab") },
    { id: "paigaldus", label: t("applicationTab") },
    { id: "reviews", label: t("reviewsTab") },
  ];
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    TABS.forEach(t => { const el = document.getElementById(t.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <nav className="bb-shop-subnav">
      {TABS.map(t => (
        <a key={t.id} href={`#${t.id}`} className={`bb-shop-subnav__tab ${active === t.id ? "bb-shop-subnav__tab--active" : ""}`}>
          {t.label}
        </a>
      ))}
    </nav>
  );
}

/* ── Sticky buy bar ── */
function StickyBar({ price, original, onAdd }: { price: string; original: string; onAdd: () => void }) {
  const t = useTranslations("shopStickyBar");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // The bar shows once the lead line has scrolled off the top of the
    // viewport. A scroll listener rather than IntersectionObserver: an
    // observer needs a root with height to report against, and the margin
    // that would restrict it to the top edge collapses the root to zero
    // height — nothing can intersect that, so the callback fires once at
    // setup and never again.
    //
    // The anchor is looked up per check rather than captured once: a
    // reference held from mount measures all zeros if that node is ever
    // replaced, which reads as "top: 0" and silently pins the bar hidden.
    const check = () => {
      const anchor = document.getElementById("shop-lead");
      setVisible(!!anchor && anchor.getBoundingClientRect().top < 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return (
    <div className={`bb-sticky-bar ${visible ? "bb-sticky-bar--visible" : ""}`}>
      <span className="bb-sticky-bar__name">{t("name")}</span>
      <div className="bb-sticky-bar__right">
        <span className="bb-sticky-bar__price">{price}</span>
        <span className="bb-sticky-bar__original">{original}</span>
        <Button className="bb-sticky-bar__cta bb-btn--on-dark" onClick={onAdd}><IconCart />{t("addToCart")}</Button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const locale = useLocale() as "en" | "et";
  const t = useTranslations("product");
  const tTrustBadge = useTranslations("trustBadge");
  const tStickyNav = useTranslations("shopStickyNav");
  const tHero = useTranslations("shopHero");
  const tExtraGems = useTranslations("shopExtraGems");
  const tDiscount = useTranslations("shopDiscount");
  const tBuy = useTranslations("shopBuy");
  const tTrust = useTranslations("shopTrust");
  const tFeatures = useTranslations("shopFeatures");
  const tStats = useTranslations("shopStats");
  const tBox = useTranslations("shopBox");
  const tSteps = useTranslations("shopSteps");
  const tResults = useTranslations("shopResults");
  const tFaqSection = useTranslations("shopFaqSection");
  const [selected, setSelected] = useState("s20");
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(0);
  const variant = VARIANTS.find(v => v.id === selected)!;
  const { add, open: openCart } = useCart();
  const [gemQtys, setGemQtys] = useState<Record<string, number>>({});
  const [gemsOpen, setGemsOpen] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const totalGems = Object.values(gemQtys).reduce((sum, n) => sum + n, 0);
  const gemsCost = totalGems * GEM_PRICE;
  function bumpGemQty(id: string, delta: number) {
    setGemQtys(prev => ({ ...prev, [id]: Math.max(0, Math.min(50, (prev[id] ?? 0) + delta)) }));
  }
  const addToCart = () => {
    add({ id: variant.id, label: `${t("schemaName")} · ${variant.label}`, price: variant.price }, qty);
    // Gems only ever reach the cart here — alongside the kit, in this same
    // click — so a gem line never exists without one.
    EXTRA_GEM_TYPES.forEach(g => {
      const n = gemQtys[g.id] ?? 0;
      if (n > 0) add({ id: g.id, label: g.label, price: GEM_PRICE }, n);
    });
    setGemQtys({});
  };

  // ViewContent / view_item — once per distinct variant selected, not on
  // every re-render (StrictMode double-invokes effects in dev; this ref
  // guard keeps a real re-mount or dev double-fire from double-counting).
  const viewedVariants = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (viewedVariants.current.has(variant.id)) return;
    viewedVariants.current.add(variant.id);
    const contentName = `${t("schemaName")} · ${variant.label}`;
    trackMeta("ViewContent", {
      content_ids: [variant.id],
      content_name: contentName,
      content_type: "product",
      value: variant.price,
      currency: CURRENCY,
    });
    trackGA4("view_item", {
      currency: CURRENCY,
      value: variant.price,
      items: [{ item_id: variant.id, item_name: contentName, price: variant.price, quantity: 1 }],
    });
  }, [variant.id, variant.label, variant.price, t]);
  const [code, setCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [appliedPct, setAppliedPct] = useState(0);

  const basePrice = codeApplied ? Math.round(variant.price * (1 - appliedPct / 100) * 100) / 100 : variant.price;
  const finalPrice = basePrice * qty + gemsCost;

  function applyCode() {
    const entered = code.trim().toUpperCase();
    const pct = discountPctForCode(entered);
    if (pct > 0) {
      setCodeApplied(true);
      setCodeError(false);
      setAppliedPct(pct);
      // Persist only on apply — bbDiscountCode is the "applied" key the cart
      // and checkout read. Generating a code alone must never set it.
      localStorage.setItem("bbDiscountCode", entered);
      window.dispatchEvent(new CustomEvent("bb:discountChanged"));
    } else {
      setCodeError(true);
      setCodeApplied(false);
    }
  }
  return (
    <main className="bb-shop">
      <JsonLd
        data={productSchema({
          locale,
          price: variant.price,
          name: t("schemaName"),
          description: t("schemaDescription"),
        })}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS.map((item) => resolveFaqItem(item, locale)))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t("breadcrumbHome"), path: getPathname({ href: "/", locale }) },
          { name: t("breadcrumbProduct"), path: getPathname({ href: "/tooth-gem-kit", locale }) },
        ])}
      />
      <UrgencyPopup autoOpen={false} />
      <StickyBar price={priceStr(finalPrice)} original={priceStr(variant.original)} onAdd={addToCart} />
      <SiteNav active="komplektid" />

      {/* ── Main buy panel ── */}
      <div className="bb-shop__layout" id="kirjeldus">
        <div className="bb-shop__gallery" id="shop-gallery">
          <div className="bb-shop__img bb-shop__img--main">
            <Image
              src={GALLERY_IMAGES[mainImg]}
              alt={tHero("mainImageAlt")}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="bb-shop__thumbs">
            {GALLERY_IMAGES.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`bb-shop__img bb-shop__img--thumb ${mainImg === i ? "bb-shop__thumb--active" : ""}`}
                onClick={() => setMainImg(i)}
                aria-label={tHero("thumbAlt", { n: i + 1 })}
              >
                <Image src={src} alt="" fill sizes="140px" style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        <div className="bb-shop__panel">
          <h1 className="bb-shop__name">{tHero("nameLine1")}<br />{tHero("nameLine2")}</h1>
          <p className="bb-shop__sub">{tHero("sub")}</p>
          <a href="#reviews" className="bb-shop__rating">
            <Stars rating={AVERAGE_RATING} size="md" className="bb-shop__rating-stars" />
            {tTrustBadge("reviews", { rating: formatRating(AVERAGE_RATING, locale), count: REVIEW_COUNT })}{" "}
            <span className="bb-shop__rating-cta">{tTrustBadge("see")}</span>
          </a>

          <div className="bb-shop__variants">
            {VARIANTS.map(v => (
              <button key={v.id} className={`bb-shop__variant ${selected === v.id ? "bb-shop__variant--active" : ""}`} onClick={() => setSelected(v.id)}>
                <span className="bb-shop__variant-check">{selected === v.id ? "✓" : ""}</span>
                <span className="bb-shop__variant-label">{v.label}</span>
                <span className="bb-shop__variant-desc">{tHero(v.descKey)}</span>
                <span className="bb-shop__variant-price">{priceStr(v.price)}</span>
              </button>
            ))}
          </div>

          {/* Included crystals */}
          <div className="bb-included">
            <span className="bb-included__label">{tHero("includedLabel")}</span>
            <span className="bb-included__value">{tHero("includedValue")}</span>
          </div>

          {/* Extra gems — hidden for now, not deleted */}
          {SHOW_EXTRA_GEMS && (
            <div className="bb-extra-gems">
              <button
                type="button"
                className="bb-extra-gems__head"
                onClick={() => setGemsOpen(o => !o)}
                aria-expanded={gemsOpen}
              >
                <span className="bb-extra-gems__title">
                  {tExtraGems("title")}
                  <span className="bb-extra-gems__badge">{tExtraGems("badge")}</span>
                </span>
                <span className="bb-extra-gems__head-right">
                  <span className="bb-extra-gems__rate">{priceStr(GEM_PRICE)}{tExtraGems("perUnitSuffix")}</span>
                  <span className={`bb-extra-gems__arrow ${gemsOpen ? "bb-extra-gems__arrow--open" : ""}`}>
                    <IconChevron />
                  </span>
                </span>
              </button>
              {gemsOpen && EXTRA_GEM_TYPES.map(g => (
                <div key={g.id} className="bb-extra-gems__row">
                  <div className="bb-extra-gems__info">
                    <button
                      type="button"
                      className="bb-extra-gems__thumb"
                      aria-label={tExtraGems("enlargeAria", { label: g.label })}
                      onClick={() => setLightbox({ src: g.img, alt: g.label })}
                    >
                      <Image src={g.img} alt={g.label} width={36} height={36} style={{ objectFit: "contain" }} />
                    </button>
                    <span className="bb-extra-gems__name">{g.label}</span>
                  </div>
                  <div className="bb-qty__ctrl bb-qty__ctrl--sm">
                    <button
                      className="bb-qty__btn"
                      onClick={() => bumpGemQty(g.id, -1)}
                      aria-label={tExtraGems("decreaseAria", { label: g.label })}
                    >
                      <IconMinus />
                    </button>
                    <span className="bb-qty__num">{gemQtys[g.id] ?? 0}</span>
                    <button
                      className="bb-qty__btn"
                      onClick={() => bumpGemQty(g.id, 1)}
                      aria-label={tExtraGems("increaseAria", { label: g.label })}
                    >
                      <IconPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Discount code */}
          <div className="bb-discount">
            <div className="bb-discount__row">
              <input
                className="bb-discount__input"
                type="text"
                placeholder={tDiscount("placeholder")}
                value={code}
                onChange={e => { setCode(e.target.value); setCodeError(false); }}
                onKeyDown={e => e.key === "Enter" && applyCode()}
              />
              <button className="bb-discount__btn" onClick={applyCode}>{tDiscount("apply")}</button>
            </div>
            {codeApplied && <p className="bb-discount__ok">{tDiscount("applied", { pct: appliedPct })}</p>}
            {codeError && <p className="bb-discount__err">{tDiscount("error")}</p>}
          </div>

          {totalGems > 0 && (
            <div className="bb-extra-gems__summary">
              <span>{tExtraGems("summary", { count: totalGems })}</span>
              <span>{priceStr(gemsCost)}</span>
            </div>
          )}

          <div className="bb-shop__buy">
            <div className="bb-shop__buy-left">
              <div className="bb-qty__ctrl">
                <button className="bb-qty__btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label={tBuy("decreaseAria")}><IconMinus /></button>
                <span className="bb-qty__num">{qty}</span>
                <button className="bb-qty__btn" onClick={() => setQty(q => Math.min(10, q + 1))} aria-label={tBuy("increaseAria")}><IconPlus /></button>
              </div>
              <div className="bb-shop__prices">
                <span className="bb-shop__price">{priceStr(finalPrice)}</span>
                <span className="bb-shop__price-original">{priceStr(variant.original * qty)}</span>
                {codeApplied && <span className="bb-discount__badge">-{appliedPct}%</span>}
              </div>
            </div>
            <div className="bb-shop__cta-group">
              <Button className="bb-shop__cta" onClick={addToCart}><IconCart />{tBuy("addToCart")}</Button>
              <Button variant="outline" className="bb-shop__cta-secondary" onClick={openCart}>{tBuy("viewCart")}</Button>
            </div>
          </div>
          <PaymentMethods note={tBuy("paymentNote")} className="mt-3" />
          <div className="bb-urgency__shipping">
            {tBuy.rich("shippingLine", { strong: (chunks) => <strong>{chunks}</strong> })}
          </div>

          <div className="bb-trust">
            {TRUST.map((item, i) => (
              <div key={i} className="bb-trust__item">
                <span className="bb-trust__icon" aria-hidden="true">{item.icon}</span>
                <span className="bb-trust__label">{tTrust(item.labelKey)}</span>
              </div>
            ))}
          </div>

          <p id="shop-lead" className="bb-shop__lead">{tFeatures("lead")}</p>
          <p className="bb-shop__desc">{tFeatures("desc")}</p>
          <ul className="bb-shop__features">
            <li>{tFeatures("feature1")}</li>
            <li>{tFeatures("feature2")}</li>
            <li>{tFeatures("feature3")}</li>
            <li>{tFeatures("feature4")}</li>
            <li>{tFeatures("feature5")}</li>
            <li>{tFeatures("feature6")}</li>
          </ul>
        </div>
      </div>

      {/* Reviews come before the stats on a phone — social proof earns more
          attention there than the spec numbers — so the pair is wrapped and
          reversed rather than rendered twice. */}
      <div className="flex flex-col-reverse md:flex-col">
        {/* ── Stats bar ── */}
        <div className="bb-stats-bar">
          {STATS.map((s, i) => (
            <div key={i} className="bb-stats-bar__item">
              <span className="bb-stats-bar__num">{tStats(s.numKey)}</span>
              <span className="bb-stats-bar__label">{tStats(s.labelKey)}</span>
            </div>
          ))}
        </div>

        {/* ── Reviews ── */}
        <ReviewsSlider id="reviews" heading={tStickyNav("reviewsTab")} />
      </div>

      {/* ── What's in the box ── */}
      <div className="bb-shop-section" id="komplekt">
        <p className="bb-box-label">{tBox("sectionLabel")}</p>
        <h2 className="bb-shop-section__title">{tBox("title")}</h2>
        <p className="bb-box-subtitle">{tBox("subtitle")}</p>
        <div className="bb-box-list">
          {BOX_ITEMS.map((item, i) => (
            <div key={i} className="bb-box-row">
              <span className="bb-box-row__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="bb-box-row__body">
                <span className="bb-box-row__name">{tBox(item.nameKey)}</span>
                <span className="bb-box-row__desc">{tBox(item.descKey)}</span>
              </div>
              {item.img && (
                <button
                  type="button"
                  className="bb-box-row__thumb"
                  aria-label={tBox("thumbAria", { name: tBox(item.nameKey) })}
                  onClick={() => setLightbox({ src: item.img!, alt: tBox(item.nameKey) })}
                >
                  <Image src={item.img} alt="" width={72} height={72} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── How to apply ── */}
      <div className="bb-shop-section bb-shop-section--dark" id="paigaldus">
        <div className="bb-shop-steps__head">
          <h2 className="bb-shop-section__title bb-shop-section__title--light">{tSteps("sectionTitle")}</h2>
          <Button href="/guide" className="bb-shop-steps__guide-btn">
            {tSteps("guideButton")}
          </Button>
        </div>
        <div className="bb-shop-steps">
          {STEPS.map(step => (
            <div key={step.n} className="bb-shop-step">
              <div className="bb-shop-step__img">
                <Image
                  src={step.src}
                  alt={tSteps(step.titleKey)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="bb-shop-step__num">{step.n}</span>
              <h3 className="bb-shop-step__title">{tSteps(step.titleKey)}</h3>
              <p className="bb-shop-step__desc">{tSteps(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Before / After gallery ── */}
      <div className="bb-shop-section">
        <h2 className="bb-shop-section__title">{tResults("sectionTitle")}</h2>
        <div className="bb-shop-ba">
          {RESULTS.map((item, i) => (
            <div key={i} className="bb-shop-ba__card">
              {item.type === "video" ? (
                <video
                  className="bb-shop-ba__media"
                  src={item.src}
                  poster="/results/result-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={tResults("imageAlt")}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bb-shop-section">
        <h2 className="bb-shop-section__title bb-faq__title">{tFaqSection("sectionTitle")}</h2>
        <FAQ />
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}
