# Adversarial first-read review 5 — FAIL

Reviewed 2026-08-29 at `https://small-business-export-map.sociobot.in` in fresh Chromium contexts at 390×844 and 1440×900, and from a clean local clone at `a2ae29b5fea8c48f376af916e8187aa1f27530a0`. No product code was changed. Word counts treat hyphenated terms, numbers, URLs, and code spans as one word.

## Cold first screen

Before scrolling, at both widths:

- **What it does:** prepares a CSV so its columns, numbers, and dates match the format an accountant requested.
- **For whom:** small-business owners who are preparing a CSV for their accountant.
- **What to click first:** **Try it with sample data**. The adjacent note says it opens a finished CSV and change record; **Choose a CSV to prepare** is the real-file route.

The decisive text is **“Prepare CSVs for your accountant.”**, **“For small-business owners who need every CSV column, number, and date in the format their accountant requested.”**, and **“Try it with sample data.”** At 390 px, the headline, audience sentence, both actions, their outcome note, and all three fact lines appeared before scrolling. This is not a clarity blocker.

## Finding

### Minor

#### F-5-1 — Twitter cards have no declared product image

**Location and exact evidence:** live `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404 each contain `twitter:card`, `twitter:title`, and `twitter:description`, but no `<meta name="twitter:image">`. Source confirms the omission in `index.html`, `demo/index.html`, `privacy/index.html`, `terms/index.html`, and `404.html`; each has only `og:image` pointing to `https://small-business-export-map.sociobot.in/assets/export-map-og.webp`.

**Why this matters:** the site-structure contract requires the Twitter card to include the real 1200×630 product image. Some consumers fall back to Open Graph, but that is not a declared Twitter-card image and makes sharing presentation dependent on platform fallback behavior.

**Concrete fix:** add `<meta name="twitter:image" content="https://small-business-export-map.sociobot.in/assets/export-map-og.webp">` to each of those five route documents. Extend the route metadata test to require `twitter:image` and verify the image is the product's 1200×630 asset.

## Copy audit

All landing and README sentences are at or below 22 words. No banned marketing adjective, mood heading, unexplained metaphor, inconsistent visitor term, or non-result-naming action was found. The complete audit follows; labels/options are included where they communicate an action or product state.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Clear action. |
| Export Map | 2 | Product name. |
| Demo | 1 | Clear route. |
| Prepare CSV | 2 | Clear route. |
| Privacy | 1 | Clear route. |
| Terms | 1 | Clear route. |
| Ready offline | 2 | `offline-demo`. |
| Check a CSV before sending it | 6 | Clear section label. |
| Prepare CSVs for your accountant. | 5 | Clear job headline. |
| For small-business owners who need every CSV column, number, and date in the format their accountant requested. | 17 | Clear audience and outcome. |
| Try it with sample data | 5 | Clear result-naming action. |
| Choose a CSV to prepare | 5 | Clear result-naming action. |
| The sample opens a finished CSV and change record. | 9 | `csv-change-record`. |
| Your real file stays on this device. | 7 | `privacy-real-workflow`. |
| Files stay on this device | 5 | `privacy-real-workflow`. |
| Works offline after first visit | 5 | `offline-demo`. |
| Free: two profiles · Pro: US$19 once | 7 | `profile-limit`, `checkout-host`, `pro-license`. |
| A paper collage shows a CSV becoming a documented accountant export | 10 | Useful image alt text. |
| Illustration generated for Export Map. | 5 | Asset provenance. |
| 1. Choose CSV | 3 | Clear step. |
| 2. Set accountant columns | 4 | Clear step. |
| 3. Check output | 3 | Clear step. |
| 4. Download files | 3 | Clear step. |
| CSV setup | 2 | Clear section label. |
| Prepare your CSV | 3 | Clear workspace heading. |
| Choose a file, state your accountant’s format, and check the output before downloading. | 13 | Useful instruction. |
| Choose your CSV | 3 | Clear heading. |
| Choose a CSV file | 4 | Clear action. |
| CSV or text file, up to and including 10 MB | 10 | `file-limit`. |
| Set your accountant’s format | 4 | Clear heading. |
| A recipient profile remembers the columns and formats one accountant needs. | 11 | Defines the product term. |
| Create recipient profile | 3 | Result-naming action. |
| Recipient profile name | 3 | Clear label. |
| Output separator | 2 | Clear label. |
| Source decimal mark | 3 | Clear label. |
| Output decimal mark | 3 | Clear label. |
| Source date format | 3 | Clear label. |
| Output date format | 3 | Clear label. |
| Protect formula-like values | 3 | Clear setting. |
| Add an apostrophe before values starting with =, +, or @ in the downloaded CSV. | 14 | `formula-protection`. |
| Save recipient profile | 3 | Result-naming action. |
| Delete profile | 2 | Result-naming action. |
| Export profiles | 2 | `profile-backup`. |
| Import profiles | 2 | `profile-backup`. |
| No saved recipients yet | 4 | Clear empty state. |
| 0 of 2 free recipient profiles saved on this device. | 10 | `profile-limit`, `profile-persistence`. |
| Set accountant columns | 3 | Clear heading. |
| Use formatting only when your accountant specified it. | 8 | `explicit-formatting`. |
| You choose the accounting meaning. | 5 | `no-accounting-inference`. |
| Add accountant column | 3 | Result-naming action. |
| Use source headers | 3 | Result-naming action. |
| Import accountant template | 3 | `template-import`. |
| Accountant column | 2 | Clear table label. |
| Source column | 2 | Clear table label. |
| Format | 1 | Clear table label. |
| Required | 1 | Clear table label. |
| Add required columns, copy your source headers, or import your accountant’s template. | 12 | Clear empty state. |
| Check output | 2 | Result-naming action. |
| How it works | 3 | Clear section heading. |
| Choose a CSV. | 3 | Clear step. |
| The file is read on this device. | 7 | `privacy-real-workflow`. |
| Set the requested format. | 4 | Clear step. |
| Name columns and choose separators, numbers, and dates. | 8 | `core-format-matrix`. |
| Check and download. | 3 | Clear step. |
| Review the CSV with a record of each change. | 9 | `csv-change-record`. |
| What Export Map does not do | 6 | Clear section heading. |
| Your CSV is not uploaded. | 5 | `privacy-real-workflow`. |
| The original file is not changed. | 6 | `source-preservation`. |
| One-time purchase | 2 | Clear section label. |
| Save unlimited recipient profiles | 4 | Clear heading. |
| The free version saves two profiles. | 6 | `profile-limit`. |
| Export Map Pro saves unlimited profiles for a one-time US$19 purchase. | 11 | `checkout-host`, `pro-license`. |
| License token | 2 | Clear label. |
| Restore purchase | 2 | Result-naming action; `pro-license`. |
| Sociobot/Dodo takes payment and handles receipts and refunds. | 8 | `checkout-host`. |
| US$19 | 1 | Concrete price. |
| Buy unlimited profiles | 3 | Result-naming action. |
| Prepare CSVs on this device. | 5 | `privacy-real-workflow`. |
| Built by Param Factory · build polish-4 | 7 | Build provenance. |

The compact selectors `Comma (,)`, `Semicolon (;)`, `Tab`, `Pipe (|)`, `Point (1.25)`, `Comma (1,25)`, `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`, `DD.MM.YYYY`, `Text`, `Number`, `Date`, and `Not mapped` are labels, not sentences; they are consistent and need no rewrite.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Export Map | 2 | Product heading. |
| Prepare CSVs for your accountant. | 5 | Clear job sentence. |
| Export Map is for small-business owners who need requested columns and formats before sending a file. | 15 | Clear audience and outcome. |
| Try the finished sample at `https://small-business-export-map.sociobot.in/demo`. | 6 | Clear action. |
| What it does | 3 | Clear heading. |
| Shows a checked preview and downloads a prepared CSV with every source row. | 12 | `preview-full-download`, `csv-change-record`. |
| Downloads a JSON change record with source details, checks, transformations, and reversal instructions. | 13 | `csv-change-record`. |
| Supports comma, semicolon, tab, and pipe separators. | 7 | `core-format-matrix`. |
| Converts two decimal marks and four date formats only on columns you mark. | 13 | `explicit-formatting`, `core-format-matrix`. |
| Imports the ordered header row from an accountant’s CSV template. | 10 | `template-import`. |
| Saves two recipient profiles for free. | 7 | `profile-limit`. |
| A one-time US$19 purchase saves more profiles. | 8 | `checkout-host`, `pro-license`. |
| Exports and imports complete profile backups. | 6 | `profile-backup`. |
| The sample uses separate browser storage, so it never changes saved profiles. | 11 | `demo-isolation`. |
| Node.js 20 or later is required. | 6 | Setup instruction. |
| `npm test` runs unit, browser, accessibility, privacy, offline, build, and rendered-URL checks. | 10 | Verified command description. |
| Every registered claim also has an exact command in `.factory/claims.json`. | 9 | Verified claims contract. |
| Build with `npm run build`. | 5 | Setup instruction. |
| The static deployment artifact is `dist/`, with `index.html` at its root. | 11 | Deployment instruction. |
| Static hosting must preserve `/demo`, `/privacy/`, `/terms/`, `404.html`, the service worker, and `staticwebapp.config.json`. | 11 | Deployment instruction. |
| Preparing a CSV does not send its contents anywhere. | 9 | `privacy-real-workflow`. |
| Saved profiles stay in this browser. | 6 | `profile-persistence`. |
| A returned or pasted license token is saved in this browser. | 11 | `pro-license`. |
| The app sends it to Sociobot for a check at most once daily. | 13 | `pro-license`. |
| Sociobot/Dodo hosts the US$19 one-time checkout. | 6 | `checkout-host`. |
| The factory deploys the static `dist/` directory. | 7 | Deployment instruction. |
| MIT — see `LICENSE`. | 4 | License notice. |

## Demo, claims, sandbox, and structure checks

- Fresh live `/demo` immediately displayed `august-invoices.csv`, its three prepared records, six mapped columns, checks, output preview, and both download controls. At 390 px, the first product screen after one click was the completed **Check output** state.
- The persistent banner was visible and said **“Demo — sample data, nothing is saved.”** It exposed **Reset demo** and **Start for real**. Reset restored the sample and reported **“Sample reset. Your saved profiles were not changed.”**
- In a fresh browser context, the demo request log contained only the product origin. A primed `/demo` reloaded offline (HTTP 200) with the banner, completed sample, and Download CSV control present.
- All 18 literal test commands in `.factory/claims.json` passed independently from clean clone `/tmp/export-map-review5-clean.cy2pz6/worktree` after `npm ci`: 15 Playwright claims and 3 Vitest claims. No claim test failed.
- Local `npm test` passed: 11 unit/contract tests, 19 Playwright tests, and the rendered URL self-test. `npx tsc --noEmit` and `npm run build` passed.
- Live `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; a fresh `/missing-review-5` returned the designed 404 with status 404. Each had one h1, a plain route title, description, canonical, Open Graph metadata, favicon, shared header/footer, skip link, and focus on the h1 after route navigation/back.
- Live Axe at 390 px found zero serious or critical findings on home, demo, Privacy, Terms, and 404. Console and page-error listeners were clean in normal navigation. All internal links and in-page anchors checked returned or targeted valid destinations; the external purchase link is covered by `checkout-host` and redirects to `checkout.dodopayments.com`.
- The warm paper surface, cobalt/coral hard registration treatment, serif display type, and original risograph collage match `.factory/design.md` and are distinct from a generic SaaS template.
- The brief explicitly forbids inference of ambiguous accounting semantics. Template import, backups, CSV/change-record downloads, and the isolated demo supply the useful implied leverage; an AI feature would be inappropriate here.

## Earlier-finding verification

| Earlier ID | Live and code check |
| --- | --- |
| F-1-1 | Fixed: `/demo` is one click, seeded, isolated in `demo:export-map`, resettable, and has an exit. |
| F-1-2 | Fixed: first screen gives job, audience, action, outcome, privacy, offline, and price in plain words. |
| F-1-3 | Fixed: 18 claims have exact tagged commands; all passed independently from a clean clone. |
| F-1-4 | Fixed: the US$19 checkout endpoint returned a 303 to hosted Dodo checkout. |
| F-1-5 | Fixed: the phone preview is a named focusable horizontal region that reaches the final column. |
| F-1-6 | Fixed: invalid backup is rejected before replacement; regression test keeps the good profile. |
| F-1-7 | Fixed: a 70,000-character quoted field parses; the exact 10 MB file test passes. |
| F-1-8 | Fixed: mobile workflow is not a trapped horizontal rail; scrollable data regions are named/focusable. |
| F-1-9 | Fixed: the pro-license test confirms the license return token is absent from Cache Storage. |
| F-1-10 | Fixed: live routes have physical metadata/chrome, h1 focus, valid links, sitemap entries, and a hard 404. |
| F-1-11 | Fixed: live headers include CSP, permissions policy, nosniff, referrer policy, and immutable hashed assets. |
| F-1-12 | Fixed: visitor copy uses CSV, accountant, recipient profile, output preview, and change record consistently. |
| F-2-1 | Fixed: the demo banner remained visible after scrolling the 390 px workspace. |
| F-2-2 | Fixed: the rendered URL verifier is part of `npm test` and passed. |
| F-2-3 | Fixed: `csv-change-record` reads both downloads and asserts transformed rows, hash, map, checks, changes, and reversibility. |
| F-2-4 | Fixed: `explicit-formatting` tests typed conversion alongside byte-preserved text. |
| F-2-5 | Fixed: checkout price/host and recorded valid/revoked entitlement are split and covered. |
| F-2-6 | Fixed: `privacy-real-workflow` logs the complete real CSV flow and rejects external/body-bearing requests. |
| F-2-7 | Fixed: `file-limit` accepts exactly 10 MB and rejects one byte more. |
| F-2-8 | Fixed: formula protection covers `=`, `+`, and `@` with both settings. |
| F-2-9 | Fixed: the eight-row preview and complete 11-row download are asserted. |
| F-2-10 | Fixed: profile export/import round-trips and remains separated in demo storage. |
| F-2-11 | Fixed: license storage, query removal, cache, restore, revocation, and hosted checkout have coverage. |
| F-2-12 | Fixed: the format matrix covers four separators, two decimal directions, four date formats, rename/order, and preview. |
| F-2-13 | Fixed: first screen visibly states `Free: two profiles · Pro: US$19 once`. |
| F-2-14 | Fixed: previous handoff/map/manifest jargon and noun-only action have been removed. |
| F-2-15 | Fixed: local accountant-template import preserves header order and active storage isolation. |
| F-3-1 | Fixed: `no-accounting-inference` proves ambiguous VAT/tax values stay text until user mapping. |
| F-3-2 | Fixed: the three limitations are split into distinct lines. |
| F-3-3 | Fixed: payment language explains payment, receipts, and refunds without `merchant of record`. |
| F-3-4 | Fixed: README privacy language says separate browser storage and does not lead with browser implementation jargon. |

## What would make this perfect

Declare the existing original social image explicitly as `twitter:image` on every route and add it to the route-metadata test. With that one structural repair, this review has no remaining finding.

## Verdict

**FAIL.** One minor finding remains. The product is clear, tryable, isolated, offline-capable after priming, visually distinct, and its registered claims pass, but PASS requires zero findings.
