"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import SocialIcon from "@/components/ui/SocialIcon";
import { COMPANY } from "@/lib/company";
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
        <Link href="/" className="bb-legal__back">← Back</Link>
        <h1 className="bb-legal__title">Contact</h1>
        <p className="bb-legal__subtitle">Questions, collaborations, or just want to say hi — write to us.</p>

        <div className="bb-contact__info">
          <div className="bb-contact__item">
            <span className="bb-contact__icon">📧</span>
            <a href="mailto:iluinfo1@gmail.com">iluinfo1@gmail.com</a>
          </div>
          {COMPANY.socials.map((s) => (
            <div key={s.id} className="bb-contact__item">
              <span className="bb-contact__icon">
                <SocialIcon network={s.network} size={16} />
              </span>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </div>
          ))}
          <div className="bb-contact__item">
            <span className="bb-contact__icon">⏱</span>
            <span>We usually reply within 24h</span>
          </div>
        </div>

        {sent ? (
          <div className="bb-contact__success">
            <span className="bb-contact__success-icon">✓</span>
            <h3>Message sent!</h3>
            <p>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form className="bb-contact__form" onSubmit={handleSubmit}>
            <div className="bb-contact__field">
              <label className="bb-contact__label">Name</label>
              <input
                className="bb-contact__input"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="bb-contact__field">
              <label className="bb-contact__label">Email</label>
              <input
                className="bb-contact__input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="bb-contact__field">
              <label className="bb-contact__label">Message</label>
              <textarea
                className="bb-contact__input bb-contact__textarea"
                placeholder="What would you like to ask?"
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="bb-contact__submit">
              Send message
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
