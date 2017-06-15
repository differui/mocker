import { createProxyServer as createServer } from 'http-proxy'
import record from './record'
import * as log from './log'
import * as cfg from './config'

async function onProxyReq(proxyReq, req, res) {
  if (req.body && req.body.length) {
    proxyReq.write(new Buffer(req.body[0]))
    proxyReq.end()
  }
  log.proxy(req, res)
}

function onProxyRes(proxyRes, req, res) {
  if (cfg.get('record')) {
    record(proxyRes, req, res)
  }
}

function onProxyError(e, req, res) {
  res.writeHead(500, {
    'Content-Type': 'application/json',
  })
  res.end(JSON.stringify({
    message: e.message,
  }))
  log.error(e, req, res)
}

export function createProxyServer() {
  const proxyCfg = cfg.get('proxy')

  if (!proxyCfg.target) {
    throw new Error('Can not create proxy server without target')
  }

  return createServer(proxyCfg)
    .on('proxyReq', onProxyReq)
    .on('proxyRes', onProxyRes)
    .on('error', onProxyError)
}
