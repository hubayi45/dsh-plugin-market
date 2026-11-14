#!/usr/bin/env node
/**
 * Zero-dependency static server for local preview of the index.
 *
 * Usage: node scripts/serve.mjs [port]   (default 8899)
 * Then add http://127.0.0.1:8899/index.json as an index source in
 * Plugins -> Discover -> Index sources.
 */
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = process.cwd()
const port = Number(process.argv[2] ?? 8899)
const types = new Map([
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
])

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')
  const requested = decodeURIComponent(url.pathname)
  const target = normalize(join(root, requested === '/' ? '/index.json' : requested))
  if (target !== root && !target.startsWith(root)) {
    response.writeHead(403).end('forbidden')
    return
  }
  try {
    const body = await readFile(target)
    response.writeHead(200, {
      'content-type': types.get(extname(target)) ?? 'application/octet-stream',
      'cache-control': 'no-store',
    })
    response.end(body)
  } catch {
    response.writeHead(404).end('not found')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`serving ${root} at http://127.0.0.1:${port}/index.json`)
})
