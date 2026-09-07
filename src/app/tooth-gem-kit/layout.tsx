import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tooth Gem Kit – Buy and Apply at Home",
  description:
    "Shop the DIY tooth gem kit — Swarovski crystals, a UV LED lamp, and all the tools you need. Choose a size from 1.7–2.3mm. Free delivery, applied in 10 minutes.",
  alternates: { canonical: "/tooth-gem-kit" },
  openGraph: {
    title: "Tooth Gem Kit – Buy and Apply at Home | beBeauty DIY",
    description:
      "Shop the DIY tooth gem kit — Swarovski crystals, a UV LED lamp, and all the tools you need. Choose a size from 1.7–2.3mm. Free delivery, applied in 10 minutes.",
    url: "https://bebeauty-diy.ee/tooth-gem-kit",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
