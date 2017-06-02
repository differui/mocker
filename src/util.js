import * as cfg from './config'
import pkg from '../package.json'

export function writeResponseSucceed(req, res, data) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Proxy-By': `mocker/${pkg.version}`,
  })
  res.end(JSON.stringify({
    succeeded: true,
    data,
  }, null, 2))
  res[cfg.get('close_switch_name')] = true
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
  res[cfg.get('close_switch_name')] = true
}
