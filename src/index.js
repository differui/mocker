import connect from 'connect'
import { resolve as resolvePath } from 'path'
import { json, urlencoded } from 'body-parser'
import { createServer, Agent } from 'http'
import { createProxyServer } from 'http-proxy'
import api from './api'
import cli from './cli'
import * as util from './util'
import * as mock from './mock'
import * as log from './log'
import * as cfg from './config'

export function createMockProxyServer() {
  const proxyCfg = Object.assign({
    agent: new Agent({ maxSockets: Number.MAX_VALUE }),
  }, cfg.get('proxy'))

  if (!proxyCfg.target) {
    throw new Error('Can not create proxy server without target')
  }

  return createProxyServer(proxyCfg)
    .on('proxyReq', (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body)

        proxyReq.setHeader('Content-Type', 'application/json')
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        proxyReq.write(bodyData)
      }
      log.proxy(req)
    })
    .on('proxyRes', (proxyReq, req, res) => log.proxy(req, res))
    .on('error', (e, req, res) => {
      util.writeResponseFailed(req, res, e.message)
      log.error(e, req, res)
    })
}

export function createMockServer(opts = {}) {
  Object.keys(opts).forEach(key => cfg.put(key, opts[key]))
  mock.overrideTpls(cfg.get('mock'))

  const proxy = createMockProxyServer()
  const q = [
    api,
    mock.mock,
    (req, res) => new Promise((resolve, reject) => {
      try {
        proxy.web(req, res)
        resolve()
      } catch (e) {
        reject(e)
      }
    }),
  ]
  const len = q.length
  const app = connect()
    .use(json({
      extended: true,
    }))
    .use(urlencoded({
      extended: true,
    }))
    .use(async (req, res) => {
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < len; i += 1) {
        if (res[cfg.get('close_switch_name')]) {
          return
        }
        try {
          await q[i](req, res)
        } catch (e) {
          throw e
        }
      }
    })

  return createServer(app)
    .on('upgrade', (req, socket, head) => proxy.ws(req, socket, head))
    .listen(cfg.get('port'))
}

function run() {
  const opts = {}
  const { verbose, target, port } = cli.flags
  const config = Object.hasOwnProperty.call(cli.flags, 'config') &&
    (cli.flags.config || cfg.get('config_file_name'))

  if (verbose) {
    opts.verbose = true
  }
  if (config) {
    try {
      const configFile = require(resolvePath('.', config))
      Object.keys(configFile).forEach(key => cfg.put(key, configFile[key]))
    } catch (e) {
      throw new Error(`Can not load config file ${config}`)
    }
  }
  if (target) {
    opts.proxy = opts.proxy || {}
    opts.proxy.target = target
  }
  if (port) {
    opts.port = port
  }

  if (opts.proxy && opts.proxy.target) {
    createMockServer(opts)
    log.summary(config)
  }
}

run()
