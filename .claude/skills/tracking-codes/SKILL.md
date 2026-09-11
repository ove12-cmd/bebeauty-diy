---
name: tracking-codes
description: Add, verify, or audit third-party tracking scripts (GA4, Meta Pixel, Microsoft Clarity, Search Console, GTM, etc.) and Meta Conversions API events for BeBeauty DIY. Use whenever asked to add a tracking/analytics code, check what's already tracking the site, add a new Meta Pixel/GA4 event, or update the /dashboard/tracking-codes reference page.
---

# Tracking codes & conversion events

This site has no CMS-level "paste code into head" admin field (the Webflow-style UI was considered and deliberately rejected — see "Why no self-serve UI" below). Instead: **codes are added to the actual layout files by hand, then mirrored onto a read-only admin reference page** so the owner can see what's installed without reading source.

## The three pieces

1. **Where scripts actually run** — `src/app/[locale]/layout.tsx` (GA4, Meta Pixel, Clarity) and `src/app/layout.tsx` (root — currently just the `facebook-domain-verification` meta tag, since that has to be outermost). `/dashboard` and `/api` sit outside the `[locale]` segment on purpose, so none of these trackers ever fire on the internal admin pages.
2. **The reference list** — `src/lib/tracking-scripts.ts`, a `TRACKING_SCRIPTS: TrackingScript[]` array (`id`, `name`, `location`, `source`, `code`, optional `verifiedAt`). **Adding an entry here does NOT make it run** — it's display-only. Next.js won't execute a `<script>` string injected via `dangerouslySetInnerHTML` on a plain element (only `next/script` actually runs), so there is no way to make this list double as the live injector without rewriting the whole approach. The two have to be kept in sync by hand.
3. **The admin page** — `src/app/dashboard/tracking-codes/page.tsx`, gated behind the same `verifySession()` cookie auth as the orders dashboard (`/dashboard/login`). Read-only: shows each script's full code, its file location, an "✓ Verified <date>" badge, and which `<head>`/`<body>` region it belongs to. Linked from the main dashboard header.

## Adding a new tracking script

1. Add the real `<Script>` (or plain `<meta>`) tag to `src/app/[locale]/layout.tsx` — use `next/script` with `strategy="afterInteractive"` for anything that isn't a meta tag. If it needs cookie-consent gating (see below), follow the `GoogleAnalytics.tsx` / `MetaPixel.tsx` pattern: a small `"use client"` component reading `useCookieConsent()` from `src/hooks/useCookieConsent.ts`, returning `null` until consent is accepted, and also bailing out on `pathname?.startsWith("/dashboard")`.
2. Add a matching entry to `TRACKING_SCRIPTS` in `src/lib/tracking-scripts.ts` — `code` should be the literal snippet (for the owner to visually verify it matches what a provider gave them), `source` names the file/line it actually lives in.
3. **Verify it before marking it verified** — see "How to verify" below. Only set `verifiedAt` once you've actually confirmed the global (`window.gtag`/`window.fbq`/`window.clarity`/etc.) initializes. Don't take the snippet's presence as proof it works.
4. Commit and push to `main` — this repo has no staging branch or PR flow; Vercel auto-deploys straight from `main` (confirmed via `git remote -v` → `github.com/ove12-cmd/bebeauty-diy`, and the commit history is all direct-to-main).

## How to verify (without polluting real ad/analytics data)

Cookie consent gates GA4 and Meta Pixel (not Clarity — see gap below), so a fresh browser session won't load them. To test:

```js
localStorage.setItem("bbCookies", "accepted");
```
...then reload. Confirm globals exist:
```js
({ gtag: typeof window.gtag, fbq: typeof window.fbq, fbqLoaded: window.fbq?.loaded, clarity: typeof window.clarity, dataLayer: window.dataLayer?.length })
```
All should read `"function"` (or a real number for `dataLayer.length`), not `"undefined"`.

**Never let a local test hit the real Meta CAPI with live data** — `.env.local` holds the production `META_CAPI_TOKEN`, and a local click-through would otherwise post genuine-looking `AddToCart`/`Purchase` events into the live ad account. Before testing anything that calls `sendMetaCapiEvent` (adding to cart, checkout, a webhook replay), temporarily blank the token, test, then restore it exactly:
```bash
cp .env.local .env.local.bak
sed -i 's/^META_CAPI_TOKEN=.*/META_CAPI_TOKEN=/' .env.local
# restart dev server, test, confirm server logs show "[meta-capi] META_CAPI_TOKEN missing — skipping <EventName>"
mv .env.local.bak .env.local
```
That log line proves the whole pipeline (client fetch → route → sender) reached the real Graph API call site without actually calling it.

## Meta Pixel / Conversions API — the event map

| Event | Fires in | Client (Pixel) | Server (CAPI) |
|---|---|---|---|
| `PageView` | `MetaPixel.tsx` | ✅ | — |
| `ViewContent` | `tooth-gem-kit/page.tsx` (per variant) | ✅ | — |
| `AddToCart` | `useCart.tsx` `add()` | ✅ | ✅ |
| `InitiateCheckout` | `checkout/page.tsx` | ✅ | ✅ |
| `Purchase` | `checkout/success/page.tsx` (client) + webhook (server) | ✅ | ✅ |

**Server-side mirrors exist for `AddToCart`/`InitiateCheckout`/`Purchase` — deliberately not for `ViewContent`/`PageView`** (too high-volume/low-value for CAPI, standard practice is to mirror funnel/conversion events, not every page view).

- **`src/lib/meta-capi.ts`** — the one shared Graph API sender (`sendMetaCapiEvent`). Every server-side event, regardless of trigger, goes through this. Don't write a second inline `fetch(...graph.facebook.com...)` anywhere else.
- **Purchase** fires from `src/app/api/payments/webhook/route.ts` on Stripe's `payment_intent.succeeded` — a real server event with reliable metadata (email/phone for hashed `em`/`ph`/`external_id`, plus `fbp`/`fbc`/IP/UA captured at checkout time and stashed in the PaymentIntent's metadata by `src/app/api/checkout/route.ts`).
- **`AddToCart`/`InitiateCheckout`** have no natural server trigger (no PaymentIntent exists yet at that point) — so `src/lib/meta-pixel.ts`'s `trackMetaWithCapi(event, params)` fires the browser `fbq` call *and* a fire-and-forget `POST /api/track/meta` with the same `crypto.randomUUID()` as `eventId`, so Meta dedups the two into one event. That route (`src/app/api/track/meta/route.ts`) reads `_fbp`/`_fbc` cookies + IP + UA straight off the incoming request (same as the checkout route does) — the client never needs to read or forward cookies itself. The route allowlists event names (`AddToCart`, `InitiateCheckout` only) so it can't be used to relay an arbitrary/fake event (e.g. a fake `Purchase`) to Meta.
- **Dedup rule**: any time you add a new client+server pair for the same logical event, both sides must send the identical `event_id`/`eventId`. Purchase's is `pi.id` (the Stripe PaymentIntent id, known to both the success page via `sessionStorage`'s `bbLastOrder` snapshot and the webhook); AddToCart/InitiateCheckout's is a fresh UUID generated client-side and passed straight through to the route in the same request.

### Full standard Meta Pixel event vocabulary (for reference)
`PageView`, `ViewContent`, `Search`, `AddToCart`, `AddToWishlist`, `InitiateCheckout`, `AddPaymentInfo`, `Purchase`, `Lead`, `CompleteRegistration`, `Contact`, `CustomizeProduct`, `Donate`, `FindLocation`, `Schedule`, `StartTrial`, `SubmitApplication`, `Subscribe`.

Most don't fit a one-product DIY kit shop with no accounts/trials/donations — don't add `Donate`/`Schedule`/`FindLocation`/`StartTrial`/`SubmitApplication`/`Subscribe`/`Lead`/`CompleteRegistration` just because they exist. `AddPaymentInfo` (checkout funnel step, before Purchase) and `Contact` (the contact page form) are the two genuinely relevant ones not yet wired up — ask before adding scope beyond what's requested, same as any other feature.

## Known gaps (flagged, not silently fixed — confirm before touching)

- **Microsoft Clarity is not behind the cookie-consent gate** that GA4 and Meta Pixel both use (`src/app/[locale]/layout.tsx` — Clarity's `<Script>` has no `useCookieConsent()` check, unlike `GoogleAnalytics.tsx`/`MetaPixel.tsx`). Fires on every page load regardless of the cookie banner choice. Inconsistent with the other two; unclear if intentional.
- **Google Search Console verification is not installed** — no `google-site-verification` meta tag anywhere, despite being one of the three things originally requested (GA4 + Meta Pixel + Search Console). Needs either the HTML-tag verification code from Search Console, or nothing at all if the site was verified via DNS domain property instead.
- **No GTM, TikTok Pixel, Pinterest tag, Hotjar, or LinkedIn Insight tag** — confirmed absent via full-codebase grep, not just "not yet checked."
- **Purchase dedup depends on an unverified assumption**: the browser's `snap.order_id` (from the `bbLastOrder` sessionStorage snapshot read in `checkout/success/page.tsx`) must exactly equal Stripe's `pi.id` for Meta's dedup to work. Where that snapshot is written (presumably `CheckoutPayment.tsx` or the checkout success redirect) hasn't been traced end-to-end — worth doing before trusting Ads Manager purchase counts fully.

## Why no self-serve UI

A Webflow-style "admin page where you paste any code into head/body" was considered first and rejected: this site has **no database** (Stripe is the only backing store, confirmed via `package.json`/`src/` — no Prisma/Supabase/Mongo/Postgres anywhere), so a self-serve editor would need a new persistence layer (Vercel Edge Config / Upstash Redis) just to hold one text field. Given how rarely tracking codes actually change, the owner chose the simpler path: paste codes in chat, Claude wires them into the real layout files and this reference page, commit, push, Vercel deploys. Revisit this decision (and actually add a KV store) only if the owner asks for self-serve editing again — don't reintroduce that scope unprompted.
