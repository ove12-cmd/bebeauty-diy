"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

export default function CartDrawer() {
  const { items, isOpen, close, remove, setQty, subtotal, count } = useCart();

  if (!isOpen) return null;

  return (
    <div className="bb-cart-overlay" onClick={close}>
      <aside
        className="bb-cart"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ostukorv"
      >
        <div className="bb-cart__head">
          <h2 className="bb-cart__title">Ostukorv{count > 0 ? ` (${count})` : ""}</h2>
          <button className="bb-cart__close" onClick={close} aria-label="Sulge">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="bb-cart__empty">
            <p>Sinu ostukorv on tühi.</p>
            <Button href="/shop" onClick={close} arrow>Vaata komplekte</Button>
          </div>
        ) : (
          <>
            <div className="bb-cart__items">
              {items.map((item) => (
                <div key={item.id} className="bb-cart-item">
                  <div className="bb-cart-item__info">
                    <span className="bb-cart-item__label">{item.label}</span>
                    <span className="bb-cart-item__price">{item.price * item.qty}€</span>
                  </div>
                  <div className="bb-cart-item__controls">
                    <div className="bb-cart-item__qty">
                      <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Vähenda">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Suurenda">+</button>
                    </div>
                    <button className="bb-cart-item__remove" onClick={() => remove(item.id)}>
                      Eemalda
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bb-cart__foot">
              <div className="bb-cart__subtotal">
                <span>Vahesumma</span>
                <span>{subtotal}€</span>
              </div>
              <p className="bb-cart__note">Tasuta tarne · sooduskood lisatakse vormistamisel</p>
              <Button href="/checkout" className="bb-cart__checkout" onClick={close} arrow>
                Vormista tellimus
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
