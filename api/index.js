// import server from '../dist/server/index.mjs'

// export default async function handler(req, res) {
//   const url = `https://${req.headers.host}${req.url}`
//   const request = new Request(url, {
//     method: req.method,
//     headers: req.headers,
//   })

//   const response = await server.fetch(request)

//   res.statusCode = response.status
//   response.headers.forEach((value, key) => res.setHeader(key, value))

//   const body = await response.text()
//   res.end(body)
// }
import handler from '../dist/server/server.js'

export default async function (req, res) {
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