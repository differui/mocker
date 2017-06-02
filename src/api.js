import { resolve } from 'path'
import * as mock from './mock'
import * as util from './util'

export default function api(req, res) {
  const url = resolve('/', req.url)
  const method = req.method

  if (method === 'GET' && (url === '/' || url === '/templates')) {
    util.writeResponseSucceed(req, res, mock.getTpls())
  } else if (method === 'GET' && url === '/templates/download') {
    const d = new Date()
    const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

    res.setHeader('Content-Disposition', `attachment; filename=mock_${dateStr}`)
    util.writeResponseSucceed(req, res, mock.getTpls())
  } else if (method === 'PUT' && url === '/templates/upload') {
    try {
      mock.overrideTpls(req.body)
      util.writeResponseSucceed(req, res, mock.getTpls())
    } catch (e) {
      util.writeResponseFailed(req, res, e.message)
    }
  } else if (url.indexOf('/templates/') === 0) {
    const u = url.substring('/templates/'.length - 1)

    switch (method) {
      case 'PUT':
        try {
          mock.createOrUpdateTpl(u, req.body)
          util.writeResponseSucceed(req, res, {
            [u]: mock.getTpls()[u],
          })
        } catch (e) {
          util.writeResponseFailed(req, res, e.message)
        }
        break
      case 'DELETE':
        try {
          mock.removeTpl(u)
          util.writeResponseSucceed(req, res, mock.getTpls())
        } catch (e) {
          util.writeResponseFailed(req, res, e.message)
        }
        break
      default:
    }
  }
}
