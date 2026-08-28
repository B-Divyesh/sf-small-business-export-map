# Export Map — polish 4 handoff

## Delivered

- Closed every finding from reviews 1–4, including the four review-3 findings reopened as blockers in review 4.
- Registered and tested the no-accounting-inference guarantee with ambiguous VAT and tax-code data.
- Split privacy, source-preservation, and accounting-choice assurances into separate plain lines.
- Replaced payment legal jargon with a direct explanation of payment, receipts, and refunds.
- Rewrote reader-facing README and Privacy storage/network language without IndexedDB, localStorage, or same-origin jargon.
- Preserved the risograph print-room identity, one-click isolated sample, offline PWA class, real routes, mobile layout, and local-first workflow.
- Updated the PWA cache to `export-map-v4`, the visible build marker to `polish-4`, and the catalog description.

Finding-by-finding changes and evidence are in [.factory/polish-4.md](polish-4.md).

## Verification

- Implementation commit: `ad78a1f332dcc232d222a4fb05e6f9a1970a71f9`; no-inference readiness hardening: `dfe8ec0`; complete product/evidence tree: `b43839f88902857ec397c42ae72bc620f122a521`.
- `npm test` — PASS: 11 unit/contract tests, 19 Playwright tests, build, and rendered URL self-test.
- `npx tsc --noEmit` — PASS.
- `npm run build` — PASS; `dist/index.html` exists.
- Clean remote clone `/tmp/export-map-polish4-final.tsy6RW` at `b43839f88902857ec397c42ae72bc620f122a521`: `npm ci` found 0 vulnerabilities; every literal command in the 18-entry claims registry passed independently.
- Accessibility: Playwright Axe on home, demo, Privacy, Terms, and 404 at 390 px found 0 serious/critical issues. Keyboard preview reach, route focus, and 200% text passed.
- Privacy/offline: real-file traffic had only GET requests with no request body; demo traffic used only the product origin; fresh demo storage contained only `demo:export-map`; primed `/demo` reloaded offline with the completed sample.
- Performance: Lighthouse mobile 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.0 s, CLS 0, TBT 0 ms.
- Budgets: initial app JS 32.32 kB raw / 10.98 kB gzip; CSS 12.55 kB raw / 3.59 kB gzip; mobile hero 34.13 kB.

## Deployment and live evidence

- Static deployment id: `80580c13-974a-4599-9153-2ae3607dc381`.
- Live origin: <https://small-business-export-map.sociobot.in>.
- `/`, `/demo`, `/privacy/`, `/terms/` return 200; `/missing-polish-4-route` returns 404.
- `npm run verify:url -- https://small-business-export-map.sociobot.in/` passed.
- Cold 390 px first-screen facts ended at 759.3125 px inside an 844 px viewport.
- Cold `/demo` showed the completed sample, sticky banner, Reset demo, Start for real, both downloads, and only `demo:export-map` in a fresh context.
- The live no-inference check preserved `20`, `A20`, and `20` as text until explicit user mapping.
- Live home and demo Axe checks found 0 serious/critical issues; offline reload passed; no unexpected console errors occurred.
- Live headers include CSP, Permissions-Policy, nosniff, referrer policy, and HSTS. Checkout returns 303 to `checkout.dodopayments.com`.
- Screenshots: [first screen](evidence/polish-4-live-landing-390.png), [demo](evidence/polish-4-live-demo-390.png), [limitations](evidence/polish-4-live-limitations-1440.png), [purchase](evidence/polish-4-live-payment-1440.png).

## Run and verify

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm run verify:url -- https://small-business-export-map.sociobot.in/
```

Run every `test` value in `.factory/claims.json` independently for the claims contract.

## Known gaps

None. No payment was made during verification; the live hosted-checkout redirect was checked without purchase, and entitlement behavior used recorded valid/revoked responses.
