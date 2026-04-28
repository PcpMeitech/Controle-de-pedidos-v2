import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Controle-de-pedidos-v2/',
  plugins: [react()],
})