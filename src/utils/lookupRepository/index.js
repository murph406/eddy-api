import { readJSON as localRead, writeJSON as localWrite, invalidate as localInvalidate } from './local.js'
import { readJSON as s3Read, writeJSON as s3Write, invalidate as s3Invalidate } from './s3.js'

const isLocal = process.env.STAGE === 'local'
export const readJSON = isLocal ? localRead : s3Read
export const writeJSON = isLocal ? localWrite : s3Write
export const invalidate = isLocal ? localInvalidate : s3Invalidate