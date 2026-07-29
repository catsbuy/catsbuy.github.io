# Cats Buy — catsbuy.com

A small, fast, single-page static site (HTML/CSS/JS) used as the public site for Cats Buy and served from GitHub Pages at https://catsbuy.com.

Live site: https://catsbuy.com

---

Status: Production (CNAME configured for catsbuy.com) • No license (All rights reserved)

---

Table of contents
- About
- Quick demo
- Files you care about
- How it works
- Run locally
- Customize
- Adding projects / cards
- Analytics & privacy
- Deploying / custom domain
- Contributing
- License & contact

---

About

Cats Buy is a single-page site with an animated particle background and a small interactive "wheel" of project cards. The site is implemented in plain HTML, CSS, and vanilla JavaScript — no build step or external bundler required.

Quick demo

- Open index.html in a browser or run a local static server (examples below).
- Click "Explore" in the hero to reveal the cards wheel and panel.

Files you care about

- `index.html` — Main entry (hero, canvas, wheel container). Includes Cloudflare analytics script.
- `index.css` — Theme variables, layout, animations, responsive rules.
- `index.js` — Particle background, UI behaviors, CARDS array and functions like `window.addCard()`.
- `404.html` — Friendly not-found page.
- `CNAME` — Contains `catsbuy.com` (the custom domain for GitHub Pages).
- `favicon.ico` — Site icon.
- `README.md` — (this file)

How it works (runtime)

- `index.html` loads `index.css` and `index.js`.
- `index.js` creates an animated, GPU-friendly particle background drawn into the `<canvas id="c">` and runs the UI code that powers the hero, explore button, card wheel, and the expanded panel.
- The `CARDS` array in `index.js` contains card objects (id, title, desc, img, url). The page populates the wheel by iterating `CARDS` and calling `createMini(...)` for each card.

Run locally

No dependencies required.

Option A — quick (file):

- Open `index.html` in your browser directly. (Some features like analytics won't report locally.)

Option B — local static server (recommended):

- Python 3:
  ```bash
  python -m http.server 8000
  # then open http://localhost:8000
  ```
- Node (http-server):
  ```bash
  npx http-server -c-1 . 8000
  ```

Customize

- Change the hero text in `index.html` at the `<h1>` and `.lead` paragraph.
- Colors: edit CSS variables at the top of `index.css` (e.g. `--accent-1`, `--accent-2`, `--bg`).
- Images: replace `favicon.ico` and provide card images (hosted URLs or files in `/assets/` if you add that folder).
- Panel/CTA button: update behavior in `index.js` (see `launchCard`, `selectCard`, and `window.addCard`).

Adding projects / cards

There are two ways to add project cards that appear in the wheel:

1) Edit `index.js`:
   - Find the `CARDS` array near the top of the file. Replace the placeholder object with real entries. Example:
   ```js
   const CARDS = [
     {
       id: 'project-1',
       title: 'My Project',
       desc: 'Short description',
       img: 'https://example.com/path/to/image.jpg',
       url: 'https://example.com/my-project'
     }
   ];
   ```

2) Add cards at runtime (no file edit required):
   - Open the console on the running site and call `window.addCard(...)` with the same object shape. Example:
   ```js
   window.addCard({ id: 'p2', title: 'Another', desc: '...', img: 'https://...', url: '/somepage.html' });
   ```

Notes:
- `img` can be any CORS-allowed image URL or a relative path to an image you add to the repo.
- `url` can be an internal path (e.g., `/project.html`) or an external link.

Analytics & privacy

- The site includes Cloudflare Web Analytics via a beacon in `index.html`. If you do not want analytics, remove the script block that references `https://static.cloudflareinsights.com/beacon.min.js`.
- If you want to switch analytics providers, replace or remove the current snippet and add your provider's snippet or a privacy-friendly alternative.

Deploying / custom domain

- GitHub Pages: the repo already includes `CNAME` set to `catsbuy.com`. Ensure the Pages settings are configured to serve from the repository's default branch (root). Configure your DNS according to GitHub Pages docs (A records / ALIAS / CNAME depending on your DNS provider).
- Alternate hosts: You can host the same static files on Netlify, Vercel, or any static host. If you move hosting, update the `CNAME` or remove it if you won't use GitHub Pages.

Contributing

- For content or visual edits, open a branch, make the change, and send a PR. Small text changes are safe; for structural or JS changes include a description and screenshots.
- If you add an assets folder (e.g., `/assets/images/`), update the README with the asset paths.

License

- This project does not include an open-source license. All rights reserved by the repository owner.

Contact

- Website: https://catsbuy.com
- Want me to help fill in project cards, hero text, or social links? Reply with the texts, links, and images you want and I can update the site and commit changes.

---

What I will do next if you want:
- Replace the placeholder CARDS object with real project cards and update the hero text/CTA.
- Convert README to include screenshots or a demo GIF (if you provide images).
- Remove the Cloudflare analytics token or replace it with your own.

Tell me which of the above you want me to commit and I'll make those changes.