import sha1 from 'sha1'
import { existsSync } from 'fs'
import { readJsonSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { stringifyRequest } from './util'
import * as cfg from './config'
import * as log from './log'

export default function replay(req, res) {
  return new Promise((resolve, reject) => {
    const replayDir = cfg.get('replay_dir')
    const recordId = sha1(stringifyRequest(req))
    const recordPath = resolvePath(replayDir, recordId)

    if (existsSync(recordPath)) {
      const {
        body,
        headers,
        statusCode,
        statusText,
      } = readJsonSync(recordPath).response

      Object.keys(headers).forEach(key => res.setHeader(key, headers[key]))
      res.writeHead(statusCode, statusText)
      res.write(new Buffer(body[0]))
      res.end()
      log.replay(req, res)
    }
    resolve()
  })
}
