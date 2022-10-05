import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base : 'https://php72.afk.mk/boxes/boxes2/dist/',
    server: {
        hmr: {
            host: 'localhost'

        },
    },
  plugins: [vue()]
})