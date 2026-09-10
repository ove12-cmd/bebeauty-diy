import { defineRouting } from "next-intl/routing";

// English stays unprefixed at its current, already-live URLs (no disruption
// to existing Facebook ads / backlinks). Estonian lives under /et with its
// own localized slugs — see `pathnames` below.
export const routing = defineRouting({
  locales: ["en", "et"],
  defaultLocale: "en",
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
