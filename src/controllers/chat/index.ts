import type { APIGatewayProxyEvent } from 'aws-lambda'

import PROMPT from './prompt'
import { ChatRequest, OllamaChatResponse } from './types'
import { use } from '../../middleware'
import { ok, serverError } from '../../utils/response'
import { getOllamaApiKey } from '../../utils/secrets'

const OLLAMA_URL = process.env.OLLAMA_URL
if (!OLLAMA_URL) throw new Error('OLLAMA_URL is not set')

const handler = async (event: APIGatewayProxyEvent) => {
    const { message } = event.body as unknown as ChatRequest

    try {
        const apiKey = await getOllamaApiKey()

        const res = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                model: 'llama3.1:8b',
                stream: false,
                messages: [
                    { role: 'system', content: PROMPT },
                    { role: 'user', content: `Message: ${message}` },
                ],
            }),
            signal: AbortSignal.timeout(25000),
        })

        if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
        const data = (await res.json()) as OllamaChatResponse

        return ok({ message: data.message.content })
    } catch (err) {
        console.error('AI unavailable', err)

        return serverError('AI unavailable')
    }
}

exports.handler = use()(handler)