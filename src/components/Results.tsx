"use client";

import Image from "next/image";

const IMGS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Results() {
  return (
    <section id="galerii" className="bb-results">
      <div className="bb-results__grid3">
        {IMGS.map((n) => (
          <div key={n} className="bb-rcard">
            <Image
              src={`/home/gallery/${n}.png`}
              alt={`Hambakristalliga naeratus — klientide tulemus ${n}`}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
