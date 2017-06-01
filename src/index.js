import { createServer } from 'http'
import { createProxyServer } from 'http-proxy'
import { api } from './api'
import * as mock from './mock'
import * as log from './log'
import cfg from './config.json'

export function createMock(opts = {}) {
  mock.overrideTpls(JSON.stringify(Object.assign({}, opts, cfg.mock)))
}

export function createMockProxyServer(opts = {}) {
  const proxyCfg = Object.assign({}, opts, cfg.proxy)

  if (!proxyCfg.target) {
    throw new Error('Can not create proxy server without target')
  }

  return createProxyServer(proxyCfg)
    .on('proxyReq', (proxyReq, req, res) => log.proxy(req, res))
}

export function createMockServer(opts = {}) {
  createMock(opts.mock)
  const proxy = createMockProxyServer(opts.proxy)
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

  return createServer(async (req, res) => {
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < len; i += 1) {
      if (res[cfg.close_switch_name]) {
        return
      }
      try {
        await q[i](req, res)
      } catch (e) {
        throw e
      }
    }
  })
}
