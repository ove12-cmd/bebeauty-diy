import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hambakristalli komplekt – osta ja paigalda kodus",
  description:
    "Osta DIY hambakristalli komplekt — Primero & Preciosa kristallid, UV LED lamp ja kõik tööriistad. Vali suurus 1.7–2.3mm. Tasuta tarne, paigaldus 10 minutiga.",
  alternates: { canonical: "/hambakristalli-komplekt" },
  openGraph: {
    title: "Hambakristalli komplekt – osta ja paigalda kodus | beBeauty DIY",
    description:
      "Osta DIY hambakristalli komplekt — Primero & Preciosa kristallid, UV LED lamp ja kõik tööriistad. Vali suurus 1.7–2.3mm. Tasuta tarne, paigaldus 10 minutiga.",
    url: "https://bebeauty-diy.ee/hambakristalli-komplekt",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
