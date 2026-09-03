"use client";

import { useEffect, useRef, useState } from "react";
import Stars from "@/components/ui/Stars";
import { FEATURED_REVIEWS } from "@/lib/reviews";

const INTERVAL_MS = 5000;
/** Cards rendered per step. The 2nd and 3rd are CSS-hidden below md. */
const PER_SLIDE = 3;

/**
 * Auto-advancing quote carousel for between the hero and the gallery.
 *
 * Three reviews at a time on desktop, one on mobile. That split is done in
 * CSS rather than with a matchMedia check, so the server and the first client
 * render agree — reading the viewport in an effect would show three stacked
 * cards on a phone until hydration corrected it.
 *
 * It advances by one card, not by three, which is what lets the same index
 * work for both layouts: mobile steps through every review in turn while
 * desktop slides a three-wide window along.
 *
 * Movement that starts on its own and runs longer than five seconds needs a
 * way to stop it (WCAG 2.2.2), so this offers an explicit pause button as
 * well as hover and focus holds — hover alone leaves keyboard users with no
 * control — and it doesn't auto-advance under prefers-reduced-motion.
 */
export default function TestimonialCarousel() {
  const reviews = FEATURED_REVIEWS;
  const [index, setIndex] = useState(0);
  // The button stops it for good; hover and focus only hold it while the
  // pointer or keyboard is inside, so tabbing past doesn't kill rotation.
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const holding = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (userPaused || reducedMotion || reviews.length < 2) return;
    const id = setInterval(() => {
      if (!holding.current) setIndex((i) => (i + 1) % reviews.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [userPaused, reducedMotion, reviews.length]);

  if (reviews.length === 0) return null;

  const autoRunning = !userPaused && !reducedMotion;
  const window_ = Array.from(
    { length: Math.min(PER_SLIDE, reviews.length) },
    (_, k) => reviews[(index + k) % reviews.length],
  );

  return (
    <section
      aria-roledescription="karussell"
      aria-label="Klientide arvustused"
      className="mx-auto w-full max-w-[1100px] px-5 py-8"
      onMouseEnter={() => (holding.current = true)}
      onMouseLeave={() => (holding.current = false)}
      onFocusCapture={() => (holding.current = true)}
      onBlurCapture={() => (holding.current = false)}
    >
      <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
        {window_.map((r, k) => (
          <li
            key={`${index}-${r.name}`}
            className={`rounded-2xl border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] p-5 ${
              k === 0 ? "" : "hidden md:block"
            }`}
          >
            <Stars rating={r.rating} label={`Hinnang ${r.rating} / 5`} className="mb-1.5" />
            <blockquote className="text-[14px] leading-relaxed text-[var(--bb-ink)]">
              {r.text}
            </blockquote>
            <p className="mt-2 text-[11px] text-[var(--bb-ink-3)]">
              {r.name} · {r.date}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Näita arvustust ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={
                i === index
                  ? "h-2 w-5 rounded-full bg-[var(--bb-gold)]"
                  : "h-2 w-2 rounded-full bg-[var(--bb-chip-border)] hover:bg-[var(--bb-gold-line)]"
              }
            />
          ))}
        </div>

        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            className="text-[11px] text-[var(--bb-ink-3)] underline hover:no-underline"
          >
            {autoRunning ? "Peata" : "Käivita"}
          </button>
        )}
      </div>
    </section>
  );
}
