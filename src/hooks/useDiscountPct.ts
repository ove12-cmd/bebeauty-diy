"use client";

import { useEffect, useState } from "react";
import { discountPctForCode } from "@/lib/pricing";

/**
 * Reactively reads the currently-applied discount % from the persisted
 * `bbDiscountCode`. Updates when a code is applied (`bb:discountChanged`),
 * generated (`bb:codeGenerated`), or changed in another tab (`storage`).
 */
export function useDiscountPct(): number {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const read = () =>
      setPct(discountPctForCode(localStorage.getItem("bbDiscountCode")));
    read();
    window.addEventListener("bb:discountChanged", read);
    window.addEventListener("bb:codeGenerated", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("bb:discountChanged", read);
      window.removeEventListener("bb:codeGenerated", read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return pct;
}
