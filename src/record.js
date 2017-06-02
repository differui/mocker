import { ensureFileSync, writeJsonSync, outputFileSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { parse as parseUrl } from 'url'
import sha1 from 'sha1'
import * as cfg from './config'
import * as log from './log'
import * as util from './util'

const records = {}

export default async function record(proxyRes, req, res) {
  const recordRoot = cfg.get('record').root

  if (recordRoot) {
    const { pathname, query } = parseUrl(req.url)
    const queryShaSuffix = query ? `_${sha1(query)}` : ''
    const relativePathname = pathname.indexOf('/') === 0 ? pathname.substring(1) : pathname
    const relativeJsonPath = `${relativePathname}${queryShaSuffix}.json`
    const absoluteJsonPath = resolvePath(recordRoot, relativeJsonPath)
    let jsonData

    try {
      jsonData = JSON.parse(await util.parseBody(proxyRes))
    } catch (e) {
      log.error(e, req)
    }

    if (jsonData) {
      records[req.url] = `./${relativeJsonPath}`
      ensureFileSync(absoluteJsonPath)
      writeJsonSync(absoluteJsonPath, jsonData, { spaces: 2 })
      log.record(absoluteJsonPath, req, res)
    }
  }
}

process.on('SIGINT', () => {
  const recordRoot = cfg.get('record').root

  if (recordRoot) {
    const absoluteIndexPath = resolvePath(recordRoot, 'index.js')
    const absoluteRecordsPath = resolvePath(recordRoot, 'records.json')
    let mergeRecords

    try {
      mergeRecords = Object.assign({}, records, require(absoluteRecordsPath))
    } catch (e) {
      mergeRecords = records
    }

    outputFileSync(absoluteRecordsPath, JSON.stringify(mergeRecords, null, 2))
    outputFileSync(absoluteIndexPath, [
      'const apiMapToJson = require(\'./records.json\')',
      'const mockData = {}',
      '',
      'Object.keys(apiMapToJson).forEach(key => mockData[key] = require(apiMapToJson[key]))',
      'module.exports = mockData',
    ].join('\n'))
  }
  process.exit()
})
