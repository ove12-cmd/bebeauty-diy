export type Review = {
  name: string;
  date: string;
  /** Whole stars, 1-5. */
  rating: number;
  text: string;
  /** Shop's public answer, shown under the review. */
  reply?: string;
  /**
   * Result photos. One entry is a single shot; two are two views of the same
   * result (the numbered image pairs), shown side by side on one card.
   */
  photos?: string[];
  /** object-position, for the older crops that need it. */
  pos?: string;
  /**
   * TRUE = seeded copy written for design work, NOT a real customer review.
   * Nothing flagged here may be presented to shoppers as a genuine review —
   * under the EU Omnibus Directive (and Estonian consumer law) publishing
   * fabricated consumer reviews is prohibited and fineable. Clear the flag
   * only when the entry is replaced by a verified real review.
   */
  placeholder?: boolean;
};

// Reviews live here rather than inside ReviewsSlider so a page can quote one
// without pulling the slider (and its lightbox + submit popup) into its
// bundle — the checkout needs the words, not the carousel.
export const DEFAULT_REVIEWS: Review[] = [
  { name: "Hanna-Liis", date: "märts 2025", rating: 5, text: "Sain täpselt sellise tulemuse, nagu tahtsin. Panin ise peale ja see ei olnud üldse raske. Kümne minutiga tehtud.", photos: ["/testimonials/testimonial-1.jpg"], pos: "center 25%", placeholder: true },
  { name: "Jelizaveta", date: "aprill 2025", rating: 5, text: "Alguses ma ei uskunud, et nii hästi välja tuleb. Aga tuli ilus ja sain esimese korraga õigesse kohta.", photos: ["/testimonials/testimonial-2.jpg"], pos: "center 35%", placeholder: true },
  { name: "K.", date: "mai 2025", rating: 5, text: "Komplekt on kvaliteetne, kõik oli karbis olemas. Võtsin 2.0 mm ja see oli hea valik, on näha aga ei ole üle pakutud.", photos: ["/testimonials/testimonial-3.jpg"], pos: "center 62%", placeholder: true },
  { name: "Karina S.", date: "2 kuud tagasi", rating: 5, text: "Tellisin endale sünnipäevaks. Juhendit oli lihtne jälgida ja juba esimene katse tuli ilus.", photos: ["/reviews/single-6.webp"], placeholder: true },
  { name: "Anete R.", date: "2 nädalat tagasi", rating: 5, text: "Arvasin, et paigaldamine on suurem peavalu, aga ei olnud. Olen juba paarile sõbrannale soovitanud.", photos: ["/reviews/single-7.webp"], placeholder: true },
  { name: "Liis", date: "juuni 2025", rating: 4, text: "Tulemus on ilus, aga mul kukkus esimene kristall kolmandal päeval ära. Teine katse õnnestus paremini, arvatavasti ei kuivatanud hammast piisavalt.", reply: "Aitäh tagasiside eest, Liis. Just nii, hammas peab enne liimimist täiesti kuiv olema. Kirjuta meile, kui soovid tasuta lisakristalli.", placeholder: true },
  { name: "Reelika S.", date: "3 kuud tagasi", rating: 5, text: "Mul on varem salongis kristall hambal olnud, aga see komplekt on mugavam. Võtsin 2.3 mm, kolmas nädal käib ja ikka läigib.", photos: ["/results/result-3.jpg"], pos: "center", placeholder: true },
  { name: "Marii", date: "juuni 2025", rating: 5, text: "täiesti asi. kiire tarne, ilus tulemus, ei oskagi rohkem tahta", placeholder: true },
  { name: "Kertu", date: "juuli 2025", rating: 5, photos: ["/reviews/pair-1-a.webp", "/reviews/pair-1-b.webp"], text: "Väga rahul! Lamp töötab kiirelt ja põsehoidja on tegelikult üllatavalt vajalik asi.", placeholder: true },
  { name: "Sandra", date: "juuli 2025", rating: 5, text: "Ostsin sõbrannaga kahepeale ja panime teineteisele. Oli lõbus õhtu ja mõlemal jäi ilus.", placeholder: true },
  { name: "Eva-Maria", date: "juuli 2025", rating: 5, photos: ["/reviews/single-1.webp"], text: "Salongis küsiti 90 eurot. Siin 35 ja tulemus on minu jaoks sama hea.", placeholder: true },
  { name: "Kristi", date: "august 2025", rating: 4, text: "Komplekt on hea, aga juhendis võiks olla rohkem pilte. Vaatasin lõpuks teie videot ja siis sai selgeks.", reply: "Hea märkus, Kristi. Täiendasime vahepeal juhendit piltidega, aitäh et ütlesid.", placeholder: true },
  { name: "Getter", date: "august 2025", rating: 5, photos: ["/reviews/pair-2-a.webp", "/reviews/pair-2-b.webp"], text: "Tellisin 1.7 mm, sest tahtsin midagi tagasihoidlikku. Perfektne, näeb loomulik välja.", placeholder: true },
  { name: "Anna", date: "august 2025", rating: 5, text: "kohale jõudis juba järgmisel päeval, väga korralik", placeholder: true },
  { name: "Merilin", date: "august 2025", rating: 5, text: "Olen kaks korda tellinud. Esimene püsis kolm nädalat, teine juba neljandat nädalat. Sõltub vist sellest, kui hästi peale saad.", placeholder: true },
  { name: "Triin", date: "september 2025", rating: 4, photos: ["/reviews/single-2.webp"], text: "Hea toode, aga pakendil oli üks aplikaator natuke viltu. Toimis siiski.", reply: "Vabandame selle pärast, Triin. Andke järgmine kord kohe teada, saadame uue tasuta.", placeholder: true },
  { name: "Laura", date: "september 2025", rating: 5, text: "Ma olen kohutavalt kärsitu inimene ja isegi mina sain hakkama. See ütleb päris palju.", placeholder: true },
  { name: "Diana", date: "september 2025", rating: 5, text: "Väga ilus efekt, eriti Boreale kristall. Päikese käes lausa mängib.", placeholder: true },
  { name: "Janeli", date: "september 2025", rating: 5, photos: ["/reviews/pair-3-a.webp", "/reviews/pair-3-b.webp"], text: "Soovitan. Kõik oli kaasas, midagi juurde osta ei pidanud.", placeholder: true },
  { name: "Kaisa", date: "oktoober 2025", rating: 4, text: "Tulemus hea, aga tellisin 2.3 mm ja see on minu väikese hamba jaoks natuke suur. Minu enda valikuviga.", reply: "Aitäh, Kaisa. Lisasime tootelehele suuruste võrdluse, et valik oleks lihtsam.", placeholder: true },
  { name: "Mari-Liis", date: "oktoober 2025", rating: 5, text: "Kingiks ostetud, tütar oli õnnest väljas.", placeholder: true },
  { name: "Nele", date: "oktoober 2025", rating: 5, photos: ["/reviews/single-3.webp"], text: "kiire, lihtne, ilus. mida veel", placeholder: true },
  { name: "Viktoria", date: "oktoober 2025", rating: 5, text: "Väga meeldis, et etch ja liim on eraldi. Tundub professionaalsem kui need odavad komplektid Aliexpressist, mida enne proovisin.", placeholder: true },
  { name: "Grete", date: "november 2025", rating: 4, text: "Ilus tulemus, aga esimesel korral panin liimi liiga palju ja see valgus laiali. Teisel korral oli täiuslik.", reply: "Just nii, Grete, väga õhuke kiht on parim. Hea, et teine kord õnnestus.", placeholder: true },
  { name: "Helena", date: "november 2025", rating: 5, text: "Hind ja kvaliteet on paigas. Tuleks veel rohkem värve.", placeholder: true },
  { name: "Sirli", date: "november 2025", rating: 5, text: "Paigaldasin köögilaua taga peegli abil, umbes 8 minutit. Ei mingit draamat.", placeholder: true },
  { name: "Katariina", date: "november 2025", rating: 5, photos: ["/reviews/pair-4-a.webp", "/reviews/pair-4-b.webp"], text: "Tellisin lisaks liblika kristalli ja see on nii armas. Kõik küsivad, kust sain.", placeholder: true },
  { name: "Elis", date: "detsember 2025", rating: 4, text: "Toode hea, tarne võttis minu jaoks 3 päeva, mitte 1 kuni 2. Aga see oli enne jõule, nii et arusaadav.", reply: "Aitäh mõistmise eest, Elis. Jõulude eel on pakiautomaadid tõesti koormatud.", placeholder: true },
  { name: "Marta", date: "detsember 2025", rating: 5, text: "väga rahul, tuleb kindlasti kordusost", placeholder: true },
  { name: "Rebeka", date: "detsember 2025", rating: 5, text: "UV lamp on väike aga võimas. Kõvastus 60 sekundiga nagu juhendis kirjas.", placeholder: true },
  { name: "Aleksandra", date: "jaanuar 2026", rating: 5, photos: ["/reviews/pair-5-a.webp", "/reviews/pair-5-b.webp"], text: "Otlichno! Vse ponjatno oli ka eesti keeles, sai kiiresti selgeks.", placeholder: true },
  { name: "Kelly", date: "jaanuar 2026", rating: 4, text: "Mulle meeldib, lihtsalt tahaks, et komplektis oleks rohkem kui 10 kristalli.", reply: "Aitäh, Kelly. Kristalle saab tellida ka eraldi, 1 euro tükk.", placeholder: true },
  { name: "Piret", date: "jaanuar 2026", rating: 5, text: "Ostsin uudishimust ja jäin väga rahule. Eemaldamine oli ka valutu, nagu lubatud.", placeholder: true },
  { name: "Silvia", date: "jaanuar 2026", rating: 5, photos: ["/reviews/single-4.webp"], text: "Parim asi, mille sel talvel tellinud olen. Aitäh!", placeholder: true },
  { name: "Johanna", date: "veebruar 2026", rating: 5, text: "Panin emale ka peale, tema oli algul väga skeptiline, nüüd tahab teist ka.", placeholder: true },
  { name: "Kadri", date: "veebruar 2026", rating: 4, text: "Kvaliteet on olemas. Karbi disain võiks natuke kindlam olla, minu oma jõudis kohale pisut muljutud.", reply: "Vabandame, Kadri. Vahetasime vahepeal pakendi tugevama vastu.", placeholder: true },
  { name: "Ave", date: "veebruar 2026", rating: 5, text: "kiire tarne ja väga selge juhend. 10/10", placeholder: true },
  { name: "Berit", date: "veebruar 2026", rating: 5, photos: ["/reviews/single-5.webp"], text: "Olin enne salongis käinud ja maksnud kolm korda rohkem. Enam ei lähe.", placeholder: true },
  { name: "Liina", date: "märts 2026", rating: 5, text: "Väga hea komplekt algajale. Kartsin, et teen midagi katki, aga kõik on väga lihtne ja ohutu.", placeholder: true },
  { name: "Maarja", date: "märts 2026", rating: 4, text: "Hea toode, aga minul püsis kaks nädalat, mitte neli. Söön ilmselt liiga palju krõbedat.", reply: "Aitäh, Maarja. Kaks nädalat on täiesti normaalne, palju sõltub söögist ja hambapesust.", placeholder: true },
  { name: "Kätlin", date: "märts 2026", rating: 5, photos: ["/reviews/pair-6-a.webp", "/reviews/pair-6-b.webp"], text: "Tellisin kaks komplekti, endale ja õele. Mõlemal õnnestus esimese korraga.", placeholder: true },
  { name: "Ingrid", date: "aprill 2026", rating: 5, text: "Super. Läbipaistev kristall on minu lemmik, väga peen.", placeholder: true },
  { name: "Tuuli", date: "aprill 2026", rating: 5, text: "kõik toimis nagu kirjas, ei mingeid üllatusi. just nii peabki", placeholder: true },
  { name: "Sofia", date: "aprill 2026", rating: 5, text: "Väga hea ostukogemus, tulen kindlasti tagasi kristalle juurde ostma.", placeholder: true },
];

export const REVIEW_COUNT = DEFAULT_REVIEWS.length;

/**
 * Mean rating, derived from the reviews actually shown — never a figure typed
 * in by hand. Rounded to one decimal, the precision the UI displays.
 */
export const AVERAGE_RATING =
  Math.round((DEFAULT_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEW_COUNT) * 10) / 10;

/** Estonian decimal comma, e.g. "4,8". */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

const ET_MONTHS = [
  "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni",
  "juuli", "august", "september", "oktoober", "november", "detsember",
];

const RELATIVE_UNIT_DAYS: Record<string, number> = {
  päev: 1, päeva: 1,
  nädal: 7, nädalat: 7,
  kuu: 30, kuud: 30,
  aasta: 365, aastat: 365,
};

/**
 * Turns a human review date into something sortable. The dates are written
 * two ways — an absolute month ("märts 2025") or a relative age ("2 kuud
 * tagasi") — so neither string comparison nor Date.parse works on them.
 * Relative ages are resolved against now, which is what they mean.
 * Returns 0 for anything unrecognised, sorting it last.
 */
export function reviewTimestamp(date: string, now: number = Date.now()): number {
  const d = date.trim().toLowerCase();

  const relative = d.match(/^(\d+)\s+(\S+)\s+tagasi$/);
  if (relative) {
    const days = RELATIVE_UNIT_DAYS[relative[2]];
    if (days) return now - Number(relative[1]) * days * 86_400_000;
  }

  const absolute = d.match(/^(\S+)\s+(\d{4})$/);
  if (absolute) {
    const month = ET_MONTHS.indexOf(absolute[1]);
    if (month >= 0) return Date.UTC(Number(absolute[2]), month, 1);
  }

  return 0;
}

// Quoted at checkout: short enough for the sidebar, and it answers the doubt
// a buyer actually has at that moment ("will I manage this myself?"). Matched
// by name, not index ā€” reordering the list must never silently swap the
// checkout quote for a critical review.
export const CHECKOUT_REVIEW =
  DEFAULT_REVIEWS.find((r) => r.name === "Jelizaveta") ?? DEFAULT_REVIEWS[0];
