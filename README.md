# node-http-mock
> A HTTP mock server for node.js

## Usage

Install it:

```js
npm install node-http-mock -g
```

And run this command in your termial:

```bash
node-http-mock -t [api host] -p [local port] -c [config file]
```

### Options

Run this command to see a list of all available options:

```bash
node-http-mock --help
```

### Config

You can use config file instead of command line options:

```js
module.exports = {
  port: 9999,
  verbose: true,
  proxy: {
    target: 'api host',
    changeOrigin: true,
  },
  mock: {
    '/path/to/to/api/1': {},
    '/path/to/to/api/2': {},
  },
}
```

## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)
