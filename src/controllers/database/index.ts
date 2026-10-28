import * as yup from 'yup'

import actions from '@/database/actions'
import { use } from '@/middleware'
import { ok } from '@/utils/response'

const eventSchema = yup.object({
    action: yup.string().required(),
    payload: yup.object().required(),
})

const handler = async (event: unknown) => {
    const { action, payload } = await eventSchema.validate(event)
    const run = actions[action]

    if (!run) throw new Error(`Unknown action: ${action}`)
    const data = await run(payload)

    return ok(data)
}


exports.handler = use()(handler)