import type { APIGatewayProxyEvent, Context } from 'aws-lambda'

const logger = async (event: APIGatewayProxyEvent, context: Context): Promise<void> => {
  console.log('\nEVENT::', event, '\n')
  console.log('\nCONTEXT::', context, '\n')
}

export default logger