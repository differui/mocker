import connect from 'connect'
import { resolve as resolvePath } from 'path'
import { ensureDirSync } from 'fs-extra'
import { json, urlencoded } from 'body-parser'
import { createServer as createHttpServer } from 'http'
import cli from './cli'
import proxy from './proxy'
import { hasOwn } from './util'
import * as log from './log'
import * as cfg from './config'

export function createServer(opts = {}) {
  Object.keys(opts).forEach(key => cfg.put(key, opts[key]))

  const recordDir = cfg.get('record_dir')
  const app = connect()
    .use(json({
      extended: true,
    }))
    .use(urlencoded({
      extended: true,
    }))
    .use(proxy)

  if (recordDir) {
    ensureDirSync(recordDir)
  }

  return createHttpServer(app)
    .listen(cfg.get('port'))
}

function run() {
  const opts = {}
  const { verbose, server, port, record, replay, both } = cli.flags
  const config = hasOwn(cli.flags, 'config') && (cli.flags.config || cfg.get('config_file_name'))

  if (record || both) {
    opts.record = true
    opts.record_dir = resolvePath(process.cwd(), cfg.get('record_dir_name'))
  }
  if (replay || both) {
    opts.replay = true
  }
  if (verbose) {
    opts.verbose = true
  }
  if (port) {
    opts.port = port
  }
  if (server) {
    opts.server = server
  }
  if (config) {
    Object.assign(opts, require(resolvePath('.', config)))
  }
  if (opts.server && opts.server.indexOf('http://') !== 0) {
    opts.server = `http://${opts.server}`
  }
  if (opts.server) {
    createServer(opts)
    log.summary(opts)
  } else {
    log.log(cli.help)
  }
}

run()
