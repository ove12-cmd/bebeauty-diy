"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { isVacationActive } from "@/lib/vacation";

const ACK_KEY = "bbVacationAck";

/**
 * One-time dispatch-date notice on the product page. The banner states it too,
 * but someone scrolling straight to "add to cart" can miss a top bar — this
 * puts the 02.11 date in front of them before they buy. Acknowledged once per
 * browser, so it never nags a returning customer.
 */
export default function VacationPopup() {
  const t = useTranslations("vacation");
  const [visible, setVisible] = useState(false);

  // localStorage read stays in an effect — reading it during render would
  // disagree with the server's HTML and blow up hydration.
  useEffect(() => {
    if (!isVacationActive()) return;
    if (localStorage.getItem(ACK_KEY)) return;

    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      timer = setTimeout(() => setVisible(true), 600);
    };

    // The cookie banner renders above this and covers the CTA, so on a first
    // visit we wait for that choice instead of stacking two dialogs.
    if (localStorage.getItem("bbCookies")) {
      show();
      return () => clearTimeout(timer);
    }

    window.addEventListener("bb:cookiesUpdated", show, { once: true });
    return () => {
      window.removeEventListener("bb:cookiesUpdated", show);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  function dismiss() {
    try {
      localStorage.setItem(ACK_KEY, "1");
    } catch {
      /* private mode — worst case the notice shows again next visit */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bb-popup-overlay" onClick={dismiss}>
      <div
        className="bb-popup bb-popup--notice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacation-popup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="bb-popup__close" onClick={dismiss} aria-label={t("popupClose")}>
          ✕
        </button>
        <div className="bb-popup__body">
          <p className="bb-popup__eyebrow">{t("popupEyebrow")}</p>
          <h2 className="bb-popup__title" id="vacation-popup-title">
            {t("popupTitle")}
          </h2>
          <p className="bb-popup__sub">{t("popupBody")}</p>
          <Button className="bb-popup__cta" onClick={dismiss}>
            {t("popupCta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
