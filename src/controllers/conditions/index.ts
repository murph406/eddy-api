import { use } from '../../middleware'
import { ok } from '../../utils/response'

const handler = async () => {
    const message = 'FISHY'

    return ok({ message })
}


exports.handler = use()(handler)