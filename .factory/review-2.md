# Adversarial first-read review 2 — FAIL

Reviewed 2026-08-28 against `https://small-business-export-map.sociobot.in` in fresh Chromium contexts at 390×844 and 1440×900. No product code was changed. Word counts below treat hyphenated terms, numbers, URLs, and code spans as one word.

## Cold first screen, before scrolling

- **What it does:** prepares a CSV so its columns, numbers, and dates match an accountant's requested format.
- **For whom:** small-business owners sending records to an accountant.
- **What to click first:** **Try it with sample data** to see the finished example; **Choose a CSV to prepare** is the real-data path.

All three answers are clear at both widths. At 390 px, the headline, audience sentence, both actions, their outcome note, and all three current facts are visible before scrolling. The exact decisive text is **“Prepare CSVs for your accountant.”**, **“For small-business owners…”**, and **“Try it with sample data.”** There is no first-screen clarity blocker.

## Findings

### Blocking

#### F-1-3 — Claim verification is still not runnable as registered (reopened)

**Exact location:** every Playwright `test` command in `.factory/claims.json`, for `demo-isolation`, `offline-demo`, `csv-manifest`, `privacy-demo`, `profile-persistence`, `source-preservation`, `profile-limit`, `pro-checkout`, and `file-limit`.

**Evidence:** from a fresh clone, after `npm ci`, each exact command exited 1 after 60 seconds with `Error: Timed out waiting 60000ms from config.webServer.` `playwright.config.ts` starts `npm run preview`, but a clean clone has no `dist/`. Only `@claim:explicit-formatting` passed as registered. `npm test` later passed because that different command builds before Playwright.

**Why this fails:** the registry is the verifier contract. Nine listed claim tests cannot establish their claims from the required clean state.

**Concrete fix:** make `npm run test:e2e` build first, or make Playwright's web server command run `npm run build && npm run preview`. Re-run every exact registry string in a newly cloned directory and require ten zero exit codes.

#### F-2-1 — The demo banner is not persistent

**Exact quote/location:** `/demo`, **“Demo — sample data, nothing is saved.”** with **Reset demo** and **Start for real**; `.demo-banner` in `src/style.css` has the default `position: static`.

**Evidence:** after scrolling to `scrollY=1200` at 390 px, its bounds were `top=-1047`, `bottom=-928.625`, and it was outside the viewport.

**Why this fails:** the user loses the demo-state warning and exit/reset controls while using the lower mapping and download controls. The demo contract requires a persistent banner.

**Concrete fix:** keep a compact banner visible with `position: sticky`, an appropriate `top` and `z-index`, and a reduced mobile layout. Add a test that scrolls through the workspace and confirms the banner, reset, and exit remain visible.

#### F-1-10 — Routing, route metadata, and shared chrome remain incomplete (reopened)

**Exact locations and evidence:**

- `GET /missing-review-route` returns HTTP **200**, although the rendered h1 is **“That page is not in this export.”** This is a soft 404, not a real 404.
- `/demo` retains canonical and `og:url` values for `/`, and retains the home Open Graph title.
- `/privacy/` and `/terms/` have no Open Graph, Twitter, or favicon metadata. The live unknown route inherits the home description/canonical/OG metadata. The standalone `404.html` also lacks canonical, OG, Twitter, and favicon metadata.
- Home, legal, and 404 headers differ. Legal headers omit the current-route item and the home arrow mark; legal footers omit the build id.
- Browser navigation does not consistently move focus. Home → Demo focuses the h1, but Back to `/` leaves focus on `BODY`; Privacy → Terms also leaves focus on `BODY`.
- The live SPA 404 header contains **Prepare CSV** linking to `#workspace`, but that 404 DOM has no `#workspace` target.
- `sitemap.xml` omits `/demo`.

**Why this fails:** crawlers receive a success status and wrong metadata for missing/demo routes, keyboard and screen-reader users lose route context, and the common site skeleton changes by route. The earlier finding was only partially repaired.

**Concrete fix:** serve explicit `/demo` and legal routes, let unknown paths reach `404.html` with status 404, set route-specific canonical/OG/Twitter metadata, use one header/footer component or byte-equivalent markup, link the 404's Prepare action to `/#workspace`, focus and announce each route h1 on navigation/back, and add `/demo` to the sitemap. Test status, metadata, focus, and anchor targets on every route.

#### F-2-2 — The required URL verifier fails

**Exact location:** `scripts/verify-url.sh`; command `npm run verify:url -- https://small-business-export-map.sociobot.in/`.

**Evidence:** it exited 1. The script searches the unrendered HTML for `alt=`, while the image and its valid alt text are inserted by JavaScript.

**Why this fails:** the required accessibility/basic-structure gate cannot pass against the deployed product, and its current method does not verify the rendered UI.

**Concrete fix:** make the verifier inspect the rendered DOM with Playwright, or explicitly validate the source template that creates the image. Add a self-test and require a zero exit code in `npm test`.

### Major

#### F-2-3 — `csv-manifest` does not prove its listed claim

**Exact claim:** **“Downloads a reshaped CSV and a JSON record of changes.”**

**Evidence:** the test checks that the CSV filename contains `handoff.csv` and that the manifest has a readable stream. It never reads either download, checks CSV headers/rows, parses JSON, or verifies the recorded transformations.

**Why this fails:** empty or incorrect files would pass.

**Concrete fix:** read both downloads; assert six expected headers, all three sample rows and transformed values, then parse the manifest and assert the source fingerprint, mapping, checks, transformations, and reverse instructions.

#### F-2-4 — `explicit-formatting` does not prove “only when marked”

**Exact claim:** **“Export Map changes numbers and dates only when the user marks a column with that format.”**

**Evidence:** the unit test proves typed date/number conversion and formula prefixing. It does not include number-like and date-like values mapped as text and assert that they remain byte-for-byte unchanged.

**Why this fails:** the exclusivity promised by “only” is untested.

**Concrete fix:** add text-mapped date and number fixtures beside typed fixtures, then assert the text values do not change.

#### F-2-5 — `pro-checkout` does not prove the full paid claim

**Exact claim:** **“A one-time US$19 purchase saves unlimited recipient profiles through Sociobot/Dodo checkout.”**

**Evidence:** the test proves only that the checkout endpoint returns 303 to `checkout.dodopayments.com`. It does not prove the price, one-time billing, returned-license activation, unlimited profile saving, or revoked/refunded behavior. No payment was made, which is correct for a test, but a recorded license fixture is also absent.

**Why this fails:** a functioning redirect can coexist with the wrong price or a broken entitlement.

**Concrete fix:** split the claim. Keep the live redirect smoke test, add a mocked/recorded successful verification response and assert Pro activation plus saving a third profile, and add revoked-token fallback coverage. Prove price and one-time terms from the checkout response/fixture.

#### F-2-6 — Normal-workflow privacy claims are unlisted

**Exact quotes/locations:** landing **“Your real file stays in this browser.”**, **“Files stay in this browser”**, **“The file is read in this browser.”**, **“It does not upload your CSV…”**; README **“Reads a CSV in the browser…”** and **“The sample and normal CSV workflow make only same-origin requests.”**

**Evidence:** `privacy-demo` is explicitly scoped to the sample and its test opens only `/demo`. No registry entry records or tests the real-file flow.

**Why this fails:** visitors may rely on the stronger real-data privacy promise, but the sandbox proves only demo traffic.

**Concrete fix:** add a `privacy-real-workflow` claim and request-log test that uploads a generated local CSV, maps it, checks it, downloads both outputs, and asserts that every request is same-origin except an explicitly initiated license check.

#### F-2-7 — The inclusive 10 MB statement is not proved

**Exact quote/location:** file picker, **“CSV or text file, up to 10 MB.”**

**Evidence:** `file-limit` proves that 10 MB + 1 byte is rejected. It does not prove that a valid file of exactly 10 MB is accepted.

**Why this fails:** “up to” includes the boundary.

**Concrete fix:** change the listed claim to include both sides of the boundary and test a valid 10 MB CSV plus a 10 MB + 1 byte file.

#### F-2-8 — Formula protection is an unlisted claim

**Exact quote/location:** profile settings, **“Add an apostrophe before formulas in the downloaded CSV.”**

**Evidence:** a unit test happens to assert one `=SUM(A1)` example, but `.factory/claims.json` has no formula-protection entry and the visible claim also implies the `+` and `@` cases used by the implementation.

**Why this fails:** an accidental assertion inside a differently named claim is not traceable coverage for the visible feature.

**Concrete fix:** add a `formula-protection` claim and fixtures for `=`, `+`, and `@`, with protection on and off.

#### F-2-9 — Preview and full-row download statements are unlisted

**Exact quotes/location:** result area, **“Preview shows up to eight rows.”** and **“The downloaded file contains every row.”**

**Evidence:** no claim entry names either bound. The download test does not inspect row counts.

**Why this fails:** these are quantitative/completeness promises a visitor uses before sending the export.

**Concrete fix:** register one claim and test datasets with 8 and 9+ rows; assert the preview cap and that every input record appears once in the downloaded CSV.

#### F-2-10 — Profile backup controls are unlisted claims

**Exact controls/location:** **Export profiles** and **Import profiles** in the recipient-profile panel.

**Evidence:** the registry has no backup round-trip claim. The only import test covers rejection of malformed JSON.

**Why this fails:** action labels promise usable export and import, but a valid round trip is untested.

**Concrete fix:** register a profile-backup claim and test save two profiles → export → clear → import → compare every field. Repeat inside demo and assert only `demo:export-map` changes.

#### F-2-11 — License storage, verification cadence, and merchant statements are unlisted

**Exact quotes/locations:** README **“A pasted or returned license token is stored in browser localStorage.”**, **“The app checks a license with `api.sociobot.in` at most once per day while online.”**, and **“Sociobot/Dodo hosts checkout and is the merchant of record.”**; landing repeats **“Sociobot/Dodo is the merchant of record.”** The **Restore purchase** control also promises a working restore path.

**Evidence:** `pro-checkout` checks only a redirect. The cache-token regression test is not registered and does not prove localStorage, daily cadence, restore, or merchant status.

**Why this fails:** storage/privacy and paid-access behavior are material claims.

**Concrete fix:** add separately scoped claims for token storage/removal, 24-hour verification caching, restore activation, and checkout host/merchant wording; use recorded API fixtures and keep one no-payment live redirect smoke test.

#### F-2-12 — Core preview/format statements are not fully registered

**Exact quotes/locations:** README **“Reads a CSV in the browser and shows a checked output preview.”** and **“Lets you name recipient columns and set separators, decimal marks, and date formats.”**; landing **“Name columns and choose separators, numbers, and dates.”**

**Evidence:** the registry has no preview claim. Existing tests use one separator and two typed conversions but do not cover all four advertised date formats or all separator choices.

**Why this fails:** the README describes a wider supported input/output surface than the claims contract proves.

**Concrete fix:** add a core-format matrix claim covering comma, semicolon, tab, pipe, both decimal marks, four date formats, renamed/reordered columns, and visible preview values.

### Minor

#### F-2-13 — The first-screen facts omit price

**Exact location:** the three facts are **“Files stay in this browser”**, **“Original CSV stays unchanged”**, and **“Works offline after first visit.”**

**Why this fails:** the required first-screen fact set is privacy, offline behavior, and price. The paid tier is otherwise invisible until far below the fold.

**Concrete fix:** replace the redundant preservation fact or add a nearby short line: **“Free for two saved profiles · US$19 once for unlimited profiles.”**

#### F-2-14 — Several terms and one button are not plain or consistent

**Exact quotes/locations:** **“finished handoff”**, **“Ready for handoff”**, **“Handoff files are ready”**, **“declared map”**, **“manifest”**, and the noun-only button **“New profile.”** The UI alternates among accountant, recipient, handoff, map, JSON record, and manifest.

**Why this fails:** a first-time owner must translate internal data-transfer vocabulary, and **New profile** does not name a result-producing action. The 404 h1 **“That page is not in this export.”** is also a product pun rather than a plain error.

**Concrete fix:** use **“finished CSV and change record”**, **“Ready to download”**, **“CSV and change record are ready”**, **“3 rows match the accountant's columns and formats”**, **“Download change record”**, **“Create recipient profile”**, and **“This page does not exist.”** Define “recipient profile” once if it remains.

#### F-2-15 — Accountant-template import is missed leverage

**Exact location:** the mapping area offers **Use source headers**, while profile import accepts only Export Map JSON.

**Why this matters:** the brief centers on matching fields the accountant requested. A normal user may receive a blank CSV/template from the accountant and should not have to retype every target header.

**Concrete feature:** add **Import accountant template** beside **Use source headers**. Read only the template header row, create ordered recipient columns, show them for confirmation, and save them as a profile. Keep it local and add demo, privacy, and mapping-order tests. Do not add AI guessing; the brief explicitly requires ambiguous accounting meaning to remain user-declared.

## Copy audit

No landing or README sentence exceeds 22 words. No banned marketing word appears. The flags below concern claims, jargon, terminology, or action naming. Repeated strings are listed once; punctuation-only icons and numeric step markers are excluded.

### Landing, workspace, and demo copy

| Copy | Words | Audit |
| --- | ---: | --- |
| Skip to main content | 4 | Clear action. |
| Export Map | 2 | Product name. |
| Demo | 1 | Clear nav label. |
| Prepare CSV | 2 | Clear nav action. |
| Privacy | 1 | Clear heading/nav label. |
| Terms | 1 | Clear heading/nav label. |
| Ready offline | 2 | Listed by `offline-demo`. |
| Check a CSV before sending it | 6 | Clear section label. |
| Prepare CSVs for your accountant. | 5 | Clear job headline. |
| For small-business owners who need every CSV column, number, and date in the format their accountant requested. | 17 | Clear audience/result. |
| Try it with sample data | 5 | Clear action. |
| Choose a CSV to prepare | 5 | Clear real-data action. |
| The sample opens a finished handoff. | 6 | Flag: “handoff”; F-2-14. |
| Your real file stays in this browser. | 7 | Flag: unlisted real-flow claim; F-2-6. |
| Files stay in this browser | 5 | Flag: unlisted real-flow claim; F-2-6. |
| Original CSV stays unchanged | 4 | Listed by `source-preservation`. |
| Works offline after first visit | 5 | Listed by `offline-demo`. |
| Illustration generated for Export Map. | 5 | Useful provenance. |
| Choose CSV | 2 | Clear step. |
| Set recipient columns | 3 | Consistent control term, but “recipient” needs definition; F-2-14. |
| Check output | 2 | Clear action. |
| Download files | 2 | Clear step. |
| CSV setup | 2 | Clear section label. |
| Prepare your CSV | 3 | Clear heading. |
| Choose a file, state your accountant’s format, and check the output before downloading. | 13 | Clear instruction. |
| Choose your CSV | 3 | Clear heading. |
| Choose a CSV file | 4 | Clear action. |
| CSV or text file, up to 10 MB | 8 | Flag: inclusive boundary unproved; F-2-7. |
| Set your accountant’s format | 4 | Clear heading. |
| No saved recipients yet | 4 | Clear empty state. |
| New profile | 2 | Flag: noun-only button; F-2-14. |
| Recipient profile name | 3 | Clear after “recipient profile” is defined. |
| Output separator | 2 | Clear form label. |
| Source decimal mark | 3 | Clear form label. |
| Output decimal mark | 3 | Clear form label. |
| Source date format | 3 | Clear form label. |
| Output date format | 3 | Clear form label. |
| Protect formula-like values | 3 | Clear technical setting. |
| Add an apostrophe before formulas in the downloaded CSV. | 9 | Flag: unlisted claim; F-2-8. |
| Save recipient profile | 3 | Result-naming action. |
| Delete profile | 2 | Result-naming action. |
| Export profiles | 2 | Flag: unlisted action claim; F-2-10. |
| Import profiles | 2 | Flag: unlisted action claim; F-2-10. |
| 0 of 2 free recipient profiles saved on this device. | 10 | Listed by `profile-limit`/`profile-persistence`. |
| Use formatting only when your accountant specified it. | 8 | Listed by `explicit-formatting`, but test is incomplete; F-2-4. |
| Export Map does not guess accounting meaning. | 7 | Plain limitation; aligns with the brief. |
| Add recipient column | 3 | Result-naming action. |
| Use source headers | 3 | Clear action. |
| Add required columns, or choose a CSV and copy its headers. | 11 | Clear empty state. |
| How it works | 3 | Clear heading. |
| Choose a CSV. | 3 | Clear step. |
| The file is read in this browser. | 7 | Flag: unlisted real-flow claim; F-2-6. |
| Set the requested format. | 4 | Clear step. |
| Name columns and choose separators, numbers, and dates. | 8 | Flag: incompletely registered capability; F-2-12. |
| Check and download. | 3 | Clear step. |
| Review the result with a record of each change. | 9 | Clear outcome. |
| What Export Map does not do | 6 | Clear heading. |
| It does not upload your CSV, change the source file, or decide tax and accounting meaning. | 16 | Flag: real-flow privacy portion is unlisted; F-2-6. |
| One-time purchase | 2 | Clear label. |
| Save unlimited recipient profiles | 4 | Clear heading. |
| The free version saves two profiles. | 6 | Listed by `profile-limit`. |
| Export Map Pro saves unlimited profiles for a one-time US$19 purchase. | 11 | Listed but inadequately proved; F-2-5. |
| License token | 2 | Clear label. |
| Restore purchase | 2 | Result-naming action, but untested; F-2-11. |
| Sociobot/Dodo is the merchant of record. | 6 | Flag: unlisted claim; F-2-11. |
| Buy unlimited profiles | 3 | Result-naming action. |
| Prepare CSVs in this browser. | 5 | Flag: real-flow privacy claim; F-2-6. |
| Built by Param Factory · build polish-1 | 7 | Useful provenance/build label. |
| Demo — sample data, nothing is saved. | 7 | Listed by `demo-isolation`; banner persistence fails F-2-1. |
| Reset demo | 2 | Result-naming action. |
| Start for real | 3 | Clear exit action. |
| Checks | 1 | Clear heading. |
| Delimiter will change | 3 | Clear status. |
| Semicolon (;) → Comma (,). | 5 | Concrete status. |
| Ready for handoff | 3 | Flag: jargon; F-2-14. |
| 3 records match the declared map. | 6 | Flag: “declared map”; F-2-14. |
| Changes | 1 | Clear heading. |
| Select and order 6 recipient columns | 6 | Concrete change. |
| 3 affected | 2 | Concrete count. |
| Reverse: Use each manifest source → recipient mapping in reverse. | 10 | Flag: “manifest”/“recipient mapping”; F-2-14. |
| Output preview | 2 | Clear heading. |
| Preview shows up to eight rows. | 6 | Flag: unlisted quantitative claim; F-2-9. |
| The downloaded file contains every row. | 6 | Flag: unlisted completeness claim; F-2-9. |
| Handoff files are ready | 4 | Flag: jargon; F-2-14. |
| Download the reshaped CSV and the JSON record of every change. | 11 | Listed but inadequately proved; F-2-3. |
| Download CSV | 2 | Result-naming action. |
| Download manifest | 2 | Flag: inconsistent with “JSON record”; F-2-14. |

Select-option copy is also concise: **Comma (,)** (2), **Semicolon (;)** (2), **Tab** (1), **Pipe (|)** (2), **Point (1.25)** (2), **Comma (1,25)** (2), each date format (1), **Text** (1), **Number** (1), **Date** (1), **Required** (1), and **Not mapped** (2). No option is jargon beyond the surrounding source/output labels.

### README copy

| Copy | Words | Audit |
| --- | ---: | --- |
| Export Map | 2 | Product heading. |
| Prepare CSVs for your accountant. | 5 | Clear job sentence. |
| It is for small-business owners who need requested columns, numbers, and dates before sending a file. | 16 | Clear audience/result. |
| Try the finished sample: `https://small-business-export-map.sociobot.in/demo`. | 5 | Clear action. |
| What it does | 3 | Clear heading. |
| Reads a CSV in the browser and shows a checked output preview. | 12 | Flag: privacy/preview claims; F-2-6 and F-2-12. |
| Lets you name recipient columns and set separators, decimal marks, and date formats. | 13 | Flag: capability surface incompletely registered; F-2-12. |
| Downloads a reshaped CSV and a JSON record of each change. | 11 | Listed but inadequately proved; F-2-3. |
| Saves up to two recipient profiles in this browser. | 9 | Listed by profile claims. |
| A one-time US$19 purchase saves unlimited profiles. | 7 | Listed but inadequately proved; F-2-5. |
| The sample is separate from your saved profiles. | 8 | Listed by `demo-isolation`. |
| It uses the `demo:export-map` IndexedDB database. | 6 | Implementation detail; code confirms it. |
| Your real profiles use `export-map`. | 5 | Implementation detail; code confirms it. |
| See the demo guide. | 4 | Clear link sentence. |
| Run and test | 3 | Clear heading. |
| Node.js 20 or later is required. | 6 | Clear requirement. |
| Run every registered claim test from a clean state: | 9 | Misleading because nine commands fail; F-1-3. |
| Build with `npm run build`. | 5 | Clear instruction. |
| The static deployment artifact is `dist/`, with `index.html` at its root. | 11 | Clear deployment fact. |
| Static hosting must preserve `/privacy/`, `/terms/`, `/demo`, the service worker, and `staticwebapp.config.json`. | 12 | Clear deployment instruction. |
| Privacy and purchase | 3 | Clear heading. |
| The sample and normal CSV workflow make only same-origin requests. | 10 | Flag: normal workflow unlisted; F-2-6. |
| A pasted or returned license token is stored in browser localStorage. | 11 | Flag: unlisted claim; F-2-11. |
| The app checks a license with `api.sociobot.in` at most once per day while online. | 14 | Flag: unlisted quantitative claim; F-2-11. |
| Sociobot/Dodo hosts checkout and is the merchant of record. | 9 | Flag: unlisted claim; F-2-11. |
| See Privacy and Terms. | 4 | Clear links. |
| License | 1 | Clear heading. |
| MIT — see LICENSE. | 4 | Clear license notice. |

## Demo and sandbox evidence

- The first click opens `/demo` and immediately shows the banner, a completed **Check output** screen, three realistic invoice rows, delimiter conversion, six recipient columns, and ready downloads.
- Reset repopulates the sample. A real profile created before entering demo remained after reset and **Start for real**.
- Fresh-context IndexedDB listed separate `demo:export-map` and `export-map` databases.
- The complete live sample flow, including both downloads and reset, issued requests only to `https://small-business-export-map.sociobot.in`; there were no external requests.
- After a priming visit, live `/demo` reloaded offline with **Offline · local mode** and the completed result visible.
- The nonpersistent banner remains a blocking demo-contract defect (F-2-1).

## Claim command results

Fresh clone: `/tmp/export-map-review2.QO2Wo8`; logs: `/tmp/export-map-review2-claim-logs/`.

| Claim | Exact registry command | Result |
| --- | --- | --- |
| demo-isolation | `npm run test:e2e -- --grep @claim:demo-isolation` | **FAIL** — web server timeout |
| offline-demo | `npm run test:e2e -- --grep @claim:offline-demo` | **FAIL** — web server timeout |
| csv-manifest | `npm run test:e2e -- --grep @claim:csv-manifest` | **FAIL** — web server timeout |
| privacy-demo | `npm run test:e2e -- --grep @claim:privacy-demo` | **FAIL** — web server timeout |
| profile-persistence | `npm run test:e2e -- --grep @claim:profile-persistence` | **FAIL** — web server timeout |
| source-preservation | `npm run test:e2e -- --grep @claim:source-preservation` | **FAIL** — web server timeout |
| profile-limit | `npm run test:e2e -- --grep @claim:profile-limit` | **FAIL** — web server timeout |
| pro-checkout | `npm run test:e2e -- --grep @claim:pro-checkout` | **FAIL** — web server timeout |
| file-limit | `npm run test:e2e -- --grep @claim:file-limit` | **FAIL** — web server timeout |
| explicit-formatting | `npm run test:unit -- -t @claim:explicit-formatting` | PASS — 1 passed |

Secondary evidence only: after building, `npm test` passed 6 unit tests, the production build, and 13 Playwright tests. `npx tsc --noEmit` passed. This does not erase the exact-command failures or weak assertions.

## Structure, links, accessibility, and visual identity

- One h1, ordered headings, `<main>`, `lang`, descriptions, and route titles were present on `/`, `/demo`, `/privacy/`, `/terms/`, and the rendered missing route.
- Playwright Axe found zero serious or critical violations at 390 px on all five routes. There were no console or page errors.
- All ordinary internal route targets returned 200. Checkout returned 303 to `checkout.dodopayments.com`; the invalid-license endpoint returned `{"valid":false,"reason":"invalid"}`. The 404 status and missing-anchor defects are in F-1-10.
- Live CSP, Permissions-Policy, Referrer-Policy, nosniff, immutable hashed-JS caching, favicon assets, and the 1200×630 OG image were present.
- Application JavaScript is 30,281 bytes uncompressed (10.65 KB gzip in the build), below the budget.
- The warm paper, cobalt/coral risograph route artwork, hard offset shadows, serif display face, and print-room controls are product-specific. This does not look like a generic gradient/card SaaS template. Asset provenance is recorded in `.factory/design.md`.

## Earlier finding verification

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 demo | Fixed: one-click `/demo`, realistic completed data, reset/exit, separate DB. Persistence of the banner is a new F-2-1. |
| F-1-2 first-screen wording | Fixed: job, audience, and first action are clear at both widths. |
| F-1-3 claims | **Reopened:** registry exists, but nine exact commands fail clean and several assertions/claims remain incomplete. |
| F-1-4 checkout | Fixed for the earlier scope: live endpoint returned 303 to Dodo. Full entitlement proof is new F-2-5. |
| F-1-5 mobile clipping | Fixed: constrained/focusable preview, final Notes column reachable; mobile Axe passes. |
| F-1-6 invalid backup | Fixed in code with full validation before the transaction; regression test passed in the built suite. |
| F-1-7 long quoted field | Fixed for the reported fixture; 70,000-character quoted-cell unit test passed. |
| F-1-8 mobile workflow rail | Fixed: two-column mobile list, no serious/critical Axe result. |
| F-1-9 license token cache | Fixed: service worker bypasses license-query requests; regression test passed in the built suite. |
| F-1-10 metadata/404/navigation | **Reopened:** soft-404 status, route metadata, shared chrome, focus, missing anchor, and sitemap defects remain. |
| F-1-11 headers/cache | Fixed: live security headers, manifest MIME, and immutable hashed assets verified. |
| F-1-12 copy | The named phrases were removed. New residual terminology/action issues are F-2-14. |

## What would make this perfect

Make every registry command pass independently in a clean clone, strengthen each claim test to inspect the promised output, register every remaining visible claim, keep the demo warning visible throughout use, and deliver real route metadata/status/focus with one common header/footer. Then replace the remaining handoff/map/manifest jargon, disclose price on the first screen, and let users import an accountant's template headers without guessing semantics.

## Verdict

**FAIL.** There are 17 findings: four blocking (including two reopened earlier findings), ten major, and three minor. Nine claim tests fail as registered, required verification fails, the demo warning is not persistent, and routing still serves a soft 404 with incomplete route behavior. PASS requires zero findings and no untested claim.
