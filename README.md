# Video Vault (Retro Edition)

A tiny retro-Windows-styled app to paste video links, store them, and view them all later.

## Repo structure

```
video-vault/
├── index.html                    # Page structure / markup
├── css/
│   └── style.css                 # Retro Windows-style visuals
├── js/
│   ├── db.js                     # Data layer (currently localStorage mock)
│   └── app.js                    # UI logic - wires buttons to db.js
├── netlify/
│   └── functions/
│       └── videos.js             # MOCK serverless function (placeholder for real DB)
├── netlify.toml                  # Netlify build/deploy config
└── README.md
```

## How it works right now

- `js/db.js` stores links in the browser's `localStorage`, so the site is fully
  functional the moment it's deployed - no database setup required.
- `netlify/functions/videos.js` exists as a **mock/dummy** serverless function.
  It's not called yet, but the folder is wired up in `netlify.toml` so Netlify
  will deploy it automatically, ready for you to connect a real database later.
- Every important step (adding a link, reading links, rendering the list) logs
  to the browser console with `[DB READ]`, `[DB WRITE]`, `[ADD ...]`,
  `[VIEW ...]`, `[RENDER]` tags so you can trace exactly what's happening.

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project** → pick this repo.
3. Build settings: leave the publish directory as `.` (root) - already set in `netlify.toml`.
4. Deploy. That's it - no environment variables or database needed yet.

## Upgrading to a real database later

1. Connect **Netlify Database** (or any Postgres provider) to this site.
2. Replace the dummy logic in `netlify/functions/videos.js` with real
   queries against that database.
3. In `js/db.js`, swap the localStorage code in `getVideos()` and
   `addVideo()` for the commented-out `fetch('/.netlify/functions/videos')`
   examples already included in that file.
4. `js/app.js` requires **no changes** - it only talks to `DB.getVideos()`
   and `DB.addVideo()`, regardless of what's powering them underneath.

## Moving the database to another site (tools/migrate.mjs)

From a Codespace (or any computer with Node 18+), nothing to install:

```bash
# 1. Export: reads only. Type everyone's codes so "videos done" comes along too.
node tools/migrate.mjs export --from https://studiomirrors.netlify.app --codes SARAH,BRYAN
# 2. On the target site in Netlify: set IMPORT_KEY (a long secret of your own) and redeploy. Then:
IMPORT_KEY=your-secret node tools/migrate.mjs import --to https://studio-mirrors.netlify.app
# 3. Remove IMPORT_KEY from the target's Netlify settings again.
```

The backup lands in `backup/` (links.json/.csv, done.json/.csv, pictures/). It is your data: `backup/` is in .gitignore, never commit it.
Running the import twice is safe: what is already there is skipped.

## Testing a change before it goes live (local preview)

Changes are made on a separate branch first. To try one:

1. On GitHub, switch to the branch, then **Code → Codespaces → Create codespace on <branch>** (or open your Codespace and run `git fetch && git checkout <branch> && git pull`).
2. In its terminal: `npm run preview` (the first time it runs `npm install` by itself).
3. The browser opens the site (or: **Ports** tab → port 8888 → the globe icon).

It is the whole site with the real functions, but a **test database** with sample links and pictures: nothing touches the live site.
Test codes: Done / Videos done = `TEST` or `ANNA`, scissors = `scissors`, dashboard login = `test` / `test`.
Switch a setting on for a test by putting it in front, e.g. `PACE_PER_DAY=5-9 npm run preview`. Ctrl+C stops it; every start is fresh.

**Grid Player against the preview:** in the Grid Player's ⋯ menu choose **Links from → Dev**. On your own computer that is `localhost:8888`. In a Codespace, make port 8888 **Public** (Ports tab → right-click → Port visibility) and put its address in `SERVERS.dev` in the Grid Player's `app/js/links.js`.

## Codes (people): the Code adder page

Open **/code-adder/** on the site (for example https://studio-mirrors.netlify.app/code-adder/).

- **First use:** there is no admin yet, so the page opens without a key. Add yourself with your code: you become the admin,
  and from then on **your code is the key** for this page. Do this straight after the page goes live.
- Then: type your code as the admin key → **Open**. Add a person (code, name, optional deadline, admin yes/no) → **Save**.
  The code works at once for Done, Videos done, the pay and the pace. **Edit** changes a person, **Remove** stops their code
  (their videos done stay).
- The codes live in the database (table `people`). Codes in the Netlify setting `DONE_CODES` keep working too.
- Locked out? Set `ADMIN_KEY` in Netlify (any secret): it always opens the page.
