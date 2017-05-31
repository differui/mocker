import cache from 'memory-cache'
import { resolve as pathResolve } from 'path'
import { mock as render } from 'mockjs'
import * as util from './util'

export function mock(req, res) {
  return new Promise((resolve, reject) => {
    const url = pathResolve('/', req.url)
    const tpl = cache.get(url)

    if (tpl) {
      util.writeResponseSucceed(req, res, render(tpl))
    }

    resolve()
  })
}

export function createOrUpdateTpl(url, tpl) {
  try {
    cache.put(url, JSON.parse(tpl))
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
  return cache.keys().reduce((rtn, url) => {
    rtn[url] = cache.get(url)
    return rtn
  }, {})
}

export function overrideTpls(tpls) {
  const t = JSON.parse(tpls)

  cache.clear()
  Object.keys(JSON.parse(tpls)).forEach(url => createOrUpdateTpl(url, JSON.stringify(t[url])))
}
