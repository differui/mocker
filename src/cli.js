import meow from 'meow'
import pkg from '../package.json'

export default meow(`
    Usage
      $ ${pkg.bin_name} --config
      $ ${pkg.bin_name} --target [api server host]

    Options
      -c, --config  Use config file
      -r, --reocrd  Record HTTP response to given directory
      -t, --target  Proxy target url
      -p, --port    Port number for mock server
      -v, --verbose Redirect HTTP streams to stdout
      \n
`, {
  boolean: [
    'verbose',
  ],
  string: [
    'config',
    'record',
    'target',
  ],
  number: [
    'port',
  ],
  alias: {
    c: 'config',
    t: 'target',
    p: 'port',
    v: 'verbose',
    r: 'record',
  },
})
