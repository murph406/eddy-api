import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import axios from 'axios'

import { badRequest, forbidden } from '../utils/response'

interface RecaptchaBody {
    recaptchaToken?: string
}

interface RecaptchaVerifyResponse {
    success: boolean
    score?: number   
    action?: string     
    challenge_ts?: string
    hostname?: string
    'error-codes'?: string[]
}

const recaptcha = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
    if (process.env.RecaptchaEnabled === 'false') return

    const { recaptchaToken }: RecaptchaBody = JSON.parse(event.body || '{}')
    if (!recaptchaToken) return badRequest('Missing recaptcha token')

    const { data } = await axios.post<RecaptchaVerifyResponse>(
        'https://www.google.com/recaptcha/api/siteverify',
        new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET ?? '',
            response: recaptchaToken
        })
    )

    const threshold = parseFloat(process.env.RecaptchaThreshold ?? '0.5')

    if (!data.success || (data.score ?? 0) < threshold) {
        return forbidden('Recaptcha failed')
    }
}

export default recaptcha