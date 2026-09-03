// Payment methods the Stripe account actually accepts, in the order they're
// shown as trust badges. Apple Pay and Google Pay arrive through the `card`
// payment method type, so they need no separate Stripe configuration — but
// Apple Pay additionally requires the domain association file served from
// public/.well-known/ and the domain registered on the Stripe account.
export type PaymentMethod = {
  /** Stable id — used as the React key and for any future icon lookup. */
  id: string;
  /** Brand name as it should read to a buyer. */
  label: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "visa", label: "VISA" },
  { id: "mastercard", label: "Mastercard" },
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
];
