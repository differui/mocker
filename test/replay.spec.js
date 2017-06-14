import test from 'ava'
import rimraf from 'rimraf'
import { resolve as resolvePath } from 'path'
import {
  isSameJson,
  createRequest,
  createRecordServer,
  createGatewayServer,
  closeRecordServer,
  closeGatewayServer,
} from './helpers'
import * as cfg from '../src/config'

const recordDir = resolvePath(process.cwd(), 'test', cfg.get('record_dir_name'))

test.beforeEach(t => {
  createRecordServer({
    record: true,
    replay: true,
    record_dir: recordDir,
    replay_dir: recordDir,
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

test('should replay records', async t => {
  const expectA = { url: '/gateway/a' }
  const expectB = { url: '/gateway/b' }
  const actualBeforeA = await createRequest({ path: '/gateway/a', method: 'PUT' }, templateA)
  const actualBeforeB = await createRequest({ path: '/gateway/b', method: 'PUT' }, templateB)

  closeGatewayServer()

  const actualAfterA = await createRequest({ path: '/gateway/a', method: 'PUT' }, templateA)
  const actualAfterB = await createRequest({ path: '/gateway/b', method: 'PUT' }, templateB)

  t.true(isSameJson(actualBeforeA.response.body, expectA))
  t.true(isSameJson(actualBeforeB.response.body, expectB))
  t.true(isSameJson(actualAfterA.response.body, expectA))
  t.true(isSameJson(actualAfterB.response.body, expectB))
})
