import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osta kristalle eraldi",
  description:
    "Osta Swarovski hambakristalle eraldi, 0,50 € tükk. Sobib olemasoleva komplekti täiendamiseks või uue disaini loomiseks.",
  alternates: { canonical: "/kristallid" },
  openGraph: {
    title: "Osta kristalle eraldi | beBeauty DIY",
    description:
      "Osta Swarovski hambakristalle eraldi, 0,50 € tükk. Sobib olemasoleva komplekti täiendamiseks või uue disaini loomiseks.",
    url: "https://bebeauty-diy.ee/kristallid",
    type: "website",
  },
};

export default function CrystalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
