import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Electron compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Inline images up to 500KB as base64 for PDF compatibility
    assetsInlineLimit: 500000
  }
})
