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

// Twelve star centers on a ring of radius 11 around (30, 20), 30° apart,
// starting at the top — the EU flag's actual, fixed star layout.
const EU_STAR_POSITIONS: [number, number][] = [
  [30, 9], [35.5, 10.5], [39.5, 14.5], [41, 20], [39.5, 25.5], [35.5, 29.5],
  [30, 31], [24.5, 29.5], [20.5, 25.5], [19, 20], [20.5, 14.5], [24.5, 10.5],
];
const EU_STAR_PATH = "M0,-2 L0.47,-0.62 L1.9,-0.62 L0.73,0.24 L1.18,1.62 L0,0.76 L-1.18,1.62 L-0.73,0.24 L-1.9,-0.62 L-0.47,-0.62 Z";

/** European Union — used for the "European crystals" trust badge. */
export function FlagEU({ className = "" }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" fill="#003399" />
      {EU_STAR_POSITIONS.map(([x, y], i) => (
        <path key={i} d={EU_STAR_PATH} fill="#ffcc00" transform={`translate(${x} ${y})`} />
      ))}
    </svg>
  );
}
