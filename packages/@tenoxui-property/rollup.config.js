import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))

const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */`
const name = 'tenoxui'
const sourcemap = true
const terserConf = {
  format: {
    comments: false,
    beautify: true,
    preamble: banner
  }
}
const terserConfMin = {
  format: {
    comments: false,
    preamble: banner,
    preserve_annotations: true
  },
  compress: {
    defaults: true,
    passes: 2
  },
  toplevel: true,
  keep_fnames: false
}

const config = {
  input: 'src/default.ts',
  output: [
    {
      file: `dist/default.esm.js`,
      format: 'es',
      sourcemap,
      plugins: [terser(terserConf)]
    },
    {
      file: `dist/default.esm.min.js`,
      format: 'es',
      sourcemap,
      plugins: [terser(terserConfMin)]
    },
    {
      file: `dist/default.umd.js`,
      format: 'umd',
      sourcemap,
      name,
      plugins: [terser(terserConf)]
    },
    {
      file: `dist/default.umd.min.js`,
      format: 'umd',
      sourcemap,
      name,
      plugins: [terser(terserConfMin)]
    },
    {
      file: `dist/default.cjs`,
      format: 'cjs',
      sourcemap,
      plugins: [terser(terserConf)]
    },
    {
      file: `dist/default.cjs`,
      format: 'cjs',
      sourcemap,
      plugins: [terser(terserConfMin)]
    }
  ],
  plugins: [typescript(), resolve(), commonjs()]
}

export default config
