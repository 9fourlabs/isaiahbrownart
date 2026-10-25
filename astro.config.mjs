import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://isaiahbrown.art',
  output: 'static',
  build: { format: 'directory' },
});
