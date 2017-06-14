import test from 'ava'
import {
  isSameJson,
  createRequest,
  createRecordServer,
  createGatewayServer,
  closeRecordServer,
  closeGatewayServer,
} from './helpers'

test.beforeEach(t => {
  createRecordServer()
  createGatewayServer()
})

test.afterEach.always('Close servers', t => {
  closeRecordServer()
  closeGatewayServer()
})

test('should response from gateway server', async t => {
  const acutalA = await createRequest({ path: '/gateway/a', method: 'GET' })
  const acutalB = await createRequest({ path: '/gateway/b', method: 'GET' })
  const expectA = { url: '/gateway/a' }
  const expectB = { url: '/gateway/b' }

  t.true(isSameJson(acutalA.response.body, expectA))
  t.true(isSameJson(acutalB.response.body, expectB))
})
