"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to email service (Resend / Nodemailer etc.)
    setSent(true);
  }

  return (
    <main className="bb-legal">
      <div className="bb-legal__inner bb-legal__inner--narrow">
        <Link href="/" className="bb-legal__back">← Tagasi</Link>
        <h1 className="bb-legal__title">Kontakt</h1>
        <p className="bb-legal__subtitle">Küsimused, koostöö või lihtsalt tere — kirjuta meile.</p>

        <div className="bb-contact__info">
          <div className="bb-contact__item">
            <span className="bb-contact__icon">📧</span>
            <a href="mailto:info@bebeauty-diy.ee">info@bebeauty-diy.ee</a>
          </div>
          <div className="bb-contact__item">
            <span className="bb-contact__icon">📱</span>
            <a href="https://instagram.com/bebeauty.diy" target="_blank" rel="noopener noreferrer">@bebeauty.diy</a>
          </div>
          <div className="bb-contact__item">
            <span className="bb-contact__icon">⏱</span>
            <span>Vastame üldjuhul 24h jooksul</span>
          </div>
        </div>

        {sent ? (
          <div className="bb-contact__success">
            <span className="bb-contact__success-icon">✓</span>
            <h3>Sõnum saadetud!</h3>
            <p>Vastame sulle 24 tunni jooksul.</p>
          </div>
        ) : (
          <form className="bb-contact__form" onSubmit={handleSubmit}>
            <div className="bb-contact__field">
              <label className="bb-contact__label">Nimi</label>
              <input
                className="bb-contact__input"
                type="text"
                placeholder="Sinu nimi"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="bb-contact__field">
              <label className="bb-contact__label">E-post</label>
              <input
                className="bb-contact__input"
                type="email"
                placeholder="sinu@email.ee"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="bb-contact__field">
              <label className="bb-contact__label">Sõnum</label>
              <textarea
                className="bb-contact__input bb-contact__textarea"
                placeholder="Mida soovid küsida?"
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="bb-contact__submit" arrow>
              Saada sõnum
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
