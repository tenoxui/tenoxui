import { createConfig } from '../../.config/vite.config.base.ts'

export default {
  build: createConfig({
    name: '__tenoxui_preset_tailwind__',
    entry: 'src/index.ts',
    formats: ['es', 'iife', 'cjs', 'umd'],
    sourcemap: false
  }).build
}
