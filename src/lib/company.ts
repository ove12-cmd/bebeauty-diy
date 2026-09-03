// Single source of truth for the legal/contact identity shown to buyers.
// Anything that appears in a footer, a receipt or a trust block reads from
// here so the details can't drift between pages.
export const COMPANY = {
  name: "BeBeauty DIY",
  /** Where order questions go. */
  orderEmail: "tellimused@bebeauty-diy.ee",
  socials: [
    {
      id: "facebook",
      label: "Bebeauty DIY",
      // Numeric page id — works regardless of whether a vanity URL is set.
      url: "https://www.facebook.com/1204061762797891",
    },
    {
      id: "instagram",
      label: "@bebeauty.diy",
      url: "https://instagram.com/bebeauty.diy",
    },
  ],
} as const;
