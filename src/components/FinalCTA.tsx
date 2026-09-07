import Image from "next/image";
import Button from "@/components/ui/Button";

const BG_IMGS = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3];

export default function FinalCTA() {
  return (
    <section className="bb-cta">
      {/* Rotated image grid background */}
      <div className="bb-cta__bg-grid" aria-hidden="true">
        {BG_IMGS.map((n, i) => (
          <div key={i} className="bb-cta__bg-cell">
            <Image
              src={`/home/gallery/${n}.png`}
              alt=""
              fill
              sizes="(max-width: 768px) 60vw, 30vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div className="bb-cta__overlay" aria-hidden="true" />

      {/* Content */}
      <h2 className="bb-cta__title">{"Ready for a little glow-up?"}</h2>
      <p className="bb-cta__sub">
        Add a sparkling detail to your smile in just a few minutes.<br />
        Order today – your kit will soon be at your nearest parcel locker.
      </p>
      <Button href="/tooth-gem-kit" className="bb-cta__btn">
        Shop the kit
      </Button>
    </section>
  );
}
