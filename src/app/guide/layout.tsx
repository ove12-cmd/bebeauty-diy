import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Guide",
  description:
    "A step-by-step guide to applying a tooth gem at home in 10 minutes — from prep and Etch gel to UV curing.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "Tooth Gem Application Guide | beBeauty DIY",
    description: "Salon results at home in 10 minutes — a step-by-step application guide.",
    url: "https://bebeauty-diy.ee/guide",
    type: "article",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
