import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'node:url';

// Documentation site. The library is imported from source (`@lib`), so docs
// always reflect the current components and tokens.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [{ enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) }, react({ include: /\.(mdx|tsx?)$/ })],
  resolve: {
    alias: { '@lib': fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
