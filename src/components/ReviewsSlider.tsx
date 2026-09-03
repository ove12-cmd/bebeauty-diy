"use client";

import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ReviewSubmitPopup from "@/components/ReviewSubmitPopup";
import Stars from "@/components/ui/Stars";
import { DEFAULT_REVIEWS, type Review } from "@/lib/reviews";

// Review data and the Review type live in lib/reviews.ts. Re-exported here
// so existing importers keep working unchanged.
export type { Review };
export { DEFAULT_REVIEWS };

// How many to show before the buyer asks for the rest. Rendering all 44 at
// once buries the page's remaining content.
const PREVIEW_COUNT = 6;

export default function ReviewsSlider({
  reviews = DEFAULT_REVIEWS,
  heading = "Mida kliendid ütlevad",
  id,
}: {
  reviews?: Review[];
  heading?: string;
  id?: string;
}) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const hasMore = reviews.length > PREVIEW_COUNT;

  return (
    <section id={id} className="bb-testi">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="bb-testi__heading !mb-0">{heading}</h2>
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs text-[var(--bb-gold-deep)] underline hover:no-underline"
            aria-expanded={showAll}
          >
            {showAll ? "Näita vähem" : `Kõik ${reviews.length}`}
          </button>
        )}
      </div>

      <div className="bb-testi__grid">
        {visible.map((r, i) => (
          <div key={`${r.name}-${i}`} className="bb-testi__card">
            {r.img && (
              <button
                type="button"
                className="bb-testi__photo"
                aria-label={`Suurenda ${r.name} tulemuse foto`}
                onClick={() => setLightbox({ src: r.img!, alt: `${r.name} tulemus` })}
              >
                <Image
                  src={r.img}
                  alt={`${r.name} tulemus`}
                  width={72}
                  height={72}
                  style={{ objectFit: "cover", objectPosition: r.pos ?? "center" }}
                />
              </button>
            )}

            <Stars rating={r.rating} label={`Hinnang ${r.rating} / 5`} />
            <p className="bb-testi__text">{r.text}</p>
            <span className="bb-testi__date">
              {r.name} · {r.date}
            </span>

            {r.reply && (
              <p className="mt-2.5 rounded-lg bg-[var(--bb-gold-tint)] px-3 py-2 text-[12px] leading-relaxed text-[var(--bb-ink-2)]">
                <span className="font-semibold text-[var(--bb-ink)]">BeBeauty:</span> {r.reply}
              </p>
            )}
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
