import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { unauthorized } from '../utils/response'

interface AuthBody {
  secret?: string
}

const basicAuth = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  if (!event.httpMethod) return

  const body: AuthBody = JSON.parse(event.body || '{}')
  if (body.secret !== process.env.BASIC_AUTH_SECRET) return unauthorized()
}

export default basicAuth