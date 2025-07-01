import { createConfig } from '../vite.config.base.ts'

export default createConfig({
  name: '__tenoxui_preset_tailwind__',
  entry: 'src/index.ts',
  formats: ['es', 'iife', 'cjs', 'umd'],
  sourcemap: false
})
