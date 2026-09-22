"use client";

import { useState } from "react";
import Image from "next/image";
import { CRYSTAL_GROUPS, CRYSTAL_PRODUCTS, type CrystalGroup } from "@/lib/crystal-catalog";

export default function CrystalCatalog() {
  const [activeGroup, setActiveGroup] = useState<CrystalGroup>("2754");
  const products = CRYSTAL_PRODUCTS.filter((p) => p.group === activeGroup);

  return (
    <div>
      <nav className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Kristallmudel">
        {CRYSTAL_GROUPS.map((g) => {
          const count = CRYSTAL_PRODUCTS.filter((p) => p.group === g.key).length;
          const selected = g.key === activeGroup;
          return (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveGroup(g.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
              }`}
            >
              {g.label} <span className="ml-1 font-mono text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="relative flex aspect-[5/4] bg-neutral-100">
              <span className="absolute left-2 top-2 z-10 rounded-full border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[11px] text-neutral-500">
                {String(product.index).padStart(2, "0")}
              </span>
              <div className="relative flex-1">
                <Image
                  src={product.originalImage.src}
                  alt={product.originalImage.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
                {product.altImage && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">
                    Crystals.ee
                  </span>
                )}
              </div>
              {product.altImage && (
                <div className="relative flex-1 border-l border-white">
                  <Image
                    src={product.altImage.src}
                    alt={product.altImage.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">
                    {product.altImage.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3.5 p-4">
              <div>
                <h2 className="mb-2 text-[15px] font-semibold leading-snug text-neutral-900">{product.name}</h2>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                    {product.model}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
                    {product.color}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  SKU <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-800">{product.sku}</code>
                </p>
              </div>

              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-[11px] uppercase tracking-wide text-neutral-500">
                    <th className="pb-1.5 font-semibold">Suurus</th>
                    <th className="pb-1.5 text-right font-semibold">Hind</th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizes.map((s) => (
                    <tr key={s.size} className="border-b border-neutral-100 last:border-0">
                      <td className="py-1.5">{s.size}</td>
                      <td className="py-1.5 text-right font-mono">{s.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <dl className="mt-auto flex flex-col gap-1 text-[12px] text-neutral-600">
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-400">Kristallmudel</dt>
                  <dd>{product.model}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-400">Kristallvärv</dt>
                  <dd>{product.color}</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
