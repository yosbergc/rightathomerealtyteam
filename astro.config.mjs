import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rightathomerealtyteam.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  build: { assetsPrefix: 'https://www.rightathomerealtyteam.com', inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
