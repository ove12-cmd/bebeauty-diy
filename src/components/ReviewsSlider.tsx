"use client";

import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ReviewSubmitPopup from "@/components/ReviewSubmitPopup";

const REVIEWS = [
  { name: "Hanna-Liis", text: "Täpselt selline tulemus, nagu lootsin. Paigaldamine oli lihtne ja kristall püsis üllatavalt hästi. 10 minutit ja valmis.", date: "märts 2025", img: "/testimonials/testimonial-1.jpg", pos: "center 25%" },
  { name: "Jelizaveta", text: "Olin alguses skeptiline, aga tulemus jäi tõesti ilus. Sain paigaldamisega esimese korraga hakkama.", date: "aprill 2025", img: "/testimonials/testimonial-2.jpg", pos: "center 35%" },
  { name: "K", text: "Väga kvaliteetne komplekt. Kõik vajalik oli kaasas ja tulemus jäi täpselt selline, nagu soovisin. 2.0 mm oli ideaalne valik – täpselt piisavalt märgatav.", date: "mai 2025", img: "/testimonials/testimonial-3.jpg", pos: "center 62%" },
  { name: "Karina Sokolova", text: "Tellisin endale sünnipäevakingituseks ja ei kahetse hetkegi. Juhend oli selge, tulemus jäi ilus juba esimesest korrast.", date: "2 kuud tagasi", img: "/testimonials/testimonial-4.jpg", pos: "center" },
  { name: "Anete R.", text: "Kartsin, et seda on keeruline paigaldada, aga oli palju lihtsam kui arvasin. Paigalduskomplektis oli kõik vajalik olemas ja tõesti nii lihtne oli. Soovitasin juba mitmele sõbrannale.", date: "2 nädalat tagasi", img: "/results/result-2.jpg", pos: "center" },
  { name: "Reelika S.", text: "Mul oli juba enne salongis hambale kristall paigaldatud. Aga see komplekt on palju mugavam ja nii lihtne oli paigaldada. Võtsin 2.3mm suuruse ja tulemus on täpselt nii silmatorkav kui lootsin. Kolmas nädal juba peal ja ikka läikivad.", date: "3 kuud tagasi", img: "/results/result-3.jpg", pos: "center" },
];

// Google's own default-avatar palette — cycled by position so each
// reviewer gets a distinct, stable color.
const AVATAR_COLORS = ["#1a73e8", "#d93025", "#188038", "#f9ab00", "#9334e6", "#12b5cb"];

export default function ReviewsSlider() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section className="bb-testi">
      <h2 className="bb-testi__heading">Mida meie kliendid ütlevad</h2>

      <div className="bb-testi__grid">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bb-testi__card">
            <div className="bb-testi__head">
              <span
                className="bb-testi__avatar"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {r.name.charAt(0).toUpperCase()}
              </span>
              <div className="bb-testi__head-info">
                <span className="bb-testi__name">{r.name}</span>
                <span className="bb-testi__date">{r.date}</span>
              </div>
            </div>
            <span className="bb-stars">★★★★★</span>
            <p className="bb-testi__text">{r.text}</p>
            <button
              type="button"
              className="bb-testi__photo"
              aria-label={`Suurenda ${r.name} tulemuse foto`}
              onClick={() => setLightbox({ src: r.img, alt: `${r.name} tulemus` })}
            >
              <Image
                src={r.img}
                alt={`${r.name} tulemus`}
                width={72}
                height={72}
                style={{ objectFit: "cover", objectPosition: r.pos }}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="bb-testi__add">
        <ReviewSubmitPopup />
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
