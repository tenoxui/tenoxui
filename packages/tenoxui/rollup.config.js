import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
const name = 'TenoxUI'
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
      format: 'iife',
      name,
      sourcemap,
      exports: 'named',
      footer: `window.makeTenoxUI = TenoxUI.makeTenoxUI;
window.use = TenoxUI.use;
window.applyStyles = TenoxUI.applyStyles;
window.tenoxui = TenoxUI.tenoxui;`,
      plugins: [
        terser({
          format: {
            comments: false,
            beautify: true,
            preamble: banner
          },
          keep_fnames: true
        })
      ]
    },
    {
      file: `dist/${fileName}.min.js`,
      format: 'iife',
      name,
      sourcemap,
      exports: 'named',
      plugins: [
        terser({
          format: {
            comments: false,
            preamble: banner
            //preserve_annotations: true
          },
          compress: {
            defaults: true,
            passes: 2
          },
          mangle: {
            properties: true
          },
          // toplevel: true,
          keep_fnames: true
        })
      ],
      footer: `
window.makeTenoxUI = TenoxUI.makeTenoxUI;
window.use = TenoxUI.use;
window.applyStyles = TenoxUI.applyStyles;
window.tenoxui = TenoxUI.tenoxui;`
    },
    {
      file: `dist/${fileName}.esm.js`,
      format: 'es',
      sourcemap,
      plugins: [
        terser({
          format: {
            comments: false,
            beautify: true,
            preamble: banner
          }
        })
      ]
    },
    {
      file: `dist/${fileName}.esm.min.js`,
      format: 'es',

      sourcemap,
      plugins: [
        terser({
          format: {
            comments: false,
            preamble: banner,
            preserve_annotations: true
          },
          compress: {
            defaults: true,
            passes: 2
          },
          mangle: {
            properties: true
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
