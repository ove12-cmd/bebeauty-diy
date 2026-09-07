export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; label: string; items: FaqItem[] };

// Grouped so the buy page can tab between them. The first group had no
// heading in the source copy; "Safety" is the shared subject of its three
// questions (enamel, contraindications, materials).
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "ohutus",
    label: "Safety",
    items: [
      {
        q: "Does this damage tooth enamel?",
        a: "No. The crystal is bonded to the surface of the enamel, not into it. The tooth is never drilled or ground down. The etch gel microscopically roughens the enamel surface so the glue can bond, and after removal the surface is polished back smooth.",
      },
      {
        q: "Who shouldn't use this, and when should you avoid applying it?",
        a: "Don't apply a crystal to a tooth with untreated cavities, a filling at the application site, or a loose braces bracket. If you have gum inflammation or are currently seeing an orthodontist, check with your dentist first.",
      },
      {
        q: "What are the glue and etch made of?",
        a: "The etch is a 36% phosphoric acid gel, the same one used in dental clinics to bond braces. The glue is a UV-light-cured dental composite.",
      },
    ],
  },
  {
    id: "paigaldus",
    label: "Application",
    items: [
      {
        q: "Can I do this myself?",
        a: "Yes. The whole process happens in front of a mirror, and the kit includes everything you need, including a cheek retractor and drying pads. The most important step is drying the tooth thoroughly. If the surface stays even slightly damp, the crystal won't hold — that's almost always the reason an application fails.",
      },
      {
        q: "How long does it take?",
        a: "About 10 minutes the first time, including prep. Curing the glue itself takes 3x45 seconds.",
      },
      {
        q: "What if I place the crystal in the wrong spot?",
        a: "You can still move the crystal before curing it. The glue stays soft until you apply the UV light. If you've already cured it and don't like the placement, you can remove the crystal and apply a new one, but that uses up a spare crystal.",
      },
      {
        q: "Do I need someone to help me?",
        a: "No, but it's easier the first time if someone holds the light for you. The upper front teeth are easier to do solo than the lower ones.",
      },
    ],
  },
  {
    id: "pusivus",
    label: "Crystal & longevity",
    items: [
      {
        q: "How long does the crystal last?",
        a: "We list 2–4 weeks, but when applied correctly it can last for months, depending on how well the tooth was dried during application and where the crystal sits.",
      },
      {
        q: "Can I eat and brush my teeth normally with the crystal on?",
        a: "Yes. Brush as usual, just avoid scrubbing the crystal directly with the bristles. Avoid very hard foods for the first 24 hours. An electric toothbrush is fine.",
      },
      {
        q: "How do I remove the crystal?",
        a: "You can gently pry it off yourself with the tool included in the kit, but the leftover glue residue needs to be polished away. The cleanest result comes from a dental hygienist, where it takes just a couple of minutes and can be done as part of a regular cleaning.",
      },
    ],
  },
];

/** Flat list for the FAQPage JSON-LD, which has no notion of categories. */
export const FAQ_ITEMS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
