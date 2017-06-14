import { stringifyByOrder } from '../../src/util'

export function isSameJson(a, b) {
  const objA = typeof a === 'string' ? JSON.parse(a) : a
  const objB = typeof b === 'string' ? JSON.parse(b) : b

  return stringifyByOrder(objA) === stringifyByOrder(objB)
}

export function responseJson(req, res, code, json) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json),
  })
  res.write(json)
  res.end()
}
