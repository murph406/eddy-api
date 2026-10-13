const { use } = require('../../middleware')
const { ok } = require('../../utils/response')

const handler = async () => {
    const message = '🔥🔥🔥🔥🔥🔥'

    return ok({ message })
}


exports.handler = use()(handler)