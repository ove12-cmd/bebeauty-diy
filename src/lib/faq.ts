import type { LocalizedText } from "@/lib/reviews";

export type FaqItem = { q: LocalizedText; a: LocalizedText };
export type FaqCategory = { id: string; label: LocalizedText; items: FaqItem[] };
export type ResolvedFaqItem = { q: string; a: string };
export type ResolvedFaqCategory = { id: string; label: string; items: ResolvedFaqItem[] };

export function resolveFaqItem(item: FaqItem, locale: "en" | "et"): ResolvedFaqItem {
  return { q: item.q[locale], a: item.a[locale] };
}

export function resolveFaqCategory(category: FaqCategory, locale: "en" | "et"): ResolvedFaqCategory {
  return {
    id: category.id,
    label: category.label[locale],
    items: category.items.map((item) => resolveFaqItem(item, locale)),
  };
}

// Grouped so the buy page can tab between them. The first group had no
// heading in the source copy; "Safety"/"Ohutus" is the shared subject of its
// three questions (enamel, contraindications, materials).
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "ohutus",
    label: { en: "Safety", et: "Ohutus" },
    items: [
      {
        q: {
          en: "Does this damage tooth enamel?",
          et: "Kas see kahjustab hambaemaili?",
        },
        a: {
          en: "No. The crystal is bonded to the surface of the enamel, not into it. The tooth is never drilled or ground down. The etch gel microscopically roughens the enamel surface so the glue can bond, and after removal the surface is polished back smooth.",
          et: "Ei. Kristall liimitakse emaili pinnale, mitte sisse. Hammast ei puurita ega lihvita. Etch avab emaili pinna mikroskoopiliselt, et liim kinnituks, ja pärast eemaldamist poleeritakse pind tagasi siledaks.",
        },
      },
      {
        q: {
          en: "Who shouldn't use this, and when should you avoid applying it?",
          et: "Kellele see ei sobi ja kuidas mitte paigaldada?",
        },
        a: {
          en: "Don't apply a crystal to a tooth with untreated cavities, a filling at the application site, or a loose braces bracket. If you have gum inflammation or are currently seeing an orthodontist, check with your dentist first.",
          et: "Ära paigalda kristalli hambale, millel on ravimata kaaries, plomm paigalduskohas või lahtine breketiklamber. Kui sul on igemepõletik või sa käid parajasti ortodondi juures, küsi enne oma hambaarstilt.",
        },
      },
      {
        q: {
          en: "What are the glue and etch made of?",
          et: "Mis on liimi ja etchi koostis?",
        },
        a: {
          en: "The etch is a 36% phosphoric acid gel, the same one used in dental clinics to bond braces. The glue is a UV-light-cured dental composite.",
          et: "Etch on 36% fosforhappe geel, sama, mida kasutatakse hambakliinikutes breketite kinnitamisel. Liim on UV-valguskõvenev dentaalkomposiit.",
        },
      },
    ],
  },
  {
    id: "paigaldus",
    label: { en: "Application", et: "Paigaldus" },
    items: [
      {
        q: {
          en: "Can I do this myself?",
          et: "Kas ma saan seda ise teha?",
        },
        a: {
          en: "Yes. The whole process happens in front of a mirror, and the kit includes everything you need, including a cheek retractor and drying pads. The most important step is drying the tooth thoroughly. If the surface stays even slightly damp, the crystal won't hold — that's almost always the reason an application fails.",
          et: "Jah. Kogu protsess käib peegli ees ja komplektis on kõik vajalik, sealhulgas põsehoidja ja kuivatuspadjad. Kõige olulisem samm on hamba korralik kuivatamine. Kui pind jääb niiskeks, kristall ei pea kinni, ja see on peaaegu alati põhjus, miks paigaldus ebaõnnestub.",
        },
      },
      {
        q: {
          en: "How long does it take?",
          et: "Kui kaua see aega võtab?",
        },
        a: {
          en: "About 10 minutes the first time, including prep. Curing the glue itself takes 3x45 seconds.",
          et: "Esimene kord umbes 10 minutit, koos ettevalmistusega. Liimi kõvendamine ise võtab 3x45 sekundit.",
        },
      },
      {
        q: {
          en: "What if I place the crystal in the wrong spot?",
          et: "Mis siis, kui panen kristalli valesse kohta?",
        },
        a: {
          en: "You can still move the crystal before curing it. The glue stays soft until you apply the UV light. If you've already cured it and don't like the placement, you can remove the crystal and apply a new one, but that uses up a spare crystal.",
          et: "Enne kõvendamist saad kristalli veel liigutada. Liim jääb pehmeks, kuni sa valguse peale paned. Kui oled juba kõvendanud ja koht ei meeldi, saad kristalli maha võtta ja uue paigaldada, aga selleks kulub üks varukristall.",
        },
      },
      {
        q: {
          en: "Do I need someone to help me?",
          et: "Kas mul on kellegi abi vaja?",
        },
        a: {
          en: "No, but it's easier the first time if someone holds the light for you. The upper front teeth are easier to do solo than the lower ones.",
          et: "Ei, aga esimesel korral on kergem, kui keegi valgust hoiab. Ülemistele esihammastele on iseseisvalt lihtsam kui alumistele.",
        },
      },
    ],
  },
  {
    id: "pusivus",
    label: { en: "Crystal & longevity", et: "Kristall ja püsivus" },
    items: [
      {
        q: {
          en: "How long does the crystal last?",
          et: "Kui kaua kristall püsib?",
        },
        a: {
          en: "We list 2–4 weeks, but when applied correctly it can last for months, depending on how well the tooth was dried during application and where the crystal sits.",
          et: "Meil on küll kirjas 2–4 nädalat, kuid korrektselt paigaldatuna püsib see mitu kuud, sõltuvalt sellest, kui hästi hammas paigaldamisel kuivaks sai ja kus kristall asub.",
        },
      },
      {
        q: {
          en: "Can I eat and brush my teeth normally with the crystal on?",
          et: "Kas kristalliga saab normaalselt süüa ja hambaid pesta?",
        },
        a: {
          en: "Yes. Brush as usual, just avoid scrubbing the crystal directly with the bristles. Avoid very hard foods for the first 24 hours. An electric toothbrush is fine.",
          et: "Jah. Pese hambaid tavaliselt, lihtsalt ära hõõru kristalli otse harja karvadega. Esimesed 24 tundi väldi väga kõvasid toite. Elektriline hambahari on lubatud.",
        },
      },
      {
        q: {
          en: "How do I remove the crystal?",
          et: "Kuidas kristalli eemaldada?",
        },
        a: {
          en: "You can gently pry it off yourself with the tool included in the kit, but the leftover glue residue needs to be polished away. The cleanest result comes from a dental hygienist, where it takes just a couple of minutes and can be done as part of a regular cleaning.",
          et: "Kristalli saab ise õrnalt maha kangutada komplektis oleva vahendiga, aga liimijääk tuleb ära poleerida. Kõige puhtam tulemus tuleb suuhügienisti juures, kus see võtab paar minutit ja kuulub tavalise hambapesu juurde.",
        },
      },
    ],
  },
];

/** Flat list for the FAQPage JSON-LD, which has no notion of categories. */
export const FAQ_ITEMS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
