import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_browser__',
  entry: 'src/index.ts',
  formats: ['iife', 'umd'],
  sourcemap: true,
  viteOptions: {
    fileName: (f) => `bundle.${f}.js`
  }
})
