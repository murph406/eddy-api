import { use } from '../../middleware'
import { ok } from '../../utils/response'

const handler = async () => {
    const message = 'THE DB IS HERE'

    return ok({ message })
}


exports.handler = use()(handler)