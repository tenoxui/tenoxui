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
 * tenoxui/core v${packageJson.version}
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
        terser({
          mangle: {
            properties: {
              regex: /^[^_]/,
              reserved: [
                '__tenoxui_core',
                'MakeTenoxUI',
                // Public methods
                'setDefaultStyles',
                'useDOM',
                'applyStyles',
                'applyMultiStyles',
                'applyDefaultStyles',
                // Params & Instance
                'element',
                'property',
                'values',
                'breakpoints',
                'classes',
                'instances',
                'defaultStyles',
                // Others
                'create',
                'getInstance',
                'setDefaultStyles',
                'getDefaultStyles'
              ]
            }
          },
          compress: {
            defaults: true,
            passes: 2,
            pure_getters: true,
            unsafe_methods: true
          },
          format: {
            // comments: false,
            preserve_annotations: true
          },
          keep_classnames: true,
          keep_fnames:
            /MakeTenoxUI|useDOM|setDefaultStyles|applyStyles|applyMultiStyles|applyDefaultStyles/
        })
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
