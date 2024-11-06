import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))

const name = '__tenoxui_core'
const fileName = 'tenoxui'
const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */`
const sourcemap = true

const config = {
  input: 'src/tenoxui.ts',
  output: [
    {
      file: `dist/${fileName}.js`,
      format: 'umd',
      name,
      banner,
      sourcemap,
      exports: 'named'
    },
    {
      file: `dist/${fileName}.min.js`,
      format: 'umd',
      name,
      banner,
      sourcemap,
      exports: 'named',
      plugins: [
        terser()
      ]
    },
    {
      file: `dist/${fileName}.esm.js`,
      format: 'es',
      banner,
      sourcemap,
      exports: 'named'
    },
    {
      file: `dist/${fileName}.esm.min.js`,
      format: 'es',
      banner,
      sourcemap,
      exports: 'named',
      plugins: [
        terser({
          mangle: {
            properties: true
          },
          compress: {
            defaults: true,
            passes: 2
          },
          toplevel: true,
          keep_fnames: false
        })
      ]
    }
  ],
  plugins: [typescript(), resolve(), commonjs()]
}

export default config
