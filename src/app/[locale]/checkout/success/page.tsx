"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { trackMeta } from "@/lib/meta-pixel";
import { deliveryMethodLabel, formatDeliveryTarget } from "@/lib/pricing";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import "../checkout.css";

type OrderSnapshot = { order_id: string; value: number; currency: string; content_ids: string[] };

type OrderItem = { name: string; quantity: number; finalPrice: number };

type Order = {
  reference: string;
  currency: string;
  items: OrderItem[];
  subtotal: number;
  discountPct: number;
  deliveryMethod: string;
  deliveryLocker: string;
  deliveryStreet: string;
  deliveryCity: string;
  deliveryZip: string;
  deliveryPrice: number;
  grandTotal: number;
  customerName: string;
};

function eur(n: number) {
  return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + " €";
}

function SuccessInner() {
  const locale = useLocale() as "en" | "et";
  const t = useTranslations("checkoutSuccess");
  const tCart = useTranslations("cart");
  const tCheckout = useTranslations("checkout");
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

  // Purchase — fires exactly once per completed order. Absence of the
  // snapshot (already-removed, or a refresh/direct hit) means "do nothing",
  // which is what prevents double-counting.
  const purchaseFired = useRef(false);
  useEffect(() => {
    if (purchaseFired.current) return;
    purchaseFired.current = true;
    const raw = sessionStorage.getItem("bbLastOrder");
    if (!raw) return;
    sessionStorage.removeItem("bbLastOrder");
    try {
      const snap = JSON.parse(raw) as OrderSnapshot;
      trackMeta(
        "Purchase",
        {
          content_ids: snap.content_ids,
          content_type: "product",
          value: snap.value,
          currency: snap.currency,
          order_id: snap.order_id,
        },
        snap.order_id,
      );
    } catch {
      /* ignore a malformed snapshot */
    }
  }, []);

  useEffect(() => {
    if (!pi) return;
    fetch(`/api/orders/${pi}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [pi]);

  const discount = order ? Math.round(order.subtotal * (order.discountPct / 100) * 100) / 100 : 0;

  return (
    <main className="bb-checkout">
      <div className="bb-checkout__inner bb-checkout__confirm">
        <span className="bb-checkout__confirm-icon">✓</span>
        <h1 className="bb-checkout__confirm-title">{t("title")}</h1>
        <p className="bb-checkout__confirm-sub">
          {ref ? (
            <>{t.rich("orderReceived", { ref, strong: (chunks) => <strong>{chunks}</strong> })} </>
          ) : (
            <>{t("orderReceivedNoRef")} </>
          )}
          {pending ? t("pendingNote") : t("confirmedNote")}
        </p>

        {order && (
          <aside className="bb-checkout__summary bb-checkout__confirm-summary">
            <h2 className="bb-checkout__section-title">{t("summaryTitle")}</h2>

            <div className="bb-checkout__lines">
              {order.items.map((item, i) => (
                <div key={i} className="bb-checkout__line">
                  <span>{item.name} <span className="bb-checkout__qty">× {item.quantity}</span></span>
                  <span>{eur(item.finalPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="bb-checkout__totals">
              <div className="bb-checkout__total-row"><span>{tCart("subtotal")}</span><span>{eur(order.subtotal)}</span></div>
              {discount > 0 && (
                <div className="bb-checkout__total-row bb-checkout__total-row--discount">
                  <span>{tCart("discountCode", { pct: order.discountPct })}</span><span>−{eur(discount)}</span>
                </div>
              )}
              <div className="bb-checkout__total-row">
                <span>{t("deliveryPrefix", { method: deliveryMethodLabel(locale, order.deliveryMethod) })}</span>
                <span>{order.deliveryPrice === 0 ? tCheckout("free") : eur(order.deliveryPrice)}</span>
              </div>
              <div className="bb-checkout__total-row bb-checkout__total-row--grand">
                <span>{tCart("total")}</span><span>{eur(order.grandTotal)}</span>
              </div>
            </div>

            <p className="bb-checkout__confirm-meta">
              {order.customerName && <><strong>{order.customerName}</strong><br /></>}
              {formatDeliveryTarget(locale, {
                method: order.deliveryMethod,
                locker: order.deliveryLocker,
                street: order.deliveryStreet,
                city: order.deliveryCity,
                zip: order.deliveryZip,
              })}
            </p>
          </aside>
        )}

        <Button href="/">{t("backHome")}</Button>
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
