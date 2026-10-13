const { unauthorized } = require('../utils/response')

const basicAuth = async (event) => {
    if (!event.httpMethod) return
    const body = JSON.parse(event.body || '{}')
    if (body?.secret !== process.env.BASIC_AUTH_SECRET) return unauthorized()
}

module.exports = basicAuth