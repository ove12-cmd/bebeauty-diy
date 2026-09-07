import type { Metadata } from "next";
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
export const metadata: Metadata = {
  title: "Salon Results, At Home in 10 Minutes",
  description:
    "Apply tooth gems yourself at home — no salon booking, no high price tag. Swarovski crystals, professional results in just 10 minutes.",
  openGraph: {
    title: "Salon Results, At Home in 10 Minutes | beBeauty DIY",
    description:
      "Apply tooth gems yourself at home — no salon booking, no high price tag. Swarovski crystals, professional results in just 10 minutes.",
  },
  twitter: {
    title: "Salon Results, At Home in 10 Minutes | beBeauty DIY",
    description:
      "Apply tooth gems yourself at home — no salon booking, no high price tag. Swarovski crystals, professional results in just 10 minutes.",
  },
};

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
