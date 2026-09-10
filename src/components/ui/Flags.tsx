type FlagProps = { className?: string };

/** United Kingdom — used for the English locale. */
export function FlagGB({ className = "" }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" className={className} aria-hidden="true">
      <clipPath id="bb-flag-gb-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#bb-flag-gb-t)"
        stroke="#cf142b"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}

/** Estonia — used for the Estonian locale. */
export function FlagEE({ className = "" }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" className={className} aria-hidden="true">
      <rect width="60" height="10" y="0" fill="#0072ce" />
      <rect width="60" height="10" y="10" fill="#000000" />
      <rect width="60" height="10" y="20" fill="#ffffff" />
    </svg>
  );
}
