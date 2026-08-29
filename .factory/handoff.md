# Export Map — polish 5 handoff

## Delivered

- Repaired review 5 finding F-5-1: every public route now explicitly declares the original 1200×630 product card as `twitter:image`.
- Extended the route contract test to require that exact image on home, demo, Privacy, Terms, and the hard 404.
- Advanced the PWA shell cache and install start URL to v5 so installed clients receive the metadata repair.
- Preserved the reviewed risograph print-room identity, clear first screen, one-click isolated sample, local-only workflow, physical legal routes, hard 404, mobile layout, and offline PWA artifact class.
- Updated the catalog line to: “Prepare CSV files with the columns, separators, numbers, and dates your accountant requested.”

## Commits and deployment

- Base reviewer commit: `e99ad21b9f732dc036ee4e93179abf18e962a3ea`.
- Product repair: `0b3801e7bc0e412e694cf40876570c87da823139` (`fix: declare Twitter card image on every route`), pushed to `origin/main`.
- Static deployment: `d126fdbb-174c-4b07-83fb-c1e6e858b6aa`.
- Live URL: <https://small-business-export-map.sociobot.in>.

## Exact verification evidence

- `npm ci` completed with 0 vulnerabilities.
- `npx tsc --noEmit` passed.
- `npm test` passed: 11 Vitest unit/contract tests and 19 Playwright browser tests; it includes accessibility, privacy, offline, routing, mobile, and claim-registry coverage.
- `npm run test:verify-url` passed. `npm run verify:url -- https://small-business-export-map.sociobot.in/` also passed the rendered title, language, main, h1, alt-text, and console checks.
- `npm run build` passed and created `dist/index.html`. Main JS: 32.32 kB raw / 10.98 kB gzip. Main CSS: 12.55 kB raw / 3.59 kB gzip. The uploaded static artifact was 319,413 B.
- Fresh remote clone `/tmp/export-map-polish5.nwT18u` at `0b3801e`: `npm ci` passed, then all 18 literal `test` commands in `.factory/claims.json` passed independently. The full command list is in [clean-clone claim evidence](evidence/polish-5-clean-claims.txt).
- Cold live 390×844 browser crawl after deployment: `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; `/missing-polish-5` returned 404. Each had one h1 and main, `lang=en`, the expected route title, and `twitter:image=https://small-business-export-map.sociobot.in/assets/export-map-og.webp`.
- Live Axe found zero serious/critical findings on home, demo, Privacy, Terms, and 404. The live demo was primed, taken offline, reloaded, and still showed its demo banner and Download CSV control. Normal-route console and page-error listeners were clean.
- The live checkout endpoint returned 303 to `https://checkout.dodopayments.com/...` without a payment attempt.
- Visual evidence: [mobile first screen](evidence/polish-5-live-landing-390.png) and [mobile demo](evidence/polish-5-live-demo-390.png).

## Run and verify

```sh
npm ci
npx tsc --noEmit
npm test
npm run build
npm run verify:url -- https://small-business-export-map.sociobot.in/
```

Run every `test` value in `.factory/claims.json` independently from a clean clone for the claims contract.

## Known gaps

None. The pre-existing dirty `graphify-out/` files were not changed.
