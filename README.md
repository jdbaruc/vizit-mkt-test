# Hero Scoring · Vizit

Static prototype of the Hero Scoring product surface.

## Structure

```
.
├── index.html              # entry point
├── colors_and_type.css     # design tokens (colors, type, spacing)
├── app.jsx                 # app shell + Row/Tabs components
├── products.jsx            # product + iteration data
├── tweaks-panel.jsx        # tweaks panel (density toggle)
├── assets/                 # product hero images + logo
├── fonts/                  # Source Serif 4 variable fonts
└── vercel.json             # caching headers
```

No build step — JSX is transpiled in the browser via Babel standalone.

## Deploy to Vercel

```bash
vercel
```

Or push to a Git repo and import in the Vercel dashboard. Framework preset: **Other**. No build command, output directory is the repo root.

## Local preview

Any static server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```
