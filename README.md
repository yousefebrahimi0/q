# GreenRah: 3-minute pitch (/q)

Live target: https://yousef.uk/q/ · Sister deck: https://yousef.uk/g/ (repo `g`).

Open `index.html` in Chrome, Edge, Firefox or Safari. Offline: double-click `q.html` (everything inlined; rebuild with `python3 tools/build-single.py`).

## Keys
| Action | Keys |
|---|---|
| Next / previous | → / Space / Page Down · ← / Page Up · swipe on phones |
| Speaker notes (script + sources) | **N** |
| Auto-advance, about 3:00 in total | **A** (or open `?auto`) |
| Fullscreen | F |
| Replay the current demo | R |
| First / last | Home / End |
| Help | ? |

Each slide has its own address (`#/1` to `#/10`). Auto-advance splits 180 s by the spoken word count of each slide.

## Files
- `index.html` slides · `css/q.css` styles (GreenRah tokens shared with /g) · `js/q.js` engine · `js/notes.js` script and sources · `js/icons.js` Tabler icons (MIT) · `js/qrcode.js` (MIT)
- `assets/app/` product screenshots, WebP (see its README) · `script.md` full script with sources

## Hosting
Option A, same as /g: GitHub Pages from `main` / root. The user site `yousefebrahimi0.github.io` has the custom domain `yousef.uk`, so any Pages-enabled repo named `q` appears at `yousef.uk/q/`. No CNAME file is needed here. Private repos need GitHub Pro for Pages.

Option B, private repo on the free plan: Cloudflare Worker with static assets (`wrangler.jsonc`), routes `yousef.uk/q` and `yousef.uk/q/*`. Worker routes run before the GitHub Pages origin, so only /q changes.

## Credits
Space Grotesk (SIL OFL) · Tabler Icons (MIT) · qrcode-generator by Kazuhiko Arase (MIT)
