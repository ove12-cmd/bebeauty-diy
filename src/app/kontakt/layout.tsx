import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Võta beBeauty DIY-ga ühendust — küsimused, koostöö või tagasiside. Vastame üldjuhul 24 tunni jooksul.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
