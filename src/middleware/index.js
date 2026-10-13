const use = (...middlewares) => (handler) => async (event, context) => {
  for (const middleware of middlewares) {
    const result = await middleware(event, context)
    if (result) return result
  }
  return handler(event, context)
}

const basicAuth = require('./basicAuth')
const logger = require('./logger')
const recaptcha = require('./recaptcha')
const validate = require('./validate')

module.exports = { use, logger, recaptcha, validate, basicAuth }