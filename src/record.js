import { ensureFileSync, writeJsonSync, outputFileSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { parse as parseUrl } from 'url'
import * as cfg from './config'
import * as log from './log'
import * as util from './util'

const records = {}

export async function proxy(proxyRes, req, res) {
  const recordRoot = cfg.get('record').root

  if (recordRoot) {
    const urlObj = parseUrl(req.url)
    const pathname = urlObj.pathname.indexOf('/') === 0 ? urlObj.pathname.substring(1) : urlObj.pathname
    const jsonPath = resolvePath(recordRoot, `${pathname}.json`)
    const jsonData = await util.parseBody(proxyRes)

    try {
      records[urlObj.pathname] = `./${pathname}.json`
      ensureFileSync(jsonPath)
      writeJsonSync(jsonPath, JSON.parse(jsonData), { spaces: 2 })
      log.record(jsonPath, req, res)
    } catch (e) {
      log.error(e, req)
    }
  }
}

process.on('SIGINT', () => {
  const recordRoot = cfg.get('record').root

  if (recordRoot) {
    const requireData = []

    Object.keys(records).forEach(key => requireData.push(`'${key}': require('${records[key]}')`))
    outputFileSync(resolvePath(recordRoot, 'index.js'), `module.exports = {\n  ${requireData.join(',\n  ')}\n}`)
  }
  process.exit()
})
