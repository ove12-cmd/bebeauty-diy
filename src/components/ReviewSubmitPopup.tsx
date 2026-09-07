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
      setPhotoError("The file must be an image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("The image is too large (max 5 MB).");
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
        Add your review
      </Button>

      {open && createPortal(
        <div className="bb-popup-overlay" onClick={close}>
          <div className="bb-review-popup" onClick={(e) => e.stopPropagation()}>
            <button className="bb-popup__close" onClick={close} aria-label="Close">✕</button>

            {status === "sent" ? (
              <div className="bb-review-popup__success">
                <p className="bb-review-popup__success-icon">💛</p>
                <h3 className="bb-review-popup__title">Thanks for your feedback!</h3>
                <p className="bb-review-popup__sub">We value every word — it helps us get better.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bb-review-popup__form">
                <h3 className="bb-review-popup__title">Share your experience</h3>

                <label className="bb-review-popup__label" htmlFor="rf-name">Name</label>
                <input
                  id="rf-name"
                  className="bb-review-popup__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                />

                <fieldset className="bb-review-popup__stars">
                  <legend className="bb-review-popup__label">Rating</legend>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="bb-review-popup__star"
                      aria-label={`${n} stars`}
                      aria-pressed={n === rating}
                      onClick={() => setRating(n)}
                    >
                      {n <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </fieldset>

                <label className="bb-review-popup__label" htmlFor="rf-text">Your review</label>
                <textarea
                  id="rf-text"
                  className="bb-review-popup__textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  maxLength={600}
                  rows={4}
                />

                <label className="bb-review-popup__label" htmlFor="rf-photo">Photo (optional)</label>
                {photoPreview ? (
                  <div className="bb-review-popup__photo-preview">
                    <img src={photoPreview} alt="" />
                    <button type="button" className="bb-review-popup__photo-remove" onClick={clearPhoto} aria-label="Remove photo">
                      ✕
                    </button>
                  </div>
                ) : (
                  <label htmlFor="rf-photo" className="bb-review-popup__photo-btn">
                    📷 Add photo
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
                  {status === "sending" ? "Sending…" : "Submit review"}
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
