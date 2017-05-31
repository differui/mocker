import { createProxyServer } from 'http-proxy'

const proxy = createProxyServer({
  target: 'http://fc-loan-pocket-money-gateway.k8s.test:8080',
  changeOrigin: true,
})

export default proxy
