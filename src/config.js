const defaultConfig = {
  close_switch_name: '__response_closed',
  config_file_name: 'mock.config.js',
  record_dir_name: '.mock',
  verbose: false,
  port: 5000,
  record: {},
  proxy: {},
  mock: {},
}
const runtimeConfig = {}

export function get(key) {
  return Object.assign({}, defaultConfig, runtimeConfig)[key] || null
}

export function put(key, value) {
  if (Object.hasOwnProperty.call(defaultConfig, key)) {
    runtimeConfig[key] = value
  }
}

export function keys() {
  return Object.keys(Object.assign({}, defaultConfig, runtimeConfig))
}
