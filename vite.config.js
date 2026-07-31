import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite ka config file
// tailwindcss() plugin Tailwind v4 ko project me enable karta hai
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // TMDB_KEY .env se load karte hain (VITE_ prefix nahi, isliye client bundle me nahi jaata)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Production me yehi kaam Netlify Function (netlify/functions/tmdb.js) karta hai.
        // Dev me hum seedhe TMDB ko proxy kar dete hain taaki alag se `netlify dev` na chalana pade.
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => {
            const [pathname, query] = path.replace(/^\/api\/tmdb/, '').split('?')
            const params = new URLSearchParams(query)
            params.set('api_key', env.TMDB_KEY)
            return `${pathname}?${params.toString()}`
          },
        },
      },
    },
  }
})
