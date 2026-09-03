const STEPS = ["Andmed", "Tarne", "Makse"] as const;

/**
 * Progress indicator for the checkout. `current` is 1-based; steps before it
 * read as done, the current one is highlighted, later ones stay muted.
 */
export default function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol
      aria-label="Tellimuse sammud"
      className="mb-3.5 flex list-none flex-wrap items-center gap-2 p-0 text-[11px]"
    >
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isCurrent = step === current;
        const isDone = step < current;
        return (
          <li key={label} className="flex items-center gap-2">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="h-[1.5px] w-5"
                style={{
                  background: isDone || isCurrent ? "var(--bb-gold)" : "var(--bb-line)",
                }}
              />
            )}
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={
                isCurrent
                  ? "font-medium text-[var(--bb-gold-deep)]"
                  : isDone
                    ? "text-[var(--bb-ink-3)]"
                    : "text-[var(--bb-ink-3)]/70"
              }
            >
              {step} {label}
              {isDone && <span className="sr-only"> (tehtud)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
