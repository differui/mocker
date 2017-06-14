import { request as httpRequest } from 'http'
import cfg from './config'

export function createRequest(opts, data = null) {
  const defaultOpts = {
    hostname: 'localhost',
    port: cfg.mock_server_port,
    path: '/',
    method: 'GET',
  }

  return new Promise((resolve, reject) => {
    const requestJson = data ? JSON.stringify(data) : ''
    const requestOpts = Object.assign({}, defaultOpts, opts)

    if (data) {
      requestOpts.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestJson),
      }
    }

    const request = httpRequest(requestOpts, (response) => {
      const reponseBody = []

      response.on('data', (chunk, encoding) => reponseBody.push([chunk, encoding]))
      response.on('end', () => {
        response.body = Buffer.concat(reponseBody.map(([ chunk ]) => chunk)).toString()
        resolve({
          request,
          response,
        })
      })
      response.on('error', reject)
    })

    request.write(requestJson)
    request.end()
  })
}

export function createResponse(succeeded = true, payload) {
  const response = succeeded
    ? { succeeded, data: payload || {} }
    : { succeeded, message: payload || '' }

  return JSON.stringify(response)
}
