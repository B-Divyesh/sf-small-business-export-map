# Export Map v1 handoff

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
