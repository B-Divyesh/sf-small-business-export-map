# Adversarial first-read review 4 — FAIL

Reviewed 2026-08-28 against `https://small-business-export-map.sociobot.in` from fresh Chromium contexts at 390×844 and 1440×900, and against a clean clone at `39e6966e823785eb21ed2a7d50f0618d2d1dc076`. Product code was not changed. Word counts treat hyphenated terms, numbers, URLs, and code spans as one word.

## Cold first screen

Before scrolling, at both widths:

- **What it does:** prepares a CSV so its columns, numbers, and dates match the accountant's requested format.
- **For whom:** small-business owners preparing a file for their accountant.
- **What to click first:** **Try it with sample data**. It says that it opens a finished CSV and change record. **Choose a CSV to prepare** is the real-file path.

The decisive copy is **“Prepare CSVs for your accountant.”**, **“For small-business owners who need every CSV column, number, and date in the format their accountant requested.”**, and **“Try it with sample data.”** On the 390 px screen these, both actions, their outcome note, and the three fact lines were visible without scrolling. There is no first-screen clarity finding.

## Findings

### Blocking

#### F-3-1 — No-accounting-inference promise remains an unlisted claim

**Location and quote:** mapping help, **“Export Map does not guess accounting meaning.”**; privacy summary, **“It does not upload your CSV, change the source file, or decide tax and accounting meaning.”**

**Evidence:** This exact promise remains live and in `src/main.ts`. `.factory/claims.json` has no `no-accounting-inference` entry. The registered `explicit-formatting` and `core-format-matrix` tests prove explicit type conversion, but do not load ambiguous headers/values and assert that no tax or accounting classification is created without user action.

**Why this blocks:** A small-business owner may rely on this financial-safety promise. The required claims contract has no sandbox test that would catch a later regression into automatic inference.

**Concrete fix:** Add a `no-accounting-inference` claim and tagged clean-state test. Use headers and values such as `VAT`, `Tax code`, and `20`; assert no accountant columns or types appear until the user adds them and that text-marked values stay unchanged. Alternatively, remove both promises.

#### F-3-2 — The bundled limitation sentence remains unfixed

**Location and quote:** privacy summary, **“It does not upload your CSV, change the source file, or decide tax and accounting meaning.”** (16 words).

**Why this blocks:** This combines three independently important assurances—network privacy, source preservation, and accounting interpretation—in one sentence. A reader cannot see which proof applies to which promise, and the third has no registered proof (F-3-1).

**Concrete fix:** Replace it with three lines: **“Your CSV is not uploaded.” “The original file is not changed.” “You choose the accounting meaning.”** Keep the first two tied to their existing claims and add F-3-1's test for the last.

#### F-3-3 — Purchase copy still uses unexplained legal jargon

**Location and quote:** purchase panel, **“Sociobot/Dodo is the merchant of record.”**

**Why this blocks:** “Merchant of record” does not tell a first-time buyer who takes payment, provides a receipt, or handles a refund.

**Concrete fix:** Replace it with **“Sociobot/Dodo takes payment and handles receipts and refunds.”** Register that observable wording in `checkout-host`, or put the legal term only in Terms beside the plain explanation.

#### F-3-4 — README privacy copy still leads with unexplained implementation terms

**Location and quotes:** **“The sample is separate from real profiles. It uses the `demo:export-map` IndexedDB database; real profiles use `export-map`.”** and **“CSV preparation happens on the device and makes only same-origin requests.”**

**Why this blocks:** `IndexedDB`, a storage-key name, and “same-origin” are browser/developer terms, not usable privacy language for the README's stated audience.

**Concrete fix:** Replace the first with **“The sample uses separate browser storage, so it never changes saved profiles.”** Replace the second with **“Preparing a CSV does not send its contents anywhere.”** Keep the database name in `.factory/demo.md` and request-log implementation evidence outside reader-facing copy.

## Copy audit

No audited sentence exceeds 22 words. Apart from the four findings above, the landing copy uses consistent terms, headings name their sections, and actions name their results. Select options are grouped once because they are concise option labels rather than sentences.

### Landing page

| Copy | Words | Audit |
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
| For small-business owners who need every CSV column, number, and date in the format their accountant requested. | 17 | Clear audience and result. |
| Try it with sample data | 5 | Clear action. |
| Choose a CSV to prepare | 5 | Clear action. |
| The sample opens a finished CSV and change record. | 9 | `csv-change-record`. |
| Your real file stays on this device. | 7 | `privacy-real-workflow`. |
| Files stay on this device | 5 | `privacy-real-workflow`. |
| Works offline after first visit | 5 | `offline-demo`. |
| Free: two profiles · Pro: US$19 once | 7 | `profile-limit`, `checkout-host`, `pro-license`. |
| Illustration generated for Export Map. | 5 | Useful provenance. |
| 1. Choose CSV | 3 | Clear step. |
| 2. Set accountant columns | 4 | Clear step. |
| 3. Check output | 3 | Clear step. |
| 4. Download files | 3 | Clear step. |
| CSV setup | 2 | Clear section label. |
| Prepare your CSV | 3 | Clear workspace heading. |
| Choose a file, state your accountant’s format, and check the output before downloading. | 13 | Clear instruction. |
| Choose your CSV | 3 | Clear heading. |
| Choose a CSV file | 4 | Clear action. |
| CSV or text file, up to and including 10 MB | 10 | `file-limit`. |
| Set your accountant’s format | 4 | Clear heading. |
| A recipient profile remembers the columns and formats one accountant needs. | 11 | Defines the term. |
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
| Use formatting only when your accountant specified it. | 8 | `explicit-formatting`. |
| Export Map does not guess accounting meaning. | 7 | **F-3-1.** |
| Add accountant column | 3 | Result-naming action. |
| Use source headers | 3 | Result-naming action. |
| Import accountant template | 3 | `template-import`. |
| Add required columns, copy your source headers, or import your accountant’s template. | 12 | Clear empty state. |
| Accountant column | 2 | Clear table label. |
| Source column | 2 | Clear table label. |
| Format | 1 | Clear table label. |
| Required | 1 | Clear table label. |
| Check output | 2 | Result-naming action. |
| How it works | 3 | Clear heading. |
| Choose a CSV. | 3 | Clear step. |
| The file is read on this device. | 7 | `privacy-real-workflow`. |
| Set the requested format. | 4 | Clear step. |
| Name columns and choose separators, numbers, and dates. | 8 | `core-format-matrix`. |
| Check and download. | 3 | Clear step. |
| Review the CSV with a record of each change. | 9 | `csv-change-record`. |
| What Export Map does not do | 6 | Clear heading. |
| It does not upload your CSV, change the source file, or decide tax and accounting meaning. | 16 | **F-3-1, F-3-2.** |
| One-time purchase | 2 | Clear section label. |
| Save unlimited recipient profiles | 4 | Clear heading. |
| The free version saves two profiles. | 6 | `profile-limit`. |
| Export Map Pro saves unlimited profiles for a one-time US$19 purchase. | 11 | `checkout-host`, `pro-license`. |
| License token | 2 | Clear label. |
| Restore purchase | 2 | `pro-license`. |
| Sociobot/Dodo is the merchant of record. | 6 | **F-3-3.** |
| US$19 | 1 | Concrete price. |
| Buy unlimited profiles | 3 | Result-naming action. |
| Prepare CSVs on this device. | 5 | `privacy-real-workflow`. |
| Built by Param Factory · build polish-2 | 7 | Useful provenance/build label. |

Options: `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`, `DD.MM.YYYY` (one word each); `Comma (,)` (2), `Semicolon (;)` (2), `Tab` (1), `Pipe (|)` (2), `Point (1.25)` (2), `Comma (1,25)` (2), `Text` (1), `Number` (1), `Date` (1), and `Not mapped` (2) are concise and consistent.

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Export Map | 2 | Product heading. |
| Prepare CSVs for your accountant. | 5 | Clear job sentence. |
| Export Map is for small-business owners who need requested columns and formats before sending a file. | 15 | Clear audience and result. |
| Try the finished sample at `https://small-business-export-map.sociobot.in/demo`. | 6 | Clear action. |
| What it does | 3 | Clear heading. |
| Shows a checked preview and downloads a prepared CSV with every source row. | 12 | `preview-full-download`, `csv-change-record`. |
| Downloads a JSON change record with the source fingerprint, checks, transformations, and reversal instructions. | 13 | `csv-change-record`. |
| Supports comma, semicolon, tab, and pipe separators. | 7 | `core-format-matrix`. |
| Converts two decimal marks and four date formats only on columns you mark. | 13 | `explicit-formatting`, `core-format-matrix`. |
| Imports the ordered header row from an accountant’s CSV template. | 10 | `template-import`. |
| Saves two recipient profiles for free. | 7 | `profile-limit`. |
| A one-time US$19 purchase saves more profiles. | 8 | `checkout-host`, `pro-license`. |
| Exports and imports complete profile backups. | 6 | `profile-backup`. |
| The sample is separate from real profiles. | 7 | `demo-isolation`. |
| It uses the `demo:export-map` IndexedDB database; real profiles use `export-map`. | 8 | **F-3-4.** |
| Run and test | 3 | Clear heading. |
| Node.js 20 or later is required. | 6 | Developer requirement. |
| `npm test` runs unit, browser, accessibility, privacy, offline, build, and rendered-URL checks. | 10 | Verified developer instruction. |
| Every registered claim also has an exact command in `.factory/claims.json`. | 9 | Verified in this review. |
| Build with `npm run build`. | 5 | Clear instruction. |
| The static deployment artifact is `dist/`, with `index.html` at its root. | 11 | Clear deployment instruction. |
| Static hosting must preserve `/demo`, `/privacy/`, `/terms/`, `404.html`, the service worker, and `staticwebapp.config.json`. | 11 | Clear deployment instruction. |
| Privacy and purchase | 3 | Clear heading. |
| CSV preparation happens on the device and makes only same-origin requests. | 10 | **F-3-4.** |
| Profile data is stored in IndexedDB. | 6 | Same implementation-language issue as F-3-4. |
| A returned or pasted license token is stored in localStorage. | 10 | `pro-license`. |
| The app checks it with `api.sociobot.in` at most once daily. | 9 | `pro-license`. |
| Sociobot/Dodo hosts the US$19 one-time checkout. | 6 | `checkout-host`. |
| Deploy | 1 | Clear heading. |
| The factory deploys the static `dist/` directory. | 7 | Developer instruction. |
| License | 1 | Clear heading. |
| MIT — see `LICENSE`. | 4 | Clear notice. |

## Demo, claims, privacy, and structure verification

- Fresh live `/demo` immediately displayed the completed three-record `august-invoices.csv` output, six accountant columns, checks, output preview, and both downloads. The persistent banner said **“Demo — sample data, nothing is saved.”** and exposed **Reset demo** and **Start for real**. Reset reported **“Sample reset. Your saved profiles were not changed.”**
- A fresh live demo context contained only `demo:export-map` in IndexedDB. The observed full sample/reset request log contained only `https://small-business-export-map.sociobot.in`; no console or page errors occurred.
- Clean clone: `npm ci` reported zero vulnerabilities. Every literal command in the 17-entry registry was run from the clone. All 14 Playwright claim tests and all 3 Vitest claim tests passed. The aggregate browser claim run reported 14 passing tests; `npm run test:unit -- -t @claim` reported 3 passing tests.

| Claim ID | Result |
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
| `explicit-formatting` | PASS |
| `formula-protection` | PASS |
| `core-format-matrix` | PASS |
| `preview-full-download` | PASS |
| `profile-backup` | PASS |
| `checkout-host` | PASS |
| `pro-license` | PASS |
| `template-import` | PASS |

- Live `/`, `/demo`, `/?demo=1`, `/privacy/`, and `/terms/` returned 200. A fresh unknown route returned a designed 404. Each checked route had a route-specific title, one h1, description, canonical, Open Graph/Twitter metadata, shared header/footer, and focus on its h1 after navigation. Back returned from Terms to Privacy and restored focus to the Privacy h1.
- Header checks found CSP, `X-Content-Type-Options`, Referrer-Policy, and Permissions-Policy. The checkout link returned a 303 to `checkout.dodopayments.com`. The live normal-route console was clean; the deliberate 404 navigation logged the browser's expected failed-resource notice for its HTTP 404 response.
- The warm paper ground, cobalt/coral registration marks, hard paper shadows, serif display face, and original risograph collage match `.factory/design.md` and are distinct from a generic SaaS template.
- The brief explicitly prohibits inferred accounting semantics. An AI classification feature would violate that constraint; template import, exports, backups, offline use, and the sandbox already supply the implied leverage. No AI feature is expected.

## Earlier finding verification

All review 1 and 2 findings verify fixed in live behaviour and code: sample entry/isolation, first-screen clarity, independently runnable registry commands, checkout redirect, accessible phone preview, atomic backup rejection, long quoted CSV parsing, mobile route access, license-query cache handling, real routes/metadata/focus/404, headers/cache policy, sticky demo banner, rendered verification, complete downloads, explicit formatting, entitlement, real-file privacy, exact file limit, formula protection, preview/full download, backup round trip, paid flow, format matrix, first-screen price, plain action labels, and accountant-template import.

The four review 3 findings are not fixed. Per the review instruction they are reopened above as blocking with their original IDs: **F-3-1, F-3-2, F-3-3, and F-3-4.**

## What would make this perfect

Register and prove the no-inference safety guarantee, split the three bundled limitations, explain payment responsibility in ordinary language, and move browser/network implementation details out of reader-facing README privacy copy. After those four changes and their tests, there would be no finding left in this review.

## Verdict

**FAIL.** The product is clear, tryable, isolated, and substantially verified, but it has four reopened blocking findings and PASS requires zero findings and no untested claim.
