import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://realtypro-new-for-realtors.framer.website',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});