# Export Map

Export Map is a private, offline-capable CSV preflight tool for owners of tiny
businesses. It reshapes exports from invoicing, inventory, expense, and other
admin tools to match the exact fields and locale conventions an accountant has
requested—and produces a manifest of every change.

Live site: <https://small-business-export-map.sociobot.in>

## What it does

- Reads CSV files entirely in the browser; the source file is never uploaded or
  overwritten.
- Detects comma, semicolon, tab, and pipe delimiters and handles quoted fields.
- Saves recipient profiles locally in IndexedDB.
- Maps, renames, orders, and requires recipient columns without inferring tax or
  accounting meaning.
- Converts decimal marks and four explicit date formats only on columns the user
  marks as numbers or dates.
- Shows validation errors, an output preview, affected counts, and a reverse
  instruction for each transformation.
- Downloads the transformed UTF-8 CSV and a JSON handoff manifest containing the
  original file fingerprint.
- Exports/imports recipient profiles as JSON and works after the network drops.

The free tier includes the full preflight/export workflow and two saved profiles.
The one-time US$19 Pro unlock adds unlimited saved profiles through the Sociobot
billing and license API. No payment provider is embedded in this app.

## Run locally

Requires Node.js 20 or later.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. To test the production output:

```sh
npm test
```

That command runs unit tests, builds the production app, and runs the Playwright
workflow, accessibility, legal-page, and offline tests. Playwright 1.58.2 is
pinned; if Chromium is not already present, run `npx playwright install chromium`.

## Build and deploy

```sh
npm run build
```

The exact static deploy artifact is `dist/`, with `dist/index.html` at its root.
Serve all files as static assets and preserve the `/privacy/` and `/terms/`
directories. The service worker is scoped to `/` and requires HTTPS outside
localhost.

The factory registers the paid product separately. The frontend deliberately
uses the slug-based URL
`https://api.sociobot.in/api/v1/products/small-business-export-map/...`; it does
not contain a provider product ID or secret.

## Privacy and data ownership

There are no analytics, ads, runtime CDNs, or hosted fonts. Active CSV contents
live only in the current browser tab. Recipient profiles live in IndexedDB;
license tokens and their daily verification cache live in localStorage. The
in-app profile export/import controls let users move or back up their data.

See [the privacy policy](https://small-business-export-map.sociobot.in/privacy/)
and [terms](https://small-business-export-map.sociobot.in/terms/).

## Design and provenance

The product-specific risograph system, tokens, interaction grammar, image prompt,
review, and provenance are recorded in [`.factory/design.md`](.factory/design.md).
The generated source artwork and prompt sidecars are retained in `assets/src/`;
optimized WebP variants ship in `public/assets/`.

## License

MIT — see [LICENSE](LICENSE).
