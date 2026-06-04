import { spawn } from 'node:child_process'
import http from 'node:http'
import httpProxy from 'http-proxy'

const API_TARGET = process.env.EXPO_PUBLIC_API_URL ?? 'https://1chooo.com'
const EXPO_PORT = 19007
const WEB_PORT = 8081

const DEV_ORIGINS = [
  `http://localhost:${WEB_PORT}`,
  `http://127.0.0.1:${WEB_PORT}`,
  `http://localhost:${EXPO_PORT}`,
  `http://127.0.0.1:${EXPO_PORT}`,
]

const proxy = httpProxy.createProxyServer({})

function applyCors(req, res) {
  const origin = req.headers.origin
  if (origin && DEV_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  }
}

proxy.on('proxyRes', (proxyRes, req, res) => {
  if (req.url?.startsWith('/api/')) {
    applyCors(req, res)
  }
})

const server = http.createServer((req, res) => {
  applyCors(req, res)

  if (req.method === 'OPTIONS' && req.url?.startsWith('/api/')) {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url?.startsWith('/api/')) {
    proxy.web(req, res, { target: API_TARGET, changeOrigin: true })
    return
  }

  proxy.web(req, res, { target: `http://127.0.0.1:${EXPO_PORT}`, changeOrigin: true })
})

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: `http://127.0.0.1:${EXPO_PORT}` })
})

proxy.on('error', (_err, _req, res) => {
  if (res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end('Proxy error')
  }
})

server.listen(WEB_PORT, () => {
  console.log('')
  console.log(`  App + API proxy: http://localhost:${WEB_PORT}`)
  console.log(`  (Expo runs internally on ${EXPO_PORT}; open ${WEB_PORT} in your browser)`)
  console.log('')
})

const expo = spawn(
  'pnpm',
  ['exec', 'expo', 'start', '--web', '--port', String(EXPO_PORT)],
  {
    stdio: 'inherit',
    env: { ...process.env, EXPO_NO_WEB_BROWSER: '1', BROWSER: 'none' },
    shell: true,
  },
)

function shutdown() {
  expo.kill('SIGTERM')
  server.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

expo.on('exit', (code) => {
  server.close()
  process.exit(code ?? 0)
})
