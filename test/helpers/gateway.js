import { createServer } from 'http'
import { responseJson } from '../../src/util'
import cfg from './config'

let server

function isMatch(url, pattern) {
  return new RegExp(`^/gateway/${pattern}`, 'i').test(url)
}

function response(req, res, opts = {}) {
  opts.data = opts.data || {}
  opts.data.url = req.url
  responseJson(req, res, 200, JSON.stringify(opts.data))
}

export function createGatewayServer(port = cfg.gateway_server_port) {
  if (server) {
    throw 'Gateway server was created'
  }
  server = createServer((req, res) => {
    if (isMatch(req.url, 'a')) {
      response(req, res)
    } else if (isMatch(req.url, 'b')) {
      response(req, res)
    }
  }).listen(port)

  return server
}

export function closeGatewayServer() {
  if (server) {
    server.close()
    server = null
  }
}
