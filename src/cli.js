import meow from 'meow'
import pkg from '../package.json'

export default meow(`
    Usage
      $ ${pkg.name} --config
      $ ${pkg.name} --target 'http://my-api-server.com:8888'

    Options
      -c, --config  Use config file
      -t, --target  Proxy target url
      -p, --port    Port number for mock server
      -V, --verbose Redirect HTTP streams to stdout
`, {
  boolean: [
    'verbose',
  ],
  string: [
    'config',
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
  },
})
