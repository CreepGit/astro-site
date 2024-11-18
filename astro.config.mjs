// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    vue(),
  ],
  markdown: {
    rehypePlugins: [
      // wrap,
      // wrap({ selector: "table", wrapper: "div.table-container" }),
    ]
  }
});
