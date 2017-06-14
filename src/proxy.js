import { Agent } from 'http'
import { createProxyServer } from 'http-proxy'
import record from './record'
import replay from './replay'
import * as log from './log'
import * as cfg from './config'

let proxyInstance

function onProxyReq(proxyReq, req, res) {
  if (cfg.get('replay') && cfg.get('record_dir')) {
    replay(req, res)
  } else {
    if (req.body) {
      const bodyData = JSON.stringify(req.body)

      proxyReq.setHeader('Content-Type', 'application/json')
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
      proxyReq.write(bodyData)
    }
    log.proxy(req)
  }
}

function onProxyRes(proxyRes, req, res) {
  if (cfg.get('record') && cfg.get('record_dir')) {
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

function createServer() {
  const proxyCfg = {
    agent: new Agent({ maxSockets: Number.MAX_VALUE }),
    changeOrigin: true,
    target: cfg.get('server'),
  }

  if (!proxyCfg.target) {
    throw new Error('Can not create proxy server without target')
  }

  return createProxyServer(proxyCfg)
    .on('proxyReq', onProxyReq)
    .on('proxyRes', onProxyRes)
    .on('error', onProxyError)
}

export default function proxy(req, res) {
  if (!proxyInstance) {
    proxyInstance = createServer()
  }

  return new Promise((resolve, reject) => {
    try {
      proxyInstance.web(req, res)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
