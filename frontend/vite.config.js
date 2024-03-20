import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/post': {
        target: 'https://mern-blog-site-api.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
