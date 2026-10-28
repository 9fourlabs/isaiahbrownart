# isaiahbrown.art

Portfolio site for Isaiah Brown: animation, digital art, and handmade/laser-engraved woodwork.

Built with [Astro](https://astro.build) (static HTML, no server code), served by Caddy on Fly.io.

- **Want to add a piece?** Use the editor at [app.pagescms.org](https://app.pagescms.org) (set up by `.pages.yml`): pick Animation, Art, or Made by Hand, click **Add**, upload the image, fill in the title, **Save**. The site redeploys on its own a few minutes later. To do it by hand instead, see **[ADDING-WORK.md](ADDING-WORK.md)**.
- Accent color, fonts, and spacing live at the top of `src/styles/global.css`.

## Project layout

```
src/content/        ← all the words and gallery lists (edit these)
  site.json           name, tagline, bio, skills, social links, Formspree id, commission note
  animation.json      Animation page
  art.json            Art page
  handmade.json       Made by Hand page
public/work/        ← full-size images and the hero loop video (put new images here)
public/thumbs/      ← auto-generated thumbnails (don't edit, not committed)
scripts/thumbs.mjs  ← makes the thumbnails before every dev/build
src/pages/          ← one file per page
```

## Run it locally

Needs Node 22+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Before going live: swap the placeholders

1. Replace the images in `public/work/` and entries in `src/content/*.json` (all say "Placeholder").
2. **Hero loop:** replace `public/work/hero-loop.mp4` (muted, a few seconds, loops cleanly, keep it under ~3 MB)
   and `public/work/hero-poster.jpg` (a still frame shown while it loads; also used as the link preview image).
   To shrink an export: `ffmpeg -i in.mov -an -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart hero-loop.mp4`
3. **Contact form:** create a free form at [formspree.io](https://formspree.io), copy the form id
   (the part after `/f/`, e.g. `xyzabcd`) into `formspreeId` in `src/content/site.json`.
   Submissions go to the email on the Formspree account.
4. **Links:** set the Etsy, Instagram, and YouTube URLs in `src/content/site.json`.

---

## Deploy to Fly.io

One-time setup on your computer:

```bash
# Install flyctl: https://fly.io/docs/flyctl/install/
brew install flyctl          # macOS, or: curl -L https://fly.io/install.sh | sh
fly auth login
```

### 1. `fly launch` (first time only)

From the project folder:

```bash
fly launch --copy-config --no-deploy
```

- Say **yes** to using the existing `fly.toml`.
- If the name `isaiahbrown-art` is taken, pick another; it updates `app` in `fly.toml`.
- Region is Ashburn, VA (`iad`); Fly retired Atlanta. Say **no** to databases/Redis/etc.

### 2. `fly deploy`

```bash
fly deploy
```

This builds the Dockerfile on Fly's builders (you don't need Docker installed), then starts the site.
Check it at `https://<app-name>.fly.dev`. Run `fly deploy` again any time you change content.

The machine is a `shared-cpu-1x` with 256 MB and **auto-stops when nobody is visiting**, waking on the next request
(first visit after a nap takes about a second). For a site like this the cost is typically $0 to a couple of dollars a month.

### 3. Make sure the app has IP addresses

```bash
fly ips list
```

You should see a `v4` (shared) and a `v6` address. If either is missing:

```bash
fly ips allocate-v4 --shared
fly ips allocate-v6
```

Write both down; you need them for DNS.

### 4. `fly certs add <domain>`

```bash
fly certs add isaiahbrown.art
fly certs add www.isaiahbrown.art
```

Each command prints the DNS records it wants. They will match the table below.

### 5. Set DNS records in Squarespace Domains

1. Go to [account.squarespace.com/domains](https://account.squarespace.com/domains) and click **isaiahbrown.art**.
2. Open **DNS** in the left menu (sometimes labeled **DNS Settings**).
3. Under **Squarespace Defaults** (or any preset like "Squarespace" or "Domain forwarding"), **delete** those records.
   They point the domain at Squarespace and will block Fly. Also turn off any domain forwarding.
4. Under **Custom records**, click **Add record** and add these three:

| Type  | Host  | Data / Value                          | TTL     |
|-------|-------|---------------------------------------|---------|
| A     | `@`   | your Fly **IPv4** from `fly ips list` | default |
| AAAA  | `@`   | your Fly **IPv6** from `fly ips list` | default |
| CNAME | `www` | `isaiahbrown-art.fly.dev` (your app name + `.fly.dev`) | default |

5. Save. Leave any **MX** or email-related records alone if you set up email on this domain.

DNS usually updates within 5 to 60 minutes (rarely up to 48 hours). Check progress:

```bash
fly certs check isaiahbrown.art
fly certs check www.isaiahbrown.art
```

When both say **Issued**, `https://isaiahbrown.art` is live, and `www.` redirects to it.

> If a cert stays stuck on "Awaiting configuration" after an hour, `fly certs show isaiahbrown.art` lists an optional
> `_acme-challenge` CNAME. Add it in Squarespace as **Type** CNAME, **Host** `_acme-challenge`, **Data** the value shown.

### Auto-deploy from GitHub (optional)

`.github/workflows/fly-deploy.yml` deploys every push to `main`, so edits made on github.com go live by themselves.

```bash
fly tokens create deploy -x 999999h
```

Copy the token, then in GitHub: repo **Settings → Secrets and variables → Actions → New repository secret**,
name `FLY_API_TOKEN`, paste the token. Until that secret exists, the workflow will fail harmlessly; just deploy with `fly deploy`.

## Editor for Isaiah (Pages CMS)

`.pages.yml` configures [Pages CMS](https://pagescms.org), a free browser editor that saves straight to this repo.

One-time setup (repo owner):
1. Sign in at [app.pagescms.org](https://app.pagescms.org) with GitHub and install the Pages CMS GitHub App on the account that owns this repo (only this repo needs access).
2. Open **isaiahbrownart** → **Settings → Collaborators** → invite Isaiah's email. He gets a sign-in link by email; no GitHub account needed.
3. Make sure the `FLY_API_TOKEN` secret is set (see "Auto-deploy" above). Without it, edits are saved to GitHub but don't go live until someone runs `fly deploy`.

Collaborators can add, edit, and remove pieces and upload images. They can't change the editor settings or invite others.

## Accessibility notes

- Every gallery item is a real link or button, so it works with Tab/Enter. In the lightbox: **←/→** to move, **Esc** to close.
- Images use `alt` from the content files (falls back to the title). Write a short `alt` for art pieces when you can.
- The hero loop pauses automatically for visitors who've turned on "reduce motion", and has a Pause button.
- Text colors meet WCAG AA contrast on the dark background.
