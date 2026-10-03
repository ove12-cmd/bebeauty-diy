import { defineRouting } from "next-intl/routing";

// Estonian is the default locale — stays unprefixed at its own localized
// slugs (see `pathnames` below), since Estonian is where the live ad
// campaigns and backlinks actually point. English moved under /en/.
// (Flipped back from English-default on 2026-09-28 — see next.config.ts
// redirects for the compatibility redirects that preserve the old bare
// English URLs this displaced.)
export const routing = defineRouting({
  locales: ["en", "et"],
  defaultLocale: "et",
  localePrefix: "as-needed",
  // Without this, next-intl's Accept-Language sniffing would redirect a
  // fresh visitor from a live ad straight to /et/... based on browser
  // language alone. A manual switcher click still sets NEXT_LOCALE, which
  // next-intl honors on return visits regardless of this setting.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/tooth-gem-kit": {
      en: "/tooth-gem-kit",
      et: "/hambakristalli-komplekt",
    },
    "/guide": {
      en: "/guide",
      et: "/juhend",
    },
    "/crystals": {
      en: "/crystals",
      et: "/kristallid",
    },
    "/shipping": {
      en: "/shipping",
      et: "/tarne",
    },
    "/privacy": {
      en: "/privacy",
      et: "/privaatsus",
    },
    "/terms": {
      en: "/terms",
      et: "/tingimused",
    },
    "/contact": {
      en: "/contact",
      et: "/kontakt",
    },
    "/checkout": "/checkout",
    "/checkout/success": "/checkout/success",
  },
});

export type Locale = (typeof routing.locales)[number];
