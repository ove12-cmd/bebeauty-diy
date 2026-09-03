"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

function PayForm({
  amountLabel,
  reference,
  paymentIntentId,
}: {
  amountLabel: string;
  reference: string;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { clear, items } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const successUrl = `/checkout/success?ref=${reference}&pi=${paymentIntentId}`;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}${successUrl}`,
      },
    });

    if (error) {
      setError(error.message ?? "Makse ebaõnnestus. Palun proovi uuesti.");
      setBusy(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Snapshot for the Purchase event fired on /checkout/success — must be
      // written (and items read) before clear() empties the cart below.
      try {
        sessionStorage.setItem(
          "bbLastOrder",
          JSON.stringify({
            order_id: paymentIntent.id,
            // amount_received isn't on @stripe/stripe-js's lighter client type
            // (only the server SDK's) — amount is what was actually charged
            // for a card payment that just reported "succeeded" here.
            value: (paymentIntent.amount ?? 0) / 100,
            currency: "EUR",
            content_ids: items.map((i) => i.id),
          }),
        );
      } catch {
        /* ignore storage errors — Purchase tracking is best-effort */
      }
      clear();
      window.location.href = successUrl;
      return;
    }

    // No paymentIntent and no error means Stripe is navigating away for a
    // redirect step (e.g. 3-D Secure) via return_url — keep the button
    // disabled while that happens.
    if (!paymentIntent) return;

    if (paymentIntent.status === "processing") {
      // The card cleared but settles asynchronously. No Purchase snapshot
      // here — the Stripe webhook fires that once the funds actually land.
      clear();
      window.location.href = `${successUrl}&status=pending`;
      return;
    }

    // Anything else (notably requires_payment_method after a failed
    // confirmation) has to surface, or the buyer is stuck on "Maksan…" with
    // no error and no way forward.
    setError(
      paymentIntent.status === "requires_payment_method"
        ? "Makset ei õnnestunud kinnitada. Palun proovi uuesti või kasuta teist makseviisi."
        : "Makse jäi pooleli. Palun proovi uuesti.",
    );
    setBusy(false);
  }

  return (
    <form onSubmit={handlePay} className="bb-checkout__pay">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p className="bb-checkout__locker-err">{error}</p>}
      <Button type="submit" arrow className="bb-checkout__submit" disabled={busy || !stripe}>
        {busy ? "Maksan…" : `Maksa ${amountLabel}`}
      </Button>
    </form>
  );
}

export default function CheckoutPayment({
  clientSecret,
  amountLabel,
  reference,
  paymentIntentId,
}: {
  clientSecret: string;
  amountLabel: string;
  reference: string;
  paymentIntentId: string;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: "et",
        // Stripe renders the Payment Element in its own iframe, so it can't
        // see our self-hosted next/font file — it must load the font itself.
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@6..96,200..800&display=swap",
          },
        ],
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#c9a24b",
            colorText: "#1a1a1a",
            fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
            borderRadius: "10px",
          },
        },
      }}
    >
      <PayForm amountLabel={amountLabel} reference={reference} paymentIntentId={paymentIntentId} />
    </Elements>
  );
}
