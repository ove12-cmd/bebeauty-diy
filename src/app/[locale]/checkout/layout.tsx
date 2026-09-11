import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkoutMeta");
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Stripe's Payment Element iframe fetches this font itself (see
          CheckoutPayment.tsx) — preconnecting here so that DNS/TLS handshake
          isn't still happening when the iframe requests it. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {children}
    </>
  );
}
