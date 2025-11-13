import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs-extra'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-css-and-js-to-plugin',
      closeBundle: async () => {
        const pluginDir = path.resolve(__dirname, '../wordpress/wp-content/plugins/homenest-chatbot/assets')
        await fs.ensureDir(path.join(pluginDir, 'js'))
        await fs.ensureDir(path.join(pluginDir, 'css'))

        await fs.copyFile(
          path.resolve(__dirname, 'dist/js/bundle.iife.js'),
          path.join(pluginDir, 'js/bundle.js')
        )

        await fs.copyFile(
          path.resolve(__dirname, 'src/styles/global.css'),
          path.join(pluginDir, 'css/widget.css')
        )

        console.log('✅ Build JS + CSS đã copy vào plugin WordPress xong!')
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'ChatWidget',
      fileName: 'js/bundle',
      formats: ['iife']
    },
    rollupOptions: {
      // không external React, bundle chung luôn
      // external: [], // <- KHÔNG cần nữa
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process': JSON.stringify({ env: { NODE_ENV: 'production' } }) // 👈 thêm dòng này
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
