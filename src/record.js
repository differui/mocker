import { createWriteStream } from 'fs'
import { resolve as resolvePath } from 'path'
import sha1 from 'sha1'
import * as cfg from './config'
import { stringifyByOrder, stringifyRequest } from './util'

export function generateMessageDescription(req, res) {
  const messageDescription = {
    request: {
      version: req.httpVersion,
      headers: req.headers,
      url: req.url,
      body: req.body,
    },
    response: {
      version: res.httpVersion,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers,
      body: [],
    },
  }

  return new Promise((resolve, reject) => {
    res.on('data', (chunk, encoding) => {
      messageDescription.response.body.push([chunk, encoding])
    })
    res.on('end', () => {
      messageDescription.response.trailers = res.trailers
      resolve(messageDescription)
    })
    res.on('error', (err) => {
      reject(err)
    })
  })
}

export default async function record(proxyRes, req) {
  const recordDir = cfg.get('record_dir')
  const recordId = sha1(stringifyRequest(req))
  const recordPathname = resolvePath(recordDir, recordId)
  const recordWriteStream = createWriteStream(recordPathname, { defaultEncoding: 'utf8' })
  const recordDescription = await generateMessageDescription(req, proxyRes)

  recordWriteStream.write(stringifyByOrder(recordDescription, 2))
  recordWriteStream.end()
}
