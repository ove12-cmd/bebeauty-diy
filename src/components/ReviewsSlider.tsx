import Image from "next/image";

const REVIEWS = [
  { name: "Laura K.", text: "Täpselt selline tulemus, nagu lootsin. Paigaldamine oli lihtne ja kristall püsis üllatavalt hästi. 10 minutit ja valmis.", date: "märts 2025", img: "/testimonials/testimonial-1.jpg", pos: "center 25%" },
  { name: "Marii T.", text: "Olin alguses skeptiline, aga tulemus jäi tõesti ilus. Sain paigaldamisega esimese korraga hakkama.", date: "aprill 2025", img: "/testimonials/testimonial-2.jpg", pos: "center 35%" },
  { name: "Keidi L.", text: "Väga kvaliteetne komplekt. Kõik vajalik oli kaasas ja tulemus jäi täpselt selline, nagu soovisin. 2.0 mm oli ideaalne valik – täpselt piisavalt märgatav.", date: "mai 2025", img: "/testimonials/testimonial-3.jpg", pos: "center 62%" },
  { name: "Kristina P.", text: "Tellisin endale sünnipäevakingituseks ja ei kahetse hetkegi. Juhend oli selge, tulemus jäi ilus juba esimesest korrast.", date: "juuni 2026", img: "/results/result-1.jpg", pos: "center" },
  { name: "Anete R.", text: "Kartsin, et lähen norusse, aga läks lihtsamalt kui arvasin. Aplikaator tegi paigaldamise tõesti kiireks. Soovitasin juba mitmele sõbrannale.", date: "juuli 2026", img: "/results/result-2.jpg", pos: "center" },
  { name: "Reelika S.", text: "Võtsin 2.3mm suuruse ja tulemus on täpselt nii silmatorkav kui lootsin. Kolmas nädal juba peal ja ikka läikivad.", date: "mai 2026", img: "/results/result-3.jpg", pos: "center" },
];

export default function ReviewsSlider() {
  return (
    <section className="bb-testi">
      <span className="bb-testi__label">⭐ 500+ rahulolevat klienti</span>
      <h2 className="bb-testi__heading">Mida meie kliendid ütlevad</h2>

      <div className="bb-testi__grid">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bb-testi__card">
            <div className="bb-testi__img">
              <Image
                src={r.img}
                alt={`${r.name} tulemus`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover", objectPosition: r.pos }}
              />
            </div>
            <span className="bb-stars">★★★★★</span>
            <p className="bb-testi__text">{r.text}</p>
            <div className="bb-testi__meta">
              <span className="bb-testi__name">{r.name}</span>
              <span className="bb-testi__date">{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
