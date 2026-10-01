import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: '/mev-training/',
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      generateBundle() {
        const manifestPath = path.join(__dirname, 'public/manifest.json')
        const manifest = fs.readFileSync(manifestPath, 'utf-8')
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: manifest,
        })
      },
    },
  ],
  server: {
    port: 5173,
    open: true
  }
})
