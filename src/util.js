export function hasOwn(obj, key) {
  return (obj.hasOwnProperty || Object.prototype.hasOwnProperty).call(obj, key)
}

export function stringifyRequest(req) {
  const { httpVersion, method, url, headers, body } = req
  const message = [
    `${method} ${url} HTTP/${httpVersion}`,
    ...Object.keys(headers || {}).sort().map(k => `${k}: ${headers[k]}`),
    '',
  ]

  if (body) {
    message.push(JSON.stringify(body))
    message.push('')
  }

  return message.join('\n')
}

export function stringifyByOrder(obj, ident = 0) {
  const replacer = (key, value) => {
    if (value && (typeof value === 'object') && !Array.isArray(value)) {
      const rtn = {}

      Object.keys(value).sort().forEach((subKey) => {
        rtn[subKey] = value[subKey]
      })
      return rtn
    }

    return value
  }

  return JSON.stringify(obj, replacer, ident)
}

export function convertRawHeaders(rawHeader) {
  const headers = {}
  const pair = []

  rawHeader.forEach((i) => {
    pair.push(i)
    if (pair.length === 2) {
      headers[pair[0]] = pair[1]
      pair.length = 0
    }
  })

  return headers
}

export function parseBody(message) {
  const body = []

  return new Promise((resolve, reject) => {
    message.on('data', c => body.push(c))
    message.on('end', () => resolve(body))
    message.on('error', err => reject(err))
  })
}

export function stringifyBody(body) {
  return new Buffer(body[0]).toString()
}
