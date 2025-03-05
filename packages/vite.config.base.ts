import { Config } from 'vite'

export function createConfig({
  name = 'tenoxui',
  entry = './src/index.ts',
  formats = ['es', 'iife', 'cjs', 'umd'],
  fileName = 'index'
} = {}): Config {
  return {
    build: {
      target: 'es2017',
      lib: {
        name,
        entry,
        formats,
        fileName: (format, name) =>
          `${fileName !== 'index' ? fileName : name}.${format}${format !== 'cjs' ? '.js' : ''}`
      },
      sourcemap: true,
      rollupOptions: {
        output: { exports: 'named' }
      }
    }
  }
}
