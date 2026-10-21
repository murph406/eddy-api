import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

const ssm = new SSMClient({})

export const getParameter = async (name: string): Promise<string> => {
    const res = await ssm.send(new GetParameterCommand({ Name: name, WithDecryption: true }))
    const value = res.Parameter?.Value

    if (!value) throw new Error(`Parameter ${name} has no value`)
    return value
}

export const getOllamaApiKey = (): Promise<string> => {
    const name = process.env.OLLAMA_API_KEY_PARAM
    if (!name) throw new Error('OLLAMA_API_KEY_PARAM is not set')

    return getParameter(name)
}