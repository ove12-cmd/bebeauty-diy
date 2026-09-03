export type Review = { name: string; text: string; date: string; img: string; pos: string };

// Real customer reviews. Lives here rather than inside ReviewsSlider so a
// page can quote one without pulling the slider (and its lightbox + submit
// popup) into its bundle — the checkout needs the words, not the carousel.
export const DEFAULT_REVIEWS: Review[] = [
  { name: "Hanna-Liis", text: "Täpselt selline tulemus, nagu lootsin. Paigaldamine oli lihtne ja kristall püsis üllatavalt hästi. 10 minutit ja valmis.", date: "märts 2025", img: "/testimonials/testimonial-1.jpg", pos: "center 25%" },
  { name: "Jelizaveta", text: "Olin alguses skeptiline, aga tulemus jäi tõesti ilus. Sain paigaldamisega esimese korraga hakkama.", date: "aprill 2025", img: "/testimonials/testimonial-2.jpg", pos: "center 35%" },
  { name: "K", text: "Väga kvaliteetne komplekt. Kõik vajalik oli kaasas ja tulemus jäi täpselt selline, nagu soovisin. 2.0 mm oli ideaalne valik – täpselt piisavalt märgatav.", date: "mai 2025", img: "/testimonials/testimonial-3.jpg", pos: "center 62%" },
  { name: "Karina Sokolova", text: "Tellisin endale sünnipäevakingituseks ja ei kahetse hetkegi. Juhend oli selge, tulemus jäi ilus juba esimesest korrast.", date: "2 kuud tagasi", img: "/testimonials/testimonial-4.jpg", pos: "center" },
  { name: "Anete R.", text: "Kartsin, et seda on keeruline paigaldada, aga oli palju lihtsam kui arvasin. Paigalduskomplektis oli kõik vajalik olemas ja tõesti nii lihtne oli. Soovitasin juba mitmele sõbrannale.", date: "2 nädalat tagasi", img: "/results/result-2.jpg", pos: "center" },
  { name: "Reelika S.", text: "Mul oli juba enne salongis hambale kristall paigaldatud. Aga see komplekt on palju mugavam ja nii lihtne oli paigaldada. Võtsin 2.3mm suuruse ja tulemus on täpselt nii silmatorkav kui lootsin. Kolmas nädal juba peal ja ikka läikivad.", date: "3 kuud tagasi", img: "/results/result-3.jpg", pos: "center" },
];

// Quoted at checkout: short enough to read in the sidebar, and it answers the
// doubt a buyer actually has at that moment ("will I manage this myself?").
export const CHECKOUT_REVIEW = DEFAULT_REVIEWS[1];
