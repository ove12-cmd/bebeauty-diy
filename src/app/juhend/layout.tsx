import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paigaldusjuhend",
  description:
    "Samm-sammuline juhend, kuidas paigaldada hambakristall kodus 10 minutiga — ettevalmistusest ja Etch geelist kuni UV-kõvastamiseni.",
  alternates: { canonical: "/juhend" },
  openGraph: {
    title: "Hambakristalli paigaldusjuhend | beBeauty DIY",
    description: "Salongitulemus kodus 10 minutiga — samm-sammuline paigaldusjuhend.",
    url: "https://bebeauty-diy.ee/juhend",
    type: "article",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
