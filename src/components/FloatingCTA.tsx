"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const t = useTranslations("nav");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`bb-floating-cta ${visible ? "bb-floating-cta--visible" : ""}`}>
      <Button href="/tooth-gem-kit" className="bb-floating-cta__btn">
        {t("shopTheKit")}
      </Button>
    </div>
  );
}
