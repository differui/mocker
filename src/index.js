import { green } from 'colors'
import { createServer } from 'http'
import proxy from './proxy'
import { api } from './api'
import { mock } from './mock'
import cfg from './config.json'

const q = [
  api,
  mock,
  (req, res) => {
    return new Promise((resolve, reject) => {
      try {
        proxy.web(req, res)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
]
const len = q.length

createServer(async (req, res) => {
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
}).listen(cfg.port)

