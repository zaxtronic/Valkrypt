import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Solo activamos Electron si pasamos una variable de entorno específica
  const isElectron = process.env.ELECTRON === 'true'

  return {
    base: './',
    plugins: [
      vue(),
      // El plugin solo se ejecuta si lanzamos el comando de electron
      isElectron && electron({
        entry: 'main.cjs',
      }),
    ].filter(Boolean), // Filtra el plugin si es false
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      port: 5173,
      strictPort: true,
      // Si es electron no abras el navegador, si es dev normal sí (opcional)
      open: !isElectron, 
    }
  }
})