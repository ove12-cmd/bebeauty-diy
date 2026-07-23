"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import "./juhend.css";

type Step = {
  n: string;
  category: string;
  title: string;
  actions: string[];
  tip?: string;
  needs: { icon: string; label: string }[];
};

const STEPS: Step[] = [
  {
    n: "01",
    category: "Ettevalmistus",
    title: "Puhasta ja ettevalmista pind",
    actions: ["Puhasta hammas põhjalikult", "Kuivata hammas täielikult"],
    tip: "Järgmise sammu jaoks peab hammas olema täiesti kuiv.",
    needs: [{ icon: "🪥", label: "Hambahari" }, { icon: "🧻", label: "Vatirull" }],
  },
  {
    n: "02",
    category: "Etch",
    title: "Valmista pind kinnituseks",
    actions: ["Kanna väike kogus Etch geeli hambale", "Oota 30 sekundit"],
    tip: "Ära kasuta liiga palju geeli.",
    needs: [{ icon: "💧", label: "Etch geel" }, { icon: "🖌️", label: "Aplikaator" }],
  },
  {
    n: "03",
    category: "Puhastus",
    title: "Eemalda Etch geel ja kuivata",
    actions: ["Eemalda Etch geel hambalt vatirulliga", "Kuivata hammas uuesti"],
    needs: [{ icon: "🧻", label: "Vatirull" }],
  },
  {
    n: "04",
    category: "Paigaldus",
    title: "Lisa liim",
    actions: ["Pane väike kogus liimi hambale", "Kasuta selleks tikku"],
    needs: [{ icon: "🧴", label: "Liim" }, { icon: "🪵", label: "Tikk" }],
  },
  {
    n: "05",
    category: "Kristall",
    title: "Aseta kristall",
    actions: ["Pane kristall liimi peale", "Vajuta õrnalt kristallile"],
    tip: "Ära liiguta kristalli pärast asetust.",
    needs: [{ icon: "💎", label: "Kristall" }, { icon: "🖌️", label: "Aplikaator" }],
  },
  {
    n: "06",
    category: "Kinnitamine",
    title: "UV-kõvastamine",
    actions: ["Kõvasta 4 × 20 sekundit UV-lambiga"],
    needs: [{ icon: "🔦", label: "UV-lamp" }],
  },
];

const AFTERCARE = {
  eyebrow: "Pärast paigaldust",
  title: "Hoia tulemus puhtana",
  actions: ["Ära söö ega joo 1 tund", "Väldi kõvasid ja kleepuvaid toite 24 tundi"],
  note: "Tulemus võiks püsida 2–4 nädalat.",
};

const TOTAL = STEPS.length;

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function GuidePage() {
  // 0 = intro · 1..TOTAL = steps · TOTAL+1 = done
  const [step, setStep] = useState(0);

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
        <Link href="/" className="bb-guide__back">← Tagasi</Link>

        {isIntro && (
          <div className="bb-guide__intro" key="intro">
            <p className="bb-guide__eyebrow">Paigaldusjuhend</p>
            <h1 className="bb-guide__intro-title">Hambakristalli paigaldus</h1>
            <p className="bb-guide__intro-sub">Salongitulemus kodus 10 minutiga.</p>
            <div className="bb-guide__intro-meta">
              <span>{TOTAL} sammu</span>
              <span className="bb-guide__meta-dot">·</span>
              <span>~10 minutit</span>
            </div>
            <Button className="bb-guide__start" onClick={next} arrow>
              Alusta
            </Button>
          </div>
        )}

        {current && (
          <>
            <div className="bb-guide__progress">
              <span className="bb-guide__progress-label">Samm {step}/{TOTAL}</span>
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
                      aria-label={`Samm ${idx}: ${s.category}`}
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
                  <p><strong>Nipp:</strong> {current.tip}</p>
                </div>
              )}

              <div className="bb-guide__needs">
                <span className="bb-guide__needs-label">Vaja läheb</span>
                <div className="bb-guide__chips">
                  {current.needs.map((item) => (
                    <span key={item.label} className="bb-guide__chip">
                      <span aria-hidden="true">{item.icon}</span> {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bb-guide__nav">
              <button className="bb-guide__nav-btn" onClick={prev}>← Eelmine</button>
              <Button className="bb-guide__nav-next" onClick={next} arrow>
                {step === TOTAL ? "Valmis" : "Järgmine"}
              </Button>
            </div>
          </>
        )}

        {isDone && (
          <div className="bb-guide__done" key="done">
            <span className="bb-guide__done-badge"><IconCheck /></span>
            <h2 className="bb-guide__done-title">Valmis!</h2>

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
              <Button href="/hambakristalli-komplekt" arrow>
                Osta komplekt
              </Button>
              <button className="bb-guide__restart" onClick={() => setStep(0)}>Alusta uuesti</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
