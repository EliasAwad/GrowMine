import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // folder where build files are output
    sourcemap: false, // optionally true if you want source maps for debugging
  }
})
