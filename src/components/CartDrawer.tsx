"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useDiscountPct } from "@/hooks/useDiscountPct";
import { useTranslations } from "next-intl";

const money = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + "€";
const round2 = (n: number) => Math.round(n * 100) / 100;

export default function CartDrawer() {
  const t = useTranslations("cart");
  const { items, isOpen, close, remove, setQty, subtotal, count } = useCart();
  const discountPct = useDiscountPct();

  if (!isOpen) return null;

  const hasDiscount = discountPct > 0;
  const discountedTotal = round2(subtotal * (1 - discountPct / 100));
  const discountAmount = round2(subtotal - discountedTotal);

  return (
    <div className="bb-cart-overlay" onClick={close}>
      <aside
        className="bb-cart"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t("ariaLabel")}
      >
        <div className="bb-cart__head">
          <h2 className="bb-cart__title">{t("title")}{count > 0 ? ` (${count})` : ""}</h2>
          <button className="bb-cart__close" onClick={close} aria-label={t("close")}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="bb-cart__empty">
            <p>{t("empty")}</p>
            <Button href="/tooth-gem-kit" onClick={close}>{t("viewKits")}</Button>
          </div>
        ) : (
          <>
            <div className="bb-cart__items">
              {items.map((item) => (
                <div key={item.id} className="bb-cart-item">
                  <div className="bb-cart-item__info">
                    <span className="bb-cart-item__label">{item.label}</span>
                    <span className="bb-cart-item__price">
                      {hasDiscount && (
                        <span className="bb-cart-item__price-original">
                          {money(item.price * item.qty)}
                        </span>
                      )}
                      {money(round2(item.price * item.qty * (1 - discountPct / 100)))}
                    </span>
                  </div>
                  <div className="bb-cart-item__controls">
                    <div className="bb-cart-item__qty">
                      <button onClick={() => setQty(item.id, item.qty - 1)} aria-label={t("decreaseQty")}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} aria-label={t("increaseQty")}>+</button>
                    </div>
                    <button className="bb-cart-item__remove" onClick={() => remove(item.id)}>
                      {t("remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bb-cart__foot">
              {hasDiscount && (
                <>
                  <div className="bb-cart__row">
                    <span>{t("subtotal")}</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="bb-cart__row bb-cart__row--discount">
                    <span>{t("discountCode", { pct: discountPct })}</span>
                    <span>−{money(discountAmount)}</span>
                  </div>
                </>
              )}
              <div className="bb-cart__subtotal">
                <span>{hasDiscount ? t("total") : t("subtotal")}</span>
                <span>{money(hasDiscount ? discountedTotal : subtotal)}</span>
              </div>
              <p className="bb-cart__note">
                {hasDiscount ? t("noteWithDiscount") : t("noteWithoutDiscount")}
              </p>
              <Button href="/checkout" className="bb-cart__checkout" onClick={close}>
                {t("checkout")}
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
