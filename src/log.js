import { resolve } from 'path'
import { green, gray, yellow, red, white, bold } from 'colors'
import boxen from 'boxen'
import * as cfg from './config'

function logRequest(type, req) {
  console.log(white(`${type}: ${req.method} ${resolve('/', req.url)}`))
}

function logResponse(type, req, res) {
  console.log(gray(`${' '.repeat(type.length + 2)}${res.statusCode} ${resolve('/', req.url)}`))
}

export function mock(req, res) {
  if (!res) {
    logRequest(green(' Mock'), req)
  } else {
    logResponse(' Mock', req, res)
  }
}

export function proxy(req, res) {
  if (!res) {
    logRequest(yellow('Proxy'), req)
  } else {
    logResponse('Proxy', req, res)
  }
}

export function error(e, req) {
  console.log(`    ${bold(red(e.message))} ${resolve('/', req.url)}`)
}

export function summary(config) {
  const port = cfg.get('port')
  const target = cfg.get('proxy').target
  const verbose = cfg.get('verbose')
  let message = ''

  message += green('Mocking!\n')
  message += '\n'
  message += `${bold('- Local:   ')}http://localhost:${port}\n`
  message += `${bold('- Porxy:   ')}${target}\n`
  message += `${bold('- Config:  ')}${config || red('OFF')}\n`
  message += `${bold('- Verbose: ')}${verbose ? green('ON') : red('OFF')}`

  console.log(boxen(message, {
    padding: 1,
    borderStyle: 'single',
    borderColor: 'green',
  }))
}
