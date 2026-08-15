"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function CookieBanner() {
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
          Kasutame küpsiseid, et pakkuda sulle parimat ostukogemust. Loe lähemalt meie{" "}
          <Link href="/privaatsus" className="bb-cookie__link">privaatsuspoliitikast</Link>.
        </p>
        <div className="bb-cookie__actions">
          <Button className="bb-cookie__accept" onClick={accept}>Nõustun</Button>
          <button className="bb-cookie__decline" onClick={decline}>Keeldu</button>
        </div>
      </div>
    </div>
  );
}
