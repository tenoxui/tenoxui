import fs from 'node:fs'

const { name, version, license } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default {
  target: 'es2018',
  entry: 'src/index.ts',
  banner: `//! ${name} v${version} | ${license} (c) ${new Date().getFullYear()} TenoxUI`,
  format: ['esm', 'cjs', 'iife'],
  minify: false,
  sourcemap: false,
  outputOptions: {
    name: '__tenoxui_core__'
  }
}
