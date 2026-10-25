import images from '../generated/images.json';

// "art/sunset.jpg" -> "/thumbs/art/sunset-600.webp"
export function thumb(file, width = 600) {
  return `/thumbs/${file.replace(/\.(jpe?g|png|webp)$/i, '')}-${width}.webp`;
}

export function srcset(file) {
  return `${thumb(file, 600)} 600w, ${thumb(file, 1200)} 1200w`;
}

export function full(file) {
  return `/work/${file}`;
}

export function size(file) {
  const s = images[file];
  if (!s) throw new Error(`Image not found: public/work/${file} (check the spelling in your content file)`);
  return s;
}

// Turns a normal YouTube or Vimeo link into an embeddable player URL.
export function embedUrl(url) {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') return yt(u.pathname.slice(1));
  if (host.endsWith('youtube.com')) {
    const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
    return yt(id);
  }
  if (host.endsWith('vimeo.com')) {
    // Unlisted Vimeo links look like vimeo.com/123456/abcdef (the second part is the privacy hash)
    const [id, hash] = u.pathname.split('/').filter(Boolean).filter((p) => p !== 'video');
    const h = hash || u.searchParams.get('h');
    return `https://player.vimeo.com/video/${id}?autoplay=1${h ? `&h=${h}` : ''}`;
  }
  throw new Error(`Unsupported video link: ${url} (use YouTube or Vimeo)`);
}

function yt(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
