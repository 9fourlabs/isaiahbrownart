// Makes small, fast WebP thumbnails for every image in public/work/.
// Runs automatically before `npm run dev` and `npm run build`.
// Output: public/thumbs/<same path>-<width>.webp and src/generated/images.json (sizes).
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/work';
const OUT = 'public/thumbs';
const WIDTHS = [600, 1200];
const IMAGE = /\.(jpe?g|png|webp)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : IMAGE.test(e.name) ? [full] : [];
    }),
  );
  return files.flat();
}

async function isFresh(src, out) {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false;
  }
}

const files = await walk(SRC);
const manifest = {};
let made = 0;

for (const file of files) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const base = rel.replace(IMAGE, '');
  const meta = await sharp(file).metadata();
  manifest[rel] = { width: meta.width, height: meta.height };

  for (const w of WIDTHS) {
    const out = path.join(OUT, `${base}-${w}.webp`);
    if (await isFresh(file, out)) continue;
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    made++;
  }
}

await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/images.json', JSON.stringify(manifest, null, 2));
console.log(`thumbs: ${files.length} images, ${made} new thumbnails`);
