// Canonical, server-authoritative pricing.
// The browser can send anything — the checkout API recomputes every total
// from these values so a tampered cart price can never reach the payment step.

export const CURRENCY = "EUR";
export const LOCALE = "et";

// Extra crystals, purchasable only alongside a kit — the product page adds
// them to the cart in the same click as the kit itself, so a gem line never
// reaches checkout on its own.
export const GEM_PRICE = 1;

// Buying crystals with no kit, on /kristallid — priced separately from the
// bundled add-on above.
export const STANDALONE_GEM_PRICE = 2;

export const EXTRA_GEM_TYPES = [
  { id: "gem-clear", label: "Swarovski Kristall läbipaistev", img: "/crystals/gem-clear.jpg" },
  { id: "gem-ab", label: "Swarovski Boreale", img: "/crystals/gem-ab.jpg" },
  { id: "gem-ab-butterfly", label: "Swarovski Boreale Butterfly", img: "/crystals/gem-ab-butterfly.jpg" },
] as const;

// Sizes for the standalone /kristallid page only — same labels as the kit's
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

// Variant id → unit price (€). Mirrors VARIANTS in src/app/hambakristalli-komplekt/page.tsx.
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

// Buying crystals with no kit in the order — the /kristallid page enforces
// both of these client-side; priceOrder() re-checks them server-side too.
export const MIN_STANDALONE_GEMS = 10;

export function isGemId(id: string): boolean {
  return GEM_IDS.has(id);
}

export function isGemOnlyOrder(ids: string[]): boolean {
  return ids.length > 0 && ids.every(isGemId);
}

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
    if (!Number.isFinite(qty) || qty < 1 || qty > 50) throw new Error("Invalid quantity");
    return { id: item.id, name: item.label?.slice(0, 255) || item.id, qty, unitPrice };
  });

  const gemOnly = isGemOnlyOrder(lines.map((l) => l.id));
  if (gemOnly) {
    const totalGems = lines.reduce((sum, l) => sum + l.qty, 0);
    if (totalGems < MIN_STANDALONE_GEMS) {
      throw new Error(`Minimum ${MIN_STANDALONE_GEMS} crystals for a standalone order`);
    }
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
  // No free Omniva perk for a crystals-only order — only kit purchases get it.
  const deliveryPrice = gemOnly ? Math.max(delivery.price, DELIVERY.courier.price) : delivery.price;

  const grandTotal = money(Math.max(0, subtotal - discount) + deliveryPrice);

  return {
    lines,
    subtotal,
    discountPct,
    discount,
    deliveryId: input.delivery,
    deliveryLabel: delivery.label,
    deliveryPrice,
    grandTotal,
  };
}
