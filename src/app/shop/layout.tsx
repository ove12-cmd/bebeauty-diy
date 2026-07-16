import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIY Hambakristalli Komplekt",
  description: "Osta beBeauty DIY hambakristalli komplekt. 1.7mm, 2.0mm ja 2.3mm kristallid. Tasuta tarne Eestis.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "DIY Hambakristalli Komplekt | beBeauty DIY",
    description: "Osta beBeauty DIY hambakristalli komplekt. 1.7mm, 2.0mm ja 2.3mm kristallid. Tasuta tarne Eestis.",
    url: "https://bebeauty-diy.ee/shop",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
