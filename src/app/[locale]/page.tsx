import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { BASE_URL } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import FinalCTA from "@/components/FinalCTA";
import FloatingCTA from "@/components/FloatingCTA";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Product from "@/components/Product";
import Results from "@/components/Results";
import ReviewsSlider from "@/components/ReviewsSlider";
import ScrollReveal from "@/components/ScrollReveal";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import SizeQuiz from "@/components/SizeQuiz";
import UrgencyPopup from "@/components/UrgencyPopup";
// import VideoSection from "@/components/VideoSection"; // hidden for now
import WhyBeBeauty from "@/components/WhyBeBeauty";

// Distinct from /tooth-gem-kit's metadata (layout.tsx there) —
// this page is the brand/comparison landing page, not the product listing,
// so it needs its own title instead of inheriting the root layout's default.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homeMeta" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: getPathname({ href: "/", locale: locale as Locale }),
      languages: {
        en: `${BASE_URL}${getPathname({ href: "/", locale: "en" })}`,
        et: `${BASE_URL}${getPathname({ href: "/", locale: "et" })}`,
      },
    },
    openGraph: {
      title: `${title} | beBeauty DIY`,
      description,
      url: `${BASE_URL}${getPathname({ href: "/", locale: locale as Locale })}`,
      type: "website",
    },
    twitter: {
      title: `${title} | beBeauty DIY`,
      description,
    },
  };
}

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TestimonialCarousel />
        <ScrollReveal><Results /></ScrollReveal>
        <ScrollReveal delay={50}><Product /></ScrollReveal>
        <ScrollReveal delay={50}><WhyBeBeauty /></ScrollReveal>
        {/* <ScrollReveal delay={50}><VideoSection /></ScrollReveal> hidden for now */}
        <ScrollReveal delay={50}><ReviewsSlider /></ScrollReveal>
        <ScrollReveal delay={50}><HowItWorks /></ScrollReveal>
        <ScrollReveal delay={50}><SizeQuiz /></ScrollReveal>
        <ScrollReveal delay={50}><FinalCTA /></ScrollReveal>
      </main>
      <FloatingCTA />
      <UrgencyPopup />
    </>
  );
}
