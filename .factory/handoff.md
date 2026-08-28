# Export Map — polish 2 handoff

## Delivered

- Closed every finding from reviews 1 and 2, including all reopened and minor items.
- Added an independently served `/demo`, sticky reset/exit banner, demo-storage cleanup, and local accountant-template import.
- Added route-specific metadata, shared chrome, h1 focus/announcement, valid anchors, sitemap coverage, and a true HTTP 404.
- Replaced residual transfer jargon, put privacy/offline/price facts on the first screen, and kept the risograph print-room identity.
- Expanded `.factory/claims.json` to 17 claims with exactly one observable tagged test each.
- Replaced weak download, paid, privacy, boundary, format, preview, backup, and license assertions with outcome checks.
- Updated README, demo guide, copy audit, catalog description, and cumulative finding map.

## Exact verification

- `npm test` — PASS:
  - Vitest: 11 tests.
  - Playwright: 18 tests.
  - Production build and rendered URL self-test: PASS.
- `npx tsc --noEmit` — PASS.
- `npm run build` — PASS; `dist/index.html` is present.
- Clean clone `/tmp/export-map-polish2.tlWgaD`:
  - `npm ci` — 0 vulnerabilities.
  - Every literal command in `.factory/claims.json` — 17/17 PASS.
- Accessibility:
  - Playwright Axe on home, demo, privacy, terms, and 404 at 390 px — 0 serious/critical findings.
  - Keyboard focus, horizontal preview reach, 200% text, sticky controls, and route focus tests — PASS.
- Privacy/offline:
  - Complete sample and real-file flows issued only same-origin requests.
  - Primed `/demo` reloaded offline with the finished result and `Offline · local mode`.
  - License tokens were absent from Cache Storage.
- Performance:
  - Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100.
  - LCP 1.9 s, CLS 0, TBT 0 ms.
  - Initial app JS 32.28 kB raw / 10.97 kB gzip; CSS 12.47 kB raw / 3.57 kB gzip.

## Deployment and live evidence

- Repair commits pushed to `main`: `f55bfe8`, `002625c` (final evidence commit follows this handoff update).
- Static deployment id: `90dd6691-2787-41bb-9be2-88a7e3890559`.
- Live origin: <https://small-business-export-map.sociobot.in>.
- Live status: `/`, `/demo`, `/privacy/`, `/terms/` → 200; `/missing-review-route` → 404.
- Live `/demo` and `/?demo=1` expose `Demo — Export Map` metadata and the demo canonical URL.
- Live security headers, manifest MIME, favicon, and immutable hashed-JS caching passed.
- `npm run verify:url -- https://small-business-export-map.sociobot.in/` passed.
- Cold valid-route browser pass reported no console or page errors.
- Live 390 px first-screen facts ended at 759.3 px inside an 844 px viewport.
- Live scrolled demo banner remained at viewport top; reset and exit stayed visible.
- Live template import wrote one demo profile; Start for real cleared the demo profile count to zero.
- Live offline reload and live Axe check passed.

Evidence and finding mapping: [.factory/polish-2.md](polish-2.md).

## Known gaps

None. No payment was made during verification; checkout terms were read from the live hosted page, and entitlement behavior used recorded valid/revoked API fixtures.
