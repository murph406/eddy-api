import type { APIGatewayProxyResult } from 'aws-lambda'

export interface ApiSuccess<T> {
  success: true
  timestamp: string
  dataYear: string
  data: T
}

export interface ApiError {
  success: false
  timestamp: string
  dataYear: string
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

const buildResponse = (statusCode: number, body: ApiResponse<unknown>): APIGatewayProxyResult => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  statusCode
})

const success = <T>(data: T): ApiSuccess<T> => ({
  success: true,
  timestamp: new Date().toISOString(),
  dataYear: '2026',
  data
})

const failure = (error: string): ApiError => ({
  success: false,
  timestamp: new Date().toISOString(),
  dataYear: '2026',
  error
})

// 2xx
export const ok = <T>(data: T) => buildResponse(200, success(data))
export const created = <T>(data: T) => buildResponse(201, success(data))
export const accepted = <T>(data: T) => buildResponse(202, success(data))
export const noContent = (): APIGatewayProxyResult => ({
  statusCode: 204,
  headers: { 'Content-Type': 'application/json' },
  body: ''
})
 
// 4xx
export const badRequest = (message: string) => buildResponse(400, failure(message))
export const unauthorized = (message = 'Unauthorized') => buildResponse(401, failure(message))
export const forbidden = (message = 'Forbidden') => buildResponse(403, failure(message))
export const notFound = (message = 'Not found') => buildResponse(404, failure(message))
export const conflict = (message: string) => buildResponse(409, failure(message))
export const unprocessable = (message: string) => buildResponse(422, failure(message))
 
// 5xx
export const serverError = (message = 'Internal server error') => buildResponse(500, failure(message))
 