# Export Map

Prepare CSVs for your accountant. It is for small-business owners who need requested columns, numbers, and dates before sending a file.

Try the finished sample: <https://small-business-export-map.sociobot.in/demo>.

## What it does

- Reads a CSV in the browser and shows a checked output preview.
- Lets you name recipient columns and set separators, decimal marks, and date formats.
- Downloads a reshaped CSV and a JSON record of each change.
- Saves up to two recipient profiles in this browser. A one-time US$19 purchase saves unlimited profiles.

The sample is separate from your saved profiles. It uses the `demo:export-map` IndexedDB database. Your real profiles use `export-map`. See [the demo guide](.factory/demo.md).

## Run and test

Node.js 20 or later is required.

```sh
npm ci
npm test
```

Run every registered claim test from a clean state:

```sh
for id in demo-isolation offline-demo csv-manifest privacy-demo profile-persistence source-preservation profile-limit pro-checkout file-limit; do
  npm run test:e2e -- --grep "@claim:$id"
done
```

Build with `npm run build`. The static deployment artifact is `dist/`, with `index.html` at its root. Static hosting must preserve `/privacy/`, `/terms/`, `/demo`, the service worker, and `staticwebapp.config.json`.

## Privacy and purchase

The sample and normal CSV workflow make only same-origin requests. A pasted or returned license token is stored in browser localStorage. The app checks a license with `api.sociobot.in` at most once per day while online. Sociobot/Dodo hosts checkout and is the merchant of record. See [Privacy](https://small-business-export-map.sociobot.in/privacy/) and [Terms](https://small-business-export-map.sociobot.in/terms/).

## License

MIT — see [LICENSE](LICENSE).
