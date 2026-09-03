type Props = {
  name: string;
  email: string;
  phone: string;
  /** e.g. "Omniva pakiautomaat" */
  deliveryLabel: string;
  /** The chosen locker or street address. */
  deliveryTarget: string;
  onEdit: () => void;
};

/**
 * Recap of what the buyer entered, shown beside the card fields. At the point
 * of paying they can no longer see the form, so this both reassures them the
 * order is going to the right place and removes the need to abandon and
 * restart just to check an address.
 */
export default function OrderDetailsRecap({
  name,
  email,
  phone,
  deliveryLabel,
  deliveryTarget,
  onEdit,
}: Props) {
  return (
    <div className="mt-2.5 rounded-xl bg-[var(--bb-paper)] p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--bb-ink)]">Sinu andmed</span>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] text-[var(--bb-gold-deep)] underline hover:no-underline"
        >
          Muuda
        </button>
      </div>

      <div className="border-b border-[var(--bb-line-soft)] pb-2.5 text-[11px] leading-relaxed text-[var(--bb-ink-2)]">
        <div className="text-[var(--bb-ink)]">{name}</div>
        <div className="break-all">{email}</div>
        <div>{phone}</div>
      </div>

      <div className="flex gap-2 pt-2.5">
        <svg
          aria-hidden="true"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-px shrink-0 text-[var(--bb-ink-3)]"
        >
          <path d="M21 8v8l-9 5-9-5V8l9-5 9 5Z" />
          <path d="M3.5 8.5 12 13l8.5-4.5M12 13v8" />
        </svg>
        <div className="text-[11px] leading-snug text-[var(--bb-ink-2)]">
          {deliveryTarget && <div className="text-[var(--bb-ink)]">{deliveryTarget}</div>}
          <div>{deliveryLabel}</div>
        </div>
      </div>
    </div>
  );
}
