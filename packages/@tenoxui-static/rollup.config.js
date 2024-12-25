import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
const name = '__tenoxui_static'
const banner = `/*!
 * ${packageJson.name} v${packageJson.version} | ${packageJson.license} License
 * Copyright (c) 2024-present NOuSantx
 */`
const sourcemap = true //# PROD_TRUE

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap,
      name,
      banner
    },
    {
      file: 'dist/index.min.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap,
      name,
      plugins: [
        terser({
          format: {
            comments: false,
            preamble: banner
          },
          mangle: false,
          mangle: true,
          compress: {
            defaults: true,
            passes: 2
          }
        })
      ]
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      exports: 'named',
      sourcemap,
      name,
      banner
    },
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      exports: 'named',
      sourcemap,
      name,
      plugins: [
        terser({
          format: {
            comments: false,
            preamble: banner
          },
          mangle: false,
          mangle: true,
          compress: {
            defaults: true,
            passes: 2
          }
        })
      ]
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      banner,
      sourcemap
    },
    {
      file: 'dist/index.esm.min.js',
      sourcemap,
      format: 'es',
      plugins: [
        terser({
          format: {
            comments: false,
            preamble: banner
          },
          mangle: true,
          compress: {
            defaults: true,
            passes: 2
          }
        })
      ]
    }
  ],
  plugins: [typescript(), resolve(), commonjs()]
}

export default config
