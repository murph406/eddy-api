import { use } from '@/middleware'
import { ok } from '@/utils/response'

const handler = async () => {
    const message = `Something Smells Fishy on ${process.env.STAGE}! DB_HOST=${process.env.DB_HOST}`

    return ok({ message })
}


exports.handler = use()(handler)