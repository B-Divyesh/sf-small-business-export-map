# Export Map — review 2 handoff

## Delivered

- Wrote `.factory/review-2.md` with the cold mobile/desktop first read, complete landing/demo and README copy audit, demo/privacy checks, all claim results, route/accessibility checks, earlier-finding verification, missed-leverage review, and FAIL verdict.
- Changed no product code.

## Verification performed

- Fresh Chromium at 390×844 and 1440×900; no-scroll first-screen captures and text bounds.
- Live one-click demo, both downloads, reset, return to real data, IndexedDB namespaces, request origins, and offline reload.
- Fresh clone at `/tmp/export-map-review2.QO2Wo8` with `npm ci`.
- Ran every exact command in `.factory/claims.json`; nine Playwright commands failed because no `dist/` existed, while the unit claim passed. Logs are in `/tmp/export-map-review2-claim-logs/`.
- Ran `npm test` after the exact-command audit: 6 unit tests, production build, and 13 Playwright tests passed. `npx tsc --noEmit` passed.
- Ran `npm run verify:url -- https://small-business-export-map.sociobot.in/`; it exited 1.
- Ran Playwright Axe on `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown route at 390 px: zero serious/critical violations and no console/page errors.
- Checked live status, metadata, headers, favicons, OG image, links, route focus/back behavior, checkout redirect, and invalid-license response.

## Result and next steps

Verdict: **FAIL**. Blocking items are the clean-clone claim commands (reopened F-1-3), nonpersistent demo banner (F-2-1), incomplete routing/metadata/focus and soft 404 (reopened F-1-10), and the failing URL verifier (F-2-2). The report also records incomplete and unlisted claim coverage, copy issues, and accountant-template import as missed leverage.

Start with the four blockers, then make every visible claim traceable to a test that inspects the promised result. Re-run every literal registry command from a newly cloned directory before another review.
