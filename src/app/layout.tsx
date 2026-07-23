import type { Metadata } from "next";
import { Bricolage_Grotesque, Kalam } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/hooks/useCart";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bebeauty-diy.ee"),
  title: {
    default: "DIY Hambakristalli Komplekt | beBeauty DIY",
    template: "%s | beBeauty DIY",
  },
  description: "Paigalda hambakristallid kodus 10 minutiga. Primero ja Preciosa kristallid, UV lamp ja kõik vajalik komplektis. Tasuta tarne.",
  keywords: ["hambakristall", "tooth gem", "DIY", "hambakristalli komplekt", "hambaehistus", "Eesti"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "et_EE",
    url: "https://bebeauty-diy.ee",
    siteName: "beBeauty DIY",
    title: "DIY Hambakristalli Komplekt | beBeauty DIY",
    description: "Paigalda hambakristallid kodus 10 minutiga. Primero ja Preciosa kristallid, UV lamp ja kõik vajalik komplektis. Tasuta tarne.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY Hambakristalli Komplekt | beBeauty DIY",
    description: "Paigalda hambakristallid kodus 10 minutiga. Primero ja Preciosa kristallid, UV lamp ja kõik vajalik.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" data-scroll-behavior="smooth" className={`${bricolage.variable} ${kalam.variable}`}>
      <body className="min-h-full">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <CartProvider>
          {children}
          <Footer />
          <CartDrawer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
