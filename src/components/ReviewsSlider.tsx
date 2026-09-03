"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ReviewSubmitPopup from "@/components/ReviewSubmitPopup";
import Stars from "@/components/ui/Stars";
import {
  AVERAGE_RATING,
  DEFAULT_REVIEWS,
  formatRating,
  reviewTimestamp,
  type Review,
} from "@/lib/reviews";

// Review data and the Review type live in lib/reviews.ts. Re-exported here
// so existing importers keep working unchanged.
export type { Review };
export { DEFAULT_REVIEWS };

const PAGE_SIZE = 6;

// Array.prototype.sort is stable, so every comparator below falls back to the
// curated order for ties rather than shuffling equal reviews around.
const SORTS: { id: string; label: string; compare?: (a: Review, b: Review) => number }[] = [
  // No comparator: the hand-picked order, which deliberately puts a replied-to
  // 4-star review on the first page.
  { id: "curated", label: "Soovitatud" },
  { id: "newest", label: "Uuemad enne", compare: (a, b) => reviewTimestamp(b.date) - reviewTimestamp(a.date) },
  { id: "oldest", label: "Vanemad enne", compare: (a, b) => reviewTimestamp(a.date) - reviewTimestamp(b.date) },
  { id: "highest", label: "Kõrgeim hinnang", compare: (a, b) => b.rating - a.rating },
  { id: "lowest", label: "Madalaim hinnang", compare: (a, b) => a.rating - b.rating },
  { id: "answered", label: "Vastatud enne", compare: (a, b) => Number(!!b.reply) - Number(!!a.reply) },
];

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
  const [page, setPage] = useState(1);
  const [sortId, setSortId] = useState(SORTS[0].id);
  const gridRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    const compare = SORTS.find((s) => s.id === sortId)?.compare;
    return compare ? [...reviews].sort(compare) : reviews;
  }, [reviews, sortId]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  function goTo(next: number) {
    setPage(Math.min(pageCount, Math.max(1, next)));
    // Only pull the grid back into view when paging has left it above the
    // fold — scrolling when it's already visible would yank the page around.
    const top = gridRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) gridRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  return (
    <section id={id} className="bb-testi">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="bb-testi__heading !mb-0">{heading}</h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 text-xs text-[var(--bb-ink-3)]">
            <Stars rating={AVERAGE_RATING} />
            {formatRating(AVERAGE_RATING)} · {sorted.length} arvustust
          </span>

          <span className="flex items-center gap-1.5">
            <label htmlFor="reviews-sort" className="text-xs text-[var(--bb-ink-3)]">
              Järjesta
            </label>
            <select
              id="reviews-sort"
              value={sortId}
              onChange={(e) => {
                setSortId(e.target.value);
                setPage(1); // a new order makes the old page number meaningless
              }}
              className="rounded-lg border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] px-2 py-1 text-xs text-[var(--bb-ink-2)]"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      <div ref={gridRef} className="bb-testi__grid">
        {visible.map((r, i) => (
          <div key={`${r.name}-${start + i}`} className="bb-testi__card">
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

      {pageCount > 1 && (
        <>
          <nav
            aria-label="Arvustuste lehed"
            className="mt-5 flex flex-wrap items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-[var(--bb-chip-border)] px-2.5 py-1.5 text-xs text-[var(--bb-ink-2)] disabled:opacity-40"
            >
              ‹ Eelmine
            </button>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Leht ${p}`}
                className={
                  p === page
                    ? "min-w-8 rounded-lg border border-[var(--bb-gold)] bg-[var(--bb-gold-tint)] px-2.5 py-1.5 text-xs font-semibold text-[var(--bb-gold-deep)]"
                    : "min-w-8 rounded-lg border border-[var(--bb-chip-border)] px-2.5 py-1.5 text-xs text-[var(--bb-ink-2)]"
                }
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page === pageCount}
              className="rounded-lg border border-[var(--bb-chip-border)] px-2.5 py-1.5 text-xs text-[var(--bb-ink-2)] disabled:opacity-40"
            >
              Järgmine ›
            </button>
          </nav>

          <p aria-live="polite" className="sr-only">
            Leht {page} / {pageCount}
          </p>
        </>
      )}

      <div className="bb-testi__add">
        <ReviewSubmitPopup />
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
