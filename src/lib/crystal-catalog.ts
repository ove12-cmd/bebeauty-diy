export type CrystalGroup = "2754" | "2201" | "2808" | "2058";

export type CrystalSize = { size: string; price: string };

export type CrystalProduct = {
  id: string;
  index: number;
  group: CrystalGroup;
  name: string;
  model: string;
  color: string;
  sku: string;
  sizes: CrystalSize[];
  originalImage: { src: string; alt: string };
  altImage: { src: string; alt: string; label: string } | null;
};

export const CRYSTAL_GROUPS: { key: CrystalGroup; label: string }[] = [
  { key: "2754", label: "2754 Star Flower" },
  { key: "2201", label: "Marquise / Navette" },
  { key: "2808", label: "2808 Heart" },
  { key: "2058", label: "Rose (2000 / 2058)" },
];

// Sourced from crystals.ee (own supplier cart) — see Downloads/tooth-gem-crystal-catalog.html
// for the standalone reference version this was ported from. Alt images are either real
// Twinkles product photos (downloaded with permission) or original AI-generated renders,
// never redistributed third-party photography without a matching real product.
export const CRYSTAL_PRODUCTS: CrystalProduct[] = [
  {
    id: "p1",
    index: 1,
    group: "2754",
    name: "Swarovski 2754 Star Flower No Hotfix – Crystal AB",
    model: "2754 Star Flower",
    color: "Crystal AB",
    sku: "rs-2754-crystal-ab",
    sizes: [
      { size: "4mm", price: "3,11 €" },
      { size: "6mm", price: "3,27 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/124755fbe1/swarovski-2754-star-flower-kristallid-liimimiseks-no-hotfix-crystal-ab.jpg",
      alt: "Swarovski 2754 Star Flower No Hotfix – Crystal AB",
    },
    altImage: null,
  },
  {
    id: "p2",
    index: 2,
    group: "2201",
    name: "Swarovski 2201 Marquise No Hotfix – Crystal Aurum",
    model: "2201 Marquise",
    color: "Crystal Aurum",
    sku: "rs-2201-crystal-aurum",
    sizes: [
      { size: "4mm", price: "4,66 €" },
      { size: "8mm", price: "4,84 €" },
      { size: "14mm", price: "2,79 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/154479c7a8/swarovski-2201-marquise-kristallid-liimimiseks-no-hotfix-crystal-aurum.jpg",
      alt: "Swarovski 2201 Marquise No Hotfix – Crystal Aurum",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_crystal_aurum.png",
      alt: "AI-generated formation render — 2 Marquise + 2 Rose, Crystal Aurum",
      label: "AI render",
    },
  },
  {
    id: "p3",
    index: 3,
    group: "2058",
    name: "Swarovski 2000 Rose No Hotfix – Aquamarine",
    model: "2000 Rose",
    color: "Aquamarine",
    sku: "rs-2000-aquamarine",
    sizes: [
      { size: "SS3 (1.35–1.5mm)", price: "5,09 €" },
      { size: "SS5 (1.7–1.9mm)", price: "1,75 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1496593e2a/swarovski-2000-rose-kristallid-liimimiseks-no-hotfix-aquamarine.jpg",
      alt: "Swarovski 2000 Rose No Hotfix – Aquamarine",
    },
    altImage: {
      src: "/crystal-catalog/Aquamarine_3f361258-b669-44fc-8cf4-5695d0f862dd.webp",
      alt: "Twinkles reference photo — Aquamarine",
      label: "Twinkles",
    },
  },
  {
    id: "p4",
    index: 4,
    group: "2201",
    name: "Swarovski 2201 Marquise No Hotfix – Crystal Vitrail Light",
    model: "2201 Marquise",
    color: "Crystal Vitrail Light",
    sku: "rs-2201-crystal-vitrail-light",
    sizes: [
      { size: "4mm", price: "4,65 €" },
      { size: "8mm", price: "4,83 €" },
      { size: "14mm", price: "2,79 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/14735857a8/swarovski-2201-marquise-kristallid-liimimiseks-no-hotfix-crystal-vitrail-light.jpg",
      alt: "Swarovski 2201 Marquise No Hotfix – Crystal Vitrail Light",
    },
    altImage: {
      src: "/crystal-catalog/ButterflySwarovskiVitrailLightColored_6e285b89-009e-4ae5-90bf-86d184e005a2.webp",
      alt: "Twinkles reference photo — Vitrail Light",
      label: "Twinkles",
    },
  },
  {
    id: "p5",
    index: 5,
    group: "2201",
    name: "Swarovski 2200 Navette No Hotfix – Aquamarine",
    model: "2200 Navette",
    color: "Aquamarine",
    sku: "rs-2200-aquamarine",
    sizes: [{ size: "4mm", price: "3,15 €" }],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1251146403/swarovski-2200-navette-kristallid-liimimiseks-no-hotfix-aquamarine.jpg",
      alt: "Swarovski 2200 Navette No Hotfix – Aquamarine",
    },
    altImage: {
      src: "/crystal-catalog/ButterflySwarovskiAquamarineColored.webp",
      alt: "Twinkles reference photo — Aquamarine",
      label: "Twinkles",
    },
  },
  {
    id: "p6",
    index: 6,
    group: "2201",
    name: "Swarovski 2200 Navette No Hotfix – Crystal",
    model: "2200 Navette",
    color: "Crystal",
    sku: "rs-2200-crystal",
    sizes: [
      { size: "4mm", price: "2,81 €" },
      { size: "8mm", price: "3,64 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/125112d0f6/swarovski-2200-navette-kristallid-liimimiseks-no-hotfix-crystal.jpg",
      alt: "Swarovski 2200 Navette No Hotfix – Crystal",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_crystal.png",
      alt: "AI-generated formation render — 2 Navette + 2 Rose, Crystal",
      label: "AI render",
    },
  },
  {
    id: "p7",
    index: 7,
    group: "2201",
    name: "Swarovski 2200 Navette No Hotfix – Crystal AB",
    model: "2200 Navette",
    color: "Crystal AB",
    sku: "rs-2200-crystal-ab",
    sizes: [
      { size: "4mm", price: "3,47 €" },
      { size: "8mm", price: "4,49 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1251113c2e/swarovski-2200-navette-kristallid-liimimiseks-no-hotfix-crystal-ab.jpg",
      alt: "Swarovski 2200 Navette No Hotfix – Crystal AB",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_crystal_ab.png",
      alt: "AI-generated formation render — 2 Navette + 2 Rose, Crystal AB",
      label: "AI render",
    },
  },
  {
    id: "p8",
    index: 8,
    group: "2201",
    name: "Swarovski 2200 Navette No Hotfix – Crystal Shimmer",
    model: "2200 Navette",
    color: "Crystal Shimmer",
    sku: "rs-2200-crystal-shimmer",
    sizes: [
      { size: "4mm", price: "3,47 €" },
      { size: "8mm", price: "4,49 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1435663362/swarovski-2200-navette-kristallid-liimimiseks-no-hotfix-crystal-shimmer.jpg",
      alt: "Swarovski 2200 Navette No Hotfix – Crystal Shimmer",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_crystal_shimmer.png",
      alt: "AI-generated formation render — 2 Navette + 2 Rose, Crystal Shimmer",
      label: "AI render",
    },
  },
  {
    id: "p9",
    index: 9,
    group: "2201",
    name: "Swarovski 2201 Marquise No Hotfix – Aquamarine",
    model: "2201 Marquise",
    color: "Aquamarine",
    sku: "rs-2201-aquamarine",
    sizes: [
      { size: "4mm", price: "4,26 €" },
      { size: "8mm", price: "4,42 €" },
      { size: "14mm", price: "2,55 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/125091dce1/swarovski-2201-marquise-kristallid-liimimiseks-no-hotfix-aquamarine.jpg",
      alt: "Swarovski 2201 Marquise No Hotfix – Aquamarine",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_aquamarine.png",
      alt: "AI-generated formation render — 2 Marquise + 2 Rose, Aquamarine",
      label: "AI render",
    },
  },
  {
    id: "p10",
    index: 10,
    group: "2201",
    name: "Swarovski 2201 Marquise No Hotfix – Crystal",
    model: "2201 Marquise",
    color: "Crystal",
    sku: "rs-2201-crystal",
    sizes: [
      { size: "4mm", price: "3,87 €" },
      { size: "8mm", price: "4,02 €" },
      { size: "14mm", price: "2,33 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/125088ef55/swarovski-2201-marquise-kristallid-liimimiseks-no-hotfix-crystal.jpg",
      alt: "Swarovski 2201 Marquise No Hotfix – Crystal",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_crystal.png",
      alt: "AI-generated formation render — 2 Marquise + 2 Rose, Crystal",
      label: "AI render",
    },
  },
  {
    id: "p11",
    index: 11,
    group: "2201",
    name: "Swarovski 2201 Marquise No Hotfix – Crystal AB",
    model: "2201 Marquise",
    color: "Crystal AB",
    sku: "rs-2201-crystal-ab",
    sizes: [
      { size: "4mm", price: "4,65 €" },
      { size: "8mm", price: "4,83 €" },
      { size: "14mm", price: "2,79 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/125087690d/swarovski-2201-marquise-kristallid-liimimiseks-no-hotfix-crystal-ab.jpg",
      alt: "Swarovski 2201 Marquise No Hotfix – Crystal AB",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_formation_v2_crystal_ab.png",
      alt: "AI-generated formation render — 2 Marquise + 2 Rose, Crystal AB",
      label: "AI render",
    },
  },
  {
    id: "p12",
    index: 12,
    group: "2754",
    name: "Swarovski 2754 Star Flower No Hotfix – Aquamarine",
    model: "2754 Star Flower",
    color: "Aquamarine",
    sku: "rs-2754-aquamarine",
    sizes: [
      { size: "4mm", price: "2,84 €" },
      { size: "6mm", price: "2,99 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/12475758f6/swarovski-2754-star-flower-kristallid-liimimiseks-no-hotfix-aquamarine.jpg",
      alt: "Swarovski 2754 Star Flower No Hotfix – Aquamarine",
    },
    altImage: {
      src: "/crystal-catalog/Blommaaquamarine.avif",
      alt: "Twinkles reference photo — Star Flower Aquamarine",
      label: "Twinkles",
    },
  },
  {
    id: "p13",
    index: 13,
    group: "2754",
    name: "Swarovski 2754 Star Flower No Hotfix – Crystal",
    model: "2754 Star Flower",
    color: "Crystal",
    sku: "rs-2754-crystal",
    sizes: [
      { size: "4mm", price: "2,58 €" },
      { size: "6mm", price: "2,73 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/12475679f4/swarovski-2754-star-flower-kristallid-liimimiseks-no-hotfix-crystal.jpg",
      alt: "Swarovski 2754 Star Flower No Hotfix – Crystal",
    },
    altImage: {
      src: "/crystal-catalog/blommaclear.webp",
      alt: "Twinkles reference photo — Star Flower Crystal",
      label: "Twinkles",
    },
  },
  {
    id: "p14",
    index: 14,
    group: "2808",
    name: "Swarovski 2808 Heart No Hotfix – Crystal AB",
    model: "2808 Heart",
    color: "Crystal AB",
    sku: "rs-2808-crystal-ab",
    sizes: [
      { size: "3.6mm", price: "3,38 €" },
      { size: "6mm", price: "2,17 €" },
      { size: "10mm", price: "3,17 €" },
      { size: "14mm", price: "4,49 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1246556757/swarovski-2808-heart-kristallid-liimimiseks-no-hotfix-crystal-ab.jpg",
      alt: "Swarovski 2808 Heart No Hotfix – Crystal AB",
    },
    altImage: {
      src: "/crystal-catalog/3222-3_Swarovski_Crystal_Heart3_6mmAB_Twinkles_Tooth_Gem_Dental_jewelry_1024x1024_ab624933-d2d0-488a-8865-923534a8fb56.webp",
      alt: "Twinkles reference photo — Heart Crystal AB",
      label: "Twinkles",
    },
  },
  {
    id: "p15",
    index: 15,
    group: "2808",
    name: "Swarovski 2808 Heart No Hotfix – Crystal",
    model: "2808 Heart",
    color: "Crystal",
    sku: "rs-2808-crystal",
    sizes: [
      { size: "3.6mm", price: "2,82 €" },
      { size: "6mm", price: "1,81 €" },
      { size: "10mm", price: "2,63 €" },
      { size: "14mm", price: "3,74 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1246566b1b/swarovski-2808-heart-kristallid-liimimiseks-no-hotfix-crystal.jpg",
      alt: "Swarovski 2808 Heart No Hotfix – Crystal",
    },
    altImage: {
      src: "/crystal-catalog/Hjartaclear.webp",
      alt: "Twinkles reference photo — Heart Crystal",
      label: "Twinkles",
    },
  },
  {
    id: "p16",
    index: 16,
    group: "2058",
    name: "Swarovski 2058 Rose No Hotfix – Crystal Vitrail Light",
    model: "2058 XILION Rose",
    color: "Crystal Vitrail Light",
    sku: "rs-2058-crystal-vitrail-light",
    sizes: [
      { size: "SS5 (1.7–1.9mm)", price: "5,33 €" },
      { size: "SS7 (2.1–2.3mm)", price: "5,45 €" },
      { size: "SS9 (2.5–2.7mm)", price: "5,55 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1533518f58/swarovski-2058-rose-kristallid-liimimiseks-no-hotfix-crystal-vitrail-light.jpg",
      alt: "Swarovski 2058 Rose No Hotfix – Crystal Vitrail Light",
    },
    altImage: {
      src: "/crystal-catalog/swarovski-crystal-2058-rose-rhinestone-flat-back-non-hotfix-crystal-vitrail-light.webp",
      alt: "Twinkles reference photo — 2058 Rose Crystal Vitrail Light",
      label: "Twinkles",
    },
  },
  {
    id: "p17",
    index: 17,
    group: "2058",
    name: "Swarovski 2058 Rose No Hotfix – Crystal AB",
    model: "2058 XILION Rose",
    color: "Crystal AB",
    sku: "rs-2058-crystal-ab",
    sizes: [
      { size: "SS5 (1.7–1.9mm)", price: "5,33 €" },
      { size: "SS6 (1.9–2.1mm)", price: "5,39 €" },
      { size: "SS7 (2.1–2.3mm)", price: "5,45 €" },
      { size: "SS8 (2.3–2.5mm)", price: "5,49 €" },
      { size: "SS9 (2.5–2.7mm)", price: "5,55 €" },
      { size: "SS10 (2.7–2.9mm)", price: "5,62 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/12576109d0/swarovski-2058-rose-kristallid-liimimiseks-no-hotfix-crystal-ab.jpg",
      alt: "Swarovski 2058 Rose No Hotfix – Crystal AB",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_2058_rose_crystal_ab.png",
      alt: "AI-generated reference render — Rose Crystal AB",
      label: "AI render",
    },
  },
  {
    id: "p18",
    index: 18,
    group: "2058",
    name: "Swarovski 2058 Rose No Hotfix – Crystal",
    model: "2058 XILION Rose",
    color: "Crystal",
    sku: "rs-2058-crystal",
    sizes: [
      { size: "SS5 (1.7–1.9mm)", price: "3,80 €" },
      { size: "SS6 (1.9–2.1mm)", price: "3,85 €" },
      { size: "SS7 (2.1–2.3mm)", price: "3,88 €" },
      { size: "SS8 (2.3–2.5mm)", price: "3,92 €" },
      { size: "SS9 (2.5–2.7mm)", price: "3,97 €" },
      { size: "SS10 (2.7–2.9mm)", price: "4,00 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1257624bd7/swarovski-2058-rose-kristallid-liimimiseks-no-hotfix-crystal.jpg",
      alt: "Swarovski 2058 Rose No Hotfix – Crystal",
    },
    altImage: {
      src: "/crystal-catalog/Crystalclearstor.webp",
      alt: "Twinkles reference photo — Crystal",
      label: "Twinkles (guess)",
    },
  },
  {
    id: "p19",
    index: 19,
    group: "2058",
    name: "Swarovski 2058 Rose No Hotfix – Crystal Shimmer",
    model: "2058 XILION Rose",
    color: "Crystal Shimmer",
    sku: "rs-2058-crystal-shimmer",
    sizes: [
      { size: "SS5 (1.7–1.9mm)", price: "5,33 €" },
      { size: "SS7 (2.1–2.3mm)", price: "5,98 €" },
      { size: "SS9 (2.5–2.7mm)", price: "5,55 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/1257198cd1/swarovski-2058-rose-kristallid-liimimiseks-no-hotfix-crystal-shimmer.jpg",
      alt: "Swarovski 2058 Rose No Hotfix – Crystal Shimmer",
    },
    altImage: {
      src: "/crystal-catalog/generated/gen_2058_rose_crystal_shimmer.png",
      alt: "AI-generated reference render — Rose Crystal Shimmer",
      label: "AI render",
    },
  },
  {
    id: "p20",
    index: 20,
    group: "2058",
    name: "Swarovski 2058 Rose No Hotfix – Aquamarine",
    model: "2058 XILION Rose",
    color: "Aquamarine",
    sku: "rs-2058-aquamarine",
    sizes: [
      { size: "SS5 (1.7–1.9mm)", price: "4,58 €" },
      { size: "SS7 (2.1–2.3mm)", price: "4,66 €" },
      { size: "SS9 (2.5–2.7mm)", price: "4,76 €" },
      { size: "SS10 (2.7–2.9mm)", price: "5,31 €" },
    ],
    originalImage: {
      src: "https://i.crystalidea.shop/media/catalog/product/cache/62ab28c612453ecbbf04d39b8a44207d/image/12578026d9/swarovski-2058-rose-kristallid-liimimiseks-no-hotfix-aquamarine.jpg",
      alt: "Swarovski 2058 Rose No Hotfix – Aquamarine",
    },
    altImage: {
      src: "/crystal-catalog/Aquamarine_3f361258-b669-44fc-8cf4-5695d0f862dd.webp",
      alt: "Twinkles reference photo — Aquamarine",
      label: "Twinkles (guess)",
    },
  },
];
