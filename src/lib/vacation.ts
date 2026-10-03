// Autumn 2026 holiday. The store keeps taking orders, but every shipping
// promise on the site (checkout, shipping page, confirmation email) swaps to
// the dated pre-order wording while this window is open — otherwise we'd be
// advertising next-business-day dispatch nobody is here to do.
//
// Opens 05.10 (the day after the last pre-departure dispatch) and closes
// itself on 02.11, so nothing has to be switched back by hand. Offsets are
// Europe/Tallinn: EEST (+03) before the 25.10 DST change, EET (+02) after.
const OPENS = Date.parse("2026-10-05T00:00:00+03:00");
const CLOSES = Date.parse("2026-11-02T00:00:00+02:00");

/** First dispatch day back, as shown to customers. */
export const SHIPS_FROM = "02.11";

export function isVacationActive(now: number = Date.now()): boolean {
  return now >= OPENS && now < CLOSES;
}
