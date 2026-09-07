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
};

// Reviews live here rather than inside ReviewsSlider so a page can quote one
// without pulling the slider (and its lightbox + submit popup) into its
// bundle — the checkout needs the words, not the carousel.
export const DEFAULT_REVIEWS: Review[] = [
  { name: "Marii", date: "June 2025", rating: 5, text: "fast delivery, beautiful result, couldn't ask for more" },
  { name: "Kertu", date: "July 2025", rating: 5, photos: ["/reviews/pair-1-a.webp", "/reviews/pair-1-b.webp"], text: "Very happy! The UV lamp cures fast, and I'd definitely recommend using the cheek retractor too — surprisingly useful." },
  { name: "Grete", date: "November 2025", rating: 4, text: "Beautiful result, but the first time I used too much glue and it spread. The second time was perfect.", reply: "Exactly right, Grete — a very thin layer works best. Glad the second try was perfect." },
  { name: "Nele", date: "October 2025", rating: 5, photos: ["/reviews/single-3.webp"], text: "fast, easy, beautiful. what more do you need" },
  { name: "Viktoria", date: "October 2025", rating: 5, text: "Loved that the etch and glue are separate. Feels more professional than the cheap kits from AliExpress I'd tried before." },
  { name: "Katariina", date: "November 2025", rating: 5, photos: ["/reviews/pair-4-a.webp", "/reviews/pair-4-b.webp"], text: "I ordered the butterfly crystal as an extra and it's so cute. Everyone asks where I got it." },
  { name: "Hanna-Liis", date: "March 2025", rating: 5, text: "Got exactly the result I wanted. Applied it myself and it wasn't hard at all. Done in ten minutes.", photos: ["/testimonials/testimonial-1.jpg"], pos: "center 25%" },
  { name: "Jelizaveta", date: "April 2025", rating: 5, text: "At first I didn't believe it would turn out this well. But it looked beautiful and I got the placement right on the first try.", photos: ["/testimonials/testimonial-2.jpg"], pos: "center 35%" },
  { name: "K.", date: "May 2025", rating: 5, text: "The kit is good quality, everything was in the box. I got the 2.0mm and it was a good choice — noticeable but not over the top.", photos: ["/testimonials/testimonial-3.jpg"], pos: "center 62%" },
  { name: "Karina S.", date: "2 months ago", rating: 5, text: "Ordered it for my birthday. The instructions were easy to follow and even my first attempt looked great.", photos: ["/reviews/single-6.webp"] },
  { name: "Anete R.", date: "2 weeks ago", rating: 5, text: "Thought applying it would be a bigger hassle, but it wasn't. I've already recommended it to a couple of friends.", photos: ["/reviews/single-7.webp"] },
  { name: "Liis", date: "June 2025", rating: 4, text: "The result looks nice, but my first crystal fell off on day three. The second attempt worked better — I probably didn't dry the tooth enough.", reply: "Thanks for the feedback, Liis. Exactly — the tooth needs to be completely dry before gluing. Message us if you'd like a free replacement crystal." },
  { name: "Reelika S.", date: "3 months ago", rating: 5, text: "I've had a crystal applied at a salon before, but this kit is more convenient. I got the 2.3mm — it's week three and still sparkling." },
  { name: "Sandra", date: "July 2025", rating: 5, text: "Bought it together with a friend and we applied it on each other. Fun evening, and it turned out great for both of us." },
  { name: "Eva-Maria", date: "July 2025", rating: 5, photos: ["/reviews/single-1.webp"], text: "The salon wanted 90 euros. This was 35, and the result is just as good for me." },
  { name: "Kristi", date: "August 2025", rating: 4, text: "The kit is good, but the instructions could use more photos. I ended up watching a YouTube video and then it clicked and went on nicely.", reply: "Good point. We've since added more photos to the instructions — thanks for the feedback." },
  { name: "Getter", date: "August 2025", rating: 5, photos: ["/reviews/pair-2-a.webp", "/reviews/pair-2-b.webp"], text: "Ordered the 1.7mm because I wanted something subtle. Perfect — looks completely natural." },
  { name: "Anna", date: "August 2025", rating: 5, text: "arrived the very next day, really solid" },
  { name: "Merilin", date: "August 2025", rating: 5, text: "I've ordered twice now. The first lasted three weeks, the second is already on its fourth. Guess it depends on how well you apply it." },
  { name: "Triin", date: "September 2025", rating: 4, photos: ["/reviews/single-2.webp"], text: "Good product, but one applicator in the box was a little bent. Still worked fine.", reply: "Sorry about that, Triin. Let us know right away next time and we'll send a free replacement." },
  { name: "Laura", date: "September 2025", rating: 5, text: "I'm an incredibly impatient person and even I managed just fine." },
  { name: "Diana", date: "September 2025", rating: 5, text: "Really beautiful effect, especially the Borealis crystal. It practically glitters in the sun." },
  { name: "Jana", date: "September 2025", rating: 5, photos: ["/reviews/pair-3-a.webp", "/reviews/pair-3-b.webp"], text: "recommend it. everything needed was included, didn't have to buy anything extra." },
  { name: "Kaisa", date: "October 2025", rating: 4, text: "Result is good, but I ordered the 2.3mm and it's a bit large for my small tooth. My own choice, though.", reply: "We've added a size comparison to the product page to make choosing easier." },
  { name: "Mari-Liis", date: "October 2025", rating: 5, text: "Bought it as a gift for my daughter, she was thrilled" },
  { name: "Helena", date: "November 2025", rating: 5, text: "Price and quality are spot on. Would love to see more colors." },
  { name: "Sirli", date: "November 2025", rating: 5, text: "Applied it at the kitchen table with a mirror, took about 8 minutes. Wasn't complicated at all." },
  { name: "Elis", date: "December 2025", rating: 4, text: "Good product, delivery took 3 days for me instead of 1 to 2. But it was right before Christmas, so understandable.", reply: "Thanks for understanding, Elis. Parcel lockers really do get busy before the holidays." },
  { name: "Marta", date: "December 2025", rating: 5, text: "very happy, definitely recommend it if you want to give it a try" },
  { name: "Rebeka", date: "December 2025", rating: 5, text: "The UV lamp is small but mighty." },
  { name: "Aleksandra", date: "January 2026", rating: 5, photos: ["/reviews/pair-5-a.webp", "/reviews/pair-5-b.webp"], text: "Excellent! Everything was clear, easy to follow right away." },
  { name: "Kelly", date: "January 2026", rating: 4, text: "I like it, just wish the kit came with more than 10 crystals.", reply: "Thanks, Kelly. You can order extra crystals separately at https://bebeauty-diy.ee/crystals — we've also sent you the link by email." },
  { name: "Piret", date: "January 2026", rating: 5, text: "Bought it out of curiosity and I'm very happy. Removal was painless too, just as promised." },
  { name: "Silvia", date: "January 2026", rating: 5, photos: ["/reviews/single-4.webp"], text: "Best thing I've ordered this winter. Thank you!" },
  { name: "Johanna", date: "February 2026", rating: 5, text: "Applied it on my mom too — she was very skeptical at first, now she wants another one. :D" },
  { name: "Kadri", date: "February 2026", rating: 4, text: "Quality is OK. The box design could be a bit sturdier — mine arrived slightly crushed.", reply: "Sorry about that, Kadri. We've since switched to sturdier packaging." },
  { name: "Ave", date: "February 2026", rating: 5, text: "fast delivery and very clear instructions. 10/10" },
  { name: "Berit", date: "February 2026", rating: 5, photos: ["/reviews/single-5.webp"], text: "I'd been to a salon before and paid three times as much. Not going back." },
  { name: "Liina", date: "March 2026", rating: 5, text: "Really great kit for beginners. Was worried I'd mess something up, but it's all very simple and safe." },
  { name: "Maarja", date: "March 2026", rating: 4, text: "Good product, but mine lasted two weeks, not four.", reply: "Thanks, Maarja. Two weeks is completely normal, though it usually lasts 2–4 weeks." },
  { name: "Kätlin", date: "March 2026", rating: 5, photos: ["/reviews/pair-6-a.webp", "/reviews/pair-6-b.webp"], text: "Ordered two kits, one for me and one for my sister. Both of us got it right on the first try and it looked really cool" },
  { name: "Ingrid", date: "April 2026", rating: 5, text: "Super. The clear crystal is my favorite, very delicate." },
  { name: "Tuuli", date: "April 2026", rating: 5, text: "everything worked exactly as described, no surprises. just how it should be" },
  { name: "Sofia", date: "April 2026", rating: 5, text: "Great shopping experience, I'll definitely be back to buy more crystals." },
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

/** e.g. "4.8". */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
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
 * Turns a human review date into something sortable. The dates are written
 * two ways — an absolute month ("March 2025") or a relative age ("2 months
 * ago") — so neither string comparison nor Date.parse works on them.
 * Relative ages are resolved against now, which is what they mean.
 * Returns 0 for anything unrecognised, sorting it last.
 */
export function reviewTimestamp(date: string, now: number = Date.now()): number {
  const d = date.trim().toLowerCase();

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
