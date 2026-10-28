import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import { isLocal } from '@/utils/vars'

const functionName = isLocal
    ? 'DatabaseFunction'
    : `${process.env.PROJECT}-${process.env.STAGE}-DatabaseFunction`

const lambda = new LambdaClient(
    isLocal ? { endpoint: 'http://host.docker.internal:3001' } : {}
)

const database = async (action: string, payload: object) => {
    const res = await lambda.send(
        new InvokeCommand({
            FunctionName: functionName,
            Payload: Buffer.from(JSON.stringify({ action, payload })),
        })
    )

    const raw = res.Payload?.transformToString() ?? '{}'
    const result = JSON.parse(raw)

    if (res.FunctionError) throw new Error(`DatabaseFunction failed: ${result.errorMessage}`)
    return JSON.parse(result.body).data
}

export default database