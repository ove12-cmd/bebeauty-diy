import Image from "next/image";
import Button from "@/components/ui/Button";

const STEPS = [
  {
    n: "01",
    word: "Choose",
    title: "Choose the kit that's right for you.",
    sub: "Find your favorite crystals and everything you need in one kit.",
    src: "/howto/vali.jpg",
  },
  {
    n: "02",
    word: "Apply",
    title: "Stick the crystal onto your tooth.",
    sub: "Follow the simple instructions and apply the crystal in just a few minutes.",
    src: "/howto/paigalda.jpg",
  },
  {
    n: "03",
    word: "Shine",
    title: "Enjoy your sparkling smile.",
    sub: "Salon-quality results, from the comfort of home.",
    src: "/howto/tulemus.jpg",
  },
];

export default function HowItWorks() {
  return (
    <section id="kuidas" className="bb-hiw">
      <h2 className="bb-hiw__heading">How it works</h2>
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
          View the guide
        </Button>
      </div>
    </section>
  );
}
