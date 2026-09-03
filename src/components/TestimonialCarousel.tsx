"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import Stars from "@/components/ui/Stars";
import { FEATURED_REVIEWS } from "@/lib/reviews";

/** Cards rendered per step. All but the first are CSS-hidden below md. */
const PER_SLIDE = 5;

/**
 * Auto-advancing quote carousel for between the hero and the gallery.
 *
 * Five reviews at a time on desktop, one on mobile. That split is CSS, not a
 * matchMedia read, so the server and first client render agree — reading the
 * viewport in an effect would flash five stacked cards on a phone until
 * hydration corrected it.
 *
 * It advances by one card rather than five, which is what lets one index
 * serve both layouts: mobile steps through every review in turn while desktop
 * slides a five-wide window along.
 *
 * Timing comes from the progress bar's own animation rather than a separate
 * interval: the bar's animationend advances the slide. That way the bar can
 * never drift out of step with the rotation, and pausing it (on hover, on
 * focus, or via the button) pauses the rotation by construction. Under
 * prefers-reduced-motion there's no animation and so no auto-advance.
 */
export default function TestimonialCarousel() {
  const reviews = FEATURED_REVIEWS;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reviews.length === 0) return null;

  const total = reviews.length;
  const step = (delta: number) => setIndex((i) => (i + delta + total) % total);
  const autoRunning = !userPaused && !reducedMotion;
  const visible = Array.from(
    { length: Math.min(PER_SLIDE, total) },
    (_, k) => reviews[(index + k) % total],
  );

  return (
    <section
      aria-roledescription="karussell"
      aria-label="Klientide arvustused"
      className="bb-carousel w-full px-5 pb-8 md:px-14"
      style={{ marginTop: "-1.5rem" }}
    >
      <div className="rounded-2xl bg-[var(--bb-chip-bg)] p-4 md:p-5">
        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-5">
          {visible.map((r, k) => (
            <li
              // Re-keying on index remounts the card, replaying the entry
              // animation without any transition state to manage.
              key={`${index}-${r.name}`}
              className={`bb-slide-in flex flex-col rounded-xl border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] p-4 ${
                k === 0 ? "" : "hidden md:flex"
              }`}
              style={{ animationDelay: `${k * 60}ms` }}
            >
              <Stars rating={r.rating} label={`Hinnang ${r.rating} / 5`} className="mb-1.5" />
              <blockquote className="text-[13px] leading-relaxed text-[var(--bb-ink)]">
                {r.text}
              </blockquote>

              {r.photos && r.photos.length > 0 && (
                <div className="mt-2.5 flex gap-1.5">
                  {r.photos.slice(0, 2).map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setLightbox({ src, alt: `${r.name} tulemus` })}
                      aria-label={`Suurenda ${r.name} tulemuse foto`}
                      className="relative block h-12 w-12 cursor-zoom-in overflow-hidden rounded-lg bg-[var(--bb-chip-bg)] transition-transform hover:-translate-y-0.5"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="48px"
                        style={{ objectFit: "cover", objectPosition: r.pos ?? "center" }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <p className="mt-auto pt-2 text-[11px] text-[var(--bb-ink-3)]">
                {r.name} · {r.date}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-center gap-3">
          {/* Arrows are for touch, where there's no hover affordance and only
              one card is visible. Desktop has the dots. */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Eelmine arvustus"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] text-[var(--bb-ink-2)] transition-colors hover:border-[var(--bb-gold)] md:hidden"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {reviews.map((r, i) => (
              <button
                key={r.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Näita arvustust ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 ease-out ${
                  i === index
                    ? "w-10 bg-[var(--bb-gold-line)]"
                    : "w-2 bg-[var(--bb-chip-border)] hover:w-4 hover:bg-[var(--bb-gold-line)]"
                }`}
              >
                {i === index && !reducedMotion && (
                  <span
                    // Keyed on index so the fill restarts each slide, and its
                    // animationend is what advances the carousel.
                    key={index}
                    className="bb-carousel__progress absolute inset-y-0 left-0 block w-full origin-left bg-[var(--bb-gold)]"
                    style={{ animationPlayState: userPaused ? "paused" : "running" }}
                    onAnimationEnd={() => step(1)}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Järgmine arvustus"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] text-[var(--bb-ink-2)] transition-colors hover:border-[var(--bb-gold)] md:hidden"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              className="text-[11px] text-[var(--bb-ink-3)] underline transition-colors hover:no-underline"
            >
              {autoRunning ? "Peata" : "Käivita"}
            </button>
          )}
        </div>
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
