import { createServer } from 'http'
import { createProxyServer } from 'http-proxy'
import { api } from './api'
import { mock, overrideTpls } from './mock'
import cfg from './config.json'

export function createMockProxyServer(opts = {}) {
  const proxyCfg = Object.assign({}, opts.proxy, cfg.proxy)

  if (!proxyCfg.target) {
    throw new Error('Can not create proxy server without target')
  }

  return createProxyServer(proxyCfg)
}

export function createMockServer(opts = {}) {
  const q = [
    api,
    mock,
    (req, res) => new Promise((resolve, reject) => {
      try {
        createMockProxyServer(opts.proxy).web(req, res)
        resolve()
      } catch (e) {
        reject(e)
      }
    }),
  ]
  const len = q.length

  overrideTpls(opts.mock)
  createServer(async (req, res) => {
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
  }).listen(opts.port || cfg.port)
}
