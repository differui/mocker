import cfg from './config.json'
import pkg from '../package.json'

export function parseBody(req) {
  let body = ''

  return new Promise((resolve, reject) => {
    req.on('data', (d) => { body += d })
    req.on('end', () => resolve(body))
    req.on('error', e => reject(e))
  })
}

export function writeResponseSucceed(req, res, data) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Proxy-By': `mocker/${pkg.version}`,
  })
  res.end(JSON.stringify({
    succeeded: true,
    data,
  }, null, 2))
  res[cfg.close_switch_name] = true
}

export function writeResponseFailed(req, res, message) {
  res.writeHead(400, {
    'Content-Type': 'application/json',
    'X-Proxy-By': `mocker/${pkg.version}`,
  })
  res.end(JSON.stringify({
    succeeded: false,
    message,
  }, null, 2))
  res[cfg.close_switch_name] = true
}
