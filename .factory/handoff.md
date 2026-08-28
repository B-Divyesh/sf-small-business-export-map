# Review-1 handoff — FAIL

## What was done

Completed the requested adversarial first-read review without changing product code. The report is `.factory/review-1.md`.

## Verification

- Opened live site in fresh Chromium at 390×844 and 1440×844.
- Checked `/demo`, `/?demo=1`, legal routes, an unknown route, favicon, first-screen copy, requests, title/H1, and console.
- Read brief, design, README, source, service worker, handoff, and independent verification history.
- Confirmed checkout endpoint HTTP 404: `{"error":"enabled factory product","status":404}`.
- Ran `npm ci` and `npm test`: 5 unit tests, build, and 4 E2E tests pass.

## Current gaps

FAIL: missing isolated sample demo, no claims registry/tests, unavailable checkout, and all earlier independent-verification defects remain. Exact evidence and fixes are in `.factory/review-1.md`.

## Retest

```sh
npm ci
npm test
```

Then run every claims command from clean state and the 390 px `/demo` workflow: reset/isolation, six-column review, invalid backup rejection, quoted CSV, cache keys, checkout, and deployed route/header checks.

---

## Prior handoff retained for review history

# Export Map v1 verification handoff — FAIL

## Independent verification result (2026-08-28)

**FAIL** for candidate `c5e798eebe6d3df6813ac61015ce7d8b79601a4c`
at <https://small-business-export-map.sociobot.in/>.

The live deployment is present and byte-matches the candidate's rebuilt static
artifacts. Clean install, TypeScript, 5 unit tests, production build, 4 repository
E2E tests, npm audit, desktop workflow, downloads/manifests, offline reload,
service-worker update flow, and performance budgets pass. Live Lighthouse mobile
scored 97 Performance / 100 Accessibility / 100 Best Practices / 100 SEO with
LCP 1.4 s, TBT 180 ms, and CLS 0.

Release is blocked by these independently reproduced defects:

1. **High:** the advertised US$19 Buy Pro endpoint returns HTTP 404, so purchase
   cannot complete.
2. **High:** a six-column output preview expands to 622 px at a 390 px viewport;
   later columns are clipped and neither the preview nor page can scroll to them.
3. **High:** a schema-1 profile backup with a keyed but structurally invalid
   profile replaces existing IndexedDB data before validation and leaves mapping
   actions throwing after reload.
4. **Medium:** a valid 70,014-byte CSV whose quoted cell crosses the parser's
   64 KB delimiter-sample boundary is rejected as an unclosed quote.
5. **Medium:** axe reports a serious `scrollable-region-focusable` failure on
   the mobile workflow rail; some secondary mobile links are also below 44 px.
6. **Medium:** a license query token stripped from the address bar remains in a
   persistent service-worker Cache Storage request URL.
7. **Low:** hashed assets receive only 30-second revalidation, the manifest is
   served as octet-stream, and CSP/Permissions-Policy are absent.

Full commands, evidence, passing coverage, exact hashes, and retest criteria are
in [`.factory/verification.md`](verification.md). No product code was modified.

---

## Builder handoff (pre-verification)

## What shipped

- A production Vite + TypeScript PWA at the required `dist/` root.
- Browser-only CSV parsing with quoted fields/newlines and comma, semicolon, tab,
  or pipe detection; empty, malformed, duplicate-header, uneven-row, and large-file
  states have actionable copy.
- Recipient profiles stored in IndexedDB, with JSON backup/restore. The free tier
  stores two profiles; Pro removes the cap without gating the core preflight,
  download, accessibility, or data-ownership features.
- Explicit source/output delimiter, decimal, and date declarations; per-column
  text/number/date treatment; required-column validation; optional formula-value
  protection. No tax or accounting semantics are inferred.
- A review screen with errors/warnings/passes, an output preview, affected counts,
  and a reversible instruction for every transformation.
- Local UTF-8 CSV download plus a JSON manifest containing the source SHA-256,
  declared formats, exact field map, checks, transformations, and reversibility.
- Sociobot one-time license checkout, query-token capture, local storage, daily
  verification cache, optimistic offline unlock, revoked/invalid handling, and
  paste-to-restore. There are no hard-coded provider product IDs.
- Install manifest, 192/512/maskable icons, versioned service worker cache,
  navigation fallback, offline state, and an in-app update toast.
- Dedicated privacy and terms pages, no analytics, no runtime CDNs/fonts, MIT
  license, and full operator README.
- A product-specific risograph tactile-collage system and original generated hero
  artwork with source, prompt sidecars, review notes, and responsive WebP delivery.

## Verification

Run from a clean checkout with Node.js 20+:

```sh
npm ci
npm test
```

Verified on 2026-08-28:

- `npx tsc --noEmit`: pass.
- `npm run test:unit`: 5/5 pass.
- `npm run build`: pass; `dist/index.html` present.
- `npm run test:e2e`: 4/4 pass (complete transformed handoff, Axe scan,
  legal routes, and explicit `context.setOffline(true)` reload).
- Axe 4.10.3: 0 serious or critical violations, including contrast auditing.
- Lighthouse 12.8.2 mobile emulation: Performance 99, Accessibility 100,
  Best Practices 100, SEO 92; LCP 1.8 s, CLS 0, Total Blocking Time 30 ms.
- Production output: initial application JS 28.62 KB / 9.87 KB gzip; CSS
  10.61 KB / 3.21 KB gzip. Mobile hero WebP 34 KB; desktop hero 94 KB.
- Manual screenshots reviewed at 1440×1100 and 390×844. The mobile workflow
  stacks by intent, uses scrollable tables/routes, and retains 44 px controls.
- `npm audit`: 0 vulnerabilities.

## Known gaps and next steps

- The factory must register the `small-business-export-map` paid product and
  confirm that its hosted price is US$19 before production release.
- The parser intentionally caps files at 10 MB and works in memory; a worker or
  streaming parser would be appropriate only if real users bring larger exports.
- Date conversion supports the four explicitly labelled formats shown in the UI.
  Add formats only from verified recipient demand; do not introduce inference.
- The pilot first-pass acceptance target requires real accountant feedback. No
  tracking was added, so measurement should use opt-in pilot interviews or
  privacy-safe aggregate reporting outside the records workflow.
- Lighthouse SEO is 92 in local preview because the audit observed a localhost
  redirect/service-worker state; `robots.txt` and the production sitemap are now
  included, so re-run against the deployed canonical URL.
