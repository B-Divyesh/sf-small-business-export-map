# Independent product verification — FAIL

Verified on 2026-08-28 against candidate
`c5e798eebe6d3df6813ac61015ce7d8b79601a4c` and
<https://small-business-export-map.sociobot.in/>.

## Verdict

**FAIL.** The candidate builds cleanly, the deployed static files match it, and
the ordinary desktop CSV handoff works. It does not satisfy the acceptance
contract because the advertised purchase is unavailable, a multi-column review
cannot be fully inspected at 390 px, a structurally corrupt profile backup can
replace valid local data and leave the mapper broken, and the mobile workflow
has an axe serious keyboard finding. A valid sub-10 MB CSV boundary case is also
rejected.

## Test environment and candidate identity

- Clean detached Git worktree at the exact candidate SHA; the source worktree's
  unrelated untracked `graphify-out/` directory was not touched.
- Node.js 22.23.2, npm 10.9.8, Playwright/Chromium 1.58.2, axe 4.10.2,
  Lighthouse 12.8.2 / Headless Chrome 145.
- `origin/main` and the test worktree both resolved to the candidate SHA before
  testing.
- Rebuilt `dist/` was clean. SHA-256 comparison of 13 live files against the
  local build was an exact match: `index.html`, hashed JS and CSS, `sw.js`, web
  manifest, offline and legal pages, both WebP assets, and all three icons.
  For example, live/local `index.html` was
  `b2b5d935b2860bee43fb2e8f3dd4089127b58c7e64ccad259dee00fe0e4b8e33` and
  app JS was
  `05bd5803db7643635800f584d1f1f33a2a509136158f6a9a7556e3f4ae570763`.

## Quality gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`; 60 packages installed, lockfile unchanged |
| Dependency audit | PASS | `npm audit --omit=dev`; 0 vulnerabilities |
| Unit suite | PASS | `npm run test:unit`; 5/5 tests |
| Type check | PASS | `npx tsc --noEmit` |
| Lint | N/A | no lint script/configuration exists |
| Exact production build | PASS | `npm run build`; `dist/index.html` produced |
| Repository E2E | PASS | `npm run test:e2e`; 4/4 tests |
| Aggregate command | PASS | `npm test`; unit, build, and E2E all passed |
| Worktree cleanliness | PASS | no candidate files changed by install/test/build |

Production build sizes were 28,616 bytes JS (9.87 KB gzip), 10,607 bytes app
CSS (3.21 KB gzip), 1,161 bytes legal CSS, 34,134 bytes mobile hero WebP, and
93,548 bytes desktop hero WebP. They are within the stated budgets.

## End-to-end and boundary coverage

The following passed in fresh browser contexts locally and, for the main flow,
again on the live URL:

- Semicolon source with comma decimals, explicit `DD.MM.YYYY` dates, quoted
  multiline text, formula protection, pipe output, and a valid leap day.
- An invalid grouped number blocked downloads; replacing the input with a valid
  declared number and rerunning recovered to “Ready for handoff.”
- Downloaded CSV contained the expected UTF-8 BOM, CRLF records,
  `2024-12-31`, `2024-02-29`, `1234.50`, `-0.01`, quoted newline, and protected
  `'=2+3` value.
- Downloaded manifest named the source and profile, contained the exact source
  SHA-256, row/column metadata, field map, checks, transformations, affected
  counts, and reverse instructions.
- Empty file, header-only file, empty and duplicate headers, unterminated quote,
  over-10 MB file, no file, no mapping, required-but-unmapped column, duplicate
  target, malformed date/number, and invalid JSON backup all showed actionable
  errors. Correcting the ordinary validation failures recovered successfully.
- Two-profile free limit, confirmed deletion, save/reload persistence,
  profile export, valid import, empty-name focus, and invalid-license free-tier
  fallback behaved as described.
- Source/file names and profile names were rendered as text; no file data was
  sent in observed network requests.

## PWA, privacy, and browser policy checks

- Chrome reported no manifest parse or installability errors locally or live.
- First controlled load, service-worker control, update discovery, visible
  “Update available” toast, `SKIP_WAITING`, controller takeover/reload, and an
  offline reload after the update all passed in an isolated update simulation.
- Live desktop and 390 px contexts both reloaded the app offline and displayed
  `Offline · local mode`; no console or uncaught page errors occurred in the
  valid workflows.
- With no license, all observed initial and CSV-workflow requests were
  same-origin. With a license, the only external request was the declared
  Sociobot verification endpoint. Invalid verification stripped the token from
  the address bar and left the free workflow usable.
- Live responses use HTTPS/HTTP/2 and include HSTS,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `X-Content-Type-Options: nosniff`.
- The deployment does not send Content-Security-Policy or Permissions-Policy.
  The web manifest is served as `application/octet-stream`, although Chrome
  parsed it successfully.
- Every checked resource, including content-hashed JS/CSS, is served with only
  `Cache-Control: public, must-revalidate, max-age=30`; immutable asset caching
  is not configured.

## Accessibility, responsive behavior, and performance

- Desktop at 1440×1100: one `h1`, `lang=en`, `main`, labelled controls, visible
  3 px focus ring, working skip link, and zero axe serious/critical findings on
  both the initial and completed-workflow screens.
- Reduced-motion emulation changed smooth scrolling to `auto`, reduced
  transition duration to effectively zero, and removed the hero transform.
- 390×844: the layout stacks intentionally and the mapping table itself can be
  scrolled. However, the completed output preview and workflow rail defects
  below fail mobile and keyboard acceptance. Several secondary link targets are
  also below 44 px high.
- Lighthouse mobile on the live URL: Performance 97, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.4 s, LCP 1.4 s, TBT 180 ms, CLS 0, Speed Index
  1.4 s. Initial transfer was 49,370 bytes total (34,209 image, 10,086 script,
  3,342 stylesheet); no third-party or font payload.

## Defects

### High — advertised Pro checkout is unavailable

`GET https://api.sociobot.in/api/v1/products/small-business-export-map/checkout`
returned HTTP 404 with
`{"error":"enabled factory product","status":404}`. The live “Buy Pro” action
therefore leaves the product for an error response, while the page advertises a
US$19 purchase. Invalid-license verification itself returns a valid API verdict,
so this is specifically the checkout/product-enablement path. Registration or
enablement must be completed and the real return/license flow smoke-tested.

### High — mobile review columns are clipped and cannot be reached

At 390×844 after preflighting six columns, `.review` is 358 px wide but its
second grid child and `.preview` expand to 622 px. The preview reports
`clientWidth=620` and `scrollWidth=620`, so its own scroll position remains 0;
the document reports 668 px content width but its scroll position also remains
0. Output cells 4–6 begin/end outside the 390 px viewport (last cell
535.6–637 px). This prevents the owner from reviewing all output fields before
handoff, a core job in the brief. Constrain the review grid child (`min-width:0`)
so `.preview` owns the overflow, then add a six-column mobile regression test.

### High — a corrupt profile backup can replace good data and poison the mapper

After saving a valid “Good” profile, importing schema-1 JSON containing a
profile with a valid `id` but no `mappings` property displayed “That profile
backup is not valid Export Map JSON.” Despite that error, IndexedDB had already
been replaced: the selector showed “Poison,” the good profile was gone, reload
showed “Saved profiles are unavailable,” and “Add recipient column” raised
`Cannot read properties of undefined (reading 'push')`. Validate every profile
and mapping before opening the replacement transaction; reject atomically and
preserve the existing store.

### Medium — valid CSV with a long quoted field is rejected

A valid 70,014-byte CSV (`ID,Notes` plus one 70,000-character quoted Notes
value) is well below the advertised 10 MB limit but is rejected as “A quoted
field is not closed.” Delimiter detection truncates its sample at 64,000 bytes
inside the quoted value and parses the incomplete sample. Sampling must stop at
a complete record/quote boundary or delimiter detection must tolerate a sample
ending inside a quote.

### Medium — mobile workflow rail fails keyboard accessibility

Axe 4.10.2 reports `scrollable-region-focusable` (serious) on `.route` at
390 px. Only the first two workflow stages are initially visible, while the
horizontally scrollable `<ol>` has neither a focus target nor focusable content.
Make the rail keyboard-scrollable with an accessible name and visible focus, or
provide a non-scrolling mobile presentation.

### Medium — some mobile touch targets are below 44×44 px

Measured examples at 390 px include the 34 px-high brand link and 17 px-high
inline Privacy/Terms links. Primary buttons and form controls meet the target
size, but the attached accessibility/design contract applies the 44 px minimum
to every interactive target.

### Medium — stripped license tokens remain in persistent Cache Storage keys

After establishing service-worker control and navigating to
`/?license=qa-cache-secret-123`, the address bar was cleaned and the token was
stored in the documented localStorage key, but Cache Storage
`export-map-v1` also retained the full request URL containing that token. The
privacy page says the license token is stored in localStorage and the intended
URL stripping does not remove this second persistent copy. Navigation caching
should normalize or bypass URLs carrying `license` before caching.

### Low — production caching and response hardening are incomplete

Hashed assets are revalidated after 30 seconds rather than receiving a
long-lived immutable policy. CSP and Permissions-Policy are absent, and the
manifest uses a generic octet-stream MIME type. These did not produce runtime or
installability errors, but should be corrected at the static host.

## Retest requirements

Retest the checkout through hosted checkout and return-token activation; six or
more review columns at 390 px with keyboard and touch; atomic rejection of
structurally invalid profile JSON with existing profiles preserved across
reload; a quoted field crossing the 64 KB sampling boundary; axe after mobile
mapping/review; cache keys after a license return; and production cache/security
headers. Repeat the existing clean install, type check, unit/E2E suite, build,
offline/update check, byte identity check, and Lighthouse run.
