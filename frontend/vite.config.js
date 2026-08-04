import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: true expone el servidor en la IP de LAN, para que la segunda
    // máquina de la demo pueda abrir el frontend.
    host: true,
    port: 5173,
    watch: {
      // El repo vive en /mnt/d (unidad de Windows montada en WSL), donde no
      // llegan los eventos inotify: sin polling Vite no detecta los cambios y
      // sigue sirviendo el módulo antiguo hasta que se reinicia a mano.
      usePolling: true,
      interval: 300,
    },
  },
})
