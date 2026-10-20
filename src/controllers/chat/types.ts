export interface ChatRequest {
    message: string
}

export interface OllamaChatResponse {
    model: string
    message: { role: 'assistant'; content: string }
    done: boolean
}