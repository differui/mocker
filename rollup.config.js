const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')

export default {
  entry: './src/index.js',
  dest: './dest/bundle.js',
  format: 'cjs',
  external: [
    'fs',
    'http',
    'boxen',
    'meow',
    'url',
    'fs-extra',
    'path',
    'colors',
    'http-proxy',
    'sha1',
  ],
  plugins: [
    json(),
    eslint(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    commonjs(),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    })
  ]
}
