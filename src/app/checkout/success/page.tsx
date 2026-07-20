"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import "../checkout.css";

type OrderItem = { name: string; quantity: number; finalPrice: number };

type Order = {
  reference: string;
  currency: string;
  items: OrderItem[];
  subtotal: number;
  discountPct: number;
  deliveryMethod: string;
  deliveryTarget: string;
  deliveryPrice: number;
  grandTotal: number;
  customerName: string;
};

function eur(n: number) {
  return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + " €";
}

function SuccessInner() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const pi = params.get("pi");
  const pending = params.get("status") === "pending";
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  // Payment succeeded — empty the cart.
  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!pi) return;
    fetch(`/api/orders/${pi}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [pi]);

  const discount = order ? Math.round(order.subtotal * (order.discountPct / 100)) : 0;

  return (
    <main className="bb-checkout">
      <div className="bb-checkout__inner bb-checkout__confirm">
        <span className="bb-checkout__confirm-icon">✓</span>
        <h1 className="bb-checkout__confirm-title">Aitäh tellimuse eest!</h1>
        <p className="bb-checkout__confirm-sub">
          {ref ? (
            <>Sinu tellimus <strong>{ref}</strong> on vastu võetud. </>
          ) : (
            <>Sinu tellimus on vastu võetud. </>
          )}
          {pending
            ? "Kinnitame makse laekumise ja saadame kinnituse e-postiga."
            : "Saatsime kinnituse e-postiga ning paneme paki peagi teele."}
        </p>

        {order && (
          <aside className="bb-checkout__summary bb-checkout__confirm-summary">
            <h2 className="bb-checkout__section-title">Tellimuse kokkuvõte</h2>

            <div className="bb-checkout__lines">
              {order.items.map((item, i) => (
                <div key={i} className="bb-checkout__line">
                  <span>{item.name} <span className="bb-checkout__qty">× {item.quantity}</span></span>
                  <span>{eur(item.finalPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="bb-checkout__totals">
              <div className="bb-checkout__total-row"><span>Vahesumma</span><span>{eur(order.subtotal)}</span></div>
              {discount > 0 && (
                <div className="bb-checkout__total-row bb-checkout__total-row--discount">
                  <span>Sooduskood (−{order.discountPct}%)</span><span>−{eur(discount)}</span>
                </div>
              )}
              <div className="bb-checkout__total-row">
                <span>Kohaletoimetamine — {order.deliveryMethod}</span>
                <span>{order.deliveryPrice === 0 ? "Tasuta" : eur(order.deliveryPrice)}</span>
              </div>
              <div className="bb-checkout__total-row bb-checkout__total-row--grand">
                <span>Kokku</span><span>{eur(order.grandTotal)}</span>
              </div>
            </div>

            <p className="bb-checkout__confirm-meta">
              {order.customerName && <><strong>{order.customerName}</strong><br /></>}
              {order.deliveryTarget}
            </p>
          </aside>
        )}

        <Button href="/" arrow>Tagasi avalehele</Button>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
