// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import db from '@astrojs/db';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [vue(), db()],

  adapter: node({
    mode: 'standalone',
  }),
});