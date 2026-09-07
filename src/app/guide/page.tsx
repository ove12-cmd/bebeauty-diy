"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import ImageLightbox from "@/components/ImageLightbox";
import { useCallback, useEffect, useState } from "react";
import "./guide.css";

type NeedItem = { icon?: string; img?: string; label: string };

type Step = {
  n: string;
  category: string;
  title: string;
  actions: string[];
  tip?: string;
  needs: NeedItem[];
};

const STEPS: Step[] = [
  {
    n: "01",
    category: "Prep",
    title: "Clean and prepare the surface",
    actions: ["Insert the cheek retractor", "Dry the tooth completely"],
    tip: "The tooth needs to be completely dry for the next step.",
    needs: [
      { img: "/tools/vatirull.png", label: "Cotton roll" },
      { img: "/tools/põsehoidja.png", label: "Cheek retractor" },
    ],
  },
  {
    n: "02",
    category: "Etch",
    title: "Prep the surface for bonding",
    actions: ["Apply a small amount of Etch gel to the tooth (blue bottle)", "Wait 30 seconds"],
    tip: "Don't use too much gel.",
    needs: [
      { img: "/tools/etch.png", label: "Etch gel" },
      { img: "/tools/mikrotikk.png", label: "Micro brush" },
    ],
  },
  {
    n: "03",
    category: "Cleanup",
    title: "Remove the Etch gel and dry",
    actions: ["Remove the Etch gel from the tooth with a cotton roll", "Dry the tooth again"],
    needs: [{ img: "/tools/vatirull.png", label: "Cotton roll" }],
  },
  {
    n: "04",
    category: "Application",
    title: "Add the adhesive",
    actions: ["Apply a small amount of adhesive to the tooth (white bottle)", "Use the micro brush for this"],
    needs: [
      { img: "/tools/liim.png", label: "Adhesive" },
      { img: "/tools/mikrotikk.png", label: "Micro brush" },
    ],
  },
  {
    n: "05",
    category: "Crystal",
    title: "Place the crystal",
    actions: ["Place the crystal onto the adhesive", "Press gently on the crystal"],
    tip: "Don't move the crystal once it's placed.",
    needs: [
      { icon: "💎", label: "Crystal" },
      { img: "/tools/aplikaator.png", label: "Applicator" },
    ],
  },
  {
    n: "06",
    category: "Curing",
    title: "UV curing",
    actions: ["Cure for 3 × 45 seconds with the UV lamp"],
    needs: [{ img: "/tools/uv.png", label: "UV lamp" }],
  },
];

const AFTERCARE = {
  eyebrow: "After application",
  title: "Keep the result clean",
  actions: ["Don't eat or drink for 1 hour", "Avoid hard and sticky foods for 24 hours"],
  note: "The result should last 2–4 weeks.",
};

const TOTAL = STEPS.length;

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M21 15l-5-5-9 9" />
    </svg>
  );
}

export default function GuidePage() {
  // 0 = intro · 1..TOTAL = steps · TOTAL+1 = done
  const [step, setStep] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const next = useCallback(() => setStep((s) => Math.min(TOTAL + 1, s + 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const isIntro = step === 0;
  const isDone = step === TOTAL + 1;
  const current = !isIntro && !isDone ? STEPS[step - 1] : null;

  return (
    <main className="bb-guide">
      <div className="bb-guide__inner">
        <Link href="/" className="bb-guide__back">← Back</Link>

        {isIntro && (
          <div className="bb-guide__intro" key="intro">
            <p className="bb-guide__eyebrow">Application Guide</p>
            <h1 className="bb-guide__intro-title">Tooth Gem Application</h1>
            <p className="bb-guide__intro-sub">Salon results at home in 10 minutes.</p>
            <div className="bb-guide__intro-meta">
              <span>{TOTAL} steps</span>
              <span className="bb-guide__meta-dot">·</span>
              <span>~10 minutes</span>
            </div>
            <Button className="bb-guide__start" onClick={next}>
              Start
            </Button>
          </div>
        )}

        {current && (
          <>
            <div className="bb-guide__progress">
              <span className="bb-guide__progress-label">Step {step}/{TOTAL}</span>
              <div className="bb-guide__dots">
                {STEPS.map((s, i) => {
                  const idx = i + 1;
                  const state = idx === step ? "active" : idx < step ? "done" : "todo";
                  return (
                    <button
                      key={s.n}
                      type="button"
                      className={`bb-guide__dot bb-guide__dot--${state}`}
                      onClick={() => setStep(idx)}
                      aria-label={`Step ${idx}: ${s.category}`}
                      aria-current={idx === step}
                    >
                      {idx}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bb-guide__step" key={step}>
              <span className="bb-guide__num" aria-hidden="true">{current.n}</span>
              <p className="bb-guide__cat">{current.category}</p>
              <h2 className="bb-guide__title">{current.title}</h2>

              <ul className="bb-guide__actions">
                {current.actions.map((a) => (
                  <li key={a} className="bb-guide__action">
                    <span className="bb-guide__check"><IconCheck /></span>
                    {a}
                  </li>
                ))}
              </ul>

              {current.tip && (
                <div className="bb-guide__tip">
                  <span className="bb-guide__tip-icon">💡</span>
                  <p><strong>Tip:</strong> {current.tip}</p>
                </div>
              )}

              <div className="bb-guide__needs">
                <span className="bb-guide__needs-label">You'll need</span>
                <div className="bb-guide__chips">
                  {current.needs.map((item) =>
                    item.img ? (
                      <button
                        key={item.label}
                        type="button"
                        className="bb-guide__chip bb-guide__chip--img"
                        onClick={() => setLightbox({ src: item.img!, alt: item.label })}
                      >
                        <span className="bb-guide__chip-thumb" aria-hidden="true">
                          <IconImage />
                        </span>
                        {item.label}
                      </button>
                    ) : (
                      <span key={item.label} className="bb-guide__chip">
                        <span aria-hidden="true">{item.icon}</span> {item.label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="bb-guide__nav">
              <button className="bb-guide__nav-btn" onClick={prev}>← Previous</button>
              <Button className="bb-guide__nav-next" onClick={next}>
                {step === TOTAL ? "Done" : "Next"}
              </Button>
            </div>
          </>
        )}

        {isDone && (
          <div className="bb-guide__done" key="done">
            <span className="bb-guide__done-badge"><IconCheck /></span>
            <h2 className="bb-guide__done-title">All done!</h2>

            <div className="bb-guide__aftercare">
              <p className="bb-guide__cat">{AFTERCARE.eyebrow}</p>
              <h3 className="bb-guide__aftercare-title">{AFTERCARE.title}</h3>
              <ul className="bb-guide__actions">
                {AFTERCARE.actions.map((a) => (
                  <li key={a} className="bb-guide__action">
                    <span className="bb-guide__check"><IconCheck /></span>
                    {a}
                  </li>
                ))}
              </ul>
              <p className="bb-guide__aftercare-note">{AFTERCARE.note}</p>
            </div>

            <div className="bb-guide__done-actions">
              <Button href="/tooth-gem-kit">
                Shop the kit
              </Button>
              <button className="bb-guide__restart" onClick={() => setStep(0)}>Start over</button>
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}
