import Image from "next/image";
import Button from "@/components/ui/Button";

const FEATURES = [
  "Ready in 10 minutes",
  "Swarovski crystals — the same ones salons use",
  "Easy to apply at home",
  "No special skills needed",
  "Safe — won't damage tooth enamel",
  "Clear, precise instructions",
];

export default function Product() {
  return (
    <section className="bb-product">
      <div className="bb-product__img-wrap">
        <Image
          src="/product package v3.png"
          alt="beBeauty DIY kit"
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="bb-product__content">
        <span className="bb-product__eyebrow">Kit</span>
        <h2 className="bb-product__name">Everything you need for<br />the perfect result.</h2>
        <p className="bb-product__price">
          <span className="bb-product__price-from">Price</span>
          <span className="bb-product__price-value">35&nbsp;€</span>
        </p>
        <p className="bb-product__desc">
          Apply tooth gems at home — fast, easy, and with a professional result.
        </p>
        <ul className="bb-product__features">
          {FEATURES.map((f) => (
            <li key={f}>
              <span className="bb-product__check">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Button href="/tooth-gem-kit" className="bb-product__cta">
          Shop the kit
        </Button>
      </div>
    </section>
  );
}
