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

rnr creating a proxy server between local client and remote server.It recording remote server responses on local file system and responsing client requests with the records in future.

```bash

        request   __________  request   ________
local      →     | has      |    →     | remote |
client     ←     | records? |    ←     | server |
        response |__________| response |________|
                      ↓↑
                  file system
```

## Usage

Install it:

```js
npm install node-rnr -g
```

### Commands

```bash
rnr --server [remote server host]
```

Proxy:

```bash
# dumb proxy
rnr --server http://localhost:8888
```

Record & Replay:

```bash
# record client requests
rnr --record --server http://localhost:8888

# replay request with records
rnr --replay --server http://localhost:8888
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
  server: 'http://localhost:8888',
  verbose: true,
}
```

Run this command to use the config file:

```bash
rnr -c # default config file rnr.config.js
rnr -c my.rnr.config.js # customize config file
```

## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)
