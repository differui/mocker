# node-http-mock
> A HTTP mock server for node.js

## Usage

Install it:

```js
npm install node-http-mock -g
```

And run this command in your termial:

```bash
mock -t [api host] -p [local port] -c [config file]
```

### Config File

You can use config file instead of command line options:

```js
// mock.config.js
module.exports = {
  port: 5000,
  verbose: true,
  proxy: {
    target: 'api host',
    changeOrigin: true,
  },
  mock: {
    '/url_a': {},
    '/url_b': {},
  },
}
```

Run this command to use the config file:

```bash
mock -c # default config file mock.config.js
mock -c my.mock.config.js # customize config file
```

### Record & Replay

`node-http-mock` can construct mock data from real HTTP streams.It identify APIs according to request url, request method and query strings.

```bash
[method] [url] ? [query string]
```

Use `-r` option to recording these responses to ordinary JSON files and create a `mock.js` tracing those files:

```bash
mock -r [directory path]
```

Press `Crtl-C` will terminate recording.After that you can import the `mock.js` into your config file manually:

```js
module.exports = {
  // ...
  mock: require('./mock.js'),
}
```

### Options

Run this command to see a list of all available options:

```bash
mock --help
```

## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)
