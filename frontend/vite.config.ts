import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api/* to Django so the browser sees one origin (no CORS needed).
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
