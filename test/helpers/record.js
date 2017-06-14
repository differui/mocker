import { createServer } from '../../'
import cfg from './config'

let server

export function createRecordServer(opts = {}) {
  if (server) {
    throw 'Record server was created'
  }
  opts.port = cfg.mock_server_port
  opts.server = `http://localhost:${cfg.gateway_server_port}`
  server = createServer(opts)
  return server
}

export function closeRecordServer() {
  if (server) {
    server.close()
    server = null
  }
}
