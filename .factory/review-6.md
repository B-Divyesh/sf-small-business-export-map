# Adversarial first-read review 6 — PASS

Reviewed 2026-08-29 against `https://small-business-export-map.sociobot.in/` from fresh Chromium contexts at 390×844 and 1440×1000. No product code was changed.

## Cold first screen

Before scrolling, the product was clear at both widths:

- **What it does:** prepares a CSV in the columns, number format, and date format an accountant requested, then produces the CSV and a change record.
- **For whom:** small-business owners handing a CSV to their accountant.
- **First click:** **Try it with sample data**; its adjacent explanation says it opens a finished CSV and change record. The real-data alternative is **Choose a CSV to prepare**.

The 390 px first screen contains the headline, audience, both actions, what the sample opens, device/offline facts, and price fact without scrolling. The print-room collage, paper/ink palette, purposeful registration marks, and editorial type are product-specific rather than a generic SaaS template.

## Demo and sandbox

`/demo` opened in one click to an already-completed, realistic three-invoice CSV (`august-invoices.csv`), mapped accountant columns, checks, transformations, output preview, and both downloads. The persistent visible banner read **“Demo — sample data, nothing is saved.”** and included **Reset demo** and **Start for real**. After scrolling the banner remained at `y=11.6` at 390 px. Reset restored the sample and displayed **“Sample reset. Your saved profiles were not changed.”**

The fresh demo context created both `demo:export-map` and `export-map` databases, while the completed demo used only the demo namespace. Its request log contained only the site origin. The independent isolation claim test additionally saves a real profile, resets demo, exits, and verifies the real profile remains unchanged.

## Claims

I read `.factory/claims.json`, made a new local clone at `/tmp/export-map-review6.4EDj64`, ran `npm ci`, and ran every literal registered command independently. All 18 passed.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `offline-demo` | PASS |
| `csv-change-record` | PASS |
| `privacy-demo` | PASS |
| `privacy-real-workflow` | PASS |
| `profile-persistence` | PASS |
| `source-preservation` | PASS |
| `file-limit` | PASS |
| `profile-limit` | PASS |
| `no-accounting-inference` | PASS |
| `explicit-formatting` | PASS |
| `formula-protection` | PASS |
| `core-format-matrix` | PASS |
| `preview-full-download` | PASS |
| `profile-backup` | PASS |
| `checkout-host` | PASS |
| `pro-license` | PASS |
| `template-import` | PASS |

The privacy claim tests use request logs for both demo and real-file flows. The offline claim primes `/demo`, takes the context offline, reloads, and verifies the completed sample. No landing or README operational claim was found without a corresponding registered claim: the generation figcaption is asset provenance, documented in `.factory/design.md`, rather than a product-behaviour promise.

## Copy audit

Counts use whitespace-separated words; labels, field names, headings, and buttons without sentence content were separately checked. No sentence exceeds 22 words. No jargon, marketing adjective, inconsistent product term, information-free heading, or non-result-naming button was found. The non-sentence controls use result verbs: **Try it with sample data**, **Choose a CSV to prepare**, **Check output**, **Download CSV**, **Download change record**, and **Buy unlimited profiles**.

### Landing sentences and statements

| Copy | Words |
| --- | ---: |
| Prepare CSVs for your accountant. | 5 |
| For small-business owners who need every CSV column, number, and date in the format their accountant requested. | 17 |
| The sample opens a finished CSV and change record. | 9 |
| Your real file stays on this device. | 7 |
| Illustration generated for Export Map. | 5 |
| Choose a file, state your accountant’s format, and check the output before downloading. | 13 |
| CSV or text file, up to and including 10 MB | 10 |
| A recipient profile remembers the columns and formats one accountant needs. | 11 |
| Add an apostrophe before values starting with =, +, or @ in the downloaded CSV. | 14 |
| Use formatting only when your accountant specified it. | 8 |
| You choose the accounting meaning. | 5 |
| Add required columns, copy your source headers, or import your accountant’s template. | 12 |
| Preview shows no more than eight rows. | 7 |
| The downloaded CSV contains every row. | 6 |
| The file is read on this device. | 7 |
| Name columns and choose separators, numbers, and dates. | 8 |
| Review the CSV with a record of each change. | 9 |
| Your CSV is not uploaded. | 5 |
| The original file is not changed. | 6 |
| The free version saves two profiles. | 6 |
| Export Map Pro saves unlimited profiles for a one-time US$19 purchase. | 11 |
| Sociobot/Dodo takes payment and handles receipts and refunds. | 8 |
| Prepare CSVs on this device. | 5 |
| Demo — sample data, nothing is saved. | 7 |
| Sample profile only. | 3 |
| Nothing is saved to your profiles. | 6 |
| Sample reset. | 2 |
| Your saved profiles were not changed. | 6 |
| Read august-invoices.csv in this browser. | 6 |
| Set the recipient columns next. | 5 |
| 3 rows match the accountant’s columns and formats. | 8 |
| To reverse: Use each source and accountant column pair in reverse. | 11 |
| Download the prepared CSV and the JSON record of every change. | 11 |

### README sentences and statements

| Copy | Words |
| --- | ---: |
| Prepare CSVs for your accountant. | 5 |
| Export Map is for small-business owners who need requested columns and formats before sending a file. | 16 |
| Try the finished sample at `https://small-business-export-map.sociobot.in/demo`. | 6 |
| Shows a checked preview and downloads a prepared CSV with every source row. | 12 |
| Downloads a JSON change record with source details, checks, transformations, and reversal instructions. | 13 |
| Supports comma, semicolon, tab, and pipe separators. | 7 |
| Converts two decimal marks and four date formats only on columns you mark. | 13 |
| Imports the ordered header row from an accountant’s CSV template. | 10 |
| Saves two recipient profiles for free. | 6 |
| A one-time US$19 purchase saves more profiles. | 8 |
| Exports and imports complete profile backups. | 6 |
| The sample uses separate browser storage, so it never changes saved profiles. | 11 |
| Node.js 20 or later is required. | 6 |
| `npm test` runs unit, browser, accessibility, privacy, offline, build, and rendered-URL checks. | 10 |
| Every registered claim also has an exact command in `.factory/claims.json`. | 10 |
| Build with `npm run build`. | 4 |
| The static deployment artifact is `dist/`, with `index.html` at its root. | 11 |
| Static hosting must preserve `/demo`, `/privacy/`, `/terms/`, `404.html`, the service worker, and `staticwebapp.config.json`. | 12 |
| Preparing a CSV does not send its contents anywhere. | 9 |
| Saved profiles stay in this browser. | 6 |
| A returned or pasted license token is saved in this browser. | 11 |
| The app sends it to Sociobot for a check at most once daily. | 13 |
| Sociobot/Dodo hosts the US$19 one-time checkout. | 6 |
| The factory deploys the static `dist/` directory. | 6 |
| MIT — see [LICENSE](../LICENSE). | 3 |

## Structure, routing, and accessibility

Live `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; a fresh unknown route returned a designed 404. Each checked route had one `h1`, one `main`, `lang=en`, a route-specific title, plain meta description, canonical URL, Open Graph image, Twitter image, favicon, shared header/footer, skip link, and Privacy/Terms links. The home title is **“Export Map — prepare CSVs for your accountant”**; Demo, Privacy, Terms, and 404 also followed the required route title pattern.

All internal links crawled successfully. The purchase endpoint is the registered Sociobot URL and its claim test confirms its redirect to Dodo without attempting payment. Route changes move focus to the page `h1` and use the polite route announcer. Live Axe scans found no serious or critical findings on home, demo, privacy, terms, or 404. Normal routes had no console or page errors. The response headers included CSP with response-header `frame-ancestors`, nosniff, Referrer-Policy, and Permissions-Policy.

## Earlier findings rechecked

I read every prior `review-*.md`, `polish-*.md`, and handoff. The following are confirmed fixed in both current code and live behaviour; none is merely marked fixed.

| Earlier finding(s) | Current verification |
| --- | --- |
| F-1-1, F-2-1 | `/demo` is one-click, seeded and completed, isolated, resettable, and retains its banner on mobile scroll. |
| F-1-2, F-2-13, F-2-14 | The cold screen names job, audience, outcome, first action, and price in plain consistent terms. |
| F-1-3, F-2-3 through F-2-12, F-2-15 | All 18 registered commands passed from a fresh clone; their observable coverage includes downloads, formats, privacy, limits, backup, license, checkout, and template import. |
| F-1-4, F-2-5 | The registered checkout-host test passed and verifies the hosted Dodo redirect and US$19 wording. |
| F-1-5, F-1-8 | The phone preview/mapping regions are named keyboard-scrollable regions; mobile Axe has no serious/critical issue. |
| F-1-6, F-1-7 | Tests verify invalid backup rejection before replacement and quoted-field / inclusive 10 MB handling. |
| F-1-9, F-2-11 | The license test verifies return-URL cleanup, daily checking, revocation, and absence of the token from Cache Storage. |
| F-1-10, F-2-2 | Live physical routes, route metadata, focus announcement, shared chrome, sitemap, crawler results, hard 404, and rendered URL verification all pass. |
| F-1-11 | Live security, MIME, and cache headers are present. |
| F-3-1, F-3-2 | The copy separates upload, source-file, and accounting-choice promises; `no-accounting-inference` passes. |
| F-3-3 | Purchase wording names payment, receipts, and refunds without legal shorthand. |
| F-3-4 | README privacy explanations use ordinary browser wording before technical details. |
| F-5-1 | Every checked route declares the product’s 1200×630 Open Graph and `twitter:image` asset. |

## Verification

- Fresh-clone `npm ci`: passed with 0 reported vulnerabilities.
- All 18 exact claim commands: passed independently.
- Current checkout: `npm test` passed (11 Vitest tests and 19 Playwright tests); `npm run build` produced `dist/`; `npm run verify:url -- https://small-business-export-map.sociobot.in/` passed.
- Cold live request logs: only same-origin traffic for the demo flow; no console errors on normal routes.

## What would make this perfect

No required product change remains. Keep the claim suite and the cold `/demo` smoke check in the release process so the proven privacy, offline, and sandbox behaviours do not regress.

## Verdict

**PASS.** There are zero blocking or minor findings and no untested registered claim.
