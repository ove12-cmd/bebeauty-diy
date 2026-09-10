// Payment methods the Stripe account actually accepts, in the order they're
// shown as trust badges. Apple Pay and Google Pay arrive through the `card`
// payment method type, so they need no separate Stripe configuration — but
// Apple Pay additionally requires the domain association file served from
// public/.well-known/ and the domain registered on the Stripe account.
export type PaymentMethod = {
  /** Stable id — used as the React key and for any future icon lookup. */
  id: string;
  /** Brand name as it should read to a buyer (used as the icon's alt text). */
  label: string;
  /** Brand mark, from public/. Each ships on its own white chip in
   *  PaymentMethods.tsx, so a JPG's opaque background (Google Pay) reads the
   *  same as a transparent PNG's (Visa/Mastercard/Apple Pay). */
  icon: string;
  /** Intrinsic width/height so next/image can size without layout shift. */
  width: number;
  height: number;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "visa", label: "VISA", icon: "/visa-logo-1536x864-1.png", width: 1536, height: 864 },
  { id: "mastercard", label: "Mastercard", icon: "/mastercard.png", width: 568, height: 352 },
  { id: "apple-pay", label: "Apple Pay", icon: "/applepay.png", width: 697, height: 286 },
  { id: "google-pay", label: "Google Pay", icon: "/google-pay.jpg", width: 576, height: 216 },
];
