import sha1 from 'sha1'
import { existsSync } from 'fs'
import { readJsonSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { stringifyRequest } from './util'
import * as cfg from './config'
import * as log from './log'

export default function replay(req, res) {
  const recordDir = cfg.get('record_dir')
  const recordId = sha1(stringifyRequest(req))
  const recordPath = resolvePath(recordDir, recordId)

  if (!existsSync(recordPath)) {
    return
  }

  const { body, headers, statusCode, statusText } = readJsonSync(recordPath).response

  res.writeHead(statusCode, statusText, headers)
  body.forEach(([chunk]) => {
    res.write(new Buffer(chunk))
  })
  res.end()
  log.replay(recordPath, req, res)
}
