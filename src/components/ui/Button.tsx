import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** Renders a Next.js <Link> when set, otherwise a <button>. */
  href?: string;
  onClick?: () => void;
  /** Only applies when there is no href. */
  type?: "button" | "submit";
  variant?: "gold";
  /** Append the site's standard trailing → arrow. */
  arrow?: boolean;
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
  arrow = false,
  className = "",
  ariaLabel,
  disabled = false,
}: ButtonProps) {
  const cls = ["bb-btn", `bb-btn--${variant}`, className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      {arrow && <span className="bb-btn__arr">→</span>}
    </>
  );

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
