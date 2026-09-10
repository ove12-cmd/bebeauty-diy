// Canonical, server-authoritative pricing.
// The browser can send anything — the checkout API recomputes every total
// from these values so a tampered cart price can never reach the payment step.

export const CURRENCY = "EUR";

// Extra crystals, purchasable only alongside a kit — the product page adds
// them to the cart in the same click as the kit itself, so a gem line never
// reaches checkout on its own.
export const GEM_PRICE = 1;

// Buying crystals with no kit, on /crystals — priced separately from the
// bundled add-on above.
export const STANDALONE_GEM_PRICE = 2;

export const EXTRA_GEM_TYPES = [
  { id: "gem-clear", label: "Swarovski Clear Crystal", img: "/crystals/gem-clear.jpg" },
  { id: "gem-ab", label: "Swarovski Borealis", img: "/crystals/gem-ab.jpg" },
  { id: "gem-ab-butterfly", label: "Swarovski Borealis Butterfly", img: "/crystals/gem-ab-butterfly.jpg" },
] as const;

// Sizes for the standalone /crystals page only — same labels as the kit's
// own VARIANTS, but a distinct id shape (gem id + size id) so they can
// never collide with a bare kit id like "s20".
export const GEM_SIZES = [
  { id: "s17", label: "1.7mm" },
  { id: "s20", label: "2.0mm" },
  { id: "s23", label: "2.3mm" },
] as const;

export function gemSizeId(gemId: string, sizeId: string): string {
  return `${gemId}-${sizeId}`;
}

// Variant id → unit price (€). Mirrors VARIANTS in src/app/tooth-gem-kit/page.tsx.
export const VARIANT_PRICES: Record<string, number> = {
  s17: 35,
  s20: 35,
  s23: 35,
  ...Object.fromEntries(EXTRA_GEM_TYPES.map((g) => [g.id, GEM_PRICE])),
  ...Object.fromEntries(
    EXTRA_GEM_TYPES.flatMap((g) => GEM_SIZES.map((s) => [gemSizeId(g.id, s.id), STANDALONE_GEM_PRICE])),
  ),
};

const GEM_IDS: Set<string> = new Set([
  ...EXTRA_GEM_TYPES.map((g) => g.id),
  ...EXTRA_GEM_TYPES.flatMap((g) => GEM_SIZES.map((s) => gemSizeId(g.id, s.id))),
]);

// Buying crystals with no kit in the order — the /crystals page enforces
// all of these client-side; priceOrder() re-checks them server-side too.
export const MIN_STANDALONE_GEMS = 10;
export const FREE_SHIPPING_GEM_THRESHOLD = 20;

export function isGemId(id: string): boolean {
  return GEM_IDS.has(id);
}

export function isGemOnlyOrder(ids: string[]): boolean {
  return ids.length > 0 && ids.every(isGemId);
}

// Auto-generated marketing codes (see UrgencyPopup) — always the standard
// rate. Kept per-locale so the popup can hand out a code that reads like a
// pun in whichever language the shopper is browsing; a code generated in
// one locale still works if checkout happens in the other (ALL_FUNNY_CODES
// below is the flattened, server-authoritative lookup).
export const FUNNY_DISCOUNT_CODES: Record<"en" | "et", readonly string[]> = {
  en: [
    "BB-TOOTHFAIRY",
    "BB-GOLDGRIN",
    "BB-SPARKLEFANG",
    "BB-BUMBLEBLING",
    "BB-GLOWGETTER",
    "BB-GOLDTOOTH",
    "BB-GRINNIN",
    "BB-GEMGRIN",
    "BB-DAZZLEMOUTH",
    "BB-BLINGSTAR",
  ],
  et: [
    "BB-HAMBAKE",
    "BB-KULLAKE",
    "BB-SÄRASILM",
    "BB-KIMALANE",
    "BB-HELKUR",
    "BB-KULDHAMMAS",
    "BB-NAERATA",
    "BB-KRISTALL",
    "BB-HIILGUS",
    "BB-BLINGSTAR",
  ],
};

const ALL_FUNNY_CODES: readonly string[] = [
  ...FUNNY_DISCOUNT_CODES.en,
  ...FUNNY_DISCOUNT_CODES.et,
];

export const STANDARD_DISCOUNT_PCT = 10;

// Server-authoritative code → discount % lookup. The client only ever sends
// the code string, never a percentage — the server decides the discount.
export const DISCOUNT_CODES: Record<string, number> = {
  BEBEAUTY10: STANDARD_DISCOUNT_PCT,
  ...Object.fromEntries(ALL_FUNNY_CODES.map((c) => [c, STANDARD_DISCOUNT_PCT])),
  TEST95: 95, // internal testing only — not shown in any customer-facing UI
};

export function discountPctForCode(code?: string | null): number {
  if (!code) return 0;
  return DISCOUNT_CODES[code.trim().toUpperCase()] ?? 0;
}

// True only for codes the popup itself can generate — never for BEBEAUTY10,
// internal test codes, or anything else someone might type into the box.
// Gates the time-limited ticker/popup-restore UI specifically. Checked
// against both locales' lists, since a code generated in one locale must
// still be recognised if the shopper (or their saved localStorage state)
// comes back under the other.
export function isGeneratedMarketingCode(code?: string | null): boolean {
  if (!code) return false;
  return ALL_FUNNY_CODES.includes(code.trim().toUpperCase());
}

// Delivery price by method — locale-neutral. The customer-facing label is
// translated at render time (checkout, order-success page, confirmation
// email) from this same `id`, never pre-formatted and stored: a label baked
// into Stripe metadata at order time would be stuck in whatever language it
// was created in, since PaymentIntent metadata is immutable after creation.
export const DELIVERY: Record<string, { price: number }> = {
  omniva: { price: 0 },
  courier: { price: 3.9 },
};

type SupportedLocale = "en" | "et";

const DELIVERY_METHOD_LABEL: Record<SupportedLocale, Record<string, string>> = {
  en: { omniva: "Omniva parcel locker", courier: "Courier to your door" },
  et: { omniva: "Omniva pakiautomaat", courier: "Kuller koju" },
};

/** Human-readable name of a delivery method, e.g. for a totals line. */
export function deliveryMethodLabel(locale: SupportedLocale, method: string): string {
  return DELIVERY_METHOD_LABEL[locale]?.[method] ?? method;
}

export type DeliveryDetails = {
  method: string;
  locker?: string;
  street?: string;
  city?: string;
  zip?: string;
};

const DELIVERY_TARGET_TEXT: Record<SupportedLocale, { locker: (name: string) => string; courier: (address: string) => string }> = {
  en: {
    locker: (name) => `Parcel locker: ${name}`,
    courier: (address) => `Courier: ${address}`,
  },
  et: {
    locker: (name) => `Pakiautomaat: ${name}`,
    courier: (address) => `Kuller: ${address}`,
  },
};

/**
 * The specific drop-off point/address line shown under the order summary
 * and in the confirmation email — e.g. "Parcel locker: Tallinn Kristiine".
 * Built from the raw fields stored on the order (never a pre-formatted
 * sentence — see the DELIVERY comment above for why).
 */
export function formatDeliveryTarget(locale: SupportedLocale, details: DeliveryDetails): string {
  const text = DELIVERY_TARGET_TEXT[locale] ?? DELIVERY_TARGET_TEXT.en;
  if (details.method === "omniva") return text.locker(details.locker || "");
  const address = [details.street, details.city, details.zip].filter(Boolean).join(", ");
  return text.courier(address);
}

export type IncomingItem = { id: string; label?: string; qty: number };

export type PricedLine = { id: string; name: string; qty: number; unitPrice: number };

export type PricedOrder = {
  lines: PricedLine[];
  subtotal: number;
  discountPct: number;
  discount: number;
  // Locale-neutral key ("omniva" | "courier") — translate for display,
  // never store a pre-formatted label (see the DELIVERY comment above).
  deliveryId: string;
  deliveryPrice: number;
  grandTotal: number;
};

function money(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Validate the incoming cart + delivery + discount and recompute all totals
 * from the canonical price table. Throws on anything it doesn't recognise.
 */
export function priceOrder(input: {
  items: IncomingItem[];
  discountCode?: string;
  delivery: string;
}): PricedOrder {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("Empty cart");
  }

  const lines: PricedLine[] = input.items.map((item) => {
    const unitPrice = VARIANT_PRICES[item.id];
    if (unitPrice === undefined) throw new Error(`Unknown product: ${item.id}`);
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 50) throw new Error("Invalid quantity");
    return { id: item.id, name: item.label?.slice(0, 255) || item.id, qty, unitPrice };
  });

  const gemOnly = isGemOnlyOrder(lines.map((l) => l.id));
  const totalGems = gemOnly ? lines.reduce((sum, l) => sum + l.qty, 0) : 0;
  if (gemOnly && totalGems < MIN_STANDALONE_GEMS) {
    throw new Error(`Minimum ${MIN_STANDALONE_GEMS} crystals for a standalone order`);
  }

  const subtotal = money(lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0));

  // Extra gems never get the discount code — only kit lines are discountable.
  const discountableSubtotal = money(
    lines.filter((l) => !isGemId(l.id)).reduce((sum, l) => sum + l.unitPrice * l.qty, 0),
  );

  const discountPct = discountPctForCode(input.discountCode);
  const discount = money(discountableSubtotal * (discountPct / 100));

  const delivery = DELIVERY[input.delivery];
  if (!delivery) throw new Error(`Unknown delivery method: ${input.delivery}`);
  // A crystals-only order pays the courier rate regardless of method — unless
  // it clears the free-shipping threshold, then it behaves like a normal order.
  const deliveryPrice =
    gemOnly && totalGems < FREE_SHIPPING_GEM_THRESHOLD
      ? Math.max(delivery.price, DELIVERY.courier.price)
      : delivery.price;

  const grandTotal = money(Math.max(0, subtotal - discount) + deliveryPrice);

  return {
    lines,
    subtotal,
    discountPct,
    discount,
    deliveryId: input.delivery,
    deliveryPrice,
    grandTotal,
  };
}
