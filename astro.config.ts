import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jaimemartret.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== '/',
      serialize: (item) => ({
        ...item,
        url: item.url.replace(/\/$/, ''),
      }),
    }),
  ],
});
