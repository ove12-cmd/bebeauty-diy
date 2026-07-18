"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

function PayForm({ amountLabel, reference }: { amountLabel: string; reference: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?ref=${reference}`,
      },
    });

    if (error) {
      setError(error.message ?? "Makse ebaõnnestus. Palun proovi uuesti.");
      setBusy(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      clear();
      window.location.href = `/checkout/success?ref=${reference}`;
      return;
    }
    // Otherwise Stripe handled a redirect (e.g. 3-D Secure) via return_url.
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
}: {
  clientSecret: string;
  amountLabel: string;
  reference: string;
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
      <PayForm amountLabel={amountLabel} reference={reference} />
    </Elements>
  );
}
