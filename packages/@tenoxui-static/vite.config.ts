import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_static__',
  rollupOptions: {
    external: ['@tenoxui/moxie'],
    output: {
      globals: {
        '@tenoxui/moxie': '__tenoxui_moxie__'
      },
      exports: 'named'
    }
  }
})
