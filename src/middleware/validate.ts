import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ValidationError, type AnyObjectSchema } from 'yup'

import { badRequest } from '../utils/response'

const validate =
  (schema: AnyObjectSchema) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
      let body: unknown
      try {
        body = JSON.parse(event.body || '{}')
      } catch {
        return badRequest('Invalid JSON')
      }

      try {
        await schema.validate(body, {
          abortEarly: false,
          strict: true
        })
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err

        return badRequest(err.errors.join(', '))
      }
    }

export default validate