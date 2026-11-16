import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// The demo imports "christmas-aurora" exactly as a consumer would; in this
// repository that name points at the source so edits hot-reload.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { 'christmas-aurora': fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
  },
});
