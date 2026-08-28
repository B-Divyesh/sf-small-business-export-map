# Polish 1 — finding closure

Candidate repaired: `c5e798eebe6d3df6813ac61015ce7d8b79601a4c`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added `/demo` and `?demo=1`, a three-invoice completed handoff, `demo:export-map` storage, banner, reset, and Start for real. Demo layout puts the completed check before setup. | `@claim:demo-isolation`; `demo-390.png`; live `/demo` cold check |
| F-1-2 | Rewrote the first screen with the required CSV/accountant job headline, audience sentence, sample action, real action, and plain facts. | `landing-1440.png`; `copy-audit.md` |
| F-1-3 | Added `claims.json`, tagged clean-state tests, and claim-run instructions. | `npm run test:e2e`; individual `@claim:*` runs |
| F-1-4 | Kept the approved production Sociobot checkout URL; tested its live 303 redirect to Dodo and the invalid-license API verdict. | `@claim:pro-checkout`; production `verify?license=invalid-smoke-token` returned `{"valid":false,"reason":"invalid"}` |
| F-1-5 | Constrained the mobile review child and made the preview a labelled, focusable horizontal scroll region. | mobile six-column Playwright/Axe test; `demo-390.png` |
| F-1-6 | Validates all imported profile and mapping fields before the replacement transaction; write completion is now transactional. | `rejects an invalid backup atomically` |
| F-1-7 | Delimiter sampling now ends on a complete non-quoted record and uses the file if necessary. | CSV unit long-quoted-field test |
| F-1-8 | Replaced the mobile horizontal workflow rail with a visible two-column list. | mobile Axe test: zero serious/critical |
| F-1-9 | Service worker bypasses license query navigations and normalizes navigation cache keys. | `strips a return token without putting it in Cache Storage` |
| F-1-10 | Added route titles, canonical/OG/Twitter metadata, SVG/ICO/apple favicons, generated 1200×630 social crop, legal navigation/footer, and designed 404. | `legal routes have titles and common navigation`; live `/missing-review-route` → `Page not found — Export Map` |
| F-1-11 | Added static host CSP, Permissions-Policy, MIME, immutable asset caching, and 404 response override configuration. | live header check: CSP/Permissions-Policy present; JS `max-age=31536000, immutable`; manifest `application/manifest+json` |
| F-1-12 | Replaced jargon and mood copy throughout landing, controls, paid section, legal pages, and README. | `copy-audit.md`; `landing-1440.png` |

## Evidence assets

- `.factory/evidence/landing-1440.png`
- `.factory/evidence/demo-390.png`

## Live retest

Deployed via `/opt/fleet/lib/deploy-static.sh small-business-export-map dist`.
The final application repair commit is `ea7ace2ef58903dc41c9a8521d165c9e8c7935e8`.

- Cold `https://small-business-export-map.sociobot.in/demo` at 390×844: Demo banner, Reset demo, Start for real, and completed Check output visible.
- Cold unknown route: h1 `That page is not in this export.` and title `Page not found — Export Map`.
- Browser console and page-error listeners: no errors across demo and 404 routes.
- Screenshot: `.factory/evidence/live-demo-390.png`.
