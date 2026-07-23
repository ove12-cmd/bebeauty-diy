import Image from "next/image";
import Button from "@/components/ui/Button";

const FEATURES = [
  "Valmis 10 minutiga",
  "Salongikvaliteet",
  "Lihtne kodus paigaldada",
  "Ei vaja erioskusi",
  "Turvaline paigaldus",
  "Selged ja täpsed juhised",
];

export default function Product() {
  return (
    <section className="bb-product">
      <div className="bb-product__img-wrap">
        <Image
          src="/product package.jpg"
          alt="beBeauty DIY komplekt"
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="bb-product__content">
        <span className="bb-product__eyebrow">Komplekt</span>
        <h2 className="bb-product__name">Kõik, mida vajad täiusliku<br />tulemuse saavutamiseks.</h2>
        <p className="bb-product__price">
          <span className="bb-product__price-from">Hind</span>
          <span className="bb-product__price-value">35&nbsp;€</span>
        </p>
        <p className="bb-product__desc">
          Paigalda hambakristallid kodus kiiresti, lihtsalt ja professionaalse tulemusega.
        </p>
        <ul className="bb-product__features">
          {FEATURES.map((f) => (
            <li key={f}>
              <span className="bb-product__check">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Button href="/hambakristalli-komplekt" className="bb-product__cta" arrow>
          Osta komplekt
        </Button>
      </div>
    </section>
  );
}
