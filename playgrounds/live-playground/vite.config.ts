import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'node:path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      tenoxui: path.resolve(__dirname, '../../packages/core/src/tenoxui-full.ts')
    }
  }
})
