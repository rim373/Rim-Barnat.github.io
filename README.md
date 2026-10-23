# Rim Barnat · e-CV (GitHub Pages)

Static, dependency-free personal site. No frameworks, no build step, no cookies, no trackers, no third-party scripts or fonts.

## 1. Deploy

1. On GitHub, create a **Public** repository named exactly `YOUR-USERNAME.github.io`.
2. Upload every file of this folder to the root of the repository (including the hidden `.nojekyll`).
   Easiest way: unzip, then in the repo use **Add file → Upload files** and drag the files in.
3. **Settings → Pages**: Source = *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
4. After 1–2 minutes the site is live at `https://YOUR-USERNAME.github.io`.
5. Tick **Enforce HTTPS** in Settings → Pages.

> Check the GitHub link in `index.html` (`https://github.com/rimbarnat`) and change it if your username is different.

## 2. Make sure only YOU can modify it

The site is static, so nobody can "hack" its content through the page itself. The only way to change it is to change the repository, so protect your GitHub account and repo:

- [ ] **Enable two-factor authentication** (Settings → Password and authentication). Prefer an authenticator app or a passkey / security key over SMS.
- [ ] Use a **long, unique password** stored in a password manager.
- [ ] **Never add collaborators** (Settings → Collaborators should list only you). Visitors can view the code, but they cannot push changes or edit your files.
- [ ] **Protect the `main` branch**: Settings → Branches → Add branch ruleset
  - Target: `main`
  - Enable *Restrict deletions* and *Block force pushes*
  - Enable *Require a pull request before merging* only if you want a review step (optional for a solo repo).
- [ ] Settings → Code security: enable **Secret scanning**, **Push protection** and **Dependabot alerts** (free on public repos).
- [ ] Do **not** create GitHub personal access tokens you don't need. If you do, give them an expiry date and the minimum scope.
- [ ] Review **Settings → Applications** regularly and revoke apps you don't use.
- [ ] Turn on **Settings → Pages → Enforce HTTPS**.
- [ ] Leave **Issues / Discussions / Wiki** unticked in the repo settings (nothing to moderate, smaller attack surface).

Visitors can fork the repository, but a fork is their own copy: it never changes your site.

## 3. Security built into the site

| Measure | Where | What it does |
|---|---|---|
| Content-Security-Policy | `<meta>` in `index.html` / `404.html` | Only allows scripts and styles from your own files (`'self'`); blocks inline scripts, remote scripts, network calls, forms, `<base>` and plugins. |
| `referrer: no-referrer` | `<meta>` | Links you click do not leak your site URL. |
| `rel="noopener noreferrer"` | external links | Prevents tab-nabbing via `window.opener`. |
| No third-party code | whole project | No CDN, analytics, or Google Fonts, so no supply-chain risk and no GDPR cookie banner needed. |
| No `innerHTML` / `eval` | `app.js` | No injection surface in the JavaScript. |
| Safe storage | `app.js` | Only the language and theme choice are saved in `localStorage` (wrapped in try/catch). |
| `.nojekyll` | root | Skips the Jekyll build so files are served exactly as you wrote them. |

Honest limits: GitHub Pages cannot send HTTP security headers (`X-Frame-Options`, `frame-ancestors`, HSTS preload…), so clickjacking protection is not available with a meta tag. If you want those, put the site behind a free Cloudflare account with a custom domain and add the headers there.

## 4. Privacy tip

Your public CV lists two email addresses and your city, but **not your phone number**, on purpose: public phone numbers are scraped by spam and scam bots. Give your number to recruiters directly. If you still want it on the page, add it to the Contact card in `index.html`.

## 5. How to edit later

- Texts: `index.html`. Every sentence has an English `data-l="en"` span and a French `data-l="fr"` span; edit both.
- Colours: top of `style.css` (`--a1`, `--a2`, `--a3`).
- Background animation: `app.js` (number of nodes, link distance, speed).
- After each change, **Commit changes**; the site refreshes by itself within 1–2 minutes.

## 6. Features

- English / French switch (auto-detected from the browser, remembered)
- Dark / light theme
- Animated neural-network background, with signal pulses along the edges and mouse repulsion (respects "reduce motion")
- "Save as PDF" button with a dedicated clean print layout
- Responsive, keyboard-accessible, no JavaScript needed to read the content
