"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import "../checkout.css";

function SuccessInner() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const pending = params.get("status") === "pending";
  const { clear } = useCart();

  // Payment succeeded — empty the cart.
  useEffect(() => {
    clear();
  }, [clear]);

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
