import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with beBeauty DIY — questions, collaborations, or feedback. We usually reply within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
