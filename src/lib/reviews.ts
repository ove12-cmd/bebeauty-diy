export type LocalizedText = { en: string; et: string };

export type Review = {
  name: string;
  date: LocalizedText;
  /** Whole stars, 1-5. */
  rating: number;
  text: LocalizedText;
  /** Shop's public answer, shown under the review. */
  reply?: LocalizedText;
  /**
   * Result photos. One entry is a single shot; two are two views of the same
   * result (the numbered image pairs), shown side by side on one card.
   */
  photos?: string[];
  /** object-position, for the older crops that need it. */
  pos?: string;
};

export type ResolvedReview = Omit<Review, "date" | "text" | "reply"> & {
  date: string;
  text: string;
  reply?: string;
};

/** Picks the display strings for one locale — components render this, not Review directly. */
export function resolveReview(review: Review, locale: "en" | "et"): ResolvedReview {
  return {
    ...review,
    date: review.date[locale],
    text: review.text[locale],
    reply: review.reply?.[locale],
  };
}

// Reviews live here rather than inside ReviewsSlider so a page can quote one
// without pulling the slider (and its lightbox + submit popup) into its
// bundle — the checkout needs the words, not the carousel. Estonian text is
// the original customer wording (recovered from git history at 62eae4b,
// before the site's English translation) — never re-translate a real
// customer's words back and forth.
export const DEFAULT_REVIEWS: Review[] = [
  { name: "Marii", date: { en: "June 2025", et: "juuni 2025" }, rating: 5, text: { en: "fast delivery, beautiful result, couldn't ask for more", et: "kiire tarne, ilus tulemus, ei oskagi rohkem tahta" } },
  { name: "Kertu", date: { en: "July 2025", et: "juuli 2025" }, rating: 5, photos: ["/reviews/pair-1-a.webp", "/reviews/pair-1-b.webp"], text: { en: "Very happy! The UV lamp cures fast, and I'd definitely recommend using the cheek retractor too — surprisingly useful.", et: "Väga rahul! UV Lamp töötab kiirelt ja soovitan kindlasti ka põsehoidjat kasutada, tegelikult üllatavalt vajalik asi." } },
  { name: "Grete", date: { en: "November 2025", et: "november 2025" }, rating: 4, text: { en: "Beautiful result, but the first time I used too much glue and it spread. The second time was perfect.", et: "Ilus tulemus, aga esimesel korral panin liimi liiga palju ja see valgus laiali. Teisel korral oli täiuslik." }, reply: { en: "Exactly right, Grete — a very thin layer works best. Glad the second try was perfect.", et: "Just nii, Grete, väga õhuke kiht on parim. Hea, et teine kord õnnestus." } },
  { name: "Nele", date: { en: "October 2025", et: "oktoober 2025" }, rating: 5, photos: ["/reviews/single-3.webp"], text: { en: "fast, easy, beautiful. what more do you need", et: "kiire, lihtne, ilus. mida veel" } },
  { name: "Viktoria", date: { en: "October 2025", et: "oktoober 2025" }, rating: 5, text: { en: "Loved that the etch and glue are separate. Feels more professional than the cheap kits from AliExpress I'd tried before.", et: "Väga meeldis, et etch ja liim on eraldi. Tundub professionaalsem kui need odavad komplektid Aliexpressist, mida enne proovisin." } },
  { name: "Katariina", date: { en: "November 2025", et: "november 2025" }, rating: 5, photos: ["/reviews/pair-4-a.webp", "/reviews/pair-4-b.webp"], text: { en: "I ordered the butterfly crystal as an extra and it's so cute. Everyone asks where I got it.", et: "Tellisin lisaks liblika kristalli ja see on nii armas. Kõik küsivad, kust sain." } },
  { name: "Hanna-Liis", date: { en: "March 2025", et: "märts 2025" }, rating: 5, photos: ["/testimonials/testimonial-1.jpg"], text: { en: "Got exactly the result I wanted. Applied it myself and it wasn't hard at all. Done in ten minutes.", et: "Sain täpselt sellise tulemuse, nagu tahtsin. Panin ise peale ja see ei olnud üldse raske. Kümne minutiga tehtud." }, pos: "center 25%" },
  { name: "Jelizaveta", date: { en: "April 2025", et: "aprill 2025" }, rating: 5, photos: ["/testimonials/testimonial-2.jpg"], text: { en: "At first I didn't believe it would turn out this well. But it looked beautiful and I got the placement right on the first try.", et: "Alguses ma ei uskunud, et nii hästi välja tuleb. Aga tuli ilus ja sain esimese korraga õigesse kohta." }, pos: "center 35%" },
  { name: "K.", date: { en: "May 2025", et: "mai 2025" }, rating: 5, photos: ["/testimonials/testimonial-3.jpg"], text: { en: "The kit is good quality, everything was in the box. I got the 2.0mm and it was a good choice — noticeable but not over the top.", et: "Komplekt on kvaliteetne, kõik oli karbis olemas. Võtsin 2.0 mm ja see oli hea valik, on näha aga ei ole üle pakutud." }, pos: "center 62%" },
  { name: "Karina S.", date: { en: "2 months ago", et: "2 kuud tagasi" }, rating: 5, photos: ["/reviews/single-6.webp"], text: { en: "Ordered it for my birthday. The instructions were easy to follow and even my first attempt looked great.", et: "Tellisin endale sünnipäevaks. Juhendit oli lihtne jälgida ja juba esimene katse tuli ilus." } },
  { name: "Anete R.", date: { en: "2 weeks ago", et: "2 nädalat tagasi" }, rating: 5, photos: ["/reviews/single-7.webp"], text: { en: "Thought applying it would be a bigger hassle, but it wasn't. I've already recommended it to a couple of friends.", et: "Arvasin, et paigaldamine on suurem peavalu, aga ei olnud. Olen juba paarile sõbrannale soovitanud." } },
  { name: "Liis", date: { en: "June 2025", et: "juuni 2025" }, rating: 4, text: { en: "The result looks nice, but my first crystal fell off on day three. The second attempt worked better — I probably didn't dry the tooth enough.", et: "Tulemus on ilus, aga mul kukkus esimene kristall kolmandal päeval ära. Teine katse õnnestus paremini, arvatavasti ei kuivatanud hammast piisavalt." }, reply: { en: "Thanks for the feedback, Liis. Exactly — the tooth needs to be completely dry before gluing. Message us if you'd like a free replacement crystal.", et: "Aitäh tagasiside eest, Liis. Just nii, hammas peab enne liimimist täiesti kuiv olema. Kirjuta meile, kui soovid tasuta lisakristalli." } },
  { name: "Reelika S.", date: { en: "3 months ago", et: "3 kuud tagasi" }, rating: 5, text: { en: "I've had a crystal applied at a salon before, but this kit is more convenient. I got the 2.3mm — it's week three and still sparkling.", et: "Mul on varem salongis kristall hambale paigaldatud, aga see komplekt on mugavam. Võtsin 2.3 mm, kolmas nädal käib ja ikka läigib." } },
  { name: "Sandra", date: { en: "July 2025", et: "juuli 2025" }, rating: 5, text: { en: "Bought it together with a friend and we applied it on each other. Fun evening, and it turned out great for both of us.", et: "Ostsin sõbrannaga kahepeale ja panime teineteisele. Oli lõbus õhtu ja mõlemal jäi ilus." } },
  { name: "Eva-Maria", date: { en: "July 2025", et: "juuli 2025" }, rating: 5, photos: ["/reviews/single-1.webp"], text: { en: "The salon wanted 90 euros. This was 35, and the result is just as good for me.", et: "Salongis küsiti 90 eurot. Siin 35 ja tulemus on minu jaoks sama hea." } },
  { name: "Kristi", date: { en: "August 2025", et: "august 2025" }, rating: 4, text: { en: "The kit is good, but the instructions could use more photos. I ended up watching a YouTube video and then it clicked and went on nicely.", et: "Komplekt on hea, aga juhendis võiks olla rohkem pilte. Vaatasin lõpuks yt videot ja siis sai selgeks ja pandud ilusti." }, reply: { en: "Good point. We've since added more photos to the instructions — thanks for the feedback.", et: "Hea märkus. Täiendasime vahepeal juhendit piltidega, aitäh tagasiside eest." } },
  { name: "Getter", date: { en: "August 2025", et: "august 2025" }, rating: 5, photos: ["/reviews/pair-2-a.webp", "/reviews/pair-2-b.webp"], text: { en: "Ordered the 1.7mm because I wanted something subtle. Perfect — looks completely natural.", et: "Tellisin 1.7 mm, sest tahtsin midagi tagasihoidlikku. Perfektne, näeb loomulik välja." } },
  { name: "Anna", date: { en: "August 2025", et: "august 2025" }, rating: 5, text: { en: "arrived the very next day, really solid", et: "kohale jõudis juba järgmisel päeval, väga korralik" } },
  { name: "Merilin", date: { en: "August 2025", et: "august 2025" }, rating: 5, text: { en: "I've ordered twice now. The first lasted three weeks, the second is already on its fourth. Guess it depends on how well you apply it.", et: "Olen kaks korda tellinud. Esimene püsis kolm nädalat, teine juba neljandat nädalat. Sõltub vist sellest, kui hästi peale saad." } },
  { name: "Triin", date: { en: "September 2025", et: "september 2025" }, rating: 4, photos: ["/reviews/single-2.webp"], text: { en: "Good product, but one applicator in the box was a little bent. Still worked fine.", et: "Hea toode, aga pakendil oli üks aplikaator natuke viltu. Toimis siiski." }, reply: { en: "Sorry about that, Triin. Let us know right away next time and we'll send a free replacement.", et: "Vabandame selle pärast, Triin. Andke järgmine kord kohe teada, saadame uue tasuta." } },
  { name: "Laura", date: { en: "September 2025", et: "september 2025" }, rating: 5, text: { en: "I'm an incredibly impatient person and even I managed just fine.", et: "Ma olen kohutavalt kärsitu inimene ja isegi mina sain hakkama." } },
  { name: "Diana", date: { en: "September 2025", et: "september 2025" }, rating: 5, text: { en: "Really beautiful effect, especially the Borealis crystal. It practically glitters in the sun.", et: "Väga ilus efekt, eriti Boreale kristall. Vastu päikest lausa sädeleb." } },
  { name: "Jana", date: { en: "September 2025", et: "september 2025" }, rating: 5, photos: ["/reviews/pair-3-a.webp", "/reviews/pair-3-b.webp"], text: { en: "recommend it. everything needed was included, didn't have to buy anything extra.", et: "рекомендую. всё было в комплекте ничего дополнительно покупать не пришлось." } },
  { name: "Kaisa", date: { en: "October 2025", et: "oktoober 2025" }, rating: 4, text: { en: "Result is good, but I ordered the 2.3mm and it's a bit large for my small tooth. My own choice, though.", et: "Tulemus hea, aga tellisin 2.3 mm ja see on minu väikese hamba jaoks natuke suur. Minu enda valikuviga." }, reply: { en: "We've added a size comparison to the product page to make choosing easier.", et: "Lisasime tootelehele suuruste võrdluse, et valik oleks lihtsam." } },
  { name: "Mari-Liis", date: { en: "October 2025", et: "oktoober 2025" }, rating: 5, text: { en: "Bought it as a gift for my daughter, she was thrilled", et: "Ostsin tütrele kingituseks, oli väga rõõmus" } },
  { name: "Helena", date: { en: "November 2025", et: "november 2025" }, rating: 5, text: { en: "Price and quality are spot on. Would love to see more colors.", et: "Hind ja kvaliteet on paigas. Tuleks veel rohkem värve." } },
  { name: "Sirli", date: { en: "November 2025", et: "november 2025" }, rating: 5, text: { en: "Applied it at the kitchen table with a mirror, took about 8 minutes. Wasn't complicated at all.", et: "Paigaldasin köögilaua taga peegli abil, umbes 8 minutit. Ei olnud üldse keeruline." } },
  { name: "Elis", date: { en: "December 2025", et: "detsember 2025" }, rating: 4, text: { en: "Good product, delivery took 3 days for me instead of 1 to 2. But it was right before Christmas, so understandable.", et: "Toode hea, tarne võttis minu jaoks 3 päeva, mitte 1 kuni 2. Aga see oli enne jõule, nii et arusaadav." }, reply: { en: "Thanks for understanding, Elis. Parcel lockers really do get busy before the holidays.", et: "Aitäh mõistmise eest, Elis. Jõulude eel on pakiautomaadid tõesti koormatud." } },
  { name: "Marta", date: { en: "December 2025", et: "detsember 2025" }, rating: 5, text: { en: "very happy, definitely recommend it if you want to give it a try", et: "väga rahul, kindlasrti soovitan kes tahab proovida" } },
  { name: "Rebeka", date: { en: "December 2025", et: "detsember 2025" }, rating: 5, text: { en: "The UV lamp is small but mighty.", et: "UV lamp on väike aga võimas." } },
  { name: "Aleksandra", date: { en: "January 2026", et: "jaanuar 2026" }, rating: 5, photos: ["/reviews/pair-5-a.webp", "/reviews/pair-5-b.webp"], text: { en: "Excellent! Everything was clear, easy to follow right away.", et: "Otlitšno! Kõik oli ka eesti keeles selge, sai kiiresti aru." } },
  { name: "Kelly", date: { en: "January 2026", et: "jaanuar 2026" }, rating: 4, text: { en: "I like it, just wish the kit came with more than 10 crystals.", et: "Mulle meeldib, lihtsalt tahaks, et komplektis oleks rohkem kui 10 kristalli." }, reply: { en: "Thanks, Kelly. You can order extra crystals separately at https://bebeauty-diy.ee/crystals — we've also sent you the link by email.", et: "Aitäh, Kelly. Kristalle saab tellida ka eraldi: https://bebeauty-diy.ee/kristallid — saatsime lingi ka Teile e-postile." } },
  { name: "Piret", date: { en: "January 2026", et: "jaanuar 2026" }, rating: 5, text: { en: "Bought it out of curiosity and I'm very happy. Removal was painless too, just as promised.", et: "Ostsin uudishimust ja jäin väga rahule. Eemaldamine oli ka valutu, nagu lubatud." } },
  { name: "Silvia", date: { en: "January 2026", et: "jaanuar 2026" }, rating: 5, photos: ["/reviews/single-4.webp"], text: { en: "Best thing I've ordered this winter. Thank you!", et: "Parim asi, mille sel talvel tellinud olen. Aitäh!" } },
  { name: "Johanna", date: { en: "February 2026", et: "veebruar 2026" }, rating: 5, text: { en: "Applied it on my mom too — she was very skeptical at first, now she wants another one. :D", et: "Panin emale ka peale, tema oli algul väga skeptiline, nüüd tahab teist ka. :D" } },
  { name: "Kadri", date: { en: "February 2026", et: "veebruar 2026" }, rating: 4, text: { en: "Quality is OK. The box design could be a bit sturdier — mine arrived slightly crushed.", et: "Kvaliteet on OK. Karbi disain võiks natuke kindlam olla, minu oma jõudis kohale pisut muljutud." }, reply: { en: "Sorry about that, Kadri. We've since switched to sturdier packaging.", et: "Vabandame, Kadri. Vahetasime vahepeal pakendi tugevama vastu." } },
  { name: "Ave", date: { en: "February 2026", et: "veebruar 2026" }, rating: 5, text: { en: "fast delivery and very clear instructions. 10/10", et: "kiire tarne ja väga selge juhend. 10/10" } },
  { name: "Berit", date: { en: "February 2026", et: "veebruar 2026" }, rating: 5, photos: ["/reviews/single-5.webp"], text: { en: "I'd been to a salon before and paid three times as much. Not going back.", et: "Olin enne salongis käinud ja maksnud kolm korda rohkem. Enam ei lähe." } },
  { name: "Liina", date: { en: "March 2026", et: "märts 2026" }, rating: 5, text: { en: "Really great kit for beginners. Was worried I'd mess something up, but it's all very simple and safe.", et: "Väga hea komplekt algajale. Kartsin, et teen midagi katki, aga kõik on väga lihtne ja ohutu." } },
  { name: "Maarja", date: { en: "March 2026", et: "märts 2026" }, rating: 4, text: { en: "Good product, but mine lasted two weeks, not four.", et: "Hea toode, aga minul püsis kaks nädalat, mitte neli." }, reply: { en: "Thanks, Maarja. Two weeks is completely normal, though it usually lasts 2–4 weeks.", et: "Aitäh, Maarja. Kaks nädalat on täiesti normaalne, kuigi tavaliselt püsib üle 2–4 nädala." } },
  { name: "Kätlin", date: { en: "March 2026", et: "märts 2026" }, rating: 5, photos: ["/reviews/pair-6-a.webp", "/reviews/pair-6-b.webp"], text: { en: "Ordered two kits, one for me and one for my sister. Both of us got it right on the first try and it looked really cool", et: "Tellisin kaks komplekti, endale ja õele. Meil mõlemal õnnestus esimese korraga ja jäi väga lahe" } },
  { name: "Ingrid", date: { en: "April 2026", et: "aprill 2026" }, rating: 5, text: { en: "Super. The clear crystal is my favorite, very delicate.", et: "Super. Läbipaistev kristall on minu lemmik, väga peen." } },
  { name: "Tuuli", date: { en: "April 2026", et: "aprill 2026" }, rating: 5, text: { en: "everything worked exactly as described, no surprises. just how it should be", et: "kõik toimis nagu kirjas, ei mingeid üllatusi. just nii peabki" } },
  { name: "Sofia", date: { en: "April 2026", et: "aprill 2026" }, rating: 5, text: { en: "Great shopping experience, I'll definitely be back to buy more crystals.", et: "Väga hea ostukogemus, tulen kindlasti tagasi kristalle juurde ostma." } },
];

export const REVIEW_COUNT = DEFAULT_REVIEWS.length;

/**
 * 5-star reviews for the home page carousel, taken in curated order so the
 * pick follows the same hand-ordered list as everything else rather than a
 * second list that could drift. Nine, because the carousel shows three at a
 * time on desktop — with only three there would be nothing to rotate.
 */
export const FEATURED_REVIEWS = DEFAULT_REVIEWS.filter((r) => r.rating === 5).slice(0, 9);

/**
 * Mean rating, derived from the reviews actually shown — never a figure typed
 * in by hand. Rounded to one decimal, the precision the UI displays.
 */
export const AVERAGE_RATING =
  Math.round((DEFAULT_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEW_COUNT) * 10) / 10;

/** "4.8" in English, "4,8" in Estonian. */
export function formatRating(rating: number, locale: "en" | "et"): string {
  const s = rating.toFixed(1);
  return locale === "et" ? s.replace(".", ",") : s;
}

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const RELATIVE_UNIT_DAYS: Record<string, number> = {
  day: 1, days: 1,
  week: 7, weeks: 7,
  month: 30, months: 30,
  year: 365, years: 365,
};

/**
 * Turns a review's date into something sortable. Always parses the *English*
 * date string regardless of the active display locale — both language
 * versions describe the same real date, so sort order can't depend on which
 * one happens to be displayed. Dates are written two ways — an absolute
 * month ("March 2025") or a relative age ("2 months ago") — so neither
 * string comparison nor Date.parse works on them. Relative ages are resolved
 * against now, which is what they mean. Returns 0 for anything unrecognised,
 * sorting it last.
 */
export function reviewTimestamp(date: LocalizedText, now: number = Date.now()): number {
  const d = date.en.trim().toLowerCase();

  const relative = d.match(/^(\d+)\s+(\S+)\s+ago$/);
  if (relative) {
    const days = RELATIVE_UNIT_DAYS[relative[2]];
    if (days) return now - Number(relative[1]) * days * 86_400_000;
  }

  const absolute = d.match(/^(\S+)\s+(\d{4})$/);
  if (absolute) {
    const month = MONTHS.indexOf(absolute[1]);
    if (month >= 0) return Date.UTC(Number(absolute[2]), month, 1);
  }

  return 0;
}

// Quoted at checkout: short enough for the sidebar, and it answers the doubt
// a buyer actually has at that moment ("will I manage this myself?"). Matched
// by name, not index — reordering the list must never silently swap the
// checkout quote for a critical review.
export const CHECKOUT_REVIEW =
  DEFAULT_REVIEWS.find((r) => r.name === "Marii") ?? DEFAULT_REVIEWS[0];
