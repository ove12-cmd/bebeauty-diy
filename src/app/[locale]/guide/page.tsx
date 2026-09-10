"use client";

import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import ImageLightbox from "@/components/ImageLightbox";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "./guide.css";

type NeedItem = { icon?: string; img?: string; labelKey: string };

type Step = {
  n: string;
  categoryKey: string;
  titleKey: string;
  actionKeys: string[];
  tipKey?: string;
  needs: NeedItem[];
};

// category/title/action/tip/need labels are message keys into the
// "guidePage" namespace — resolved at render time so this data stays
// locale-agnostic.
const STEPS: Step[] = [
  {
    n: "01",
    categoryKey: "step1Category",
    titleKey: "step1Title",
    actionKeys: ["step1Action1", "step1Action2"],
    tipKey: "step1Tip",
    needs: [
      { img: "/tools/vatirull.png", labelKey: "step1Need1Label" },
      { img: "/tools/põsehoidja.png", labelKey: "step1Need2Label" },
    ],
  },
  {
    n: "02",
    categoryKey: "step2Category",
    titleKey: "step2Title",
    actionKeys: ["step2Action1", "step2Action2"],
    tipKey: "step2Tip",
    needs: [
      { img: "/tools/etch.png", labelKey: "step2Need1Label" },
      { img: "/tools/mikrotikk.png", labelKey: "step2Need2Label" },
    ],
  },
  {
    n: "03",
    categoryKey: "step3Category",
    titleKey: "step3Title",
    actionKeys: ["step3Action1", "step3Action2"],
    needs: [{ img: "/tools/vatirull.png", labelKey: "step3Need1Label" }],
  },
  {
    n: "04",
    categoryKey: "step4Category",
    titleKey: "step4Title",
    actionKeys: ["step4Action1", "step4Action2"],
    needs: [
      { img: "/tools/liim.png", labelKey: "step4Need1Label" },
      { img: "/tools/mikrotikk.png", labelKey: "step4Need2Label" },
    ],
  },
  {
    n: "05",
    categoryKey: "step5Category",
    titleKey: "step5Title",
    actionKeys: ["step5Action1", "step5Action2"],
    tipKey: "step5Tip",
    needs: [
      { icon: "💎", labelKey: "step5Need1Label" },
      { img: "/tools/aplikaator.png", labelKey: "step5Need2Label" },
    ],
  },
  {
    n: "06",
    categoryKey: "step6Category",
    titleKey: "step6Title",
    actionKeys: ["step6Action1"],
    needs: [{ img: "/tools/uv.png", labelKey: "step6Need1Label" }],
  },
];

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
  const t = useTranslations("guidePage");
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
        <Link href="/" className="bb-guide__back">{t("backLabel")}</Link>

        {isIntro && (
          <div className="bb-guide__intro" key="intro">
            <p className="bb-guide__eyebrow">{t("eyebrow")}</p>
            <h1 className="bb-guide__intro-title">{t("introTitle")}</h1>
            <p className="bb-guide__intro-sub">{t("introSub")}</p>
            <div className="bb-guide__intro-meta">
              <span>{t("stepsCount", { n: TOTAL })}</span>
              <span className="bb-guide__meta-dot">·</span>
              <span>{t("timeEstimate")}</span>
            </div>
            <Button className="bb-guide__start" onClick={next}>
              {t("startButton")}
            </Button>
          </div>
        )}

        {current && (
          <>
            <div className="bb-guide__progress">
              <span className="bb-guide__progress-label">{t("progressLabel", { step, total: TOTAL })}</span>
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
                      aria-label={t("dotAria", { n: idx, category: t(s.categoryKey) })}
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
              <p className="bb-guide__cat">{t(current.categoryKey)}</p>
              <h2 className="bb-guide__title">{t(current.titleKey)}</h2>

              <ul className="bb-guide__actions">
                {current.actionKeys.map((actionKey) => (
                  <li key={actionKey} className="bb-guide__action">
                    <span className="bb-guide__check"><IconCheck /></span>
                    {t(actionKey)}
                  </li>
                ))}
              </ul>

              {current.tipKey && (
                <div className="bb-guide__tip">
                  <span className="bb-guide__tip-icon">💡</span>
                  <p><strong>{t("tipLabel")}</strong> {t(current.tipKey)}</p>
                </div>
              )}

              <div className="bb-guide__needs">
                <span className="bb-guide__needs-label">{t("needsLabel")}</span>
                <div className="bb-guide__chips">
                  {current.needs.map((item) =>
                    item.img ? (
                      <button
                        key={item.labelKey}
                        type="button"
                        className="bb-guide__chip bb-guide__chip--img"
                        onClick={() => setLightbox({ src: item.img!, alt: t(item.labelKey) })}
                      >
                        <span className="bb-guide__chip-thumb" aria-hidden="true">
                          <IconImage />
                        </span>
                        {t(item.labelKey)}
                      </button>
                    ) : (
                      <span key={item.labelKey} className="bb-guide__chip">
                        <span aria-hidden="true">{item.icon}</span> {t(item.labelKey)}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="bb-guide__nav">
              <button className="bb-guide__nav-btn" onClick={prev}>{t("prevButton")}</button>
              <Button className="bb-guide__nav-next" onClick={next}>
                {step === TOTAL ? t("doneButton") : t("nextButton")}
              </Button>
            </div>
          </>
        )}

        {isDone && (
          <div className="bb-guide__done" key="done">
            <span className="bb-guide__done-badge"><IconCheck /></span>
            <h2 className="bb-guide__done-title">{t("doneTitle")}</h2>

            <div className="bb-guide__aftercare">
              <p className="bb-guide__cat">{t("aftercareEyebrow")}</p>
              <h3 className="bb-guide__aftercare-title">{t("aftercareTitle")}</h3>
              <ul className="bb-guide__actions">
                {["aftercareAction1", "aftercareAction2"].map((actionKey) => (
                  <li key={actionKey} className="bb-guide__action">
                    <span className="bb-guide__check"><IconCheck /></span>
                    {t(actionKey)}
                  </li>
                ))}
              </ul>
              <p className="bb-guide__aftercare-note">{t("aftercareNote")}</p>
            </div>

            <div className="bb-guide__done-actions">
              <Button href="/tooth-gem-kit">
                {t("shopButton")}
              </Button>
              <button className="bb-guide__restart" onClick={() => setStep(0)}>{t("restartButton")}</button>
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
