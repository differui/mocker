const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint')
const replace = require('rollup-plugin-replace')
const nodeResolve = require('rollup-plugin-node-resolve')
const hypothetical = require('rollup-plugin-hypothetical')
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
    hypothetical({
      allowRealFiles: true,
      files: {
        './node_modules/core-js/library/modules/es6.object.to-string.js': 'export default null',
      },
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    nodeResolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    })
  ]
}
