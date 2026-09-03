type Props = {
  /** Matches `network` on COMPANY.socials, not its id. */
  network: string;
  size?: number;
  className?: string;
};

/**
 * Brand glyph for a social link. Decorative — the link's own label carries
 * the accessible name, so the icon is hidden from assistive tech.
 */
export default function SocialIcon({ network, size = 12, className = "" }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className,
  };

  if (network === "facebook") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.25 10.44 22v-7.02H7.9v-2.92h2.54V9.85c0-2.52 1.49-3.92 3.77-3.92 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.45 2.92h-2.33V22C18.34 21.25 22 17.08 22 12.06Z" />
      </svg>
    );
  }

  if (network === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return null;
}
