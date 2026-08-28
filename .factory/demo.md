# Demo sandbox

Open `https://small-business-export-map.sociobot.in/demo` or `?demo=1` for the one-click sample.

The sample has three invoice rows, a completed six-column accountant profile, checked output, and CSV/change-record downloads.

Demo profiles use the separate IndexedDB database `demo:export-map`; real profiles use `export-map`. The sticky banner offers **Reset demo** and **Start for real**. Both actions clear demo storage. Neither action reads, changes, or copies real profiles.

The accountant-template action reads only the uploaded template header row. In demo mode, its saved profile remains in `demo:export-map` until reset or exit.
