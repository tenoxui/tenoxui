import { Config } from 'vite'
import { resolve } from 'node:path'
console.log(resolve(__dirname, '../'))
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
        '@tenoxui/types': resolve(__dirname, '../packages/types'),
        '@tenoxui/core': resolve(__dirname, '../packages/core/src'),
        '@tenoxui/browser': resolve(__dirname, '../packages/browser/src'),
        '@tenoxui/moxie': resolve(__dirname, '../packages/moxie/src'),
        '@tenoxui/preset-tailwind': resolve(__dirname, '../packages/preset-tailwind/src'),
        '@tenoxui/tenoxui': resolve(__dirname, '../packages/tenoxui/src')
      }
    }
  }
}
