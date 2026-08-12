"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";

export default function ReviewSubmitPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function close() {
    setOpen(false);
    setStatus("idle");
    setName("");
    setRating(5);
    setText("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setStatus("sending");
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text }),
      });
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
