export function hasOwn(obj, key) {
  return (obj.hasOwnProperty || Object.prototype.hasOwnProperty).call(obj, key)
}

export function responseJson(req, res, code, json) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json),
  })
  res.write(json)
  res.end()
}

export function responseSucceed(req, res, data) {
  const json = JSON.stringify({
    succeeded: true,
    data,
  }, null, 2)

  responseJson(req, res, 200, json)
}

export function responseFailed(req, res, message) {
  const json = JSON.stringify({
    succeeded: false,
    message,
  }, null, 2)

  responseJson(req, res, 400, json)
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
