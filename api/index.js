import handler from '../dist/server/server.js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { lookup } from 'mime-types'

export default async function (req, res) {
  // Serve static assets directly
  if (req.url.startsWith('/assets/')) {
    const filePath = join(process.cwd(), 'dist/client', req.url)
    if (existsSync(filePath)) {
      const mimeType = lookup(filePath) || 'application/octet-stream'
      res.setHeader('Content-Type', mimeType)
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      res.end(readFileSync(filePath))
      return
    }
  }

  const url = `https://${req.headers.host}${req.url}`
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
  })
  const response = await handler.fetch(request)
  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  const body = await response.text()
  res.end(body)
}
