import meow from 'meow'
import pkg from '../package.json'

export default meow(`
    Usage
      $ ${pkg.bin_name} --config
      $ ${pkg.bin_name} --target [remote server host]

    Options
      -1, --record   Record HTTP response
      -2, --replay   Response HTTP request with records
      -3, --both     Record && Replay
      -c, --config   Use config file
      -t, --target   Remote server host
      -h, --host     ${pkg.bin_name} proxy server host name
      -p, --port     ${pkg.bin_name} proxy server port number
      -s, --strategy How to define same
      -v, --verbose  Output logs to stdout

    Strategy

      simple  Just compare method and pathname between

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
