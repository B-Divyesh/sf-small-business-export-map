# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-28 at `https://small-business-export-map.sociobot.in/` in fresh Chromium at 390×844 and 1440×844. No product code changed.

## Cold first screen

Before scrolling I could only infer “probably prepare a CSV for an accountant, for a small-business owner; click **Check a CSV**.” This is a BLOCKING clarity failure: **“Make the handoff fit.”** names neither CSV, accountant, nor result, and the only action needs a file I do not have. At 390 px the workflow remains below the fold.

## Findings

### Blocking

#### F-1-1 — No one-click sample-data demo

**Evidence:** The only first action, **“Check a CSV,”** opens a file picker. The live landing and source have no **“Try it with sample data,” “Demo — sample data, nothing is saved,” “Reset demo,”** or **“Start for real.”** Fresh `/demo` and `/?demo=1` serve the regular app shell. `src/main.ts` has no demo data/state/storage namespace.

**Why:** A first visitor cannot try the job in one click, see a realistic result immediately, or know a trial cannot affect real profiles.

**Fix:** Put **“Try it with sample data”** beside the real action. `/demo`/`?demo=1` must load realistic CSV data, mapping, completed review and downloads with a persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. Use only `demo:` storage keys; document it in `.factory/demo.md`; test clean-context isolation.

#### F-1-2 — First-screen wording is unclear

**Evidence:** H1 **“Make the handoff fit.”** Hero **“Map your admin export to the columns, separators, and dates your accountant actually asked for—then send the CSV with a plain record of every change.”**

**Why:** “Handoff”/“fit” are metaphors. The support copy is 25 words (>22), has two actions, and uses “admin export.”

**Fix:** H1: **“Prepare CSVs for your accountant.”** Support: **“For small-business owners who need every CSV column, number, and date in the format their accountant requested.”** Actions: **“Try it with sample data — see a finished accountant handoff”** and **“Choose a CSV to prepare.”**

#### F-1-3 — No claims registry or claim tests

**Evidence:** `.factory/claims.json` is absent. Landing/README rely on **“Files stay here,” “Originals untouched,” “Works offline,” “No upload leaves this browser,”** and **“Export Map never overwrites it.”**

**Why:** There is no canonical claim list or `@claim:<id>` coverage; claims cannot be verified from the required demo entry point.

**Fix:** Add `claims.json` and clean-state tagged tests for each claim: offline demo reload, CSV/manifest content, source preservation, profile persistence, and request-log privacy. Remove untestable claims.

#### F-1-4 — US$19 checkout is broken

**Evidence:** Pro says **“Export Map Pro unlocks unlimited saved profiles for a one-time US$19 purchase.”** A clean request to its Buy Pro URL returned HTTP 404: `{"error":"enabled factory product","status":404}`.

**Why:** The visitor is invited to buy something unavailable. This confirms the earlier high-severity finding.

**Fix:** Enable/register the product and smoke-test checkout/return-token activation before showing it; otherwise remove price/purchase/unlimited claims.

#### F-1-5 — Mobile output is clipped

**Evidence:** Earlier verification measured a 622 px preview in a 358 px grid at 390 px, leaving columns 4–6 unreachable. Current CSS still has `.preview table{min-width:620px}` and no mobile `min-width:0` on the review child.

**Why:** A phone user cannot inspect every output field before download.

**Fix:** Constrain the grid child with `min-width:0`, keep overflow inside an accessible focusable preview, and test six columns at 390 px through the final cell.

#### F-1-6 — Invalid backup can destroy valid profiles

**Evidence:** Earlier verification showed a schema-1 profile with `id` but no `mappings` clears good IndexedDB data and later throws **“Cannot read properties of undefined (reading 'push')”.** Current code checks only schema/array before `replaceProfiles`; `db.ts` clears first.

**Why:** An “invalid” import can first erase saved data and break mapping.

**Fix:** Validate every profile/mapping before any write; reject atomically and retain the store. Test save-good → invalid import → reload.

#### F-1-7 — Valid quoted CSV can fail below 10 MB

**Evidence:** Earlier verification’s valid 70,014-byte CSV with a 70,000-character quoted cell produced **“A quoted field is not closed.”** `detectDelimiter` still parses `text.slice(0, 64_000)`, possibly inside quotes.

**Why:** The advertised **“Up to 10 MB”** limit does not describe files accepted.

**Fix:** Sample complete quoted records or tolerate an unfinished final sample field; add the fixture to unit and upload tests.

#### F-1-8 — Mobile workflow rail remains keyboard-inaccessible

**Evidence:** Earlier Axe found serious `scrollable-region-focusable` on `.route` at 390 px. Current `.route` remains `overflow:auto` without focus target/control.

**Why:** Keyboard visitors cannot inspect the clipped workflow.

**Fix:** Use a non-scrolling mobile list, or make it keyboard-focusable with accessible name and designed focus; run Axe on full mobile review.

#### F-1-9 — License token remains in Cache Storage

**Evidence:** Earlier verification found `?license=` values in `export-map-v1` cache keys. `sw.js` still caches `event.request` before `main.ts` can remove the query.

**Why:** A private token persists in a second browser store.

**Fix:** Bypass/normalize license-carrying navigations before caching and test Cache Storage keys.

### Minor

#### F-1-10 — Metadata, 404, and common navigation are incomplete

**Evidence:** `index.html` lacks canonical, OG, Twitter, apple-touch, and SVG/favicon metadata. Live `/favicon.ico` is 404. Unknown `/missing-review-route` returns the normal app, not a designed 404. Legal pages lack the common header/footer. Route-change focus/live announcement does not exist.

**Fix:** Add per-route metadata plus original 1200×630 OG art, favicon assets, designed 404, consistent Demo/Privacy/Terms header/footer, and deep-link/back focus tests.

#### F-1-11 — Deployment headers and cache policy are incomplete

**Evidence:** Live headers have no CSP/Permissions-Policy. Earlier verification found 30-second hashed-asset revalidation and octet-stream manifest; no `staticwebapp.config.json` exists.

**Fix:** Add accurate CSP, Permissions-Policy, MIME, immutable caching, and security-header configuration; verify live response headers.

#### F-1-12 — Copy has jargon, mood headings, and non-result buttons

**Evidence:** **“Private CSV preflight,” “Working table,” “Preflight a handoff,” “Keep every recipient route,” “Private, local-first export hygiene,”** and **“Get Pro”** are not plain section names or result verbs.

**Fix:** Use **“Check a CSV before sending it,” “CSV setup,” “Prepare your CSV,” “Saved recipient profiles,” “Private CSV preparation,”** and **“Buy unlimited profiles.”**

## Copy audit

Every visible initial landing sentence/statement and every README sentence follows. `!` means rewrite or claim test needed.

### Landing

| Copy | Words | Audit |
|---|---:|---|
| Private CSV preflight | 3 | ! Jargon → “Check a CSV before sending it”. |
| Make the handoff fit. | 4 | ! Metaphor → F-1-2 H1. |
| Map your admin export to the columns, separators, and dates your accountant actually asked for—then send the CSV with a plain record of every change. | 25 | ! >22/two ideas → F-1-2 support. |
| Check a CSV | 3 | ! Needs named sample result. |
| Files stay here / Originals untouched / Works offline | 3 / 2 / 2 | ! Privacy/preservation/offline claims; test. |
| From loose fields to a documented route. | 7 | ! Metaphor → “Artwork shows a CSV becoming a documented export.” |
| Original AI-assisted risograph artwork. | 4 | ! Decorative provenance; move to credit. |
| Open file / Choose recipient / Map fields / Review / Download | 2 / 2 / 2 / 1 / 1 | ! “fields” vague → “Choose CSV / Set recipient columns / Check output / Download files”. |
| Working table / Preflight a handoff | 2 / 3 | ! No useful meaning/jargon → “CSV setup” / “Prepare your CSV”. |
| No upload leaves this browser. | 5 | ! Privacy claim; request-log test. |
| Start with a copy of your source CSV; Export Map never overwrites it. | 12 | ! Preservation claim; test. |
| Choose or drop a CSV | 5 | “Choose a CSV file” is plainer. |
| Up to 10 MB · CSV or text | 7 | ! Limit/type claim; test. |
| Declare the recipient | 3 | ! Abstract → “Set your accountant's format”. |
| Explicitly prefix cells beginning =, +, or @ with an apostrophe for spreadsheet handoff. | 14 | ! Jargon → “Add an apostrophe before formulas for the downloaded CSV.” |
| Only assign a number or date format when the recipient has declared it. | 14 | “Use formatting only when your accountant specified it.” |
| Export Map never guesses accounting meaning. | 6 | ! Behavior claim; test. |
| Add the columns your recipient expects, or open a file and use its headers. | 14 | “Add required columns, or choose a CSV and copy its headers.” |
| Preview shows up to 8 rows. / Your full file is included in the download. | 6 / 8 | ! Quantitative/download claims; test. |
| Keep every recipient route | 4 | ! Mood heading → “Save more recipient profiles”. |
| The free version saves two recipient profiles and always includes CSV export, manifests, offline use, and profile backup. | 17 | ! Split/test each claim. |
| Export Map Pro unlocks unlimited saved profiles for a one-time US$19 purchase. | 13 | ! Checkout fails. |
| Sociobot/Dodo is the merchant of record. | 6 | ! Payment claim; test after checkout works. |
| Private, local-first export hygiene. | 4 | ! Slogan → “Prepare CSVs in this browser.” |
| Artwork generated for this product. | 5 | “Illustration generated for Export Map.” |

### README

| Sentence | Words | Audit |
|---|---:|---|
| Export Map is a private, offline-capable CSV preflight tool for owners of tiny businesses. | 14 | ! Jargon → plain first-screen copy. |
| It reshapes exports from invoicing, inventory, expense, and other admin tools to match the exact fields and locale conventions an accountant has requested—and produces a manifest of every change. | 28 | ! >22/two ideas; split. |
| Reads CSV files entirely in the browser; the source file is never uploaded or overwritten. | 15 | ! Privacy/preservation claims; test. |
| Detects comma, semicolon, tab, and pipe delimiters and handles quoted fields. | 11 | ! Behavior claim; long-quote test. |
| Saves recipient profiles locally in IndexedDB. | 6 | ! Persistence claim; test. |
| Maps, renames, orders, and requires recipient columns without inferring tax or accounting meaning. | 12 | ! Behavior claim; test. |
| Converts decimal marks and four explicit date formats only on columns the user marks as numbers or dates. | 18 | ! Count/behavior claim; test. |
| Shows validation errors, an output preview, affected counts, and a reverse instruction for each transformation. | 15 | ! Behavior claim; test. |
| Downloads the transformed UTF-8 CSV and a JSON handoff manifest containing the original file fingerprint. | 15 | ! Download claim; test. |
| Exports/imports recipient profiles as JSON and works after the network drops. | 10 | ! Backup/offline claim; invalid import destroys profiles. |
| The free tier includes the full preflight/export workflow and two saved profiles. | 11 | ! Jargon/count claim; test. |
| The one-time US$19 Pro unlock adds unlimited saved profiles through the Sociobot billing and license API. | 16 | ! Checkout 404. |
| No payment provider is embedded in this app. | 8 | ! Architecture claim; remove or test. |
| Requires Node.js 20 or later. | 6 | Setup instruction. |
| That command runs unit tests, builds the production app, and runs the Playwright workflow, accessibility, legal-page, and offline tests. | 18 | ! Misleading: no demo/claim tests. |
| Playwright 1.58.2 is pinned; if Chromium is not already present, run `npx playwright install chromium`. | 14 | Setup instruction. |
| The exact static deploy artifact is `dist/`, with `dist/index.html` at its root. | 14 | Deployment instruction. |
| Serve all files as static assets and preserve the `/privacy/` and `/terms/` directories. | 13 | ! Also require demo/404/security routes. |
| The service worker is scoped to `/` and requires HTTPS outside localhost. | 12 | ! Test/document cache privacy. |
| The factory registers the paid product separately. | 7 | ! Internal; currently broken checkout. |
| The frontend deliberately uses the slug-based URL …; it does not contain a provider product ID or secret. | 17 | ! Internal implementation detail; remove. |
| There are no analytics, ads, runtime CDNs, or hosted fonts. | 10 | ! Privacy claim; request-log test. |
| Active CSV contents live only in the current browser tab. | 10 | ! Privacy claim; test. |
| Recipient profiles live in IndexedDB; license tokens and their daily verification cache live in localStorage. | 13 | ! Incomplete: token also remains in Cache Storage. |
| The in-app profile export/import controls let users move or back up their data. | 15 | ! Backup claim; invalid import can destroy profiles. |
| The product-specific risograph system, tokens, interaction grammar, image prompt, review, and provenance are recorded in `.factory/design.md`. | 16 | Internal contributor detail; move to appendix. |
| The generated source artwork and prompt sidecars are retained in `assets/src/`; optimized WebP variants ship in `public/assets/`. | 15 | Internal contributor detail; move to appendix. |
| MIT — see LICENSE. | 3 | License notice. |

## Claims, sandbox, and history

`npm ci` completed with zero vulnerabilities. `npm test` passed: 5 unit tests, production build, and 4 Playwright tests. This is not claim acceptance evidence: no registry, `@claim:` test, or demo test exists. The existing offline test opens real `/`, not demo isolation. Fresh live first-load requests were same-origin app assets only, but cannot prove privacy across a missing demo.

No `review-*.md` or `polish-*.md` exists. The earlier verification/handoff defects are re-raised: checkout F-1-4, mobile preview F-1-5, import F-1-6, parser F-1-7, rail F-1-8, cache F-1-9, headers F-1-11. Code/live checks show none is fixed. The brief needs no decorative AI; the obvious missing leverage is the sample-data path.

## What would make this perfect

A phone visitor opens `/demo`, sees a realistic completed accountant handoff in one click, inspects every output field, resets without affecting real data, then chooses a real CSV. Every promise has a clean-state demo test, checkout works, bad backups cannot lose data, and all routes have metadata, navigation, security headers, and recovery.

## Verdict

**FAIL.** 12 findings, nine blocking. The product is neither tryable from the first screen nor demonstrably honest under the claims and demo requirements.
