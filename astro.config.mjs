import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';

export default defineConfig({
  output: 'static',
  site: 'https://evanminto.com',
  integrations: [react(), mdx(), prefetch()],
});