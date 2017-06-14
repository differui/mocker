import { stringifyByOrder } from '../../src/util'

export function isSameJson(a, b) {
  const objA = typeof a === 'string' ? JSON.parse(a) : a
  const objB = typeof b === 'string' ? JSON.parse(b) : b

  return stringifyByOrder(objA) === stringifyByOrder(objB)
}

export function concatBody(body) {
  const data = body.reduce((rtn, d) => rtn.concat(d[0].data), [])

  return new Buffer(data).toString()
}
