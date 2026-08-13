"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function ReviewSubmitPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function close() {
    setOpen(false);
    setStatus("idle");
    setName("");
    setRating(5);
    setText("");
    clearPhoto();
  }

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setPhotoError(null);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Fail peab olema pilt.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Pilt on liiga suur (max 5 MB).");
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setStatus("sending");
    try {
      const body = new FormData();
      body.set("name", name);
      body.set("rating", String(rating));
      body.set("text", text);
      if (photo) body.set("photo", photo);
      await fetch("/api/reviews", { method: "POST", body });
    } catch {
      /* best-effort — the success message never depends on this */
    }
    setStatus("sent");
  }

  return (
    <>
      <Button className="bb-testi__add-btn" onClick={() => setOpen(true)}>
        Lisa enda tagasiside
      </Button>

      {open && createPortal(
        <div className="bb-popup-overlay" onClick={close}>
          <div className="bb-review-popup" onClick={(e) => e.stopPropagation()}>
            <button className="bb-popup__close" onClick={close} aria-label="Sulge">✕</button>

            {status === "sent" ? (
              <div className="bb-review-popup__success">
                <p className="bb-review-popup__success-icon">💛</p>
                <h3 className="bb-review-popup__title">Aitäh tagasiside eest!</h3>
                <p className="bb-review-popup__sub">Hindame igat sõna — see aitab meil paremaks saada.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bb-review-popup__form">
                <h3 className="bb-review-popup__title">Jaga oma kogemust</h3>

                <label className="bb-review-popup__label" htmlFor="rf-name">Nimi</label>
                <input
                  id="rf-name"
                  className="bb-review-popup__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                />

                <fieldset className="bb-review-popup__stars">
                  <legend className="bb-review-popup__label">Hinnang</legend>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="bb-review-popup__star"
                      aria-label={`${n} tärni`}
                      aria-pressed={n === rating}
                      onClick={() => setRating(n)}
                    >
                      {n <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </fieldset>

                <label className="bb-review-popup__label" htmlFor="rf-text">Sinu arvustus</label>
                <textarea
                  id="rf-text"
                  className="bb-review-popup__textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  maxLength={600}
                  rows={4}
                />

                <label className="bb-review-popup__label" htmlFor="rf-photo">Foto (valikuline)</label>
                {photoPreview ? (
                  <div className="bb-review-popup__photo-preview">
                    <img src={photoPreview} alt="" />
                    <button type="button" className="bb-review-popup__photo-remove" onClick={clearPhoto} aria-label="Eemalda foto">
                      ✕
                    </button>
                  </div>
                ) : (
                  <label htmlFor="rf-photo" className="bb-review-popup__photo-btn">
                    📷 Lisa foto
                  </label>
                )}
                <input
                  id="rf-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="bb-review-popup__photo-input"
                />
                {photoError && <p className="bb-review-popup__photo-error">{photoError}</p>}

                <Button type="submit" className="bb-review-popup__submit" disabled={status === "sending"}>
                  {status === "sending" ? "Saadan…" : "Saada tagasiside"}
                </Button>
              </form>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
