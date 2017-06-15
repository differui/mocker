import { createWriteStream } from 'fs'
import { resolve as resolvePath } from 'path'
import sha1 from 'sha1'
import * as cfg from './config'
import * as log from './log'
import {
  convertRawHeaders,
  parseBody,
  stringifyByOrder,
  stringifyRequest,
} from './util'

async function generateMessageDescription(req, res) {
  return {
    request: {
      method: req.method,
      version: req.httpVersion,
      headers: convertRawHeaders(req.rawHeaders),
      url: req.url,
      body: req.body,
    },
    response: {
      version: res.httpVersion,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: convertRawHeaders(res.rawHeaders),
      body: await parseBody(res),
      trailers: res.trailers,
    },
  }
}

export default async function record(proxyRes, req, res) {
  const recordDir = cfg.get('record_dir')
  const recordId = sha1(stringifyRequest(req))
  const recordPathname = resolvePath(recordDir, recordId)
  const recordWriteStream = createWriteStream(recordPathname, { defaultEncoding: 'utf8' })
  const recordDescription = await generateMessageDescription(req, proxyRes)

  recordWriteStream.write(stringifyByOrder(recordDescription, 2))
  recordWriteStream.end()
  log.record(req, res)
}
