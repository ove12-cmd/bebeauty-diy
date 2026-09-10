"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function SizeQuiz() {
  const t = useTranslations("sizeQuiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const STEPS = [
    {
      q: t("q1Question"),
      options: [
        { label: t("q1Option1Label"), sub: t("q1Option1Sub"), value: "natural" },
        { label: t("q1Option2Label"), sub: t("q1Option2Sub"), value: "balanced" },
        { label: t("q1Option3Label"), sub: t("q1Option3Sub"), value: "bold" },
      ],
    },
    {
      q: t("q2Question"),
      options: [
        { label: t("q2Option1Label"), sub: t("q2Option1Sub"), value: "daily" },
        { label: t("q2Option2Label"), sub: t("q2Option2Sub"), value: "sometimes" },
        { label: t("q2Option3Label"), sub: t("q2Option3Sub"), value: "rarely" },
      ],
    },
  ];

  const RESULT: Record<string, { size: string; id: string; desc: string }> = {
    natural: { size: "1.7 mm", id: "s17", desc: t("resultDescNatural") },
    balanced: { size: "2.0 mm", id: "s20", desc: t("resultDescBalanced") },
    bold: { size: "2.3 mm", id: "s23", desc: t("resultDescBold") },
  };

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
        <p className="bb-quiz__label">{t("findLabel")}</p>
        <h2 className="bb-quiz__title">{t("titleLine1")}<br />{t("titleLine2")}</h2>

        {!done ? (
          <div className="bb-quiz__card">
            <div className="bb-quiz__steps">
              <span className="bb-quiz__steps-label">{t("questionCounter", { current: step + 1, total: STEPS.length })}</span>
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
            <p className="bb-quiz__result-label">{t("resultLabel")}</p>
            <p className="bb-quiz__result-size">{result?.size}</p>
            <p className="bb-quiz__result-desc">{result?.desc}</p>
            <div className="bb-quiz__result-actions">
              <Button href={{ pathname: "/tooth-gem-kit", query: { variant: result?.id } }}>
                {t("shopSizeKit", { size: result?.size ?? "" })}
              </Button>
              <button className="bb-quiz__restart" onClick={reset}>{t("tryAgain")}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
