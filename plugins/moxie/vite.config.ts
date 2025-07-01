import { createConfig } from '../../.config/vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_core__',
  entry: 'src/index.ts',
  formats: ['es', 'iife', 'cjs', 'umd'],
  sourcemap: false,
  minify: false
})
