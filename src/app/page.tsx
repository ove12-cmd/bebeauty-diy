import type { Metadata } from "next";
import FinalCTA from "@/components/FinalCTA";
import FloatingCTA from "@/components/FloatingCTA";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Product from "@/components/Product";
import Results from "@/components/Results";
import ScrollReveal from "@/components/ScrollReveal";
import SizeQuiz from "@/components/SizeQuiz";
import UrgencyPopup from "@/components/UrgencyPopup";
import VideoSection from "@/components/VideoSection";
import WhyBeBeauty from "@/components/WhyBeBeauty";

export const metadata: Metadata = {
  // title intentionally omitted — inherits the layout's untemplated default
  // ("beBeauty DIY — Salongi sära, ilma salongita") to avoid brand duplication.
  description: "Proovi DIY hambakristalli komplekti. Salongivääriline sära kodus vaid 10 minutiga. Preciosa & Primero kristallid.",
};

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ScrollReveal><Results /></ScrollReveal>
        <ScrollReveal delay={50}><Product /></ScrollReveal>
        <ScrollReveal delay={50}><WhyBeBeauty /></ScrollReveal>
        <ScrollReveal delay={50}><VideoSection /></ScrollReveal>
        <ScrollReveal delay={50}><HowItWorks /></ScrollReveal>
        <ScrollReveal delay={50}><SizeQuiz /></ScrollReveal>
        <ScrollReveal delay={50}><FinalCTA /></ScrollReveal>
      </main>
      <FloatingCTA />
      <UrgencyPopup />
    </>
  );
}
