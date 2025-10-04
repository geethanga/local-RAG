import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output to the server's public directory
    outDir: '../src/public',
    emptyOutDir: true,
    // Ensure proper asset paths
    assetsDir: 'assets',
  },
  server: {
    // Proxy API calls to the backend during development
    proxy: {
      '/query': 'http://localhost:3000',
      '/documents': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  },
  // Ensure proper base path
  base: '/',
})
