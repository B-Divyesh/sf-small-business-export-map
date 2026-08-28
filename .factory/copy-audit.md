# Copy audit — polish 4

Word counts treat hyphenated terms and numbers as one word. No sentence exceeds 22 words. No banned marketing term or unresolved review phrase remains.

## First screen

| Copy | Words | Purpose or claim |
| --- | ---: | --- |
| Check a CSV before sending it | 6 | section label |
| Prepare CSVs for your accountant. | 5 | job headline |
| For small-business owners who need every CSV column, number, and date in the format their accountant requested. | 17 | audience and result |
| Try it with sample data | 5 | sample action |
| Choose a CSV to prepare | 5 | real-data action |
| The sample opens a finished CSV and change record. | 9 | action outcome; `csv-change-record` |
| Your real file stays on this device. | 7 | `privacy-real-workflow` |
| Files stay on this device | 5 | `privacy-real-workflow` |
| Works offline after first visit | 5 | `offline-demo` |
| Free: two profiles · Pro: US$19 once | 7 | `profile-limit`, `checkout-host` |
| Illustration generated for Export Map. | 5 | provenance |

## Workspace and results

| Copy | Words | Purpose or claim |
| --- | ---: | --- |
| Prepare your CSV | 3 | workspace heading |
| Choose a file, state your accountant’s format, and check the output before downloading. | 13 | instruction |
| CSV or text file, up to and including 10 MB | 10 | `file-limit` |
| A recipient profile remembers the columns and formats one accountant needs. | 11 | term definition |
| Add an apostrophe before values starting with =, +, or @ in the downloaded CSV. | 14 | `formula-protection` |
| Use formatting only when your accountant specified it. | 8 | `explicit-formatting` |
| You choose the accounting meaning. | 5 | `no-accounting-inference` |
| Add required columns, copy your source headers, or import your accountant’s template. | 12 | empty-state action |
| Preview shows no more than eight rows. | 7 | `preview-full-download` |
| The downloaded CSV contains every row. | 6 | `preview-full-download` |
| CSV and change record are ready | 6 | result heading |
| Download the prepared CSV and the JSON record of every change. | 11 | `csv-change-record` |
| Demo — sample data, nothing is saved. | 7 | `demo-isolation` |
| Sample reset. Your saved profiles were not changed. | 8 | `demo-isolation` |
| Ready to download | 3 | result state |
| 3 rows match the accountant’s columns and formats. | 8 | sample result |
| Use each source and accountant column pair in reverse. | 9 | reversal instruction |

## Explanatory and purchase sections

| Copy | Words | Purpose or claim |
| --- | ---: | --- |
| The file is read on this device. | 7 | `privacy-real-workflow` |
| Name columns and choose separators, numbers, and dates. | 8 | `core-format-matrix` |
| Review the CSV with a record of each change. | 9 | `csv-change-record` |
| Your CSV is not uploaded. | 5 | `privacy-real-workflow` |
| The original file is not changed. | 6 | `source-preservation` |
| You choose the accounting meaning. | 5 | `no-accounting-inference` |
| The free version saves two profiles. | 6 | `profile-limit` |
| Export Map Pro saves unlimited profiles for a one-time US$19 purchase. | 11 | `checkout-host`, `pro-license` |
| Sociobot/Dodo takes payment and handles receipts and refunds. | 8 | `checkout-host` |
| Prepare CSVs on this device. | 5 | `privacy-real-workflow` |

## README changes

| Copy | Words | Purpose or claim |
| --- | ---: | --- |
| Downloads a JSON change record with source details, checks, transformations, and reversal instructions. | 13 | `csv-change-record` |
| The sample uses separate browser storage, so it never changes saved profiles. | 11 | `demo-isolation` |
| Preparing a CSV does not send its contents anywhere. | 9 | `privacy-real-workflow` |
| Saved profiles stay in this browser. | 6 | `profile-persistence` |
| A returned or pasted license token is saved in this browser. | 11 | `pro-license` |
| The app sends it to Sociobot for a check at most once daily. | 13 | `pro-license` |
| Sociobot/Dodo hosts the US$19 one-time checkout. | 6 | `checkout-host` |

## Errors and feedback

| Copy | Words | Purpose |
| --- | ---: | --- |
| Choose a CSV before checking output. | 6 | missing-file error |
| That file is over 10 MB. Choose a smaller CSV. | 10 | size error and recovery |
| Give this recipient profile a name before saving. | 9 | profile error and recovery |
| The free version saves two profiles. Buy unlimited profiles or delete one. | 12 | limit and recovery |
| Downloads are paused. Fix the errors above and check output again. | 11 | output error and recovery |
| This license is not active. You can keep using the free workspace. | 12 | license error and recovery |
| License verification is temporarily unavailable. | 5 | network error |
| That profile backup is not valid Export Map JSON. | 9 | import error |
| Your saved profiles were not changed. | 6 | atomic-import result |

## Terminology

| Concept | One term |
| --- | --- |
| input document | CSV |
| receiving person | accountant |
| saved settings | recipient profile |
| target field | accountant column |
| result inspection | output preview |
| downloaded evidence | change record |
| trial data | sample |

Internal schema names may still use `manifest`; visitors see **change record** everywhere.
