"use client";

import { useEffect, useRef, useState } from "react";
import Stars from "@/components/ui/Stars";
import { FEATURED_REVIEWS } from "@/lib/reviews";

const INTERVAL_MS = 5000;

/**
 * Auto-advancing quote carousel for between the hero and the gallery.
 *
 * Movement that starts on its own and runs longer than five seconds needs a
 * way to stop it (WCAG 2.2.2), so this pauses on hover and on focus and also
 * offers an explicit pause button — hover alone leaves keyboard users with no
 * control. It doesn't auto-advance at all under prefers-reduced-motion.
 */
export default function TestimonialCarousel() {
  const reviews = FEATURED_REVIEWS;
  const [index, setIndex] = useState(0);
  // Pressing the button stops it for good; hover and focus only hold it while
  // the pointer or keyboard is actually inside, so tabbing past the carousel
  // doesn't silently kill the rotation for the rest of the visit.
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

  const active = reviews[index];
  const autoRunning = !userPaused && !reducedMotion;

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
      <div className="rounded-2xl border border-[var(--bb-chip-border)] bg-[var(--bb-paper)] p-6 text-center">
        {/* Only the active slide is rendered, so assistive tech reads one
            quote rather than all three stacked. */}
        <div key={index} className="mx-auto max-w-[640px]">
          <Stars
            rating={active.rating}
            size="md"
            label={`Hinnang ${active.rating} / 5`}
            className="mb-2"
          />
          <blockquote className="text-[15px] leading-relaxed text-[var(--bb-ink)]">
            {active.text}
          </blockquote>
          <p className="mt-2 text-xs text-[var(--bb-ink-3)]">
            {active.name} · {active.date}
          </p>
        </div>

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
      </div>
    </section>
  );
}
