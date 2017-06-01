import { resolve } from 'path'
import { green, gray, white } from 'colors'

export function mock(req) {
  console.log(green(`Mock: ${req.method} ${resolve('/', req.url)}`))
}

export function proxy(req) {
  console.log(gray(`Proxy: ${req.method} ${resolve('/', req.url)}`))
}
