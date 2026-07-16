import Image from "next/image";

const STEPS = [
  {
    n: "01",
    word: "Vali",
    title: "Vali endale sobiv komplekt.",
    sub: "Leia oma lemmikkristallid ja kõik vajalik ühest komplektist.",
    src: "/howto/vali.jpg",
  },
  {
    n: "02",
    word: "Paigalda",
    title: "Kleebi kristall hambale.",
    sub: "Järgi lihtsaid juhiseid ning paigalda kristall vaid mõne minutiga.",
    src: "/howto/paigalda.jpg",
  },
  {
    n: "03",
    word: "Sära",
    title: "Naudi säravat naeratust.",
    sub: "Salongivääriline tulemus mugavalt oma kodus.",
    src: "/howto/tulemus.jpg",
  },
];

export default function HowItWorks() {
  return (
    <section id="kuidas" className="bb-hiw">
      <h2 className="bb-hiw__heading">Kuidas see töötab?</h2>
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
    </section>
  );
}
