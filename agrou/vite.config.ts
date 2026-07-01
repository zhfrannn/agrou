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
const assetsToCopy = ['gro-ai-bg.jpg', 'sidebar-kiri-a.png', 'sidebar-kanan-a.png', 'sidebar-kiri-b.png', 'sidebar-kanan-b.png'];
assetsToCopy.forEach((file) => {
  const srcPath = path.resolve(__dirname, 'assets', file);
  const destPath = path.resolve(srcAssetsDir, file);
  if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

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
