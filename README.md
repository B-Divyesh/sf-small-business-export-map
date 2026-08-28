# Export Map

Prepare CSVs for your accountant. Export Map is for small-business owners who need requested columns and formats before sending a file.

Try the finished sample at <https://small-business-export-map.sociobot.in/demo>.

## What it does

- Shows a checked preview and downloads a prepared CSV with every source row.
- Downloads a JSON change record with source details, checks, transformations, and reversal instructions.
- Supports comma, semicolon, tab, and pipe separators.
- Converts two decimal marks and four date formats only on columns you mark.
- Imports the ordered header row from an accountant’s CSV template.
- Saves two recipient profiles for free. A one-time US$19 purchase saves more profiles.
- Exports and imports complete profile backups.

The sample uses separate browser storage, so it never changes saved profiles.

## Run and test

Node.js 20 or later is required.

```sh
npm ci
npm test
```

`npm test` runs unit, browser, accessibility, privacy, offline, build, and rendered-URL checks. Every registered claim also has an exact command in [.factory/claims.json](.factory/claims.json).

Build with `npm run build`. The static deployment artifact is `dist/`, with `index.html` at its root.

Static hosting must preserve `/demo`, `/privacy/`, `/terms/`, `404.html`, the service worker, and `staticwebapp.config.json`.

## Privacy and purchase

Preparing a CSV does not send its contents anywhere. Saved profiles stay in this browser.

A returned or pasted license token is saved in this browser. The app sends it to Sociobot for a check at most once daily.

Sociobot/Dodo hosts the US$19 one-time checkout. See [Privacy](https://small-business-export-map.sociobot.in/privacy/) and [Terms](https://small-business-export-map.sociobot.in/terms/).

## Deploy

The factory deploys the static `dist/` directory:

```sh
/opt/fleet/lib/deploy-static.sh small-business-export-map dist
```

## License

MIT — see [LICENSE](LICENSE).
