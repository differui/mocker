import { resolve } from 'path'
import { green, gray, white } from 'colors'

export function mock(req) {
  console.log(green(`Mock: ${resolve('/', req.url)}`))
}

export function proxy(req) {
  console.log(gray(`Proxy: ${resolve('/', req.url)}`))
}
