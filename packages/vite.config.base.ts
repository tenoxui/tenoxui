import { Config } from 'vite'

export function createConfig({
  name = 'tenoxui',
  entry = './src/index.ts',
  formats = ['es', 'iife', 'cjs', 'umd'],
  fileName = 'index',
  viteOptions = {},
  rollupOptions = {}
} = {}): Config {
  return {
    build: {
      // minify: false,
      target: 'es2017',
      lib: {
        name,
        entry,
        formats,
        fileName: (format, name) =>
          `${fileName !== 'index' ? fileName : name}.${format}${format !== 'cjs' ? '.js' : ''}`,
        ...viteOptions
      },
      sourcemap: true,

      rollupOptions: {
        output: { exports: 'named' },
        ...rollupOptions
      }
    }
  }
}
