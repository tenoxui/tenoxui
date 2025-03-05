import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_core__',
  entry: {
    'tenoxui-full': 'src/tenoxui-full.ts',
    tenoxui: 'src/tenoxui.ts'
  },
  formats: ['es', 'iife']
})
