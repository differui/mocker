import { resolve } from 'path'
import { green, yellow, red, white, bold, cyan } from 'colors'
import boxen from 'boxen'
import * as cfg from './config'

export function log(...args) {
  if (process.env.NODE_ENV === 'production') {
    console.log(...args)
  }
}

export function logRequest(type, req) {
  log(white(`${type} ${req.method} ${resolve('/', req.url)}`))
}

export function proxy(req) {
  logRequest(yellow(' Proxy'), req)
}

export function replay(jsonPath, req, res) {
  log(`${bold(green('Replay'))} ${res.statusCode} ${jsonPath}`)
}

export function record(jsonPath, req, res) {
  log(`${bold(cyan('Record'))} ${res.statusCode} ${jsonPath}`)
}

export function error(e, req) {
  log(` ${bold(red('Error'))} ${e.message} ${resolve('/', req.url)}`)
}

export function summary(config) {
  const port = cfg.get('port')
  const server = cfg.get('server')
  const recordDir = cfg.get('record_dir')
  const replay = cfg.get('replay')
  const verbose = cfg.get('verbose')
  let message = ''

  message += green('Mocking!\n')
  message += '\n'
  message += `${bold('- Local:   ')}http://localhost:${port}\n`
  message += `${bold('- Porxy:   ')}${server}\n`
  message += `${bold('- Config:  ')}${config || red('OFF')}\n`
  message += `${bold('- Record:  ')}${recordDir || red('OFF')}\n`
  message += `${bold('- Replay:  ')}${replay ? green('ON') : red('OFF')}\n`
  message += `${bold('- Verbose: ')}${verbose ? green('ON') : red('OFF')}`

  log(boxen(message, {
    padding: 1,
    borderStyle: 'single',
    borderColor: 'green',
  }))
}
