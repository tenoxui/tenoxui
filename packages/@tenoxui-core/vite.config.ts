import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_core__',
  entry: 'src/index.ts',
  formats: ['es', 'iife', 'cjs', 'umd'],
  sourcemap: false
  /*
  rollupOptions: {
    output: {
      exports: 'named',
      globals: {
        '@tenoxui/moxie': '__tenoxui_moxie__'
      }
    },
    external: ['@tenoxui/moxie']
  }
  */
})
