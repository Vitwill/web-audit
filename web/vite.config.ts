import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // В production для GitHub Pages сайт лежит в подпапке /web-audit/.
  // В development base = '/' — это нужно, чтобы локально всё работало по http://localhost:5173/
  const isProd = mode === 'production';
  const base = isProd ? '/web-audit/' : '/';

  return {
    base,

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        // '@' указывает на папку src/ внутри web/
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },

    server: {
      port: 5173,
      // HMR оставляем включённым. В AI Studio он отключался через DISABLE_HMR,
      // но здесь это уже не нужно — управляем через переменную окружения на случай отладки.
      hmr: process.env.DISABLE_HMR !== 'true',

      // Прокси для разработки: запросы к /api/* идут на локальный Worker (wrangler dev).
      // Это позволяет не прописывать VITE_API_URL в dev-режиме.
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },

    build: {
      // Куда собирать (по умолчанию dist/ внутри web/)
      outDir: 'dist',
      // Очищать dist/ перед сборкой
      emptyOutDir: true,
      // Source maps только для отладки, в прод не нужны
      sourcemap: false,
    },
  };
});