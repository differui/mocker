import test from 'ava'
import rimraf from 'rimraf'
import { existsSync, readdirSync } from 'fs'
import { readJsonSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import {
  isSameJson,
  createRequest,
  createRecordServer,
  createGatewayServer,
  closeRecordServer,
  closeGatewayServer,
} from './helpers'
import { createRecordId } from '../src/record'
import * as cfg from '../src/config'
import { stringifyBody } from '../src/util'

const recordDir = resolvePath(process.cwd(), 'test', cfg.get('record_dir_name'))

test.beforeEach(t => {
  createRecordServer({
    record: true,
    record_dir: recordDir,
  })
  createGatewayServer()
})

test.afterEach.always('Close servers', t => {
  closeRecordServer()
  closeGatewayServer()
  rimraf.sync(`${recordDir}/*`)
})

test.after.always('Remove record directory', t => {
  rimraf.sync(recordDir)
})

const templateA = { name: 'a', timestamp: Date.now() }
const templateB = { name: 'b', timestamp: Date.now() }

test('should create recording json file', async t => {
  await createRequest({ path: '/gateway/a', method: 'PUT' }, templateA)

  const expected = { url: '/gateway/a' }
  const files = readdirSync(recordDir)
  let json = readJsonSync(resolvePath(recordDir, files[0]))

  // request
  t.true(json.request.url === '/gateway/a')
  t.true(isSameJson(stringifyBody(json.request.body), templateA))

  // response
  t.true(json.response.statusCode === 200)
  t.true(isSameJson(stringifyBody(json.response.body), expected))
})

test('should create same recording json file', async t => {
  await createRequest({ path: '/gateway/a', method: 'PUT' }, templateA)
  await createRequest({ path: '/gateway/a', method: 'PUT' }, templateA)

  t.true(readdirSync(recordDir).length === 1)
})

test('should create different recording json files', async t => {
  await createRequest({ path: '/gateway/a', method: 'PUT' }, templateA)
  await createRequest({ path: '/gateway/b', method: 'PUT' }, templateB)

  t.true(readdirSync(recordDir).length === 2)
})
