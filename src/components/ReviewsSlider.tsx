"use client";

import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ReviewSubmitPopup from "@/components/ReviewSubmitPopup";
import { DEFAULT_REVIEWS, type Review } from "@/lib/reviews";

// Review data and the Review type live in lib/reviews.ts. Re-exported here
// so existing importers keep working unchanged.
export type { Review };
export { DEFAULT_REVIEWS };

// Google's own default-avatar palette — cycled by position so each
// reviewer gets a distinct, stable color.
const AVATAR_COLORS = ["#1a73e8", "#d93025", "#188038", "#f9ab00", "#9334e6", "#12b5cb"];

export default function ReviewsSlider({
  reviews = DEFAULT_REVIEWS,
  heading = "Mida meie kliendid ütlevad",
  id,
}: {
  reviews?: Review[];
  heading?: string;
  id?: string;
}) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id={id} className="bb-testi">
      <h2 className="bb-testi__heading">{heading}</h2>

      <div className="bb-testi__grid">
        {reviews.map((r, i) => (
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
