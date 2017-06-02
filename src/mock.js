import cache from 'memory-cache'
import { resolve as pathResolve } from 'path'
import pkg from '../package.json'
import * as log from './log'
import * as cfg from './config'

export function mock(req, res) {
  return new Promise((resolve) => {
    const url = pathResolve('/', req.url)
    const tpl = cache.get(url)

    if (tpl) {
      log.mock(req)
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Proxy-By': `mocker/${pkg.version}`,
      })
      res.end(JSON.stringify(tpl))
      res[cfg.get('close_switch_name')] = true
      log.mock(req, res)
    }

    resolve()
  })
}

export function createOrUpdateTpl(url, tpl) {
  try {
    let theTpl = tpl

    if (typeof theTpl !== 'string') {
      theTpl = JSON.stringify(theTpl)
    }
    cache.put(url, JSON.parse(theTpl))
  } catch (e) {
    throw new Error(`Can not create or update template: ${url}`)
  }
}

export function removeTpl(url) {
  if (cache.get(url) !== null) {
    cache.del(url)
  } else {
    throw new Error(`Can not found template: ${url}`)
  }
}

export function getTpls() {
  return cache.keys().reduce((rtn, url) => Object.assign({
    [url]: cache.get(url),
  }, rtn), {})
}

export function overrideTpls(tpls) {
  let theTpls = tpls

  if (typeof theTpls !== 'string') {
    theTpls = JSON.stringify(theTpls)
  }

  cache.clear()
  theTpls = JSON.parse(theTpls)
  Object.keys(theTpls).forEach(url => createOrUpdateTpl(url, theTpls[url]))
}
