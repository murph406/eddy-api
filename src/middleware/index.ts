import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

export type Middleware = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult | undefined | void>
export type Handler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>

export const use = (...middlewares: Middleware[]) => (handler: Handler): Handler => async (event, context) => {

  try {
    event.body = event.body ? JSON.parse(event.body) : {}
  } catch {
    event.body = null
  }

  for (const middleware of middlewares) {
    const result = await middleware(event, context)
    if (result) return result
  }

  return handler(event, context)
}

export { default as basicAuth } from './basicAuth'
export { default as logger } from './logger'
export { default as recaptcha } from './recaptcha'
export { default as validate } from './validate'