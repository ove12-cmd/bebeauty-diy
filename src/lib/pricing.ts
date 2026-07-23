// Canonical, server-authoritative pricing.
// The browser can send anything — the checkout API recomputes every total
// from these values so a tampered cart price can never reach the payment step.

export const CURRENCY = "EUR";
export const LOCALE = "et";

// Variant id → unit price (€). Mirrors VARIANTS in src/app/hambakristalli-komplekt/page.tsx.
export const VARIANT_PRICES: Record<string, number> = {
  s17: 35,
  s20: 35,
  s23: 35,
};

// Auto-generated marketing codes (see UrgencyPopup) — always the standard rate.
export const FUNNY_DISCOUNT_CODES = [
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
] as const;

export const STANDARD_DISCOUNT_PCT = 10;

// Server-authoritative code → discount % lookup. The client only ever sends
// the code string, never a percentage — the server decides the discount.
export const DISCOUNT_CODES: Record<string, number> = {
  BEBEAUTY10: STANDARD_DISCOUNT_PCT,
  ...Object.fromEntries(FUNNY_DISCOUNT_CODES.map((c) => [c, STANDARD_DISCOUNT_PCT])),
  TEST95: 95, // internal testing only — not shown in any customer-facing UI
};

export function discountPctForCode(code?: string | null): number {
  if (!code) return 0;
  return DISCOUNT_CODES[code.trim().toUpperCase()] ?? 0;
}

// True only for codes the popup itself can generate — never for BEBEAUTY10,
// internal test codes, or anything else someone might type into the box.
// Gates the time-limited ticker/popup-restore UI specifically.
export function isGeneratedMarketingCode(code?: string | null): boolean {
  if (!code) return false;
  return (FUNNY_DISCOUNT_CODES as readonly string[]).includes(code.trim().toUpperCase());
}

export const DELIVERY: Record<string, { label: string; price: number }> = {
  omniva: { label: "Omniva pakiautomaat", price: 0 },
  courier: { label: "Kuller koju", price: 3.9 },
};

export type IncomingItem = { id: string; label?: string; qty: number };

export type PricedLine = { id: string; name: string; qty: number; unitPrice: number };

export type PricedOrder = {
  lines: PricedLine[];
  subtotal: number;
  discountPct: number;
  discount: number;
  deliveryId: string;
  deliveryLabel: string;
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
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) throw new Error("Invalid quantity");
    return { id: item.id, name: item.label?.slice(0, 255) || item.id, qty, unitPrice };
  });

  const subtotal = money(lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0));

  const discountPct = discountPctForCode(input.discountCode);
  const discount = money(subtotal * (discountPct / 100));

  const delivery = DELIVERY[input.delivery];
  if (!delivery) throw new Error(`Unknown delivery method: ${input.delivery}`);

  const grandTotal = money(Math.max(0, subtotal - discount) + delivery.price);

  return {
    lines,
    subtotal,
    discountPct,
    discount,
    deliveryId: input.delivery,
    deliveryLabel: delivery.label,
    deliveryPrice: delivery.price,
    grandTotal,
  };
}
