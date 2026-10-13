const axios = require('axios')

const { badRequest, forbidden } = require('../utils/response')

const recaptcha = async (event) => {
    if (process.env.RecaptchaEnabled === 'false') return

    const { recaptchaToken } = JSON.parse(event.body || '{}')

    if (!recaptchaToken) return badRequest({ error: 'Missing recaptcha token' })

    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', {
        secret: process.env.RecaptchaSecret,
        response: recaptchaToken
    })

    if (!data.success || data.score < parseFloat(process.env.RecaptchaThreshold)) return forbidden({ error: 'Recaptcha failed' })
}

module.exports = recaptcha