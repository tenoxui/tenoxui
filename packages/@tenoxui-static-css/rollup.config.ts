import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import fs from 'node:fs'
import path from 'node:path'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))

const name = 'TenoxUI'
const fileName = 'static-css'
const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */`
const sourcemap = true

const config = [
  {
    input: 'src/ts/dom.ts',
    output: [
      {
        file: `dist/${fileName}.umd.js`,
        format: 'umd',
        name: 'tenoxui',
        banner,
        sourcemap
      },
      {
        file: `dist/${fileName}.umd.min.js`,
        format: 'umd',
        name: 'tenoxui',
        banner,
        sourcemap,
        plugins: [
          terser({
            compress: {
              defaults: true,
              passes: 2
            },
            toplevel: false,
            keep_fnames: true
          })
        ]
      }
    ],
    plugins: [typescript(), resolve(), commonjs()]
  },
  {
    input: 'src/ts/static-css.ts',
    output: [
      {
        file: `dist/${fileName}.js`,
        format: 'es',
        banner,
        sourcemap
      },
      {
        file: `dist/${fileName}.min.js`,
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
    plugins: [typescript(), resolve({ preferBuiltins: true }), commonjs()],
    external: ['glob', 'node-html-parser']
  }
]
export default config
