// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import rehypeWrapAll from 'rehype-wrap-all';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    vue(),
  ],
  markdown: {
    rehypePlugins: [
      [rehypeWrapAll, {selector: "table", wrapper: "div.table-wrapper"}],
    ]
  }
});
