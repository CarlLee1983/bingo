import { defineConfig } from 'vite';

export default defineConfig({
  base: '/bingo/',
  build: {
    outDir: 'docs',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
