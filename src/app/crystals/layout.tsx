import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Crystals Separately",
  description:
    "Buy Swarovski tooth gems separately, 0,50 € each. Perfect for topping up an existing kit or creating a new design.",
  alternates: { canonical: "/crystals" },
  openGraph: {
    title: "Shop Crystals Separately | beBeauty DIY",
    description:
      "Buy Swarovski tooth gems separately, 0,50 € each. Perfect for topping up an existing kit or creating a new design.",
    url: "https://bebeauty-diy.ee/crystals",
    type: "website",
  },
};

export default function CrystalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
