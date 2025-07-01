import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_browser__',
  entry: 'src/index.ts',
  formats: ['es', 'cjs', 'iife', 'umd'],
  sourcemap: true,
  outDir: '.temp',
  rollupOptions: {
    output: {
      exports: 'named',
      globals: {
        '@tenoxui/moxie': '__tenoxui_moxie__',
        tenoxui: '__tenoxui__'
      }
    },
    external: ['@tenoxui/moxie', 'tenoxui']
  }
})
