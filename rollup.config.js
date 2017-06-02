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
    'http',
    'boxen',
    'meow',
    'connect',
    'body-parser',
    'path',
    'https',
    'url',
    'util',
    'colors',
    'http-proxy',
    'mockjs',
  ],
  plugins: [
    json(),
    eslint(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    commonjs({
      namedExports: {
        'src/proxy.js': [
          'web',
        ],
      },
    }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    })
  ]
}
