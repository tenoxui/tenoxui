import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
const name = '__tenoxui'
const fileName = 'js/tenoxui'
const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */`
const sourcemap = true
const config = {
  input: 'src/ts/tenoxui.ts',
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
                // Core names
                '__tenoxui',
                'MakeTenoxUI',
                // Main functions
                'use',
                'applyStyles',
                'tenoxui',
                // Core methods
                'setDefaultStyles',
                'useDOM',
                'applyStyles',
                'applyMultiStyles',
                'applyDefaultStyles',
                // Parameters & Types
                'element',
                'property',
                'values',
                'breakpoints',
                'classes',
                'instances',
                'defaultStyles',
                'customConfig',
                'styledElement',
                'selector',
                'styles',
                'options',
                'useDom',
                'useClass',
                'customEngine',
                'styler'
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
            comments: false,
            preserve_annotations: true
          },
          keep_classnames: true,
          keep_fnames:
            /MakeTenoxUI|use|useDOM|setDefaultStyles|applyStyles|applyMultiStyles|applyDefaultStyles|tenoxui/
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
