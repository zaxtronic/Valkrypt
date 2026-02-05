import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true'

  return {
    base: './', // Fundamental para que el ejecutable encuentre los archivos
    plugins: [
      vue(),
      isElectron && electron([
        {
          // Configuración para el proceso Main
          entry: 'main.cjs',
        }
      ]),
    ].filter(Boolean),
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      port: 5173,
      strictPort: true,
      open: !isElectron, // Si es dev web abre navegador, si es electron no
    }
  }
})