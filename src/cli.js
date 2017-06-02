import meow from 'meow'
import pkg from '../package.json'

export default meow(`
    Usage
      $ ${pkg.bin_name} --config
      $ ${pkg.bin_name} --target [api server host]

    Options
      -c, --config  Use config file
      -r, --reocrd  Record HTTP response to current directory
      -t, --target  Proxy target url
      -h, --host    Mock server host name
      -p, --port    Mock server port number
      -v, --verbose Redirect HTTP streams to stdout
      \n
`, {
  boolean: [
    'verbose',
    'record',
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
    r: 'record',
  },
})
