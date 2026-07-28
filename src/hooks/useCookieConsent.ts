"use client";

import { useEffect, useState } from "react";

/** True once the cookie banner has been accepted (bbCookies === "accepted"). */
export function useCookieConsent(): boolean {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => setConsented(localStorage.getItem("bbCookies") === "accepted");
    check();
    window.addEventListener("bb:cookiesUpdated", check);
    return () => window.removeEventListener("bb:cookiesUpdated", check);
  }, []);

  return consented;
}
