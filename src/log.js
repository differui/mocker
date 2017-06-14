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

export function replay(req, res) {
  log(`${bold(green('Replay'))} ${res.statusCode} ${req.url}`)
}

export function record(req, res) {
  log(`${bold(cyan('Record'))} ${res.statusCode} ${req.url}`)
}

export function error(e, req) {
  log(` ${bold(red('Error'))} ${e.message} ${resolve('/', req.url)}`)
}

export function summary() {
  const port = cfg.get('port')
  const target = cfg.get('proxy').target
  const recordDir = cfg.get('record_dir')
  const replayDir = cfg.get('replay_dir')
  const verbose = cfg.get('verbose')
  let message = ''

  message += green('rnr is running!\n')
  message += '\n'
  message += `${bold('- Local:   ')}http://localhost:${port}\n`
  message += `${bold('- Porxy:   ')}${target}\n`
  message += `${bold('- Record:  ')}${recordDir || red('OFF')}\n`
  message += `${bold('- Replay:  ')}${replayDir || red('OFF')}\n`
  message += `${bold('- Verbose: ')}${verbose ? green('ON') : red('OFF')}`

  log(boxen(message, {
    padding: 1,
    borderStyle: 'single',
    borderColor: 'green',
  }))
}
