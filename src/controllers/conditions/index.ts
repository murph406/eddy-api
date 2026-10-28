import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import { use } from '@/middleware'
import { ok } from '@/utils/response'
import { isLocal } from '@/utils/vars'

const databaseFunctionName = isLocal
    ? 'DatabaseFunction'
    : `${process.env.PROJECT}-${process.env.STAGE}-DatabaseFunction`

const lambda = new LambdaClient(
    isLocal
        ? { endpoint: 'http://host.docker.internal:3001' }
        : {}
)

const handler = async () => {
    const res = await lambda.send(
        new InvokeCommand({
            FunctionName: databaseFunctionName,
            Payload: Buffer.from(JSON.stringify({})),
        })
    )

    const raw = res.Payload?.transformToString() ?? '{}'
    const result = JSON.parse(raw)
    const { data } = JSON.parse(result.body)

    return ok({ message: data?.message })
}


exports.handler = use()(handler)