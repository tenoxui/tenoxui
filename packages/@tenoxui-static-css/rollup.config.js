import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import fs from 'fs'
import path from 'path'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))

const name = 'TenoxUI'
const fileName = 'tenoxui'
const banner = `/*!
 * tenoxui/core v${packageJson.version}
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */`
const sourcemap = true

const config = {
  input: 'src/tenoxui.ts',
  output: [
    {
      file: `dist/${fileName}.js`,
      format: 'iife',
      name,
      banner,
      sourcemap,
      footer: 'window.makeTenoxUI = TenoxUI.makeTenoxUI'
    },
    {
      file: `dist/${fileName}.min.js`,
      format: 'iife',
      plugins: [terser()],
      name,
      banner,
      sourcemap,
      footer: 'window.makeTenoxUI = TenoxUI.makeTenoxUI'
    },
    {
      file: `dist/${fileName}.esm.js`,
      format: 'es',
      banner,
      sourcemap
    },
    {
      file: `dist/${fileName}.esm.min.js`,
      format: 'es',
      banner,
      sourcemap,
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
