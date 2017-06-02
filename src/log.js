import { resolve } from 'path'
import { green, gray, yellow, red, white, bold, cyan } from 'colors'
import boxen from 'boxen'
import * as cfg from './config'

function logRequest(type, req) {
  console.log(white(`${type} ${req.method} ${resolve('/', req.url)}`))
}

export function mock(req) {
  logRequest(green('  Mock'), req)
}

export function proxy(req, res) {
  logRequest(yellow(' Proxy'), req)
}

export function record(jsonPath) {
  console.log(`${bold(cyan('Record'))} ${jsonPath}`)
}

export function error(e, req) {
  console.log(` ${bold(red('Error'))} ${e.message} ${resolve('/', req.url)}`)
}

export function summary(config) {
  const port = cfg.get('port')
  const target = cfg.get('proxy').target
  const recordRoot = cfg.get('record').root
  const verbose = cfg.get('verbose')
  let message = ''

  message += green('Mocking!\n')
  message += '\n'
  message += `${bold('- Local:   ')}http://localhost:${port}\n`
  message += `${bold('- Porxy:   ')}${target}\n`
  message += `${bold('- Config:  ')}${config || red('OFF')}\n`
  message += `${bold('- Record:  ')}${recordRoot || red('OFF')}\n`
  message += `${bold('- Verbose: ')}${verbose ? green('ON') : red('OFF')}`

  console.log(boxen(message, {
    padding: 1,
    borderStyle: 'single',
    borderColor: 'green',
  }))
}
