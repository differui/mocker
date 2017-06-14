import meow from 'meow'
import pkg from '../package.json'

export default meow(`
    Usage
      $ ${pkg.bin_name} --config
      $ ${pkg.bin_name} --server [remote server host]

    Options
      -1, --record  Record HTTP response
      -2, --replay  Response HTTP request with records
      -3, --both    Record && Replay
      -c, --config  Use config file
      -t, --target  Remote server host
      -h, --host    ${pkg.bin_name} proxy server host name
      -p, --port    ${pkg.bin_name} proxy server port number
      -v, --verbose Output logs to stdout
      \n
`, {
  boolean: [
    'verbose',
    'proxy',
    'record',
    'replay',
    'both',
  ],
  string: [
    'config',
    'target',
    'host',
  ],
  number: [
    'port',
  ],
  alias: {
    c: 'config',
    t: 'target',
    p: 'port',
    h: 'host',
    v: 'verbose',
    0: 'proxy',
    1: 'record',
    2: 'replay',
    3: 'both',
  },
})
