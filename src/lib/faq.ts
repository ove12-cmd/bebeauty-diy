export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; label: string; items: FaqItem[] };

// Grouped so the buy page can tab between them. The first group had no
// heading in the source copy; "Ohutus" is the shared subject of its three
// questions (enamel, contraindications, materials).
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "ohutus",
    label: "Ohutus",
    items: [
      {
        q: "Kas see kahjustab hambaemaili?",
        a: "Ei. Kristall liimitakse emaili pinnale, mitte sisse. Hammast ei puurita ega lihvita. Etch avab emaili pinna mikroskoopiliselt, et liim kinnituks, ja pärast eemaldamist poleeritakse pind tagasi siledaks.",
      },
      {
        q: "Kellele see ei sobi ja kuidas mitte paigaldada?",
        a: "Ära paigalda kristalli hambale, millel on ravimata kaaries, plomm paigalduskohas või lahtine breketiklamber. Kui sul on igemepõletik või sa käid parajasti ortodondi juures, küsi enne oma hambaarstilt.",
      },
      {
        q: "Mis on liimi ja etchi koostis?",
        a: "Etch on 36% fosforhappe geel, sama, mida kasutatakse hambakliinikutes breketite kinnitamisel. Liim on UV-valguskõvenev dentaalkomposiit.",
      },
    ],
  },
  {
    id: "paigaldus",
    label: "Paigaldus",
    items: [
      {
        q: "Kas ma saan seda ise teha?",
        a: "Jah. Kogu protsess käib peegli ees ja komplektis on kõik vajalik, sealhulgas põsehoidja ja kuivatuspadjad. Kõige olulisem samm on hamba korralik kuivatamine. Kui pind jääb niiskeks, kristall ei pea kinni, ja see on peaaegu alati põhjus, miks paigaldus ebaõnnestub.",
      },
      {
        q: "Kui kaua see aega võtab?",
        a: "Esimene kord umbes 10 minutit, koos ettevalmistusega. Liimi kõvendamine ise võtab 3x45 sekundit.",
      },
      {
        q: "Mis siis, kui panen kristalli valesse kohta?",
        a: "Enne kõvendamist saad kristalli veel liigutada. Liim jääb pehmeks, kuni sa valguse peale paned. Kui oled juba kõvendanud ja koht ei meeldi, saad kristalli maha võtta ja uue paigaldada, aga selleks kulub üks varukristall.",
      },
      {
        q: "Kas mul on kellegi abi vaja?",
        a: "Ei, aga esimesel korral on kergem, kui keegi valgust hoiab. Ülemistele esihammastele on iseseisvalt lihtsam kui alumistele.",
      },
    ],
  },
  {
    id: "pusivus",
    label: "Kristall ja püsivus",
    items: [
      {
        q: "Kui kaua kristall püsib?",
        a: "Meil on küll kirjas 2–4 nädalat, kuid korrektselt paigaldatuna püsib see mitu kuud, sõltuvalt sellest, kui hästi hammas paigaldamisel kuivaks sai ja kus kristall asub.",
      },
      {
        q: "Kas kristalliga saab normaalselt süüa ja hambaid pesta?",
        a: "Jah. Pese hambaid tavaliselt, lihtsalt ära hõõru kristalli otse harja karvadega. Esimesed 24 tundi väldi väga kõvasid toite. Elektriline hambahari on lubatud.",
      },
      {
        q: "Kuidas kristalli eemaldada?",
        a: "Kristalli saab ise õrnalt maha kangutada komplektis oleva vahendiga, aga liimijääk tuleb ära poleerida. Kõige puhtam tulemus tuleb suuhügienisti juures, kus see võtab paar minutit ja kuulub tavalise hambapesu juurde.",
      },
    ],
  },
];

/** Flat list for the FAQPage JSON-LD, which has no notion of categories. */
export const FAQ_ITEMS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
