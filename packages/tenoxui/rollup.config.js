import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import fs from 'fs'
import path from 'path'

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
      banner,
      sourcemap,
      exports: 'named',
      footer: `
        window.makeTenoxUI = TenoxUI.makeTenoxUI;
        window.use = TenoxUI.use;
        window.applyStyles = TenoxUI.applyStyles;
        window.tenoxui = TenoxUI.tenoxui;
      `
    },
    {
      file: `dist/${fileName}.min.js`,
      format: 'iife',
      plugins: [terser()],
      name,
      banner,
      sourcemap,
      exports: 'named',
      footer: `
        window.makeTenoxUI = TenoxUI.makeTenoxUI;
        window.use = TenoxUI.use;
        window.applyStyles = TenoxUI.applyStyles;
        window.tenoxui = TenoxUI.tenoxui;
      `
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
