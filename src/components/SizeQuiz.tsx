"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

const STEPS = [
  {
    q: "Millist efekti soovid?",
    options: [
      { label: "Loomulik", sub: "Peenem, vaevumärgatav", value: "natural" },
      { label: "Tasakaalus", sub: "Kõige populaarsem valik igapäevaseks kandmiseks.", value: "balanced" },
      { label: "Julge", sub: "Silmapaistev ja pilkupüüdev tulemus.", value: "bold" },
    ],
  },
  {
    q: "Kui sageli kannad aksessuaare?",
    options: [
      { label: "Iga päev", sub: "Sinu stiili igapäevane osa.", value: "daily" },
      { label: "Mõnikord", sub: "Peod, üritused ja erilised hetked.", value: "sometimes" },
      { label: "Harva", sub: "Eelistad minimalistlikku välimust.", value: "rarely" },
    ],
  },
];

const RESULT: Record<string, { size: string; id: string; desc: string }> = {
  natural:  { size: "1.7 mm", id: "s17", desc: "Ideaalne valik loomuliku ja elegantse tulemuse saavutamiseks. Sobib suurepäraselt igapäevaseks kandmiseks ning on kõige populaarsem suurus alustamiseks." },
  balanced: { size: "2.0 mm", id: "s20", desc: "Täiuslik tasakaal loomuliku ja silmapaistva välimuse vahel. Ideaalne, kui soovid märgatavat, kuid elegantset tulemust." },
  bold:     { size: "2.3 mm", id: "s23", desc: "Silmapaistev valik, mis lisab naeratusele maksimaalselt sära. Ideaalne, kui soovid julget ja pilkupüüdvat tulemust." },
};

export default function SizeQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function pick(val: string) {
    const next = [...answers, val];
    if (step < STEPS.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      setAnswers(next);
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  const resultKey = answers[0] ?? "";
  const result = RESULT[resultKey];

  return (
    <section className="bb-quiz">
      <div className="bb-quiz__inner">
        <p className="bb-quiz__label">Leia endale sobiv hambakristall</p>
        <h2 className="bb-quiz__title">Vasta kahele lühikesele küsimusele<br />ja soovitame sulle kõige sobivama suuruse.</h2>

        {!done ? (
          <div className="bb-quiz__card">
            <div className="bb-quiz__steps">
              <span className="bb-quiz__steps-label">Küsimus {step + 1}/{STEPS.length}</span>
              <div className="bb-quiz__steps-track">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`bb-quiz__steps-seg ${i <= step ? "bb-quiz__steps-seg--active" : ""}`}
                  />
                ))}
              </div>
            </div>
            <p className="bb-quiz__q">{STEPS[step].q}</p>
            <div className="bb-quiz__options">
              {STEPS[step].options.map(o => (
                <button key={o.value} className="bb-quiz__option" onClick={() => pick(o.value)}>
                  <span className="bb-quiz__option-label">{o.label}</span>
                  <span className="bb-quiz__option-sub">{o.sub}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bb-quiz__result">
            <p className="bb-quiz__result-label">Sinu soovitus</p>
            <p className="bb-quiz__result-size">{result?.size}</p>
            <p className="bb-quiz__result-desc">{result?.desc}</p>
            <div className="bb-quiz__result-actions">
              <Button href={`/shop?variant=${result?.id}`} arrow>
                Osta {result?.size} komplekt
              </Button>
              <button className="bb-quiz__restart" onClick={reset}>Proovi uuesti</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
