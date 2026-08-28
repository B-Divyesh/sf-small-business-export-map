# Adversarial first-read review 3 — FAIL

Reviewed 2026-08-28 against `https://small-business-export-map.sociobot.in` in fresh Chromium contexts at 390×844 and 1440×900. Product code was not changed. Word counts treat hyphenated terms, numbers, URLs, and code spans as one word.

## Cold first screen, before scrolling

- **What it does:** prepares a CSV so its columns, numbers, and dates match an accountant's requested format.
- **For whom:** small-business owners preparing a file for an accountant.
- **What to click first:** **Try it with sample data**; it says the result is a finished CSV and change record. **Choose a CSV to prepare** is the real-data route.

This is clear at both widths. At 390 px the exact decisive copy — **“Prepare CSVs for your accountant.”**, **“For small-business owners who need every CSV column, number, and date in the format their accountant requested.”**, **“Try it with sample data”**, and its outcome note — is visible without scrolling. There is no first-screen clarity blocker.

## Findings

### Major

#### F-3-1 — The no-accounting-inference promise is an unlisted claim

**Exact locations:** landing mapping help, **“Export Map does not guess accounting meaning.”**; landing privacy summary, **“It does not upload your CSV, change the source file, or decide tax and accounting meaning.”**

**Evidence:** `.factory/claims.json` has no claim for this guarantee. `explicit-formatting` proves only selected `number` and `date` formatting. `core-format-matrix` also exercises user-declared formats; neither asserts that ambiguous headers or values never cause tax/accounting interpretation.

**Why this fails:** This is a material safety promise for financial records. A visitor may rely on it, yet no registered sandbox test would catch later automatic inference.

**Concrete fix:** Add a `no-accounting-inference` registry entry and tagged clean-state test. Load headers/values such as `VAT`, `Tax code`, and `20`; assert no accountant columns or types are created without explicit user action, and text-marked values remain unchanged. Or remove both promises.

### Minor

#### F-3-2 — One limitation sentence combines three independent promises

**Exact location:** **“It does not upload your CSV, change the source file, or decide tax and accounting meaning.”** (16 words)

**Why this fails:** It meets the word cap but breaks the one-idea-per-sentence rule. Privacy, source preservation, and accounting interpretation need separate evidence.

**Concrete fix:** Use three short lines: **“Your CSV is not uploaded.” “The original file is not changed.” “You choose the accounting meaning.”** Keep the first two linked to existing claims and add F-3-1’s test for the third.

#### F-3-3 — The purchase copy uses unexplained legal jargon

**Exact location:** landing purchase panel, **“Sociobot/Dodo is the merchant of record.”** (6 words)

**Why this fails:** “Merchant of record” does not tell a first-time owner who takes payment or handles a purchase problem.

**Concrete fix:** Replace it with **“Sociobot/Dodo takes payment and handles receipts and refunds.”** Add equivalent observable wording to `checkout-host`, or keep the legal term only in Terms with the plain sentence beside it.

#### F-3-4 — README privacy copy exposes browser/network implementation terms without a plain explanation

**Exact locations:** **“The sample is separate from real profiles. It uses the `demo:export-map` IndexedDB database; real profiles use `export-map`.”** and **“CSV preparation happens on the device and makes only same-origin requests.”**

**Why this fails:** `IndexedDB`, a storage-key name, and “same-origin” are developer terms. They make a privacy explanation harder to use for the small-business owner the README identifies.

**Concrete fix:** Replace the first with **“The sample uses separate browser storage, so it never changes saved profiles.”** Replace the second with **“Preparing a CSV does not send its contents anywhere.”** Keep database names in `.factory/demo.md` and the request-log proof behind the plain promise.

## Copy audit

No landing or README sentence exceeds 22 words. The tables list all meaningful visitor copy, including headings, labels, and controls; grouped select options appear once because each is only an option. No metaphor, slogan, banned marketing adjective, inconsistent product term, or non-result-naming button was found.

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
| A recipient profile remembers the columns and formats one accountant needs. | 11 | Defines “recipient profile.” |
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
| Export Map does not guess accounting meaning. | 7 | **Flag: F-3-1.** |
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
| It does not upload your CSV, change the source file, or decide tax and accounting meaning. | 16 | **Flags: F-3-1, F-3-2.** |
| One-time purchase | 2 | Clear section label. |
| Save unlimited recipient profiles | 4 | Clear heading. |
| The free version saves two profiles. | 6 | `profile-limit`. |
| Export Map Pro saves unlimited profiles for a one-time US$19 purchase. | 11 | `checkout-host`, `pro-license`. |
| License token | 2 | Clear label. |
| Restore purchase | 2 | `pro-license`. |
| Sociobot/Dodo is the merchant of record. | 6 | **Flag: F-3-3.** |
| US$19 | 1 | Concrete price. |
| Buy unlimited profiles | 3 | Result-naming action. |
| Prepare CSVs on this device. | 5 | `privacy-real-workflow`. |
| Built by Param Factory · build polish-2 | 7 | Useful provenance/build label. |

Select options: `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`, and `DD.MM.YYYY` are 1 word each; **Comma (,)** (2), **Semicolon (;)** (2), **Tab** (1), **Pipe (|)** (2), **Point (1.25)** (2), **Comma (1,25)** (2), **Text** (1), **Number** (1), **Date** (1), and **Not mapped** (2) are concise and consistent.

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Export Map | 2 | Product heading. |
| Prepare CSVs for your accountant. | 5 | Clear job sentence. |
| Export Map is for small-business owners who need requested columns and formats before sending a file. | 15 | Clear audience and result. |
| Try the finished sample at `https://small-business-export-map.sociobot.in/demo`. | 6 | Clear action. |
| What it does | 3 | Clear heading. |
| Shows a checked preview and downloads a prepared CSV with every source row. | 12 | `preview-full-download`, `csv-change-record`. |
| Downloads a JSON change record with the source fingerprint, checks, transformations, and reversal instructions. | 13 | `csv-change-record`; “source fingerprint” should use F-3-4’s plainer wording. |
| Supports comma, semicolon, tab, and pipe separators. | 7 | `core-format-matrix`. |
| Converts two decimal marks and four date formats only on columns you mark. | 13 | `explicit-formatting`, `core-format-matrix`. |
| Imports the ordered header row from an accountant’s CSV template. | 10 | `template-import`. |
| Saves two recipient profiles for free. | 7 | `profile-limit`. |
| A one-time US$19 purchase saves more profiles. | 8 | `checkout-host`, `pro-license`. |
| Exports and imports complete profile backups. | 6 | `profile-backup`. |
| The sample is separate from real profiles. | 7 | `demo-isolation`. |
| It uses the `demo:export-map` IndexedDB database; real profiles use `export-map`. | 8 | **Flag: F-3-4.** |
| Run and test | 3 | Clear heading. |
| Node.js 20 or later is required. | 6 | Clear developer requirement. |
| `npm test` runs unit, browser, accessibility, privacy, offline, build, and rendered-URL checks. | 10 | Clear verification instruction. |
| Every registered claim also has an exact command in `.factory/claims.json`. | 9 | Confirmed in this review. |
| Build with `npm run build`. | 5 | Clear instruction. |
| The static deployment artifact is `dist/`, with `index.html` at its root. | 11 | Clear deployment instruction. |
| Static hosting must preserve `/demo`, `/privacy/`, `/terms/`, `404.html`, the service worker, and `staticwebapp.config.json`. | 11 | Clear developer deployment instruction. |
| Privacy and purchase | 3 | Clear heading. |
| CSV preparation happens on the device and makes only same-origin requests. | 10 | **Flag: F-3-4.** |
| Profile data is stored in IndexedDB. | 6 | Translate alongside F-3-4. |
| A returned or pasted license token is stored in localStorage. | 10 | `pro-license`. |
| The app checks it with `api.sociobot.in` at most once daily. | 9 | `pro-license`. |
| Sociobot/Dodo hosts the US$19 one-time checkout. | 6 | `checkout-host`. |
| Deploy | 1 | Clear heading. |
| The factory deploys the static `dist/` directory. | 7 | Clear developer instruction. |
| License | 1 | Clear heading. |
| MIT — see `LICENSE`. | 4 | Clear license notice. |

## Demo, privacy, and claim evidence

- A fresh live `/demo` opens directly to a completed three-invoice result: six accountant columns, checked output, and both downloads are already present.
- At 390 px after scrolling to the workspace bottom, the demo banner remained at `top: 0`, `bottom: 88.625`; **Reset demo** and **Start for real** remained visible.
- Reset produced **“Sample reset. Your saved profiles were not changed.”** The fresh context contained only `demo:export-map` after this demo-only check.
- The live demo request log through both downloads and reset had only `https://small-business-export-map.sociobot.in` as an origin.
- After a priming visit and service-worker readiness, live `/demo` reloaded offline with **“Offline · local mode”**, the banner, and the completed download panel visible.
- Every exact command in `.factory/claims.json` passed from fresh clone `/tmp/export-map-review3.Rsvw0R`: all 17 claim IDs reported one passing test. `npm ci` reported zero vulnerabilities; `npx tsc --noEmit`, `npm run build`, and `npm run verify:url -- https://small-business-export-map.sociobot.in/` passed. The unit part of `npm test` reported 11/11 tests and the browser suite ran its 18 tests without a recorded failure.

## Structure, accessibility, links, and visual identity

- Live `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; a fresh unknown URL returned 404. Each route had one h1, a route-specific title, description, canonical, Open Graph/Twitter title and URL, SVG favicon, shared header/footer, and h1 focus after navigation.
- The live header supplied CSP, `X-Content-Type-Options`, Referrer-Policy, and Permissions-Policy. `sitemap.xml` lists all public routes. Internal crawl targets returned successfully; the live checkout is a 303 to Dodo and is checked by `checkout-host` without payment.
- Rendered URL verification passed title, language, main, h1, alt text, and console checks. Source browser tests cover Axe at 390 px for home, demo, privacy, terms, and 404, keyboard preview access, and 200% text. Independent live checks reported no console or page errors.
- The warm paper, cobalt/coral registration marks, hard paper-stack shadow, serif display type, and original risograph route collage match `.factory/design.md`; this is distinct from a generic SaaS template. Provenance is disclosed in the landing caption and design document.
- The brief does not imply AI: automatic accounting classification would violate its explicit no-inference constraint. Template import, CSV/change-record export, profile backup, offline use, and local storage are present, so no missed-leverage feature is outstanding.

## Earlier finding verification

| Earlier finding | Live and code confirmation |
| --- | --- |
| F-1-1 | Fixed: `/demo` is one click, immediately completed, isolated, resettable, and exits to real storage. |
| F-1-2 | Fixed: cold phone and desktop screens answer job, audience, and first action. |
| F-1-3 | Fixed: the 17 current registry commands pass from a clean clone. |
| F-1-4 | Fixed: checkout test verifies the 303, Dodo host, product, US$19, and one-time wording. |
| F-1-5 | Fixed: phone preview is a named focusable scroll region that reaches Notes. |
| F-1-6 | Fixed: invalid backup regression preserves a valid profile. |
| F-1-7 | Fixed: long quoted-field regression passes. |
| F-1-8 | Fixed: mobile route is not a keyboard-inaccessible horizontal rail. |
| F-1-9 | Fixed: `pro-license` verifies no returned token enters Cache Storage. |
| F-1-10 | Fixed: routes, metadata, shared chrome, focus, anchors, sitemap, and hard 404 hold live. |
| F-1-11 | Fixed: live security headers, manifest MIME, and cache policy are present. |
| F-1-12 | Fixed for reported wording; new wording issues are F-3-2 through F-3-4. |
| F-2-1 | Fixed: sticky demo warning and controls remain visible after scrolling. |
| F-2-2 | Fixed: rendered URL verifier passes live. |
| F-2-3 | Fixed: download test reads and validates CSV plus JSON content. |
| F-2-4 | Fixed: explicit-formatting tests typed and text-mapped values. |
| F-2-5 | Fixed: checkout and entitlement are separately tested. |
| F-2-6 | Fixed: real-file request-log test is registered and passes. |
| F-2-7 | Fixed: exact 10 MB acceptance and 10 MB + 1 rejection are tested. |
| F-2-8 | Fixed: formula protection covers `=`, `+`, and `@`. |
| F-2-9 | Fixed: eight-row preview and full download are registered. |
| F-2-10 | Fixed: backup round trip and demo/real separation are tested. |
| F-2-11 | Fixed: token storage, daily cache, restore, revoke, checkout host, and price are covered. |
| F-2-12 | Fixed: all advertised separators, decimal directions, date formats, rename, and reorder paths are registered. |
| F-2-13 | Fixed: price is a phone first-screen fact. |
| F-2-14 | Fixed for prior phrases/buttons; remaining wording is above. |
| F-2-15 | Fixed: local accountant-template header import is present and tested in its active namespace. |

## What would make this perfect

Register and prove no accounting inference, split the bundled limitation into short assurances, and translate the remaining legal/browser/network terms into user language. With zero unlisted claims, this would be ready for a PASS.

## Verdict

**FAIL.** There are four findings: one major unlisted safety claim and three minor plain-language issues. The end-to-end workflow, sandbox, privacy/offline behaviour, registered claims, routing, accessibility, and visual identity verify successfully, but PASS requires zero findings and no untested claim.
