"use client";

import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`bb-floating-cta ${visible ? "bb-floating-cta--visible" : ""}`}>
      <Button href="/hambakristalli-komplekt" className="bb-floating-cta__btn" arrow>
        Osta komplekt
      </Button>
    </div>
  );
}
