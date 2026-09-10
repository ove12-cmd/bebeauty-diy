import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const STEPS = [
    {
      n: "01",
      word: t("step1Word"),
      title: t("step1Title"),
      sub: t("step1Sub"),
      src: "/howto/vali.jpg",
    },
    {
      n: "02",
      word: t("step2Word"),
      title: t("step2Title"),
      sub: t("step2Sub"),
      src: "/howto/paigalda.jpg",
    },
    {
      n: "03",
      word: t("step3Word"),
      title: t("step3Title"),
      sub: t("step3Sub"),
      src: "/howto/tulemus.jpg",
    },
  ];

  return (
    <section id="kuidas" className="bb-hiw">
      <h2 className="bb-hiw__heading">{t("heading")}</h2>
      {STEPS.map((step) => (
        <div key={step.n} className="bb-hiw__card">
          <div className="bb-hiw__img">
            <Image
              src={step.src}
              alt={step.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="bb-hiw__body">
            <span className="bb-hiw__num">{step.n} — {step.word}</span>
            <h3 className="bb-hiw__word">{step.title}</h3>
            <p className="bb-hiw__sub">{step.sub}</p>
          </div>
        </div>
      ))}
      <div className="bb-hiw__guide">
        <Button href="/guide" className="bb-hiw__guide-btn">
          {t("guideButton")}
        </Button>
      </div>
    </section>
  );
}
