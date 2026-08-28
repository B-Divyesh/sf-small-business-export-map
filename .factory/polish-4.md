# Polish 4 — cumulative finding closure

Candidate repaired: `ca05b868883ec6855e79d08c8939a53319182cec`. Review source: `cab178c5717d3fd5110138100a2002dfbc9aad3f`.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen links directly to `/demo`; the completed three-row sample uses `demo:export-map`, has a persistent banner, resets, and exits without copying demo data. | `@claim:demo-isolation`, `@claim:privacy-demo`; [live demo at 390 px](evidence/polish-4-live-demo-390.png); live `/demo` and `/?demo=1` |
| F-1-2 | The first screen names the CSV/accountant job, audience, sample action, real action, outcome, privacy, offline use, and price. | [live first screen](evidence/polish-4-live-landing-390.png); live final fact bottom `759.3125 < 844`; [copy audit](copy-audit.md) |
| F-1-3 | The registry now has 18 observable claims and exactly one tagged test per ID. Every literal command is independently runnable. | `claims registry > maps every claim to exactly one tagged test`; 18/18 commands passed in clean clone `/tmp/export-map-polish4.tEIWEK` |
| F-1-4 | The only purchase link uses the registered Sociobot endpoint and the live endpoint redirects to hosted Dodo checkout. | `@claim:checkout-host`; live checkout returned 303 to `checkout.dodopayments.com` |
| F-1-5 | The phone review child stays within the grid and the named preview owns horizontal overflow through its final column. | `mobile routes, six-column preview, and 200% text have no serious accessibility defects`; [live demo](evidence/polish-4-live-demo-390.png) |
| F-1-6 | Profile backups are fully validated before the replacement transaction. Invalid data leaves valid profiles intact. | `rejects an invalid backup atomically and accepts a long quoted field`; `@claim:profile-backup` |
| F-1-7 | Delimiter detection samples complete quoted records, including a 70,000-character quoted field. | `accepts a valid quoted field beyond the separator sample boundary`; browser regression test |
| F-1-8 | The mobile workflow is a non-scrolling two-column list; independently scrolling data regions have keyboard focus and names. | `mobile routes, six-column preview, and 200% text have no serious accessibility defects`; live Axe: 0 serious/critical |
| F-1-9 | License-query navigations bypass Cache Storage and the return URL is cleaned before normal use. | `@claim:pro-license` asserts no token in Cache Storage |
| F-1-10 | Home, demo, legal, and 404 pages have route titles, metadata, common chrome, focus announcements, valid links, and real statuses. | `routes return real statuses, complete metadata, valid links, and restore h1 focus`; live `/missing-polish-4-route` → 404; `npm run verify:url` |
| F-1-11 | Static configuration sends CSP, Permissions-Policy, nosniff, referrer policy, manifest MIME, and immutable hashed-asset caching. | Live header check on `/`; route/config browser tests |
| F-1-12 | Visitor copy uses CSV, accountant, recipient profile, output preview, and change record consistently. Actions name their result. | [copy audit](copy-audit.md); [live landing](evidence/polish-4-live-landing-390.png) |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-3 reopened | Playwright builds and starts its own server for every command, including a clean clone with no `dist/`. | All 18 literal claim commands passed from the fresh remote clone |
| F-2-1 | The compact demo banner stays sticky with Reset demo and Start for real at 390 px. | `demo banner stays visible with reset and exit controls throughout the mobile workspace`; [live scrolled demo](evidence/polish-4-live-demo-390.png) |
| F-1-10 reopened | Physical routes retain route-specific canonical, Open Graph, Twitter, favicon, header, footer, focus, and hard-404 behavior. | Route test; live `/`, `/demo`, `/privacy/`, `/terms/` → 200 and missing route → 404 |
| F-2-2 | The URL verifier launches Chromium and checks rendered title, language, main, h1, alt text, and console. | `npm run test:verify-url`; `npm run verify:url -- https://small-business-export-map.sociobot.in/` |
| F-2-3 | Both downloads are read and checked for headers, transformed rows, SHA-256, field map, checks, changes, and reversal guidance. | `@claim:csv-change-record` |
| F-2-4 | Typed and text-mapped copies of the same dates and numbers prove only marked columns change. | `@claim:explicit-formatting` |
| F-2-5 | Checkout and entitlement are separate claims; recorded valid/revoked responses cover activation and relocking. | `@claim:checkout-host`; `@claim:pro-license` |
| F-2-6 | The complete real-file flow now rejects external, non-GET, body-bearing, or CSV-bearing requests. | `@claim:privacy-real-workflow`; live demo request origin was only the product origin |
| F-2-7 | The UI says “up to and including 10 MB”; the exact boundary passes and one extra byte fails. | `@claim:file-limit` |
| F-2-8 | Formula protection covers equals, plus, and at signs with the setting on and off. | `@claim:formula-protection` |
| F-2-9 | An 11-row fixture proves the eight-row preview cap and complete 11-row download. | `@claim:preview-full-download` |
| F-2-10 | Full profile export/import round-trips every field and does not cross demo and real storage. | `@claim:profile-backup` |
| F-2-11 | Token storage, URL removal, daily verification caching, restore, revocation, checkout host, and payment wording are registered. | `@claim:pro-license`; `@claim:checkout-host` |
| F-2-12 | Four separators, two decimal marks, four date formats, reorder, rename, and visible output are covered. | `@claim:core-format-matrix`; `@claim:csv-change-record` |
| F-2-13 | The phone first screen states “Free: two profiles · Pro: US$19 once.” | [live first screen](evidence/polish-4-live-landing-390.png) |
| F-2-14 | Handoff/map/manifest jargon and noun-only actions were replaced with the consistent product vocabulary. | [copy audit](copy-audit.md); route and browser suites |
| F-2-15 | Import accountant template reads the local header row in order and saves only in the active namespace. | `@claim:template-import` |

## Reviews 3 and 4 findings

Review 4 reopened these same four IDs as blocking; the rows below are the round-4 repairs.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Added `no-accounting-inference`. The demo test loads `VAT`, `Tax code`, and `20`, proves no mappings appear automatically, then proves explicit mappings remain text and preserve all values. | `@claim:no-accounting-inference`; live cold browser check; [claims registry](claims.json) |
| F-3-2 | Replaced the bundled limitation with three list items: “Your CSV is not uploaded.” “The original file is not changed.” “You choose the accounting meaning.” | [live limitation copy](evidence/polish-4-live-limitations-1440.png); `@claim:privacy-real-workflow`, `@claim:source-preservation`, `@claim:no-accounting-inference` |
| F-3-3 | Replaced “merchant of record” everywhere with “Sociobot/Dodo takes payment and handles receipts and refunds.” | [live purchase copy](evidence/polish-4-live-payment-1440.png); `@claim:checkout-host`; live 303 checkout redirect |
| F-3-4 | README and Privacy now explain separate browser storage, on-device CSV processing, saved profiles, and license checks without IndexedDB, localStorage, or same-origin jargon. | [README](../README.md); [Privacy](../privacy/index.html); [copy audit](copy-audit.md); `rg` reader-copy audit |

## Round-4 verification

- `npm test`: 11 unit/contract tests, 19 Playwright tests, production build, and rendered URL self-test passed.
- `npx tsc --noEmit` and `npm run build` passed. Initial app JS is 32.32 kB raw / 10.98 kB gzip; CSS is 12.55 kB raw / 3.59 kB gzip.
- Clean remote clone at `ad78a1f332dcc232d222a4fb05e6f9a1970a71f9`: `npm ci` found zero vulnerabilities and all 18 literal claim commands passed.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.0 s, CLS 0, TBT 0 ms.
- Deployment `80580c13-974a-4599-9153-2ae3607dc381` succeeded. Cold live checks passed demo isolation/reset/downloads, same-origin traffic, offline reload, ambiguous-tax safety, route focus, metadata, security headers, checkout redirect, hard 404, and console/Axe checks.
