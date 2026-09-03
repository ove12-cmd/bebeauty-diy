"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import CheckoutPayment from "@/components/CheckoutPayment";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutTrustFooter from "@/components/checkout/CheckoutTrustFooter";
import OrderDetailsRecap from "@/components/checkout/OrderDetailsRecap";
import { COMPANY } from "@/lib/company";
import { CHECKOUT_REVIEW } from "@/lib/reviews";
import { useCart } from "@/hooks/useCart";
import { searchLockers, type Locker } from "@/lib/lockers";
import { FREE_SHIPPING_GEM_THRESHOLD, discountPctForCode, isGemId, isGemOnlyOrder } from "@/lib/pricing";
import { trackMeta, CURRENCY } from "@/lib/meta-pixel";
import { trackGA4, getGaIds } from "@/lib/ga4";
import { useEffect, useMemo, useRef, useState } from "react";
import "./checkout.css";

// Mirrors lib/pricing.ts's priceOrder() — a crystals-only order pays the
// courier rate for Omniva too, unless it clears the free-shipping threshold.
function deliveryOptions(gemOnly: boolean, freeShipping: boolean) {
  return [
    gemOnly && !freeShipping
      ? { id: "omniva", label: "Omniva pakiautomaat", price: 3.9, note: "3,90 € · 1–2 tööpäeva" }
      : { id: "omniva", label: "Omniva pakiautomaat", price: 0, note: "Tasuta · 1–2 tööpäeva" },
    { id: "courier", label: "Kuller koju", price: 3.9, note: "3,90 € · 1–3 tööpäeva" },
  ];
}

function eur(n: number) {
  return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + " €";
}

export default function CheckoutPage() {
  const { items, subtotal, count } = useCart();
  const gemOnly = isGemOnlyOrder(items.map((i) => i.id));
  const totalGems = gemOnly ? items.reduce((sum, i) => sum + i.qty, 0) : 0;
  const freeShipping = totalGems >= FREE_SHIPPING_GEM_THRESHOLD;
  const DELIVERY = deliveryOptions(gemOnly, freeShipping);
  const [discountCode, setDiscountCode] = useState("");
  const discountPct = discountPctForCode(discountCode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    delivery: "omniva",
    street: "",
    city: "",
    zip: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  // Locker picker state
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [lockersState, setLockersState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [query, setQuery] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [manualLocker, setManualLocker] = useState("");
  const [lockerError, setLockerError] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem("bbDiscountCode") || "";
    if (code) setDiscountCode(code);
    const p = new URLSearchParams(window.location.search).get("payment");
    if (p === "failed" || p === "cancelled") {
      setPayError(true);
    }
  }, []);

  // InitiateCheckout — once per visit, only once the cart has actually
  // hydrated from localStorage (count is 0 for a tick before that).
  const initiateCheckoutFired = useRef(false);
  useEffect(() => {
    if (initiateCheckoutFired.current || count === 0) return;
    initiateCheckoutFired.current = true;
    trackMeta("InitiateCheckout", {
      content_ids: items.map((i) => i.id),
      content_type: "product",
      value: subtotal,
      num_items: count,
      currency: CURRENCY,
    });
  }, [count, items, subtotal]);

  // Fetch Omniva lockers the first time the parcel-machine option is active.
  useEffect(() => {
    if (form.delivery !== "omniva" || lockersState !== "idle") return;
    setLockersState("loading");
    fetch("/api/lockers")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!Array.isArray(data)) throw new Error();
        setLockers(data);
        setLockersState("ready");
      })
      .catch(() => setLockersState("error"));
  }, [form.delivery, lockersState]);

  const results = useMemo(() => searchLockers(lockers, query), [lockers, query]);

  // Which step the buyer is actually on, derived from real progress rather
  // than tracked separately: contact details filled moves them to Tarne, and
  // a client secret means the PaymentIntent exists and they're on Makse.
  const step: 1 | 2 | 3 = clientSecret ? 3 : form.name && form.email && form.phone ? 2 : 1;

  const delivery = DELIVERY.find((d) => d.id === form.delivery)!;
  // Extra gems never get the discount code — only kit lines are discountable.
  const discountableSubtotal = items.filter((i) => !isGemId(i.id)).reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = Math.round(discountableSubtotal * (discountPct / 100) * 100) / 100;
  const total = Math.max(0, subtotal - discount) + delivery.price;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.delivery === "omniva" && !selectedLocker && !manualLocker.trim()) {
      setLockerError(true);
      return;
    }
    setSubmitting(true);
    setPayError(false);

    // begin_checkout fires here — the moment the buyer submits their info,
    // not on page load (that's InitiateCheckout above) — then we read GA4's
    // own client_id/session_id so the webhook's later server-side purchase
    // hit (Stripe Checkout has no equivalent redirect here, but SCA/3-D
    // Secure can still take the buyer off-site) attributes to this session.
    trackGA4("begin_checkout", {
      currency: CURRENCY,
      value: subtotal,
      items: items.map((i) => ({ item_id: i.id, item_name: i.label, price: i.price, quantity: i.qty })),
    });
    const gaIds = await getGaIds();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, label: i.label, qty: i.qty })),
          discountCode,
          delivery: form.delivery,
          contact: { name: form.name, email: form.email, phone: form.phone },
          locker: form.delivery === "omniva" ? selectedLocker?.name ?? manualLocker.trim() : null,
          address:
            form.delivery === "courier"
              ? { street: form.street, city: form.city, zip: form.zip }
              : null,
          gaClientId: gaIds.clientId,
          gaSessionId: gaIds.sessionId,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (!data.clientSecret) throw new Error();
      setClientSecret(data.clientSecret);
      setReference(data.reference);
      setPaymentIntentId(data.paymentIntentId);
      setSubmitting(false);
    } catch {
      setPayError(true);
      setSubmitting(false);
    }
  }

  if (count === 0) {
    return (
      <main className="bb-checkout">
        <div className="bb-checkout__inner bb-checkout__empty">
          <h1 className="bb-checkout__title">Ostukorv on tühi</h1>
          <p>Lisa tooteid ostukorvi, et tellimus vormistada.</p>
          <Button href="/hambakristalli-komplekt" arrow>Vaata tooteid</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bb-checkout">
      <div className="bb-checkout__inner">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--bb-line)] pb-3">
          <Link
            href="/hambakristalli-komplekt"
            className="text-sm font-medium tracking-[-0.2px] text-[var(--bb-ink)] no-underline"
          >
            {COMPANY.name}
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--bb-ink-3)]">
            <svg
              aria-hidden="true"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Turvaline ostukeskkond
          </span>
        </div>

        <CheckoutSteps current={step} />
        <h1 className="bb-checkout__title">Vormista tellimus</h1>

        <div className={`bb-checkout__grid${clientSecret ? " is-paying" : ""}`}>
          {clientSecret ? (
            <div className="bb-checkout__form">
              <h2 className="bb-checkout__section-title">Maksmine</h2>
              <p className="mb-3.5 flex items-start gap-1.5 text-[11px] leading-snug text-[var(--bb-ink-2)]">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-px shrink-0 text-[var(--bb-ink-3)]"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Makseid töötleb Stripe. Me ei näe ega salvesta su kaardiandmeid.
              </p>
              <CheckoutPayment
                clientSecret={clientSecret}
                amountLabel={eur(total)}
                reference={reference}
                paymentIntentId={paymentIntentId}
              />
              <p className="mt-2 text-center text-[11px] leading-relaxed text-[var(--bb-ink-2)]">
                Saadame kauba välja järgmisel tööpäeval ·{" "}
                <Link href="/tingimused" className="text-[var(--bb-gold-deep)] underline hover:no-underline">
                  müügitingimused
                </Link>
              </p>
            </div>
          ) : (
          <form className="bb-checkout__form" onSubmit={handleSubmit}>
            <h2 className="bb-checkout__section-title">Kontaktandmed</h2>
            <div className="bb-checkout__field">
              <label htmlFor="co-name">Nimi</label>
              <input id="co-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ees- ja perekonnanimi" />
            </div>
            <div className="bb-checkout__row">
              <div className="bb-checkout__field">
                <label htmlFor="co-email">E-post</label>
                <input id="co-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sinu@email.ee" />
              </div>
              <div className="bb-checkout__field">
                <label htmlFor="co-phone">Telefon</label>
                <input id="co-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+372 5xxx xxxx" />
              </div>
            </div>

            <h2 className="bb-checkout__section-title">Kohaletoimetamine</h2>
            <div className="bb-checkout__delivery">
              {DELIVERY.map((d) => (
                <label key={d.id} className={`bb-checkout__delivery-opt ${form.delivery === d.id ? "is-active" : ""}`}>
                  <input type="radio" name="delivery" value={d.id} checked={form.delivery === d.id} onChange={() => setForm({ ...form, delivery: d.id })} />
                  <span className="bb-checkout__delivery-label">{d.label}</span>
                  <span className="bb-checkout__delivery-note">{d.note}</span>
                </label>
              ))}
            </div>

            {form.delivery === "omniva" ? (
              <div className="bb-checkout__lockers">
                <label htmlFor="co-locker" className="bb-checkout__locker-label">Vali pakiautomaat</label>

                {selectedLocker ? (
                  <div className="bb-checkout__locker-selected">
                    <div>
                      <span className="bb-checkout__locker-name">{selectedLocker.name}</span>
                      <span className="bb-checkout__locker-meta">{selectedLocker.city}{selectedLocker.county ? `, ${selectedLocker.county}` : ""}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedLocker(null)}>Muuda</button>
                  </div>
                ) : lockersState === "error" ? (
                  <input
                    id="co-locker"
                    className="bb-checkout__locker-search"
                    value={manualLocker}
                    onChange={(e) => { setManualLocker(e.target.value); setLockerError(false); }}
                    placeholder="Sisesta pakiautomaadi nimi"
                  />
                ) : (
                  <>
                    <input
                      id="co-locker"
                      className="bb-checkout__locker-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Sisesta linn või sihtnumber"
                      autoComplete="off"
                    />
                    {lockersState === "loading" && <p className="bb-checkout__locker-hint">Laen pakiautomaate…</p>}
                    {lockersState === "ready" && query.trim().length < 2 && (
                      <p className="bb-checkout__locker-hint">Alusta trükkimist, et leida lähim pakiautomaat.</p>
                    )}
                    {lockersState === "ready" && query.trim().length >= 2 && results.length === 0 && (
                      <p className="bb-checkout__locker-hint">Ühtegi pakiautomaati ei leitud.</p>
                    )}
                    {lockersState === "ready" && results.length > 0 && (
                      <ul className="bb-checkout__locker-list">
                        {results.map((l) => (
                          <li key={l.id}>
                            <button
                              type="button"
                              className="bb-checkout__locker-item"
                              onClick={() => { setSelectedLocker(l); setLockerError(false); }}
                            >
                              <span className="bb-checkout__locker-name">{l.name}</span>
                              <span className="bb-checkout__locker-meta">{l.city}{l.county ? `, ${l.county}` : ""}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
                {lockerError && <p className="bb-checkout__locker-err">Palun vali pakiautomaat.</p>}
              </div>
            ) : (
              <>
                <div className="bb-checkout__field">
                  <label htmlFor="co-street">Aadress</label>
                  <input id="co-street" required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Tänav ja maja number" />
                </div>
                <div className="bb-checkout__row">
                  <div className="bb-checkout__field">
                    <label htmlFor="co-city">Linn</label>
                    <input id="co-city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Linn / vald" />
                  </div>
                  <div className="bb-checkout__field">
                    <label htmlFor="co-zip">Sihtnumber</label>
                    <input id="co-zip" required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="12345" />
                  </div>
                </div>
              </>
            )}

            <div className="mb-4 flex items-center gap-2 rounded-lg bg-[var(--bb-ok-bg)] px-3 py-2.5 text-[11px] leading-snug text-[var(--bb-ok-ink)]">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                <circle cx="6.5" cy="18" r="1.8" />
                <circle cx="17.5" cy="18" r="1.8" />
              </svg>
              <span>
                Telli enne kell <span className="font-medium">14.00</span> — saadame järgmisel päeval teele.
              </span>
            </div>

            {payError && (
              <p className="bb-checkout__locker-err">Makse jäi pooleli. Palun proovi uuesti.</p>
            )}
            <Button type="submit" arrow className="bb-checkout__submit" disabled={submitting}>
              {submitting ? "Palun oota…" : "Jätka maksmiseni"}
            </Button>
            <p className="bb-checkout__fine">Esitades tellimuse nõustud meie tingimustega. Järgmises sammus sisestad kaardiandmed.</p>
          </form>
          )}

          <aside className="bb-checkout__summary">
            <h2 className="bb-checkout__section-title">Sinu tellimus</h2>
            <div className="bb-checkout__lines">
              {items.map((i) => (
                <div key={i.id} className="flex items-start gap-2.5 py-1.5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--bb-chip-bg)] text-[var(--bb-gold-deep)]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3 2 9.5 12 21 22 9.5 12 3Z" />
                      <path d="M2 9.5h20M12 3v18" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">
                    {i.label}
                    <span className="bb-checkout__qty block">kogus {i.qty}</span>
                  </span>
                  <span className="whitespace-nowrap">{eur(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="bb-checkout__totals">
              <div className="bb-checkout__total-row"><span>Vahesumma</span><span>{eur(subtotal)}</span></div>
              {discount > 0 && (
                <div className="bb-checkout__total-row bb-checkout__total-row--discount">
                  <span>Sooduskood (−{discountPct}%)</span><span>−{eur(discount)}</span>
                </div>
              )}
              <div className="bb-checkout__total-row"><span>Kohaletoimetamine</span><span>{delivery.price === 0 ? "Tasuta" : eur(delivery.price)}</span></div>
              <div className="bb-checkout__total-row bb-checkout__total-row--grand"><span>Kokku</span><span>{eur(total)}</span></div>
            </div>

            {clientSecret ? (
              // At the pay step the form is gone, so recap what they entered
              // rather than a review — the open question is now "is this
              // going to the right place?", not "is this product any good?".
              <OrderDetailsRecap
                name={form.name}
                email={form.email}
                phone={form.phone}
                deliveryLabel={delivery.label}
                deliveryTarget={
                  form.delivery === "omniva"
                    ? selectedLocker?.name ?? manualLocker.trim()
                    : [form.street, form.city, form.zip].filter(Boolean).join(", ")
                }
                onEdit={() => setClientSecret(null)}
              />
            ) : (
              <figure className="mt-2.5 rounded-xl border border-[var(--bb-line)] bg-[var(--bb-paper)] p-3.5">
                <div aria-hidden="true" className="mb-1.5 text-xs tracking-[0.15em] text-[var(--bb-gold)]">
                  ★★★★★
                </div>
                <blockquote className="text-[11px] italic leading-relaxed text-[var(--bb-ink-2)]">
                  {CHECKOUT_REVIEW.text}
                </blockquote>
                <figcaption className="mt-1.5 text-[10px] text-[var(--bb-ink-3)]">
                  {CHECKOUT_REVIEW.name} · {CHECKOUT_REVIEW.date}
                </figcaption>
              </figure>
            )}
          </aside>
        </div>

        <CheckoutTrustFooter />
      </div>
    </main>
  );
}
