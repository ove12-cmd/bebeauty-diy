import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bricolage.variable} ${instrument.variable}`}>
      <body className="min-h-full">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <GoogleAnalytics />
        <MetaPixel />
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xx71xy0xth");
          `}
        </Script>
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
