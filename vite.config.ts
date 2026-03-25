import { defineConfig } from 'vite';

export default defineConfig({
  base: '/bingo/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
