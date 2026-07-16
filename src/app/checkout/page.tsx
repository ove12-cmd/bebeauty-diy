"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { searchLockers, type Locker } from "@/lib/lockers";
import { useEffect, useMemo, useState } from "react";
import "./checkout.css";

const DELIVERY = [
  { id: "omniva", label: "Omniva pakiautomaat", price: 0, note: "Tasuta · 1–2 tööpäeva" },
  { id: "courier", label: "Kuller koju", price: 3.9, note: "3,90 € · 1–3 tööpäeva" },
];

function eur(n: number) {
  return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + " €";
}

export default function CheckoutPage() {
  const { items, subtotal, count, clear } = useCart();
  const [discountPct, setDiscountPct] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    delivery: "omniva",
    street: "",
    city: "",
    zip: "",
  });
  const [placed, setPlaced] = useState(false);
  const [orderNr, setOrderNr] = useState("");

  // Locker picker state
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [lockersState, setLockersState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [query, setQuery] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [manualLocker, setManualLocker] = useState("");
  const [lockerError, setLockerError] = useState(false);

  useEffect(() => {
    const pct = Number(localStorage.getItem("bbDiscountPct") || 0);
    if (pct > 0) setDiscountPct(pct);
  }, []);

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

  const delivery = DELIVERY.find((d) => d.id === form.delivery)!;
  const discount = Math.round(subtotal * (discountPct / 100));
  const total = Math.max(0, subtotal - discount) + delivery.price;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.delivery === "omniva" && !selectedLocker && !manualLocker.trim()) {
      setLockerError(true);
      return;
    }
    // TODO: create the order + take payment here (Stripe / Montonio / pangalink).
    setOrderNr("BB-" + Date.now().toString().slice(-6));
    setPlaced(true);
    clear();
  }

  if (placed) {
    return (
      <main className="bb-checkout">
        <div className="bb-checkout__inner bb-checkout__confirm">
          <span className="bb-checkout__confirm-icon">✓</span>
          <h1 className="bb-checkout__confirm-title">Aitäh tellimuse eest!</h1>
          <p className="bb-checkout__confirm-sub">
            Sinu tellimus <strong>{orderNr}</strong> on vastu võetud. Saadame kinnituse e-postiga
            ning paneme paki peagi teele.
          </p>
          <Button href="/" arrow>Tagasi avalehele</Button>
        </div>
      </main>
    );
  }

  if (count === 0) {
    return (
      <main className="bb-checkout">
        <div className="bb-checkout__inner bb-checkout__empty">
          <h1 className="bb-checkout__title">Ostukorv on tühi</h1>
          <p>Lisa komplekt korvi, et tellimus vormistada.</p>
          <Button href="/shop" arrow>Vaata komplekte</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bb-checkout">
      <div className="bb-checkout__inner">
        <Link href="/shop" className="bb-checkout__back">← Tagasi poodi</Link>
        <h1 className="bb-checkout__title">Vormista tellimus</h1>

        <div className="bb-checkout__grid">
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

            <Button type="submit" arrow className="bb-checkout__submit">Esita tellimus</Button>
            <p className="bb-checkout__fine">Esitades tellimuse nõustud meie tingimustega. Makse toimub järgmises sammus.</p>
          </form>

          <aside className="bb-checkout__summary">
            <h2 className="bb-checkout__section-title">Sinu tellimus</h2>
            <div className="bb-checkout__lines">
              {items.map((i) => (
                <div key={i.id} className="bb-checkout__line">
                  <span>{i.label} <span className="bb-checkout__qty">× {i.qty}</span></span>
                  <span>{eur(i.price * i.qty)}</span>
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
          </aside>
        </div>
      </div>
    </main>
  );
}
