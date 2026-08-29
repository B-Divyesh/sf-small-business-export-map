# Polish 5 — zero-finding repair

Candidate reviewed: `a2ae29b5fea8c48f376af916e8187aa1f27530a0`.
Review source: `e99ad21b9f732dc036ee4e93179abf18e962a3ea` and all earlier review and polish records.
Repair: `0b3801e7bc0e412e694cf40876570c87da823139`.

## Current repair

Review 5 found one remaining issue: Twitter cards had no declared image. The existing reviewed 1200×630 product art is now declared as `twitter:image` on home, demo, Privacy, Terms, and the physical 404. The route contract test now requires that exact URL on every route, including the 404. The PWA cache and manifest start URL advance to v5 so installed copies fetch the new shell. The visual direction and artwork are unchanged.

## Cumulative finding closure

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the one-click `/demo` / `?demo=1` sample, `demo:export-map` isolation, sticky warning, reset, and real-workspace exit. | `@claim:demo-isolation`, `@claim:privacy-demo`, live `/demo`; [mobile sample](evidence/polish-5-live-demo-390.png) |
| F-1-2 | Kept the first-screen job headline, audience, sample action, real-file action, outcome, privacy, offline, and price facts. | mobile fold assertion in live crawl; [mobile landing](evidence/polish-5-live-landing-390.png); [copy audit](copy-audit.md) |
| F-1-3 | Kept all 18 registered, uniquely tagged observable claims and independently runnable commands. | [clean-clone claim evidence](evidence/polish-5-clean-claims.txt); `claims registry > maps every claim to exactly one tagged test` |
| F-1-4 | Kept the registered Sociobot checkout path and plain US$19 payment wording. | `@claim:checkout-host`; live endpoint → `303` `checkout.dodopayments.com` |
| F-1-5 | Kept the constrained phone review child and named, keyboard-focusable preview through the sixth column. | `mobile routes, six-column preview, and 200% text have no serious accessibility defects`; live `/demo` Axe 0 serious/critical |
| F-1-6 | Kept full backup validation before the replacement transaction. | `rejects an invalid backup atomically and accepts a long quoted field`; `@claim:profile-backup` |
| F-1-7 | Kept complete-record delimiter sampling for long quoted fields. | `accepts a valid quoted field beyond the separator sample boundary`; `@claim:file-limit` |
| F-1-8 | Kept the non-scrolling mobile route list and labelled keyboard-scrollable data regions. | mobile Axe test; live `/demo` Axe 0 serious/critical |
| F-1-9 | Kept license-query cache bypass and token URL cleanup. | `@claim:pro-license` checks Cache Storage keys |
| F-1-10 | Kept physical demo/legal routes, shared chrome, titles, focus announcements, anchors, sitemap, and designed hard 404. | `routes return real statuses, complete metadata including Twitter image, valid links, and restore h1 focus`; live `/`, `/demo`, `/privacy/`, `/terms/` 200 and `/missing-polish-5` 404 |
| F-1-11 | Kept CSP, permissions, MIME, nosniff, referrer, and immutable asset rules. | route/config browser test; live header crawl |
| F-1-12 | Kept plain, consistent CSV/accountant/recipient-profile/change-record vocabulary. | [copy audit](copy-audit.md); [mobile landing](evidence/polish-5-live-landing-390.png) |
| F-2-1 | Kept the sticky demo banner with reset and exit controls on a 390 px workspace. | `demo banner stays visible with reset and exit controls throughout the mobile workspace`; [mobile sample](evidence/polish-5-live-demo-390.png) |
| F-2-2 | Kept the rendered browser URL verifier in the test suite. | `npm run test:verify-url`; live `npm run verify:url -- https://small-business-export-map.sociobot.in/` |
| F-2-3 | Kept complete CSV and JSON change-record download assertions. | `@claim:csv-change-record`; clean-clone evidence |
| F-2-4 | Kept typed conversion and byte-preserved text-mapping coverage. | `@claim:explicit-formatting`; clean-clone evidence |
| F-2-5 | Kept separate hosted-checkout and recorded entitlement verification. | `@claim:checkout-host`, `@claim:pro-license`; live checkout 303 |
| F-2-6 | Kept the full real-file request-log privacy test. | `@claim:privacy-real-workflow`; clean-clone evidence |
| F-2-7 | Kept exact 10 MB acceptance and 10 MB + 1 rejection. | `@claim:file-limit`; clean-clone evidence |
| F-2-8 | Kept equals/plus/at formula-protection coverage in both modes. | `@claim:formula-protection`; clean-clone evidence |
| F-2-9 | Kept the eight-row preview and complete-download test. | `@claim:preview-full-download`; clean-clone evidence |
| F-2-10 | Kept complete profile export/import and demo/real separation. | `@claim:profile-backup`; clean-clone evidence |
| F-2-11 | Kept token storage, URL cleanup, daily cache, restore, revocation, payment wording, and host checks. | `@claim:pro-license`, `@claim:checkout-host`; live checkout 303 |
| F-2-12 | Kept separator, decimal, date, rename, reorder, and visible-output coverage. | `@claim:core-format-matrix`, `@claim:csv-change-record`; clean-clone evidence |
| F-2-13 | Kept the phone-visible free and one-time price fact. | mobile fold assertion; [mobile landing](evidence/polish-5-live-landing-390.png) |
| F-2-14 | Kept plain headings and result-naming actions. | [copy audit](copy-audit.md); live `/` screenshot |
| F-2-15 | Kept local accountant-template header import in the active namespace. | `@claim:template-import`; clean-clone evidence |
| F-3-1 | Kept the no-inference claim and ambiguous VAT/tax-code/text regression. | `@claim:no-accounting-inference`; clean-clone evidence |
| F-3-2 | Kept separate privacy, source-preservation, and accounting-choice assurances. | `@claim:privacy-real-workflow`, `@claim:source-preservation`, `@claim:no-accounting-inference`; live `/` |
| F-3-3 | Kept ordinary payment, receipt, and refund wording. | `@claim:checkout-host`; live checkout 303 |
| F-3-4 | Kept browser-storage and network explanations in ordinary reader language. | [README](../README.md), live `/privacy/`, [copy audit](copy-audit.md) |
| F-5-1 | Added `twitter:image` with the existing original `export-map-og.webp` social card to all five route documents; route test now asserts it on home, demo, Privacy, Terms, and 404. | `routes return real statuses, complete metadata including Twitter image, valid links, and restore h1 focus`; live route crawl; [mobile landing](evidence/polish-5-live-landing-390.png), [mobile sample](evidence/polish-5-live-demo-390.png) |

## Verification

- Local: `npx tsc --noEmit`, `npm test`, `npm run test:verify-url`, and `npm run build` passed. The suite reported 11 unit/contract tests and 19 Playwright tests.
- Build: `dist/index.html` exists. Main JS is 32.32 kB raw / 10.98 kB gzip and CSS is 12.55 kB raw / 3.59 kB gzip.
- Clean clone: all 18 literal registry commands passed from `0b3801e`; see [claim evidence](evidence/polish-5-clean-claims.txt).
- Deployment: `d126fdbb-174c-4b07-83fb-c1e6e858b6aa` deployed `dist/` successfully.
- Cold live 390×844 crawl: home, demo, Privacy, and Terms returned 200; the unknown route returned 404. Every route had one h1, one main, `lang=en`, its route title, and the declared Twitter image. Axe found zero serious or critical findings on all five routes. The primed live demo reloaded offline with the demo banner and Download CSV control.

## Result

There are no known unresolved review findings or product gaps.
