# node-rnr
> Record & Replay HTTP streams by node.js

<p>
    <a href="LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
    </a>
    <a href="https://github.com/differui/node-rnr/issues">
        <img src="https://img.shields.io/github/issues/differui/node-rnr.svg" alt="Issues" />
    </a>
    <a href="http://standardjs.com/">
        <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide" />
    </ahttp->
    <a href="https://npmjs.org/package/node-rnr">
        <img src="https://img.shields.io/npm/v/node-rnr.svg?style=flat-squar" alt="NPM" />
    </a>
    <a href="https://travis-ci.org/differui/node-rnr">
        <img src="https://travis-ci.org/differui/node-rnr.svg?branch=master" />
    </a>
</p>

## Overview

rnr creates a proxy server between user client and remote server.It records responses from remote server in file system and replays them when user client request again.

```txt

        request   __________  request   ________
user       →     | has      |    →     | remote |
client     ←     | records? |    ←     | server |
        response |__________| response |________|
                      ↑ ↓
                  file system
```

## Usage

Install it:

```js
npm install node-rnr -g
```

### Commands

```bash
rnr --target [remote server host]
```

Proxy:

```bash
# dumb proxy
rnr --target http://localhost:8888
```

Record & Replay:

```bash
# record client requests
rnr --record --target http://localhost:8888

# replay request with records
rnr --replay --target http://localhost:8888
```

See a list of all available options:

```bash
rnr --help
```

### Config File

You can use config file instead of command line options:

```js
// rnr.config.js
module.exports = {
  record: true,
  replay: false,
  port: 5000,
  proxy: {
    target: 'http://localhost:8888',
    changeOrigin: true,
  },
  verbose: true,
}
```

Run this command to use the config file:

```bash
rnr -c # default config file rnr.config.js
rnr -c my.rnr.config.js # customize config file
```

## More

+ [node-http-proxy](https://github.com/nodejitsu/node-http-proxy)

## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)
