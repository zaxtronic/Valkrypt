import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isElectron = process.env.ELECTRON === 'true'

  return {
    base: './', 
    plugins: [
      vue(),
      isElectron && electron([
        {
          entry: 'main.cjs',
        }
      ]),
    ].filter(Boolean),
    
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    
    server: {
      // Si lanzas Electron, usa el 5173. Si lanzas Dev normal, usa el 5174.
      port: isElectron ? 5173 : 5174,
      strictPort: true,
      // Solo abre el navegador automáticamente si NO es Electron
      open: !isElectron, 
    }
  }
})