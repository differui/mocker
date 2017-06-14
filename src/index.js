import { resolve as resolvePath } from 'path'
import { ensureDirSync } from 'fs-extra'
import { createServer as createHttpServer } from 'http'
import cli from './cli'
import replay from './replay'
import { createProxyServer } from './proxy'
import { hasOwn, parseBody } from './util'
import * as log from './log'
import * as cfg from './config'

export function createServer(opts = {}) {
  Object.keys(opts).forEach(key => cfg.put(key, opts[key]))
  const recordDir = cfg.get('record_dir')
  const proxyServer = createProxyServer()

  if (recordDir) {
    ensureDirSync(recordDir)
  }

  return createHttpServer(async (req, res) => {
    req.body = await parseBody(req)
    if (cfg.get('replay')) {
      await replay(req, res)
    }
    if (!res.headersSent) {
      proxyServer.web(req, res)
    }
  }).listen(cfg.get('port'))
}

function run() {
  const opts = {}
  const {
    verbose,
    target,
    port,
    record,
    replay,
    both,
  } = cli.flags
  const config = hasOwn(cli.flags, 'config') && (cli.flags.config || cfg.get('config_file_name'))

  if (record || both) {
    opts.record = true
    opts.record_dir = resolvePath(process.cwd(), cfg.get('record_dir_name'))
  }
  if (replay || both) {
    opts.replay = true
    opts.replay_dir = resolvePath(process.cwd(), cfg.get('record_dir_name'))
  }
  if (verbose) {
    opts.verbose = true
  }
  if (port) {
    opts.port = port
  }
  if (target) {
    opts.proxy = opts.proxy || {}
    opts.proxy.target = target
  }
  if (config) {
    Object.assign(opts, require(resolvePath('.', config)))
  }
  if (opts.proxy && opts.proxy.target && opts.proxy.target.indexOf('http://') !== 0) {
    opts.proxy.target = `http://${opts.proxy.target}`
  }
  if (opts.proxy && opts.proxy.target) {
    createServer(opts)
    log.summary()
  } else {
    log.log(cli.help)
  }
}

run()
