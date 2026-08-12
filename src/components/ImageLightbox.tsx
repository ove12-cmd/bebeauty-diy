"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="bb-lightbox-overlay" onClick={onClose}>
      <button className="bb-popup__close bb-lightbox__close" onClick={onClose} aria-label="Sulge">✕</button>
      <div className="bb-lightbox" onClick={(e) => e.stopPropagation()}>
        <Image
          src={src}
          alt={alt}
          width={900}
          height={1125}
          sizes="(max-width: 1024px) 100vw, 520px"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>,
    document.body,
  );
}
