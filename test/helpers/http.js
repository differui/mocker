import { request as httpRequest } from 'http'
import cfg from './config'
import { parseBody } from '../../src/util'

export function createRequest(opts, data = null) {
  const defaultOpts = {
    hostname: 'localhost',
    port: cfg.mock_server_port,
    path: '/',
    method: 'GET',
  }

  return new Promise((resolve, reject) => {
    const reqJson = data ? JSON.stringify(data) : ''
    const reqOpts = Object.assign({}, defaultOpts, opts)

    if (data) {
      reqOpts.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(reqJson),
      }
    }

    const req = httpRequest(reqOpts, async (res) => {
      res.body = (await parseBody(res)).toString()
      resolve({
        request: req,
        response: res,
      })
    })

    req.write(reqJson)
    req.end()
  })
}

export function createResponse(succeeded = true, payload) {
  const res = succeeded
    ? { succeeded, data: payload || {} }
    : { succeeded, message: payload || '' }

  return JSON.stringify(res)
}
