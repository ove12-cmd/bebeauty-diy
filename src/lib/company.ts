// Single source of truth for the legal/contact identity shown to buyers.
// Anything that appears in a footer, a receipt or a trust block reads from
// here so the details can't drift between pages.
export const COMPANY = {
  name: "BeBeauty DIY",
  /** Where order questions go. */
  orderEmail: "tellimused@bebeauty-diy.ee",
  // `network` drives the icon and is separate from `id`, because the shop
  // runs two different Facebook presences — keying the icon off the id alone
  // couldn't express that.
  socials: [
    {
      id: "facebook-page",
      network: "facebook",
      label: "Bebeauty DIY",
      // Numeric page id — works regardless of whether a vanity URL is set.
      url: "https://www.facebook.com/1204061762797891",
    },
    {
      id: "facebook-handle",
      network: "facebook",
      label: "@bebeauty.diy",
      url: "https://www.facebook.com/bebeauty.diy",
    },
  ],
} as const;
