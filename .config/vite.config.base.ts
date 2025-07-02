import { Config } from 'vite'
import { resolve } from 'node:path'
export function createConfig({
  name = 'tenoxui',
  entry = './src/index.ts',
  formats = ['es', 'iife', 'cjs', 'umd'],
  fileName = 'index',
  target = 'es2017',
  sourcemap = true,
  minify = true,
  viteOptions = {},
  rollupOptions = {}
} = {}): Config {
  return {
    build: {
      minify,
      sourcemap,
      target,
      lib: {
        name,
        entry,
        formats,
        fileName: (format, name) => `${fileName !== 'index' ? fileName : name}.${format}.js`,
        ...viteOptions
      },
      rollupOptions: {
        output: { exports: 'named' },
        ...rollupOptions
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, '../'),
        '@tenoxui/core': resolve(__dirname, '../packages/core/src')
      }
    }
  }
}
