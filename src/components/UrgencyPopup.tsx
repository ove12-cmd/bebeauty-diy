"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { FUNNY_DISCOUNT_CODES } from "@/lib/pricing";
import { useEffect, useState } from "react";

function generateCode() {
  return FUNNY_DISCOUNT_CODES[Math.floor(Math.random() * FUNNY_DISCOUNT_CODES.length)];
}

function getSecsLeft() {
  const expiry = Number(localStorage.getItem("bbCodeExpiry") || 0);
  return expiry ? Math.max(0, Math.round((expiry - Date.now()) / 1000)) : null;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function UrgencyPopup({ autoOpen = true }: { autoOpen?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [secsLeft, setSecsLeft] = useState<number | null>(null);

  // Auto-open after 8s (landing page only)
  useEffect(() => {
    if (!autoOpen) return;
    const t = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(t);
  }, [autoOpen]);

  // Listen for manual open trigger
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("bb:openPopup", handler);
    return () => window.removeEventListener("bb:openPopup", handler);
  }, []);

  // Restore existing code if still valid
  useEffect(() => {
    const saved = localStorage.getItem("bbDiscountCode");
    const secs = getSecsLeft();
    if (saved && secs && secs > 0) {
      setCode(saved);
      setSecsLeft(secs);
    }
  }, []);

  // Tick the shared timer
  useEffect(() => {
    if (!code) return;
    const t = setInterval(() => {
      const s = getSecsLeft();
      setSecsLeft(s);
    }, 1000);
    return () => clearInterval(t);
  }, [code]);

  function handleGenerate() {
    const newCode = generateCode();
    const expiry = Date.now() + 15 * 60 * 1000;
    localStorage.setItem("bbDiscountCode", newCode);
    localStorage.setItem("bbCodeExpiry", String(expiry));
    window.dispatchEvent(new CustomEvent("bb:codeGenerated"));
    setCode(newCode);
    setSecsLeft(15 * 60);
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const expired = secsLeft !== null && secsLeft <= 0;

  if (!visible) return null;

  return (
    <div className="bb-popup-overlay" onClick={() => setVisible(false)}>
      <div className="bb-popup" onClick={e => e.stopPropagation()}>
        <button className="bb-popup__close" onClick={() => setVisible(false)} aria-label="Sulge">✕</button>

        <div className="bb-popup__img">
          <Image
            src="/popupo.jpg"
            alt=""
            fill
            sizes="(max-width: 600px) 0px, 340px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="bb-popup__body">
          <p className="bb-popup__eyebrow">Eripakkumine</p>
          <h2 className="bb-popup__title">Saa esimeselt tellimuselt <em className="bb-popup__title-em">10% soodustust</em></h2>
          <p className="bb-popup__sub">Genereeri oma isiklik sooduskood ja kasuta seda ostu vormistamisel.</p>

          {!code || expired ? (
            <Button className="bb-popup__cta" onClick={handleGenerate}>
              {expired ? "Genereeri uus sooduskood" : "Genereeri sooduskood"}
            </Button>
          ) : (
            <div className="bb-popup__success">
              <p className="bb-popup__psst">Psst — see on ainult sinule. 🤫</p>
              <div className="bb-popup__code-wrap">
                <span className="bb-popup__code">{code}</span>
                <button className="bb-popup__copy" onClick={copyCode}>
                  {copied ? "✓ Kopeeritud" : "Kopeeri"}
                </button>
              </div>
              {secsLeft !== null && secsLeft > 0 && (
                <p className="bb-popup__timer-line">
                  Kehtib veel <span className="bb-popup__timer-val">{formatTime(secsLeft)}</span>
                </p>
              )}
              <Button href="/hambakristalli-komplekt" className="bb-popup__cta" onClick={() => setVisible(false)}>
                Kasuta koodi →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
