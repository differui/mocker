# node-http-mock
> A HTTP mock server for node.js

## Setup

```js
# install deps
npm install

# build app
npm run build

# build & launch app
npm run start

# run unit test
npm run test
```

## Quick Start

```js
import { createMockServer } from 'node-http-mock'

const server = createMockServer({
  proxy: {
    target: 'your api host',
    changeOrigin: true,
  },
  mock: {
    '/path/to/api': {
      "string|1-10": "★",
    },
  },
})

server.listen(5000)
console.log('Mock server is listening 5000')
```

## Options

**`proxy`**

Proxy settings for [`http-proxy`](https://github.com/nodejitsu/node-http-proxy).

**`mock`**

Mock templates for [`mockjs`](http://mockjs.com/).

## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)
