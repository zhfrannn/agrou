import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

// Auto-copy background asset to src/assets
const srcAssetsDir = path.resolve(__dirname, 'src/assets');
if (!fs.existsSync(srcAssetsDir)) {
  fs.mkdirSync(srcAssetsDir, { recursive: true });
}
const srcBgPath = path.resolve(__dirname, 'assets/gro-ai-bg.jpg');
const destBgPath = path.resolve(srcAssetsDir, 'gro-ai-bg.jpg');
if (fs.existsSync(srcBgPath) && !fs.existsSync(destBgPath)) {
  fs.copyFileSync(srcBgPath, destBgPath);
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
