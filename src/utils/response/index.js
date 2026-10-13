
const buildResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})

const response = (success, payload) => ({
  success,
  timestamp: new Date().toISOString(),
  dataYear: '2026',
  ...payload
})

// 2xx
const ok = (data) => buildResponse(200, response(true, { data }))
const created = (data) => buildResponse(201, response(true, { data }))
const accepted = (data) => buildResponse(202, response(true, { data }))
const noContent = () => ({ statusCode: 204, headers: { 'Content-Type': 'application/json' }, body: '' })

// 4xx
const badRequest = (message) => buildResponse(400, response(false, { error: message }))
const unauthorized = (message = 'Unauthorized') => buildResponse(401, response(false, { error: message }))
const forbidden = (message = 'Forbidden') => buildResponse(403, response(false, { error: message }))
const notFound = (message = 'Not found') => buildResponse(404, response(false, { error: message }))
const conflict = (message) => buildResponse(409, response(false, { error: message }))
const unprocessable = (message) => buildResponse(422, response(false, { error: message }))

// 5xx
const serverError = (message = 'Internal server error') => buildResponse(500, response(false, { error: message }))

module.exports = {
  ok,
  created,
  accepted,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  serverError
}