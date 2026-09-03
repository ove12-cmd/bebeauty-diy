import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** Renders a Next.js <Link> when set, otherwise a <button>. */
  href?: string;
  onClick?: () => void;
  /** Only applies when there is no href. */
  type?: "button" | "submit";
  /** `outline` is the quieter companion to a gold primary action. */
  variant?: "gold" | "outline";
  /** Context modifier classes (e.g. bb-cta__btn, bb-footer__card-btn). */
  className?: string;
  ariaLabel?: string;
  /** Only applies when there is no href. */
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "gold",
  className = "",
  ariaLabel,
  disabled = false,
}: ButtonProps) {
  const cls = ["bb-btn", `bb-btn--${variant}`, className].filter(Boolean).join(" ");
  const inner = children;

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
      {inner}
    </button>
  );
}
