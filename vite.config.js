import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'My Coaching Centre - Dhampur',
          description: 'Best computer and typing coaching in Dhampur.',
        },
      },
    }),
  ],
    server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
