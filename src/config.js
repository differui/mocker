import { hasOwn } from './util'

const defaultConfig = {
  config_file_name: 'rr.config.js',
  record_dir_name: '.record',
  record_dir: '',
  record: false,
  replay: false,
  verbose: false,
  port: 5000,
  server: '',
}
const runtimeConfig = Object.assign({}, defaultConfig)

export function has(key) {
  return hasOwn(defaultConfig, key)
}

export function get(key) {
  if (has(key)) {
    return runtimeConfig[key]
  }
}

export function put(key, value) {
  if (has(key)) {
    runtimeConfig[key] = value
  }
}

export function keys() {
  return Object.keys(defaultConfig)
}
