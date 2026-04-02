import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error - node:path types might not be found during config build
import path from 'node:path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: false,
      },
    }),
  ],
  define: {
    'process.env': {},
    'process.browser': true,
    'process.nextTick': '(function(cb) { setTimeout(cb, 0); })',
    'process.hrtime': '(function() { const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now(); const s = Math.floor(now / 1000); const ns = Math.floor((now % 1000) * 1000000); return [s, ns]; })',
  },
  server: {
    port: 5174,
  }
})
