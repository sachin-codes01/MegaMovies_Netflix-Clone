import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite ka config file
// tailwindcss() plugin Tailwind v4 ko project me enable karta hai
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
