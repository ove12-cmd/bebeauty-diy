"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

const STEPS = [
  {
    q: "What effect do you want?",
    options: [
      { label: "Natural", sub: "Subtler, barely noticeable", value: "natural" },
      { label: "Balanced", sub: "The most popular choice for everyday wear.", value: "balanced" },
      { label: "Bold", sub: "A striking, eye-catching result.", value: "bold" },
    ],
  },
  {
    q: "How often do you wear accessories?",
    options: [
      { label: "Every day", sub: "An everyday part of your style.", value: "daily" },
      { label: "Sometimes", sub: "Parties, events, and special moments.", value: "sometimes" },
      { label: "Rarely", sub: "You prefer a minimalist look.", value: "rarely" },
    ],
  },
];

const RESULT: Record<string, { size: string; id: string; desc: string }> = {
  natural:  { size: "1.7 mm", id: "s17", desc: "The ideal choice for a natural, elegant result. Great for everyday wear, and the most popular size to start with." },
  balanced: { size: "2.0 mm", id: "s20", desc: "The perfect balance between natural and eye-catching. Ideal if you want a noticeable yet elegant result." },
  bold:     { size: "2.3 mm", id: "s23", desc: "A striking choice that adds maximum sparkle to your smile. Ideal if you want a bold, eye-catching result." },
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
        <p className="bb-quiz__label">Find your perfect tooth gem</p>
        <h2 className="bb-quiz__title">Answer two quick questions<br />and we&apos;ll recommend the size that suits you best.</h2>

        {!done ? (
          <div className="bb-quiz__card">
            <div className="bb-quiz__steps">
              <span className="bb-quiz__steps-label">Question {step + 1}/{STEPS.length}</span>
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
            <p className="bb-quiz__result-label">Your recommendation</p>
            <p className="bb-quiz__result-size">{result?.size}</p>
            <p className="bb-quiz__result-desc">{result?.desc}</p>
            <div className="bb-quiz__result-actions">
              <Button href={`/tooth-gem-kit?variant=${result?.id}`}>
                Shop the {result?.size} kit
              </Button>
              <button className="bb-quiz__restart" onClick={reset}>Try again</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
