import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bebeauty-diy.ee"),
  title: {
    default: "DIY Tooth Gem Kit | beBeauty DIY",
    template: "%s | beBeauty DIY",
  },
  description: "Apply tooth gems at home in 10 minutes. Swarovski crystals, UV lamp, and everything you need in one kit. Free shipping.",
  keywords: ["tooth gem", "tooth gem kit", "DIY", "tooth gem crystal", "tooth jewelry"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bebeauty-diy.ee",
    siteName: "beBeauty DIY",
    title: "DIY Tooth Gem Kit | beBeauty DIY",
    description: "Apply tooth gems at home in 10 minutes. Swarovski crystals, UV lamp, and everything you need in one kit. Free shipping.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY Tooth Gem Kit | beBeauty DIY",
    description: "Apply tooth gems at home in 10 minutes. Swarovski crystals, UV lamp, and everything you need.",
  },
  other: {
    "facebook-domain-verification": "fccyql35zxod7nlarq920tscqb37ev",
  },
};

// True document root — stays outside the [locale] segment so /dashboard and
// /api (neither localized) still get an <html>/<body> shell, fonts, and
// globals.css. getLocale() resolves correctly even for requests that never
// pass through next-intl's middleware (e.g. /dashboard/*) — it just falls
// back to the default locale ("en") for those.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${bricolage.variable} ${instrument.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
