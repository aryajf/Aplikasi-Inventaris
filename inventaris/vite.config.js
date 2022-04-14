import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',  
      manifest: {
        "name":"Inventaris",
        "short_name":"Inventaris",
        "theme_color":"#8463ff",
        "icons":[
          {"src":"./img/icons/android-chrome-144x144.png", "sizes":"144x144","type":"image/png"},
        ],
        "start_url":".",
        "display":"standalone",
        "background_color":"#FFFFFF"
      },
      workbox: {
        // workbox options for generateSW
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src") // map '@' to './src' 
    },
  }
})
