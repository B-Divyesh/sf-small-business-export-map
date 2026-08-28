# Polish 2 — cumulative finding closure

Candidate repaired: `d8d891f640242edfbd74eb0b0a142e1aaf8906e9`. Review source: `5cf78b9ef83dd94b63cc23065346896e2134c562`.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the one-click sample, separate `demo:export-map` database, reset, and exit. Exit now clears demo records before opening the real workspace. | `@claim:demo-isolation`; `@claim:privacy-demo`; [.factory/demo.md](demo.md); [live demo screenshot](evidence/polish-2-live-demo-390.png); live `/demo` and `/?demo=1` checks |
| F-1-2 | Retained the clear job headline and audience sentence. Replaced the last “handoff” phrase with “finished CSV and change record,” and added the price fact above the fold. | [mobile first screen](evidence/polish-2-landing-390.png); [.factory/copy-audit.md](copy-audit.md); live 390 px fact bound `759.3 < 844` |
| F-1-3 | Rebuilt `claims.json` around 17 observable claims. Every literal command now builds its own server when needed and passes from a clean clone. | [clean-clone claim log](evidence/claim-clean-clone.txt); `claims registry > maps every claim to exactly one tagged test` |
| F-1-4 | Kept only the registered Sociobot checkout. The test follows the Dodo redirect and asserts product name, `$19.00`, one-time wording, and Sociobot checkout branding. | `@claim:checkout-host`; live endpoint `303` to `checkout.dodopayments.com` |
| F-1-5 | Preserved the constrained, keyboard-focusable preview and its six-column mobile scroll. Added 200% text-resize coverage. | `mobile routes, six-column preview, and 200% text…`; [mobile demo screenshot](evidence/polish-2-demo-sticky-390.png) |
| F-1-6 | Preserved full profile validation before the atomic replacement transaction. | `rejects an invalid backup atomically and accepts a long quoted field`; `@claim:profile-backup` |
| F-1-7 | Preserved complete-record delimiter sampling for quoted fields beyond 64 KB. | unit test `accepts a valid quoted field beyond the separator sample boundary`; browser regression test |
| F-1-8 | Preserved the non-scrolling mobile route list and made the independently scrollable mapping table a named keyboard region. | mobile Axe test: zero serious/critical findings on five routes |
| F-1-9 | Preserved license-query cache bypass and added valid/revoked fixture coverage plus a Cache Storage assertion. | `@claim:pro-license` |
| F-1-10 | Added physical `/demo`, complete metadata on every route, shared chrome/build id, sitemap entry, focus restoration, valid anchors, and a real 404 response. | `routes return real statuses…`; live `/missing-review-route` → 404; [live 404 screenshot](evidence/polish-2-live-404-390.png) |
| F-1-11 | Removed the SPA fallback, added the explicit demo rewrite, and retained CSP, permissions, MIME, nosniff, referrer, and immutable-asset rules. | live header checks; live manifest MIME; hashed JS `max-age=31536000, immutable` |
| F-1-12 | Removed all remaining handoff/map/manifest visitor jargon and renamed noun-only actions. | [.factory/copy-audit.md](copy-audit.md); `rg` copy audit; screenshots |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-3 reopened | Playwright now runs `npm run build && node scripts/test-server.mjs`; every registry command is independently runnable without an existing `dist/`. | All 17 independent passes in [claim-clean-clone.txt](evidence/claim-clean-clone.txt) |
| F-2-1 | Made the demo banner sticky at the viewport top, compact on phones, and kept both controls visible. | `demo banner stays visible…`; [scrolled live screenshot](evidence/polish-2-live-demo-390.png); live bounds top `0`, bottom `88.625` |
| F-1-10 reopened | Physical routes now carry route-specific canonical/OG/Twitter/favicon metadata. Unknown paths return `404.html` with status 404. All pages share navigation, footer, route focus, and build id. | route test; live `/demo`, legal, query-demo, and missing-route metadata checks |
| F-2-2 | Replaced the source-text URL check with a rendered Chromium verifier covering title, lang, landmarks, h1, alt text, and console errors. It runs inside `npm test`. | `npm run verify:url -- https://small-business-export-map.sociobot.in/` passed; `npm run test:verify-url` passed |
| F-2-3 | The download test now reads both files and checks six headers, three transformed rows, SHA-256, mapping, checks, transformations, and reversal instructions. | `@claim:csv-change-record` |
| F-2-4 | Added adjacent typed and text-mapped number/date fixtures; text values must remain byte-for-byte unchanged. | `@claim:explicit-formatting` |
| F-2-5 | Split checkout proof from entitlement proof. Recorded valid/revoked verification fixtures test URL cleanup, token storage, daily cache, third-profile save, and relock. | `@claim:checkout-host`; `@claim:pro-license` |
| F-2-6 | Added a complete real-file request-log test through mapping, preview, and both downloads. | `@claim:privacy-real-workflow`; live demo request origins contained only the product origin |
| F-2-7 | Clarified “up to and including 10 MB” and tested a valid exact-boundary file plus a file one byte larger. | `@claim:file-limit` |
| F-2-8 | Registered formula protection and tested `=`, `+`, and `@` with protection on and off. | `@claim:formula-protection` |
| F-2-9 | Registered the eight-row preview cap and full-row download. The test uses 11 unique records. | `@claim:preview-full-download` |
| F-2-10 | Registered a deep profile-backup round trip and repeated import inside demo storage without changing real data. | `@claim:profile-backup` |
| F-2-11 | Registered token storage, URL removal, 24-hour verification caching, restore activation, revoked fallback, and checkout-host wording. | `@claim:pro-license`; `@claim:checkout-host` |
| F-2-12 | Added a matrix for four separators, two decimal directions, four date formats, and reordered/renamed columns; the sample test checks visible transformed values. | `@claim:core-format-matrix`; `@claim:csv-change-record` |
| F-2-13 | The first screen now says “Free: two profiles · Pro: US$19 once” beside privacy and offline facts. | [mobile first screen](evidence/polish-2-landing-390.png); live first-screen extraction |
| F-2-14 | Replaced handoff, declared map, and visible manifest wording. Buttons now say “Create recipient profile” and “Download change record”; the 404 is plain. | [.factory/copy-audit.md](copy-audit.md); live `/demo`; live 404 |
| F-2-15 | Added local accountant-template import. It reads only the ordered header row, shows the columns, and saves the profile in the active namespace. | `@claim:template-import`; live check: demo count `1`, count after exit `0` |

## Final verification

- `npm test`: 11 unit/contract tests, production build, 18 Playwright tests, and rendered URL self-test passed.
- `npx tsc --noEmit` and `npm run build` passed; `dist/index.html` exists.
- Every exact claim command passed from `/tmp/export-map-polish2.tlWgaD`.
- Lighthouse results are recorded in [performance-polish-2.txt](evidence/performance-polish-2.txt).
- Deployment `90dd6691-2787-41bb-9be2-88a7e3890559` succeeded.
- Cold live checks passed for first-screen copy, sticky demo, both downloads, reset/exit isolation, offline reload, metadata, focus, headers, console, Axe, checkout redirect, and hard 404.
