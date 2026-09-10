"use client";

import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("bbCookies");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("bbCookies", "accepted");
    window.dispatchEvent(new CustomEvent("bb:cookiesUpdated"));
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("bbCookies", "declined");
    window.dispatchEvent(new CustomEvent("bb:cookiesUpdated"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bb-cookie">
      <div className="bb-cookie__inner">
        <p className="bb-cookie__text">
          {t.rich("text", {
            link: (chunks) => (
              <Link href="/privacy" className="bb-cookie__link">{chunks}</Link>
            ),
          })}
        </p>
        <div className="bb-cookie__actions">
          <Button className="bb-cookie__accept" onClick={accept}>{t("accept")}</Button>
          <button className="bb-cookie__decline" onClick={decline}>{t("decline")}</button>
        </div>
      </div>
    </div>
  );
}
