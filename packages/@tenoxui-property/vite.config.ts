import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_property__',
  entry: {
    'tenoxui-full': 'src/full.ts',
    tenoxui: 'src/default.ts'
  },
  formats: ['es', 'iife', 'cjs', 'umd']
})
