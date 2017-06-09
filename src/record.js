import { createWriteStream } from 'fs'
import { ensureFileSync, outputFileSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { parse as parseUrl } from 'url'
import sha1 from 'sha1'
import * as cfg from './config'
import * as log from './log'
import * as util from './util'

const records = {}

function generateBodyId(req, res) {
  const { url, method } = req
  const { statusCode, statusMessage } = res

  return sha1(`${method}${url}${statusMessage}${statusCode}`)
}

function generateMessageDescription(req, res) {
  const messageDescription = {
    version: res.httpVersion,
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    headers: res.headers,
    rawHeaders: res.rawHeaders,
    bodyId: generateBodyId(req, res),
    body: [],
  }

  return new Promise((resolve, reject) => {
    res.on('data', (chunk, encoding) => {
      messageDescription.push([ chunk, encoding ])
    })
    res.on('end', () => {
      messageDescription.trailers = res.trailers
      messageDescription.rawTrailers = res.rawTrailers
      resolve(messageDescription)
    })
    res.on('error', (err) => {
      reject(err)
    })
  })
}

function generateBodyPath(req, res) {
  const recordRoot = cfg.get('record').root
  const bodyId = generateBodyId(req, res)

  return resolvePath(recordRoot, body)
}

function generateMessagePath(req, res) {

}

export default async function record(proxyRes, req, res) {
  const recordRoot = cfg.get('record').root

  if (recordRoot) {
    const { pathname, query } = parseUrl(req.url)
    const queryShaSuffix = query ? `_${sha1(query)}` : ''
    const relativePathname = pathname.indexOf('/') === 0 ? pathname.substring(1) : pathname
    const relativeRecordDataPath = `${relativePathname}${queryShaSuffix}`
    const absoluteRecordDataPath = resolvePath(recordRoot, relativeRecordDataPath)

    try {
      records[req.url] = `./${relativeRecordDataPath}`
      ensureFileSync(absoluteRecordDataPath)
      proxyRes.pipe(createWriteStream(absoluteRecordDataPath))
      log.record(absoluteRecordDataPath, req, res)
    } catch (e) {
      log.error(e, req)
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
