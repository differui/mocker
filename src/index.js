import connect from 'connect'
import { resolve as resolvePath } from 'path'
import { json, urlencoded } from 'body-parser'
import { createServer } from 'http'
import api from './api'
import cli from './cli'
import * as proxy from './proxy'
import * as mock from './mock'
import * as log from './log'
import * as cfg from './config'

export function createMockServer(opts = {}) {
  Object.keys(opts).forEach(key => cfg.put(key, opts[key]))
  mock.overrideTpls(cfg.get('mock'))

  const q = [
    api,
    mock.mock,
    proxy.proxy,
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
    .listen(cfg.get('port'))
}

function run() {
  const opts = {}
  const { verbose, target, host, port } = cli.flags
  const config = Object.hasOwnProperty.call(cli.flags, 'config') &&
    (cli.flags.config || cfg.get('config_file_name'))

  if (verbose) {
    opts.verbose = true
  }
  if (config) {
    try {
      Object.assign(opts, require(resolvePath('.', config)))
    } catch (e) {
      throw new Error(`Can not load config file ${config}`)
    }
  }
  if (target) {
    opts.proxy = opts.proxy || {}
    opts.proxy.target = target
  }
  if (host) {
    opts.host = host
  }
  if (port) {
    opts.port = port
  }
  if (opts.proxy && opts.proxy.target && opts.proxy.target.indexOf('http://') !== 0) {
    opts.proxy.target = `http://${opts.proxy.target}`
  }
  if ((opts.proxy && opts.proxy.target) || config) {
    createMockServer(opts)
    log.summary(config)
  } else {
    console.log(cli.help)
  }
}

run()
