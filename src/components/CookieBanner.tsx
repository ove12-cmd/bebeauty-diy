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
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("bbCookies", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bb-cookie">
      <div className="bb-cookie__inner">
        <div className="bb-cookie__text">
          <span className="bb-cookie__emoji">🍪</span>
          <p>Kasutame küpsiseid, et parandada sinu kogemust. Loe lähemalt meie{" "}
            <Link href="/privaatsus" className="bb-cookie__link">privaatsuspoliitikast</Link>.
          </p>
        </div>
        <div className="bb-cookie__actions">
          <button className="bb-cookie__decline" onClick={decline}>Keeldu</button>
          <Button className="bb-cookie__accept" onClick={accept}>Nõustun</Button>
        </div>
      </div>
    </div>
  );
}
