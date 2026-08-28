# Export Map — polish 1 handoff

## Delivered

- Repaired every item in `.factory/review-1.md`; the detailed F-1-1 through F-1-12 mapping is in `.factory/polish-1.md`.
- Added a one-click, isolated `/demo` sample with a persistent reset/start-real banner and a completed accountant handoff visible on a 390 px screen.
- Added atomic profile import validation, long-quoted CSV detection, mobile preview access, mobile rail repair, and license-cache privacy repair.
- Added claim registry, clean-state claim tests, route metadata, static 404, legal skeleton, favicon/social assets, security/cache configuration, and copy audit.
- Verified the approved production checkout endpoint redirects with HTTP 303 to `checkout.dodopayments.com`; the production invalid-license endpoint returned a valid `{"valid":false,"reason":"invalid"}` verdict. The browser removes incoming `license` tokens and reconciles them via the production verification endpoint.

## Local evidence

Run from a clean checkout:

```sh
npm ci
npm test
npx tsc --noEmit
for id in demo-isolation offline-demo csv-manifest privacy-demo profile-persistence source-preservation profile-limit pro-checkout file-limit; do npm run test:e2e -- --grep "@claim:$id"; done
npm run test:unit -- -t @claim:explicit-formatting
```

Recorded before commit:

- `npm test`: 6 unit tests, production build, 13 Playwright tests passed.
- `npx tsc --noEmit`: passed.
- All nine Playwright claim commands and the tagged Vitest claim passed.
- Mobile Axe scan in the Playwright suite: zero serious or critical violations.
- `npm run verify:url` passed against local preview; `dist/404.html` exists.
- Build: application JS 30.10 KB (10.58 KB gzip); application CSS 11.89 KB (3.45 KB gzip); original mobile hero 34 KB; social crop 73 KB.
- Screenshots: `.factory/evidence/landing-1440.png` and `.factory/evidence/demo-390.png`.

Final clean-clone evidence after the runtime repair: `/tmp/export-map-final-sYBCjW` ran `npm ci`, `npm test` (6 unit, build, 13 Playwright), all nine Playwright claim commands, and the tagged Vitest claim successfully.

## Deployment

Deployed with `/opt/fleet/lib/deploy-static.sh small-business-export-map dist` after the production build. Application repair commits: `a395d82`, `d6e2962`, `c41f6ca`, `6fdd9da`, `ea7ace2`, and final focus/runtime repair `e35af96`.

Cold live retest on `https://small-business-export-map.sociobot.in`:

- `/demo` at 390×844 loaded the sample banner, Reset demo, Start for real, and completed Check output with no browser console or page errors. Focus moved to the h1.
- `/missing-review-route` rendered `That page is not in this export.` with title `Page not found — Export Map`; focus moved to the h1.
- `/privacy/` title was `Privacy — Export Map`.
- Home response includes CSP and Permissions-Policy. Hashed application JS is `public, max-age=31536000, immutable`; the manifest is `application/manifest+json`.
- Production checkout returned HTTP 303 to Dodo; invalid license verification returned `{"valid":false,"reason":"invalid"}`. Return-token cleanup and Cache Storage token exclusion passed in the browser suite.

## Known gaps

None known. The checkout smoke test intentionally does not submit a payment or create a charge; return-token capture and invalid-license reconciliation are covered in browser tests.
