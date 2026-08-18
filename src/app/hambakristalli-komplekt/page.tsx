"use client";

import "./shop.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UrgencyPopup from "@/components/UrgencyPopup";
import JsonLd from "@/components/JsonLd";
import ImageLightbox from "@/components/ImageLightbox";
import ReviewsSlider from "@/components/ReviewsSlider";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/ui/Button";
import { productSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { discountPctForCode, isGeneratedMarketingCode, EXTRA_GEM_TYPES, GEM_PRICE } from "@/lib/pricing";
import { trackMeta, CURRENCY } from "@/lib/meta-pixel";
import { trackGA4 } from "@/lib/ga4";
import { useCart } from "@/hooks/useCart";

// Toggle off to pause the extra-gems add-on without deleting it.
const SHOW_EXTRA_GEMS = true;

const VARIANTS = [
  { id: "s17", label: "1.7mm", desc: "Väiksem, peenem kristall", price: 35, original: 45 },
  { id: "s20", label: "2.0mm", desc: "Kõige populaarsem valik", price: 35, original: 45 },
  { id: "s23", label: "2.3mm", desc: "Suurem, silmapaistvam efekt", price: 35, original: 45 },
];

// Product gallery — main image first, then alternate shots (click to swap)
const GALLERY_IMAGES = [
  "/product package.jpg",
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

const BOX_ITEMS = [
  { name: "UV LED-lamp", desc: "Kiireks ja ühtlaseks kõvastamiseks." },
  { name: "Premium kristallid", desc: "10 Swarovski kristalli komplektis." },
  { name: "Liim & Etch", desc: "Professionaalseks kinnitamiseks ja paremaks püsivuseks." },
  { name: "Aplikaatorid", desc: "Kõik vajalik kristallide täpseks paigaldamiseks." },
  { name: "Põsehoidja", desc: "Hoiab tööala mugavalt avatuna." },
  { name: "Valmis kasutamiseks", desc: "Ava karp ja alusta kohe." },
];

const STEPS = [
  { n: "01", title: "Vali", desc: "Vali oma komplekt.", src: "/howto/vali.jpg" },
  { n: "02", title: "Kleebi", desc: "Kleebi kristallid hambale.", src: "/howto/paigalda.jpg" },
  { n: "03", title: "Valmis!", desc: "Ja valmis! Kristall paigas", src: "/howto/tulemus.jpg" },
];

const FAQS = [
  { q: "Kas see kahjustab hammast?", a: "Ei. Kristall kleepub hambaemaili pinnale ilma kahjustamata. Komplekti kasutatakse ohutult juhendi järgi ning kristall on igal ajal eemaldatav." },
  { q: "Kui kaua kristall püsib?", a: "Keskmiselt 2–4 nädalat, sõltuvalt söömis- ja joomisharjumustest. Väldi esimese 24 tunni jooksul kuumi jooke ja kõva toitu." },
  { q: "Mis suurust valida?", a: "1.7mm on peenem ja loomulikum, 2.0mm on populaarseim ning 2.3mm annab julge ja silmatorkava efekti. Kõik suurused sobivad algajatele." },
  { q: "Kas saan ise eemaldada?", a: "Jah — eemaldamiseks kasuta komplektis olevat vahendit või hambaniiti. Eemalda õrnalt ilma hammast kahjustamata." },
  { q: "Kui kiiresti pakk saabub?", a: "Eesti tarne 1–2 tööpäeva. Tasuta saatmine üle Eesti." },
  { q: "Kas kristalle saab juurde tellida?", a: "Jah — saad valida ja lisada ekstra Swarovski kristalle otse siin lehel, enne ostukorvi lisamist." },
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
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="bb-faq">
      {FAQS.map((faq, i) => (
        <div key={i} className={`bb-faq__item ${open === i ? "bb-faq__item--open" : ""}`}>
          <button className="bb-faq__q" onClick={() => setOpen(open === i ? null : i)}>
            <span className="bb-faq__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="bb-faq__text">{faq.q}</span>
            <span className="bb-faq__icon">
              <IconPlus />
            </span>
          </button>
          {open === i && <p className="bb-faq__a">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}

const TRUST = [
  { icon: "🦷", label: "Hambasõbralik" },
  { icon: "💎", label: "Euroopa kristallid" },
  { icon: "↩", label: "30p tagastus" },
  { icon: "🔒", label: "Turvaline makse" },
];

const STATS = [
  { num: "10 min", label: "Paigaldusaeg" },
  { num: "10", label: "Premium kristalli komplektis" },
  { num: "1–2p", label: "Tarne Eestis" },
  { num: "2–4 nädalat", label: "Keskmine püsivus" },
];

const SIZE_GUIDE = [
  { size: "1.7mm", dot: 10, label: "Peenem, loomulik" },
  { size: "2.0mm", dot: 13, label: "Populaarseim" },
  { size: "2.3mm", dot: 16, label: "Julge efekt" },
];

/* ── Sticky nav ── */
function StickyNav() {
  const [active, setActive] = useState("kirjeldus");
  const TABS = [
    { id: "kirjeldus", label: "Kirjeldus" },
    { id: "komplekt", label: "Komplekt" },
    { id: "paigaldus", label: "Paigaldus" },
    { id: "arvustused", label: "Arvustused" },
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const gallery = document.getElementById("shop-gallery");
    if (!gallery) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0.1 });
    obs.observe(gallery);
    return () => obs.disconnect();
  }, []);
  return (
    <div className={`bb-sticky-bar ${visible ? "bb-sticky-bar--visible" : ""}`}>
      <span className="bb-sticky-bar__name">DIY Hambakristalli komplekt</span>
      <div className="bb-sticky-bar__right">
        <span className="bb-sticky-bar__price">{price}</span>
        <span className="bb-sticky-bar__original">{original}</span>
        <Button className="bb-sticky-bar__cta" onClick={onAdd}><IconCart />Lisa korvi</Button>
      </div>
    </div>
  );
}

function useCodeTimer() {
  const [secsLeft, setSecsLeft] = useState<number | null>(null);
  useEffect(() => {
    function sync() {
      if (!isGeneratedMarketingCode(localStorage.getItem("bbGeneratedCode"))) {
        setSecsLeft(null);
        return;
      }
      const expiry = Number(localStorage.getItem("bbCodeExpiry") || 0);
      const remaining = expiry ? Math.round((expiry - Date.now()) / 1000) : 0;
      // Truly expired — hide the ticker (the "Genereeri sooduskood" CTA
      // takes over below). Do NOT auto-extend: that silently resurrects the
      // ticker forever on every future visit for anyone who ever generated
      // a code once, with no further action on their part.
      setSecsLeft(remaining > 0 ? remaining : null);
    }
    sync();
    const t = setInterval(sync, 1000);
    const handler = () => sync();
    window.addEventListener("bb:codeGenerated", handler);
    window.addEventListener("bb:discountChanged", handler);
    return () => {
      clearInterval(t);
      window.removeEventListener("bb:codeGenerated", handler);
      window.removeEventListener("bb:discountChanged", handler);
    };
  }, []);
  if (secsLeft === null) return null;
  const m = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const s = String(secsLeft % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function ShopPage() {
  const [selected, setSelected] = useState("s20");
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(0);
  const variant = VARIANTS.find(v => v.id === selected)!;
  const { add } = useCart();
  const [gemQtys, setGemQtys] = useState<Record<string, number>>({});
  const [gemsOpen, setGemsOpen] = useState(true);
  const [gemLightbox, setGemLightbox] = useState<{ src: string; alt: string } | null>(null);
  const totalGems = Object.values(gemQtys).reduce((sum, n) => sum + n, 0);
  const gemsCost = totalGems * GEM_PRICE;
  function bumpGemQty(id: string, delta: number) {
    setGemQtys(prev => ({ ...prev, [id]: Math.max(0, Math.min(50, (prev[id] ?? 0) + delta)) }));
  }
  const addToCart = () => {
    add({ id: variant.id, label: `DIY Hambakristalli komplekt · ${variant.label}`, price: variant.price }, qty);
    // Gems only ever reach the cart here — alongside the kit, in this same
    // click — so a gem line never exists without one.
    EXTRA_GEM_TYPES.forEach(g => {
      const n = gemQtys[g.id] ?? 0;
      if (n > 0) add({ id: g.id, label: g.label, price: GEM_PRICE }, n);
    });
    setGemQtys({});
  };
  const codeTimer = useCodeTimer();

  // ViewContent / view_item — once per distinct variant selected, not on
  // every re-render (StrictMode double-invokes effects in dev; this ref
  // guard keeps a real re-mount or dev double-fire from double-counting).
  const viewedVariants = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (viewedVariants.current.has(variant.id)) return;
    viewedVariants.current.add(variant.id);
    const contentName = `DIY Hambakristalli komplekt · ${variant.label}`;
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
  }, [variant.id, variant.label, variant.price]);
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
  }, []);;

  return (
    <main className="bb-shop">
      <JsonLd data={productSchema({ price: variant.price })} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={breadcrumbSchema([{ name: "Avaleht", path: "/" }, { name: "Hambakristalli komplekt", path: "/hambakristalli-komplekt" }])} />
      <UrgencyPopup autoOpen={false} />
      <StickyBar price={priceStr(finalPrice)} original={priceStr(variant.original)} onAdd={addToCart} />
      <SiteNav active="komplektid" />

      {/* ── Main buy panel ── */}
      <div className="bb-shop__layout" id="kirjeldus">
        <div className="bb-shop__gallery" id="shop-gallery">
          <div className="bb-shop__img bb-shop__img--main">
            <Image
              src={GALLERY_IMAGES[mainImg]}
              alt="DIY Hambakristalli komplekt"
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
                aria-label={`Vaata pilti ${i + 1}`}
              >
                <Image src={src} alt="" fill sizes="140px" style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        <div className="bb-shop__panel">
          <div className="bb-urgency__viewers">🔥 <span className="bb-urgency__viewers-num">{viewers ?? "–"}</span> inimest vaatab seda toodet praegu</div>
          <h1 className="bb-shop__name">DIY Hambakristalli<br />komplekt.</h1>
          <p className="bb-shop__sub">Swarovski kristallid · Valmistatud Euroopas</p>

          <div className="bb-shop__variants">
            {VARIANTS.map(v => (
              <button key={v.id} className={`bb-shop__variant ${selected === v.id ? "bb-shop__variant--active" : ""}`} onClick={() => setSelected(v.id)}>
                <span className="bb-shop__variant-check">{selected === v.id ? "✓" : ""}</span>
                <span className="bb-shop__variant-label">{v.label}</span>
                <span className="bb-shop__variant-desc">{v.desc}</span>
                <span className="bb-shop__variant-price">{priceStr(v.price)}</span>
              </button>
            ))}
          </div>

          {/* Included crystals */}
          <div className="bb-included">
            <span className="bb-included__label">Komplektis</span>
            <span className="bb-included__value">10× standard Swarovski kristalli</span>
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
                  Lisa ekstra kristalle
                  <span className="bb-extra-gems__badge">Populaarne</span>
                </span>
                <span className="bb-extra-gems__head-right">
                  <span className="bb-extra-gems__rate">{priceStr(GEM_PRICE)}/tk</span>
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
                      aria-label={`Suurenda ${g.label}`}
                      onClick={() => setGemLightbox({ src: g.img, alt: g.label })}
                    >
                      <Image src={g.img} alt={g.label} width={36} height={36} style={{ objectFit: "contain" }} />
                    </button>
                    <span className="bb-extra-gems__name">{g.label}</span>
                  </div>
                  <div className="bb-qty__ctrl bb-qty__ctrl--sm">
                    <button
                      className="bb-qty__btn"
                      onClick={() => bumpGemQty(g.id, -1)}
                      aria-label={`Vähenda ${g.label}`}
                    >
                      <IconMinus />
                    </button>
                    <span className="bb-qty__num">{gemQtys[g.id] ?? 0}</span>
                    <button
                      className="bb-qty__btn"
                      onClick={() => bumpGemQty(g.id, 1)}
                      aria-label={`Suurenda ${g.label}`}
                    >
                      <IconPlus />
                    </button>
                  </div>
                </div>
              ))}
              {gemsOpen && (
                <Link href="/kristallid" className="bb-extra-gems__link">
                  Osta kristalle eraldi, ilma komplekti tellimata →
                </Link>
              )}
            </div>
          )}

          <div className="bb-urgency__bar">
            <div className="bb-urgency__timer">
              <span className="bb-urgency__timer-label">
                {codeTimer ? (
                  <>Sooduskood kehtib veel — saad <strong>−10%</strong> allahindlust</>
                ) : (
                  <>
                    <button
                      className="bb-urgency__gen-trigger"
                      onClick={() => window.dispatchEvent(new CustomEvent("bb:openPopup"))}
                    >
                      Genereeri sooduskood
                    </button>
                    {" "}— saad <strong>−10%</strong> allahindlust
                  </>
                )}
              </span>
              {codeTimer && <span className="bb-urgency__timer-clock">{codeTimer}</span>}
            </div>
            <div className="bb-urgency__stock">⚠ Ainult 3 komplekti laos</div>
          </div>

          {/* Discount code */}
          <div className="bb-discount">
            <div className="bb-discount__row">
              <input
                className="bb-discount__input"
                type="text"
                placeholder="Sooduskood"
                value={code}
                onChange={e => { setCode(e.target.value); setCodeError(false); }}
                onKeyDown={e => e.key === "Enter" && applyCode()}
              />
              <button className="bb-discount__btn" onClick={applyCode}>Rakenda</button>
            </div>
            {codeApplied && <p className="bb-discount__ok">✓ Kood rakendatud — {appliedPct}% soodustus!</p>}
            {codeError && <p className="bb-discount__err">Vigane kood. Proovi uuesti.</p>}
          </div>

          {totalGems > 0 && (
            <div className="bb-extra-gems__summary">
              <span>Ekstra kristallid ({totalGems}×)</span>
              <span>{priceStr(gemsCost)}</span>
            </div>
          )}

          <div className="bb-shop__buy">
            <div className="bb-shop__buy-left">
              <div className="bb-qty__ctrl">
                <button className="bb-qty__btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Vähenda"><IconMinus /></button>
                <span className="bb-qty__num">{qty}</span>
                <button className="bb-qty__btn" onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Suurenda"><IconPlus /></button>
              </div>
              <div className="bb-shop__prices">
                <span className="bb-shop__price">{priceStr(finalPrice)}</span>
                <span className="bb-shop__price-original">{priceStr(variant.original * qty)}</span>
                {codeApplied && <span className="bb-discount__badge">-{appliedPct}%</span>}
              </div>
            </div>
            <Button className="bb-shop__cta" onClick={addToCart}><IconCart />Lisa korvi</Button>
          </div>
          <div className="bb-urgency__shipping">📦 Telli täna enne kell 14.00 – saadame <strong>järgmisel tööpäeval teele</strong>.</div>


          <p className="bb-shop__lead">Kõik vajalik ühes komplektis.</p>
          <p className="bb-shop__desc">Paigalda hambakristallid mugavalt kodus. Komplekt sisaldab kvaliteetseid Swarovski kristalle ning kõiki vajalikke töövahendeid kiireks ja lihtsaks paigalduseks.</p>
          <ul className="bb-shop__features">
            <li>Premium Swarovski kristallid</li>
            <li>Püsib kuni 2–4 nädalat</li>
            <li>Paigaldus umbes 10 minutiga</li>
            <li>Sobib ka algajale</li>
            <li>Ohutu kasutamisel vastavalt juhendile</li>
            <li>Tasuta kohaletoimetamine pakiautomaati</li>
          </ul>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bb-stats-bar">
        {STATS.map((s, i) => (
          <div key={i} className="bb-stats-bar__item">
            <span className="bb-stats-bar__num">{s.num}</span>
            <span className="bb-stats-bar__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── What's in the box ── */}
      <div className="bb-shop-section" id="komplekt">
        <p className="bb-box-label">Kõik ühes komplektis</p>
        <h2 className="bb-shop-section__title">Mida karbist leiad</h2>
        <p className="bb-box-subtitle">Kõik, mida vajad särava tulemuse loomiseks — kvaliteetne, testitud ja hambasõbralik.</p>
        <div className="bb-box-list">
          {BOX_ITEMS.map((item, i) => (
            <div key={i} className="bb-box-row">
              <span className="bb-box-row__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="bb-box-row__body">
                <span className="bb-box-row__name">{item.name}</span>
                <span className="bb-box-row__desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to apply ── */}
      <div className="bb-shop-section bb-shop-section--dark" id="paigaldus">
        <div className="bb-shop-steps__head">
          <h2 className="bb-shop-section__title bb-shop-section__title--light">Kuidas paigaldada</h2>
          <Button href="/juhend" className="bb-shop-steps__guide-btn">
            Vaata juhendit
          </Button>
        </div>
        <div className="bb-shop-steps">
          {STEPS.map(step => (
            <div key={step.n} className="bb-shop-step">
              <div className="bb-shop-step__img">
                <Image
                  src={step.src}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="bb-shop-step__num">{step.n}</span>
              <h3 className="bb-shop-step__title">{step.title}</h3>
              <p className="bb-shop-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Before / After gallery ── */}
      <div className="bb-shop-section">
        <h2 className="bb-shop-section__title">Tulemused</h2>
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
                  alt="Tulemus"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Reviews ── */}
      <ReviewsSlider id="arvustused" heading="Arvustused" />

      {/* ── FAQ ── */}
      <div className="bb-shop-section">
        <h2 className="bb-shop-section__title bb-faq__title">Korduma kippuvad küsimused</h2>
        <FAQ />
      </div>

      {gemLightbox && (
        <ImageLightbox src={gemLightbox.src} alt={gemLightbox.alt} onClose={() => setGemLightbox(null)} />
      )}
    </main>
  );
}
