import { hasOwn } from './util'

const defaultConfig = {
  config_file_name: 'rnr.config.js',
  record_dir_name: '.record',
  record_dir: '',
  record: false,
  replay_dir: '',
  replay: false,
  verbose: false,
  port: 5000,
  proxy: {},
}
const runtimeConfig = Object.assign({}, defaultConfig)

export function has(key) {
  return hasOwn(defaultConfig, key)
}

export function get(key) {
  return has(key) ? runtimeConfig[key] : undefined
}

export function put(key, value) {
  if (has(key)) {
    runtimeConfig[key] = value
  }
}

export function keys() {
  return Object.keys(defaultConfig)
}
