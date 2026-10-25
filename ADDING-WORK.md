# How to add a new piece (no coding needed)

Every gallery on the site comes from one small file in `src/content/`:

| Page          | Content file                    | Images go in             |
|---------------|---------------------------------|--------------------------|
| Animation     | `src/content/animation.json`    | `public/work/animation/` |
| Art           | `src/content/art.json`          | `public/work/art/`       |
| Made by Hand  | `src/content/handmade.json`     | `public/work/handmade/`  |
| About, links, tagline, contact form | `src/content/site.json` | `public/work/about/` |

Adding a piece is always two steps: **drop in the image**, then **add one entry**.
Thumbnails are made for you automatically when the site builds.

## Image tips

- JPG or PNG, about **2000px** on the long side (bigger is fine, it just takes longer to upload).
- Use simple file names: lowercase, dashes instead of spaces. `dragon-sketch.jpg`, not `Dragon Sketch FINAL (2).JPG`.

---

## Example 1: add a new art piece

1. Save the image as `public/work/art/dragon-sketch.jpg`.
2. Open `src/content/art.json` and add an entry. Each entry is wrapped in `{ }` and
   **entries are separated by commas**. Put the new one first if you want it to show first:

```json
[
  {
    "title": "Dragon Sketch",
    "description": "Pencil-style study done in Photoshop, about 3 hours.",
    "image": "art/dragon-sketch.jpg",
    "alt": "A coiled green dragon drawn in rough pencil lines"
  },
  { "title": "Neon Alley", "description": "...", "image": "art/neon-alley.jpg" }
]
```

`alt` is optional: a one-sentence description for people using screen readers. If you skip it, the title is used.

## Example 2: add an animation

1. Upload the video to YouTube (set it to **Unlisted**) or Vimeo. Copy the link.
2. Save a thumbnail still (a nice frame from the video, 16:9) as `public/work/animation/robot-walk.jpg`.
3. Add an entry to `src/content/animation.json`:

```json
  {
    "title": "Robot Walk Cycle",
    "description": "12-frame walk cycle in Adobe Animate.",
    "video": "https://youtu.be/AbCdEfGhIjK",
    "thumbnail": "animation/robot-walk.jpg",
    "year": 2026
  },
```

Any of these link styles work: `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…`,
`vimeo.com/123456789`, and unlisted Vimeo links like `vimeo.com/123456789/abc123def`.

## Example 3: add a woodwork piece

1. Save the photo as `public/work/handmade/oak-sign.jpg`.
2. Add to `src/content/handmade.json`:

```json
  {
    "title": "Engraved Oak Sign",
    "description": "Custom family name sign, engraved and hand-finished.",
    "image": "handmade/oak-sign.jpg",
    "materials": "White oak, Danish oil",
    "commission": true
  },
```

`"commission": true` shows a **Commissions open** badge and a "Commission this" link. Use `false` to hide it.

## Removing or reordering

- **Remove:** delete the whole `{ ... }` entry (and its comma). You can delete the image file too.
- **Reorder:** move entries up or down. The order in the file is the order on the page.

## Check your work and publish

- **Commas are the #1 mistake.** Every entry except the last needs a comma after its `}`.
  If something breaks, paste the file into https://jsonlint.com to find the problem.
- To preview on your computer: `npm run dev`, then open http://localhost:4321
- To publish: `fly deploy` (see README), or commit to GitHub if auto-deploy is set up.

## Editing on GitHub in the browser (easiest)

1. On github.com, open the repo and go to `public/work/art/` → **Add file → Upload files** → drop the image → **Commit changes**.
2. Open `src/content/art.json` → click the ✏️ pencil → add the entry → **Commit changes**.
3. Run `fly deploy` from a computer with the repo pulled down (or let the GitHub Action do it, see README).
